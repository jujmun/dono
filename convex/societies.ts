import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import {
  getProfileByUserId,
  optionalUserId,
  requireAdmin,
  requireVerifiedUser,
} from "./lib/authz";
import { logAdminAction } from "./adminAudit";
import {
  assertNotRateLimited,
  recordRateLimitAttempt,
} from "./auth/rateLimit";

const MAX_NAME_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_STORY_LENGTH = 5000;
const MAX_URL_LENGTH = 2048;
const MAX_DOCUMENTS = 5;
const MAX_REASON_LENGTH = 1000;

const UPLOAD_LIMIT = {
  maxAttempts: 10,
  windowMs: 15 * 60 * 1000,
  lockoutMs: 15 * 60 * 1000,
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isValidUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

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

/** Verify a storage id exists and bind it to `userId` on first reference. */
async function claimStorageId(
  ctx: MutationCtx,
  userId: Id<"users">,
  storageId: Id<"_storage">,
) {
  const metadata = await ctx.db.system.get("_storage", storageId);
  if (!metadata) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: "Uploaded file was not found.",
    });
  }

  const owner = await ctx.db
    .query("storageOwners")
    .withIndex("by_storageId", (q) => q.eq("storageId", storageId))
    .unique();
  if (owner && owner.userId !== userId) {
    throw new ConvexError({
      code: "FORBIDDEN",
      message: "You do not have permission for this action.",
    });
  }
  if (!owner) {
    await ctx.db.insert("storageOwners", {
      userId,
      storageId,
      createdAt: Date.now(),
    });
  }
}

type SocietyDoc = Doc<"societies">;

/** Public/"Discover" shape — never includes id document or supporting document fields. */
async function toPublicSociety(ctx: QueryCtx, society: SocietyDoc) {
  const coverImageUrl = society.coverImageStorageId
    ? await ctx.storage.getUrl(society.coverImageStorageId)
    : null;
  return {
    slug: society.slug,
    name: society.name,
    description: society.description,
    story: society.story,
    coverImageUrl,
    websiteUrl: society.websiteUrl,
    secondaryLink: society.secondaryLink ?? null,
    status: society.status,
    createdAt: society.createdAt,
  };
}

/** "My societies" shape — the creator's own submissions, still no raw file URLs. */
async function toMineSociety(ctx: QueryCtx, society: SocietyDoc) {
  const coverImageUrl = society.coverImageStorageId
    ? await ctx.storage.getUrl(society.coverImageStorageId)
    : null;
  const connectAccount = await ctx.db
    .query("stripeConnectAccounts")
    .withIndex("by_community", (q) => q.eq("communitySlug", society.slug))
    .first();
  return {
    slug: society.slug,
    name: society.name,
    description: society.description,
    story: society.story,
    coverImageUrl,
    websiteUrl: society.websiteUrl,
    secondaryLink: society.secondaryLink ?? null,
    status: society.status,
    createdAt: society.createdAt,
    moderationNote: society.moderationNote ?? null,
    moderatedAt: society.moderatedAt ?? null,
    supportingDocumentCount: society.supportingDocumentStorageIds.length,
    hasIdDocument: Boolean(society.idDocumentStorageId),
    connectOnboardingComplete: connectAccount?.onboardingComplete ?? false,
    connectPayoutsEnabled: connectAccount?.payoutsEnabled ?? false,
  };
}

/** Admin-review shape — the only place file URLs for verification docs are generated. */
async function toAdminSociety(ctx: QueryCtx, society: SocietyDoc) {
  const coverImageUrl = society.coverImageStorageId
    ? await ctx.storage.getUrl(society.coverImageStorageId)
    : null;
  const supportingDocumentUrls = (
    await Promise.all(
      society.supportingDocumentStorageIds.map((id) => ctx.storage.getUrl(id)),
    )
  ).filter((url): url is string => Boolean(url));
  const idDocumentUrl = await ctx.storage.getUrl(society.idDocumentStorageId);

  return {
    slug: society.slug,
    name: society.name,
    description: society.description,
    story: society.story,
    coverImageUrl,
    websiteUrl: society.websiteUrl,
    secondaryLink: society.secondaryLink ?? null,
    status: society.status,
    createdAt: society.createdAt,
    creatorId: society.creatorId,
    supportingDocumentUrls,
    idDocumentUrl,
    stripeVerificationStatus: society.stripeVerificationStatus ?? null,
    stripeVerificationLastErrorCode: society.stripeVerificationLastErrorCode ?? null,
    verifiedName: society.verifiedName ?? null,
    verifiedDob: society.verifiedDob ?? null,
  };
}

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireVerifiedUser(ctx);
    const opts = { key: `societyUpload:${userId}`, ...UPLOAD_LIMIT };
    await assertNotRateLimited(ctx, opts);
    await recordRateLimitAttempt(ctx, opts, false);
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    story: v.string(),
    websiteUrl: v.string(),
    secondaryLink: v.optional(v.string()),
    coverImageStorageId: v.optional(v.id("_storage")),
    supportingDocumentStorageIds: v.array(v.id("_storage")),
    idDocumentStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const name = args.name.trim();
    const description = args.description.trim();
    const story = args.story.trim();
    const websiteUrl = args.websiteUrl.trim();
    const secondaryLink = args.secondaryLink?.trim();

    if (!name || name.length > MAX_NAME_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Society name is required and must be at most 120 characters.",
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
        message: "About text is required and must be at most 5000 characters.",
      });
    }
    if (websiteUrl && (websiteUrl.length > MAX_URL_LENGTH || !isValidUrl(websiteUrl))) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Website must be a valid URL.",
      });
    }
    if (secondaryLink && (secondaryLink.length > MAX_URL_LENGTH || !isValidUrl(secondaryLink))) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Secondary link must be a valid URL.",
      });
    }
    if (args.supportingDocumentStorageIds.length > MAX_DOCUMENTS) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: `Provide at most ${MAX_DOCUMENTS} supporting documents.`,
      });
    }

    if (args.coverImageStorageId) {
      await claimStorageId(ctx, userId, args.coverImageStorageId);
    }
    for (const storageId of args.supportingDocumentStorageIds) {
      await claimStorageId(ctx, userId, storageId);
    }
    await claimStorageId(ctx, userId, args.idDocumentStorageId);

    let baseSlug = slugify(name);
    if (!baseSlug) baseSlug = "society";
    let slug = baseSlug;
    let suffix = 1;
    // Societies share the /societies/[slug] URL namespace with the legacy
    // communities catalog, so a slug must be unique across both tables.
    const slugTaken = async (candidate: string) => {
      const society = await ctx.db
        .query("societies")
        .withIndex("by_slug", (q) => q.eq("slug", candidate))
        .unique();
      if (society) return true;
      const community = await ctx.db
        .query("communities")
        .withIndex("by_slug", (q) => q.eq("slug", candidate))
        .unique();
      return Boolean(community);
    };
    while (await slugTaken(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const societyId = await ctx.db.insert("societies", {
      slug,
      name,
      description,
      story,
      coverImageStorageId: args.coverImageStorageId,
      websiteUrl,
      secondaryLink: secondaryLink || undefined,
      supportingDocumentStorageIds: args.supportingDocumentStorageIds,
      idDocumentStorageId: args.idDocumentStorageId,
      creatorId: userId,
      status: "pending",
      createdAt: Date.now(),
    });

    return { slug, societyId };
  },
});

/**
 * Lets the creator revise supporting documents and links while their society
 * is still pending review — the record is created as soon as identity
 * verification starts, before the applicant finishes the form.
 */
export const updateVerificationMaterials = mutation({
  args: {
    slug: v.string(),
    websiteUrl: v.string(),
    secondaryLink: v.optional(v.string()),
    supportingDocumentStorageIds: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const society = await ctx.db
      .query("societies")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!society || society.creatorId !== userId) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You do not have permission for this action.",
      });
    }
    if (society.status !== "pending") {
      throw new ConvexError({
        code: "INVALID_STATE",
        message: "This society has already been reviewed and can no longer be edited.",
      });
    }

    const websiteUrl = args.websiteUrl.trim();
    const secondaryLink = args.secondaryLink?.trim();
    if (websiteUrl && (websiteUrl.length > MAX_URL_LENGTH || !isValidUrl(websiteUrl))) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Website must be a valid URL.",
      });
    }
    if (secondaryLink && (secondaryLink.length > MAX_URL_LENGTH || !isValidUrl(secondaryLink))) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Secondary link must be a valid URL.",
      });
    }
    if (args.supportingDocumentStorageIds.length > MAX_DOCUMENTS) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: `Provide at most ${MAX_DOCUMENTS} supporting documents.`,
      });
    }

    for (const storageId of args.supportingDocumentStorageIds) {
      await claimStorageId(ctx, userId, storageId);
    }

    await ctx.db.patch(society._id, {
      websiteUrl,
      secondaryLink: secondaryLink || undefined,
      supportingDocumentStorageIds: args.supportingDocumentStorageIds,
    });
  },
});

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const societies = await ctx.db
      .query("societies")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
    return await Promise.all(societies.map((s) => toPublicSociety(ctx, s)));
  },
});

/**
 * Public landing-page lookup. Active societies are visible to everyone;
 * a pending or rejected society is returned only to its creator (so they
 * can preview their page), and looks like "not found" to anyone else.
 */
export const getPublicBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const society = await ctx.db
      .query("societies")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!society) return null;
    if (society.status !== "active") {
      const userId = await optionalUserId(ctx);
      if (!userId || society.creatorId !== userId) return null;
    }
    return await toPublicSociety(ctx, society);
  },
});

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireVerifiedUser(ctx);
    const societies = await ctx.db
      .query("societies")
      .withIndex("by_creatorId", (q) => q.eq("creatorId", userId))
      .collect();
    const sorted = societies.sort((a, b) => b._creationTime - a._creationTime);
    return await Promise.all(sorted.map((s) => toMineSociety(ctx, s)));
  },
});

export const listPendingForAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const societies = await ctx.db
      .query("societies")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    return await Promise.all(societies.map((s) => toAdminSociety(ctx, s)));
  },
});

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SO";
}

export const approve = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const society = await ctx.db
      .query("societies")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!society || society.status !== "pending") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending society not found.",
      });
    }
    await ctx.db.patch(society._id, { status: "active" });

    // Bridge into the membership catalog so join / campaign-on-behalf /
    // Connect payouts (keyed by communities.slug) work for approved societies.
    const existingCommunity = await ctx.db
      .query("communities")
      .withIndex("by_slug", (q) => q.eq("slug", society.slug))
      .unique();
    if (existingCommunity) {
      await ctx.db.patch(existingCommunity._id, {
        name: society.name,
        description: society.description,
        type: "society",
        verified: true,
        verificationType: "society",
        verificationStatus: "verified",
        createdBy: society.creatorId,
      });
    } else {
      const coverImage = society.coverImageStorageId
        ? ((await ctx.storage.getUrl(society.coverImageStorageId)) ?? "default")
        : "default";
      await ctx.db.insert("communities", {
        slug: society.slug,
        name: society.name,
        type: "society",
        description: society.description,
        avatar: initialsFromName(society.name),
        coverImage,
        university: "University of Oxford",
        followers: 0,
        campaigns: 0,
        totalRaised: 0,
        verified: true,
        verificationType: "society",
        verificationStatus: "verified",
        createdBy: society.creatorId,
      });
    }

    const existingMembership = await ctx.db
      .query("societyMembers")
      .withIndex("by_community_user", (q) =>
        q.eq("communitySlug", society.slug).eq("userId", society.creatorId),
      )
      .unique();
    if (existingMembership) {
      await ctx.db.patch(existingMembership._id, {
        role: "leader",
        status: "approved",
        reviewedAt: Date.now(),
        reviewedBy: adminUserId,
      });
    } else {
      await ctx.db.insert("societyMembers", {
        communitySlug: society.slug,
        userId: society.creatorId,
        role: "leader",
        status: "approved",
        createdAt: Date.now(),
        reviewedAt: Date.now(),
        reviewedBy: adminUserId,
      });
    }

    await logAdminAction(ctx, {
      adminUserId,
      action: "society.approve",
      targetType: "society",
      targetId: args.slug,
    });
    return null;
  },
});

export const reject = mutation({
  args: { slug: v.string(), reason: v.string() },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const reason = requireModerationReason(args.reason);
    const society = await ctx.db
      .query("societies")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!society || society.status !== "pending") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending society not found.",
      });
    }
    await ctx.db.patch(society._id, {
      status: "rejected",
      moderationNote: reason,
      moderatedAt: Date.now(),
      moderatedBy: adminUserId,
    });
    await logAdminAction(ctx, {
      adminUserId,
      action: "society.reject",
      targetType: "society",
      targetId: args.slug,
    });
    return null;
  },
});

/** Internal — used by the Stripe Identity action/webhook (ActionCtx has no ctx.db). */
export const getBySlug = internalQuery({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("societies")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

/** For action-context admin-or-owner checks (ActionCtx has no ctx.db). */
export const getCallerRole = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const profile = await getProfileByUserId(ctx, args.userId);
    return profile?.role ?? "user";
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
    const society = await ctx.db
      .query("societies")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!society) return null;
    await ctx.db.patch(society._id, {
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
    const society = await ctx.db
      .query("societies")
      .withIndex("by_stripeVerificationSessionId", (q) =>
        q.eq("stripeVerificationSessionId", args.stripeVerificationSessionId),
      )
      .unique();
    if (!society) return { updated: false };

    await ctx.db.patch(society._id, {
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

/** Live status for the wizard's own in-progress society — owner-only, no file URLs. */
export const getMine = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const society = await ctx.db
      .query("societies")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!society || society.creatorId !== userId) {
      return null;
    }
    return {
      slug: society.slug,
      status: society.status,
      stripeVerificationStatus: society.stripeVerificationStatus ?? null,
      stripeVerificationLastErrorCode: society.stripeVerificationLastErrorCode ?? null,
      stripeVerificationLastErrorReason: society.stripeVerificationLastErrorReason ?? null,
    };
  },
});
