import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/authz";
import { toFund } from "./lib/mappers";
import { clampLimit } from "./lib/pagination";

const placeholderFundSlugs = [
  "medical-textbooks",
  "student-hardship",
  "music-equipment",
  "sports-equipment-fund",
  "work-experience",
];

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const funds = await ctx.db.query("communityFunds").collect();
    return funds.map(toFund);
  },
});

export const listPaginated = query({
  args: {
    category: v.optional(v.string()),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = clampLimit(args.limit, 20, 50);
    let funds = await ctx.db.query("communityFunds").collect();
    if (args.category) {
      funds = funds.filter((f) => f.category === args.category);
    }
    funds.sort((a, b) => b.totalRaised - a.totalRaised);

    let start = 0;
    if (args.cursor) {
      const idx = funds.findIndex((f) => f.slug === args.cursor);
      start = idx >= 0 ? idx + 1 : 0;
    }

    const page = funds.slice(start, start + limit);
    return {
      items: page.map(toFund),
      nextCursor: start + limit < funds.length ? page[page.length - 1]?.slug : null,
    };
  },
});

export const listFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = clampLimit(args.limit, 3);
    const funds = await ctx.db.query("communityFunds").take(limit);
    return funds.map(toFund);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const fund = await ctx.db
      .query("communityFunds")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    return fund ? toFund(fund) : null;
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
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const name = args.name.trim();
    const description = args.description.trim();
    const category = args.category.trim();
    const university = args.university.trim();

    if (!name || !description || !category || !university) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "All fund fields are required.",
      });
    }

    let baseSlug = slugify(name);
    let slug = baseSlug;
    let suffix = 1;
    while (
      await ctx.db
        .query("communityFunds")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique()
    ) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const fundId = await ctx.db.insert("communityFunds", {
      slug,
      name,
      description,
      category,
      totalRaised: 0,
      donors: 0,
      campaignsSupported: 0,
      image: args.image?.trim() || "default",
      university,
    });

    return { slug, fundId };
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
