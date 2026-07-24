import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getProfileByUserId, requireSocietyLeader } from "./lib/authz";
import {
  assertNotRateLimited,
  recordRateLimitAttempt,
} from "./auth/rateLimit";

const MAX_HEADLINE_LENGTH = 120;
const MAX_BODY_LENGTH = 500;
const MAX_RECONCILIATION_NOTE_LENGTH = 500;

const UPDATE_MEDIA_UPLOAD_LIMIT = {
  maxAttempts: 10,
  windowMs: 15 * 60 * 1000,
  lockoutMs: 15 * 60 * 1000,
};

function assertUpdateEligible(campaign: { raised: number; goal: number; status: string }) {
  const eligible = campaign.raised >= campaign.goal || campaign.status === "completed";
  if (!eligible) {
    throw new ConvexError({
      code: "INVALID_STATE",
      message: "Updates can only be posted once a campaign has reached its goal or been marked complete.",
    });
  }
}

export const generateUpdateMediaUploadUrl = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Campaign not found." });
    }
    const { userId } = await requireSocietyLeader(ctx, campaign.creator.communityId);

    const opts = { key: `campaignUpdateMedia:${userId}`, ...UPDATE_MEDIA_UPLOAD_LIMIT };
    await assertNotRateLimited(ctx, opts);
    await recordRateLimitAttempt(ctx, opts, false);
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    slug: v.string(),
    mediaStorageIds: v.array(v.id("_storage")),
    headline: v.string(),
    body: v.string(),
    amountSpent: v.number(),
    reconciliationNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Campaign not found." });
    }
    const { userId } = await requireSocietyLeader(ctx, campaign.creator.communityId);
    assertUpdateEligible(campaign);

    if (args.mediaStorageIds.length === 0) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Add at least one photo.",
      });
    }

    const headline = args.headline.trim();
    if (!headline) {
      throw new ConvexError({ code: "INVALID_INPUT", message: "Add a headline." });
    }
    if (headline.length > MAX_HEADLINE_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: `Headline must be at most ${MAX_HEADLINE_LENGTH} characters.`,
      });
    }

    const body = args.body.trim();
    if (!body) {
      throw new ConvexError({ code: "INVALID_INPUT", message: "Add a short update." });
    }
    if (body.length > MAX_BODY_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: `Update must be at most ${MAX_BODY_LENGTH} characters.`,
      });
    }

    if (!Number.isFinite(args.amountSpent) || args.amountSpent < 0) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Amount spent must be a positive number.",
      });
    }

    const amountRaised = campaign.raised;
    const reconciliationNote = args.reconciliationNote?.trim() || undefined;
    if (args.amountSpent < amountRaised && !reconciliationNote) {
      throw new ConvexError({
        code: "RECONCILIATION_NOTE_REQUIRED",
        message:
          "Since less was spent than raised, add a short note explaining the difference.",
      });
    }
    if (reconciliationNote && reconciliationNote.length > MAX_RECONCILIATION_NOTE_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: `Reconciliation note must be at most ${MAX_RECONCILIATION_NOTE_LENGTH} characters.`,
      });
    }

    const mediaUrls: string[] = [];
    for (const storageId of args.mediaStorageIds) {
      const metadata = await ctx.db.system.get("_storage", storageId);
      if (!metadata) {
        throw new ConvexError({ code: "INVALID_INPUT", message: "Photo not found." });
      }
      if (metadata.contentType && !metadata.contentType.startsWith("image/")) {
        throw new ConvexError({ code: "INVALID_INPUT", message: "Files must be images." });
      }

      const owner = await ctx.db
        .query("storageOwners")
        .withIndex("by_storageId", (q) => q.eq("storageId", storageId))
        .unique();
      if (owner && owner.userId !== userId) {
        throw new ConvexError({ code: "FORBIDDEN", message: "Invalid photo ownership." });
      }
      if (!owner) {
        await ctx.db.insert("storageOwners", {
          userId,
          storageId,
          createdAt: Date.now(),
        });
      }

      const url = await ctx.storage.getUrl(storageId);
      mediaUrls.push(url ?? "default");
    }

    const updateId = await ctx.db.insert("campaignUpdates", {
      campaignId: campaign._id,
      mediaUrls,
      headline,
      body,
      amountSpent: args.amountSpent,
      amountRaised,
      reconciliationNote,
      postedByUserId: userId,
      postedByRole: "leader",
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.campaignUpdateEmails.sendForUpdate, {
      updateId,
    });

    return { updateId };
  },
});

export const getForCampaign = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign) return null;

    const update = await ctx.db
      .query("campaignUpdates")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
      .order("desc")
      .first();
    if (!update) return null;

    const posterProfile = await getProfileByUserId(ctx, update.postedByUserId);
    return {
      id: update._id,
      mediaUrls: update.mediaUrls,
      headline: update.headline,
      body: update.body,
      amountSpent: update.amountSpent,
      amountRaised: update.amountRaised,
      reconciliationNote: update.reconciliationNote ?? null,
      postedByName: posterProfile?.name ?? "A society leader",
      createdAt: update.createdAt,
    };
  },
});

export const listUpdatableForSocietyLeader = query({
  args: { communitySlug: v.string() },
  handler: async (ctx, args) => {
    await requireSocietyLeader(ctx, args.communitySlug);

    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_community", (q) =>
        q.eq("creator.communityId", args.communitySlug),
      )
      .collect();

    const eligible = campaigns.filter(
      (c) => c.raised >= c.goal || c.status === "completed",
    );

    const results = await Promise.all(
      eligible.map(async (campaign) => {
        const existing = await ctx.db
          .query("campaignUpdates")
          .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
          .first();
        return existing ? null : campaign;
      }),
    );

    return results
      .filter((c): c is NonNullable<typeof c> => c !== null)
      .map((c) => ({
        slug: c.slug,
        title: c.title,
        raised: c.raised,
        goal: c.goal,
      }));
  },
});
