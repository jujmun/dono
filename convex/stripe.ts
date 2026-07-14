"use node";

import { ConvexError, v } from "convex/values";
import Stripe from "stripe";
import { action } from "./_generated/server";
import type { ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";
import {
  donationAmountToStripeMinorUnits,
  normalizeCampaignSlug,
  validateDonationAmount,
} from "./lib/donationAmounts";

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new ConvexError({
      code: "STRIPE_NOT_CONFIGURED",
      message: "Stripe is not configured on this deployment.",
    });
  }

  return new Stripe(secretKey);
}

function normalizeDonorEmail(email: string | undefined) {
  if (!email) return undefined;
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return undefined;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: "Please enter a valid email address for your receipt.",
    });
  }
  return trimmed;
}

async function getOrCreateStripeCustomer(
  ctx: ActionCtx,
  userId: Id<"users">,
  userContext: { email: string; name?: string },
) {
  const stripe = getStripeClient();

  const existingCustomer = await ctx.runQuery(
    internal.stripeInternal.getStripeCustomerByUserId,
    { userId },
  );

  if (existingCustomer) {
    return existingCustomer.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: userContext.email || undefined,
    name: userContext.name || undefined,
    metadata: { userId },
  });

  return await ctx.runMutation(internal.stripeInternal.saveStripeCustomer, {
    userId,
    stripeCustomerId: customer.id,
  });
}

function getSubscriptionPaymentIntentClientSecret(
  subscription: Stripe.Subscription,
) {
  const latestInvoice = subscription.latest_invoice;
  if (!latestInvoice || typeof latestInvoice === "string") {
    return null;
  }

  const invoice = latestInvoice as Stripe.Invoice & {
    payment_intent?: string | Stripe.PaymentIntent | null;
  };
  const paymentIntent = invoice.payment_intent;
  if (!paymentIntent || typeof paymentIntent === "string") {
    return null;
  }

  return paymentIntent.client_secret;
}

async function validateCampaignAndAmount(ctx: ActionCtx, campaignSlug: string, amount: number) {
  const normalizedSlug = normalizeCampaignSlug(campaignSlug);
  if (!normalizedSlug) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: "Campaign is required.",
    });
  }

  const amountValidation = validateDonationAmount(amount);
  if (!amountValidation.valid) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: amountValidation.message,
    });
  }

  const campaign = await ctx.runQuery(
    internal.stripeInternal.getCampaignForDonation,
    { campaignSlug: normalizedSlug },
  );

  return { campaign, amount };
}

async function requireSignedInDonationContext(
  ctx: ActionCtx,
  campaignSlug: string,
  amount: number,
) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError({
      code: "UNAUTHENTICATED",
      message: "You must be signed in to perform this action.",
    });
  }

  const { campaign, amount: validAmount } = await validateCampaignAndAmount(
    ctx,
    campaignSlug,
    amount,
  );

  const userContext = await ctx.runQuery(
    internal.stripeInternal.getVerifiedUserContext,
    { userId },
  );

  await ctx.runQuery(internal.stripeInternal.assertNotAdminDonor, { userId });

  return { userId, userContext, campaign, amount: validAmount };
}

const STRIPE_CREATE_LIMIT = {
  maxAttempts: 10,
  windowMs: 15 * 60 * 1000,
  lockoutMs: 15 * 60 * 1000,
};

const MAX_PENDING_DONATIONS = 10;

async function enforceStripeCreateQuota(
  ctx: ActionCtx,
  key: string,
  userId?: Id<"users">,
) {
  await ctx.runMutation(internal.security.consumeQuota, {
    key,
    ...STRIPE_CREATE_LIMIT,
  });

  if (!userId) return;

  const pending = await ctx.runQuery(
    internal.stripeInternal.countPendingDonationsForUser,
    { userId },
  );
  if (pending >= MAX_PENDING_DONATIONS) {
    throw new ConvexError({
      code: "RATE_LIMITED",
      message: "Too many pending donations. Please finish or wait before trying again.",
    });
  }
}

export const createPaymentIntent = action({
  args: {
    campaignSlug: v.string(),
    amount: v.number(),
    donorEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const amount = Number(args.amount);
    const donorEmail = normalizeDonorEmail(args.donorEmail);
    const { campaign, amount: validAmount } = await validateCampaignAndAmount(
      ctx,
      args.campaignSlug,
      amount,
    );

    const stripe = getStripeClient();
    const userId = await getAuthUserId(ctx);

    const quotaKey = userId
      ? `stripePi:${userId}`
      : `stripePi:guest:${donorEmail ?? "anonymous"}`;
    await enforceStripeCreateQuota(ctx, quotaKey, userId ?? undefined);

    let stripeCustomerId: string | undefined;
    let receiptEmail = donorEmail;

    if (userId) {
      await ctx.runQuery(internal.stripeInternal.assertNotAdminDonor, { userId });
      const userContext = await ctx.runQuery(
        internal.stripeInternal.getVerifiedUserContext,
        { userId },
      );
      stripeCustomerId = await getOrCreateStripeCustomer(ctx, userId, userContext);
      receiptEmail = receiptEmail || userContext.email || undefined;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: donationAmountToStripeMinorUnits(validAmount),
      currency: "gbp",
      ...(stripeCustomerId ? { customer: stripeCustomerId } : {}),
      ...(receiptEmail ? { receipt_email: receiptEmail } : {}),
      automatic_payment_methods: { enabled: true },
      metadata: {
        ...(userId ? { userId } : {}),
        ...(receiptEmail ? { donorEmail: receiptEmail } : {}),
        campaignId: campaign.campaignId,
        campaignSlug: campaign.campaignSlug,
        donationType: "one_time",
      },
    });

    if (!paymentIntent.client_secret) {
      throw new ConvexError({
        code: "STRIPE_ERROR",
        message: "Stripe did not return a client secret.",
      });
    }

    await ctx.runMutation(internal.stripeInternal.createPendingDonation, {
      userId: userId ?? undefined,
      donorEmail: receiptEmail,
      campaignId: campaign.campaignId,
      amount: validAmount,
      stripePaymentIntentId: paymentIntent.id,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  },
});

export const createRecurringDonationSubscription = action({
  args: {
    campaignSlug: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const { userId, userContext, campaign, amount } =
      await requireSignedInDonationContext(
        ctx,
        args.campaignSlug,
        Number(args.amount),
      );

    await enforceStripeCreateQuota(ctx, `stripeSub:${userId}`, userId);

    const stripe = getStripeClient();
    const stripeCustomerId = await getOrCreateStripeCustomer(
      ctx,
      userId,
      userContext,
    );

    const price = await stripe.prices.create({
      currency: "gbp",
      unit_amount: donationAmountToStripeMinorUnits(amount),
      recurring: { interval: "month" },
      product_data: {
        name: `Monthly donation to ${campaign.title}`,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: price.id }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        userId,
        campaignId: campaign.campaignId,
        campaignSlug: campaign.campaignSlug,
        donationType: "recurring",
      },
    });

    const clientSecret = getSubscriptionPaymentIntentClientSecret(subscription);
    if (!clientSecret) {
      throw new ConvexError({
        code: "STRIPE_ERROR",
        message: "Stripe did not return a subscription payment secret.",
      });
    }

    await ctx.runMutation(internal.stripeInternal.createRecurringDonationRecord, {
      userId,
      campaignId: campaign.campaignId,
      amount,
      stripeSubscriptionId: subscription.id,
      stripePriceId: price.id,
    });

    return {
      clientSecret,
      subscriptionId: subscription.id,
    };
  },
});

export const cancelRecurringDonation = action({
  args: {
    recurringDonationId: v.id("recurringDonations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to perform this action.",
      });
    }

    const recurringDonation = await ctx.runQuery(
      internal.stripeInternal.getRecurringDonationForUser,
      {
        recurringDonationId: args.recurringDonationId,
        userId,
      },
    );

    if (!recurringDonation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Recurring donation not found.",
      });
    }

    if (recurringDonation.status === "canceled") {
      return { canceled: true };
    }

    const stripe = getStripeClient();
    await stripe.subscriptions.cancel(recurringDonation.stripeSubscriptionId);

    await ctx.runMutation(internal.stripeInternal.cancelRecurringDonationRecord, {
      stripeSubscriptionId: recurringDonation.stripeSubscriptionId,
    });

    return { canceled: true };
  },
});
