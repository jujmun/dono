import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { QueryCtx, MutationCtx, ActionCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

type CtxWithDb = QueryCtx | MutationCtx;
type AnyCtx = CtxWithDb | ActionCtx;

export type UserRole = "user" | "admin";

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

export async function getProfileByUserId(ctx: CtxWithDb, userId: Id<"users">) {
  return await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
}

export async function requireRole(ctx: CtxWithDb, roles: UserRole[]) {
  const userId = await requireAuth(ctx);
  const profile = await getProfileByUserId(ctx, userId);
  const role = profile?.role ?? "user";

  if (!roles.includes(role)) {
    throw new ConvexError({
      code: "FORBIDDEN",
      message: "You do not have permission for this action.",
    });
  }

  return { userId, role, profile };
}

export async function requireAdmin(ctx: CtxWithDb) {
  return await requireRole(ctx, ["admin"]);
}
