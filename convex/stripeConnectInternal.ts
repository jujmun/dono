import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { optionalUserId, requireVerifiedUser } from "./lib/authz";
import {
  type MerchantCapabilityStatus,
  toPublicConnectStatus,
} from "./lib/stripeConnectMerchant";

function isCardPaymentsActive(account: {
  cardPaymentsActive?: boolean;
  chargesEnabled: boolean;
}) {
  return account.cardPaymentsActive ?? account.chargesEnabled ?? false;
}

function mapAccountToPublic(account: {
  onboardingComplete: boolean;
  chargesEnabled: boolean;
  cardPaymentsActive?: boolean;
  cardPaymentsStatus?: string;
  payoutsEnabled: boolean;
  accountVersion?: "v1" | "v2";
}) {
  const isV2 = account.accountVersion === "v2";
  // Legacy Express/transfer accounts must not look "payment ready" for direct charges.
  const cardPaymentsActive = isV2 && isCardPaymentsActive(account);
  return toPublicConnectStatus({
    exists: true,
    onboardingComplete: isV2 ? account.onboardingComplete : false,
    cardPaymentsActive,
    cardPaymentsStatus:
      (account.cardPaymentsStatus as MerchantCapabilityStatus | undefined) ??
      (cardPaymentsActive ? "active" : "unrequested"),
    payoutsEnabled: isV2 ? account.payoutsEnabled : false,
    accountVersion: isV2 ? "v2" : "v1",
    requiresMerchantReonboarding: !isV2,
  });
}

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

export const getByCommunitySlug = internalQuery({
  args: { communitySlug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stripeConnectAccounts")
      .withIndex("by_community", (q) => q.eq("communitySlug", args.communitySlug))
      .first();
  },
});

export const getByStripeAccountId = internalQuery({
  args: { stripeAccountId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stripeConnectAccounts")
      .withIndex("by_stripeAccountId", (q) =>
        q.eq("stripeAccountId", args.stripeAccountId),
      )
      .unique();
  },
});

export const getById = internalQuery({
  args: { connectAccountId: v.id("stripeConnectAccounts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.connectAccountId);
  },
});

export const deleteAccount = internalMutation({
  args: { connectAccountId: v.id("stripeConnectAccounts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.connectAccountId);
    return { deleted: true };
  },
});

export const saveAccount = internalMutation({
  args: {
    userId: v.id("users"),
    communitySlug: v.optional(v.string()),
    stripeAccountId: v.string(),
    accountVersion: v.union(v.literal("v1"), v.literal("v2")),
    onboardingComplete: v.boolean(),
    cardPaymentsActive: v.boolean(),
    cardPaymentsStatus: v.optional(v.string()),
    chargesEnabled: v.boolean(),
    payoutsEnabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("stripeConnectAccounts", {
      userId: args.userId,
      communitySlug: args.communitySlug,
      stripeAccountId: args.stripeAccountId,
      accountVersion: args.accountVersion,
      onboardingComplete: args.onboardingComplete,
      cardPaymentsActive: args.cardPaymentsActive,
      cardPaymentsStatus: args.cardPaymentsStatus,
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
    cardPaymentsActive: v.boolean(),
    cardPaymentsStatus: v.optional(v.string()),
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
      cardPaymentsActive: args.cardPaymentsActive,
      cardPaymentsStatus: args.cardPaymentsStatus,
      chargesEnabled: args.chargesEnabled,
      payoutsEnabled: args.payoutsEnabled,
      updatedAt: Date.now(),
    });
    return { updated: true };
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
      return toPublicConnectStatus({
        exists: false,
        onboardingComplete: false,
        cardPaymentsActive: false,
        cardPaymentsStatus: "unrequested",
        payoutsEnabled: false,
        accountVersion: null,
        requiresMerchantReonboarding: false,
      });
    }
    return mapAccountToPublic(account);
  },
});

/**
 * Community-scoped Connect status (any account row for that society slug).
 */
export const getSocietyConnectStatus = query({
  args: { communitySlug: v.string() },
  handler: async (ctx, args) => {
    await requireVerifiedUser(ctx);
    const account = await ctx.db
      .query("stripeConnectAccounts")
      .withIndex("by_community", (q) => q.eq("communitySlug", args.communitySlug))
      .first();
    if (!account) {
      return toPublicConnectStatus({
        exists: false,
        onboardingComplete: false,
        cardPaymentsActive: false,
        cardPaymentsStatus: "unrequested",
        payoutsEnabled: false,
        accountVersion: null,
        requiresMerchantReonboarding: false,
      });
    }
    return mapAccountToPublic(account);
  },
});

export const getCampaignDonationReadiness = query({
  args: { campaignSlug: v.string() },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.campaignSlug.trim().toLowerCase()))
      .unique();

    if (!campaign) {
      return {
        canAcceptDonations: false as const,
        reason: "Campaign not found.",
      };
    }
    if (campaign.status !== "active") {
      return {
        canAcceptDonations: false as const,
        reason: "This campaign is not accepting donations.",
      };
    }

    const connectAccount = await ctx.db
      .query("stripeConnectAccounts")
      .withIndex("by_community", (q) =>
        q.eq("communitySlug", campaign.creator.communityId),
      )
      .first();

    if (!connectAccount) {
      return {
        canAcceptDonations: false as const,
        reason: "The beneficiary society has not set up Stripe payments yet.",
      };
    }

    if (connectAccount.accountVersion !== "v2") {
      return {
        canAcceptDonations: false as const,
        reason: "The beneficiary society must complete the new Stripe payment setup.",
      };
    }

    if (!isCardPaymentsActive(connectAccount)) {
      return {
        canAcceptDonations: false as const,
        reason: "The beneficiary society is still completing Stripe payment setup.",
      };
    }

    return { canAcceptDonations: true as const };
  },
});
