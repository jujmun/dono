"use node";

import { ConvexError, v } from "convex/values";
import Stripe from "stripe";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { formatDob, fullName } from "./lib/stripeIdentityOutputs";

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

const IDENTITY_CREATE_LIMIT = {
  maxAttempts: 20,
  windowMs: 15 * 60 * 1000,
  lockoutMs: 5 * 60 * 1000,
};

/**
 * Starts a real-time Stripe Identity check for a society the caller created.
 * This is additive to (not a replacement for) the manual idDocumentStorageId
 * upload already required at societies.create.
 */
export const createVerificationSession = action({
  args: { slug: v.string() },
  handler: async (
    ctx,
    args,
  ): Promise<{
    verificationSessionId: string;
    clientSecret: string | null;
    url: string | null;
  }> => {
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

    const society = await ctx.runQuery(internal.societies.getBySlug, {
      slug: args.slug,
    });
    if (!society) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Society not found.",
      });
    }
    if (society.creatorId !== userId) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You do not have permission for this action.",
      });
    }

    const stripe = getStripeClient();

    // Reuse an existing session if it's still usable, rather than creating a
    // fresh Stripe Identity session (and burning create-quota) on every
    // click — Stripe supports resubmitting via the same client_secret up
    // until a session is verified/canceled, so repeated "Verify your
    // identity" clicks (e.g. while the user is still deciding, or retrying)
    // don't need a new session each time.
    if (society.stripeVerificationSessionId) {
      const existing = await stripe.identity.verificationSessions.retrieve(
        society.stripeVerificationSessionId,
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
      // require_matching_selfie is what actually makes Stripe run the
      // selfie-vs-ID comparison check (and produce selfie_* last_error
      // codes on mismatch) — without it, admin can't show a real selfie
      // match result since Stripe never performs that specific check.
      options: {
        document: {
          require_matching_selfie: true,
        },
      },
      metadata: {
        societySlug: society.slug,
        userId,
      },
      ...(userContext.email
        ? { provided_details: { email: userContext.email } }
        : {}),
    });

    await ctx.runMutation(internal.societies.recordVerificationSessionCreated, {
      slug: society.slug,
      stripeVerificationSessionId: session.id,
      // Store whatever Stripe actually returns rather than assuming a value.
      status: session.status,
    });

    return {
      verificationSessionId: session.id,
      clientSecret: session.client_secret,
      url: session.url,
    };
  },
});

const IDENTITY_REFRESH_LIMIT = {
  maxAttempts: 90,
  windowMs: 15 * 60 * 1000,
  lockoutMs: 2 * 60 * 1000,
};

/**
 * Direct poll of Stripe as a fallback to the webhook — mirrors
 * stripeConnect.ts's refreshConnectAccountStatus pattern. Webhooks can be
 * delayed, misconfigured, or simply not reach a given deployment; this lets
 * the wizard (owner) or the admin review page ask Stripe directly instead
 * of only ever waiting on identity.verification_session.* events.
 */
export const refreshVerificationStatus = action({
  args: { slug: v.string() },
  handler: async (ctx, args): Promise<{ status: string }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to perform this action.",
      });
    }

    const society = await ctx.runQuery(internal.societies.getBySlug, {
      slug: args.slug,
    });
    if (!society) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Society not found.",
      });
    }

    if (society.creatorId !== userId) {
      const role = await ctx.runQuery(internal.societies.getCallerRole, {
        userId,
      });
      if (role !== "admin") {
        throw new ConvexError({
          code: "FORBIDDEN",
          message: "You do not have permission for this action.",
        });
      }
    }

    if (!society.stripeVerificationSessionId) {
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
      society.stripeVerificationSessionId,
      { expand: ["verified_outputs"] },
    );

    await ctx.runMutation(internal.societies.updateVerificationFromWebhook, {
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
