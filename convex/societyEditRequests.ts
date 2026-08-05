import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import {
  canManageSociety,
  requireAdmin,
  requireVerifiedUser,
} from "./lib/authz";
import { createNotification } from "./lib/notifications";

const MAX_NAME_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_STORY_LENGTH = 5000;
const MAX_URL_LENGTH = 2048;
const MAX_NOTE = 2000;

const proposedFields = v.object({
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  story: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  secondaryLink: v.optional(v.string()),
  socialUrl: v.optional(v.string()),
  coverImageStorageId: v.optional(v.id("_storage")),
});

type Proposed = {
  name?: string;
  description?: string;
  story?: string;
  websiteUrl?: string;
  secondaryLink?: string;
  socialUrl?: string;
  coverImageStorageId?: Id<"_storage">;
};

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeOptionalUrl(value: string, label: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  if (candidate.length > MAX_URL_LENGTH || !isValidUrl(candidate)) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: `${label} must be a valid URL.`,
    });
  }
  return candidate;
}

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

function normalizeProposed(raw: Proposed): Proposed {
  const proposed: Proposed = {};

  if (raw.name !== undefined) {
    const name = raw.name.trim();
    if (!name || name.length > MAX_NAME_LENGTH) {
      throw new ConvexError({ code: "INVALID_INPUT", message: "Invalid name." });
    }
    proposed.name = name;
  }
  if (raw.description !== undefined) {
    const description = raw.description.trim();
    if (!description || description.length > MAX_DESCRIPTION_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Invalid description.",
      });
    }
    proposed.description = description;
  }
  if (raw.story !== undefined) {
    const story = raw.story.trim();
    if (!story || story.length > MAX_STORY_LENGTH) {
      throw new ConvexError({ code: "INVALID_INPUT", message: "Invalid story." });
    }
    proposed.story = story;
  }
  if (raw.websiteUrl !== undefined) {
    proposed.websiteUrl = normalizeOptionalUrl(raw.websiteUrl, "Website");
  }
  if (raw.secondaryLink !== undefined) {
    proposed.secondaryLink = normalizeOptionalUrl(raw.secondaryLink, "Secondary link");
  }
  if (raw.socialUrl !== undefined) {
    proposed.socialUrl = normalizeOptionalUrl(raw.socialUrl, "Social URL");
  }
  if (raw.coverImageStorageId !== undefined) {
    proposed.coverImageStorageId = raw.coverImageStorageId;
  }

  if (Object.keys(proposed).length === 0) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: "No changes to submit.",
    });
  }

  return proposed;
}

async function replacePendingRequest(
  ctx: MutationCtx,
  societyId: Id<"societies">,
  requestedBy: Id<"users">,
  proposed: Proposed,
) {
  const existing = await ctx.db
    .query("societyEditRequests")
    .withIndex("by_society", (q) => q.eq("societyId", societyId))
    .collect();
  for (const row of existing) {
    if (row.status === "pending") {
      await ctx.db.delete(row._id);
    }
  }
  return await ctx.db.insert("societyEditRequests", {
    societyId,
    requestedBy,
    proposed,
    status: "pending" as const,
    createdAt: Date.now(),
  });
}

async function syncCommunityFromSociety(
  ctx: MutationCtx,
  society: Doc<"societies">,
) {
  const community = await ctx.db
    .query("communities")
    .withIndex("by_slug", (q) => q.eq("slug", society.slug))
    .unique();
  if (!community) return;

  const coverImage = society.coverImageStorageId
    ? ((await ctx.storage.getUrl(society.coverImageStorageId)) ?? community.coverImage)
    : community.coverImage;

  await ctx.db.patch(community._id, {
    name: society.name,
    description: society.description,
    coverImage,
  });
}

function currentSnapshot(society: Doc<"societies">) {
  return {
    name: society.name,
    description: society.description,
    story: society.story,
    websiteUrl: society.websiteUrl,
    secondaryLink: society.secondaryLink ?? "",
    socialUrl: society.socialUrl ?? "",
    coverImageStorageId: society.coverImageStorageId ?? null,
  };
}

export const propose = mutation({
  args: {
    slug: v.string(),
    proposed: proposedFields,
  },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const society = await ctx.db
      .query("societies")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!society) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Society not found." });
    }
    if (!(await canManageSociety(ctx, userId, society.slug))) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You do not have permission for this action.",
      });
    }
    if (society.status !== "active") {
      throw new ConvexError({
        code: "INVALID_STATE",
        message: "Only active societies can propose edits for admin review.",
      });
    }

    const proposed = normalizeProposed(args.proposed);
    if (proposed.coverImageStorageId) {
      await claimStorageId(ctx, userId, proposed.coverImageStorageId);
    }

    const requestId = await replacePendingRequest(
      ctx,
      society._id,
      userId,
      proposed,
    );

    const admins = await ctx.db
      .query("profiles")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .collect();
    const message = `'${society.name}' has proposed profile edits awaiting review.`;
    for (const admin of admins) {
      await createNotification(ctx, {
        userId: admin.userId,
        type: "admin_message",
        message,
      });
    }

    return { requestId };
  },
});

export const adminReview = mutation({
  args: {
    requestId: v.id("societyEditRequests"),
    decision: v.union(v.literal("approve"), v.literal("reject")),
    reviewNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const request = await ctx.db.get(args.requestId);
    if (!request || request.status !== "pending") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending edit request not found.",
      });
    }

    const society = await ctx.db.get(request.societyId);
    if (!society) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Society not found." });
    }

    const reviewNote = args.reviewNote?.trim();
    if (reviewNote && reviewNote.length > MAX_NOTE) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Review note must be at most 2000 characters.",
      });
    }

    const now = Date.now();
    if (args.decision === "approve") {
      const patch: Record<string, unknown> = {};
      const p = request.proposed;
      if (p.name !== undefined) patch.name = p.name;
      if (p.description !== undefined) patch.description = p.description;
      if (p.story !== undefined) patch.story = p.story;
      if (p.websiteUrl !== undefined) patch.websiteUrl = p.websiteUrl;
      if (p.secondaryLink !== undefined) {
        patch.secondaryLink = p.secondaryLink || undefined;
      }
      if (p.socialUrl !== undefined) {
        patch.socialUrl = p.socialUrl || undefined;
      }
      if (p.coverImageStorageId !== undefined) {
        patch.coverImageStorageId = p.coverImageStorageId;
      }
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(society._id, patch);
      }
      const refreshed = await ctx.db.get(society._id);
      if (refreshed) {
        await syncCommunityFromSociety(ctx, refreshed);
      }
      await ctx.db.patch(args.requestId, {
        status: "approved",
        reviewedAt: now,
        reviewedBy: adminUserId,
        reviewNote: reviewNote || undefined,
      });
    } else {
      await ctx.db.patch(args.requestId, {
        status: "rejected",
        reviewedAt: now,
        reviewedBy: adminUserId,
        reviewNote: reviewNote || undefined,
      });
    }

    await createNotification(ctx, {
      userId: request.requestedBy,
      type: "admin_message",
      message:
        args.decision === "approve"
          ? `Your edits to '${society.name}' were approved and are now live.`
          : `Your proposed edits to '${society.name}' were not approved.`,
      senderId: adminUserId,
    });

    return null;
  },
});

export const listPendingForAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db
      .query("societyEditRequests")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    const enriched = await Promise.all(
      rows
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(async (r) => {
          const society = await ctx.db.get(r.societyId);
          if (!society) return null;
          let proposedCoverUrl: string | null = null;
          if (r.proposed.coverImageStorageId) {
            proposedCoverUrl =
              (await ctx.storage.getUrl(r.proposed.coverImageStorageId)) ?? null;
          }
          let currentCoverUrl: string | null = null;
          if (society.coverImageStorageId) {
            currentCoverUrl =
              (await ctx.storage.getUrl(society.coverImageStorageId)) ?? null;
          }
          return {
            id: r._id,
            societyId: r.societyId,
            societySlug: society.slug,
            societyName: society.name,
            orgType: society.orgType === "college" ? "college" : "society",
            requestedBy: r.requestedBy,
            proposed: r.proposed,
            proposedCoverUrl,
            current: currentSnapshot(society),
            currentCoverUrl,
            createdAt: r.createdAt,
          };
        }),
    );
    return enriched.filter((row): row is NonNullable<typeof row> => row !== null);
  },
});

export const getPendingForEntity = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const society = await ctx.db
      .query("societies")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!society) return null;
    if (!(await canManageSociety(ctx, userId, society.slug))) {
      return null;
    }
    const rows = await ctx.db
      .query("societyEditRequests")
      .withIndex("by_society", (q) => q.eq("societyId", society._id))
      .collect();
    const pending = rows.find((r) => r.status === "pending");
    if (!pending) return null;
    return {
      id: pending._id,
      proposed: pending.proposed,
      createdAt: pending.createdAt,
    };
  },
});
