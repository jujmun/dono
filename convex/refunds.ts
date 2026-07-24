import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import {
  requireAdmin,
  requireVerifiedUser,
} from "./lib/authz";

const MS_DAY = 24 * 60 * 60 * 1000;
const ORDINARY_WINDOW_DAYS = 60;
const FRAUD_WINDOW_DAYS = 365;
const MAX_GROUNDS = 200;
const MAX_DETAILS = 5000;
const MAX_NOTE = 2000;

type Ctx = QueryCtx | MutationCtx;

async function getDonationOrThrow(ctx: Ctx, donationId: Id<"donations">) {
  const donation = await ctx.db.get(donationId);
  if (!donation || !donation.campaignId) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: "Donation not found.",
    });
  }
  return donation as Doc<"donations"> & { campaignId: Id<"campaigns"> };
}

async function assertCampaignOwnerAccess(
  ctx: Ctx,
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

function parseCampaignDeadlineMs(deadline: string): number {
  const ms = Date.parse(deadline);
  if (!Number.isFinite(ms)) {
    throw new ConvexError({
      code: "INVALID_STATE",
      message: "Campaign end date is invalid.",
    });
  }
  return ms;
}

function assertRefundWindow(args: {
  isFraudClaim: boolean;
  campaignDeadline: string;
  donationCreatedAt: number;
  now: number;
}) {
  if (args.isFraudClaim) {
    const cutoff = args.donationCreatedAt + FRAUD_WINDOW_DAYS * MS_DAY;
    if (args.now > cutoff) {
      throw new ConvexError({
        code: "REFUND_WINDOW_CLOSED",
        message:
          "Fraud refund requests must be submitted within 12 months of the donation.",
      });
    }
    return;
  }

  const deadlineMs = parseCampaignDeadlineMs(args.campaignDeadline);
  const cutoff = deadlineMs + ORDINARY_WINDOW_DAYS * MS_DAY;
  if (args.now > cutoff) {
    throw new ConvexError({
      code: "REFUND_WINDOW_CLOSED",
      message:
        "Ordinary refund requests must be submitted within 60 days of the campaign end date.",
    });
  }
}

function toRefundRequest(doc: Doc<"refundRequests">) {
  return {
    id: doc._id,
    donationId: doc.donationId,
    campaignId: doc.campaignId,
    grounds: doc.grounds,
    details: doc.details,
    status: doc.status,
    isFraudClaim: doc.isFraudClaim,
    ownerResponse: doc.ownerResponse,
    ownerRespondedAt: doc.ownerRespondedAt,
    adminDecisionNote: doc.adminDecisionNote,
    adminDecidedAt: doc.adminDecidedAt,
    appealNote: doc.appealNote,
    appealedAt: doc.appealedAt,
    stripeRefundId: doc.stripeRefundId,
    createdAt: doc.createdAt,
  };
}

export const createRequest = mutation({
  args: {
    donationId: v.id("donations"),
    grounds: v.string(),
    details: v.string(),
    isFraudClaim: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { userId, user, profile } = await requireVerifiedUser(ctx);
    const donation = await getDonationOrThrow(ctx, args.donationId);

    if (donation.paymentStatus !== "succeeded") {
      throw new ConvexError({
        code: "INVALID_STATE",
        message: "Only successful donations can be refunded.",
      });
    }

    const isDonor =
      donation.userId === userId ||
      (donation.donorEmail &&
        (donation.donorEmail === profile?.email ||
          donation.donorEmail === user.email));
    if (!isDonor) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You can only request refunds for your own donations.",
      });
    }

    const campaign = await ctx.db.get(donation.campaignId);
    if (!campaign) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Campaign not found.",
      });
    }

    const grounds = args.grounds.trim();
    const details = args.details.trim();
    if (!grounds || grounds.length > MAX_GROUNDS) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Grounds are required (max 200 characters).",
      });
    }
    if (!details || details.length > MAX_DETAILS) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Details are required (max 5000 characters).",
      });
    }

    const now = Date.now();
    assertRefundWindow({
      isFraudClaim: args.isFraudClaim,
      campaignDeadline: campaign.deadline,
      donationCreatedAt: donation.createdAt,
      now,
    });

    const existing = await ctx.db
      .query("refundRequests")
      .withIndex("by_donation", (q) => q.eq("donationId", args.donationId))
      .collect();
    const open = existing.find(
      (r) =>
        r.status === "pending_owner" ||
        r.status === "pending_admin" ||
        r.status === "appealed" ||
        r.status === "approved",
    );
    if (open) {
      throw new ConvexError({
        code: "INVALID_STATE",
        message: "A refund request is already in progress for this donation.",
      });
    }

    const requestId = await ctx.db.insert("refundRequests", {
      donationId: args.donationId,
      requesterUserId: userId,
      requesterEmail: profile?.email ?? user.email,
      campaignId: donation.campaignId,
      grounds,
      details,
      status: "pending_owner",
      isFraudClaim: args.isFraudClaim,
      createdAt: now,
    });

    return { requestId };
  },
});

export const ownerRespond = mutation({
  args: {
    requestId: v.id("refundRequests"),
    response: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const request = await ctx.db.get(args.requestId);
    if (!request || request.status !== "pending_owner") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending refund request not found.",
      });
    }

    const campaign = await ctx.db.get(request.campaignId);
    if (!campaign) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Campaign not found.",
      });
    }
    await assertCampaignOwnerAccess(ctx, campaign, userId);

    const response = args.response.trim();
    if (!response || response.length > MAX_NOTE) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "A response between 1 and 2000 characters is required.",
      });
    }

    await ctx.db.patch(args.requestId, {
      ownerResponse: response,
      ownerRespondedAt: Date.now(),
      status: "pending_admin",
    });
    return null;
  },
});

export const adminDecide = mutation({
  args: {
    requestId: v.id("refundRequests"),
    decision: v.union(v.literal("approve"), v.literal("deny")),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const request = await ctx.db.get(args.requestId);
    if (
      !request ||
      (request.status !== "pending_admin" && request.status !== "appealed")
    ) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Refund request awaiting admin decision not found.",
      });
    }

    const note = args.note?.trim();
    if (note && note.length > MAX_NOTE) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Decision note must be at most 2000 characters.",
      });
    }

    const now = Date.now();
    if (args.decision === "deny") {
      await ctx.db.patch(args.requestId, {
        status: "denied",
        adminDecisionNote: note,
        adminDecidedAt: now,
        adminDecidedBy: adminUserId,
      });
      return null;
    }

    await ctx.db.patch(args.requestId, {
      status: "approved",
      adminDecisionNote: note,
      adminDecidedAt: now,
      adminDecidedBy: adminUserId,
    });

    await ctx.scheduler.runAfter(0, internal.stripe.processApprovedRefund, {
      refundRequestId: args.requestId,
    });

    return null;
  },
});

export const appeal = mutation({
  args: {
    requestId: v.id("refundRequests"),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const request = await ctx.db.get(args.requestId);
    if (!request || request.status !== "denied") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Denied refund request not found.",
      });
    }
    if (request.requesterUserId !== userId) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You can only appeal your own refund request.",
      });
    }

    const note = args.note.trim();
    if (!note || note.length > MAX_NOTE) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "An appeal note between 1 and 2000 characters is required.",
      });
    }

    await ctx.db.patch(args.requestId, {
      status: "appealed",
      appealNote: note,
      appealedAt: Date.now(),
    });
    return null;
  },
});

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireVerifiedUser(ctx);
    const rows = await ctx.db
      .query("refundRequests")
      .withIndex("by_requester", (q) => q.eq("requesterUserId", userId))
      .collect();
    return rows
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(toRefundRequest);
  },
});

export const listForAdmin = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending_owner"),
        v.literal("pending_admin"),
        v.literal("approved"),
        v.literal("denied"),
        v.literal("appealed"),
        v.literal("refunded"),
        v.literal("failed"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const rows = args.status
      ? await ctx.db
          .query("refundRequests")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .collect()
      : await ctx.db.query("refundRequests").collect();
    return rows
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(toRefundRequest);
  },
});

export const listForCampaignOwner = query({
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
    await assertCampaignOwnerAccess(ctx, campaign, userId);

    const rows = await ctx.db
      .query("refundRequests")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .collect();
    return rows
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(toRefundRequest);
  },
});

/**
 * Surplus refund helper (Student Campaign Terms): refund donations newest-first
 * until the surplus amount is exhausted. Creates refund request rows for each
 * donation slice; Stripe processing is left to adminDecide / processApprovedRefund.
 */
export const surplusRefundReverseChron = internalMutation({
  args: {
    campaignId: v.id("campaigns"),
    surplusAmountMinor: v.number(),
    grounds: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (
      !Number.isFinite(args.surplusAmountMinor) ||
      args.surplusAmountMinor <= 0
    ) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Surplus amount must be a positive minor-unit integer.",
      });
    }

    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Campaign not found.",
      });
    }

    const donations = (
      await ctx.db
        .query("donations")
        .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
        .collect()
    )
      .filter(
        (d) =>
          d.paymentStatus === "succeeded" ||
          d.paymentStatus === "partially_refunded",
      )
      .sort((a, b) => b.createdAt - a.createdAt);

    let remaining = Math.floor(args.surplusAmountMinor);
    const createdRequestIds: Id<"refundRequests">[] = [];
    const grounds =
      args.grounds?.trim() ||
      "Campaign surplus refund (reverse chronological).";

    for (const donation of donations) {
      if (remaining <= 0) break;
      const gross =
        donation.grossAmountMinor ?? Math.round(donation.amount * 100);
      const alreadyRefunded = donation.refundedAmountMinor ?? 0;
      const refundable = Math.max(0, gross - alreadyRefunded);
      if (refundable <= 0) continue;

      const slice = Math.min(remaining, refundable);
      const requestId = await ctx.db.insert("refundRequests", {
        donationId: donation._id,
        requesterEmail: donation.donorEmail,
        requesterUserId: donation.userId,
        campaignId: args.campaignId,
        grounds,
        details: `Automatic surplus refund of ${slice} minor units (newest-first).`,
        status: "pending_admin",
        isFraudClaim: false,
        createdAt: Date.now(),
      });
      createdRequestIds.push(requestId);
      remaining -= slice;
    }

    return {
      createdRequestIds,
      remainingSurplusMinor: remaining,
    };
  },
});

export const markRefundProcessed = internalMutation({
  args: {
    refundRequestId: v.id("refundRequests"),
    stripeRefundId: v.optional(v.string()),
    failed: v.optional(v.boolean()),
    failureNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.refundRequestId);
    if (!request) return null;

    if (args.failed) {
      await ctx.db.patch(args.refundRequestId, {
        status: "failed",
        adminDecisionNote:
          args.failureNote ?? request.adminDecisionNote ?? "Stripe refund failed.",
      });
      return null;
    }

    if (!args.stripeRefundId) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "stripeRefundId is required when marking a refund as processed.",
      });
    }

    await ctx.db.patch(args.refundRequestId, {
      status: "refunded",
      stripeRefundId: args.stripeRefundId,
    });
    return null;
  },
});

export const getRequestForStripe = internalQuery({
  args: { refundRequestId: v.id("refundRequests") },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.refundRequestId);
    if (!request) return null;
    const donation = await ctx.db.get(request.donationId);
    if (!donation) return null;
    return {
      requestId: request._id,
      status: request.status,
      donationId: donation._id,
      stripePaymentIntentId: donation.stripePaymentIntentId,
      stripeChargeId: donation.stripeChargeId,
      stripeConnectedAccountId: donation.stripeConnectedAccountId,
      paymentStatus: donation.paymentStatus,
    };
  },
});
