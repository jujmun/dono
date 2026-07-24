import { ConvexError, v } from "convex/values";
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import {
  createAccount,
  getAuthUserId,
  modifyAccountCredentials,
  retrieveAccount,
} from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { validatePasswordRequirements } from "./auth/passwordPolicy";
import { requireAdmin, requireUserId, requireVerifiedUser } from "./lib/authz";
import { isAdminIdentityEmail } from "./auth/adminConfig";
import {
  assertNotRateLimited,
  recordRateLimitAttempt,
} from "./auth/rateLimit";
import { toCampaign } from "./lib/mappers";
import { createNotification, ONBOARDING_MESSAGE } from "./lib/notifications";
import { assertAdultOrThrow } from "./lib/ageGate";

function roleForEmail(email: string): "user" | "admin" {
  return isAdminIdentityEmail(email) ? "admin" : "user";
}

const AVATAR_UPLOAD_LIMIT = {
  maxAttempts: 10,
  windowMs: 15 * 60 * 1000,
  lockoutMs: 15 * 60 * 1000,
};

const PASSWORD_RATE_LIMIT = {
  maxAttempts: 5,
  windowMs: 10 * 60 * 1000,
  lockoutMs: 15 * 60 * 1000,
} as const;

function passwordRateLimitKey(
  kind: "set" | "change",
  email: string,
) {
  return `${kind}-password:${email}`;
}

async function linkGuestDonationsForUser(
  ctx: MutationCtx,
  userId: Id<"users">,
  email: string,
) {
  const normalized = email.trim().toLowerCase();
  const guestDonations = await ctx.db
    .query("donations")
    .withIndex("by_donorEmail", (q) => q.eq("donorEmail", normalized))
    .collect();

  for (const donation of guestDonations) {
    if (!donation.userId) {
      await ctx.db.patch(donation._id, { userId });
    }
  }
}

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
      phone: profile.phone ?? null,
      college: profile.college ?? null,
      degree: profile.degree ?? null,
      yearInCollege: profile.yearInCollege ?? null,
      dateOfBirth: profile.dateOfBirth ?? null,
      avatarUrl: storageUrl ?? profile.avatarUrl ?? null,
      role: profile.role,
      emailVerifiedAt: profile.emailVerifiedAt ?? null,
    };
  },
});

/** Admin-only: student profile + their campaigns for moderation context. */
export const getStudentForAdmin = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (!profile) return null;

    const storageUrl = profile.avatarStorageId
      ? await ctx.storage.getUrl(profile.avatarStorageId)
      : null;

    const campaigns = await ctx.db.query("campaigns").collect();
    const theirs = campaigns
      .filter((c) => c.createdBy === args.userId)
      .sort((a, b) => b._creationTime - a._creationTime)
      .map(toCampaign);

    return {
      userId: profile.userId,
      name: profile.name ?? "",
      email: profile.email,
      avatarUrl: storageUrl ?? profile.avatarUrl ?? null,
      role: profile.role,
      emailVerifiedAt: profile.emailVerifiedAt ?? null,
      createdAt: profile.createdAt,
      campaigns: theirs,
    };
  },
});

/** Recipient picker for admin messaging (Feature 2) — name/email are the
 * only identifiers profiles have today (no username field). Mirrors
 * campaigns.listPendingForAdmin's .collect() + in-memory filter convention. */
export const searchForAdmin = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const term = args.search?.trim().toLowerCase();
    const profiles = await ctx.db.query("profiles").collect();
    const matches = term
      ? profiles.filter(
          (p) =>
            (p.name ?? "").toLowerCase().includes(term) ||
            p.email.toLowerCase().includes(term),
        )
      : profiles;

    return matches
      .sort((a, b) => (a.name ?? a.email).localeCompare(b.name ?? b.email))
      .slice(0, 25)
      .map((p) => ({
        userId: p.userId,
        name: p.name ?? "",
        email: p.email,
        role: p.role,
      }));
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
    phone: v.optional(v.string()),
    college: v.optional(v.string()),
    degree: v.optional(v.string()),
    yearInCollege: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
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

    if (args.dateOfBirth) {
      assertAdultOrThrow(args.dateOfBirth, "You must be at least 18 years old.");
    }

    const trimmedPhone = args.phone?.trim();
    if (trimmedPhone) {
      if (trimmedPhone.length < 7 || trimmedPhone.length > 20) {
        throw new ConvexError({
          code: "INVALID_PHONE",
          message: "Phone number must be between 7 and 20 characters.",
        });
      }
      if (!/^[+\d][\d\s()-]{6,18}\d$/.test(trimmedPhone)) {
        throw new ConvexError({
          code: "INVALID_PHONE",
          message: "Enter a valid phone number.",
        });
      }
    }

    const trimmedCollege = args.college?.trim();
    if (trimmedCollege && (trimmedCollege.length < 2 || trimmedCollege.length > 80)) {
      throw new ConvexError({
        code: "INVALID_COLLEGE",
        message: "College must be between 2 and 80 characters.",
      });
    }

    const trimmedDegree = args.degree?.trim();
    if (trimmedDegree && (trimmedDegree.length < 2 || trimmedDegree.length > 80)) {
      throw new ConvexError({
        code: "INVALID_DEGREE",
        message: "Degree must be between 2 and 80 characters.",
      });
    }

    const yearInCollege = args.yearInCollege?.trim();
    if (yearInCollege && yearInCollege.length > 40) {
      throw new ConvexError({
        code: "INVALID_YEAR",
        message: "Year in college is too long.",
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
        phone: trimmedPhone,
        college: trimmedCollege,
        degree: trimmedDegree,
        yearInCollege,
        ...(args.dateOfBirth
          ? {
              dateOfBirth: args.dateOfBirth.trim(),
              ageAttestedAt: now,
            }
          : {}),
        avatarUrl: args.avatarUrl,
        avatarStorageId: args.avatarStorageId,
        role: roleForEmail(user.email),
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
        ...(args.phone !== undefined ? { phone: trimmedPhone } : {}),
        ...(args.college !== undefined ? { college: trimmedCollege } : {}),
        ...(args.degree !== undefined ? { degree: trimmedDegree } : {}),
        ...(args.yearInCollege !== undefined ? { yearInCollege } : {}),
        ...(args.dateOfBirth !== undefined
          ? {
              dateOfBirth: args.dateOfBirth.trim(),
              ageAttestedAt: now,
            }
          : {}),
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
        ...(isAdminIdentityEmail(user.email) ? { role: "admin" as const } : {}),
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
      role: roleForEmail(user.email),
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
        phone: existing.phone,
        college: existing.college,
        degree: existing.degree,
        yearInCollege: existing.yearInCollege,
        avatarUrl: existing.avatarUrl ?? user.image,
        avatarStorageId: existing.avatarStorageId,
        emailVerifiedAt: user.emailVerificationTime ?? existing.emailVerifiedAt,
        ...(isAdminIdentityEmail(user.email) ? { role: "admin" as const } : {}),
        updatedAt: now,
      });
      await linkGuestDonationsForUser(ctx, userId, user.email);
      return;
    }

    await ctx.db.insert("profiles", {
      userId,
      email: user.email,
      name: user.name,
      avatarUrl: user.image,
      role: roleForEmail(user.email),
      emailVerifiedAt: user.emailVerificationTime ?? undefined,
      createdAt: now,
      updatedAt: now,
    });
    await linkGuestDonationsForUser(ctx, userId, user.email);
    // TODO: replace with real onboarding flow — placeholder notification
    // only, no relatedEntityId (no onboarding route exists yet).
    await createNotification(ctx, {
      userId,
      type: "onboarding",
      message: ONBOARDING_MESSAGE,
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

export const requestAccountDeletion = mutation({
  args: {},
  handler: async (ctx) => {
    const { userId, profile } = await requireVerifiedUser(ctx);
    const anonymized = `deleted-${userId}@deleted.dono.app`;
    if (profile) {
      await ctx.db.patch(profile._id, {
        email: anonymized,
        name: "Deleted User",
        phone: undefined,
        college: undefined,
        degree: undefined,
        yearInCollege: undefined,
        avatarUrl: undefined,
        avatarStorageId: undefined,
        updatedAt: Date.now(),
      });
    }
    return { requestedAt: Date.now() };
  },
});

export const hasPassword = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;
    return await passwordAccountExists(ctx, userId);
  },
});

async function passwordAccountExists(ctx: QueryCtx, userId: Id<"users">) {
  const account = await ctx.db
    .query("authAccounts")
    .withIndex("userIdAndProvider", (q) =>
      q.eq("userId", userId).eq("provider", "password"),
    )
    .unique();

  return account !== null;
}

export const internalHasPassword = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await passwordAccountExists(ctx, args.userId);
  },
});

export const beginPasswordAttempt = internalMutation({
  args: {
    email: v.string(),
    kind: v.union(v.literal("set"), v.literal("change")),
  },
  handler: async (ctx, args) => {
    const opts = {
      key: passwordRateLimitKey(args.kind, args.email),
      ...PASSWORD_RATE_LIMIT,
    };
    await assertNotRateLimited(ctx, opts);
    await recordRateLimitAttempt(ctx, opts, false);
  },
});

export const completePasswordAttempt = internalMutation({
  args: {
    email: v.string(),
    kind: v.union(v.literal("set"), v.literal("change")),
  },
  handler: async (ctx, args) => {
    const opts = {
      key: passwordRateLimitKey(args.kind, args.email),
      ...PASSWORD_RATE_LIMIT,
    };
    await recordRateLimitAttempt(ctx, opts, true);
  },
});

export const setPassword = action({
  args: { newPassword: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to perform this action.",
      });
    }

    const profile = await ctx.runQuery(internal.users.getEmailForPasswordAction, {
      userId,
    });
    const email = profile.email;

    await ctx.runMutation(internal.users.beginPasswordAttempt, {
      email,
      kind: "set",
    });

    try {
      const alreadyHasPassword = await ctx.runQuery(
        internal.users.internalHasPassword,
        { userId },
      );
      if (alreadyHasPassword) {
        throw new ConvexError({
          code: "PASSWORD_ALREADY_SET",
          message: "You already have a password. Use change password instead.",
        });
      }

      validatePasswordRequirements(args.newPassword);

      await createAccount(ctx, {
        provider: "password",
        account: { id: email, secret: args.newPassword },
        profile: { email },
        shouldLinkViaEmail: true,
      });

      await ctx.runMutation(internal.users.completePasswordAttempt, {
        email,
        kind: "set",
      });
    } catch (error) {
      if (
        error instanceof ConvexError &&
        (error.data as { code?: string })?.code === "PASSWORD_ALREADY_SET"
      ) {
        throw error;
      }
      if (error instanceof ConvexError) {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      if (/already exists|account already/i.test(message)) {
        throw new ConvexError({
          code: "PASSWORD_ALREADY_SET",
          message: "You already have a password. Use change password instead.",
        });
      }
      throw error;
    }
  },
});

export const changePassword = action({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to perform this action.",
      });
    }

    const profile = await ctx.runQuery(internal.users.getEmailForPasswordAction, {
      userId,
    });
    const email = profile.email;

    await ctx.runMutation(internal.users.beginPasswordAttempt, {
      email,
      kind: "change",
    });

    try {
      const hasPw = await ctx.runQuery(internal.users.internalHasPassword, {
        userId,
      });
      if (!hasPw) {
        throw new ConvexError({
          code: "PASSWORD_NOT_SET",
          message: "Set a password first before changing it.",
        });
      }

      try {
        await retrieveAccount(ctx, {
          provider: "password",
          account: { id: email, secret: args.currentPassword },
        });
      } catch {
        throw new ConvexError({
          code: "CURRENT_PASSWORD_INCORRECT",
          message: "Current password is incorrect.",
        });
      }

      validatePasswordRequirements(args.newPassword);

      await modifyAccountCredentials(ctx, {
        provider: "password",
        account: { id: email, secret: args.newPassword },
      });

      await ctx.runMutation(internal.users.completePasswordAttempt, {
        email,
        kind: "change",
      });
    } catch (error) {
      if (error instanceof ConvexError) {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      if (/invalid credentials|incorrect/i.test(message)) {
        throw new ConvexError({
          code: "CURRENT_PASSWORD_INCORRECT",
          message: "Current password is incorrect.",
        });
      }
      throw error;
    }
  },
});

export const getEmailForPasswordAction = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    const email = (profile?.email ?? user?.email)?.trim().toLowerCase();
    if (!email) {
      throw new ConvexError({
        code: "PROFILE_MISSING",
        message: "User profile could not be loaded.",
      });
    }

    const verified =
      Boolean(user?.emailVerificationTime) || Boolean(profile?.emailVerifiedAt);
    if (!verified) {
      throw new ConvexError({
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email before continuing.",
      });
    }

    return { email };
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

/** Promote an additional admin once one already exists (bootstrapFirstAdmin
 * refuses once any admin is present). Client apps cannot call this — run
 * from CLI: `npx convex run users:promoteToAdmin '{"email":"you@college.ox.ac.uk"}'`
 */
export const promoteToAdmin = internalMutation({
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
