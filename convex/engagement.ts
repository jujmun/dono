import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import {
  optionalUserId,
  requireVerifiedUser,
} from "./lib/authz";
import { toCampaign } from "./lib/mappers";
import { clampLimit } from "./lib/pagination";
import { toActivityItem } from "./lib/mappers";

const MAX_COMMENT_LENGTH = 2000;

async function getCampaignBySlug(ctx: QueryCtx | MutationCtx, slug: string) {
  return await ctx.db
    .query("campaigns")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();
}

async function getCommunityBySlug(ctx: QueryCtx | MutationCtx, slug: string) {
  return await ctx.db
    .query("communities")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();
}

async function profileDisplay(ctx: QueryCtx | MutationCtx, userId: Id<"users">) {
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
  const user = await ctx.db.get(userId);
  const name = profile?.name ?? (user && "name" in user ? user.name : undefined) ?? "Someone";
  const avatar =
    profile?.name
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "DN";
  return { name, avatar };
}

function activitySlug(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const followCampaign = mutation({
  args: { campaignSlug: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const campaign = await getCampaignBySlug(ctx, args.campaignSlug);
    if (!campaign) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Campaign not found." });
    }

    const existing = await ctx.db
      .query("campaignFollows")
      .withIndex("by_campaign_user", (q) =>
        q.eq("campaignSlug", args.campaignSlug).eq("userId", userId),
      )
      .unique();

    if (existing) return { following: true };

    await ctx.db.insert("campaignFollows", {
      userId,
      campaignSlug: args.campaignSlug,
      createdAt: Date.now(),
    });
    await ctx.db.patch(campaign._id, { followers: campaign.followers + 1 });

    const display = await profileDisplay(ctx, userId);
    await ctx.scheduler.runAfter(0, internal.activity.recordFollow, {
      userName: display.name,
      userAvatar: display.avatar,
      targetName: campaign.title,
    });

    return { following: true };
  },
});

export const unfollowCampaign = mutation({
  args: { campaignSlug: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const existing = await ctx.db
      .query("campaignFollows")
      .withIndex("by_campaign_user", (q) =>
        q.eq("campaignSlug", args.campaignSlug).eq("userId", userId),
      )
      .unique();
    if (!existing) return { following: false };

    const campaign = await getCampaignBySlug(ctx, args.campaignSlug);
    await ctx.db.delete(existing._id);
    if (campaign) {
      await ctx.db.patch(campaign._id, {
        followers: Math.max(0, campaign.followers - 1),
      });
    }
    return { following: false };
  },
});

export const likeCampaign = mutation({
  args: { campaignSlug: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const campaign = await getCampaignBySlug(ctx, args.campaignSlug);
    if (!campaign) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Campaign not found." });
    }

    const existing = await ctx.db
      .query("campaignLikes")
      .withIndex("by_campaign_user", (q) =>
        q.eq("campaignSlug", args.campaignSlug).eq("userId", userId),
      )
      .unique();

    if (existing) return { liked: true };

    await ctx.db.insert("campaignLikes", {
      userId,
      campaignSlug: args.campaignSlug,
      createdAt: Date.now(),
    });
    await ctx.db.patch(campaign._id, { likes: campaign.likes + 1 });
    return { liked: true };
  },
});

export const unlikeCampaign = mutation({
  args: { campaignSlug: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const existing = await ctx.db
      .query("campaignLikes")
      .withIndex("by_campaign_user", (q) =>
        q.eq("campaignSlug", args.campaignSlug).eq("userId", userId),
      )
      .unique();
    if (!existing) return { liked: false };

    const campaign = await getCampaignBySlug(ctx, args.campaignSlug);
    await ctx.db.delete(existing._id);
    if (campaign) {
      await ctx.db.patch(campaign._id, {
        likes: Math.max(0, campaign.likes - 1),
      });
    }
    return { liked: false };
  },
});

export const followCommunity = mutation({
  args: { communitySlug: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const community = await getCommunityBySlug(ctx, args.communitySlug);
    if (!community) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Community not found." });
    }

    const existing = await ctx.db
      .query("communityFollows")
      .withIndex("by_community_user", (q) =>
        q.eq("communitySlug", args.communitySlug).eq("userId", userId),
      )
      .unique();

    if (existing) return { following: true };

    await ctx.db.insert("communityFollows", {
      userId,
      communitySlug: args.communitySlug,
      createdAt: Date.now(),
    });
    await ctx.db.patch(community._id, { followers: community.followers + 1 });

    const display = await profileDisplay(ctx, userId);
    await ctx.scheduler.runAfter(0, internal.activity.recordFollow, {
      userName: display.name,
      userAvatar: display.avatar,
      targetName: community.name,
    });

    return { following: true };
  },
});

export const unfollowCommunity = mutation({
  args: { communitySlug: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const existing = await ctx.db
      .query("communityFollows")
      .withIndex("by_community_user", (q) =>
        q.eq("communitySlug", args.communitySlug).eq("userId", userId),
      )
      .unique();
    if (!existing) return { following: false };

    const community = await getCommunityBySlug(ctx, args.communitySlug);
    await ctx.db.delete(existing._id);
    if (community) {
      await ctx.db.patch(community._id, {
        followers: Math.max(0, community.followers - 1),
      });
    }
    return { following: false };
  },
});

export const addComment = mutation({
  args: { campaignSlug: v.string(), body: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const body = args.body.trim();
    if (!body || body.length > MAX_COMMENT_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Comment must be between 1 and 2000 characters.",
      });
    }

    const campaign = await getCampaignBySlug(ctx, args.campaignSlug);
    if (!campaign) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Campaign not found." });
    }

    const commentId = await ctx.db.insert("campaignComments", {
      campaignSlug: args.campaignSlug,
      userId,
      body,
      createdAt: Date.now(),
    });
    await ctx.db.patch(campaign._id, { comments: campaign.comments + 1 });

    return { commentId };
  },
});

export const deleteComment = mutation({
  args: { commentId: v.id("campaignComments") },
  handler: async (ctx, args) => {
    const { userId, profile } = await requireVerifiedUser(ctx);
    const comment = await ctx.db.get(args.commentId);
    if (!comment || comment.deletedAt) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Comment not found." });
    }

    const isAdmin = profile?.role === "admin";
    if (comment.userId !== userId && !isAdmin) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You cannot delete this comment.",
      });
    }

    const campaign = await getCampaignBySlug(ctx, comment.campaignSlug);
    await ctx.db.patch(args.commentId, { deletedAt: Date.now() });
    if (campaign) {
      await ctx.db.patch(campaign._id, {
        comments: Math.max(0, campaign.comments - 1),
      });
    }
    return null;
  },
});

export const listComments = query({
  args: { campaignSlug: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = clampLimit(args.limit, 50, 100);
    const comments = await ctx.db
      .query("campaignComments")
      .withIndex("by_campaign", (q) => q.eq("campaignSlug", args.campaignSlug))
      .collect();

    const active = comments
      .filter((c) => !c.deletedAt)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);

    const enriched = [];
    for (const comment of active) {
      const display = await profileDisplay(ctx, comment.userId);
      enriched.push({
        id: comment._id,
        body: comment.body,
        createdAt: comment.createdAt,
        authorName: display.name,
        authorAvatar: display.avatar,
      });
    }
    return enriched;
  },
});

export const listFollowedCampaigns = query({
  args: {},
  handler: async (ctx) => {
    const userId = await optionalUserId(ctx);
    if (!userId) return [];

    const follows = await ctx.db
      .query("campaignFollows")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const campaigns = [];
    for (const follow of follows) {
      const campaign = await getCampaignBySlug(ctx, follow.campaignSlug);
      if (campaign) campaigns.push(toCampaign(campaign));
    }
    return campaigns.sort((a, b) => a.title.localeCompare(b.title));
  },
});

export const listFollowedCommunities = query({
  args: {},
  handler: async (ctx) => {
    const userId = await optionalUserId(ctx);
    if (!userId) return [];

    const follows = await ctx.db
      .query("communityFollows")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return follows.map((f) => f.communitySlug);
  },
});

export const countFollowedCommunities = query({
  args: {},
  handler: async (ctx) => {
    const userId = await optionalUserId(ctx);
    if (!userId) return 0;
    const follows = await ctx.db
      .query("communityFollows")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return follows.length;
  },
});

export const isFollowing = query({
  args: {
    campaignSlug: v.optional(v.string()),
    communitySlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await optionalUserId(ctx);
    if (!userId) {
      return { followingCampaign: false, followingCommunity: false, liked: false };
    }

    let followingCampaign = false;
    let followingCommunity = false;
    let liked = false;

    if (args.campaignSlug) {
      const cf = await ctx.db
        .query("campaignFollows")
        .withIndex("by_campaign_user", (q) =>
          q.eq("campaignSlug", args.campaignSlug!).eq("userId", userId),
        )
        .unique();
      followingCampaign = Boolean(cf);

      const cl = await ctx.db
        .query("campaignLikes")
        .withIndex("by_campaign_user", (q) =>
          q.eq("campaignSlug", args.campaignSlug!).eq("userId", userId),
        )
        .unique();
      liked = Boolean(cl);
    }

    if (args.communitySlug) {
      const cm = await ctx.db
        .query("communityFollows")
        .withIndex("by_community_user", (q) =>
          q.eq("communitySlug", args.communitySlug!).eq("userId", userId),
        )
        .unique();
      followingCommunity = Boolean(cm);
    }

    return { followingCampaign, followingCommunity, liked };
  },
});
