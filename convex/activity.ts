import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { requireAdmin } from "./lib/authz";
import { toActivityItem } from "./lib/mappers";
import { clampLimit } from "./lib/pagination";

const placeholderActivitySlugs = ["a1", "a2", "a3", "a4", "a5", "a6"];

function activitySlug(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowTimestamp() {
  return new Date().toISOString();
}

async function insertActivity(
  ctx: MutationCtx,
  item: {
    type: "donation" | "campaign" | "follow" | "update" | "match";
    user: string;
    avatar: string;
    action: string;
    target: string;
    amount?: number;
  },
) {
  await ctx.db.insert("activityItems", {
    slug: activitySlug(item.type),
    type: item.type,
    user: item.user,
    avatar: item.avatar,
    action: item.action,
    target: item.target,
    amount: item.amount,
    timestamp: nowTimestamp(),
  });
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("activityItems").collect();
    return items
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .map(toActivityItem);
  },
});

export const listPaginated = query({
  args: { cursor: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = clampLimit(args.limit, 20, 50);
    const items = await ctx.db.query("activityItems").collect();
    const sorted = items.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    let start = 0;
    if (args.cursor) {
      const idx = sorted.findIndex((i) => i.slug === args.cursor);
      start = idx >= 0 ? idx + 1 : 0;
    }

    const page = sorted.slice(start, start + limit);
    const nextCursor =
      start + limit < sorted.length ? page[page.length - 1]?.slug : null;

    return {
      items: page.map(toActivityItem),
      nextCursor: nextCursor ?? null,
    };
  },
});

export const recordDonation = internalMutation({
  args: {
    userName: v.string(),
    userAvatar: v.string(),
    campaignTitle: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    await insertActivity(ctx, {
      type: "donation",
      user: args.userName,
      avatar: args.userAvatar,
      action: "donated to",
      target: args.campaignTitle,
      amount: args.amount,
    });
  },
});

export const recordCampaignLaunched = internalMutation({
  args: {
    userName: v.string(),
    userAvatar: v.string(),
    campaignTitle: v.string(),
  },
  handler: async (ctx, args) => {
    await insertActivity(ctx, {
      type: "campaign",
      user: args.userName,
      avatar: args.userAvatar,
      action: "launched",
      target: args.campaignTitle,
    });
  },
});

export const recordFollow = internalMutation({
  args: {
    userName: v.string(),
    userAvatar: v.string(),
    targetName: v.string(),
  },
  handler: async (ctx, args) => {
    await insertActivity(ctx, {
      type: "follow",
      user: args.userName,
      avatar: args.userAvatar,
      action: "followed",
      target: args.targetName,
    });
  },
});

export const recordCampaignUpdate = internalMutation({
  args: {
    userName: v.string(),
    userAvatar: v.string(),
    campaignTitle: v.string(),
    updateTitle: v.string(),
  },
  handler: async (ctx, args) => {
    await insertActivity(ctx, {
      type: "update",
      user: args.userName,
      avatar: args.userAvatar,
      action: `posted "${args.updateTitle}" on`,
      target: args.campaignTitle,
    });
  },
});

export const removePlaceholderActivity = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    let deleted = 0;

    for (const slug of placeholderActivitySlugs) {
      const item = await ctx.db
        .query("activityItems")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

      if (item) {
        await ctx.db.delete(item._id);
        deleted += 1;
      }
    }

    return { deleted, slugs: placeholderActivitySlugs };
  },
});
