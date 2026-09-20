import { ConvexError } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

export type DeletedCampaignCascade = {
  follows: number;
  likes: number;
  comments: number;
  reviewMessages: number;
  notifications: number;
};

/**
 * Permanently removes a campaign and its related rows/media.
 * Refuses if donations, recurring donations, or payouts exist.
 */
export async function deleteCampaignRecord(
  ctx: MutationCtx,
  campaign: Doc<"campaigns">,
): Promise<DeletedCampaignCascade> {
  const [donations, recurring, payouts] = await Promise.all([
    ctx.db
      .query("donations")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
      .collect(),
    ctx.db
      .query("recurringDonations")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
      .collect(),
    ctx.db
      .query("campaignPayouts")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
      .collect(),
  ]);
  if (donations.length > 0 || recurring.length > 0 || payouts.length > 0) {
    throw new ConvexError({
      code: "HAS_FINANCIAL_ACTIVITY",
      message:
        "This campaign has donation or payout records and cannot be permanently deleted.",
    });
  }

  const [follows, likes, comments, reviewMessages, notifications] =
    await Promise.all([
      ctx.db
        .query("campaignFollows")
        .withIndex("by_campaign_user", (q) => q.eq("campaignSlug", campaign.slug))
        .collect(),
      ctx.db
        .query("campaignLikes")
        .withIndex("by_campaign_user", (q) => q.eq("campaignSlug", campaign.slug))
        .collect(),
      ctx.db
        .query("campaignComments")
        .withIndex("by_campaign", (q) => q.eq("campaignSlug", campaign.slug))
        .collect(),
      ctx.db
        .query("campaignReviewMessages")
        .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
        .collect(),
      ctx.db.query("notifications").collect(),
    ]);
  const relatedNotifications = notifications.filter(
    (n) => n.relatedEntityType === "campaign" && n.relatedEntityId === campaign.slug,
  );

  for (const follow of follows) {
    await ctx.db.delete(follow._id);
  }
  for (const like of likes) {
    await ctx.db.delete(like._id);
  }
  for (const comment of comments) {
    await ctx.db.delete(comment._id);
  }
  for (const message of reviewMessages) {
    await ctx.db.delete(message._id);
  }
  for (const notification of relatedNotifications) {
    await ctx.db.delete(notification._id);
  }

  const storageIds = [
    campaign.imageStorageId,
    ...(campaign.imageStorageIds ?? []),
  ].filter((id): id is Id<"_storage"> => Boolean(id));
  for (const storageId of storageIds) {
    await ctx.storage.delete(storageId);
    const owner = await ctx.db
      .query("storageOwners")
      .withIndex("by_storageId", (q) => q.eq("storageId", storageId))
      .unique();
    if (owner) {
      await ctx.db.delete(owner._id);
    }
  }

  await ctx.db.delete(campaign._id);
  return {
    follows: follows.length,
    likes: likes.length,
    comments: comments.length,
    reviewMessages: reviewMessages.length,
    notifications: relatedNotifications.length,
  };
}
