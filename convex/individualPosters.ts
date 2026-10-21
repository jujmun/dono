import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  optionalUserId,
  requireAdmin,
  requireStudentCreator,
} from "./lib/authz";
import { logAdminAction } from "./adminAudit";
import {
  buildIndividualPosterApprovedMessage,
  buildIndividualPosterPendingMessage,
  buildIndividualPosterRejectedMessage,
  createNotification,
} from "./lib/notifications";

const MAX_REASON_LENGTH = 1000;

/** Apply (or re-apply, immediately — no cooldown) to become an individual poster. */
export const apply = mutation({
  args: { reason: v.string() },
  handler: async (ctx, args) => {
    const { userId, profile, user } = await requireStudentCreator(ctx);
    const reason = args.reason.trim();
    if (!reason || reason.length > MAX_REASON_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: `Explain why you need to post individually (1-${MAX_REASON_LENGTH} characters).`,
      });
    }

    const existing = await ctx.db
      .query("individualPosters")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing && existing.status === "approved" && !existing.revokedAt) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "You are already an approved individual poster.",
      });
    }
    if (existing && existing.status === "pending") {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Your application is already pending review.",
      });
    }

    const now = Date.now();
    let applicationId;
    if (existing) {
      await ctx.db.patch(existing._id, {
        reason,
        status: "pending",
        createdAt: now,
        reviewedAt: undefined,
        reviewedBy: undefined,
        reviewNote: undefined,
        revokedAt: undefined,
        revokedBy: undefined,
      });
      applicationId = existing._id;
    } else {
      applicationId = await ctx.db.insert("individualPosters", {
        userId,
        reason,
        status: "pending",
        createdAt: now,
      });
    }

    const admins = await ctx.db
      .query("profiles")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .collect();
    const applicantName = profile?.name ?? user.name ?? "A student";
    const message = buildIndividualPosterPendingMessage(applicantName);
    for (const admin of admins) {
      await createNotification(ctx, {
        userId: admin.userId,
        type: "individual_poster_pending",
        message,
      });
    }

    return { applicationId };
  },
});

/** Current user's own application (any status), or null. */
export const myStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await optionalUserId(ctx);
    if (!userId) return null;
    const application = await ctx.db
      .query("individualPosters")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!application) return null;
    return {
      id: application._id,
      reason: application.reason,
      status: application.status,
      createdAt: application.createdAt,
      reviewNote: application.reviewNote,
      revoked: Boolean(application.revokedAt),
    };
  },
});

export const listPending = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const pending = await ctx.db
      .query("individualPosters")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    const results = [];
    for (const application of pending) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", application.userId))
        .unique();
      const user = await ctx.db.get(application.userId);
      results.push({
        id: application._id,
        userId: application.userId,
        reason: application.reason,
        createdAt: application.createdAt,
        name: profile?.name ?? user?.name ?? "Student",
        email: profile?.email ?? user?.email ?? "",
      });
    }
    return results.sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const approve = mutation({
  args: { applicationId: v.id("individualPosters") },
  handler: async (ctx, args) => {
    const application = await ctx.db.get(args.applicationId);
    if (!application || application.status !== "pending") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending application not found.",
      });
    }
    const { userId: adminUserId } = await requireAdmin(ctx);
    await ctx.db.patch(application._id, {
      status: "approved",
      reviewedAt: Date.now(),
      reviewedBy: adminUserId,
      reviewNote: undefined,
      revokedAt: undefined,
      revokedBy: undefined,
    });

    await createNotification(ctx, {
      userId: application.userId,
      type: "individual_poster_approved",
      message: buildIndividualPosterApprovedMessage(),
    });

    await logAdminAction(ctx, {
      adminUserId,
      action: "individual_poster_approve",
      targetType: "individualPosters",
      targetId: application._id,
    });

    return null;
  },
});

export const reject = mutation({
  args: { applicationId: v.id("individualPosters"), reviewNote: v.string() },
  handler: async (ctx, args) => {
    const application = await ctx.db.get(args.applicationId);
    if (!application || application.status !== "pending") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending application not found.",
      });
    }
    const reviewNote = args.reviewNote.trim();
    if (!reviewNote) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "A reason is required.",
      });
    }
    const { userId: adminUserId } = await requireAdmin(ctx);
    await ctx.db.patch(application._id, {
      status: "rejected",
      reviewedAt: Date.now(),
      reviewedBy: adminUserId,
      reviewNote,
    });

    await createNotification(ctx, {
      userId: application.userId,
      type: "individual_poster_rejected",
      message: buildIndividualPosterRejectedMessage(reviewNote),
    });

    await logAdminAction(ctx, {
      adminUserId,
      action: "individual_poster_reject",
      targetType: "individualPosters",
      targetId: application._id,
      metadata: reviewNote,
    });

    return null;
  },
});

/** Revoke a previously-approved individual poster. They may re-apply via `apply`. */
export const revoke = mutation({
  args: { applicationId: v.id("individualPosters"), reviewNote: v.string() },
  handler: async (ctx, args) => {
    const application = await ctx.db.get(args.applicationId);
    if (
      !application ||
      application.status !== "approved" ||
      application.revokedAt
    ) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Approved individual poster not found.",
      });
    }
    const reviewNote = args.reviewNote.trim();
    if (!reviewNote) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "A reason is required.",
      });
    }
    const { userId: adminUserId } = await requireAdmin(ctx);
    await ctx.db.patch(application._id, {
      revokedAt: Date.now(),
      revokedBy: adminUserId,
      reviewNote,
    });

    await createNotification(ctx, {
      userId: application.userId,
      type: "individual_poster_rejected",
      message: buildIndividualPosterRejectedMessage(reviewNote),
    });

    await logAdminAction(ctx, {
      adminUserId,
      action: "individual_poster_revoke",
      targetType: "individualPosters",
      targetId: application._id,
      metadata: reviewNote,
    });

    return null;
  },
});
