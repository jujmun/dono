import { ConvexError, v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireAdmin, requireUserId, requireVerifiedUser } from "./lib/authz";
import {
  assertNotRateLimited,
  recordRateLimitAttempt,
} from "./auth/rateLimit";

const AVATAR_UPLOAD_LIMIT = {
  maxAttempts: 10,
  windowMs: 15 * 60 * 1000,
  lockoutMs: 15 * 60 * 1000,
};

export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!user || !profile) {
      return null;
    }

    const storageUrl = profile.avatarStorageId
      ? await ctx.storage.getUrl(profile.avatarStorageId)
      : null;

    return {
      id: user._id,
      email: profile.email,
      name: profile.name ?? user.name ?? "",
      avatarUrl: storageUrl ?? profile.avatarUrl ?? null,
      role: profile.role,
      emailVerifiedAt: profile.emailVerifiedAt ?? null,
    };
  },
});

export const generateAvatarUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireVerifiedUser(ctx);
    const opts = { key: `avatarUpload:${userId}`, ...AVATAR_UPLOAD_LIMIT };
    await assertNotRateLimited(ctx, opts);
    await recordRateLimitAttempt(ctx, opts, false);
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateProfile = mutation({
  args: {
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const trimmedName = args.name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      throw new ConvexError({
        code: "INVALID_NAME",
        message: "Name must be between 2 and 80 characters.",
      });
    }
    if (args.avatarUrl && args.avatarUrl.length > 2048) {
      throw new ConvexError({
        code: "INVALID_AVATAR_URL",
        message: "Avatar URL is too long.",
      });
    }
    if (args.avatarStorageId) {
      const metadata = await ctx.db.system.get("_storage", args.avatarStorageId);
      if (!metadata) {
        throw new ConvexError({
          code: "INVALID_AVATAR",
          message: "Uploaded image was not found.",
        });
      }
      if (metadata.contentType && !metadata.contentType.startsWith("image/")) {
        throw new ConvexError({
          code: "INVALID_AVATAR",
          message: "Avatar must be an image file.",
        });
      }
      if (metadata.size > 5 * 1024 * 1024) {
        throw new ConvexError({
          code: "INVALID_AVATAR",
          message: "Avatar must be 5MB or smaller.",
        });
      }

      const owner = await ctx.db
        .query("storageOwners")
        .withIndex("by_storageId", (q) =>
          q.eq("storageId", args.avatarStorageId!),
        )
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
          storageId: args.avatarStorageId,
          createdAt: Date.now(),
        });
      }
    }
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    const now = Date.now();
    if (!profile) {
      const user = await ctx.db.get(userId);
      if (!user?.email) {
        throw new ConvexError({
          code: "PROFILE_MISSING",
          message: "User profile could not be initialized.",
        });
      }
      await ctx.db.insert("profiles", {
        userId,
        email: user.email,
        name: trimmedName,
        avatarUrl: args.avatarUrl,
        avatarStorageId: args.avatarStorageId,
        role: "user",
        emailVerifiedAt: user.emailVerificationTime ?? undefined,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      if (
        args.avatarStorageId &&
        profile.avatarStorageId &&
        profile.avatarStorageId !== args.avatarStorageId
      ) {
        await ctx.storage.delete(profile.avatarStorageId);
      }

      await ctx.db.patch(profile._id, {
        name: trimmedName,
        ...(args.avatarUrl !== undefined ? { avatarUrl: args.avatarUrl } : {}),
        ...(args.avatarStorageId !== undefined
          ? { avatarStorageId: args.avatarStorageId, avatarUrl: undefined }
          : {}),
        updatedAt: now,
      });
    }
  },
});

export const ensureProfile = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user?.email) return;

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        email: user.email,
        emailVerifiedAt: user.emailVerificationTime ?? existing.emailVerifiedAt,
        updatedAt: Date.now(),
      });
      return;
    }

    const now = Date.now();
    await ctx.db.insert("profiles", {
      userId: args.userId,
      email: user.email,
      name: user.name,
      avatarUrl: user.image,
      role: "user",
      emailVerifiedAt: user.emailVerificationTime ?? undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const ensureMyProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const user = await ctx.db.get(userId);
    if (!user?.email) return;

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        email: user.email,
        name: existing.name ?? user.name,
        avatarUrl: existing.avatarUrl ?? user.image,
        emailVerifiedAt: user.emailVerificationTime ?? existing.emailVerifiedAt,
        updatedAt: now,
      });
      return;
    }

    await ctx.db.insert("profiles", {
      userId,
      email: user.email,
      name: user.name,
      avatarUrl: user.image,
      role: "user",
      emailVerifiedAt: user.emailVerificationTime ?? undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const setUserRole = mutation({
  args: {
    targetUserId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.targetUserId))
      .unique();

    if (!profile) {
      throw new ConvexError({
        code: "PROFILE_NOT_FOUND",
        message: "Target user profile not found.",
      });
    }

    await ctx.db.patch(profile._id, { role: args.role, updatedAt: Date.now() });
  },
});

/** Promote the first admin. Client apps cannot call this — run from CLI:
 * `npx convex run users:bootstrapFirstAdmin '{"email":"you@college.ox.ac.uk"}'`
 */
export const bootstrapFirstAdmin = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const normalized = args.email.trim().toLowerCase();
    const domain = normalized.split("@")[1] ?? "";
    const isOxford = domain === "ox.ac.uk" || domain.endsWith(".ox.ac.uk");
    if (!isOxford) {
      throw new ConvexError({
        code: "EMAIL_DOMAIN_NOT_ALLOWED",
        message: "Only Oxford email addresses (ending in ox.ac.uk) are allowed.",
      });
    }

    const admins = await ctx.db
      .query("profiles")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .collect();
    if (admins.length > 0) {
      throw new ConvexError({
        code: "ADMIN_EXISTS",
        message: "An admin already exists. Use setUserRole instead.",
      });
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .unique();
    if (!profile) {
      throw new ConvexError({
        code: "PROFILE_NOT_FOUND",
        message: "No profile found for that email. Sign in once first.",
      });
    }

    await ctx.db.patch(profile._id, { role: "admin", updatedAt: Date.now() });
    return { ok: true };
  },
});
