import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { toCommunity } from "./lib/mappers";

const placeholderCommunitySlugs = [
  "medsoc-cambridge",
  "st-annes",
  "cs-dept",
  "uni-orchestra",
  "boat-club",
  "drama-soc",
];

export const list = query({
  args: {},
  handler: async (ctx) => {
    const communities = await ctx.db.query("communities").collect();
    return communities.map(toCommunity);
  },
});

export const listFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 3;
    const communities = await ctx.db.query("communities").take(limit);
    return communities.map(toCommunity);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const community = await ctx.db
      .query("communities")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    return community ? toCommunity(community) : null;
  },
});

export const removePlaceholderCommunities = mutation({
  args: {},
  handler: async (ctx) => {
    let deleted = 0;

    for (const slug of placeholderCommunitySlugs) {
      const community = await ctx.db
        .query("communities")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

      if (community) {
        await ctx.db.delete(community._id);
        deleted += 1;
      }
    }

    return { deleted, slugs: placeholderCommunitySlugs };
  },
});
