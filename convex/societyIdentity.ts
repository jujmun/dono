"use node";

import { ConvexError, v } from "convex/values";
import Stripe from "stripe";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

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
  maxAttempts: 10,
  windowMs: 15 * 60 * 1000,
  lockoutMs: 15 * 60 * 1000,
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

    await ctx.runMutation(internal.security.consumeQuota, {
      key: `identityVerification:${userId}`,
      ...IDENTITY_CREATE_LIMIT,
    });

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
