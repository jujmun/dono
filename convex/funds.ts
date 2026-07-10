import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { toFund } from "./lib/mappers";
import { requireAdmin } from "./lib/authz";

const placeholderFundSlugs = [
  "medical-textbooks",
  "student-hardship",
  "music-equipment",
  "sports-equipment-fund",
  "work-experience",
];

export const list = query({
  args: {},
  handler: async (ctx) => {
    const funds = await ctx.db.query("communityFunds").collect();
    return funds.map(toFund);
  },
});

export const listFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 3;
    const funds = await ctx.db.query("communityFunds").take(limit);
    return funds.map(toFund);
  },
});

export const removePlaceholderFunds = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    let deleted = 0;

    for (const slug of placeholderFundSlugs) {
      const fund = await ctx.db
        .query("communityFunds")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

      if (fund) {
        await ctx.db.delete(fund._id);
        deleted += 1;
      }
    }

    return { deleted, slugs: placeholderFundSlugs };
  },
});
