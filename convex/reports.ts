import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireVerifiedUser } from "./lib/authz";
import { clampLimit } from "./lib/pagination";

const MAX_REASON = 2000;

export const createReport = mutation({
  args: {
    targetType: v.union(v.literal("comment"), v.literal("campaign")),
    reason: v.string(),
    campaignSlug: v.optional(v.string()),
    commentId: v.optional(v.id("campaignComments")),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const reason = args.reason.trim();
    if (!reason || reason.length > MAX_REASON) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "A reason between 1 and 2000 characters is required.",
      });
    }

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
    }

    if (args.targetType === "campaign") {
      const slug = args.campaignSlug?.trim();
      if (!slug) {
        throw new ConvexError({
          code: "INVALID_INPUT",
          message: "campaignSlug is required when reporting a campaign.",
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
    }

    const reportId = await ctx.db.insert("contentReports", {
      reporterUserId: userId,
      targetType: args.targetType,
      campaignSlug: args.campaignSlug?.trim(),
      commentId: args.commentId,
      reason,
      status: "open",
      createdAt: Date.now(),
    });

    return { reportId };
  },
});

export const listOpenForAdmin = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const limit = clampLimit(args.limit, 50, 200);
    const rows = await ctx.db
      .query("contentReports")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .collect();
    return rows
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit)
      .map((r) => ({
        id: r._id,
        reporterUserId: r.reporterUserId,
        targetType: r.targetType,
        campaignSlug: r.campaignSlug,
        commentId: r.commentId,
        reason: r.reason,
        status: r.status,
        createdAt: r.createdAt,
      }));
  },
});

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
    return null;
  },
});
