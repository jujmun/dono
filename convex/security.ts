import { v } from "convex/values";
import { mutation } from "./_generated/server";
import {
  assertNotRateLimited,
  recordRateLimitAttempt,
} from "./auth/rateLimit";

const FLOW_LIMITS = {
  signIn: { maxAttempts: 8, windowMs: 10 * 60 * 1000, lockoutMs: 15 * 60 * 1000 },
  signUp: { maxAttempts: 8, windowMs: 10 * 60 * 1000, lockoutMs: 15 * 60 * 1000 },
  reset: { maxAttempts: 6, windowMs: 10 * 60 * 1000, lockoutMs: 15 * 60 * 1000 },
  "reset-verification": {
    maxAttempts: 6,
    windowMs: 10 * 60 * 1000,
    lockoutMs: 15 * 60 * 1000,
  },
  "email-verification": {
    maxAttempts: 6,
    windowMs: 10 * 60 * 1000,
    lockoutMs: 15 * 60 * 1000,
  },
} as const;

export const assertAllowed = mutation({
  args: {
    flow: v.union(
      v.literal("signIn"),
      v.literal("signUp"),
      v.literal("reset"),
      v.literal("reset-verification"),
      v.literal("email-verification"),
    ),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const key = `${args.flow}:${args.email.trim().toLowerCase()}`;
    await assertNotRateLimited(ctx, { key, ...FLOW_LIMITS[args.flow] });
  },
});

export const record = mutation({
  args: {
    flow: v.union(
      v.literal("signIn"),
      v.literal("signUp"),
      v.literal("reset"),
      v.literal("reset-verification"),
      v.literal("email-verification"),
    ),
    email: v.string(),
    success: v.boolean(),
  },
  handler: async (ctx, args) => {
    const key = `${args.flow}:${args.email.trim().toLowerCase()}`;
    await recordRateLimitAttempt(ctx, { key, ...FLOW_LIMITS[args.flow] }, args.success);
  },
});
