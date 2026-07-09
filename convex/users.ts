import { ConvexError, v } from "convex/values";
import {
  action,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import {
  getAuthUserId,
  modifyAccountCredentials,
  retrieveAccount,
} from "@convex-dev/auth/server";
import { requireAdmin, requireAuth } from "./lib/authz";
import { validatePasswordRequirements } from "./auth/passwordPolicy";

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

    return {
      id: user._id,
      email: profile.email,
      name: profile.name ?? user.name ?? "",
      avatarUrl: profile.avatarUrl,
      role: profile.role,
      emailVerifiedAt: profile.emailVerifiedAt ?? null,
    };
  },
});

export const updateProfile = mutation({
  args: {
    name: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
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
        name: args.name.trim(),
        avatarUrl: args.avatarUrl,
        role: "user",
        emailVerifiedAt: user.emailVerificationTime ?? undefined,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      await ctx.db.patch(profile._id, {
        name: args.name.trim(),
        avatarUrl: args.avatarUrl,
        updatedAt: now,
      });
    }
  },
});

export const changePassword = action({
  args: {
    email: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const email = args.email.trim().toLowerCase();

    try {
      validatePasswordRequirements(args.newPassword);
      await retrieveAccount(ctx, {
        provider: "password",
        account: { id: email, secret: args.currentPassword },
      });
      await modifyAccountCredentials(ctx, {
        provider: "password",
        account: { id: email, secret: args.newPassword },
      });
      return { ok: true, userId };
    } catch {
      throw new ConvexError({
        code: "PASSWORD_CHANGE_FAILED",
        message: "Current password is incorrect or new password is invalid.",
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
    const userId = await requireAuth(ctx);
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

export const bootstrapFirstAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const normalized = args.email.trim().toLowerCase();
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
        message: "No profile found for that email. Sign in first.",
      });
    }

    await ctx.db.patch(profile._id, { role: "admin", updatedAt: Date.now() });
    return { ok: true };
  },
});
