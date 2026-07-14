import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { toCampaign } from "./lib/mappers";
import { requireAdmin, requireVerifiedUser } from "./lib/authz";
import { clampLimit } from "./lib/pagination";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isPublicStatus(status: string) {
  return status === "active" || status === "funded" || status === "completed";
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

const MAX_TITLE_LENGTH = 120;
const MAX_CATEGORY_LENGTH = 60;
const MAX_UNIVERSITY_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_STORY_LENGTH = 5000;
const MIN_GOAL = 1;
const MAX_GOAL = 1_000_000;

export const list = query({
  args: {},
  handler: async (ctx) => {
    const campaigns = await ctx.db.query("campaigns").collect();
    return campaigns.filter((c) => isPublicStatus(c.status)).map(toCampaign);
  },
});

export const listFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = clampLimit(args.limit, 3);
    const campaigns = await ctx.db.query("campaigns").collect();
    return campaigns
      .filter((c) => isPublicStatus(c.status))
      .slice(0, limit)
      .map(toCampaign);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign || !isPublicStatus(campaign.status)) {
      return null;
    }
    return toCampaign(campaign);
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
    return campaigns.filter((c) => isPublicStatus(c.status)).map(toCampaign);
  },
});

export const listRelated = query({
  args: { slug: v.string(), category: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = clampLimit(args.limit, 2);
    const campaigns = await ctx.db.query("campaigns").collect();
    return campaigns
      .filter(
        (c) =>
          isPublicStatus(c.status) &&
          c.slug !== args.slug &&
          c.category === args.category,
      )
      .slice(0, limit)
      .map(toCampaign);
  },
});

export const listPendingForAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const campaigns = await ctx.db.query("campaigns").collect();
    return campaigns
      .filter((c) => c.status === "pending")
      .map(toCampaign);
  },
});

async function resolveStudentProfile(
  ctx: QueryCtx,
  createdBy: Id<"users"> | undefined,
) {
  if (!createdBy) return null;
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", createdBy))
    .unique();
  if (!profile) return null;
  const storageUrl = profile.avatarStorageId
    ? await ctx.storage.getUrl(profile.avatarStorageId)
    : null;
  return {
    userId: profile.userId,
    name: profile.name ?? "",
    email: profile.email,
    avatarUrl: storageUrl ?? profile.avatarUrl ?? null,
  };
}

export const getForAdmin = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign) return null;

    const student = await resolveStudentProfile(ctx, campaign.createdBy);
    const messages = await ctx.db
      .query("campaignReviewMessages")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
      .collect();

    return {
      campaign: toCampaign(campaign),
      student,
      messages: messages
        .sort((a, b) => a.createdAt - b.createdAt)
        .map((m) => ({
          id: m._id,
          body: m.body,
          createdAt: m.createdAt,
          emailSentAt: m.emailSentAt ?? null,
        })),
    };
  },
});

export const approve = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign || campaign.status !== "pending") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending campaign not found.",
      });
    }
    await ctx.db.patch(campaign._id, { status: "active" });
    return null;
  },
});

export const reject = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign || campaign.status !== "pending") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending campaign not found.",
      });
    }
    await ctx.db.patch(campaign._id, { status: "rejected" });
    return null;
  },
});

/** Remove a live campaign from public browse (active/funded/completed → rejected). */
export const takeDown = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign || !isPublicStatus(campaign.status)) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Published campaign not found.",
      });
    }
    await ctx.db.patch(campaign._id, { status: "rejected" });
    return null;
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
    const { userId } = await requireVerifiedUser(ctx);
    const title = args.title.trim();
    const category = args.category.trim();
    const creatorTypeInput = args.creatorType.trim();
    const university = args.university.trim();
    const description = args.description.trim();
    const story = args.story.trim();

    if (!title || title.length > MAX_TITLE_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Title is required and must be at most 120 characters.",
      });
    }
    if (!category || category.length > MAX_CATEGORY_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Category is required and must be at most 60 characters.",
      });
    }
    if (!university || university.length > MAX_UNIVERSITY_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "University is required and must be at most 120 characters.",
      });
    }
    if (!description || description.length > MAX_DESCRIPTION_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Description is required and must be at most 500 characters.",
      });
    }
    if (!story || story.length > MAX_STORY_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Story is required and must be at most 5000 characters.",
      });
    }
    if (!Number.isFinite(args.goal) || args.goal < MIN_GOAL || args.goal > MAX_GOAL) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Goal must be between 1 and 1,000,000.",
      });
    }

    const user = await ctx.db.get(userId);
    const creatorName = user?.name ?? creatorTypeInput;
    const creatorType = creatorTypeMap[creatorTypeInput] ?? "student";
    const initials = creatorName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    let baseSlug = slugify(title);
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

    const communityId = slugify(`${university}-${creatorType}`);
    const today = new Date();
    const deadline = new Date(today);
    deadline.setMonth(deadline.getMonth() + 2);

    const campaignId = await ctx.db.insert("campaigns", {
      slug,
      title,
      description,
      story,
      category,
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
      university,
      image: "default",
      createdAt: today.toISOString().slice(0, 10),
      deadline: deadline.toISOString().slice(0, 10),
      status: "pending",
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
    await requireAdmin(ctx);
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
