import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { computeCampaignAfterDonation } from "./lib/applyDonationToCampaign";
import {
  DONATION_CURRENCY,
  normalizeCampaignSlug,
  validateDonationAmount,
} from "./lib/donationAmounts";
import { getProfileByUserId } from "./lib/authz";
import { isAdminIdentityEmail } from "./auth/adminConfig";
import { getRecurringDonationForUserHandler } from "./lib/stripeOwnership";
import { incrementCommunityRaised } from "./lib/aggregates";

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
      campaignId: args.campaignId,
      amount: args.amount,
      currency: DONATION_CURRENCY,
      type: "one_time",
      paymentStatus: "pending",
      stripePaymentIntentId: args.stripePaymentIntentId,
      createdAt: Date.now(),
    });
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
  args: { stripePaymentIntentId: v.string() },
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

    await ctx.db.patch(donation._id, { paymentStatus: "succeeded" });

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

    await ctx.db.insert("donations", {
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

export const getRecurringDonationForUser = internalQuery({
  args: {
    recurringDonationId: v.id("recurringDonations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const recurringDonation = await ctx.db.get(args.recurringDonationId);
    return getRecurringDonationForUserHandler({
      recurringDonation,
      callerUserId: args.userId,
    });
  },
});

export const markDonationRefunded = internalMutation({
  args: { stripePaymentIntentId: v.string() },
  handler: async (ctx, args) => {
    const donation = await ctx.db
      .query("donations")
      .withIndex("by_paymentIntent", (q) =>
        q.eq("stripePaymentIntentId", args.stripePaymentIntentId),
      )
      .unique();

    if (!donation || donation.paymentStatus !== "succeeded") {
      return { updated: false };
    }

    await ctx.db.patch(donation._id, { paymentStatus: "refunded" });

    if (donation.campaignId) {
      const campaign = await ctx.db.get(donation.campaignId);
      if (campaign) {
        await ctx.db.patch(campaign._id, {
          raised: Math.max(0, campaign.raised - donation.amount),
          donors: Math.max(0, campaign.donors - 1),
        });
        await incrementCommunityRaised(
          ctx,
          campaign.creator.communityId,
          -donation.amount,
        );
      }
    }

    return { updated: true };
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
