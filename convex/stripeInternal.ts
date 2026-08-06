import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { computeCampaignAfterDonation } from "./lib/applyDonationToCampaign";
import {
  DONATION_CURRENCY,
  donationAmountToStripeMinorUnits,
  normalizeCampaignSlug,
  validateDonationAmount,
} from "./lib/donationAmounts";
import { calculateApplicationFeeRefundMinor } from "./lib/platformFee";
import { getProfileByUserId } from "./lib/authz";
import { isAdminIdentityEmail } from "./auth/adminConfig";
import { getSocietySubscriptionForUserHandler } from "./lib/stripeOwnership";
import { incrementCommunityRaised } from "./lib/aggregates";
import { splitAmountMinorAcrossCampaigns } from "./lib/societySubscriptionSplit";
import {
  buildSocietySubscriptionCanceledMessage,
  createNotification,
} from "./lib/notifications";

export const assertNotAdminDonor = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const profile = await getProfileByUserId(ctx, args.userId);
    const isAdmin =
      profile?.role === "admin" ||
      isAdminIdentityEmail(profile?.email ?? "");
    if (isAdmin) {
      throw new ConvexError({
        code: "ADMIN_CANNOT_DONATE",
        message: "Admin accounts cannot donate to campaigns.",
      });
    }
  },
});

export const countPendingDonationsForUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const donations = await ctx.db
      .query("donations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return donations.filter((d) => d.paymentStatus === "pending").length;
  },
});

export const getVerifiedUserContext = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new ConvexError({
        code: "USER_NOT_FOUND",
        message: "Authenticated user record is missing.",
      });
    }

    const profile = await getProfileByUserId(ctx, args.userId);
    const verified =
      Boolean(user.emailVerificationTime) || Boolean(profile?.emailVerifiedAt);

    if (!verified) {
      throw new ConvexError({
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email before continuing.",
      });
    }

    return {
      userId: args.userId,
      email: profile?.email ?? user.email ?? "",
      name: profile?.name,
    };
  },
});

export const getCampaignForDonation = internalQuery({
  args: { campaignSlug: v.string() },
  handler: async (ctx, args) => {
    const campaignSlug = normalizeCampaignSlug(args.campaignSlug);
    if (!campaignSlug) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Campaign is required.",
      });
    }

    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", campaignSlug))
      .unique();

    if (!campaign) {
      throw new ConvexError({
        code: "CAMPAIGN_NOT_FOUND",
        message: "Campaign not found.",
      });
    }

    if (campaign.status !== "active") {
      throw new ConvexError({
        code: "CAMPAIGN_NOT_ACTIVE",
        message: "This campaign is not accepting donations.",
      });
    }

    return {
      campaignId: campaign._id,
      campaignSlug: campaign.slug,
      title: campaign.title,
      communitySlug: campaign.creator.communityId,
    };
  },
});

export const resolveCampaignMerchantAccount = internalQuery({
  args: { campaignSlug: v.string() },
  handler: async (ctx, args) => {
    const normalizedSlug = normalizeCampaignSlug(args.campaignSlug);
    if (!normalizedSlug) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Campaign is required.",
      });
    }

    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", normalizedSlug))
      .unique();

    if (!campaign) {
      throw new ConvexError({
        code: "CAMPAIGN_NOT_FOUND",
        message: "Campaign not found.",
      });
    }

    if (campaign.status !== "active") {
      throw new ConvexError({
        code: "CAMPAIGN_NOT_ACTIVE",
        message: "This campaign is not accepting donations.",
      });
    }

    const connectAccount = await ctx.db
      .query("stripeConnectAccounts")
      .withIndex("by_community", (q) =>
        q.eq("communitySlug", campaign.creator.communityId),
      )
      .first();

    if (!connectAccount) {
      throw new ConvexError({
        code: "CONNECT_NOT_READY",
        message: "The beneficiary society has not set up Stripe payments yet.",
      });
    }

    if (connectAccount.accountVersion !== "v2") {
      throw new ConvexError({
        code: "CONNECT_NOT_READY",
        message: "The beneficiary society must complete the new Stripe payment setup.",
      });
    }

    if (!(connectAccount.cardPaymentsActive ?? connectAccount.chargesEnabled)) {
      throw new ConvexError({
        code: "CHARGES_DISABLED",
        message: "The beneficiary society is still completing Stripe payment setup.",
      });
    }

    return {
      campaignId: campaign._id,
      campaignSlug: campaign.slug,
      title: campaign.title,
      communitySlug: campaign.creator.communityId,
      stripeAccountId: connectAccount.stripeAccountId,
    };
  },
});

/** Soft lookup of Connect account for an existing campaign (e.g. cancel subscription). */
export const getConnectAccountIdForCampaign = internalQuery({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) return null;
    const connectAccount = await ctx.db
      .query("stripeConnectAccounts")
      .withIndex("by_community", (q) =>
        q.eq("communitySlug", campaign.creator.communityId),
      )
      .first();
    if (!connectAccount || connectAccount.accountVersion !== "v2") {
      return null;
    }
    return { stripeAccountId: connectAccount.stripeAccountId };
  },
});

/** Soft lookup of Connect account for a society, keyed directly on its slug
 * (e.g. cancel society subscription — no campaign in hand at that point). */
export const getConnectAccountIdForCommunity = internalQuery({
  args: { communitySlug: v.string() },
  handler: async (ctx, args) => {
    const connectAccount = await ctx.db
      .query("stripeConnectAccounts")
      .withIndex("by_community", (q) => q.eq("communitySlug", args.communitySlug))
      .first();
    if (!connectAccount || connectAccount.accountVersion !== "v2") {
      return null;
    }
    return { stripeAccountId: connectAccount.stripeAccountId };
  },
});

/** Campaigns currently accepting donations for a society — the same
 * `status === "active"` gate resolveCampaignMerchantAccount uses. Sorted by
 * _id so a given invoice always splits the same way. */
export const getActiveCampaignsForCommunity = internalQuery({
  args: { communitySlug: v.string() },
  handler: async (ctx, args) => {
    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_community", (q) => q.eq("creator.communityId", args.communitySlug))
      .collect();
    return campaigns
      .filter((c) => c.status === "active")
      .sort((a, b) => (a._id < b._id ? -1 : a._id > b._id ? 1 : 0));
  },
});

/** Validates a society can accept a new subscription: a working Connect
 * payments account and at least one campaign currently accepting donations
 * right now (mirrors resolveCampaignMerchantAccount's gates). */
export const resolveSocietyMerchantAccount = internalQuery({
  args: { communitySlug: v.string() },
  handler: async (ctx, args) => {
    const connectAccount = await ctx.db
      .query("stripeConnectAccounts")
      .withIndex("by_community", (q) => q.eq("communitySlug", args.communitySlug))
      .first();

    if (!connectAccount) {
      throw new ConvexError({
        code: "CONNECT_NOT_READY",
        message: "This society has not set up Stripe payments yet.",
      });
    }
    if (connectAccount.accountVersion !== "v2") {
      throw new ConvexError({
        code: "CONNECT_NOT_READY",
        message: "This society must complete the new Stripe payment setup.",
      });
    }
    if (!(connectAccount.cardPaymentsActive ?? connectAccount.chargesEnabled)) {
      throw new ConvexError({
        code: "CHARGES_DISABLED",
        message: "This society is still completing Stripe payment setup.",
      });
    }

    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_community", (q) => q.eq("creator.communityId", args.communitySlug))
      .collect();
    const activeCampaignCount = campaigns.filter((c) => c.status === "active").length;
    if (activeCampaignCount === 0) {
      throw new ConvexError({
        code: "NO_ACTIVE_CAMPAIGNS",
        message: "This society has no active campaigns to support right now.",
      });
    }

    const society = await ctx.db
      .query("societies")
      .withIndex("by_slug", (q) => q.eq("slug", args.communitySlug))
      .unique();
    const community = society
      ? null
      : await ctx.db
          .query("communities")
          .withIndex("by_slug", (q) => q.eq("slug", args.communitySlug))
          .unique();
    const name = society?.name ?? community?.name ?? args.communitySlug;

    return {
      communitySlug: args.communitySlug,
      name,
      stripeAccountId: connectAccount.stripeAccountId,
      activeCampaignCount,
    };
  },
});

export const getStripeCustomerByUserId = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stripeCustomers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
  },
});

export const saveStripeCustomer = internalMutation({
  args: {
    userId: v.id("users"),
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stripeCustomers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      return existing.stripeCustomerId;
    }

    await ctx.db.insert("stripeCustomers", {
      userId: args.userId,
      stripeCustomerId: args.stripeCustomerId,
      createdAt: Date.now(),
    });

    return args.stripeCustomerId;
  },
});

export const createPendingDonation = internalMutation({
  args: {
    userId: v.optional(v.id("users")),
    donorEmail: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    campaignId: v.id("campaigns"),
    amount: v.number(),
    stripePaymentIntentId: v.optional(v.string()),
    stripeConnectedAccountId: v.string(),
    grossAmountMinor: v.number(),
    applicationFeeAmountMinor: v.number(),
    coverFees: v.optional(v.boolean()),
    intendedCampaignAmountMinor: v.optional(v.number()),
    estimatedStripeFeeMinor: v.optional(v.number()),
    ageAttested: v.optional(v.boolean()),
    ageAttestedAt: v.optional(v.number()),
    legalAcceptedAt: v.optional(v.number()),
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
      campaignId: args.campaignId,
      amount: args.amount,
      currency: DONATION_CURRENCY,
      type: "one_time",
      paymentStatus: "pending",
      ...(args.stripePaymentIntentId
        ? { stripePaymentIntentId: args.stripePaymentIntentId }
        : {}),
      stripeConnectedAccountId: args.stripeConnectedAccountId,
      grossAmountMinor: args.grossAmountMinor,
      applicationFeeAmountMinor: args.applicationFeeAmountMinor,
      applicationFeeRefundedMinor: 0,
      refundedAmountMinor: 0,
      coverFees: args.coverFees,
      intendedCampaignAmountMinor: args.intendedCampaignAmountMinor,
      estimatedStripeFeeMinor: args.estimatedStripeFeeMinor,
      ageAttested: args.ageAttested,
      ageAttestedAt: args.ageAttestedAt,
      legalAcceptedAt: args.legalAcceptedAt,
      createdAt: Date.now(),
    });
  },
});

export const attachPaymentIntentToDonation = internalMutation({
  args: {
    donationId: v.id("donations"),
    stripePaymentIntentId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.donationId, {
      stripePaymentIntentId: args.stripePaymentIntentId,
    });
    return { ok: true as const };
  },
});

export const getDonationByPaymentIntentId = internalQuery({
  args: { stripePaymentIntentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("donations")
      .withIndex("by_paymentIntent", (q) =>
        q.eq("stripePaymentIntentId", args.stripePaymentIntentId),
      )
      .unique();
  },
});

export const getWebhookEvent = internalQuery({
  args: { stripeEventId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stripeWebhookEvents")
      .withIndex("by_stripeEventId", (q) =>
        q.eq("stripeEventId", args.stripeEventId),
      )
      .unique();
  },
});

export const recordWebhookEvent = internalMutation({
  args: {
    stripeEventId: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stripeWebhookEvents")
      .withIndex("by_stripeEventId", (q) =>
        q.eq("stripeEventId", args.stripeEventId),
      )
      .unique();

    if (existing) {
      return { alreadyProcessed: true };
    }

    await ctx.db.insert("stripeWebhookEvents", {
      stripeEventId: args.stripeEventId,
      type: args.type,
      processedAt: Date.now(),
    });

    return { alreadyProcessed: false };
  },
});

export const markDonationSucceeded = internalMutation({
  args: {
    stripePaymentIntentId: v.string(),
    stripeChargeId: v.optional(v.string()),
    stripeConnectedAccountId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const donation = await ctx.db
      .query("donations")
      .withIndex("by_paymentIntent", (q) =>
        q.eq("stripePaymentIntentId", args.stripePaymentIntentId),
      )
      .unique();

    if (!donation) {
      return { alreadyProcessed: true };
    }

    if (
      donation.stripeConnectedAccountId &&
      args.stripeConnectedAccountId &&
      donation.stripeConnectedAccountId !== args.stripeConnectedAccountId
    ) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Connected account mismatch for donation.",
      });
    }

    if (donation.fundId) {
      return { alreadyProcessed: true };
    }

    if (donation.paymentStatus === "succeeded") {
      return { alreadyProcessed: true };
    }

    if (!donation.campaignId) {
      return { alreadyProcessed: true };
    }

    const campaign = await ctx.db.get(donation.campaignId);
    if (!campaign) {
      throw new ConvexError({
        code: "CAMPAIGN_NOT_FOUND",
        message: "Campaign not found for donation.",
      });
    }

    await ctx.db.patch(donation._id, {
      paymentStatus: "succeeded",
      ...(args.stripeChargeId ? { stripeChargeId: args.stripeChargeId } : {}),
    });

    const wasFunded = campaign.raised >= campaign.goal;
    const { raised, donors, status } = computeCampaignAfterDonation(
      {
        raised: campaign.raised,
        donors: campaign.donors,
        goal: campaign.goal,
        status: campaign.status,
      },
      donation.amount,
    );
    await ctx.db.patch(campaign._id, { raised, donors, status });
    await incrementCommunityRaised(ctx, campaign.creator.communityId, donation.amount);

    const donorName = donation.isAnonymous
      ? "Anonymous donor"
      : donation.userId
        ? (await getProfileByUserId(ctx, donation.userId))?.name ?? "A donor"
        : "A donor";
    const donorAvatar = donation.isAnonymous
      ? "??"
      : donorName
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "DN";

    await ctx.scheduler.runAfter(0, internal.activity.recordDonation, {
      userName: donorName,
      userAvatar: donorAvatar,
      campaignTitle: campaign.title,
      amount: donation.amount,
    });

    await ctx.scheduler.runAfter(0, internal.campaignMatches.consumeMatchOnDonation, {
      donationId: donation._id,
      campaignId: campaign._id,
      donationAmountPounds: donation.amount,
      campaignTitle: campaign.title,
    });

    const receiptEmail =
      donation.donorEmail ??
      (donation.userId
        ? (await getProfileByUserId(ctx, donation.userId))?.email
        : undefined);
    if (receiptEmail) {
      await ctx.scheduler.runAfter(0, internal.emails.sendDonationReceipt, {
        email: receiptEmail,
        campaignTitle: campaign.title,
        amount: donation.amount,
        currency: donation.currency,
      });
    }

    if (!wasFunded && raised >= campaign.goal && campaign.createdBy) {
      const profile = await getProfileByUserId(ctx, campaign.createdBy);
      if (profile?.email) {
        await ctx.scheduler.runAfter(0, internal.emails.sendCampaignFunded, {
          email: profile.email,
          name: profile.name ?? "there",
          campaignTitle: campaign.title,
        });
      }
    }

    return { alreadyProcessed: false };
  },
});

export const markDonationFailed = internalMutation({
  args: { stripePaymentIntentId: v.string() },
  handler: async (ctx, args) => {
    const donation = await ctx.db
      .query("donations")
      .withIndex("by_paymentIntent", (q) =>
        q.eq("stripePaymentIntentId", args.stripePaymentIntentId),
      )
      .unique();

    if (!donation) {
      return { updated: false };
    }

    if (donation.paymentStatus === "failed") {
      return { updated: false };
    }

    await ctx.db.patch(donation._id, { paymentStatus: "failed" });
    return { updated: true };
  },
});

export const createRecurringDonationRecord = internalMutation({
  args: {
    userId: v.id("users"),
    campaignId: v.id("campaigns"),
    amount: v.number(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
  },
  handler: async (ctx, args) => {
    const amountValidation = validateDonationAmount(args.amount);
    if (!amountValidation.valid) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: amountValidation.message,
      });
    }

    return await ctx.db.insert("recurringDonations", {
      userId: args.userId,
      campaignId: args.campaignId,
      amount: args.amount,
      currency: DONATION_CURRENCY,
      stripeSubscriptionId: args.stripeSubscriptionId,
      stripePriceId: args.stripePriceId,
      status: "active",
      createdAt: Date.now(),
    });
  },
});

export const getRecurringDonationBySubscription = internalQuery({
  args: { stripeSubscriptionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("recurringDonations")
      .withIndex("by_subscription", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId),
      )
      .unique();
  },
});

export const getDonationByInvoiceId = internalQuery({
  args: { stripeInvoiceId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("donations")
      .withIndex("by_invoice", (q) => q.eq("stripeInvoiceId", args.stripeInvoiceId))
      .unique();
  },
});

export const recordRecurringInvoicePayment = internalMutation({
  args: {
    stripeInvoiceId: v.string(),
    stripeSubscriptionId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const existingDonation = await ctx.db
      .query("donations")
      .withIndex("by_invoice", (q) => q.eq("stripeInvoiceId", args.stripeInvoiceId))
      .unique();

    if (existingDonation) {
      return { alreadyProcessed: true };
    }

    const recurringDonation = await ctx.db
      .query("recurringDonations")
      .withIndex("by_subscription", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId),
      )
      .unique();

    if (!recurringDonation) {
      return { alreadyProcessed: true };
    }

    const campaign = await ctx.db.get(recurringDonation.campaignId);
    if (!campaign) {
      throw new ConvexError({
        code: "CAMPAIGN_NOT_FOUND",
        message: "Campaign not found for recurring donation.",
      });
    }

    const donationId = await ctx.db.insert("donations", {
      userId: recurringDonation.userId,
      campaignId: recurringDonation.campaignId,
      amount: args.amount,
      currency: DONATION_CURRENCY,
      type: "recurring",
      paymentStatus: "succeeded",
      stripeInvoiceId: args.stripeInvoiceId,
      recurringDonationId: recurringDonation._id,
      createdAt: Date.now(),
    });

    if (recurringDonation.status !== "active") {
      await ctx.db.patch(recurringDonation._id, { status: "active" });
    }

    const { raised, donors, status } = computeCampaignAfterDonation(
      {
        raised: campaign.raised,
        donors: campaign.donors,
        goal: campaign.goal,
        status: campaign.status,
      },
      args.amount,
    );
    await ctx.db.patch(campaign._id, { raised, donors, status });

    await ctx.scheduler.runAfter(0, internal.campaignMatches.consumeMatchOnDonation, {
      donationId,
      campaignId: campaign._id,
      donationAmountPounds: args.amount,
      campaignTitle: campaign.title,
    });

    return { alreadyProcessed: false };
  },
});

export const markRecurringDonationPastDue = internalMutation({
  args: { stripeSubscriptionId: v.string() },
  handler: async (ctx, args) => {
    const recurringDonation = await ctx.db
      .query("recurringDonations")
      .withIndex("by_subscription", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId),
      )
      .unique();

    if (!recurringDonation || recurringDonation.status === "canceled") {
      return { updated: false };
    }

    await ctx.db.patch(recurringDonation._id, { status: "past_due" });
    return { updated: true };
  },
});

export const cancelRecurringDonationRecord = internalMutation({
  args: { stripeSubscriptionId: v.string() },
  handler: async (ctx, args) => {
    const recurringDonation = await ctx.db
      .query("recurringDonations")
      .withIndex("by_subscription", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId),
      )
      .unique();

    if (!recurringDonation) {
      return { updated: false };
    }

    if (recurringDonation.status === "canceled") {
      return { updated: false };
    }

    await ctx.db.patch(recurringDonation._id, {
      status: "canceled",
      canceledAt: Date.now(),
    });
    return { updated: true };
  },
});

/** No ownership check — used only by the admin-gated bulk-cancel migration. */
export const getRecurringDonationById = internalQuery({
  args: { recurringDonationId: v.id("recurringDonations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.recurringDonationId);
  },
});

/** Every non-canceled row — used only by the admin-gated bulk-cancel migration. */
export const listActiveOrPastDueRecurringDonations = internalQuery({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("recurringDonations").collect();
    return rows.filter((row) => row.status !== "canceled");
  },
});

/**
 * Every still-billing subscription for one user, across both the society-level
 * table and the legacy campaign-level one. Used by account deletion: a deleted
 * account can no longer reach the cancel UI, so anything left running would
 * keep charging someone who has no way to stop it.
 */
export const listLiveSubscriptionsForUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const societySubscriptions = await ctx.db
      .query("societySubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const recurringDonations = await ctx.db
      .query("recurringDonations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return {
      societySubscriptions: societySubscriptions
        .filter((row) => row.status !== "canceled")
        .map((row) => ({
          stripeSubscriptionId: row.stripeSubscriptionId,
          communitySlug: row.communitySlug,
        })),
      recurringDonationIds: recurringDonations
        .filter((row) => row.status !== "canceled")
        .map((row) => row._id),
    };
  },
});

export const createSocietySubscriptionRecord = internalMutation({
  args: {
    userId: v.id("users"),
    communitySlug: v.string(),
    amount: v.number(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
  },
  handler: async (ctx, args) => {
    const amountValidation = validateDonationAmount(args.amount);
    if (!amountValidation.valid) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: amountValidation.message,
      });
    }

    return await ctx.db.insert("societySubscriptions", {
      userId: args.userId,
      communitySlug: args.communitySlug,
      amount: args.amount,
      currency: DONATION_CURRENCY,
      stripeSubscriptionId: args.stripeSubscriptionId,
      stripePriceId: args.stripePriceId,
      status: "active",
      createdAt: Date.now(),
    });
  },
});

export const getSocietySubscriptionForUser = internalQuery({
  args: {
    societySubscriptionId: v.id("societySubscriptions"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const societySubscription = await ctx.db.get(args.societySubscriptionId);
    return getSocietySubscriptionForUserHandler({
      societySubscription,
      callerUserId: args.userId,
    });
  },
});

export const getSocietySubscriptionById = internalQuery({
  args: { societySubscriptionId: v.id("societySubscriptions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.societySubscriptionId);
  },
});

export const getSocietySubscriptionBySubscriptionId = internalQuery({
  args: { stripeSubscriptionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("societySubscriptions")
      .withIndex("by_subscription", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId),
      )
      .unique();
  },
});

export const markSocietySubscriptionPastDue = internalMutation({
  args: { stripeSubscriptionId: v.string() },
  handler: async (ctx, args) => {
    const societySubscription = await ctx.db
      .query("societySubscriptions")
      .withIndex("by_subscription", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId),
      )
      .unique();

    if (!societySubscription || societySubscription.status === "canceled") {
      return { updated: false };
    }

    await ctx.db.patch(societySubscription._id, { status: "past_due" });
    return { updated: true };
  },
});

export const cancelSocietySubscriptionRecord = internalMutation({
  args: {
    stripeSubscriptionId: v.string(),
    reason: v.optional(
      v.union(v.literal("user_requested"), v.literal("no_active_campaigns")),
    ),
  },
  handler: async (ctx, args) => {
    const societySubscription = await ctx.db
      .query("societySubscriptions")
      .withIndex("by_subscription", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId),
      )
      .unique();

    if (!societySubscription || societySubscription.status === "canceled") {
      return { updated: false, societySubscription: null };
    }

    await ctx.db.patch(societySubscription._id, {
      status: "canceled",
      canceledAt: Date.now(),
      canceledReason: args.reason,
    });
    return { updated: true, societySubscription };
  },
});

/**
 * Fan-out core for a paid society subscription invoice. Splits the invoice
 * across whichever campaigns are active for the society right now — not
 * whichever were active at signup — so each billing cycle reflects the
 * current campaign lineup. Idempotent per stripeInvoiceId.
 *
 * If the society has no active campaigns, nothing is attributed here: a
 * zero-campaign placeholder payment row is recorded and a refund/cancel is
 * scheduled (see stripe.refundAndCancelSocietySubscriptionForNoCampaigns) —
 * this is the safety net behind the invoice.upcoming pre-emptive cancel in
 * stripeWebhook.ts, for the rare case a campaign goes inactive in the final
 * run-up to a charge.
 */
export const processSuccessfulSocietyInvoice = internalMutation({
  args: {
    stripeInvoiceId: v.string(),
    stripeSubscriptionId: v.string(),
    totalAmountMinor: v.number(),
    stripePaymentIntentId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ applicable: boolean }> => {
    const societySubscription = await ctx.db
      .query("societySubscriptions")
      .withIndex("by_subscription", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId),
      )
      .unique();
    if (!societySubscription) {
      return { applicable: false };
    }

    const existingPayment = await ctx.db
      .query("societySubscriptionPayments")
      .withIndex("by_invoice", (q) => q.eq("stripeInvoiceId", args.stripeInvoiceId))
      .unique();
    if (existingPayment) {
      return { applicable: true };
    }

    if (societySubscription.status !== "active") {
      await ctx.db.patch(societySubscription._id, { status: "active" });
    }

    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_community", (q) =>
        q.eq("creator.communityId", societySubscription.communitySlug),
      )
      .collect();
    const activeCampaigns = campaigns
      .filter((c) => c.status === "active")
      .sort((a, b) => (a._id < b._id ? -1 : a._id > b._id ? 1 : 0));

    if (activeCampaigns.length === 0) {
      await ctx.db.insert("societySubscriptionPayments", {
        societySubscriptionId: societySubscription._id,
        stripeInvoiceId: args.stripeInvoiceId,
        totalAmountMinor: args.totalAmountMinor,
        campaignCount: 0,
        refunded: false,
        createdAt: Date.now(),
      });
      await ctx.scheduler.runAfter(
        0,
        internal.stripe.refundAndCancelSocietySubscriptionForNoCampaigns,
        {
          societySubscriptionId: societySubscription._id,
          stripeInvoiceId: args.stripeInvoiceId,
          stripePaymentIntentId: args.stripePaymentIntentId,
          totalAmountMinor: args.totalAmountMinor,
        },
      );
      return { applicable: true };
    }

    const shares = splitAmountMinorAcrossCampaigns(
      args.totalAmountMinor,
      activeCampaigns.map((c) => c._id),
    );

    const paymentId = await ctx.db.insert("societySubscriptionPayments", {
      societySubscriptionId: societySubscription._id,
      stripeInvoiceId: args.stripeInvoiceId,
      totalAmountMinor: args.totalAmountMinor,
      campaignCount: activeCampaigns.length,
      createdAt: Date.now(),
    });

    const campaignsById = new Map(activeCampaigns.map((c) => [c._id, c]));
    for (const share of shares) {
      if (share.amountMinor <= 0) continue;
      const campaign = campaignsById.get(share.campaignId as Id<"campaigns">);
      if (!campaign) continue;

      const amountPounds = share.amountMinor / 100;
      const donationId = await ctx.db.insert("donations", {
        userId: societySubscription.userId,
        campaignId: campaign._id,
        amount: amountPounds,
        currency: DONATION_CURRENCY,
        type: "recurring",
        paymentStatus: "succeeded",
        societySubscriptionId: societySubscription._id,
        societySubscriptionPaymentId: paymentId,
        createdAt: Date.now(),
      });

      const { raised, donors, status } = computeCampaignAfterDonation(
        {
          raised: campaign.raised,
          donors: campaign.donors,
          goal: campaign.goal,
          status: campaign.status,
        },
        amountPounds,
      );
      await ctx.db.patch(campaign._id, { raised, donors, status });
      await incrementCommunityRaised(ctx, societySubscription.communitySlug, amountPounds);

      await ctx.scheduler.runAfter(0, internal.campaignMatches.consumeMatchOnDonation, {
        donationId,
        campaignId: campaign._id,
        donationAmountPounds: amountPounds,
        campaignTitle: campaign.title,
      });
    }

    return { applicable: true };
  },
});

export const markSocietySubscriptionPaymentRefunded = internalMutation({
  args: {
    stripeInvoiceId: v.string(),
    stripeRefundId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("societySubscriptionPayments")
      .withIndex("by_invoice", (q) => q.eq("stripeInvoiceId", args.stripeInvoiceId))
      .unique();
    if (!payment) return { updated: false };
    await ctx.db.patch(payment._id, {
      refunded: true,
      stripeRefundId: args.stripeRefundId,
    });
    return { updated: true };
  },
});

/** In-app notification + email for a donor whose society subscription Dono
 * canceled because the society has no active campaigns — used by both the
 * pre-emptive invoice.upcoming cancel and the invoice.paid refund safety net. */
export const notifySocietySubscriptionCanceled = internalMutation({
  args: {
    societySubscriptionId: v.id("societySubscriptions"),
    charged: v.boolean(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const societySubscription = await ctx.db.get(args.societySubscriptionId);
    if (!societySubscription) return { notified: false };

    const [society, community, profile] = await Promise.all([
      ctx.db
        .query("societies")
        .withIndex("by_slug", (q) => q.eq("slug", societySubscription.communitySlug))
        .unique(),
      ctx.db
        .query("communities")
        .withIndex("by_slug", (q) => q.eq("slug", societySubscription.communitySlug))
        .unique(),
      getProfileByUserId(ctx, societySubscription.userId),
    ]);
    const societyName = society?.name ?? community?.name ?? societySubscription.communitySlug;

    await createNotification(ctx, {
      userId: societySubscription.userId,
      type: "society_subscription_canceled",
      message: buildSocietySubscriptionCanceledMessage(societyName),
    });

    const user = await ctx.db.get(societySubscription.userId);
    const email = profile?.email ?? user?.email;
    if (email) {
      await ctx.scheduler.runAfter(0, internal.emails.sendSocietySubscriptionCanceledNoCampaigns, {
        email,
        name: profile?.name ?? "there",
        societyName,
        amount: args.amount,
        currency: DONATION_CURRENCY,
        charged: args.charged,
      });
    }

    return { notified: true };
  },
});

export const markDonationRefunded = internalMutation({
  args: {
    stripePaymentIntentId: v.string(),
    refundedAmountMinor: v.number(),
    isFullRefund: v.boolean(),
  },
  handler: async (ctx, args) => {
    const donation = await ctx.db
      .query("donations")
      .withIndex("by_paymentIntent", (q) =>
        q.eq("stripePaymentIntentId", args.stripePaymentIntentId),
      )
      .unique();

    if (
      !donation ||
      donation.paymentStatus === "refunded" ||
      donation.paymentStatus === "failed"
    ) {
      return { updated: false, applicationFeeRefundMinor: 0 };
    }

    const grossAmountMinor =
      donation.grossAmountMinor ?? donationAmountToStripeMinorUnits(donation.amount);
    const previousRefundedMinor = donation.refundedAmountMinor ?? 0;
    const nextRefundedMinor = Math.max(previousRefundedMinor, args.refundedAmountMinor);
    const incrementalRefundMinor = nextRefundedMinor - previousRefundedMinor;

    if (incrementalRefundMinor <= 0) {
      return { updated: false, applicationFeeRefundMinor: 0 };
    }

    const previousFeeRefundedMinor = donation.applicationFeeRefundedMinor ?? 0;
    const originalApplicationFeeMinor = donation.applicationFeeAmountMinor ?? 0;
    const targetFeeRefundedMinor = calculateApplicationFeeRefundMinor({
      originalApplicationFeeMinor,
      originalGrossMinor: grossAmountMinor,
      refundedGrossMinor: nextRefundedMinor,
    });
    const applicationFeeRefundMinor = Math.max(
      0,
      targetFeeRefundedMinor - previousFeeRefundedMinor,
    );

    const isFullyRefunded =
      args.isFullRefund || nextRefundedMinor >= grossAmountMinor;

    const priorPaymentStatus = donation.paymentStatus;

    await ctx.db.patch(donation._id, {
      paymentStatus: isFullyRefunded ? "refunded" : "partially_refunded",
      refundedAmountMinor: nextRefundedMinor,
      applicationFeeRefundedMinor:
        previousFeeRefundedMinor + applicationFeeRefundMinor,
    });

    if (
      donation.campaignId &&
      (priorPaymentStatus === "succeeded" ||
        priorPaymentStatus === "partially_refunded")
    ) {
      const campaign = await ctx.db.get(donation.campaignId);
      if (campaign) {
        const refundPounds = incrementalRefundMinor / 100;
        await ctx.db.patch(campaign._id, {
          raised: Math.max(0, campaign.raised - refundPounds),
          donors: isFullyRefunded
            ? Math.max(0, campaign.donors - 1)
            : campaign.donors,
        });
        await incrementCommunityRaised(
          ctx,
          campaign.creator.communityId,
          -refundPounds,
        );
      }
    }

    return { updated: true, applicationFeeRefundMinor };
  },
});

export const markDonationDisputeOpened = internalMutation({
  args: { stripePaymentIntentId: v.string() },
  handler: async (ctx, args) => {
    const donation = await ctx.db
      .query("donations")
      .withIndex("by_paymentIntent", (q) =>
        q.eq("stripePaymentIntentId", args.stripePaymentIntentId),
      )
      .unique();

    if (!donation || donation.disputeStatus === "open") {
      return { updated: false };
    }

    await ctx.db.patch(donation._id, { disputeStatus: "open" });
    return { updated: true };
  },
});

export const markDonationDisputeClosed = internalMutation({
  args: {
    stripePaymentIntentId: v.string(),
    status: v.union(v.literal("won"), v.literal("lost")),
    refundedAmountMinor: v.optional(v.number()),
    isFullRefund: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const donation = await ctx.db
      .query("donations")
      .withIndex("by_paymentIntent", (q) =>
        q.eq("stripePaymentIntentId", args.stripePaymentIntentId),
      )
      .unique();

    if (!donation) {
      return { updated: false, applicationFeeRefundMinor: 0 };
    }

    await ctx.db.patch(donation._id, { disputeStatus: args.status });

    if (args.status !== "lost" || args.refundedAmountMinor == null) {
      return { updated: true, applicationFeeRefundMinor: 0 };
    }

    const grossAmountMinor =
      donation.grossAmountMinor ?? donationAmountToStripeMinorUnits(donation.amount);
    const previousRefundedMinor = donation.refundedAmountMinor ?? 0;
    const nextRefundedMinor = Math.max(previousRefundedMinor, args.refundedAmountMinor);
    const incrementalRefundMinor = nextRefundedMinor - previousRefundedMinor;

    if (incrementalRefundMinor <= 0) {
      return { updated: true, applicationFeeRefundMinor: 0 };
    }

    const previousFeeRefundedMinor = donation.applicationFeeRefundedMinor ?? 0;
    const originalApplicationFeeMinor = donation.applicationFeeAmountMinor ?? 0;
    const targetFeeRefundedMinor = calculateApplicationFeeRefundMinor({
      originalApplicationFeeMinor,
      originalGrossMinor: grossAmountMinor,
      refundedGrossMinor: nextRefundedMinor,
    });
    const applicationFeeRefundMinor = Math.max(
      0,
      targetFeeRefundedMinor - previousFeeRefundedMinor,
    );
    const isFullyRefunded =
      args.isFullRefund ?? nextRefundedMinor >= grossAmountMinor;

    const priorPaymentStatus = donation.paymentStatus;

    await ctx.db.patch(donation._id, {
      paymentStatus: isFullyRefunded ? "refunded" : "partially_refunded",
      refundedAmountMinor: nextRefundedMinor,
      applicationFeeRefundedMinor:
        previousFeeRefundedMinor + applicationFeeRefundMinor,
    });

    if (
      donation.campaignId &&
      (priorPaymentStatus === "succeeded" ||
        priorPaymentStatus === "partially_refunded")
    ) {
      const campaign = await ctx.db.get(donation.campaignId);
      if (campaign) {
        const refundPounds = incrementalRefundMinor / 100;
        await ctx.db.patch(campaign._id, {
          raised: Math.max(0, campaign.raised - refundPounds),
          donors: isFullyRefunded
            ? Math.max(0, campaign.donors - 1)
            : campaign.donors,
        });
        await incrementCommunityRaised(
          ctx,
          campaign.creator.communityId,
          -refundPounds,
        );
      }
    }

    return { updated: true, applicationFeeRefundMinor };
  },
});

export const linkGuestDonations = internalMutation({
  args: {
    userId: v.id("users"),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const normalized = args.email.trim().toLowerCase();
    const guestDonations = await ctx.db
      .query("donations")
      .withIndex("by_donorEmail", (q) => q.eq("donorEmail", normalized))
      .collect();

    let linked = 0;
    for (const donation of guestDonations) {
      if (!donation.userId) {
        await ctx.db.patch(donation._id, { userId: args.userId });
        linked += 1;
      }
    }
    return { linked };
  },
});

export const listStalePendingDonations = internalQuery({
  args: { olderThanMs: v.number() },
  handler: async (ctx, args) => {
    const cutoff = Date.now() - args.olderThanMs;
    const donations = await ctx.db.query("donations").collect();
    return donations.filter(
      (d) => d.paymentStatus === "pending" && d.createdAt < cutoff,
    );
  },
});

export const failStalePendingDonation = internalMutation({
  args: { donationId: v.id("donations") },
  handler: async (ctx, args) => {
    const donation = await ctx.db.get(args.donationId);
    if (!donation || donation.paymentStatus !== "pending") {
      return { updated: false };
    }
    await ctx.db.patch(args.donationId, { paymentStatus: "failed" });
    return { updated: true };
  },
});
