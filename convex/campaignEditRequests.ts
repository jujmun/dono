import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { requireAdmin, requireRecordOwner, requireVerifiedUser } from "./lib/authz";
import { isAllowedCampaignCategory } from "./lib/campaignCategories";
import { isValidCampaignTemplateId } from "./lib/campaignTemplates";
import { createNotification } from "./lib/notifications";
import { parseCampaignVideoUrl } from "./lib/videoUrl";

const MAX_TITLE_LENGTH = 120;
const MAX_CATEGORY_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_STORY_LENGTH = 5000;
const MAX_ADDITIONAL_NOTES_LENGTH = 2000;
const MAX_OWNERSHIP_STATEMENT = 2000;
const MAX_UPDATE_SCHEDULE = 2000;
const MAX_NOTE = 2000;
const MIN_GOAL = 1;
const MAX_GOAL = 1_000_000;

const proposedFields = v.object({
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  story: v.optional(v.string()),
  category: v.optional(v.string()),
  goal: v.optional(v.number()),
  template: v.optional(v.string()),
  additionalNotes: v.optional(v.string()),
  expectedExpenditureDate: v.optional(v.string()),
  plannedUpdateSchedule: v.optional(v.string()),
  ownershipStatement: v.optional(v.string()),
  videoUrl: v.optional(v.string()),
  impactItems: v.optional(v.array(v.string())),
});

type Proposed = {
  title?: string;
  description?: string;
  story?: string;
  category?: string;
  goal?: number;
  template?: string;
  additionalNotes?: string;
  expectedExpenditureDate?: string;
  plannedUpdateSchedule?: string;
  ownershipStatement?: string;
  videoUrl?: string;
  impactItems?: string[];
};

function canProposeForStatus(status: string) {
  return status === "active" || status === "funded";
}

function normalizeProposed(raw: Proposed): Proposed {
  const proposed: Proposed = {};

  if (raw.title !== undefined) {
    const title = raw.title.trim();
    if (!title || title.length > MAX_TITLE_LENGTH) {
      throw new ConvexError({ code: "INVALID_INPUT", message: "Invalid title." });
    }
    proposed.title = title;
  }
  if (raw.description !== undefined) {
    const description = raw.description.trim();
    if (!description || description.length > MAX_DESCRIPTION_LENGTH) {
      throw new ConvexError({ code: "INVALID_INPUT", message: "Invalid description." });
    }
    proposed.description = description;
  }
  if (raw.story !== undefined) {
    const story = raw.story.trim();
    if (!story || story.length > MAX_STORY_LENGTH) {
      throw new ConvexError({ code: "INVALID_INPUT", message: "Invalid story." });
    }
    proposed.story = story;
  }
  if (raw.category !== undefined) {
    const category = raw.category.trim();
    if (!category || category.length > MAX_CATEGORY_LENGTH) {
      throw new ConvexError({ code: "INVALID_INPUT", message: "Invalid category." });
    }
    if (!isAllowedCampaignCategory(category)) {
      throw new ConvexError({
        code: "PROHIBITED_CATEGORY",
        message: "This campaign category is not permitted under the Terms.",
      });
    }
    proposed.category = category;
  }
  if (raw.goal !== undefined) {
    if (!Number.isFinite(raw.goal) || raw.goal < MIN_GOAL || raw.goal > MAX_GOAL) {
      throw new ConvexError({ code: "INVALID_INPUT", message: "Invalid goal." });
    }
    proposed.goal = raw.goal;
  }
  if (raw.template !== undefined) {
    if (!isValidCampaignTemplateId(raw.template)) {
      throw new ConvexError({ code: "INVALID_INPUT", message: "Invalid template selection." });
    }
    proposed.template = raw.template;
  }
  if (raw.additionalNotes !== undefined) {
    const additionalNotes = raw.additionalNotes.trim();
    if (additionalNotes.length > MAX_ADDITIONAL_NOTES_LENGTH) {
      throw new ConvexError({ code: "INVALID_INPUT", message: "Invalid additional notes." });
    }
    proposed.additionalNotes = additionalNotes;
  }
  if (raw.expectedExpenditureDate !== undefined) {
    const expectedExpenditureDate = raw.expectedExpenditureDate.trim();
    if (
      expectedExpenditureDate &&
      !/^\d{4}-\d{2}-\d{2}$/.test(expectedExpenditureDate)
    ) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "expectedExpenditureDate must be YYYY-MM-DD.",
      });
    }
    proposed.expectedExpenditureDate = expectedExpenditureDate;
  }
  if (raw.plannedUpdateSchedule !== undefined) {
    const plannedUpdateSchedule = raw.plannedUpdateSchedule.trim();
    if (plannedUpdateSchedule.length > MAX_UPDATE_SCHEDULE) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Invalid planned update schedule.",
      });
    }
    proposed.plannedUpdateSchedule = plannedUpdateSchedule;
  }
  if (raw.ownershipStatement !== undefined) {
    const ownershipStatement = raw.ownershipStatement.trim();
    if (ownershipStatement.length > MAX_OWNERSHIP_STATEMENT) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Invalid ownership statement.",
      });
    }
    proposed.ownershipStatement = ownershipStatement;
  }
  if (raw.videoUrl !== undefined) {
    const trimmed = raw.videoUrl.trim();
    if (!trimmed) {
      proposed.videoUrl = "";
    } else {
      const parsed = parseCampaignVideoUrl(trimmed);
      if (!parsed) {
        throw new ConvexError({
          code: "INVALID_INPUT",
          message: "Video URL must be a valid YouTube or Vimeo link.",
        });
      }
      proposed.videoUrl = parsed.watchUrl;
    }
  }
  if (raw.impactItems !== undefined) {
    proposed.impactItems = raw.impactItems.map((item) => item.trim()).filter(Boolean);
  }

  if (Object.keys(proposed).length === 0) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: "No changes to submit.",
    });
  }

  return proposed;
}

function currentSnapshot(campaign: Doc<"campaigns">) {
  return {
    title: campaign.title,
    description: campaign.description,
    story: campaign.story,
    category: campaign.category,
    goal: campaign.goal,
    template: campaign.template,
    additionalNotes: campaign.additionalNotes ?? "",
    expectedExpenditureDate: campaign.expectedExpenditureDate ?? "",
    plannedUpdateSchedule: campaign.plannedUpdateSchedule ?? "",
    ownershipStatement: campaign.ownershipStatement ?? "",
    videoUrl: campaign.videoUrl ?? "",
    impactItems: campaign.impactItems ?? [],
  };
}

async function replacePendingRequest(
  ctx: MutationCtx,
  campaignId: Id<"campaigns">,
  requestedBy: Id<"users">,
  proposed: Proposed,
) {
  const existing = await ctx.db
    .query("campaignEditRequests")
    .withIndex("by_campaign", (q) => q.eq("campaignId", campaignId))
    .collect();
  for (const row of existing) {
    if (row.status === "pending") {
      await ctx.db.delete(row._id);
    }
  }
  return await ctx.db.insert("campaignEditRequests", {
    campaignId,
    requestedBy,
    proposed,
    status: "pending" as const,
    createdAt: Date.now(),
  });
}

export const propose = mutation({
  args: {
    slug: v.string(),
    proposed: proposedFields,
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
    if (!canProposeForStatus(campaign.status)) {
      throw new ConvexError({
        code: "INVALID_STATE",
        message: "Only live campaigns can propose edits for admin review.",
      });
    }

    const proposed = normalizeProposed(args.proposed);

    const requestId = await replacePendingRequest(
      ctx,
      campaign._id,
      userId,
      proposed,
    );

    const admins = await ctx.db
      .query("profiles")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .collect();
    const message = `Campaign '${campaign.title}' has proposed edits awaiting review.`;
    for (const admin of admins) {
      await createNotification(ctx, {
        userId: admin.userId,
        type: "campaign_resubmitted",
        message,
        relatedEntityType: "campaign",
        relatedEntityId: campaign.slug,
      });
    }

    return { requestId };
  },
});

export const adminReview = mutation({
  args: {
    requestId: v.id("campaignEditRequests"),
    decision: v.union(v.literal("approve"), v.literal("reject")),
    reviewNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const request = await ctx.db.get(args.requestId);
    if (!request || request.status !== "pending") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending edit request not found.",
      });
    }

    const campaign = await ctx.db.get(request.campaignId);
    if (!campaign) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Campaign not found." });
    }

    const reviewNote = args.reviewNote?.trim();
    if (reviewNote && reviewNote.length > MAX_NOTE) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Review note must be at most 2000 characters.",
      });
    }

    const now = Date.now();
    if (args.decision === "approve") {
      const patch: Record<string, unknown> = {};
      const p = request.proposed;
      if (p.title !== undefined) patch.title = p.title;
      if (p.description !== undefined) patch.description = p.description;
      if (p.story !== undefined) patch.story = p.story;
      if (p.category !== undefined) patch.category = p.category;
      if (p.goal !== undefined) patch.goal = p.goal;
      if (p.template !== undefined) patch.template = p.template;
      if (p.additionalNotes !== undefined) {
        patch.additionalNotes = p.additionalNotes || undefined;
      }
      if (p.expectedExpenditureDate !== undefined) {
        patch.expectedExpenditureDate = p.expectedExpenditureDate || undefined;
      }
      if (p.plannedUpdateSchedule !== undefined) {
        patch.plannedUpdateSchedule = p.plannedUpdateSchedule || undefined;
      }
      if (p.ownershipStatement !== undefined) {
        patch.ownershipStatement = p.ownershipStatement || undefined;
      }
      if (p.videoUrl !== undefined) {
        patch.videoUrl = p.videoUrl || undefined;
      }
      if (p.impactItems !== undefined) {
        patch.impactItems = p.impactItems;
      }
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(campaign._id, patch);
      }
      await ctx.db.patch(args.requestId, {
        status: "approved",
        reviewedAt: now,
        reviewedBy: adminUserId,
        reviewNote: reviewNote || undefined,
      });
    } else {
      await ctx.db.patch(args.requestId, {
        status: "rejected",
        reviewedAt: now,
        reviewedBy: adminUserId,
        reviewNote: reviewNote || undefined,
      });
    }

    if (campaign.createdBy) {
      await createNotification(ctx, {
        userId: campaign.createdBy,
        type: "admin_message",
        message:
          args.decision === "approve"
            ? `Your edits to '${campaign.title}' were approved and are now live.`
            : `Your proposed edits to '${campaign.title}' were not approved.`,
        relatedEntityType: "campaign",
        relatedEntityId: campaign.slug,
        senderId: adminUserId,
      });
    }

    return null;
  },
});

export const listPendingForAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db
      .query("campaignEditRequests")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    const enriched = await Promise.all(
      rows
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(async (r) => {
          const campaign = await ctx.db.get(r.campaignId);
          if (!campaign) return null;
          return {
            id: r._id,
            campaignId: r.campaignId,
            campaignSlug: campaign.slug,
            campaignTitle: campaign.title,
            requestedBy: r.requestedBy,
            proposed: r.proposed,
            current: currentSnapshot(campaign),
            createdAt: r.createdAt,
          };
        }),
    );
    return enriched.filter((row): row is NonNullable<typeof row> => row !== null);
  },
});

export const getPendingForEntity = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign || campaign.createdBy !== userId) {
      return null;
    }
    const rows = await ctx.db
      .query("campaignEditRequests")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
      .collect();
    const pending = rows.find((r) => r.status === "pending");
    if (!pending) return null;
    return {
      id: pending._id,
      proposed: pending.proposed,
      createdAt: pending.createdAt,
    };
  },
});
