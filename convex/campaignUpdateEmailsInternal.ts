import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getProfileByUserId } from "./lib/authz";

export const getSendContext = internalQuery({
  args: { updateId: v.id("campaignUpdates") },
  handler: async (ctx, args) => {
    const update = await ctx.db.get(args.updateId);
    if (!update) return null;

    const campaign = await ctx.db.get(update.campaignId);
    if (!campaign) return null;

    const optIns = await ctx.db
      .query("campaignUpdateOptIns")
      .withIndex("by_campaign", (q) => q.eq("campaignId", update.campaignId))
      .collect();

    const priorLogs = await ctx.db
      .query("campaignUpdateEmailLog")
      .withIndex("by_update", (q) => q.eq("updateId", args.updateId))
      .collect();
    const alreadySent = new Set(
      priorLogs.filter((log) => log.status === "sent").map((log) => log.optInId),
    );

    const recipients: { optInId: Id<"campaignUpdateOptIns">; email: string }[] = [];
    for (const optIn of optIns) {
      if (optIn.unsubscribedAt) continue;
      if (alreadySent.has(optIn._id)) continue;

      const email =
        optIn.donorEmail ??
        (optIn.userId
          ? (await getProfileByUserId(ctx, optIn.userId))?.email
          : undefined);
      if (!email) continue;

      recipients.push({ optInId: optIn._id, email });
    }

    return {
      update: { headline: update.headline, body: update.body },
      campaign: { title: campaign.title, slug: campaign.slug },
      recipients,
    };
  },
});

export const recordLog = internalMutation({
  args: {
    updateId: v.id("campaignUpdates"),
    optInId: v.id("campaignUpdateOptIns"),
    recipientEmail: v.string(),
    status: v.union(v.literal("sent"), v.literal("failed"), v.literal("skipped")),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("campaignUpdateEmailLog", {
      updateId: args.updateId,
      optInId: args.optInId,
      recipientEmail: args.recipientEmail,
      status: args.status,
      error: args.error,
      sentAt: Date.now(),
    });
  },
});

export const setUnsubscribed = internalMutation({
  args: { optInId: v.id("campaignUpdateOptIns") },
  handler: async (ctx, args) => {
    const optIn = await ctx.db.get(args.optInId);
    if (!optIn) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Subscription not found." });
    }
    if (!optIn.unsubscribedAt) {
      await ctx.db.patch(args.optInId, { unsubscribedAt: Date.now() });
    }
  },
});
