import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./lib/authz";

export const donate = mutation({
  args: {
    campaignSlug: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.campaignSlug))
      .unique();
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    await ctx.db.insert("donations", {
      userId,
      campaignId: campaign._id,
      amount: args.amount,
      createdAt: Date.now(),
    });

    const raised = campaign.raised + args.amount;
    const donors = campaign.donors + 1;
    const status =
      raised >= campaign.goal
        ? "funded"
        : campaign.status === "completed"
          ? "completed"
          : "active";

    await ctx.db.patch(campaign._id, { raised, donors, status });

    return { raised, donors, status };
  },
});

export const getDonorImpact = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);

    const donations = await ctx.db
      .query("donations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (donations.length === 0) {
      return {
        totalDonated: 0,
        campaignsSupported: 0,
        communitiesFollowed: 0,
        impactHighlights: [],
        recentDonations: [],
      };
    }

    const campaignIds = [...new Set(donations.map((d) => d.campaignId))];
    const campaigns = await Promise.all(campaignIds.map((id) => ctx.db.get(id)));
    const campaignMap = new Map(
      campaigns
        .filter((c) => c !== null)
        .map((c) => [c!._id, c!]),
    );

    const communityIds = new Set(
      campaigns
        .filter((c) => c !== null)
        .map((c) => c!.creator.communityId),
    );

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
      .filter((c) => c?.impactItems?.length)
      .slice(0, 3)
      .map((c) => {
        const item = c!.impactItems![0];
        return `Helped fund ${item} via ${c!.title}`;
      });

    return {
      totalDonated,
      campaignsSupported: campaignIds.length,
      communitiesFollowed: communityIds.size,
      impactHighlights,
      recentDonations,
    };
  },
});

export const getDonoWrapped = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);

    const donations = await ctx.db
      .query("donations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

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
