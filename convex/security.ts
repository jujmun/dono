import { ConvexError, v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { isAllowedAuthEmail } from "./auth/adminConfig";
import {
  assertNotRateLimited,
  recordRateLimitAttempt,
} from "./auth/rateLimit";

export const FLOW_LIMITS = {
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
  otpSend: {
    maxAttempts: 5,
    windowMs: 10 * 60 * 1000,
    lockoutMs: 15 * 60 * 1000,
  },
} as const;

export type AuthFlow = keyof typeof FLOW_LIMITS;

export function normalizeAndValidateOxfordEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new ConvexError({
      code: "INVALID_EMAIL",
      message: "Please use a valid email address.",
    });
  }

  if (!isAllowedAuthEmail(normalized)) {
    throw new ConvexError({
      code: "EMAIL_DOMAIN_NOT_ALLOWED",
      message: "Only Oxford email addresses (ending in ox.ac.uk) are allowed.",
    });
  }

  return normalized;
}

/**
 * Server-only: check + consume one OTP send attempt for an email.
 * Call from sendVerificationRequest so clients cannot skip or reset quotas.
 */
export const consumeOtpSend = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = normalizeAndValidateOxfordEmail(args.email);
    const opts = { key: `otpSend:${email}`, ...FLOW_LIMITS.otpSend };
    await assertNotRateLimited(ctx, opts);
    await recordRateLimitAttempt(ctx, opts, false);
  },
});

/**
 * Server-only: consume a keyed quota (avatar uploads, Stripe creates, etc.).
 */
export const consumeQuota = internalMutation({
  args: {
    key: v.string(),
    maxAttempts: v.number(),
    windowMs: v.number(),
    lockoutMs: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.key.length > 200) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Invalid rate limit key.",
      });
    }
    const opts = {
      key: args.key,
      maxAttempts: args.maxAttempts,
      windowMs: args.windowMs,
      lockoutMs: args.lockoutMs,
    };
    await assertNotRateLimited(ctx, opts);
    await recordRateLimitAttempt(ctx, opts, false);
  },
});
