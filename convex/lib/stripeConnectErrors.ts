import { ConvexError } from "convex/values";
import Stripe from "stripe";

export function assertHttpsConnectReturnUrls(
  returnUrl: string,
  refreshUrl: string,
) {
  const isLive = process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_");
  if (!isLive) return;

  for (const url of [returnUrl, refreshUrl]) {
    if (!/^https:\/\//i.test(url)) {
      throw new ConvexError({
        code: "STRIPE_CONNECT_INVALID_URL",
        message:
          "Payout setup must use an HTTPS return URL in live mode. Open Dono at https://joindono.com and try again.",
      });
    }
  }
}

export function isStripeResourceMissing(error: unknown) {
  return (
    error instanceof Stripe.errors.StripeError && error.code === "resource_missing"
  );
}

/** Map Stripe SDK failures to structured Convex errors the client can display. */
export function throwStripeConnectError(error: unknown): never {
  if (error instanceof ConvexError) {
    throw error;
  }

  if (error instanceof Stripe.errors.StripeError) {
    const message = error.message ?? "Stripe request failed.";

    if (/accounts v2 is not enabled/i.test(message)) {
      throw new ConvexError({
        code: "STRIPE_CONNECT_V2_DISABLED",
        message:
          "Stripe Accounts v2 is not enabled on the Dono platform account. Enable Accounts v2 in the Stripe Dashboard, then try again.",
      });
    }

    if (/return_url|refresh_url/i.test(message)) {
      throw new ConvexError({
        code: "STRIPE_CONNECT_INVALID_URL",
        message,
      });
    }

    if (error.code === "resource_missing") {
      throw new ConvexError({
        code: "STRIPE_CONNECT_ACCOUNT_MISSING",
        message:
          "This society's Stripe merchant account was not found. Try again and we'll start a fresh setup.",
      });
    }

    throw new ConvexError({
      code: "STRIPE_API_ERROR",
      message,
    });
  }

  throw new ConvexError({
    code: "STRIPE_CONNECT_FAILED",
    message: "Could not start Stripe payout setup. Please try again.",
  });
}
