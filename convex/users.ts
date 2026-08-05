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
import { isAdminIdentityEmail, isAllowedAuthEmail } from "./auth/adminConfig";
import {
  assertNotRateLimited,
  recordRateLimitAttempt,
} from "./auth/rateLimit";
import { toCampaign } from "./lib/mappers";
import { assertAdultOrThrow } from "./lib/ageGate";

const userTypeValidator = v.union(v.literal("student"), v.literal("alumni"));

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
      userType: profile.userType ?? null,
      matriculationYear: profile.matriculationYear ?? null,
      interestedSocietySlugs: profile.interestedSocietySlugs ?? [],
      emailVerifiedAt: profile.emailVerifiedAt ?? null,
      onboardingSkippedAt: profile.onboardingSkippedAt ?? null,
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
      // Tombstone from account deletion — patching it would write the released
      // email back onto a profile that is only kept for historical records.
      if (existing.deletedAt) return;
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
      // Tombstone from account deletion — see ensureProfile. This is the path
      // that used to un-anonymize a deleted profile on the next app load.
      if (existing.deletedAt) return;
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
  },
});

/** Called when the user explicitly skips profile setup from /onboarding.
 * Marks the profile so the auth guard stops forcing them back there. */
export const skipOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!profile || profile.onboardingSkippedAt) return;

    await ctx.db.patch(profile._id, { onboardingSkippedAt: Date.now() });
  },
});

/**
 * Persist Student vs Alumni choice chosen on /signup.
 * Server-only write — callers never get to set admin `role` via this path.
 * Locked after first set so a client cannot flip audience later.
 */
export const setUserType = mutation({
  args: { userType: userTypeValidator },
  handler: async (ctx, args) => {
    const { userId, user } = await requireVerifiedUser(ctx);

    // Students must use Oxford (or allowlisted admin) email — blocks flipping
    // alumni Gmail sign-up into a student account after the fact.
    if (
      args.userType === "student" &&
      user.email &&
      !isAllowedAuthEmail(user.email)
    ) {
      throw new ConvexError({
        code: "EMAIL_DOMAIN_NOT_ALLOWED",
        message: "Student accounts require an Oxford email address (ending in ox.ac.uk).",
      });
    }

    let profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    // Race: auth may return before ensureMyProfile has inserted the row.
    if (!profile) {
      if (!user.email) {
        throw new ConvexError({
          code: "PROFILE_MISSING",
          message: "User profile could not be found.",
        });
      }
      const now = Date.now();
      const profileId = await ctx.db.insert("profiles", {
        userId,
        email: user.email,
        name: user.name,
        avatarUrl: user.image,
        role: roleForEmail(user.email),
        userType: args.userType,
        emailVerifiedAt: user.emailVerificationTime ?? undefined,
        createdAt: now,
        updatedAt: now,
      });
      return { userType: args.userType, profileId };
    }

    // Tombstone from account deletion — see ensureProfile.
    if (profile.deletedAt) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You do not have permission for this action.",
      });
    }

    if (profile.userType && profile.userType !== args.userType) {
      throw new ConvexError({
        code: "USER_TYPE_LOCKED",
        message: "Account type has already been set and cannot be changed.",
      });
    }
    if (profile.userType === args.userType) {
      return { userType: args.userType };
    }
    await ctx.db.patch(profile._id, {
      userType: args.userType,
      updatedAt: Date.now(),
    });
    return { userType: args.userType };
  },
});

/**
 * Completes alumni onboarding. Enforces userType === alumni server-side.
 */
export const completeAlumniOnboarding = mutation({
  args: {
    name: v.string(),
    college: v.string(),
    matriculationYear: v.string(),
    dateOfBirth: v.string(),
    interestedSocietySlugs: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, profile } = await requireVerifiedUser(ctx);
    if (!profile) {
      throw new ConvexError({
        code: "PROFILE_MISSING",
        message: "User profile could not be found.",
      });
    }
    if (profile.userType !== "alumni") {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Alumni onboarding is only available for alumni accounts.",
      });
    }

    const trimmedName = args.name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      throw new ConvexError({
        code: "INVALID_NAME",
        message: "Name must be between 2 and 80 characters.",
      });
    }

    const trimmedCollege = args.college.trim();
    if (trimmedCollege.length < 2 || trimmedCollege.length > 80) {
      throw new ConvexError({
        code: "INVALID_COLLEGE",
        message: "College must be between 2 and 80 characters.",
      });
    }

    const year = args.matriculationYear.trim();
    if (!/^\d{4}$/.test(year)) {
      throw new ConvexError({
        code: "INVALID_YEAR",
        message: "Enter a four-digit matriculation or graduation year.",
      });
    }
    const yearNum = Number(year);
    const currentYear = new Date().getFullYear();
    if (yearNum < 1950 || yearNum > currentYear) {
      throw new ConvexError({
        code: "INVALID_YEAR",
        message: `Year must be between 1950 and ${currentYear}.`,
      });
    }

    assertAdultOrThrow(
      args.dateOfBirth.trim(),
      "You must be at least 18 years old.",
    );

    if (args.interestedSocietySlugs.length > 40) {
      throw new ConvexError({
        code: "INVALID_SOCIETIES",
        message: "Too many societies selected.",
      });
    }

    const uniqueSlugs = [
      ...new Set(
        args.interestedSocietySlugs
          .map((s) => s.trim())
          .filter((s) => s.length > 0 && s.length <= 80),
      ),
    ];

    const now = Date.now();
    await ctx.db.patch(profile._id, {
      name: trimmedName,
      college: trimmedCollege,
      matriculationYear: year,
      dateOfBirth: args.dateOfBirth.trim(),
      ageAttestedAt: now,
      interestedSocietySlugs: uniqueSlugs,
      updatedAt: now,
    });

    // Best-effort follows for active societies that have a communities catalog row.
    for (const slug of uniqueSlugs) {
      const community = await ctx.db
        .query("communities")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (!community) continue;

      const existing = await ctx.db
        .query("communityFollows")
        .withIndex("by_community_user", (q) =>
          q.eq("communitySlug", slug).eq("userId", userId),
        )
        .unique();
      if (existing) continue;

      await ctx.db.insert("communityFollows", {
        userId,
        communitySlug: slug,
        createdAt: now,
      });
      await ctx.db.patch(community._id, {
        followers: community.followers + 1,
      });
    }

    return null;
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

/**
 * Releases a deleted account's email so a later signup with the same address
 * creates a genuinely new account, while keeping the `users` row itself —
 * donations, subscriptions, payouts, legal acceptances and audit entries all
 * point at that id and must stay resolvable.
 *
 * Both of @convex-dev/auth's re-link paths have to be broken together, or the
 * next signup lands back on this row:
 *  - `authAccounts` lookup by (provider, providerAccountId = email);
 *  - the `users.email` + `emailVerificationTime` lookup it falls back to when
 *    no account row matches (`uniqueUserWithVerifiedEmail`), which would then
 *    create a fresh authAccounts row pointing straight back here.
 *
 * The email is rewritten to a per-user sentinel rather than cleared because
 * security.ts looks up `users` by email with `.unique()`, which throws if two
 * rows ever share an address.
 */
export const severAccountIdentity = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const { userId } = args;
    const now = Date.now();
    const anonymized = `deleted-${userId}@deleted.invalid`;

    await ctx.db.patch(userId, {
      email: anonymized,
      emailVerificationTime: undefined,
      name: undefined,
      image: undefined,
      phone: undefined,
      phoneVerificationTime: undefined,
    });

    // Every credential mapping the old email to this user — a single user can
    // hold several (password + resend + admin-email).
    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .collect();
    for (const account of accounts) {
      const codes = await ctx.db
        .query("authVerificationCodes")
        .withIndex("accountId", (q) => q.eq("accountId", account._id))
        .collect();
      for (const code of codes) {
        await ctx.db.delete(code._id);
      }
      await ctx.db.delete(account._id);
    }

    // Every live session, not just the caller's device — otherwise another
    // signed-in device could patch the released email back via ensureMyProfile.
    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    for (const session of sessions) {
      const refreshTokens = await ctx.db
        .query("authRefreshTokens")
        .withIndex("sessionId", (q) => q.eq("sessionId", session._id))
        .collect();
      for (const token of refreshTokens) {
        await ctx.db.delete(token._id);
      }
      await ctx.db.delete(session._id);
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
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
        deletedAt: now,
        updatedAt: now,
      });
    }

    // Campaign update emails send to `donorEmail` directly when it is set, so
    // anonymizing the profile alone would keep mail flowing to the address we
    // just released.
    const optIns = await ctx.db
      .query("campaignUpdateOptIns")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const optIn of optIns) {
      if (optIn.unsubscribedAt) continue;
      await ctx.db.patch(optIn._id, { unsubscribedAt: now });
    }

    return { deletedAt: now };
  },
});

export const requestAccountDeletion = action({
  args: {},
  handler: async (ctx): Promise<{ requestedAt: number }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to perform this action.",
      });
    }

    // Same verified-user gate the mutation form used, via an internal query
    // since actions have no db access.
    await ctx.runQuery(internal.stripeInternal.getVerifiedUserContext, {
      userId,
    });

    // Money first: cancelling before the identity is released means a Stripe
    // failure aborts the deletion with the account still usable, rather than
    // stranding a live subscription on an account nobody can sign in to.
    await ctx.runAction(internal.stripe.cancelAllSubscriptionsForUser, {
      userId,
    });

    const { deletedAt } = await ctx.runMutation(
      internal.users.severAccountIdentity,
      { userId },
    );
    return { requestedAt: deletedAt };
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
