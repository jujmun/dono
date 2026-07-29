import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { requireUserId } from "./lib/authz";

function getSucceededDonations<T extends { paymentStatus: string }>(donations: T[]) {
  return donations.filter((donation) => donation.paymentStatus === "succeeded");
}

export const getDonorImpact = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);

    const donations = getSucceededDonations(
      await ctx.db
        .query("donations")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
    ).filter(
      (d): d is (typeof d & { campaignId: Id<"campaigns"> }) => Boolean(d.campaignId),
    );

    if (donations.length === 0) {
      const societyFollows = await ctx.db
        .query("communityFollows")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
      return {
        totalDonated: 0,
        campaignsSupported: 0,
        societiesFollowed: societyFollows.length,
        impactHighlights: [],
        recentDonations: [],
      };
    }

    const campaignIds = [...new Set(donations.map((d) => d.campaignId))];
    const campaigns = (await Promise.all(campaignIds.map((id) => ctx.db.get(id)))).filter(
      (c): c is Doc<"campaigns"> => c !== null,
    );
    const campaignMap = new Map(campaigns.map((c) => [c._id, c]));

    const societyFollows = await ctx.db
      .query("communityFollows")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
    const recentDonations = donations
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 8)
      .map((d) => {
        const campaign = campaignMap.get(d.campaignId);
        return {
          campaign: campaign?.title ?? "Unknown campaign",
          amount: d.amount,
          date: new Date(d.createdAt).toISOString().slice(0, 10),
        };
      });

    const impactHighlights = campaigns
      .filter((c) => c.impactItems?.length)
      .slice(0, 3)
      .map((c) => {
        const item = c.impactItems![0];
        return `Helped fund ${item} via ${c.title}`;
      });

    return {
      totalDonated,
      campaignsSupported: campaignIds.length,
      societiesFollowed: societyFollows.length,
      impactHighlights,
      recentDonations,
    };
  },
});

export const getDonoWrapped = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);

    const donations = getSucceededDonations(
      await ctx.db
        .query("donations")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
    ).filter(
      (d): d is (typeof d & { campaignId: Id<"campaigns"> }) => Boolean(d.campaignId),
    );

    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
    const campaignIds = [...new Set(donations.map((d) => d.campaignId))];
    const campaigns = await Promise.all(campaignIds.map((id) => ctx.db.get(id)));

    const societyCounts = new Map<string, number>();
    for (const campaign of campaigns) {
      if (!campaign) continue;
      const id = campaign.creator.communityId;
      societyCounts.set(id, (societyCounts.get(id) ?? 0) + 1);
    }

    let topSociety = "Your societies";
    let topCount = 0;
    for (const [societyId, count] of societyCounts) {
      if (count > topCount) {
        topCount = count;
        const community = await ctx.db
          .query("communities")
          .withIndex("by_slug", (q) => q.eq("slug", societyId))
          .unique();
        topSociety = community?.name ?? campaignSlugToName(societyId);
      }
    }

    return {
      year: new Date().getFullYear(),
      totalDonated,
      campaignsSupported: campaignIds.length,
      topSociety,
      rank:
        totalDonated >= 100
          ? "Top 15% of donors"
          : totalDonated > 0
            ? "Rising donor"
            : "Start your giving journey",
      impactStatement:
        totalDonated > 0
          ? "Your generosity is helping students access better learning resources."
          : "Make your first donation to see your impact grow throughout the year.",
    };
  },
});

function campaignSlugToName(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function firstNameFromDisplay(name: string | undefined | null): string {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return "A donor";
  return trimmed.split(/\s+/)[0] ?? "A donor";
}

function relativeTimeLabel(createdAt: number): string {
  const deltaMs = Date.now() - createdAt;
  const minutes = Math.floor(deltaMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export const listRecentForCampaign = query({
  args: {
    campaignSlug: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.campaignSlug))
      .unique();
    if (!campaign) return [];

    const limit = Math.min(Math.max(args.limit ?? 8, 1), 20);
    const donations = await ctx.db
      .query("donations")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
      .collect();

    const succeeded = donations
      .filter((d) => d.paymentStatus === "succeeded")
      .filter((d) => !d.isAnonymous)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);

    return Promise.all(
      succeeded.map(async (donation) => {
        const profile = donation.userId
          ? await ctx.db
              .query("profiles")
              .withIndex("by_userId", (q) => q.eq("userId", donation.userId!))
              .unique()
          : null;
        return {
          amount: donation.amount,
          matchedAmountPounds: donation.matchedAmountPounds ?? 0,
          displayName: firstNameFromDisplay(profile?.name),
          relativeTime: relativeTimeLabel(donation.createdAt),
          createdAt: donation.createdAt,
          viaSocietySubscription: Boolean(donation.societySubscriptionId),
        };
      }),
    );
  },
});

export const listMySocietySubscriptions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);

    const societySubscriptions = await ctx.db
      .query("societySubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const results = await Promise.all(
      societySubscriptions.map(async (societySubscription) => {
        const [society, community] = await Promise.all([
          ctx.db
            .query("societies")
            .withIndex("by_slug", (q) => q.eq("slug", societySubscription.communitySlug))
            .unique(),
          ctx.db
            .query("communities")
            .withIndex("by_slug", (q) => q.eq("slug", societySubscription.communitySlug))
            .unique(),
        ]);
        return {
          id: societySubscription._id,
          amount: societySubscription.amount,
          currency: societySubscription.currency,
          status: societySubscription.status,
          canceledReason: societySubscription.canceledReason ?? null,
          createdAt: societySubscription.createdAt,
          canceledAt: societySubscription.canceledAt,
          societyName: society?.name ?? community?.name ?? "Unknown society",
          communitySlug: societySubscription.communitySlug,
        };
      }),
    );

    return results.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/** The current user's non-canceled subscription to one specific society, if
 * any — powers the "you're subscribed £X/month" state on the society page
 * header so it doesn't just live buried in account settings. */
export const getMySocietySubscription = query({
  args: { communitySlug: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const societySubscriptions = await ctx.db
      .query("societySubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const active = societySubscriptions
      .filter(
        (s) => s.communitySlug === args.communitySlug && s.status !== "canceled",
      )
      .sort((a, b) => b.createdAt - a.createdAt)[0];

    if (!active) return null;

    return {
      id: active._id,
      amount: active.amount,
      currency: active.currency,
      status: active.status,
    };
  },
});

export const setEmailUpdateOptIn = mutation({
  args: {
    paymentIntentId: v.string(),
    optedIn: v.boolean(),
  },
  handler: async (ctx, args) => {
    const donation = await ctx.db
      .query("donations")
      .withIndex("by_paymentIntent", (q) =>
        q.eq("stripePaymentIntentId", args.paymentIntentId),
      )
      .unique();

    if (!donation) {
      throw new ConvexError({
        code: "DONATION_NOT_FOUND",
        message: "Donation not found for this payment.",
      });
    }

    const now = Date.now();
    await ctx.db.patch(donation._id, {
      emailUpdatesOptIn: args.optedIn,
      emailUpdatesOptInAt: now,
    });

    // TODO: unsubscribe flow not built yet. Unticking on a later donation
    // intentionally does not remove a prior opt-in row below — there is no
    // way for a donor to withdraw consent yet, so we don't fake one here.
    if (args.optedIn && donation.campaignId) {
      const campaignId = donation.campaignId;
      const existing = donation.userId
        ? await ctx.db
            .query("campaignUpdateOptIns")
            .withIndex("by_user_campaign", (q) =>
              q.eq("userId", donation.userId).eq("campaignId", campaignId),
            )
            .unique()
        : donation.donorEmail
          ? await ctx.db
              .query("campaignUpdateOptIns")
              .withIndex("by_donorEmail_campaign", (q) =>
                q.eq("donorEmail", donation.donorEmail).eq("campaignId", campaignId),
              )
              .unique()
          : null;

      if (existing) {
        await ctx.db.patch(existing._id, { donationId: donation._id, createdAt: now });
      } else {
        await ctx.db.insert("campaignUpdateOptIns", {
          campaignId,
          donationId: donation._id,
          userId: donation.userId,
          donorEmail: donation.donorEmail,
          createdAt: now,
        });
      }
    }

    return { ok: true };
  },
});
