import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/authz";
import { throwFeatureRemoved } from "./lib/featureGates";

const placeholderFundSlugs = [
  "medical-textbooks",
  "student-hardship",
  "music-equipment",
  "sports-equipment-fund",
  "work-experience",
];

/**
 * CF-01: Community-fund (platform-account) payment path is removed.
 * Public enumeration and payment settlement must not exist. Admin cleanup
 * mutations remain so leftover seed/placeholder rows can be deleted.
 */

export const list = query({
  args: {},
  handler: async () => {
    throwFeatureRemoved(
      "Community funds",
      "Community fund donations are not available. Dono does not operate pooled platform-held funds.",
    );
  },
});

export const listPaginated = query({
  args: {
    category: v.optional(v.string()),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async () => {
    throwFeatureRemoved(
      "Community funds",
      "Community fund donations are not available. Dono does not operate pooled platform-held funds.",
    );
  },
});

export const listFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async () => {
    throwFeatureRemoved(
      "Community funds",
      "Community fund donations are not available. Dono does not operate pooled platform-held funds.",
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async () => {
    throwFeatureRemoved(
      "Community funds",
      "Community fund donations are not available. Dono does not operate pooled platform-held funds.",
    );
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.string(),
    university: v.string(),
    image: v.optional(v.string()),
  },
  handler: async () => {
    throwFeatureRemoved(
      "Community funds",
      "Community fund donations are not available. Dono does not operate pooled platform-held funds.",
    );
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

/** Admin-only: delete every communityFund row (leftover seed / legacy). */
export const deleteAllFunds = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const funds = await ctx.db.query("communityFunds").collect();
    for (const fund of funds) {
      await ctx.db.delete(fund._id);
    }
    return { deleted: funds.length };
  },
});

/** Kept so typed callers fail closed rather than falling through. */
export function assertFundsRemoved(): never {
  throw new ConvexError({
    code: "FEATURE_REMOVED",
    message:
      "Community fund donations are not available. Dono does not operate pooled platform-held funds.",
  });
}
