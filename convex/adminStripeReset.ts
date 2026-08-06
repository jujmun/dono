/**
 * One-time Stripe account switch helper — wipes all Stripe-linked Convex data.
 *
 * Run (dev or prod deployment):
 *   npx convex env set STRIPE_RESET_TOKEN "<random-secret>"
 *   npx convex run adminStripeReset:resetAllStripeData '{"confirmToken":"<same-secret>"}'
 *   npx convex env remove STRIPE_RESET_TOKEN
 *
 * Remove this file after both deployments are reset.
 */

import { ConvexError, v } from "convex/values";
import { internalMutation, type MutationCtx } from "./_generated/server";
import type { TableNames } from "./_generated/dataModel";
import { logAdminAction } from "./adminAudit";
import { clearVerificationPatch } from "./lib/verificationRetention";

async function deleteAllRows(ctx: MutationCtx, table: TableNames) {
  const rows = await ctx.db.query(table).collect();
  for (const row of rows) {
    await ctx.db.delete(row._id);
  }
  return rows.length;
}

export const resetAllStripeData = internalMutation({
  args: {
    confirmToken: v.string(),
    /** Optional audit attribution when invoked from an admin-authenticated path. */
    adminUserId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const expectedToken = process.env.STRIPE_RESET_TOKEN;
    if (!expectedToken || args.confirmToken !== expectedToken) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Invalid or missing STRIPE_RESET_TOKEN.",
      });
    }

    const deleted = {
      campaignUpdateEmailLog: await deleteAllRows(ctx, "campaignUpdateEmailLog"),
      campaignUpdateOptIns: await deleteAllRows(ctx, "campaignUpdateOptIns"),
      fundAllocations: await deleteAllRows(ctx, "fundAllocations"),
      campaignPayouts: await deleteAllRows(ctx, "campaignPayouts"),
      donations: await deleteAllRows(ctx, "donations"),
      recurringDonations: await deleteAllRows(ctx, "recurringDonations"),
      stripeWebhookEvents: await deleteAllRows(ctx, "stripeWebhookEvents"),
      stripeCustomers: await deleteAllRows(ctx, "stripeCustomers"),
      stripeConnectAccounts: await deleteAllRows(ctx, "stripeConnectAccounts"),
    };

    let campaignsReset = 0;
    for (const campaign of await ctx.db.query("campaigns").collect()) {
      const nextStatus =
        campaign.status === "funded" || campaign.status === "completed"
          ? ("active" as const)
          : campaign.status;
      await ctx.db.patch(campaign._id, {
        raised: 0,
        donors: 0,
        status: nextStatus,
        ...clearVerificationPatch,
      });
      campaignsReset += 1;
    }

    let societiesReset = 0;
    for (const society of await ctx.db.query("societies").collect()) {
      await ctx.db.patch(society._id, clearVerificationPatch);
      societiesReset += 1;
    }

    let communitiesReset = 0;
    for (const community of await ctx.db.query("communities").collect()) {
      await ctx.db.patch(community._id, { totalRaised: 0 });
      communitiesReset += 1;
    }

    let fundsReset = 0;
    for (const fund of await ctx.db.query("communityFunds").collect()) {
      await ctx.db.patch(fund._id, {
        totalRaised: 0,
        donors: 0,
        campaignsSupported: 0,
      });
      fundsReset += 1;
    }

    if (args.adminUserId) {
      await logAdminAction(ctx, {
        adminUserId: args.adminUserId,
        action: "stripe_account_reset",
        targetType: "deployment",
        targetId: "stripe_data",
        metadata: JSON.stringify({ deleted, campaignsReset, societiesReset }),
      });
    }

    return {
      deleted,
      campaignsReset,
      societiesReset,
      communitiesReset,
      fundsReset,
    };
  },
});
