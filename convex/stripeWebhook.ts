import Stripe from "stripe";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { shouldProcessWebhookEvent } from "./lib/webhookIdempotency";

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  return new Stripe(secretKey);
}

export const stripeWebhook = httpAction(async (ctx, request) => {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header.", { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
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

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      if (paymentIntent.metadata?.donationType === "fund_one_time") {
        await ctx.runMutation(internal.stripeFunds.markFundDonationSucceeded, {
          stripePaymentIntentId: paymentIntent.id,
        });
      } else {
        await ctx.runMutation(internal.stripeInternal.markDonationSucceeded, {
          stripePaymentIntentId: paymentIntent.id,
        });
      }
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
      const paymentIntentId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id;
      if (paymentIntentId) {
        await ctx.runMutation(internal.stripeInternal.markDonationRefunded, {
          stripePaymentIntentId: paymentIntentId,
        });
      }
      break;
    }
    case "charge.dispute.created": {
      const dispute = event.data.object as Stripe.Dispute;
      const paymentIntentId =
        typeof dispute.payment_intent === "string"
          ? dispute.payment_intent
          : dispute.payment_intent?.id;
      if (paymentIntentId) {
        await ctx.runMutation(internal.stripeInternal.markDonationRefunded, {
          stripePaymentIntentId: paymentIntentId,
        });
      }
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice & {
        subscription?: string | Stripe.Subscription | null;
      };
      const subscriptionId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id;

      if (subscriptionId && invoice.id) {
        await ctx.runMutation(internal.stripeInternal.recordRecurringInvoicePayment, {
          stripeInvoiceId: invoice.id,
          stripeSubscriptionId: subscriptionId,
          amount: (invoice.amount_paid ?? 0) / 100,
        });
      }
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice & {
        subscription?: string | Stripe.Subscription | null;
      };
      const subscriptionId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id;

      if (subscriptionId) {
        await ctx.runMutation(internal.stripeInternal.markRecurringDonationPastDue, {
          stripeSubscriptionId: subscriptionId,
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await ctx.runMutation(internal.stripeInternal.cancelRecurringDonationRecord, {
        stripeSubscriptionId: subscription.id,
      });
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
