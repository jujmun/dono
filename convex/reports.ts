import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import {
  assertNotRateLimited,
  recordRateLimitAttempt,
} from "./auth/rateLimit";
import { requireAdmin, optionalUserId } from "./lib/authz";
import { clampLimit } from "./lib/pagination";
import {
  isReportReasonCode,
  isUrgentReasonCode,
  MAX_CONTENT_SNAPSHOT,
  MAX_EVIDENCE_NOTE,
  MAX_REASON,
  REPORT_RATE_LIMIT,
} from "./lib/moderationConstants";
import { logAdminAction } from "./adminAudit";

const targetTypeValidator = v.union(
  v.literal("comment"),
  v.literal("campaign"),
  v.literal("society"),
  v.literal("update"),
  v.literal("image"),
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function truncateSnapshot(text: string): string {
  if (text.length <= MAX_CONTENT_SNAPSHOT) return text;
  return `${text.slice(0, MAX_CONTENT_SNAPSHOT)}…`;
}

async function resolveContentSnapshot(
  ctx: MutationCtx,
  args: {
    targetType: "comment" | "campaign" | "society" | "update" | "image";
    campaignSlug?: string;
    commentId?: Id<"campaignComments">;
    societySlug?: string;
    updateId?: Id<"campaignUpdates">;
  },
): Promise<string> {
  if (args.targetType === "comment" && args.commentId) {
    const comment = await ctx.db.get(args.commentId);
    return truncateSnapshot(comment?.body ?? "");
  }
  if (args.targetType === "campaign" && args.campaignSlug) {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.campaignSlug as string))
      .unique();
    if (!campaign) return "";
    return truncateSnapshot(
      `${campaign.title}\n\n${campaign.description}\n\n${campaign.story}`,
    );
  }
  if (args.targetType === "society" && args.societySlug) {
    const slug = args.societySlug;
    const society = await ctx.db
      .query("societies")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (society) {
      return truncateSnapshot(`${society.name}\n\n${society.description ?? ""}`);
    }
    const community = await ctx.db
      .query("communities")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    return truncateSnapshot(
      community ? `${community.name}\n\n${community.description}` : "",
    );
  }
  if (args.targetType === "update" && args.updateId) {
    const update = await ctx.db.get(args.updateId);
    if (!update) return "";
    return truncateSnapshot(`${update.headline}\n\n${update.body}`);
  }
  if (args.targetType === "image" && args.campaignSlug) {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.campaignSlug as string))
      .unique();
    return truncateSnapshot(
      campaign
        ? `image:${campaign.imageStorageId ?? campaign.image}`
        : "image",
    );
  }
  return "";
}

async function assertTargetExists(
  ctx: MutationCtx,
  args: {
    targetType: "comment" | "campaign" | "society" | "update" | "image";
    campaignSlug?: string;
    commentId?: Id<"campaignComments">;
    societySlug?: string;
    updateId?: Id<"campaignUpdates">;
  },
) {
  if (args.targetType === "comment") {
    if (!args.commentId) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "commentId is required when reporting a comment.",
      });
    }
    const comment = await ctx.db.get(args.commentId);
    if (!comment || comment.deletedAt) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Comment not found.",
      });
    }
    return;
  }

  if (args.targetType === "campaign" || args.targetType === "image") {
    const slug = args.campaignSlug?.trim();
    if (!slug) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "campaignSlug is required when reporting a campaign or image.",
      });
    }
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!campaign) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Campaign not found.",
      });
    }
    return;
  }

  if (args.targetType === "update") {
    if (!args.updateId) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "updateId is required when reporting an update.",
      });
    }
    const update = await ctx.db.get(args.updateId);
    if (!update) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Update not found.",
      });
    }
    return;
  }

  if (args.targetType === "society") {
    const slug = args.societySlug?.trim();
    if (!slug) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "societySlug is required when reporting a society.",
      });
    }
    const society = await ctx.db
      .query("societies")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!society) {
      const community = await ctx.db
        .query("communities")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (!community) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: "Society not found.",
        });
      }
    }
  }
}

/**
 * Create a moderation report. Authenticated users are preferred; guests must
 * supply a contact email (OS-01–OS-04). Every report becomes an open case.
 */
export const createReport = mutation({
  args: {
    targetType: targetTypeValidator,
    reason: v.string(),
    reasonCode: v.optional(v.string()),
    urgent: v.optional(v.boolean()),
    evidenceNote: v.optional(v.string()),
    reporterEmail: v.optional(v.string()),
    reporterName: v.optional(v.string()),
    campaignSlug: v.optional(v.string()),
    commentId: v.optional(v.id("campaignComments")),
    societySlug: v.optional(v.string()),
    updateId: v.optional(v.id("campaignUpdates")),
  },
  handler: async (ctx, args) => {
    const userId = await optionalUserId(ctx);
    const reason = args.reason.trim();
    if (!reason || reason.length > MAX_REASON) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "A reason between 1 and 2000 characters is required.",
      });
    }

    const reasonCode = (args.reasonCode?.trim() || "other").toLowerCase();
    if (!isReportReasonCode(reasonCode)) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Invalid reason code.",
      });
    }

    const evidenceNote = args.evidenceNote?.trim();
    if (evidenceNote && evidenceNote.length > MAX_EVIDENCE_NOTE) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Evidence note must be at most 2000 characters.",
      });
    }

    let reporterEmail = args.reporterEmail?.trim().toLowerCase();
    let reporterName = args.reporterName?.trim();
    if (reporterEmail && !EMAIL_RE.test(reporterEmail)) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "A valid email address is required.",
      });
    }

    if (!userId) {
      if (!reporterEmail) {
        throw new ConvexError({
          code: "INVALID_INPUT",
          message: "Email is required when reporting while signed out.",
        });
      }
    } else if (!reporterEmail) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .unique();
      reporterEmail = profile?.email;
      if (!reporterName) reporterName = profile?.name;
    }

    const rateKey = userId
      ? `report:user:${userId}`
      : `report:email:${reporterEmail}`;
    const limitOpts = { key: rateKey, ...REPORT_RATE_LIMIT };
    await assertNotRateLimited(ctx, limitOpts);

    await assertTargetExists(ctx, args);

    const contentVersionSnapshot = await resolveContentSnapshot(ctx, args);
    const urgent =
      args.urgent === true || isUrgentReasonCode(reasonCode);

    const reportId = await ctx.db.insert("contentReports", {
      reporterUserId: userId ?? undefined,
      reporterEmail,
      reporterName: reporterName || undefined,
      targetType: args.targetType,
      campaignSlug: args.campaignSlug?.trim(),
      commentId: args.commentId,
      societySlug: args.societySlug?.trim(),
      updateId: args.updateId,
      reason,
      reasonCode,
      contentVersionSnapshot,
      urgent,
      evidenceNote: evidenceNote || undefined,
      status: "open",
      createdAt: Date.now(),
    });

    await recordRateLimitAttempt(ctx, limitOpts, false);

    if (urgent) {
      // Attribute P1 escalation to a platform admin for the audit trail.
      const adminProfile = await ctx.db
        .query("profiles")
        .withIndex("by_role", (q) => q.eq("role", "admin"))
        .first();
      if (adminProfile) {
        await logAdminAction(ctx, {
          adminUserId: adminProfile.userId,
          action: "moderation.urgent_escalation",
          targetType: "contentReport",
          targetId: reportId,
          metadata: JSON.stringify({
            reasonCode,
            targetType: args.targetType,
            guest: !userId,
          }),
        });
      }
    }

    return { reportId, urgent };
  },
});

/** Alias kept for callers that prefer an explicit guest name. */
export const createGuestReport = createReport;

const COMMENT_SNIPPET_LENGTH = 140;

async function enrichReportForAdmin(
  ctx: QueryCtx,
  r: {
    _id: Id<"contentReports">;
    reporterUserId?: Id<"users">;
    reporterEmail?: string;
    reporterName?: string;
    targetType: "comment" | "campaign" | "society" | "update" | "image";
    campaignSlug?: string;
    commentId?: Id<"campaignComments">;
    societySlug?: string;
    updateId?: Id<"campaignUpdates">;
    reason: string;
    reasonCode?: string;
    contentVersionSnapshot?: string;
    urgent?: boolean;
    evidenceNote?: string;
    status: "open" | "resolved" | "dismissed";
    createdAt: number;
    resolvedAt?: number;
    resolvedBy?: Id<"users">;
    resolutionNote?: string;
  },
) {
  let reporterName = r.reporterName ?? null;
  let reporterEmail = r.reporterEmail ?? null;
  if (r.reporterUserId) {
    const reporterProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", r.reporterUserId as Id<"users">))
      .unique();
    reporterName = reporterName ?? reporterProfile?.name ?? null;
    reporterEmail = reporterEmail ?? reporterProfile?.email ?? null;
  }

  let targetTitle: string | null = null;
  let targetCampaignSlug = r.campaignSlug;
  let commentSnippet: string | null = null;
  let commentDeleted = false;
  let targetUserId: Id<"users"> | null = null;

  if (
    (r.targetType === "campaign" || r.targetType === "image") &&
    r.campaignSlug
  ) {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", r.campaignSlug as string))
      .unique();
    targetTitle = campaign?.title ?? null;
    targetUserId = campaign?.createdBy ?? null;
  } else if (r.targetType === "comment" && r.commentId) {
    const comment = await ctx.db.get(r.commentId);
    if (comment) {
      targetCampaignSlug = comment.campaignSlug;
      commentDeleted = comment.deletedAt != null;
      commentSnippet =
        comment.body.length > COMMENT_SNIPPET_LENGTH
          ? `${comment.body.slice(0, COMMENT_SNIPPET_LENGTH)}…`
          : comment.body;
      targetUserId = comment.userId;
      const campaign = await ctx.db
        .query("campaigns")
        .withIndex("by_slug", (q) => q.eq("slug", comment.campaignSlug))
        .unique();
      targetTitle = campaign?.title ?? null;
    } else {
      commentDeleted = true;
    }
  } else if (r.targetType === "society" && r.societySlug) {
    const society = await ctx.db
      .query("societies")
      .withIndex("by_slug", (q) => q.eq("slug", r.societySlug as string))
      .unique();
    if (society) {
      targetTitle = society.name;
      targetUserId = society.creatorId;
    } else {
      const community = await ctx.db
        .query("communities")
        .withIndex("by_slug", (q) => q.eq("slug", r.societySlug as string))
        .unique();
      targetTitle = community?.name ?? null;
      targetUserId = community?.createdBy ?? null;
    }
  } else if (r.targetType === "update" && r.updateId) {
    const update = await ctx.db.get(r.updateId);
    if (update) {
      targetTitle = update.headline;
      targetUserId = update.postedByUserId;
      const campaign = await ctx.db.get(update.campaignId);
      targetCampaignSlug = campaign?.slug;
    }
  }

  const actions = await ctx.db
    .query("moderationActions")
    .withIndex("by_report", (q) => q.eq("reportId", r._id))
    .collect();

  return {
    id: r._id,
    reporterUserId: r.reporterUserId ?? null,
    reporterName,
    reporterEmail,
    isGuest: !r.reporterUserId,
    targetType: r.targetType,
    targetUserId,
    campaignSlug: targetCampaignSlug,
    commentId: r.commentId,
    commentSnippet,
    commentDeleted,
    societySlug: r.societySlug,
    updateId: r.updateId,
    targetTitle,
    reason: r.reason,
    reasonCode: r.reasonCode ?? "other",
    contentVersionSnapshot: r.contentVersionSnapshot ?? null,
    urgent: r.urgent === true,
    evidenceNote: r.evidenceNote ?? null,
    status: r.status,
    createdAt: r.createdAt,
    resolvedAt: r.resolvedAt ?? null,
    resolutionNote: r.resolutionNote ?? null,
    actions: actions
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((a) => ({
        id: a._id,
        action: a.action,
        reasonCode: a.reasonCode,
        notes: a.notes ?? null,
        moderatorUserId: a.moderatorUserId,
        createdAt: a.createdAt,
      })),
  };
}

/** Urgency-first moderation queue (OS-08). Prefer over listOpenForAdmin. */
export const listQueue = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const limit = clampLimit(args.limit, 50, 200);
    const rows = await ctx.db
      .query("contentReports")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .collect();
    const page = rows
      .sort((a, b) => {
        const urgentA = a.urgent === true ? 1 : 0;
        const urgentB = b.urgent === true ? 1 : 0;
        if (urgentA !== urgentB) return urgentB - urgentA;
        return b.createdAt - a.createdAt;
      })
      .slice(0, limit);

    return Promise.all(page.map((r) => enrichReportForAdmin(ctx, r)));
  },
});

/** @deprecated Prefer listQueue — kept so existing admin pages keep working. */
export const listOpenForAdmin = listQueue;

export const resolveReport = mutation({
  args: {
    reportId: v.id("contentReports"),
    resolution: v.union(v.literal("resolved"), v.literal("dismissed")),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx);
    const report = await ctx.db.get(args.reportId);
    if (!report || report.status !== "open") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Open report not found.",
      });
    }

    const note = args.note?.trim();
    if (note && note.length > MAX_REASON) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Resolution note must be at most 2000 characters.",
      });
    }

    await ctx.db.patch(args.reportId, {
      status: args.resolution,
      resolvedAt: Date.now(),
      resolvedBy: userId,
      resolutionNote: note,
    });

    await ctx.db.insert("moderationActions", {
      reportId: args.reportId,
      moderatorUserId: userId,
      action: args.resolution === "dismissed" ? "keep" : "keep",
      reasonCode: report.reasonCode ?? "other",
      notes: note,
      createdAt: Date.now(),
    });

    await logAdminAction(ctx, {
      adminUserId: userId,
      action:
        args.resolution === "dismissed"
          ? "moderation.report_dismiss"
          : "moderation.report_resolve",
      targetType: "contentReport",
      targetId: args.reportId,
      metadata: note ? JSON.stringify({ note }) : undefined,
    });

    return null;
  },
});
