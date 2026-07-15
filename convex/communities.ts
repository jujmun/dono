import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { toCommunity, toSocietyMembership } from "./lib/mappers";
import {
  optionalUserId,
  requireAdmin,
  requireVerifiedUser,
} from "./lib/authz";
import { clampLimit } from "./lib/pagination";

const placeholderCommunitySlugs = [
  "medsoc-cambridge",
  "st-annes",
  "cs-dept",
  "uni-orchestra",
  "boat-club",
  "drama-soc",
];

const MAX_NAME_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_REASON_LENGTH = 1000;

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function initialsFromName(name: string) {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SO"
  );
}

function isPublicVerifiedSociety(community: {
  type: string;
  verified: boolean;
  verificationStatus?: "pending" | "verified" | "rejected";
}) {
  if (community.type !== "society") return false;
  if (community.verificationStatus === "verified") return true;
  if (community.verificationStatus === undefined && community.verified) {
    return true;
  }
  return false;
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const communities = await ctx.db.query("communities").collect();
    return communities
      .filter(isPublicVerifiedSociety)
      .map(toCommunity);
  },
});

export const listFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = clampLimit(args.limit, 3);
    const communities = await ctx.db.query("communities").collect();
    return communities
      .filter(isPublicVerifiedSociety)
      .slice(0, limit)
      .map(toCommunity);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const community = await ctx.db
      .query("communities")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!community) return null;

    const userId = await optionalUserId(ctx);
    let membership = null;
    if (userId) {
      const member = await ctx.db
        .query("societyMembers")
        .withIndex("by_community_user", (q) =>
          q.eq("communitySlug", args.slug).eq("userId", userId),
        )
        .unique();
      if (member) {
        membership = toSocietyMembership(member);
      }
    }

    const isOwner = userId !== null && community.createdBy === userId;
    const canView =
      isPublicVerifiedSociety(community) ||
      isOwner ||
      (membership !== null &&
        (membership.status === "approved" || membership.status === "pending"));

    if (!canView) {
      return null;
    }

    return {
      society: toCommunity(community),
      membership,
    };
  },
});

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireVerifiedUser(ctx);
    const memberships = await ctx.db
      .query("societyMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const slugSet = new Set(
      memberships
        .filter((m) => m.status === "approved" || m.status === "pending")
        .map((m) => m.communitySlug),
    );

    const created = await ctx.db
      .query("communities")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", userId))
      .collect();
    for (const c of created) {
      slugSet.add(c.slug);
    }

    const societies = [];
    for (const slug of slugSet) {
      const community = await ctx.db
        .query("communities")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (!community || community.type !== "society") continue;
      const membership = memberships.find((m) => m.communitySlug === slug);
      societies.push({
        society: toCommunity(community),
        membership: membership ? toSocietyMembership(membership) : null,
      });
    }

    return societies.sort((a, b) =>
      a.society.name.localeCompare(b.society.name),
    );
  },
});

export const listPendingForAdmin = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const communities = await ctx.db
      .query("communities")
      .withIndex("by_verificationStatus", (q) =>
        q.eq("verificationStatus", "pending"),
      )
      .collect();
    const search = args.search?.trim().toLowerCase() ?? "";
    return communities
      .filter((c) => c.type === "society")
      .filter((c) => {
        if (!search) return true;
        return (
          c.name.toLowerCase().includes(search) ||
          c.university.toLowerCase().includes(search) ||
          c.description.toLowerCase().includes(search)
        );
      })
      .map(toCommunity);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const name = args.name.trim();
    const description = args.description.trim();

    if (!name || name.length > MAX_NAME_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Name is required and must be at most 120 characters.",
      });
    }
    if (!description || description.length > MAX_DESCRIPTION_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Description is required and must be at most 2000 characters.",
      });
    }

    let baseSlug = slugify(name);
    if (!baseSlug) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Name must contain letters or numbers.",
      });
    }
    let slug = baseSlug;
    let suffix = 1;
    while (
      await ctx.db
        .query("communities")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique()
    ) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const avatar = initialsFromName(name);
    await ctx.db.insert("communities", {
      slug,
      name,
      type: "society",
      description,
      avatar,
      coverImage: "default",
      university: "University of Oxford",
      followers: 0,
      campaigns: 0,
      totalRaised: 0,
      verified: false,
      verificationType: "society",
      verificationStatus: "pending",
      createdBy: userId,
    });

    await ctx.db.insert("societyMembers", {
      communitySlug: slug,
      userId,
      role: "leader",
      status: "approved",
      createdAt: Date.now(),
    });

    return { slug };
  },
});

export const listPaginated = query({
  args: {
    search: v.optional(v.string()),
    type: v.optional(v.string()),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = clampLimit(args.limit, 20, 50);
    let communities = await ctx.db.query("communities").collect();
    communities = communities.filter(isPublicVerifiedSociety);
    if (args.type && args.type !== "all") {
      communities = communities.filter((c) => c.type === args.type);
    }
    const search = args.search?.trim().toLowerCase() ?? "";
    if (search) {
      communities = communities.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.university.toLowerCase().includes(search),
      );
    }
    communities.sort((a, b) => a.name.localeCompare(b.name));

    let start = 0;
    if (args.cursor) {
      const idx = communities.findIndex((c) => c.slug === args.cursor);
      start = idx >= 0 ? idx + 1 : 0;
    }

    const page = communities.slice(start, start + limit);
    return {
      items: page.map(toCommunity),
      nextCursor: start + limit < communities.length ? page[page.length - 1]?.slug : null,
    };
  },
});

export const getForAdmin = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const community = await ctx.db
      .query("communities")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!community) return null;

    let creator = null;
    if (community.createdBy) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", community.createdBy!))
        .unique();
      if (profile) {
        creator = {
          userId: profile.userId,
          name: profile.name ?? "",
          email: profile.email,
        };
      }
    }

    return {
      community: toCommunity(community),
      creator,
      moderationNote: community.moderationNote ?? null,
      moderatedAt: community.moderatedAt ?? null,
    };
  },
});

export const listModeratedForAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const communities = await ctx.db.query("communities").collect();
    return communities
      .filter((c) => c.verificationStatus === "rejected")
      .sort((a, b) => (b.moderatedAt ?? 0) - (a.moderatedAt ?? 0))
      .map(toCommunity);
  },
});

export const verify = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const community = await ctx.db
      .query("communities")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (
      !community ||
      community.type !== "society" ||
      community.verificationStatus !== "pending"
    ) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending society not found.",
      });
    }

    await ctx.db.patch(community._id, {
      verified: true,
      verificationStatus: "verified",
      verificationType: "society",
      moderatedAt: Date.now(),
      moderatedBy: adminUserId,
      moderationNote: undefined,
    });

    if (community.createdBy) {
      const membership = await ctx.db
        .query("societyMembers")
        .withIndex("by_community_user", (q) =>
          q
            .eq("communitySlug", community.slug)
            .eq("userId", community.createdBy!),
        )
        .unique();
      if (membership) {
        await ctx.db.patch(membership._id, {
          role: "leader",
          status: "approved",
          reviewedAt: Date.now(),
          reviewedBy: adminUserId,
        });
      } else {
        await ctx.db.insert("societyMembers", {
          communitySlug: community.slug,
          userId: community.createdBy,
          role: "leader",
          status: "approved",
          createdAt: Date.now(),
          reviewedAt: Date.now(),
          reviewedBy: adminUserId,
        });
      }
    }

    if (community.createdBy) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", community.createdBy!))
        .unique();
      if (profile?.email) {
        await ctx.scheduler.runAfter(0, internal.emails.sendSocietyVerified, {
          email: profile.email,
          name: profile.name ?? "there",
          societyName: community.name,
        });
      }
    }

    return null;
  },
});

export const reject = mutation({
  args: { slug: v.string(), reason: v.string() },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const reason = args.reason.trim();
    if (!reason || reason.length > MAX_REASON_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "A reason between 1 and 1000 characters is required.",
      });
    }
    const community = await ctx.db
      .query("communities")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (
      !community ||
      community.type !== "society" ||
      community.verificationStatus !== "pending"
    ) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending society not found.",
      });
    }

    await ctx.db.patch(community._id, {
      verified: false,
      verificationStatus: "rejected",
      moderationNote: reason,
      moderatedAt: Date.now(),
      moderatedBy: adminUserId,
    });

    if (community.createdBy) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", community.createdBy!))
        .unique();
      if (profile?.email) {
        await ctx.scheduler.runAfter(0, internal.emails.sendSocietyRejected, {
          email: profile.email,
          name: profile.name ?? "there",
          societyName: community.name,
          reason,
        });
      }
    }

    return null;
  },
});

export const removePlaceholderCommunities = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    let deleted = 0;

    for (const slug of placeholderCommunitySlugs) {
      const community = await ctx.db
        .query("communities")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

      if (community) {
        await ctx.db.delete(community._id);
        deleted += 1;
      }
    }

    return { deleted, slugs: placeholderCommunitySlugs };
  },
});
