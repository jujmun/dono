"use node";

import { ConvexError, v } from "convex/values";
import Stripe from "stripe";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { formatDob, fullName } from "./lib/stripeIdentityOutputs";
import { isStripeIdentityEnabled } from "./lib/stripeIdentityEnabled";

function assertIdentityEnabled() {
  if (!isStripeIdentityEnabled()) {
    throw new ConvexError({
      code: "STRIPE_IDENTITY_DISABLED",
      message: "Stripe Identity verification is temporarily disabled.",
    });
  }
}

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new ConvexError({
      code: "STRIPE_NOT_CONFIGURED",
      message: "Stripe is not configured on this deployment.",
    });
  }
  return new Stripe(secretKey);
}

// Shares the per-user quota keys with societyIdentity / campaignIdentity —
// the limit is on how often one user may hit Stripe Identity, not per flow.
const IDENTITY_CREATE_LIMIT = {
  maxAttempts: 20,
  windowMs: 15 * 60 * 1000,
  lockoutMs: 5 * 60 * 1000,
};

const IDENTITY_REFRESH_LIMIT = {
  maxAttempts: 90,
  windowMs: 15 * 60 * 1000,
  lockoutMs: 2 * 60 * 1000,
};

/**
 * Starts a real-time Stripe Identity check for the signed-in alumni profile.
 * Mirrors societyIdentity.createVerificationSession, but attaches the session
 * to the profile rather than a society/campaign record.
 */
export const createVerificationSession = action({
  args: {},
  handler: async (
    ctx,
  ): Promise<{
    verificationSessionId: string;
    clientSecret: string | null;
    url: string | null;
  }> => {
    assertIdentityEnabled();
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to perform this action.",
      });
    }

    const userContext = await ctx.runQuery(
      internal.stripeInternal.getVerifiedUserContext,
      { userId },
    );

    const profile = await ctx.runQuery(internal.users.getProfileForIdentity, {
      userId,
    });
    if (!profile) {
      throw new ConvexError({
        code: "PROFILE_MISSING",
        message: "User profile could not be found.",
      });
    }
    if (profile.userType !== "alumni") {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Stripe Identity onboarding is only available for alumni.",
      });
    }

    const stripe = getStripeClient();

    if (profile.stripeVerificationSessionId) {
      const existing = await stripe.identity.verificationSessions.retrieve(
        profile.stripeVerificationSessionId,
      );
      if (existing.status !== "canceled") {
        return {
          verificationSessionId: existing.id,
          clientSecret: existing.client_secret,
          url: existing.url,
        };
      }
    }

    await ctx.runMutation(internal.security.consumeQuota, {
      key: `identityVerification:${userId}`,
      ...IDENTITY_CREATE_LIMIT,
    });

    const session = await stripe.identity.verificationSessions.create({
      type: "document",
      options: {
        document: {
          require_matching_selfie: true,
        },
      },
      metadata: {
        purpose: "alumni_onboarding",
        userId,
      },
      ...(userContext.email
        ? { provided_details: { email: userContext.email } }
        : {}),
    });

    await ctx.runMutation(internal.users.recordVerificationSessionCreated, {
      userId,
      stripeVerificationSessionId: session.id,
      status: session.status,
    });

    return {
      verificationSessionId: session.id,
      clientSecret: session.client_secret,
      url: session.url,
    };
  },
});

/**
 * Direct poll of Stripe as a fallback to the webhook — mirrors
 * societyIdentity.refreshVerificationStatus.
 */
export const refreshVerificationStatus = action({
  args: {},
  handler: async (ctx): Promise<{ status: string }> => {
    assertIdentityEnabled();
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to perform this action.",
      });
    }

    const profile = await ctx.runQuery(internal.users.getProfileForIdentity, {
      userId,
    });
    if (!profile) {
      throw new ConvexError({
        code: "PROFILE_MISSING",
        message: "User profile could not be found.",
      });
    }
    if (profile.userType !== "alumni") {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You do not have permission for this action.",
      });
    }
    if (!profile.stripeVerificationSessionId) {
      throw new ConvexError({
        code: "INVALID_STATE",
        message: "No verification session has been started yet.",
      });
    }

    await ctx.runMutation(internal.security.consumeQuota, {
      key: `identityRefresh:${userId}`,
      ...IDENTITY_REFRESH_LIMIT,
    });

    const stripe = getStripeClient();
    const session = await stripe.identity.verificationSessions.retrieve(
      profile.stripeVerificationSessionId,
      { expand: ["verified_outputs"] },
    );

    await ctx.runMutation(internal.users.updateVerificationFromWebhook, {
      stripeVerificationSessionId: session.id,
      status: session.status,
      verifiedName: fullName(session.verified_outputs),
      verifiedDob: formatDob(session.verified_outputs?.dob),
      lastErrorCode: session.last_error?.code ?? undefined,
      lastErrorReason: session.last_error?.reason ?? undefined,
    });

    return { status: session.status };
  },
});
