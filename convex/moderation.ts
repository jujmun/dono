import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { requireAdmin, requireVerifiedUser } from "./lib/authz";
import { logAdminAction } from "./adminAudit";
import { clampLimit } from "./lib/pagination";
import {
  isReportReasonCode,
  MAX_REASON,
  MODERATION_ACTIONS,
  type ModerationAction,
} from "./lib/moderationConstants";
import { insertReviewMessageAndScheduleEmail } from "./reviewMessages";

const MAX_REASON_LENGTH = 500;

function trimReason(reason: string | undefined): string | undefined {
  if (reason === undefined) return undefined;
  const trimmed = reason.trim();
  if (!trimmed) return undefined;
  if (trimmed.length > MAX_REASON_LENGTH) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: `Reason must be at most ${MAX_REASON_LENGTH} characters.`,
    });
  }
  return trimmed;
}

function isPublicCampaignStatus(status: string) {
  return status === "active" || status === "funded" || status === "completed";
}

async function getCampaignBySlug(ctx: MutationCtx, slug: string) {
  return await ctx.db
    .query("campaigns")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();
}

async function resolveTargetUserId(
  ctx: MutationCtx,
  report: Doc<"contentReports">,
): Promise<Id<"users"> | null> {
  if (report.targetType === "comment" && report.commentId) {
    const comment = await ctx.db.get(report.commentId);
    return comment?.userId ?? null;
  }
  if (
    (report.targetType === "campaign" || report.targetType === "image") &&
    report.campaignSlug
  ) {
    const campaign = await getCampaignBySlug(ctx, report.campaignSlug);
    return campaign?.createdBy ?? null;
  }
  if (report.targetType === "society" && report.societySlug) {
    const society = await ctx.db
      .query("societies")
      .withIndex("by_slug", (q) => q.eq("slug", report.societySlug as string))
      .unique();
    if (society) return society.creatorId;
    const community = await ctx.db
      .query("communities")
      .withIndex("by_slug", (q) => q.eq("slug", report.societySlug as string))
      .unique();
    return community?.createdBy ?? null;
  }
  if (report.targetType === "update" && report.updateId) {
    const update = await ctx.db.get(report.updateId);
    return update?.postedByUserId ?? null;
  }
  return null;
}

async function suspendProfile(
  ctx: MutationCtx,
  adminUserId: Id<"users">,
  userId: Id<"users">,
  reason: string,
) {
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
  if (!profile || profile.deletedAt) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: "User profile not found.",
    });
  }
  if (profile.role === "admin") {
    throw new ConvexError({
      code: "FORBIDDEN",
      message: "Admin accounts cannot be suspended via this action.",
    });
  }
  const now = Date.now();
  await ctx.db.patch(profile._id, {
    suspendedAt: now,
    suspendedReason: reason,
    updatedAt: now,
  });
  await logAdminAction(ctx, {
    adminUserId,
    action: "account_suspend",
    targetType: "profile",
    targetId: userId,
    metadata: JSON.stringify({ reason }),
  });
}

async function takeDownCampaign(
  ctx: MutationCtx,
  adminUserId: Id<"users">,
  campaign: Doc<"campaigns">,
  reason: string,
) {
  if (!isPublicCampaignStatus(campaign.status)) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: "Published campaign not found.",
    });
  }
  await ctx.db.patch(campaign._id, {
    status: "rejected",
    moderationNote: reason,
    moderatedAt: Date.now(),
    moderatedBy: adminUserId,
    moderationAction: "taken_down",
  });
  const refreshed = (await ctx.db.get(campaign._id))!;
  await insertReviewMessageAndScheduleEmail(ctx, {
    campaign: refreshed,
    adminUserId,
    body: `Your campaign was taken down from public browse.\n\nReason: ${reason}`,
  });
}

async function restoreCampaign(
  ctx: MutationCtx,
  adminUserId: Id<"users">,
  campaign: Doc<"campaigns">,
) {
  if (campaign.status !== "rejected" && !campaign.pausedAt) {
    throw new ConvexError({
      code: "INVALID_STATE",
      message: "Campaign is not paused or taken down.",
    });
  }
  const patch: Record<string, unknown> = {
    pausedAt: undefined,
    pausedBy: undefined,
    pauseReason: undefined,
    commentsRestrictedAt: undefined,
    commentsRestrictedBy: undefined,
  };
  if (campaign.status === "rejected") {
    patch.status = "active";
    patch.restoredAt = Date.now();
  }
  await ctx.db.patch(campaign._id, patch);
  await logAdminAction(ctx, {
    adminUserId,
    action: "campaign.restore_from_report",
    targetType: "campaign",
    targetId: campaign.slug,
  });
}

export const suspendAccount = mutation({
  args: {
    userId: v.id("users"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const reason = trimReason(args.reason) ?? "Account suspended by moderator.";
    await suspendProfile(ctx, adminUserId, args.userId, reason);
    return { suspendedAt: Date.now() };
  },
});

export const unsuspendAccount = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (!profile || profile.deletedAt) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User profile not found.",
      });
    }

    const now = Date.now();
    await ctx.db.patch(profile._id, {
      suspendedAt: undefined,
      suspendedReason: undefined,
      updatedAt: now,
    });

    await logAdminAction(ctx, {
      adminUserId,
      action: "account_unsuspend",
      targetType: "profile",
      targetId: args.userId,
    });

    return { unsuspendedAt: now };
  },
});

export const restrictCommenting = mutation({
  args: {
    userId: v.id("users"),
    until: v.number(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    if (!Number.isFinite(args.until) || args.until <= Date.now()) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Restriction end time must be a future timestamp.",
      });
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (!profile || profile.deletedAt) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User profile not found.",
      });
    }

    const reason = trimReason(args.reason);
    const now = Date.now();
    await ctx.db.patch(profile._id, {
      commentingRestrictedUntil: args.until,
      updatedAt: now,
    });

    await logAdminAction(ctx, {
      adminUserId,
      action: "commenting_restrict",
      targetType: "profile",
      targetId: args.userId,
      metadata: JSON.stringify({
        until: args.until,
        ...(reason ? { reason } : {}),
      }),
    });

    return { commentingRestrictedUntil: args.until };
  },
});

/** Clear a commenting restriction early. */
export const clearCommentingRestriction = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (!profile || profile.deletedAt) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User profile not found.",
      });
    }

    const now = Date.now();
    await ctx.db.patch(profile._id, {
      commentingRestrictedUntil: undefined,
      updatedAt: now,
    });

    await logAdminAction(ctx, {
      adminUserId,
      action: "commenting_restriction_clear",
      targetType: "profile",
      targetId: args.userId,
    });

    return { clearedAt: now };
  },
});

const moderationActionValidator = v.union(
  v.literal("hide_content"),
  v.literal("remove_content"),
  v.literal("pause_campaign"),
  v.literal("restrict_commenting"),
  v.literal("suspend_account"),
  v.literal("keep"),
  v.literal("restore"),
);

/**
 * One-click moderator actions from a report (OS-05, OS-06). Applies the
 * content/account change, logs moderationActions + adminAuditLog, and closes
 * the report except for `keep` (dismiss) which records no-breach.
 */
export const moderatorAction = mutation({
  args: {
    reportId: v.id("contentReports"),
    action: moderationActionValidator,
    reasonCode: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Report not found.",
      });
    }

    const action = args.action as ModerationAction;
    if (!(MODERATION_ACTIONS as readonly string[]).includes(action)) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Invalid moderation action.",
      });
    }

    const reasonCode = (args.reasonCode?.trim() || report.reasonCode || "other").toLowerCase();
    if (!isReportReasonCode(reasonCode)) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Invalid reason code.",
      });
    }

    const notes = args.notes?.trim();
    if (notes && notes.length > MAX_REASON) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Notes must be at most 2000 characters.",
      });
    }

    const actionReason =
      notes ||
      `Moderator action (${action}) for report ${args.reportId} [${reasonCode}]`;

    if (action === "hide_content" || action === "remove_content") {
      if (report.targetType === "comment" && report.commentId) {
        const comment = await ctx.db.get(report.commentId);
        if (!comment || comment.deletedAt) {
          throw new ConvexError({
            code: "NOT_FOUND",
            message: "Comment not found.",
          });
        }
        if (action === "remove_content") {
          await ctx.db.patch(report.commentId, { deletedAt: Date.now() });
          const campaign = await getCampaignBySlug(ctx, comment.campaignSlug);
          if (campaign) {
            await ctx.db.patch(campaign._id, {
              comments: Math.max(0, campaign.comments - 1),
            });
          }
        } else {
          await ctx.db.patch(report.commentId, {
            hiddenByOwnerAt: Date.now(),
            hiddenByOwnerUserId: adminUserId,
          });
        }
      } else if (
        (report.targetType === "campaign" || report.targetType === "image") &&
        report.campaignSlug
      ) {
        const campaign = await getCampaignBySlug(ctx, report.campaignSlug);
        if (!campaign) {
          throw new ConvexError({
            code: "NOT_FOUND",
            message: "Campaign not found.",
          });
        }
        await takeDownCampaign(ctx, adminUserId, campaign, actionReason);
      } else if (report.targetType === "society" && report.societySlug) {
        // Society take-down lives in societies.takeDown — mirror status here.
        const society = await ctx.db
          .query("societies")
          .withIndex("by_slug", (q) =>
            q.eq("slug", report.societySlug as string),
          )
          .unique();
        if (society && society.status === "active") {
          await ctx.db.patch(society._id, {
            status: "rejected",
            moderationNote: actionReason,
            moderatedAt: Date.now(),
            moderatedBy: adminUserId,
            moderationAction: "taken_down",
          });
        }
      } else {
        throw new ConvexError({
          code: "INVALID_INPUT",
          message: "Hide/remove is not supported for this target type.",
        });
      }
    } else if (action === "pause_campaign") {
      if (!report.campaignSlug) {
        throw new ConvexError({
          code: "INVALID_INPUT",
          message: "pause_campaign requires a campaign report.",
        });
      }
      const campaign = await getCampaignBySlug(ctx, report.campaignSlug);
      if (!campaign) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: "Campaign not found.",
        });
      }
      await ctx.db.patch(campaign._id, {
        pausedAt: Date.now(),
        pausedBy: adminUserId,
        pauseReason: actionReason,
      });
    } else if (action === "restrict_commenting") {
      if (report.campaignSlug) {
        const campaign = await getCampaignBySlug(ctx, report.campaignSlug);
        if (campaign) {
          await ctx.db.patch(campaign._id, {
            commentsRestrictedAt: Date.now(),
            commentsRestrictedBy: adminUserId,
          });
        }
      }
      const targetUserId = await resolveTargetUserId(ctx, report);
      if (targetUserId) {
        const until = Date.now() + 7 * 24 * 60 * 60 * 1000;
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", targetUserId))
          .unique();
        if (profile && !profile.deletedAt) {
          await ctx.db.patch(profile._id, {
            commentingRestrictedUntil: until,
            updatedAt: Date.now(),
          });
        }
      }
    } else if (action === "suspend_account") {
      const targetUserId = await resolveTargetUserId(ctx, report);
      if (!targetUserId) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: "Could not resolve account to suspend.",
        });
      }
      await suspendProfile(ctx, adminUserId, targetUserId, actionReason);
    } else if (action === "restore") {
      if (report.targetType === "comment" && report.commentId) {
        const comment = await ctx.db.get(report.commentId);
        if (!comment) {
          throw new ConvexError({
            code: "NOT_FOUND",
            message: "Comment not found.",
          });
        }
        await ctx.db.patch(report.commentId, {
          deletedAt: undefined,
          restoredByAdminAt: Date.now(),
        });
      } else if (report.campaignSlug) {
        const campaign = await getCampaignBySlug(ctx, report.campaignSlug);
        if (!campaign) {
          throw new ConvexError({
            code: "NOT_FOUND",
            message: "Campaign not found.",
          });
        }
        await restoreCampaign(ctx, adminUserId, campaign);
      }
      const targetUserId = await resolveTargetUserId(ctx, report);
      if (targetUserId) {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", targetUserId))
          .unique();
        if (profile?.suspendedAt) {
          await ctx.db.patch(profile._id, {
            suspendedAt: undefined,
            suspendedReason: undefined,
            updatedAt: Date.now(),
          });
        }
      }
    }
    // `keep` — no content mutation; record decision and close below.

    const now = Date.now();
    await ctx.db.insert("moderationActions", {
      reportId: args.reportId,
      moderatorUserId: adminUserId,
      action,
      reasonCode,
      notes: notes || undefined,
      createdAt: now,
    });

    if (report.status === "open") {
      await ctx.db.patch(args.reportId, {
        status: action === "keep" ? "dismissed" : "resolved",
        resolvedAt: now,
        resolvedBy: adminUserId,
        resolutionNote: notes || actionReason,
      });
    }

    await logAdminAction(ctx, {
      adminUserId,
      action: `moderation.${action}`,
      targetType: "contentReport",
      targetId: args.reportId,
      metadata: JSON.stringify({ reasonCode, notes: notes ?? null }),
    });

    return { ok: true as const };
  },
});

/**
 * Appeal a resolved moderation decision. Assigned reviewer must not be the
 * original decision-maker (OS-07).
 */
export const appealReport = mutation({
  args: {
    reportId: v.id("contentReports"),
    note: v.string(),
    assignedReviewerUserId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Report not found.",
      });
    }
    if (report.status === "open") {
      throw new ConvexError({
        code: "INVALID_STATE",
        message: "Only decided reports can be appealed.",
      });
    }

    const note = args.note.trim();
    if (!note || note.length > MAX_REASON) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Appeal note between 1 and 2000 characters is required.",
      });
    }

    const priorActions = await ctx.db
      .query("moderationActions")
      .withIndex("by_report", (q) => q.eq("reportId", args.reportId))
      .collect();
    const original =
      priorActions.sort((a, b) => b.createdAt - a.createdAt)[0] ?? null;
    const originalModeratorUserId =
      original?.moderatorUserId ?? report.resolvedBy;
    if (!originalModeratorUserId) {
      throw new ConvexError({
        code: "INVALID_STATE",
        message: "No original moderator decision found to appeal.",
      });
    }

    let assignedReviewerUserId = args.assignedReviewerUserId;
    if (assignedReviewerUserId) {
      if (assignedReviewerUserId === originalModeratorUserId) {
        throw new ConvexError({
          code: "FORBIDDEN",
          message:
            "Appeal reviewer must be a different person from the original decision-maker.",
        });
      }
      const reviewerProfile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) =>
          q.eq("userId", assignedReviewerUserId as Id<"users">),
        )
        .unique();
      if (!reviewerProfile || reviewerProfile.role !== "admin") {
        throw new ConvexError({
          code: "FORBIDDEN",
          message: "Assigned reviewer must be an admin.",
        });
      }
    } else {
      // Auto-assign a different admin when possible.
      const admins = await ctx.db
        .query("profiles")
        .withIndex("by_role", (q) => q.eq("role", "admin"))
        .collect();
      const other = admins.find((p) => p.userId !== originalModeratorUserId);
      assignedReviewerUserId = other?.userId;
      if (
        assignedReviewerUserId &&
        assignedReviewerUserId === originalModeratorUserId
      ) {
        assignedReviewerUserId = undefined;
      }
    }

    const existing = await ctx.db
      .query("moderationAppeals")
      .withIndex("by_report", (q) => q.eq("reportId", args.reportId))
      .collect();
    if (existing.some((a) => a.status === "pending")) {
      throw new ConvexError({
        code: "INVALID_STATE",
        message: "An appeal is already pending for this report.",
      });
    }

    const appealId = await ctx.db.insert("moderationAppeals", {
      reportId: args.reportId,
      appellantUserId: userId,
      originalModeratorUserId,
      assignedReviewerUserId,
      status: "pending",
      note,
      createdAt: Date.now(),
    });

    await logAdminAction(ctx, {
      adminUserId: userId,
      action: "moderation.appeal_opened",
      targetType: "contentReport",
      targetId: args.reportId,
      metadata: JSON.stringify({
        appealId,
        assignedReviewerUserId: assignedReviewerUserId ?? null,
      }),
    });

    return { appealId };
  },
});

/** Admin assigns (or reassigns) an appeal reviewer — refuses self-review. */
export const assignAppealReviewer = mutation({
  args: {
    appealId: v.id("moderationAppeals"),
    reviewerUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const appeal = await ctx.db.get(args.appealId);
    if (!appeal || appeal.status !== "pending") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending appeal not found.",
      });
    }
    if (args.reviewerUserId === appeal.originalModeratorUserId) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message:
          "Appeal reviewer must be a different person from the original decision-maker.",
      });
    }
    const reviewerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.reviewerUserId))
      .unique();
    if (!reviewerProfile || reviewerProfile.role !== "admin") {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Assigned reviewer must be an admin.",
      });
    }

    await ctx.db.patch(args.appealId, {
      assignedReviewerUserId: args.reviewerUserId,
    });

    await logAdminAction(ctx, {
      adminUserId,
      action: "moderation.appeal_assign",
      targetType: "moderationAppeal",
      targetId: args.appealId,
      metadata: JSON.stringify({ reviewerUserId: args.reviewerUserId }),
    });

    return null;
  },
});

export const decideAppeal = mutation({
  args: {
    appealId: v.id("moderationAppeals"),
    decision: v.union(v.literal("upheld"), v.literal("overturned")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const appeal = await ctx.db.get(args.appealId);
    if (!appeal || appeal.status !== "pending") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending appeal not found.",
      });
    }
    if (adminUserId === appeal.originalModeratorUserId) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "The original decision-maker cannot decide their own appeal.",
      });
    }

    const now = Date.now();
    await ctx.db.patch(args.appealId, {
      status: args.decision,
      decidedAt: now,
      assignedReviewerUserId: adminUserId,
    });

    if (args.decision === "overturned") {
      // Restore via one-click restore against the same report.
      // Inline minimal restore of open status so queue can re-action.
      await ctx.db.patch(appeal.reportId, {
        status: "open",
        resolvedAt: undefined,
        resolvedBy: undefined,
        resolutionNote: args.notes?.trim() || "Appeal overturned — reopened.",
      });
    }

    await logAdminAction(ctx, {
      adminUserId,
      action: `moderation.appeal_${args.decision}`,
      targetType: "moderationAppeal",
      targetId: args.appealId,
      metadata: args.notes
        ? JSON.stringify({ notes: args.notes.trim() })
        : undefined,
    });

    return null;
  },
});

export const listAppeals = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("upheld"),
        v.literal("overturned"),
        v.literal("withdrawn"),
      ),
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const limit = clampLimit(args.limit, 50, 200);
    const status = args.status ?? "pending";
    const rows = await ctx.db
      .query("moderationAppeals")
      .withIndex("by_status", (q) => q.eq("status", status))
      .collect();
    const page = rows.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);

    return Promise.all(
      page.map(async (a) => {
        const report = await ctx.db.get(a.reportId);
        const appellant = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", a.appellantUserId))
          .unique();
        const original = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) =>
            q.eq("userId", a.originalModeratorUserId),
          )
          .unique();
        const reviewer = a.assignedReviewerUserId
          ? await ctx.db
              .query("profiles")
              .withIndex("by_userId", (q) =>
                q.eq("userId", a.assignedReviewerUserId as Id<"users">),
              )
              .unique()
          : null;
        return {
          id: a._id,
          reportId: a.reportId,
          reportReason: report?.reason ?? null,
          reportReasonCode: report?.reasonCode ?? null,
          reportTargetType: report?.targetType ?? null,
          urgent: report?.urgent === true,
          appellantName: appellant?.name ?? appellant?.email ?? null,
          originalModeratorName: original?.name ?? original?.email ?? null,
          originalModeratorUserId: a.originalModeratorUserId,
          assignedReviewerName: reviewer?.name ?? reviewer?.email ?? null,
          assignedReviewerUserId: a.assignedReviewerUserId ?? null,
          status: a.status,
          note: a.note,
          createdAt: a.createdAt,
          decidedAt: a.decidedAt ?? null,
        };
      }),
    );
  },
});
