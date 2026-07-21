import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { toCampaign } from "./lib/mappers";
import {
  requireAdmin,
  requireSocietyMember,
  resolveCreatorContact,
} from "./lib/authz";
import { clampLimit } from "./lib/pagination";
import { insertReviewMessageAndScheduleEmail } from "./reviewMessages";
import { logAdminAction } from "./adminAudit";
import { isPublicCampaign, isPublicStatus, isUnderReview } from "./lib/campaignVisibility";
import { isValidCampaignTemplateId } from "./lib/campaignTemplates";
import {
  buildCampaignActiveMessage,
  buildCampaignPendingMessage,
  buildCampaignRejectedMessage,
  createNotification,
} from "./lib/notifications";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isPublicStatusLocal(status: string) {
  return isPublicStatus(status);
}

const MAX_REASON_LENGTH = 1000;

function requireModerationReason(reason: string) {
  const trimmed = reason.trim();
  if (!trimmed || trimmed.length > MAX_REASON_LENGTH) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: "A reason between 1 and 1000 characters is required.",
    });
  }
  return trimmed;
}

function matchesSearch(
  campaign: {
    title: string;
    university: string;
    creator: { name: string };
  },
  search: string | undefined,
) {
  if (!search) return true;
  const q = search.trim().toLowerCase();
  if (!q) return true;
  return (
    campaign.title.toLowerCase().includes(q) ||
    campaign.university.toLowerCase().includes(q) ||
    campaign.creator.name.toLowerCase().includes(q)
  );
}

const placeholderCampaignSlugs = [
  "anatomy-models",
  "orchestra-instruments",
  "conference-travel",
  "welfare-kits",
  "sports-equipment",
  "accessibility-ramp",
];

const MAX_TITLE_LENGTH = 120;
const MAX_CATEGORY_LENGTH = 60;
const MAX_UNIVERSITY_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_STORY_LENGTH = 5000;
const MIN_GOAL = 1;
const MAX_GOAL = 1_000_000;

export const list = query({
  args: {},
  handler: async (ctx) => {
    const campaigns = await ctx.db.query("campaigns").collect();
    return campaigns.filter((c) => isPublicCampaign(c)).map(toCampaign);
  },
});

export const listPaginated = query({
  args: {
    search: v.optional(v.string()),
    category: v.optional(v.string()),
    university: v.optional(v.string()),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = clampLimit(args.limit, 20, 50);
    const campaigns = await ctx.db.query("campaigns").collect();
    const filtered = campaigns
      .filter((c) => isPublicCampaign(c))
      .filter((c) => !args.category || c.category === args.category)
      .filter((c) => !args.university || c.university === args.university)
      .filter((c) => matchesSearch(c, args.search))
      .sort((a, b) => b._creationTime - a._creationTime);

    let start = 0;
    if (args.cursor) {
      const idx = filtered.findIndex((c) => c.slug === args.cursor);
      start = idx >= 0 ? idx + 1 : 0;
    }

    const page = filtered.slice(start, start + limit);
    return {
      items: page.map(toCampaign),
      nextCursor: start + limit < filtered.length ? page[page.length - 1]?.slug : null,
    };
  },
});

export const listTrending = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = clampLimit(args.limit, 10, 30);
    const campaigns = await ctx.db.query("campaigns").collect();
    return campaigns
      .filter((c) => isPublicCampaign(c))
      .sort((a, b) => b.likes + b.donors - (a.likes + a.donors))
      .slice(0, limit)
      .map(toCampaign);
  },
});

export const listFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = clampLimit(args.limit, 3);
    const campaigns = await ctx.db.query("campaigns").collect();
    return campaigns
      .filter((c) => isPublicCampaign(c))
      .slice(0, limit)
      .map(toCampaign);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign || !isPublicCampaign(campaign)) {
      return null;
    }
    return toCampaign(campaign);
  },
});

export const listByCommunity = query({
  args: { communityId: v.string() },
  handler: async (ctx, args) => {
    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_community", (q) =>
        q.eq("creator.communityId", args.communityId),
      )
      .collect();
    return campaigns.filter((c) => isPublicCampaign(c)).map(toCampaign);
  },
});

export const listRelated = query({
  args: { slug: v.string(), category: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = clampLimit(args.limit, 2);
    const campaigns = await ctx.db.query("campaigns").collect();
    return campaigns
      .filter(
        (c) =>
          isPublicCampaign(c) &&
          c.slug !== args.slug &&
          c.category === args.category,
      )
      .slice(0, limit)
      .map(toCampaign);
  },
});

export const listPendingForAdmin = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const campaigns = await ctx.db.query("campaigns").collect();
    return campaigns
      .filter((c) => c.status === "pending" && matchesSearch(c, args.search))
      .map((c) => ({
        ...toCampaign(c),
        stripeVerificationStatus: c.stripeVerificationStatus ?? null,
      }));
  },
});

export const listModeratedForAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const campaigns = await ctx.db.query("campaigns").collect();
    return campaigns
      .filter((c) => c.status === "rejected")
      .sort((a, b) => (b.moderatedAt ?? 0) - (a.moderatedAt ?? 0))
      .map(toCampaign);
  },
});

/** Counts behind the Waiting/Live/Removed nav — spans both campaigns and
 * societies, since the admin "Waiting" tab (and, as of the societies
 * archive/restore work, "Live" and "Removed" too) shows both entity types
 * together. */
export const getAdminStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const [campaigns, societies] = await Promise.all([
      ctx.db.query("campaigns").collect(),
      ctx.db.query("societies").collect(),
    ]);
    let pending = 0;
    let live = 0;
    let moderated = 0;
    for (const c of campaigns) {
      if (c.status === "pending") pending += 1;
      else if (isPublicStatusLocal(c.status)) live += 1;
      else if (c.status === "rejected") moderated += 1;
    }
    for (const s of societies) {
      if (s.status === "pending") pending += 1;
      else if (s.status === "active") live += 1;
      else if (s.status === "rejected") moderated += 1;
    }
    return { pending, live, moderated };
  },
});

async function resolveStudentProfile(
  ctx: QueryCtx,
  createdBy: Id<"users"> | undefined,
) {
  if (!createdBy) return null;
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", createdBy))
    .unique();
  if (!profile) return null;
  const storageUrl = profile.avatarStorageId
    ? await ctx.storage.getUrl(profile.avatarStorageId)
    : null;
  return {
    userId: profile.userId,
    name: profile.name ?? "",
    email: profile.email,
    avatarUrl: storageUrl ?? profile.avatarUrl ?? null,
  };
}

export const getForAdmin = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign) return null;

    const student = await resolveStudentProfile(ctx, campaign.createdBy);
    const messages = await ctx.db
      .query("campaignReviewMessages")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
      .collect();
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
    const [follows, likes, comments] = await Promise.all([
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
    ]);

    return {
      campaign: toCampaign(campaign),
      student,
      counts: {
        follows: follows.length,
        likes: likes.length,
        comments: comments.length,
        reviewMessages: messages.length,
        hasFinancialActivity:
          donations.length > 0 || recurring.length > 0 || payouts.length > 0,
      },
      identity: {
        stripeVerificationStatus: campaign.stripeVerificationStatus ?? null,
        stripeVerificationLastErrorCode:
          campaign.stripeVerificationLastErrorCode ?? null,
        stripeVerificationLastErrorReason:
          campaign.stripeVerificationLastErrorReason ?? null,
        verifiedName: campaign.verifiedName ?? null,
        verifiedDob: campaign.verifiedDob ?? null,
      },
      messages: messages
        .sort((a, b) => a.createdAt - b.createdAt)
        .map((m) => ({
          id: m._id,
          body: m.body,
          createdAt: m.createdAt,
          emailSentAt: m.emailSentAt ?? null,
        })),
    };
  },
});

export const approve = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign || !isUnderReview(campaign.status)) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending campaign not found.",
      });
    }
    if (
      campaign.creator.type === "society" &&
      campaign.societyApprovalStatus !== "approved"
    ) {
      throw new ConvexError({
        code: "SOCIETY_APPROVAL_REQUIRED",
        message: "Society leader approval is required before admin approval.",
      });
    }
    await ctx.db.patch(campaign._id, { status: "active" });

    await logAdminAction(ctx, {
      adminUserId,
      action: "campaign.approve",
      targetType: "campaign",
      targetId: args.slug,
    });

    if (campaign.createdBy) {
      const creator = await resolveCreatorContact(ctx, campaign.createdBy);
      if (creator) {
        await ctx.scheduler.runAfter(0, internal.emails.sendCampaignApproved, {
          email: creator.email,
          name: creator.name,
          campaignTitle: campaign.title,
          campaignSlug: campaign.slug,
        });
      }
      const name = creator?.name ?? campaign.creator.name;
      const avatar = campaign.creator.avatar;
      await ctx.scheduler.runAfter(0, internal.activity.recordCampaignLaunched, {
        userName: name,
        userAvatar: avatar,
        campaignTitle: campaign.title,
      });
      await createNotification(ctx, {
        userId: campaign.createdBy,
        type: "campaign_active",
        message: buildCampaignActiveMessage(campaign.title),
        relatedEntityType: "campaign",
        relatedEntityId: campaign.slug,
      });
    }

    return null;
  },
});

export const reject = mutation({
  args: { slug: v.string(), reason: v.string() },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const reason = requireModerationReason(args.reason);
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign || !isUnderReview(campaign.status)) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending campaign not found.",
      });
    }
    await ctx.db.patch(campaign._id, {
      status: "rejected",
      moderationNote: reason,
      moderatedAt: Date.now(),
      moderatedBy: adminUserId,
      moderationAction: "rejected",
    });
    const refreshed = (await ctx.db.get(campaign._id))!;
    await insertReviewMessageAndScheduleEmail(ctx, {
      campaign: refreshed,
      adminUserId,
      body: `Your campaign was not approved.\n\nReason: ${reason}`,
    });
    if (campaign.createdBy) {
      // No relatedEntityId here: rejected campaigns aren't public
      // (isPublicCampaign requires active/funded/completed), and there's no
      // private "my campaign" status page yet for a link to land on.
      await createNotification(ctx, {
        userId: campaign.createdBy,
        type: "campaign_rejected",
        message: buildCampaignRejectedMessage(campaign.title),
      });
    }
    return null;
  },
});

/** Remove a live campaign from public browse (active/funded/completed → rejected). */
export const takeDown = mutation({
  args: { slug: v.string(), reason: v.string() },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const reason = requireModerationReason(args.reason);
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign || !isPublicStatusLocal(campaign.status)) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Published campaign not found.",
      });
    }
    await ctx.db.patch(campaign._id, {
      status: "rejected",
      moderationNote: reason,
      moderatedAt: Date.now(),
      moderatedBy: adminUserId,
      moderationAction: "taken_down",
    });
    const refreshed = (await ctx.db.get(campaign._id))!;
    await insertReviewMessageAndScheduleEmail(ctx, {
      campaign: refreshed,
      adminUserId,
      body: `Your campaign was taken down from public browse.\n\nReason: ${reason}`,
    });
    return null;
  },
});

export const restore = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign || campaign.status !== "rejected") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Moderated campaign not found.",
      });
    }
    await ctx.db.patch(campaign._id, {
      status: "active",
      restoredAt: Date.now(),
    });
    return null;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    communitySlug: v.string(),
    description: v.string(),
    story: v.string(),
    goal: v.number(),
    template: v.string(),
  },
  handler: async (ctx, args) => {
    const communitySlug = args.communitySlug.trim();
    const { userId, community, membership } = await requireSocietyMember(
      ctx,
      communitySlug,
    );
    const title = args.title.trim();
    const category = args.category.trim();
    const description = args.description.trim();
    const story = args.story.trim();
    const university = community.university.trim();

    if (!isValidCampaignTemplateId(args.template)) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Invalid template selection.",
      });
    }

    if (!title || title.length > MAX_TITLE_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Title is required and must be at most 120 characters.",
      });
    }
    if (!category || category.length > MAX_CATEGORY_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Category is required and must be at most 60 characters.",
      });
    }
    if (!university || university.length > MAX_UNIVERSITY_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "University is required and must be at most 120 characters.",
      });
    }
    if (!description || description.length > MAX_DESCRIPTION_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Description is required and must be at most 500 characters.",
      });
    }
    if (!story || story.length > MAX_STORY_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Story is required and must be at most 5000 characters.",
      });
    }
    if (!Number.isFinite(args.goal) || args.goal < MIN_GOAL || args.goal > MAX_GOAL) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Goal must be between 1 and 1,000,000.",
      });
    }

    const creatorName = community.name;
    const initials = creatorName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const isLeader = membership.role === "leader";
    const now = Date.now();

    let baseSlug = slugify(title);
    let slug = baseSlug;
    let suffix = 1;
    while (
      await ctx.db
        .query("campaigns")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique()
    ) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const today = new Date();
    const deadline = new Date(today);
    deadline.setMonth(deadline.getMonth() + 2);

    const campaignId = await ctx.db.insert("campaigns", {
      slug,
      title,
      description,
      story,
      category,
      goal: args.goal,
      raised: 0,
      donors: 0,
      likes: 0,
      followers: 0,
      comments: 0,
      creator: {
        name: creatorName,
        type: "society",
        avatar: initials || "SO",
        communityId: communitySlug,
      },
      verifications: [{ type: "society", label: "Society Campaign" }],
      university,
      image: "default",
      template: args.template,
      createdAt: today.toISOString().slice(0, 10),
      deadline: deadline.toISOString().slice(0, 10),
      status: "pending",
      updates: [],
      impactItems: [],
      createdBy: userId,
      societyApprovalStatus: isLeader ? ("approved" as const) : ("pending" as const),
      ...(isLeader
        ? { societyApprovedAt: now, societyApprovedBy: userId }
        : {}),
    });

    // No relatedEntityId here: a "pending" campaign isn't public
    // (isPublicCampaign requires active/funded/completed) and getBySlug
    // returns null for it even to its own creator, so there's nowhere for
    // a link to land yet.
    await createNotification(ctx, {
      userId,
      type: "campaign_pending",
      message: buildCampaignPendingMessage(title),
    });

    if (!isLeader) {
      const leaders = await ctx.db
        .query("societyMembers")
        .withIndex("by_community_status", (q) =>
          q.eq("communitySlug", communitySlug).eq("status", "approved"),
        )
        .collect();
      for (const leader of leaders.filter((m) => m.role === "leader")) {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", leader.userId))
          .unique();
        if (profile?.email) {
          await ctx.scheduler.runAfter(
            0,
            internal.emails.sendSocietyCampaignPending,
            {
              leaderEmail: profile.email,
              societyName: creatorName,
              campaignTitle: title,
            },
          );
        }
      }
    }

    return { slug, campaignId };
  },
});

/**
 * Stripe Identity plumbing — mirrors the internal functions of the same
 * names in societies.ts so campaignIdentity.ts and the shared identity
 * webhook can operate on campaigns the same way.
 */
export const getBySlugInternal = internalQuery({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const recordVerificationSessionCreated = internalMutation({
  args: {
    slug: v.string(),
    stripeVerificationSessionId: v.string(),
    status: v.union(
      v.literal("created"),
      v.literal("requires_input"),
      v.literal("processing"),
      v.literal("verified"),
      v.literal("canceled"),
    ),
  },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign) return null;
    await ctx.db.patch(campaign._id, {
      stripeVerificationSessionId: args.stripeVerificationSessionId,
      stripeVerificationStatus: args.status,
    });
    return null;
  },
});

/** Webhook-driven update — matches purely by stripeVerificationSessionId, no auth context. */
export const updateVerificationFromWebhook = internalMutation({
  args: {
    stripeVerificationSessionId: v.string(),
    status: v.union(
      v.literal("created"),
      v.literal("requires_input"),
      v.literal("processing"),
      v.literal("verified"),
      v.literal("canceled"),
    ),
    verifiedName: v.optional(v.string()),
    verifiedDob: v.optional(v.string()),
    lastErrorCode: v.optional(v.string()),
    lastErrorReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_stripeVerificationSessionId", (q) =>
        q.eq("stripeVerificationSessionId", args.stripeVerificationSessionId),
      )
      .unique();
    if (!campaign) return { updated: false };

    await ctx.db.patch(campaign._id, {
      stripeVerificationStatus: args.status,
      ...(args.verifiedName !== undefined ? { verifiedName: args.verifiedName } : {}),
      ...(args.verifiedDob !== undefined ? { verifiedDob: args.verifiedDob } : {}),
      // Only meaningful on requires_input — clear it on every other status so a
      // stale error message can't linger after a later successful attempt.
      stripeVerificationLastErrorCode:
        args.status === "requires_input" ? args.lastErrorCode : undefined,
      stripeVerificationLastErrorReason:
        args.status === "requires_input" ? args.lastErrorReason : undefined,
    });
    return { updated: true };
  },
});

/**
 * Permanently deletes a campaign — only from "rejected" (covers both a
 * pre-launch denial and a taken-down live campaign; see moderationAction to
 * tell them apart). Requires the admin to re-type the campaign's exact
 * title as an extra confirmation step, on top of the client-side dialog.
 * Refuses if any real money ever touched this campaign — donations,
 * recurring donations, or payouts — even though the campaign is otherwise
 * "archived", since those are financial/audit records, not moderation
 * clutter. Cascades: follows, likes, comments, review messages, related
 * notifications, and image storage.
 */
export const hardDelete = mutation({
  args: { slug: v.string(), confirmTitle: v.string() },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign || campaign.status !== "rejected") {
      throw new ConvexError({
        code: "INVALID_STATE",
        message: "Only a removed campaign can be permanently deleted.",
      });
    }
    if (args.confirmTitle.trim() !== campaign.title) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Typed title did not match the campaign title.",
      });
    }

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

    await logAdminAction(ctx, {
      adminUserId,
      action: "campaign.hardDelete",
      targetType: "campaign",
      targetId: args.slug,
      metadata: JSON.stringify({
        title: campaign.title,
        follows: follows.length,
        likes: likes.length,
        comments: comments.length,
        reviewMessages: reviewMessages.length,
        notifications: relatedNotifications.length,
      }),
    });

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
    return null;
  },
});

export const removePlaceholderCampaigns = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    let deleted = 0;

    for (const slug of placeholderCampaignSlugs) {
      const campaign = await ctx.db
        .query("campaigns")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

      if (campaign) {
        await ctx.db.delete(campaign._id);
        deleted += 1;
      }
    }

    return {
      deleted,
      slugs: placeholderCampaignSlugs,
    };
  },
});
