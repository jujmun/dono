import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { optionalUserId, requireSocietyLeader, requireVerifiedUser } from "./lib/authz";
import { DONATION_CURRENCY } from "./lib/donationAmounts";

export const getByUserId = internalQuery({
  args: {
    userId: v.id("users"),
    communitySlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query("stripeConnectAccounts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    if (args.communitySlug) {
      return (
        accounts.find((a) => a.communitySlug === args.communitySlug) ?? null
      );
    }
    return accounts[0] ?? null;
  },
});

export const getById = internalQuery({
  args: { connectAccountId: v.id("stripeConnectAccounts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.connectAccountId);
  },
});

export const saveAccount = internalMutation({
  args: {
    userId: v.id("users"),
    communitySlug: v.optional(v.string()),
    stripeAccountId: v.string(),
    onboardingComplete: v.boolean(),
    chargesEnabled: v.boolean(),
    payoutsEnabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("stripeConnectAccounts", {
      userId: args.userId,
      communitySlug: args.communitySlug,
      stripeAccountId: args.stripeAccountId,
      onboardingComplete: args.onboardingComplete,
      chargesEnabled: args.chargesEnabled,
      payoutsEnabled: args.payoutsEnabled,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateAccountStatus = internalMutation({
  args: {
    stripeAccountId: v.string(),
    onboardingComplete: v.boolean(),
    chargesEnabled: v.boolean(),
    payoutsEnabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query("stripeConnectAccounts")
      .withIndex("by_stripeAccountId", (q) =>
        q.eq("stripeAccountId", args.stripeAccountId),
      )
      .unique();
    if (!account) return { updated: false };

    await ctx.db.patch(account._id, {
      onboardingComplete: args.onboardingComplete,
      chargesEnabled: args.chargesEnabled,
      payoutsEnabled: args.payoutsEnabled,
      updatedAt: Date.now(),
    });
    return { updated: true };
  },
});

export const schedulePayout = internalMutation({
  args: {
    campaignSlug: v.string(),
    communitySlug: v.optional(v.string()),
    requestedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.campaignSlug))
      .unique();

    if (!campaign || (campaign.status !== "funded" && campaign.status !== "completed")) {
      return null;
    }

    if (args.communitySlug) {
      await requireSocietyLeader(ctx, args.communitySlug);
    } else if (campaign.createdBy !== args.requestedBy) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You cannot request payout for this campaign.",
      });
    }

    const slug = args.communitySlug ?? campaign.creator.communityId;
    const connectAccounts = await ctx.db
      .query("stripeConnectAccounts")
      .withIndex("by_community", (q) => q.eq("communitySlug", slug))
      .collect();
    const connectAccount = connectAccounts[0];

    if (!connectAccount) {
      throw new ConvexError({
        code: "CONNECT_NOT_FOUND",
        message: "No connected payout account for this beneficiary.",
      });
    }

    const existing = await ctx.db
      .query("campaignPayouts")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
      .collect();
    if (existing.some((p) => p.status === "pending" || p.status === "transferred")) {
      return null;
    }

    const payoutId = await ctx.db.insert("campaignPayouts", {
      campaignId: campaign._id,
      stripeConnectAccountId: connectAccount._id,
      amount: campaign.raised,
      currency: DONATION_CURRENCY,
      status: "pending",
      createdAt: Date.now(),
    });

    return {
      payoutId,
      campaignId: campaign._id,
      stripeConnectAccountId: connectAccount._id,
      amount: campaign.raised,
      currency: DONATION_CURRENCY,
    };
  },
});

export const markPayoutTransferred = internalMutation({
  args: {
    payoutId: v.id("campaignPayouts"),
    stripeTransferId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.payoutId, {
      status: "transferred",
      stripeTransferId: args.stripeTransferId,
    });
    return null;
  },
});

/**
 * Allow Connect onboarding only for the society submission creator or an
 * approved society leader (post admin-approve / communities bridge).
 */
export const assertCanManageSocietyConnect = internalQuery({
  args: {
    userId: v.id("users"),
    communitySlug: v.string(),
  },
  handler: async (ctx, args) => {
    const society = await ctx.db
      .query("societies")
      .withIndex("by_slug", (q) => q.eq("slug", args.communitySlug))
      .unique();
    if (society && society.creatorId === args.userId) {
      return { allowed: true as const };
    }

    const membership = await ctx.db
      .query("societyMembers")
      .withIndex("by_community_user", (q) =>
        q.eq("communitySlug", args.communitySlug).eq("userId", args.userId),
      )
      .unique();
    if (
      membership &&
      membership.status === "approved" &&
      membership.role === "leader"
    ) {
      return { allowed: true as const };
    }

    return { allowed: false as const };
  },
});

/** Connect onboarding status for the current user + society slug. */
export const getMyConnectStatus = query({
  args: { communitySlug: v.string() },
  handler: async (ctx, args) => {
    const userId = await optionalUserId(ctx);
    if (!userId) return null;

    const accounts = await ctx.db
      .query("stripeConnectAccounts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const account =
      accounts.find((a) => a.communitySlug === args.communitySlug) ?? null;
    if (!account) {
      return {
        exists: false as const,
        onboardingComplete: false,
        chargesEnabled: false,
        payoutsEnabled: false,
      };
    }
    return {
      exists: true as const,
      onboardingComplete: account.onboardingComplete,
      chargesEnabled: account.chargesEnabled,
      payoutsEnabled: account.payoutsEnabled,
    };
  },
});

/**
 * Leader-or-creator view: Connect status for a society slug keyed by
 * communitySlug (any Connect row for that community, typically the creator's).
 */
export const getSocietyConnectStatus = query({
  args: { communitySlug: v.string() },
  handler: async (ctx, args) => {
    await requireVerifiedUser(ctx);
    // Prefer community-scoped lookup so payouts resolve the same way.
    const account = await ctx.db
      .query("stripeConnectAccounts")
      .withIndex("by_community", (q) => q.eq("communitySlug", args.communitySlug))
      .first();
    if (!account) {
      return {
        exists: false as const,
        onboardingComplete: false,
        chargesEnabled: false,
        payoutsEnabled: false,
      };
    }
    return {
      exists: true as const,
      onboardingComplete: account.onboardingComplete,
      chargesEnabled: account.chargesEnabled,
      payoutsEnabled: account.payoutsEnabled,
    };
  },
});
