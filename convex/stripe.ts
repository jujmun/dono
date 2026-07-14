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

async function requireDonationContext(
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

  const userContext = await ctx.runQuery(
    internal.stripeInternal.getVerifiedUserContext,
    { userId },
  );
  const campaign = await ctx.runQuery(
    internal.stripeInternal.getCampaignForDonation,
    { campaignSlug: normalizedSlug },
  );

  return { userId, userContext, campaign, amount };
}

export const createPaymentIntent = action({
  args: {
    campaignSlug: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const { userId, userContext, campaign, amount } =
      await requireDonationContext(ctx, args.campaignSlug, Number(args.amount));

    const stripe = getStripeClient();
    const stripeCustomerId = await getOrCreateStripeCustomer(
      ctx,
      userId,
      userContext,
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: donationAmountToStripeMinorUnits(amount),
      currency: "gbp",
      customer: stripeCustomerId,
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId,
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
      userId,
      campaignId: campaign.campaignId,
      amount,
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
      await requireDonationContext(ctx, args.campaignSlug, Number(args.amount));

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
