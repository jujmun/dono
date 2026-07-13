import { ConvexError, v } from "convex/values";
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

function normalizeAndValidateEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new ConvexError({
      code: "INVALID_EMAIL",
      message: "Please use a valid email address.",
    });
  }

  const domain = normalized.split("@")[1] ?? "";
  const isOxford = domain === "ox.ac.uk" || domain.endsWith(".ox.ac.uk");
  if (!isOxford) {
    throw new ConvexError({
      code: "EMAIL_DOMAIN_NOT_ALLOWED",
      message: "Only Oxford email addresses (ending in ox.ac.uk) are allowed.",
    });
  }

  return normalized;
}

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
    const email = normalizeAndValidateEmail(args.email);
    const key = `${args.flow}:${email}`;
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
    const email = normalizeAndValidateEmail(args.email);
    const key = `${args.flow}:${email}`;
    await recordRateLimitAttempt(ctx, { key, ...FLOW_LIMITS[args.flow] }, args.success);
  },
});
