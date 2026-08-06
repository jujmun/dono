import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireVerifiedUser } from "./lib/authz";
import { clampLimit } from "./lib/pagination";

const MAX_REASON = 2000;

export const createReport = mutation({
  args: {
    targetType: v.union(
      v.literal("comment"),
      v.literal("campaign"),
      v.literal("society"),
    ),
    reason: v.string(),
    campaignSlug: v.optional(v.string()),
    commentId: v.optional(v.id("campaignComments")),
    societySlug: v.optional(v.string()),
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

    const reportId = await ctx.db.insert("contentReports", {
      reporterUserId: userId,
      targetType: args.targetType,
      campaignSlug: args.campaignSlug?.trim(),
      commentId: args.commentId,
      societySlug: args.societySlug?.trim(),
      reason,
      status: "open",
      createdAt: Date.now(),
    });

    return { reportId };
  },
});

const COMMENT_SNIPPET_LENGTH = 140;

export const listOpenForAdmin = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const limit = clampLimit(args.limit, 50, 200);
    const rows = await ctx.db
      .query("contentReports")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .collect();
    const page = rows.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);

    return Promise.all(
      page.map(async (r) => {
        const reporterProfile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", r.reporterUserId))
          .unique();

        let targetTitle: string | null = null;
        let targetCampaignSlug = r.campaignSlug;
        let commentSnippet: string | null = null;

        if (r.targetType === "campaign" && r.campaignSlug) {
          const campaign = await ctx.db
            .query("campaigns")
            .withIndex("by_slug", (q) => q.eq("slug", r.campaignSlug as string))
            .unique();
          targetTitle = campaign?.title ?? null;
        } else if (r.targetType === "comment" && r.commentId) {
          const comment = await ctx.db.get(r.commentId);
          if (comment) {
            targetCampaignSlug = comment.campaignSlug;
            commentSnippet =
              comment.body.length > COMMENT_SNIPPET_LENGTH
                ? `${comment.body.slice(0, COMMENT_SNIPPET_LENGTH)}…`
                : comment.body;
            const campaign = await ctx.db
              .query("campaigns")
              .withIndex("by_slug", (q) => q.eq("slug", comment.campaignSlug))
              .unique();
            targetTitle = campaign?.title ?? null;
          }
        } else if (r.targetType === "society" && r.societySlug) {
          const society = await ctx.db
            .query("societies")
            .withIndex("by_slug", (q) => q.eq("slug", r.societySlug as string))
            .unique();
          if (society) {
            targetTitle = society.name;
          } else {
            const community = await ctx.db
              .query("communities")
              .withIndex("by_slug", (q) => q.eq("slug", r.societySlug as string))
              .unique();
            targetTitle = community?.name ?? null;
          }
        }

        return {
          id: r._id,
          reporterUserId: r.reporterUserId,
          reporterName: reporterProfile?.name ?? null,
          reporterEmail: reporterProfile?.email ?? null,
          targetType: r.targetType,
          campaignSlug: targetCampaignSlug,
          commentId: r.commentId,
          commentSnippet,
          societySlug: r.societySlug,
          targetTitle,
          reason: r.reason,
          status: r.status,
          createdAt: r.createdAt,
        };
      }),
    );
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
