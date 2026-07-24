"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { sendTransactionalEmail } from "./lib/emails";
import { signUnsubscribeToken } from "./lib/unsubscribeToken";

const EXCERPT_LENGTH = 200;

function truncate(text: string, length: number) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}

export const sendForUpdate = internalAction({
  args: { updateId: v.id("campaignUpdates") },
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(
      internal.campaignUpdateEmailsInternal.getSendContext,
      { updateId: args.updateId },
    );
    if (!context) return;

    const siteUrl =
      process.env.EXPO_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
      process.env.SITE_URL?.replace(/\/$/, "");
    const campaignUrl = siteUrl ? `${siteUrl}/campaigns/${context.campaign.slug}` : null;

    for (const recipient of context.recipients) {
      try {
        const sig = await signUnsubscribeToken(recipient.optInId);
        const unsubscribeUrl = siteUrl
          ? `${siteUrl}/campaign-updates/unsubscribe?optInId=${recipient.optInId}&sig=${sig}`
          : null;

        const { sent } = await sendTransactionalEmail({
          to: recipient.email,
          subject: `${context.campaign.title} posted an update`,
          text: [
            `${context.campaign.title} posted an update: ${context.update.headline}`,
            "",
            truncate(context.update.body, EXCERPT_LENGTH),
            "",
            campaignUrl ? `View the update: ${campaignUrl}` : null,
            "",
            "You're receiving this because you opted in to updates when you donated to this campaign.",
            unsubscribeUrl
              ? `Unsubscribe from updates for this campaign: ${unsubscribeUrl}`
              : null,
          ]
            .filter((line): line is string => line !== null)
            .join("\n"),
        });

        await ctx.runMutation(internal.campaignUpdateEmailsInternal.recordLog, {
          updateId: args.updateId,
          optInId: recipient.optInId,
          recipientEmail: recipient.email,
          status: sent ? "sent" : "failed",
          error: sent ? undefined : "Email provider failed to send.",
        });
      } catch (err) {
        await ctx.runMutation(internal.campaignUpdateEmailsInternal.recordLog, {
          updateId: args.updateId,
          optInId: recipient.optInId,
          recipientEmail: recipient.email,
          status: "failed",
          error: err instanceof Error ? err.message : "Unknown error.",
        });
      }
    }
  },
});
