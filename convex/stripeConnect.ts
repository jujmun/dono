"use node";

import { ConvexError, v } from "convex/values";
import Stripe from "stripe";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

type ConnectAccountRecord = {
  _id: Id<"stripeConnectAccounts">;
  stripeAccountId: string;
  payoutsEnabled: boolean;
};

type ScheduledPayout = {
  payoutId: Id<"campaignPayouts">;
  campaignId: Id<"campaigns">;
  stripeConnectAccountId: Id<"stripeConnectAccounts">;
  amount: number;
  currency: string;
};

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

export const createConnectOnboardingLink = action({
  args: {
    communitySlug: v.optional(v.string()),
    returnUrl: v.string(),
    refreshUrl: v.string(),
  },
  handler: async (ctx, args): Promise<{ url: string; stripeAccountId: string }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to perform this action.",
      });
    }

    if (args.communitySlug) {
      const access = await ctx.runQuery(
        internal.stripeConnectInternal.assertCanManageSocietyConnect,
        { userId, communitySlug: args.communitySlug },
      );
      if (!access.allowed) {
        throw new ConvexError({
          code: "FORBIDDEN",
          message: "You do not have permission for this action.",
        });
      }
    }

    const stripe = getStripeClient();
    const existing = (await ctx.runQuery(
      internal.stripeConnectInternal.getByUserId,
      { userId, communitySlug: args.communitySlug },
    )) as ConnectAccountRecord | null;

    let stripeAccountId: string;
    if (existing) {
      stripeAccountId = existing.stripeAccountId;
    } else {
      const account = await stripe.accounts.create({
        type: "express",
        capabilities: {
          transfers: { requested: true },
        },
        metadata: {
          userId,
          ...(args.communitySlug ? { communitySlug: args.communitySlug } : {}),
        },
      });
      stripeAccountId = account.id;
      await ctx.runMutation(internal.stripeConnectInternal.saveAccount, {
        userId,
        communitySlug: args.communitySlug,
        stripeAccountId,
        onboardingComplete: false,
        chargesEnabled: false,
        payoutsEnabled: false,
      });
    }

    const link = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: args.refreshUrl,
      return_url: args.returnUrl,
      type: "account_onboarding",
    });

    return { url: link.url, stripeAccountId };
  },
});

export const refreshConnectAccountStatus = action({
  args: { communitySlug: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to perform this action.",
      });
    }

    if (args.communitySlug) {
      const access = await ctx.runQuery(
        internal.stripeConnectInternal.assertCanManageSocietyConnect,
        { userId, communitySlug: args.communitySlug },
      );
      if (!access.allowed) {
        throw new ConvexError({
          code: "FORBIDDEN",
          message: "You do not have permission for this action.",
        });
      }
    }

    const record = await ctx.runQuery(internal.stripeConnectInternal.getByUserId, {
      userId,
      communitySlug: args.communitySlug,
    });
    if (!record) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Connect account not found.",
      });
    }

    const stripe = getStripeClient();
    const account = await stripe.accounts.retrieve(record.stripeAccountId);

    await ctx.runMutation(internal.stripeConnectInternal.updateAccountStatus, {
      stripeAccountId: record.stripeAccountId,
      onboardingComplete: account.details_submitted ?? false,
      chargesEnabled: account.charges_enabled ?? false,
      payoutsEnabled: account.payouts_enabled ?? false,
    });

    return {
      onboardingComplete: account.details_submitted ?? false,
      chargesEnabled: account.charges_enabled ?? false,
      payoutsEnabled: account.payouts_enabled ?? false,
    };
  },
});

export const scheduleCampaignPayout = action({
  args: {
    campaignSlug: v.string(),
    communitySlug: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ transferId: string; amount: number }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to perform this action.",
      });
    }

    const payout = (await ctx.runMutation(
      internal.stripeConnectInternal.schedulePayout,
      {
        campaignSlug: args.campaignSlug,
        communitySlug: args.communitySlug,
        requestedBy: userId,
      },
    )) as ScheduledPayout | null;

    if (!payout) {
      throw new ConvexError({
        code: "PAYOUT_NOT_ELIGIBLE",
        message: "Campaign is not eligible for payout.",
      });
    }

    const stripe = getStripeClient();
    const connectAccount = (await ctx.runQuery(
      internal.stripeConnectInternal.getById,
      { connectAccountId: payout.stripeConnectAccountId },
    )) as ConnectAccountRecord | null;
    if (!connectAccount?.payoutsEnabled) {
      throw new ConvexError({
        code: "CONNECT_NOT_READY",
        message: "Stripe Connect onboarding must be completed first.",
      });
    }

    const transfer = await stripe.transfers.create({
      amount: Math.round(payout.amount * 100),
      currency: payout.currency,
      destination: connectAccount.stripeAccountId,
      metadata: {
        campaignId: payout.campaignId,
        payoutId: payout.payoutId,
      },
    });

    await ctx.runMutation(internal.stripeConnectInternal.markPayoutTransferred, {
      payoutId: payout.payoutId,
      stripeTransferId: transfer.id,
    });

    return { transferId: transfer.id, amount: payout.amount };
  },
});
