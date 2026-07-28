import { v } from "convex/values";
import { query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { getProfileByUserId, optionalUserId } from "./lib/authz";
import { isPublicCampaign } from "./lib/campaignVisibility";

function firstNameFromDisplay(name: string | undefined | null): string {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return "A donor";
  return trimmed.split(/\s+/)[0] ?? "A donor";
}

function parseUpdateCreatedAt(update: Doc<"campaigns">["updates"][number]): number {
  if (update.createdAt !== undefined) {
    return update.createdAt;
  }
  const parsed = Date.parse(`${update.date}T00:00:00.000Z`);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function authorInitial(name: string): string {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "DN"
  );
}

const donationItem = v.object({
  type: v.literal("donation"),
  id: v.string(),
  displayName: v.string(),
  amount: v.number(),
  matchedAmountPounds: v.optional(v.number()),
  createdAt: v.number(),
});

const updateItem = v.object({
  type: v.literal("update"),
  id: v.string(),
  authorName: v.string(),
  authorInitial: v.string(),
  title: v.string(),
  content: v.string(),
  createdAt: v.number(),
  imageUrl: v.optional(v.string()),
});

export const listForCampaign = query({
  args: {
    campaignSlug: v.string(),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.union(donationItem, updateItem)),
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.campaignSlug))
      .unique();
    if (!campaign || !isPublicCampaign(campaign)) {
      return [];
    }

    const limit = Math.min(Math.max(args.limit ?? 40, 1), 60);

    const donations = await ctx.db
      .query("donations")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
      .collect();

    const donationItems = await Promise.all(
      donations
        .filter((donation) => donation.paymentStatus === "succeeded")
        .map(async (donation) => {
          const profile = donation.userId
            ? await ctx.db
                .query("profiles")
                .withIndex("by_userId", (q) => q.eq("userId", donation.userId!))
                .unique()
            : null;
          return {
            type: "donation" as const,
            id: `donation-${donation._id}`,
            displayName: donation.isAnonymous
              ? "Someone"
              : firstNameFromDisplay(profile?.name),
            amount: donation.amount,
            matchedAmountPounds: donation.matchedAmountPounds ?? 0,
            createdAt: donation.createdAt,
          };
        }),
    );

    const creatorName = campaign.creator.name || "Campaign creator";
    const creatorInitial = authorInitial(creatorName);

    const updateItems = campaign.updates.map((update) => ({
      type: "update" as const,
      id: update.id,
      authorName: creatorName,
      authorInitial: creatorInitial,
      title: update.title,
      content: update.content,
      createdAt: parseUpdateCreatedAt(update),
      imageUrl: update.image,
    }));

    return [...donationItems, ...updateItems]
      .sort((a, b) => a.createdAt - b.createdAt)
      .slice(-limit);
  },
});

export const getComposeState = query({
  args: {
    campaignSlug: v.string(),
  },
  returns: v.object({
    canCompose: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const userId = await optionalUserId(ctx);
    if (!userId) {
      return { canCompose: false };
    }

    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.campaignSlug))
      .unique();
    if (!campaign || campaign.createdBy !== userId) {
      return { canCompose: false };
    }

    if (campaign.status !== "active" && campaign.status !== "funded") {
      return { canCompose: false };
    }

    const [user, profile] = await Promise.all([
      ctx.db.get(userId),
      getProfileByUserId(ctx, userId),
    ]);
    const verified =
      Boolean(user?.emailVerificationTime) || Boolean(profile?.emailVerifiedAt);
    if (!verified) {
      return { canCompose: false };
    }

    return { canCompose: true };
  },
});
