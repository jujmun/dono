import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import {
  VERIFICATION_RETENTION_MS,
  clearVerificationPatch,
} from "./lib/verificationRetention";

const STALE_PENDING_MS = 60 * 60 * 1000;

export const reconcileStalePendingDonations = internalMutation({
  args: { olderThanMs: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const staleWindow = args.olderThanMs ?? STALE_PENDING_MS;
    const cutoff = Date.now() - staleWindow;
    const donations = await ctx.db.query("donations").collect();
    const stale = donations.filter(
      (d) => d.paymentStatus === "pending" && d.createdAt < cutoff,
    );

    let failed = 0;
    for (const donation of stale) {
      await ctx.db.patch(donation._id, { paymentStatus: "failed" });
      failed += 1;
    }

    return { failed };
  },
});

export const completeExpiredCampaigns = internalMutation({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().slice(0, 10);
    const campaigns = await ctx.db.query("campaigns").collect();
    let completed = 0;

    for (const campaign of campaigns) {
      if (
        (campaign.status === "active" || campaign.status === "funded") &&
        campaign.deadline < today
      ) {
        await ctx.db.patch(campaign._id, { status: "completed" });
        completed += 1;
      }
    }

    return { completed };
  },
});

/**
 * Retention expiry for Stripe Identity data — clears verifiedName/verifiedDob
 * (and resets verification status) once older than the retention window, so
 * government-ID-derived PII doesn't sit indefinitely. See
 * convex/lib/verificationRetention.ts.
 */
export const expireVerifiedIdentityPii = internalMutation({
  args: { olderThanMs: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const cutoff = Date.now() - (args.olderThanMs ?? VERIFICATION_RETENTION_MS);

    let campaignsCleared = 0;
    for (const campaign of await ctx.db.query("campaigns").collect()) {
      if (campaign.verifiedAt !== undefined && campaign.verifiedAt < cutoff) {
        await ctx.db.patch(campaign._id, clearVerificationPatch);
        campaignsCleared += 1;
      }
    }

    let societiesCleared = 0;
    for (const society of await ctx.db.query("societies").collect()) {
      if (society.verifiedAt !== undefined && society.verifiedAt < cutoff) {
        await ctx.db.patch(society._id, clearVerificationPatch);
        societiesCleared += 1;
      }
    }

    return { campaignsCleared, societiesCleared };
  },
});
