import { ConvexError } from "convex/values";
import { MutationCtx } from "../_generated/server";

type RateLimitOptions = {
  key: string;
  maxAttempts: number;
  windowMs: number;
  lockoutMs: number;
};

export async function assertNotRateLimited(
  ctx: MutationCtx,
  opts: RateLimitOptions,
) {
  const now = Date.now();
  const existing = await ctx.db
    .query("appRateLimits")
    .withIndex("by_key", (q) => q.eq("key", opts.key))
    .unique();

  if (!existing) {
    return;
  }

  if (existing.lockUntil && existing.lockUntil > now) {
    throw new ConvexError({
      code: "RATE_LIMITED",
      message: "Too many attempts. Please try again later.",
    });
  }

  const inWindow = now - existing.windowStart < opts.windowMs;
  if (inWindow && existing.attempts >= opts.maxAttempts) {
    await ctx.db.patch(existing._id, { lockUntil: now + opts.lockoutMs });
    throw new ConvexError({
      code: "RATE_LIMITED",
      message: "Too many attempts. Please try again later.",
    });
  }
}

export async function recordRateLimitAttempt(
  ctx: MutationCtx,
  opts: RateLimitOptions,
  success: boolean,
) {
  const now = Date.now();
  const existing = await ctx.db
    .query("appRateLimits")
    .withIndex("by_key", (q) => q.eq("key", opts.key))
    .unique();

  if (success) {
    if (existing) {
      await ctx.db.patch(existing._id, {
        attempts: 0,
        windowStart: now,
        lockUntil: null,
      });
    }
    return;
  }

  if (!existing) {
    await ctx.db.insert("appRateLimits", {
      key: opts.key,
      attempts: 1,
      windowStart: now,
      lockUntil: null,
    });
    return;
  }

  const inWindow = now - existing.windowStart < opts.windowMs;
  const attempts = inWindow ? existing.attempts + 1 : 1;
  const nextPatch: {
    attempts: number;
    windowStart: number;
    lockUntil: number | null;
  } = {
    attempts,
    windowStart: inWindow ? existing.windowStart : now,
    lockUntil: null,
  };

  if (attempts >= opts.maxAttempts) {
    nextPatch.lockUntil = now + opts.lockoutMs;
  }

  await ctx.db.patch(existing._id, nextPatch);
}
