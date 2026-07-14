/**
 * Server-side authorization helpers.
 *
 * Always derive identity from `@convex-dev/auth` (`getAuthUserId`) — never trust
 * client-supplied userId, role, email, or ownership fields.
 *
 * This app has no organization/workspace membership model. "Communities" are
 * public catalog documents, so requireOrganization* helpers are intentionally
 * not provided.
 */

import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { QueryCtx, MutationCtx, ActionCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

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
  return await requireRole(ctx, ["admin"]);
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

  return { userId, user, profile };
}
