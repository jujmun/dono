"use node";

import { ConvexError, v } from "convex/values";
import Stripe from "stripe";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
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

export const createPaymentIntent = action({
  args: {
    campaignSlug: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to perform this action.",
      });
    }

    const campaignSlug = normalizeCampaignSlug(args.campaignSlug);
    const amount = Number(args.amount);

    if (!campaignSlug) {
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
      { campaignSlug },
    );

    const stripe = getStripeClient();

    let stripeCustomerId: string;
    const existingCustomer = await ctx.runQuery(
      internal.stripeInternal.getStripeCustomerByUserId,
      { userId },
    );

    if (!existingCustomer) {
      const customer = await stripe.customers.create({
        email: userContext.email || undefined,
        name: userContext.name || undefined,
        metadata: {
          userId,
        },
      });

      stripeCustomerId = await ctx.runMutation(
        internal.stripeInternal.saveStripeCustomer,
        {
          userId,
          stripeCustomerId: customer.id,
        },
      );
    } else {
      stripeCustomerId = existingCustomer.stripeCustomerId;
    }

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
