import { query } from "./_generated/server";
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
      const communityFollows = await ctx.db
        .query("communityFollows")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
      return {
        totalDonated: 0,
        campaignsSupported: 0,
        communitiesFollowed: communityFollows.length,
        impactHighlights: [],
        recentDonations: [],
      };
    }

    const campaignIds = [...new Set(donations.map((d) => d.campaignId))];
    const campaigns = (await Promise.all(campaignIds.map((id) => ctx.db.get(id)))).filter(
      (c): c is Doc<"campaigns"> => c !== null,
    );
    const campaignMap = new Map(campaigns.map((c) => [c._id, c]));

    const communityFollows = await ctx.db
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
      communitiesFollowed: communityFollows.length,
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

    const communityCounts = new Map<string, number>();
    for (const campaign of campaigns) {
      if (!campaign) continue;
      const id = campaign.creator.communityId;
      communityCounts.set(id, (communityCounts.get(id) ?? 0) + 1);
    }

    let topCommunity = "Your communities";
    let topCount = 0;
    for (const [communityId, count] of communityCounts) {
      if (count > topCount) {
        topCount = count;
        const community = await ctx.db
          .query("communities")
          .withIndex("by_slug", (q) => q.eq("slug", communityId))
          .unique();
        topCommunity = community?.name ?? campaignSlugToName(communityId);
      }
    }

    return {
      year: new Date().getFullYear(),
      totalDonated,
      campaignsSupported: campaignIds.length,
      topCommunity,
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

export const listMyRecurringDonations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);

    const recurringDonations = await ctx.db
      .query("recurringDonations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const results = await Promise.all(
      recurringDonations.map(async (recurringDonation) => {
        const campaign = await ctx.db.get(recurringDonation.campaignId);
        return {
          id: recurringDonation._id,
          amount: recurringDonation.amount,
          currency: recurringDonation.currency,
          status: recurringDonation.status,
          createdAt: recurringDonation.createdAt,
          canceledAt: recurringDonation.canceledAt,
          campaignTitle: campaign?.title ?? "Unknown campaign",
          campaignSlug: campaign?.slug ?? "",
        };
      }),
    );

    return results.sort((a, b) => b.createdAt - a.createdAt);
  },
});
