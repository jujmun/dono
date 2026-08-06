import { ConvexError, v } from "convex/values";
import { internalMutation } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { computeCampaignAfterDonation } from "./lib/applyDonationToCampaign";
import { donationAmountToStripeMinorUnits } from "./lib/donationAmounts";
import { estimateStripeFeeMinor } from "./lib/platformFee";
import { incrementCommunityRaised, incrementFundRaised } from "./lib/aggregates";
import { isPublicCampaign } from "./lib/campaignVisibility";

async function allocateFundDonation(
  ctx: MutationCtx,
  args: {
    fundId: Id<"communityFunds">;
    donationId: Id<"donations">;
    amount: number;
    category: string;
    /** Amount to distribute after estimated Stripe processing (GBP major). */
    distributableAmount: number;
  },
) {
  const campaigns = await ctx.db.query("campaigns").collect();
  const eligible = campaigns.filter(
    (c: Doc<"campaigns">) => c.category === args.category && isPublicCampaign(c),
  );

  const raisedForFund = args.amount;

  if (eligible.length === 0) {
    await incrementFundRaised(ctx, args.fundId, raisedForFund, 0);
    return 0;
  }

  const distributable = Math.max(0, args.distributableAmount);
  const share = distributable / eligible.length;

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

  await incrementFundRaised(ctx, args.fundId, raisedForFund, eligible.length);
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

    const grossAmountMinor =
      donation.grossAmountMinor ?? donationAmountToStripeMinorUnits(donation.amount);
    // Prefer stored intended amount (donor pays Stripe estimate on top). Fall back
    // for older rows that charged the gift alone without a separate intended field.
    const distributableMinor =
      donation.intendedCampaignAmountMinor ??
      Math.max(
        0,
        grossAmountMinor -
          (donation.estimatedStripeFeeMinor ??
            estimateStripeFeeMinor(grossAmountMinor)),
      );
    const distributableAmount = distributableMinor / 100;

    await ctx.db.patch(donation._id, {
      paymentStatus: "succeeded",
      ...(donation.applicationFeeAmountMinor === undefined
        ? { applicationFeeAmountMinor: 0 }
        : {}),
    });

    await allocateFundDonation(ctx, {
      fundId: donation.fundId,
      donationId: donation._id,
      amount: donation.amount,
      category: fund.category,
      distributableAmount,
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
