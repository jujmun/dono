import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { requireVerifiedUser } from "./lib/authz";
import {
  assertNotRateLimited,
  recordRateLimitAttempt,
} from "./auth/rateLimit";

const MAX_DESCRIPTION = 2000;
const MS_DAY = 24 * 60 * 60 * 1000;
const EVIDENCE_DUE_DAYS = 14;

const UPLOAD_LIMIT = {
  maxAttempts: 10,
  windowMs: 15 * 60 * 1000,
  lockoutMs: 15 * 60 * 1000,
};

async function assertCampaignEvidenceAccess(
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

function parseIsoDateStartMs(isoDate: string): number {
  const trimmed = isoDate.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: "expenditureDate must be an ISO date (YYYY-MM-DD).",
    });
  }
  const ms = Date.parse(`${trimmed}T00:00:00.000Z`);
  if (!Number.isFinite(ms)) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: "expenditureDate must be a valid date.",
    });
  }
  return ms;
}

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireVerifiedUser(ctx);
    const opts = { key: `evidenceUpload:${userId}`, ...UPLOAD_LIMIT };
    await assertNotRateLimited(ctx, opts);
    await recordRateLimitAttempt(ctx, opts, false);
    return await ctx.storage.generateUploadUrl();
  },
});

export const uploadEvidence = mutation({
  args: {
    campaignId: v.id("campaigns"),
    storageId: v.id("_storage"),
    description: v.string(),
    expenditureDate: v.string(),
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
    await assertCampaignEvidenceAccess(ctx, campaign, userId);

    const description = args.description.trim();
    if (!description || description.length > MAX_DESCRIPTION) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Description is required (max 2000 characters).",
      });
    }

    const metadata = await ctx.db.system.get("_storage", args.storageId);
    if (!metadata) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Uploaded file was not found.",
      });
    }

    const expenditureMs = parseIsoDateStartMs(args.expenditureDate);
    const dueAt = expenditureMs + EVIDENCE_DUE_DAYS * MS_DAY;

    const evidenceId = await ctx.db.insert("campaignEvidence", {
      campaignId: args.campaignId,
      uploadedBy: userId,
      storageId: args.storageId,
      description,
      expenditureDate: args.expenditureDate.trim(),
      dueAt,
      createdAt: Date.now(),
    });

    return { evidenceId, dueAt };
  },
});

export const listForCampaign = query({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Campaign not found.",
      });
    }
    await assertCampaignEvidenceAccess(ctx, campaign, userId);

    const rows = await ctx.db
      .query("campaignEvidence")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    const enriched = [];
    for (const row of rows.sort((a, b) => b.createdAt - a.createdAt)) {
      const url = await ctx.storage.getUrl(row.storageId);
      enriched.push({
        id: row._id,
        description: row.description,
        expenditureDate: row.expenditureDate,
        dueAt: row.dueAt,
        createdAt: row.createdAt,
        uploadedBy: row.uploadedBy,
        url,
      });
    }
    return enriched;
  },
});
