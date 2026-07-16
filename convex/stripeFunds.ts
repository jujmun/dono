import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { computeCampaignAfterDonation } from "./lib/applyDonationToCampaign";
import {
  DONATION_CURRENCY,
  validateDonationAmount,
} from "./lib/donationAmounts";
import { incrementCommunityRaised, incrementFundRaised } from "./lib/aggregates";
import { isPublicCampaign } from "./lib/campaignVisibility";

export const getFundForDonation = internalQuery({
  args: { fundSlug: v.string() },
  handler: async (ctx, args) => {
    const fund = await ctx.db
      .query("communityFunds")
      .withIndex("by_slug", (q) => q.eq("slug", args.fundSlug))
      .unique();

    if (!fund) {
      throw new ConvexError({
        code: "FUND_NOT_FOUND",
        message: "Community fund not found.",
      });
    }

    return {
      fundId: fund._id,
      fundSlug: fund.slug,
      name: fund.name,
      category: fund.category,
    };
  },
});

export const createPendingFundDonation = internalMutation({
  args: {
    userId: v.optional(v.id("users")),
    donorEmail: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    fundId: v.id("communityFunds"),
    amount: v.number(),
    stripePaymentIntentId: v.string(),
  },
  handler: async (ctx, args) => {
    const amountValidation = validateDonationAmount(args.amount);
    if (!amountValidation.valid) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: amountValidation.message,
      });
    }

    return await ctx.db.insert("donations", {
      userId: args.userId,
      donorEmail: args.donorEmail,
      isAnonymous: args.isAnonymous ?? false,
      fundId: args.fundId,
      amount: args.amount,
      currency: DONATION_CURRENCY,
      type: "one_time",
      paymentStatus: "pending",
      stripePaymentIntentId: args.stripePaymentIntentId,
      createdAt: Date.now(),
    });
  },
});

async function allocateFundDonation(
  ctx: MutationCtx,
  args: {
    fundId: Id<"communityFunds">;
    donationId: Id<"donations">;
    amount: number;
    category: string;
  },
) {
  const campaigns = await ctx.db.query("campaigns").collect();
  const eligible = campaigns.filter(
    (c: Doc<"campaigns">) => c.category === args.category && isPublicCampaign(c),
  );

  if (eligible.length === 0) {
    await incrementFundRaised(ctx, args.fundId, args.amount, 0);
    return 0;
  }

  const share = args.amount / eligible.length;

  for (const campaign of eligible) {
    const { raised, donors, status } = computeCampaignAfterDonation(
      {
        raised: campaign.raised,
        donors: campaign.donors,
        goal: campaign.goal,
        status: campaign.status,
      },
      share,
    );
    await ctx.db.patch(campaign._id, { raised, donors, status });
    await ctx.db.insert("fundAllocations", {
      fundId: args.fundId,
      donationId: args.donationId,
      campaignId: campaign._id,
      amount: share,
      createdAt: Date.now(),
    });
    await incrementCommunityRaised(ctx, campaign.creator.communityId, share);
  }

  await incrementFundRaised(ctx, args.fundId, args.amount, eligible.length);
  return eligible.length;
}

export const markFundDonationSucceeded = internalMutation({
  args: { stripePaymentIntentId: v.string() },
  handler: async (ctx, args) => {
    const donation = await ctx.db
      .query("donations")
      .withIndex("by_paymentIntent", (q) =>
        q.eq("stripePaymentIntentId", args.stripePaymentIntentId),
      )
      .unique();

    if (!donation || !donation.fundId) {
      return { alreadyProcessed: true };
    }

    if (donation.paymentStatus === "succeeded") {
      return { alreadyProcessed: true };
    }

    const fund = await ctx.db.get(donation.fundId);
    if (!fund) {
      throw new ConvexError({ code: "FUND_NOT_FOUND", message: "Fund not found." });
    }

    await ctx.db.patch(donation._id, { paymentStatus: "succeeded" });
    await allocateFundDonation(ctx, {
      fundId: donation.fundId,
      donationId: donation._id,
      amount: donation.amount,
      category: fund.category,
    });

    const donorEmail = donation.donorEmail;
    if (donorEmail) {
      await ctx.scheduler.runAfter(0, internal.emails.sendDonationReceipt, {
        email: donorEmail,
        campaignTitle: fund.name,
        amount: donation.amount,
        currency: donation.currency,
      });
    }

    return { alreadyProcessed: false };
  },
});
