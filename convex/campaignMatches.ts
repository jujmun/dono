import { v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { requireAdmin } from "./lib/authz";
import { throwFeatureRemoved } from "./lib/featureGates";

/**
 * CR-02a: Match Windows removed at the API boundary.
 * Creation fails closed; public queries return empty so no matched claim is
 * shown. `end` remains so admins can deactivate any leftover windows.
 * `consumeMatchOnDonation` is a no-op.
 */

export const getActiveForCampaign = query({
  args: { campaignSlug: v.string() },
  handler: async () => null,
});

export const listActive = query({
  args: {},
  handler: async () => [],
});

export const listForCampaignAdmin = query({
  args: { campaignSlug: v.string() },
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return [];
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
  handler: async () => {
    throwFeatureRemoved(
      "Match windows",
      "Matched funding is not available. Match windows have been removed for beta.",
    );
  },
});

export const end = mutation({
  args: { matchWindowId: v.id("campaignMatchWindows") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const window = await ctx.db.get(args.matchWindowId);
    if (!window) {
      return { ended: false };
    }
    if (!window.active) {
      return { ended: false };
    }
    await ctx.db.patch(args.matchWindowId, { active: false });
    return { ended: true };
  },
});

/** End every still-active match window (admin cleanup after CR-02a). */
export const endAllActive = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const windows = await ctx.db
      .query("campaignMatchWindows")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();
    for (const window of windows) {
      await ctx.db.patch(window._id, { active: false });
    }
    return { ended: windows.length };
  },
});

export const consumeMatchOnDonation = internalMutation({
  args: {
    donationId: v.id("donations"),
    campaignId: v.id("campaigns"),
    donationAmountPounds: v.number(),
    campaignTitle: v.optional(v.string()),
  },
  handler: async () => {
    // No-op: match consumption removed with CR-02a.
    return { matched: false };
  },
});
