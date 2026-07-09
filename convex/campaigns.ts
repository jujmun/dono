import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { toCampaign } from "./lib/mappers";
import { requireAuth } from "./lib/authz";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const creatorTypeMap: Record<string, string> = {
  "Individual Student": "student",
  "Student Society": "society",
  College: "college",
  Department: "department",
  University: "department",
};

const placeholderCampaignSlugs = [
  "anatomy-models",
  "orchestra-instruments",
  "conference-travel",
  "welfare-kits",
  "sports-equipment",
  "accessibility-ramp",
];

export const list = query({
  args: {},
  handler: async (ctx) => {
    const campaigns = await ctx.db.query("campaigns").collect();
    return campaigns.map(toCampaign);
  },
});

export const listFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 3;
    const campaigns = await ctx.db.query("campaigns").take(limit);
    return campaigns.map(toCampaign);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    return campaign ? toCampaign(campaign) : null;
  },
});

export const listByCommunity = query({
  args: { communityId: v.string() },
  handler: async (ctx, args) => {
    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_community", (q) =>
        q.eq("creator.communityId", args.communityId),
      )
      .collect();
    return campaigns.map(toCampaign);
  },
});

export const listRelated = query({
  args: { slug: v.string(), category: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 2;
    const campaigns = await ctx.db
      .query("campaigns")
      .filter((q) =>
        q.and(
          q.neq(q.field("slug"), args.slug),
          q.eq(q.field("category"), args.category),
        ),
      )
      .take(limit);
    return campaigns.map(toCampaign);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    creatorType: v.string(),
    university: v.string(),
    description: v.string(),
    story: v.string(),
    goal: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const user = await ctx.db.get(userId);
    const creatorName = user?.name ?? args.creatorType;
    const creatorType = creatorTypeMap[args.creatorType] ?? "student";
    const initials = creatorName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    let baseSlug = slugify(args.title);
    let slug = baseSlug;
    let suffix = 1;
    while (
      await ctx.db
        .query("campaigns")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique()
    ) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const communityId = slugify(`${args.university}-${creatorType}`);
    const today = new Date();
    const deadline = new Date(today);
    deadline.setMonth(deadline.getMonth() + 2);

    const campaignId = await ctx.db.insert("campaigns", {
      slug,
      title: args.title,
      description: args.description,
      story: args.story,
      category: args.category,
      goal: args.goal,
      raised: 0,
      donors: 0,
      likes: 0,
      followers: 0,
      comments: 0,
      creator: {
        name: creatorName,
        type: creatorType,
        avatar: initials || "DN",
        communityId,
      },
      verifications: [{ type: "student", label: "New Campaign" }],
      university: args.university,
      image: "default",
      createdAt: today.toISOString().slice(0, 10),
      deadline: deadline.toISOString().slice(0, 10),
      status: "active",
      updates: [],
      impactItems: [],
      createdBy: userId,
    });

    return { slug, campaignId };
  },
});

export const removePlaceholderCampaigns = mutation({
  args: {},
  handler: async (ctx) => {
    let deleted = 0;

    for (const slug of placeholderCampaignSlugs) {
      const campaign = await ctx.db
        .query("campaigns")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

      if (campaign) {
        await ctx.db.delete(campaign._id);
        deleted += 1;
      }
    }

    return {
      deleted,
      slugs: placeholderCampaignSlugs,
    };
  },
});
