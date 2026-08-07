/**
 * Server-side authorization helpers.
 *
 * Always derive identity from `@convex-dev/auth` (`getAuthUserId`) — never trust
 * client-supplied userId, role, email, or ownership fields.
 *
 * Societies use `societyMembers` for leadership and membership. Other communities
 * remain public catalog documents without org membership.
 */

import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { QueryCtx, MutationCtx, ActionCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";
import { isDemoOpenAdminEnabled } from "./demoOpenAdmin";

type CtxWithDb = QueryCtx | MutationCtx;
type AnyCtx = CtxWithDb | ActionCtx;

export type UserRole = "user" | "admin";

const ALLOWED_ROLES: ReadonlySet<UserRole> = new Set(["user", "admin"]);

/** Generic client-safe denial — avoids leaking whether a record exists. */
function accessDenied(): never {
  throw new ConvexError({
    code: "FORBIDDEN",
    message: "You do not have permission for this action.",
  });
}

export async function requireAuth(ctx: AnyCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError({
      code: "UNAUTHENTICATED",
      message: "You must be signed in to perform this action.",
    });
  }
  return userId;
}

/** Alias for requireAuth — identity from Convex Auth session only. */
export async function requireIdentity(ctx: AnyCtx) {
  return await requireAuth(ctx);
}

export async function optionalUserId(ctx: AnyCtx) {
  return await getAuthUserId(ctx);
}

export async function requireUserId(ctx: AnyCtx) {
  return await requireAuth(ctx);
}

export async function getProfileByUserId(ctx: CtxWithDb, userId: Id<"users">) {
  return await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
}

/** Email + display name for a campaign creator, with auth user email as fallback. */
export async function resolveCreatorContact(
  ctx: CtxWithDb,
  userId: Id<"users">,
): Promise<{ email: string; name: string } | null> {
  const [profile, user] = await Promise.all([
    getProfileByUserId(ctx, userId),
    ctx.db.get(userId),
  ]);
  const email = profile?.email?.trim() || user?.email?.trim();
  if (!email) return null;
  return {
    email,
    name: profile?.name ?? user?.name ?? "there",
  };
}

/**
 * Authenticated user + users table row (+ profile when present).
 */
export async function requireCurrentUser(ctx: CtxWithDb) {
  const userId = await requireAuth(ctx);
  const user = await ctx.db.get(userId);
  if (!user) {
    throw new ConvexError({
      code: "UNAUTHENTICATED",
      message: "You must be signed in to perform this action.",
    });
  }
  const profile = await getProfileByUserId(ctx, userId);
  return { userId, user, profile };
}

/**
 * Fail closed if the authenticated user does not own `ownerUserId`.
 * Uses a generic error so callers cannot probe unrelated records.
 */
export async function requireRecordOwner(
  ctx: AnyCtx,
  ownerUserId: Id<"users"> | null | undefined,
) {
  const userId = await requireAuth(ctx);
  if (!ownerUserId || ownerUserId !== userId) {
    accessDenied();
  }
  return userId;
}

function asUserRole(value: string | undefined): UserRole {
  if (value && ALLOWED_ROLES.has(value as UserRole)) {
    return value as UserRole;
  }
  return "user";
}

export async function requireRole(ctx: CtxWithDb, roles: readonly UserRole[]) {
  const userId = await requireAuth(ctx);
  const profile = await getProfileByUserId(ctx, userId);
  const role = asUserRole(profile?.role);

  const allowed = new Set(roles);
  if (!allowed.has(role)) {
    accessDenied();
  }

  return { userId, role, profile };
}

export async function requireAdmin(ctx: CtxWithDb) {
  const userId = await getAuthUserId(ctx);
  if (userId) {
    return await requireRole(ctx, ["admin"]);
  }

  // Demo open-admin: unauthenticated admin reads/writes on non-prod only.
  // Attribute actions to an existing admin profile when present.
  if (!isDemoOpenAdminEnabled()) {
    throw new ConvexError({
      code: "UNAUTHENTICATED",
      message: "You must be signed in to perform this action.",
    });
  }

  const adminProfile = await ctx.db
    .query("profiles")
    .withIndex("by_role", (q) => q.eq("role", "admin"))
    .first();
  if (adminProfile) {
    return {
      userId: adminProfile.userId,
      role: "admin" as const,
      profile: adminProfile,
    };
  }

  // Demo DB may not have a promoted admin yet — attribute to any profile.
  const anyProfile = await ctx.db.query("profiles").first();
  if (!anyProfile) {
    throw new ConvexError({
      code: "DEMO_OPEN_ADMIN_NO_ADMIN_USER",
      message:
        "Demo open admin requires at least one user profile on this Convex deployment.",
    });
  }

  return {
    userId: anyProfile.userId,
    role: "admin" as const,
    profile: anyProfile,
  };
}

/** Fail closed when the profile has an active suspension. */
export function assertNotSuspended(
  profile: Doc<"profiles"> | null | undefined,
): void {
  if (profile?.suspendedAt) {
    throw new ConvexError({
      code: "ACCOUNT_SUSPENDED",
      message:
        profile.suspendedReason?.trim() ||
        "This account has been suspended and cannot perform this action.",
    });
  }
}

/** Fail closed while a commenting restriction is in force. */
export function assertCommentingAllowed(
  profile: Doc<"profiles"> | null | undefined,
): void {
  const until = profile?.commentingRestrictedUntil;
  if (until !== undefined && until > Date.now()) {
    throw new ConvexError({
      code: "COMMENTING_RESTRICTED",
      message: "Commenting is temporarily restricted on this account.",
    });
  }
}

export async function requireVerifiedUser(ctx: CtxWithDb) {
  const { userId, user, profile } = await requireCurrentUser(ctx);

  const verified =
    Boolean(user.emailVerificationTime) || Boolean(profile?.emailVerifiedAt);

  if (!verified) {
    throw new ConvexError({
      code: "EMAIL_NOT_VERIFIED",
      message: "Please verify your email before continuing.",
    });
  }

  assertNotSuspended(profile);

  return { userId, user, profile };
}

/**
 * Verified user, fails closed for alumni/donor accounts. Blocks on
 * `userType === "alumni"` rather than requiring `"student"` so accounts
 * predating this field (`userType` undefined) keep existing behaviour.
 * Use for every campaign/society/college creation entry point.
 */
export async function requireStudentCreator(ctx: CtxWithDb) {
  const { userId, user, profile } = await requireVerifiedUser(ctx);
  if (profile?.userType === "alumni") {
    accessDenied();
  }
  return { userId, user, profile };
}

function isSocietyVerified(community: Doc<"communities">) {
  if (community.type !== "society") return false;
  if (community.verificationStatus === "verified") return true;
  if (community.verificationStatus === undefined && community.verified) {
    return true;
  }
  return false;
}

async function getApprovedMembership(
  ctx: CtxWithDb,
  communitySlug: string,
  userId: Id<"users">,
) {
  return await ctx.db
    .query("societyMembers")
    .withIndex("by_community_user", (q) =>
      q.eq("communitySlug", communitySlug).eq("userId", userId),
    )
    .unique();
}

export async function requireSocietyMember(ctx: CtxWithDb, communitySlug: string) {
  const { userId } = await requireVerifiedUser(ctx);
  const community = await ctx.db
    .query("communities")
    .withIndex("by_slug", (q) => q.eq("slug", communitySlug))
    .unique();
  if (!community || !isSocietyVerified(community)) {
    accessDenied();
  }
  const membership = await getApprovedMembership(ctx, communitySlug, userId);
  if (!membership || membership.status !== "approved") {
    accessDenied();
  }
  return { userId, community, membership };
}

export async function requireSocietyLeader(ctx: CtxWithDb, communitySlug: string) {
  const { userId, community, membership } = await requireSocietyMember(
    ctx,
    communitySlug,
  );
  if (membership.role !== "leader") {
    accessDenied();
  }
  return { userId, community, membership };
}

/** Society submission creator or approved leader — matches Connect payout access. */
export async function canManageSociety(
  ctx: CtxWithDb,
  userId: Id<"users">,
  communitySlug: string,
) {
  const society = await ctx.db
    .query("societies")
    .withIndex("by_slug", (q) => q.eq("slug", communitySlug))
    .unique();
  if (society?.creatorId === userId) {
    return true;
  }

  const membership = await getApprovedMembership(ctx, communitySlug, userId);
  return Boolean(
    membership && membership.status === "approved" && membership.role === "leader",
  );
}

export async function requireCanManageSociety(ctx: CtxWithDb, communitySlug: string) {
  const { userId } = await requireVerifiedUser(ctx);
  if (!(await canManageSociety(ctx, userId, communitySlug))) {
    accessDenied();
  }
  return { userId };
}
