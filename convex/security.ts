import { ConvexError, v } from "convex/values";
import { internalMutation, type MutationCtx } from "./_generated/server";
import { isAllowedAuthEmail } from "./auth/adminConfig";
import {
  assertNotRateLimited,
  recordRateLimitAttempt,
} from "./auth/rateLimit";
import { assertPlatformFlagOff } from "./platformSettings";

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

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Normalize and accept any syntactically valid email. */
export function normalizeAndValidateEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!EMAIL_SHAPE.test(normalized)) {
    throw new ConvexError({
      code: "INVALID_EMAIL",
      message: "Please use a valid email address.",
    });
  }
  return normalized;
}

/** Oxford / college subdomain, or allowlisted admin portal identities. */
export function normalizeAndValidateOxfordEmail(email: string) {
  const normalized = normalizeAndValidateEmail(email);

  if (!isAllowedAuthEmail(normalized)) {
    throw new ConvexError({
      code: "EMAIL_DOMAIN_NOT_ALLOWED",
      message: "Only Oxford email addresses (ending in ox.ac.uk) are allowed.",
    });
  }

  return normalized;
}

/**
 * OTP sends: Oxford/admin always OK; non-Oxford only if the auth user already
 * exists (alumni verification after password signUp, password reset).
 */
async function normalizeAndValidateOtpSendEmail(
  ctx: MutationCtx,
  email: string,
) {
  const normalized = normalizeAndValidateEmail(email);
  if (isAllowedAuthEmail(normalized)) {
    return normalized;
  }

  const existing = await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", normalized))
    .unique();

  if (existing) {
    return normalized;
  }

  throw new ConvexError({
    code: "EMAIL_DOMAIN_NOT_ALLOWED",
    message: "Only Oxford email addresses (ending in ox.ac.uk) are allowed.",
  });
}

/**
 * Server-only: check + consume one OTP send attempt for an email.
 * Call from sendVerificationRequest so clients cannot skip or reset quotas.
 */
export const consumeOtpSend = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = await normalizeAndValidateOtpSendEmail(ctx, args.email);
    const opts = { key: `otpSend:${email}`, ...FLOW_LIMITS.otpSend };
    await assertNotRateLimited(ctx, opts);
    await recordRateLimitAttempt(ctx, opts, false);
  },
});

const AUTH_FLOW_KEYS = [
  "signIn",
  "signUp",
  "reset",
  "reset-verification",
  "email-verification",
] as const;

/**
 * Server-only: rate-limit Password auth flows (sign-in, sign-up, reset, etc.).
 * Called from Password `profile` so clients cannot skip the quota.
 *
 * Sign-up enforces Oxford email for students and any valid email for alumni.
 * Other flows accept any valid email so existing alumni accounts can sign in
 * and reset passwords.
 */
export const consumeAuthFlow = internalMutation({
  args: {
    flow: v.string(),
    email: v.string(),
    userType: v.optional(v.union(v.literal("student"), v.literal("alumni"))),
  },
  handler: async (ctx, args) => {
    let email: string;
    if (args.flow === "signUp") {
      await assertPlatformFlagOff(
        ctx,
        "disableRegistration",
        "New account registration is temporarily disabled.",
      );
      if (args.userType === "alumni") {
        email = normalizeAndValidateEmail(args.email);
      } else if (args.userType === "student") {
        email = normalizeAndValidateOxfordEmail(args.email);
      } else {
        throw new ConvexError({
          code: "USER_TYPE_REQUIRED",
          message: "Choose Student or Alumni before creating an account.",
        });
      }
    } else {
      email = normalizeAndValidateEmail(args.email);
    }

    const flow = args.flow as AuthFlow;
    if (!(AUTH_FLOW_KEYS as readonly string[]).includes(flow)) {
      return;
    }
    const limits = FLOW_LIMITS[flow];
    const opts = { key: `${flow}:${email}`, ...limits };
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

/** Server-only: clear a keyed quota's attempt count after the action it was
 * guarding actually succeeded — so retrying a failed Stripe call doesn't
 * eventually lock out a donor who succeeds on a later attempt. */
export const resetQuota = internalMutation({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    if (args.key.length > 200) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Invalid rate limit key.",
      });
    }
    await recordRateLimitAttempt(
      ctx,
      { key: args.key, maxAttempts: 0, windowMs: 0, lockoutMs: 0 },
      true,
    );
  },
});
