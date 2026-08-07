import Stripe from "stripe";
import { httpAction } from "./_generated/server";
import type { ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { shouldProcessWebhookEvent } from "./lib/webhookIdempotency";
import { parseV2ConnectAccountStatus } from "./lib/stripeConnectMerchant";

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  return new Stripe(secretKey);
}

function getWebhookSecret() {
  return (
    process.env.STRIPE_CONNECT_WEBHOOK_SECRET ??
    process.env.STRIPE_WEBHOOK_SECRET
  );
}

function getPaymentIntentIdFromCharge(charge: Stripe.Charge) {
  return typeof charge.payment_intent === "string"
    ? charge.payment_intent
    : charge.payment_intent?.id;
}

type InvoiceWithSubscription = Stripe.Invoice & {
  subscription?: string | Stripe.Subscription | null;
  payment_intent?: string | Stripe.PaymentIntent | null;
};

function getSubscriptionIdFromInvoice(invoice: InvoiceWithSubscription) {
  return typeof invoice.subscription === "string"
    ? invoice.subscription
    : invoice.subscription?.id;
}

function getPaymentIntentIdFromInvoice(invoice: InvoiceWithSubscription) {
  return typeof invoice.payment_intent === "string"
    ? invoice.payment_intent
    : invoice.payment_intent?.id;
}

/** Cancels a society subscription right before Stripe would otherwise charge
 * it — the primary defense against billing a donor for a society with no
 * active campaigns. See stripe.refundAndCancelSocietySubscriptionForNoCampaigns
 * for the invoice.paid safety net behind this. */
async function preemptSocietySubscriptionIfNoActiveCampaigns(
  ctx: ActionCtx,
  stripe: Stripe,
  subscriptionId: string,
) {
  const societySubscription = await ctx.runQuery(
    internal.stripeInternal.getSocietySubscriptionBySubscriptionId,
    { stripeSubscriptionId: subscriptionId },
  );
  if (!societySubscription || societySubscription.status === "canceled") {
    return;
  }

  const activeCampaigns = await ctx.runQuery(
    internal.stripeInternal.getActiveCampaignsForCommunity,
    { communitySlug: societySubscription.communitySlug },
  );
  if (activeCampaigns.length > 0) {
    return;
  }

  const connect = await ctx.runQuery(
    internal.stripeInternal.getConnectAccountIdForCommunity,
    { communitySlug: societySubscription.communitySlug },
  );
  try {
    if (connect?.stripeAccountId) {
      await stripe.subscriptions.cancel(
        subscriptionId,
        {},
        { stripeAccount: connect.stripeAccountId },
      );
    } else {
      await stripe.subscriptions.cancel(subscriptionId);
    }
  } catch {
    // Already canceled/missing on Stripe's side — still reconcile our record below.
  }

  await ctx.runMutation(internal.stripeInternal.cancelSocietySubscriptionRecord, {
    stripeSubscriptionId: subscriptionId,
    reason: "no_active_campaigns",
  });
  await ctx.runMutation(internal.stripeInternal.notifySocietySubscriptionCanceled, {
    societySubscriptionId: societySubscription._id,
    charged: false,
    amount: societySubscription.amount,
  });
}

async function refundApplicationFeeDelta(
  stripe: Stripe,
  charge: Stripe.Charge,
  applicationFeeRefundMinor: number,
) {
  if (applicationFeeRefundMinor <= 0) {
    return;
  }

  const applicationFeeId =
    typeof charge.application_fee === "string"
      ? charge.application_fee
      : charge.application_fee?.id;
  if (!applicationFeeId) {
    return;
  }

  await stripe.applicationFees.createRefund(applicationFeeId, {
    amount: applicationFeeRefundMinor,
  });
}

async function handleChargeRefunded(
  ctx: ActionCtx,
  stripe: Stripe,
  charge: Stripe.Charge,
  connectedAccountId?: string,
) {
  const paymentIntentId = getPaymentIntentIdFromCharge(charge);
  if (!paymentIntentId) {
    return;
  }

  const donation = await ctx.runQuery(
    internal.stripeInternal.getDonationByPaymentIntentId,
    { stripePaymentIntentId: paymentIntentId },
  );

  if (
    donation?.stripeConnectedAccountId &&
    connectedAccountId &&
    donation.stripeConnectedAccountId !== connectedAccountId
  ) {
    throw new Error("Connected account mismatch for refunded donation.");
  }

  const result: { updated: boolean; applicationFeeRefundMinor: number } =
    await ctx.runMutation(internal.stripeInternal.markDonationRefunded, {
      stripePaymentIntentId: paymentIntentId,
      refundedAmountMinor: charge.amount_refunded,
      isFullRefund: charge.refunded,
    });

  if (result.updated) {
    await refundApplicationFeeDelta(
      stripe,
      charge,
      result.applicationFeeRefundMinor,
    );
  }

  // Closes the loop on an admin-approved refund request executed by the
  // Campaign Owner from their own Stripe dashboard (Refund Policy §6.1) —
  // this fires regardless of who/what triggered the underlying refund, so
  // it works whether or not a refundRequests row exists for this donation.
  if (donation) {
    await ctx.runMutation(internal.refunds.markApprovedRequestRefundedByDonation, {
      donationId: donation._id,
      stripeRefundId: charge.refunds?.data?.[0]?.id,
    });
  }
}

export const stripeWebhook = httpAction(async (ctx, request) => {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header.", { status: 400 });
  }

  const webhookSecret = getWebhookSecret();
  if (!webhookSecret) {
    return new Response("Stripe webhook secret is not configured.", {
      status: 500,
    });
  }

  const payload = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      payload,
      signature,
      webhookSecret,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid webhook signature.";
    return new Response(message, { status: 400 });
  }

  const existingEvent = await ctx.runQuery(
    internal.stripeInternal.getWebhookEvent,
    { stripeEventId: event.id },
  );

  if (!shouldProcessWebhookEvent(existingEvent)) {
    return new Response(JSON.stringify({ received: true, duplicate: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const connectedAccountId =
    typeof event.account === "string" ? event.account : undefined;
  const eventType = event.type as string;

  if (
    eventType === "v2.core.account[configuration.merchant].capability_status_updated" ||
    eventType === "v2.core.account[configuration.merchant].updated"
  ) {
    const account = event.data.object as unknown as Stripe.V2.Core.Account;
    const parsed = parseV2ConnectAccountStatus(account);
    await ctx.runMutation(internal.stripeConnectInternal.updateAccountStatus, {
      stripeAccountId: account.id,
      onboardingComplete: parsed.onboardingComplete,
      cardPaymentsActive: parsed.cardPaymentsActive,
      cardPaymentsStatus: parsed.cardPaymentsStatus,
      chargesEnabled: parsed.cardPaymentsActive,
      payoutsEnabled: parsed.payoutsEnabled,
    });
    await ctx.runMutation(internal.stripeInternal.recordWebhookEvent, {
      stripeEventId: event.id,
      type: event.type,
    });
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // CF-01: fund_one_time / platform-account settlement is removed. Ignore
      // any legacy fund metadata rather than charging or allocating on Dono's account.
      if (paymentIntent.metadata?.donationType === "fund_one_time") {
        break;
      }
      const latestCharge =
        typeof paymentIntent.latest_charge === "string"
          ? paymentIntent.latest_charge
          : paymentIntent.latest_charge?.id;
      await ctx.runMutation(internal.stripeInternal.markDonationSucceeded, {
        stripePaymentIntentId: paymentIntent.id,
        stripeChargeId: latestCharge,
        stripeConnectedAccountId: connectedAccountId,
      });
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await ctx.runMutation(internal.stripeInternal.markDonationFailed, {
        stripePaymentIntentId: paymentIntent.id,
      });
      break;
    }
    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      await handleChargeRefunded(ctx, stripe, charge, connectedAccountId);
      break;
    }
    case "charge.dispute.created": {
      const dispute = event.data.object as Stripe.Dispute;
      const paymentIntentId =
        typeof dispute.payment_intent === "string"
          ? dispute.payment_intent
          : dispute.payment_intent?.id;
      if (paymentIntentId) {
        await ctx.runMutation(internal.stripeInternal.markDonationDisputeOpened, {
          stripePaymentIntentId: paymentIntentId,
        });
      }
      break;
    }
    case "charge.dispute.closed": {
      const dispute = event.data.object as Stripe.Dispute;
      const paymentIntentId =
        typeof dispute.payment_intent === "string"
          ? dispute.payment_intent
          : dispute.payment_intent?.id;
      if (!paymentIntentId) {
        break;
      }

      if (dispute.status === "won") {
        await ctx.runMutation(internal.stripeInternal.markDonationDisputeClosed, {
          stripePaymentIntentId: paymentIntentId,
          status: "won",
        });
        break;
      }

      const charge =
        typeof dispute.charge === "string"
          ? await stripe.charges.retrieve(
              dispute.charge,
              {},
              connectedAccountId ? { stripeAccount: connectedAccountId } : undefined,
            )
          : dispute.charge;

      const result: { updated: boolean; applicationFeeRefundMinor: number } =
        await ctx.runMutation(internal.stripeInternal.markDonationDisputeClosed, {
          stripePaymentIntentId: paymentIntentId,
          status: "lost",
          refundedAmountMinor: charge?.amount_refunded,
          isFullRefund: charge?.refunded ?? false,
        });

      if (charge && result.applicationFeeRefundMinor > 0) {
        await refundApplicationFeeDelta(
          stripe,
          charge,
          result.applicationFeeRefundMinor,
        );
      }
      break;
    }
    case "invoice.upcoming": {
      const invoice = event.data.object as InvoiceWithSubscription;
      const subscriptionId = getSubscriptionIdFromInvoice(invoice);
      if (subscriptionId) {
        await preemptSocietySubscriptionIfNoActiveCampaigns(ctx, stripe, subscriptionId);
      }
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object as InvoiceWithSubscription;
      const subscriptionId = getSubscriptionIdFromInvoice(invoice);

      if (subscriptionId && invoice.id) {
        const societyResult: { applicable: boolean } = await ctx.runMutation(
          internal.stripeInternal.processSuccessfulSocietyInvoice,
          {
            stripeInvoiceId: invoice.id,
            stripeSubscriptionId: subscriptionId,
            totalAmountMinor: invoice.amount_paid ?? 0,
            stripePaymentIntentId: getPaymentIntentIdFromInvoice(invoice),
          },
        );

        if (!societyResult.applicable) {
          await ctx.runMutation(internal.stripeInternal.recordRecurringInvoicePayment, {
            stripeInvoiceId: invoice.id,
            stripeSubscriptionId: subscriptionId,
            amount: (invoice.amount_paid ?? 0) / 100,
          });
        }
      }
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as InvoiceWithSubscription;
      const subscriptionId = getSubscriptionIdFromInvoice(invoice);

      if (subscriptionId) {
        const societyResult: { updated: boolean } = await ctx.runMutation(
          internal.stripeInternal.markSocietySubscriptionPastDue,
          { stripeSubscriptionId: subscriptionId },
        );
        if (!societyResult.updated) {
          await ctx.runMutation(internal.stripeInternal.markRecurringDonationPastDue, {
            stripeSubscriptionId: subscriptionId,
          });
        }
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const societyResult: { updated: boolean } = await ctx.runMutation(
        internal.stripeInternal.cancelSocietySubscriptionRecord,
        { stripeSubscriptionId: subscription.id },
      );
      if (!societyResult.updated) {
        await ctx.runMutation(internal.stripeInternal.cancelRecurringDonationRecord, {
          stripeSubscriptionId: subscription.id,
        });
      }
      break;
    }
    default:
      break;
  }

  await ctx.runMutation(internal.stripeInternal.recordWebhookEvent, {
    stripeEventId: event.id,
    type: event.type,
  });

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
