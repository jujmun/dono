import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import {
  requireRecordOwner,
  requireSocietyLeader,
  requireVerifiedUser,
} from "./lib/authz";
import { toCampaign } from "./lib/mappers";
import {
  assertNotRateLimited,
  recordRateLimitAttempt,
} from "./auth/rateLimit";

const MAX_TITLE_LENGTH = 120;
const MAX_CATEGORY_LENGTH = 60;
const MAX_UNIVERSITY_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_STORY_LENGTH = 5000;
const MAX_UPDATE_TITLE = 120;
const MAX_UPDATE_CONTENT = 5000;
const MIN_GOAL = 1;
const MAX_GOAL = 1_000_000;
const MAX_REASON_LENGTH = 1000;

const IMAGE_UPLOAD_LIMIT = {
  maxAttempts: 10,
  windowMs: 15 * 60 * 1000,
  lockoutMs: 15 * 60 * 1000,
};

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireVerifiedUser(ctx);
    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", userId))
      .collect();
    return campaigns
      .sort((a, b) => b._creationTime - a._creationTime)
      .map(toCampaign);
  },
});

export const update = mutation({
  args: {
    slug: v.string(),
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    university: v.optional(v.string()),
    description: v.optional(v.string()),
    story: v.optional(v.string()),
    goal: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!campaign) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Campaign not found." });
    }
    await requireRecordOwner(ctx, campaign.createdBy);
    if (campaign.status !== "pending" && campaign.status !== "rejected") {
      throw new ConvexError({
        code: "INVALID_STATE",
        message: "Only pending or rejected campaigns can be edited.",
      });
    }

    const patch: Record<string, unknown> = {};
    if (args.title !== undefined) {
      const title = args.title.trim();
      if (!title || title.length > MAX_TITLE_LENGTH) {
        throw new ConvexError({ code: "INVALID_INPUT", message: "Invalid title." });
      }
      patch.title = title;
    }
    if (args.category !== undefined) {
      const category = args.category.trim();
      if (!category || category.length > MAX_CATEGORY_LENGTH) {
        throw new ConvexError({ code: "INVALID_INPUT", message: "Invalid category." });
      }
      patch.category = category;
    }
    if (args.university !== undefined) {
      const university = args.university.trim();
      if (!university || university.length > MAX_UNIVERSITY_LENGTH) {
        throw new ConvexError({ code: "INVALID_INPUT", message: "Invalid university." });
      }
      patch.university = university;
    }
    if (args.description !== undefined) {
      const description = args.description.trim();
      if (!description || description.length > MAX_DESCRIPTION_LENGTH) {
        throw new ConvexError({ code: "INVALID_INPUT", message: "Invalid description." });
      }
      patch.description = description;
    }
    if (args.story !== undefined) {
      const story = args.story.trim();
      if (!story || story.length > MAX_STORY_LENGTH) {
        throw new ConvexError({ code: "INVALID_INPUT", message: "Invalid story." });
      }
      patch.story = story;
    }
    if (args.goal !== undefined) {
      if (!Number.isFinite(args.goal) || args.goal < MIN_GOAL || args.goal > MAX_GOAL) {
        throw new ConvexError({ code: "INVALID_INPUT", message: "Invalid goal." });
      }
      patch.goal = args.goal;
    }

    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(campaign._id, patch);
    }
    return null;
  },
});

export const resubmit = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!campaign || campaign.status !== "rejected") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Rejected campaign not found.",
      });
    }
    await requireRecordOwner(ctx, campaign.createdBy);

    await ctx.db.patch(campaign._id, {
      status: "pending",
      moderationNote: undefined,
      moderatedAt: undefined,
      moderatedBy: undefined,
      moderationAction: undefined,
      ...(campaign.creator.type === "society"
        ? { societyApprovalStatus: "pending" as const }
        : {}),
    });
    return null;
  },
});

export const publishUpdate = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, profile } = await requireVerifiedUser(ctx);
    const title = args.title.trim();
    const content = args.content.trim();
    if (!title || title.length > MAX_UPDATE_TITLE) {
      throw new ConvexError({ code: "INVALID_INPUT", message: "Invalid update title." });
    }
    if (!content || content.length > MAX_UPDATE_CONTENT) {
      throw new ConvexError({ code: "INVALID_INPUT", message: "Invalid update content." });
    }

    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Campaign not found." });
    }
    await requireRecordOwner(ctx, campaign.createdBy);
    if (campaign.status !== "active" && campaign.status !== "funded") {
      throw new ConvexError({
        code: "INVALID_STATE",
        message: "Updates can only be posted on live campaigns.",
      });
    }

    const update = {
      id: `u-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      title,
      content,
    };

    await ctx.db.patch(campaign._id, {
      updates: [...campaign.updates, update],
    });

    const name = profile?.name ?? "Campaign creator";
    const avatar =
      name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "DN";

    await ctx.scheduler.runAfter(0, internal.activity.recordCampaignUpdate, {
      userName: name,
      userAvatar: avatar,
      campaignTitle: campaign.title,
      updateTitle: title,
    });

    return { updateId: update.id };
  },
});

export const generateImageUploadUrl = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Campaign not found." });
    }
    await requireRecordOwner(ctx, campaign.createdBy);

    const opts = { key: `campaignImage:${userId}`, ...IMAGE_UPLOAD_LIMIT };
    await assertNotRateLimited(ctx, opts);
    await recordRateLimitAttempt(ctx, opts, false);
    return await ctx.storage.generateUploadUrl();
  },
});

export const setImage = mutation({
  args: {
    slug: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Campaign not found." });
    }
    await requireRecordOwner(ctx, campaign.createdBy);

    const metadata = await ctx.db.system.get("_storage", args.storageId);
    if (!metadata) {
      throw new ConvexError({ code: "INVALID_INPUT", message: "Image not found." });
    }
    if (metadata.contentType && !metadata.contentType.startsWith("image/")) {
      throw new ConvexError({ code: "INVALID_INPUT", message: "File must be an image." });
    }

    const owner = await ctx.db
      .query("storageOwners")
      .withIndex("by_storageId", (q) => q.eq("storageId", args.storageId))
      .unique();
    if (owner && owner.userId !== userId) {
      throw new ConvexError({ code: "FORBIDDEN", message: "Invalid image ownership." });
    }
    if (!owner) {
      await ctx.db.insert("storageOwners", {
        userId,
        storageId: args.storageId,
        createdAt: Date.now(),
      });
    }

    const url = await ctx.storage.getUrl(args.storageId);
    await ctx.db.patch(campaign._id, {
      imageStorageId: args.storageId,
      image: url ?? "default",
    });
    return null;
  },
});

const MAX_CAMPAIGN_IMAGES = 5;

export const setImages = mutation({
  args: {
    slug: v.string(),
    storageIds: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    if (args.storageIds.length === 0 || args.storageIds.length > MAX_CAMPAIGN_IMAGES) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: `Provide between 1 and ${MAX_CAMPAIGN_IMAGES} images.`,
      });
    }

    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Campaign not found." });
    }
    await requireRecordOwner(ctx, campaign.createdBy);

    const urls: string[] = [];
    for (const storageId of args.storageIds) {
      const metadata = await ctx.db.system.get("_storage", storageId);
      if (!metadata) {
        throw new ConvexError({ code: "INVALID_INPUT", message: "Image not found." });
      }
      if (metadata.contentType && !metadata.contentType.startsWith("image/")) {
        throw new ConvexError({ code: "INVALID_INPUT", message: "File must be an image." });
      }

      const owner = await ctx.db
        .query("storageOwners")
        .withIndex("by_storageId", (q) => q.eq("storageId", storageId))
        .unique();
      if (owner && owner.userId !== userId) {
        throw new ConvexError({ code: "FORBIDDEN", message: "Invalid image ownership." });
      }
      if (!owner) {
        await ctx.db.insert("storageOwners", {
          userId,
          storageId,
          createdAt: Date.now(),
        });
      }

      const url = await ctx.storage.getUrl(storageId);
      urls.push(url ?? "default");
    }

    await ctx.db.patch(campaign._id, {
      imageStorageIds: args.storageIds,
      images: urls,
      imageStorageId: args.storageIds[0],
      image: urls[0] ?? "default",
    });
    return null;
  },
});

const MIN_IMPACT_ITEMS = 2;
const MAX_IMPACT_ITEMS = 5;
const IMPACT_ITEM_DELIMITER = "::";

function parseEncodedImpactItem(item: string) {
  const idx = item.lastIndexOf(IMPACT_ITEM_DELIMITER);
  if (idx === -1) {
    return { label: item.trim(), amount: null as number | null };
  }
  const label = item.slice(0, idx).trim();
  const amount = Number(item.slice(idx + IMPACT_ITEM_DELIMITER.length));
  return {
    label,
    amount: Number.isFinite(amount) ? amount : null,
  };
}

export const setImpactItems = mutation({
  args: {
    slug: v.string(),
    impactItems: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    if (
      args.impactItems.length < MIN_IMPACT_ITEMS ||
      args.impactItems.length > MAX_IMPACT_ITEMS
    ) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: `Provide between ${MIN_IMPACT_ITEMS} and ${MAX_IMPACT_ITEMS} fund line items.`,
      });
    }

    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Campaign not found." });
    }
    await requireRecordOwner(ctx, campaign.createdBy);

    const parsed = args.impactItems.map(parseEncodedImpactItem);
    if (parsed.some((item) => !item.label || item.amount === null || item.amount <= 0)) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Each fund line item needs a label and a positive amount.",
      });
    }

    const total = parsed.reduce((sum, item) => sum + (item.amount ?? 0), 0);
    if (total !== campaign.goal) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Fund line items must add up to the campaign goal.",
      });
    }

    await ctx.db.patch(campaign._id, { impactItems: args.impactItems });
    return null;
  },
});

export const listPendingForSocietyLeader = query({
  args: { communitySlug: v.string() },
  handler: async (ctx, args) => {
    await requireSocietyLeader(ctx, args.communitySlug);
    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_society_approval", (q) => q.eq("societyApprovalStatus", "pending"))
      .collect();
    return campaigns
      .filter((c) => c.creator.communityId === args.communitySlug)
      .map(toCampaign);
  },
});

export const approveBySociety = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign || campaign.societyApprovalStatus !== "pending") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending society campaign not found.",
      });
    }

    const { userId } = await requireSocietyLeader(ctx, campaign.creator.communityId);
    await ctx.db.patch(campaign._id, {
      societyApprovalStatus: "approved",
      societyApprovedAt: Date.now(),
      societyApprovedBy: userId,
      societyRejectionNote: undefined,
    });
    return null;
  },
});

export const rejectBySociety = mutation({
  args: { slug: v.string(), reason: v.string() },
  handler: async (ctx, args) => {
    const reason = args.reason.trim();
    if (!reason || reason.length > MAX_REASON_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "A reason between 1 and 1000 characters is required.",
      });
    }

    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign || campaign.societyApprovalStatus !== "pending") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending society campaign not found.",
      });
    }

    const { userId } = await requireSocietyLeader(ctx, campaign.creator.communityId);
    await ctx.db.patch(campaign._id, {
      societyApprovalStatus: "rejected",
      societyApprovedAt: Date.now(),
      societyApprovedBy: userId,
      societyRejectionNote: reason,
    });
    return null;
  },
});

export const archive = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Campaign not found." });
    }
    await requireRecordOwner(ctx, campaign.createdBy);
    if (campaign.status !== "active" && campaign.status !== "funded") {
      throw new ConvexError({
        code: "INVALID_STATE",
        message: "Only live campaigns can be archived.",
      });
    }
    await ctx.db.patch(campaign._id, { status: "completed" });
    return null;
  },
});
