/**
 * One-time migration — bulk-cancels every live campaign-level recurring
 * donation now that monthly campaign donations have been removed in favor
 * of society-level subscriptions (see convex/societySubscriptions.ts and
 * convex/stripe.ts createSocietySubscription).
 *
 * Run (dev or prod deployment):
 *   npx convex env set CAMPAIGN_RECURRING_CANCEL_TOKEN "<random-secret>"
 *   npx convex run migrateCampaignRecurringCancellation:cancelAllCampaignRecurringDonations '{"confirmToken":"<same-secret>"}'
 *   npx convex env remove CAMPAIGN_RECURRING_CANCEL_TOKEN
 *
 * Safe to re-run — already-canceled rows are skipped. Remove this file once
 * both deployments have been migrated.
 */

import { ConvexError, v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

export const cancelAllCampaignRecurringDonations = internalAction({
  args: { confirmToken: v.string() },
  handler: async (
    ctx,
    args,
  ): Promise<{ totalFound: number; canceled: number; failed: number; errors: string[] }> => {
    const expectedToken = process.env.CAMPAIGN_RECURRING_CANCEL_TOKEN;
    if (!expectedToken || args.confirmToken !== expectedToken) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Invalid or missing CAMPAIGN_RECURRING_CANCEL_TOKEN.",
      });
    }

    const rows: Array<{ _id: Id<"recurringDonations"> }> = await ctx.runQuery(
      internal.stripeInternal.listActiveOrPastDueRecurringDonations,
      {},
    );

    let canceled = 0;
    let failed = 0;
    const errors: string[] = [];
    for (const row of rows) {
      try {
        const result = await ctx.runAction(
          internal.stripe.cancelRecurringDonationSubscriptionOnStripe,
          { recurringDonationId: row._id },
        );
        if (result.canceled) canceled += 1;
      } catch (error) {
        failed += 1;
        errors.push(
          `${row._id}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    return { totalFound: rows.length, canceled, failed, errors };
  },
});
