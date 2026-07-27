import { ConvexError, v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireAdmin } from "./lib/authz";

const MAX_MULTIPLIER = 10;
const MIN_MULTIPLIER = 1.01;
const MAX_BUDGET_POUNDS = 1_000_000;
const MAX_SPONSOR_LABEL = 80;
const MAX_WINDOW_MS = 1000 * 60 * 60 * 24 * 365;

function toPublicMatch(window: Doc<"campaignMatchWindows">) {
  const remainingPounds = Math.max(0, window.budgetPounds - window.consumedPounds);
  return {
    id: window._id,
    campaignId: window.campaignId,
    multiplier: window.multiplier,
    budgetPounds: window.budgetPounds,
    consumedPounds: window.consumedPounds,
    remainingPounds,
    sponsorLabel: window.sponsorLabel,
    startsAt: window.startsAt,
    endsAt: window.endsAt,
    active: window.active,
  };
}

function isWindowLive(
  window: Doc<"campaignMatchWindows">,
  now = Date.now(),
): boolean {
  if (!window.active) return false;
  if (now < window.startsAt || now > window.endsAt) return false;
  return window.consumedPounds < window.budgetPounds;
}

async function findLiveWindowForCampaign(
  ctx: QueryCtx | MutationCtx,
  campaignId: Id<"campaigns">,
  now = Date.now(),
) {
  const windows = await ctx.db
    .query("campaignMatchWindows")
    .withIndex("by_campaign", (q) => q.eq("campaignId", campaignId))
    .collect();
  return (
    windows
      .filter((w) => isWindowLive(w, now))
      .sort((a, b) => b.createdAt - a.createdAt)[0] ?? null
  );
}

export const getActiveForCampaign = query({
  args: { campaignSlug: v.string() },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.campaignSlug))
      .unique();
    if (!campaign) return null;
    const window = await findLiveWindowForCampaign(ctx, campaign._id);
    return window ? toPublicMatch(window) : null;
  },
});

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const windows = await ctx.db
      .query("campaignMatchWindows")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();

    const live = windows.filter((w) => isWindowLive(w, now));
    const results = await Promise.all(
      live.map(async (window) => {
        const campaign = await ctx.db.get(window.campaignId);
        if (!campaign) return null;
        return {
          ...toPublicMatch(window),
          campaignSlug: campaign.slug,
          campaignTitle: campaign.title,
        };
      }),
    );
    return results.filter((row): row is NonNullable<typeof row> => row != null);
  },
});

export const listForCampaignAdmin = query({
  args: { campaignSlug: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.campaignSlug))
      .unique();
    if (!campaign) return [];
    const windows = await ctx.db
      .query("campaignMatchWindows")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
      .collect();
    return windows
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(toPublicMatch);
  },
});

export const create = mutation({
  args: {
    campaignSlug: v.string(),
    multiplier: v.number(),
    budgetPounds: v.number(),
    sponsorLabel: v.string(),
    startsAt: v.number(),
    endsAt: v.number(),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAdmin(ctx);

    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.campaignSlug))
      .unique();
    if (!campaign) {
      throw new ConvexError({
        code: "CAMPAIGN_NOT_FOUND",
        message: "Campaign not found.",
      });
    }

    if (
      !Number.isFinite(args.multiplier) ||
      args.multiplier < MIN_MULTIPLIER ||
      args.multiplier > MAX_MULTIPLIER
    ) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: `Multiplier must be between ${MIN_MULTIPLIER} and ${MAX_MULTIPLIER}.`,
      });
    }

    if (
      !Number.isFinite(args.budgetPounds) ||
      args.budgetPounds <= 0 ||
      args.budgetPounds > MAX_BUDGET_POUNDS
    ) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Budget must be a positive amount within limits.",
      });
    }

    const sponsorLabel = args.sponsorLabel.trim();
    if (!sponsorLabel || sponsorLabel.length > MAX_SPONSOR_LABEL) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Sponsor label is required (max 80 characters).",
      });
    }

    if (args.endsAt <= args.startsAt) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "End time must be after start time.",
      });
    }
    if (args.endsAt - args.startsAt > MAX_WINDOW_MS) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Match windows cannot exceed one year.",
      });
    }

    const existingLive = await findLiveWindowForCampaign(ctx, campaign._id);
    if (existingLive) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "This campaign already has an active match window. End it first.",
      });
    }

    const id = await ctx.db.insert("campaignMatchWindows", {
      campaignId: campaign._id,
      multiplier: args.multiplier,
      budgetPounds: args.budgetPounds,
      consumedPounds: 0,
      sponsorLabel,
      startsAt: args.startsAt,
      endsAt: args.endsAt,
      active: true,
      createdBy: userId,
      createdAt: Date.now(),
    });

    return { id };
  },
});

export const end = mutation({
  args: { matchWindowId: v.id("campaignMatchWindows") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const window = await ctx.db.get(args.matchWindowId);
    if (!window) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Match window not found.",
      });
    }
    if (!window.active) {
      return { ended: false };
    }
    await ctx.db.patch(window._id, { active: false, endsAt: Date.now() });
    return { ended: true };
  },
});

/** Consume match budget for a succeeded donation. Does not change campaigns.raised. */
export const consumeMatchOnDonation = internalMutation({
  args: {
    donationId: v.id("donations"),
    campaignId: v.id("campaigns"),
    donationAmountPounds: v.number(),
    campaignTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const donation = await ctx.db.get(args.donationId);
    if (!donation || donation.matchWindowId) {
      return { matchedAmountPounds: 0 };
    }

    const window = await findLiveWindowForCampaign(ctx, args.campaignId);
    if (!window) {
      return { matchedAmountPounds: 0 };
    }

    const remaining = Math.max(0, window.budgetPounds - window.consumedPounds);
    if (remaining <= 0 || args.donationAmountPounds <= 0) {
      return { matchedAmountPounds: 0 };
    }

    const matchedAmountPounds = Math.min(
      args.donationAmountPounds * (window.multiplier - 1),
      remaining,
    );
    if (matchedAmountPounds <= 0) {
      return { matchedAmountPounds: 0 };
    }

    await ctx.db.patch(window._id, {
      consumedPounds: window.consumedPounds + matchedAmountPounds,
    });
    await ctx.db.patch(donation._id, {
      matchedAmountPounds,
      matchWindowId: window._id,
    });

    await ctx.scheduler.runAfter(0, internal.activity.recordMatch, {
      sponsorLabel: window.sponsorLabel,
      campaignTitle: args.campaignTitle,
      amount: matchedAmountPounds,
    });

    return { matchedAmountPounds };
  },
});
