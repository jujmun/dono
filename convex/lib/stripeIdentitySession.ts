import { ConvexError } from "convex/values";
import Stripe from "stripe";

/** Map Stripe SDK failures to structured Convex errors the client can display. */
export function throwStripeIdentityError(error: unknown): never {
  if (error instanceof ConvexError) {
    throw error;
  }

  if (error instanceof Stripe.errors.StripeError) {
    console.error("Stripe Identity request failed", {
      type: error.type,
      code: error.code,
      message: error.message,
    });
    throw new ConvexError({
      code: "STRIPE_IDENTITY_API_ERROR",
      message: error.message ?? "Stripe request failed.",
    });
  }

  console.error("Stripe Identity request failed", error);
  throw new ConvexError({
    code: "STRIPE_IDENTITY_FAILED",
    message: "Could not start identity verification. Please try again.",
  });
}

/**
 * Returns the stored session only when the user can actually submit to it
 * again, otherwise null to signal "create a fresh one".
 *
 * Stripe issues a usable `client_secret` / `url` pair only while a session is
 * `requires_input`; once it is processing or verified both come back null, and
 * sessions are account-scoped, so an id created under a previous Stripe
 * account 404s on retrieve.
 */
export async function retrieveReusableSession(
  stripe: Stripe,
  sessionId: string,
): Promise<Stripe.Identity.VerificationSession | null> {
  let existing: Stripe.Identity.VerificationSession;
  try {
    existing = await stripe.identity.verificationSessions.retrieve(sessionId);
  } catch (error) {
    if (
      error instanceof Stripe.errors.StripeError &&
      error.code === "resource_missing"
    ) {
      return null;
    }
    throwStripeIdentityError(error);
  }

  if (existing.status === "processing") {
    throw new ConvexError({
      code: "IDENTITY_PROCESSING",
      message:
        "Your identity check is already being reviewed — this usually takes about a minute.",
    });
  }
  if (existing.status === "verified") {
    throw new ConvexError({
      code: "IDENTITY_ALREADY_VERIFIED",
      message: "Your identity is already verified.",
    });
  }
  if (existing.status === "canceled" || !existing.client_secret) {
    return null;
  }

  return existing;
}
