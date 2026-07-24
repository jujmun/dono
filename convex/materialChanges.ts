import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { requireAdmin, requireVerifiedUser } from "./lib/authz";
import { createNotification } from "./lib/notifications";

const MAX_EXPLANATION = 5000;
const MAX_NOTE = 2000;

async function assertCampaignOwnerAccess(
  ctx: QueryCtx | MutationCtx,
  campaign: Doc<"campaigns">,
  userId: Id<"users">,
) {
  if (campaign.createdBy === userId) return;
  if (campaign.responsibleIndividualUserId === userId) return;

  const membership = await ctx.db
    .query("societyMembers")
    .withIndex("by_community_user", (q) =>
      q.eq("communitySlug", campaign.creator.communityId).eq("userId", userId),
    )
    .unique();
  if (membership?.status === "approved" && membership.role === "leader") {
    return;
  }

  throw new ConvexError({
    code: "FORBIDDEN",
    message: "You do not have permission for this action.",
  });
}

export const requestChange = mutation({
  args: {
    campaignId: v.id("campaigns"),
    explanation: v.string(),
    evidenceNote: v.optional(v.string()),
    proposedOwnershipStatement: v.optional(v.string()),
    proposedUpdateSchedule: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Campaign not found.",
      });
    }
    await assertCampaignOwnerAccess(ctx, campaign, userId);

    const explanation = args.explanation.trim();
    if (!explanation || explanation.length > MAX_EXPLANATION) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Explanation is required (max 5000 characters).",
      });
    }

    const evidenceNote = args.evidenceNote?.trim();
    if (evidenceNote && evidenceNote.length > MAX_NOTE) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Evidence note must be at most 2000 characters.",
      });
    }

    const proposedOwnershipStatement = args.proposedOwnershipStatement?.trim();
    const proposedUpdateSchedule = args.proposedUpdateSchedule?.trim();
    if (proposedOwnershipStatement && proposedOwnershipStatement.length > MAX_NOTE) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Proposed ownership statement must be at most 2000 characters.",
      });
    }
    if (proposedUpdateSchedule && proposedUpdateSchedule.length > MAX_NOTE) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Proposed update schedule must be at most 2000 characters.",
      });
    }

    const requestId = await ctx.db.insert("materialChangeRequests", {
      campaignId: args.campaignId,
      requestedBy: userId,
      explanation,
      evidenceNote: evidenceNote || undefined,
      proposedOwnershipStatement: proposedOwnershipStatement || undefined,
      proposedUpdateSchedule: proposedUpdateSchedule || undefined,
      status: "pending",
      createdAt: Date.now(),
    });

    return { requestId };
  },
});

export const adminReview = mutation({
  args: {
    requestId: v.id("materialChangeRequests"),
    decision: v.union(v.literal("approve"), v.literal("reject")),
    reviewNote: v.optional(v.string()),
    notifyOwner: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const request = await ctx.db.get(args.requestId);
    if (!request || request.status !== "pending") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending material change request not found.",
      });
    }

    const campaign = await ctx.db.get(request.campaignId);
    if (!campaign) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Campaign not found.",
      });
    }

    const reviewNote = args.reviewNote?.trim();
    if (reviewNote && reviewNote.length > MAX_NOTE) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Review note must be at most 2000 characters.",
      });
    }

    const now = Date.now();
    if (args.decision === "reject") {
      await ctx.db.patch(args.requestId, {
        status: "rejected",
        reviewedAt: now,
        reviewedBy: adminUserId,
        reviewNote,
      });
    } else {
      const patch: Record<string, string> = {};
      if (request.proposedOwnershipStatement) {
        patch.ownershipStatement = request.proposedOwnershipStatement;
      }
      if (request.proposedUpdateSchedule) {
        patch.plannedUpdateSchedule = request.proposedUpdateSchedule;
      }
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(campaign._id, patch);
      }
      await ctx.db.patch(args.requestId, {
        status: "approved",
        reviewedAt: now,
        reviewedBy: adminUserId,
        reviewNote,
      });
    }

    if (args.notifyOwner !== false && campaign.createdBy) {
      await createNotification(ctx, {
        userId: campaign.createdBy,
        type: "admin_message",
        message:
          args.decision === "approve"
            ? `Your material change request for '${campaign.title}' was approved.`
            : `Your material change request for '${campaign.title}' was rejected.`,
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
      .query("materialChangeRequests")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    return rows
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((r) => ({
        id: r._id,
        campaignId: r.campaignId,
        requestedBy: r.requestedBy,
        explanation: r.explanation,
        evidenceNote: r.evidenceNote,
        proposedOwnershipStatement: r.proposedOwnershipStatement,
        proposedUpdateSchedule: r.proposedUpdateSchedule,
        status: r.status,
        createdAt: r.createdAt,
      }));
  },
});
