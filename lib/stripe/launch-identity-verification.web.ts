import { loadStripe } from "@stripe/stripe-js";
import type {
  LaunchIdentityVerificationArgs,
  LaunchIdentityVerificationResult,
} from "./launch-identity-verification-types";

const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

/** Web: Stripe.js's own modal — no <Elements> wrapper needed for Identity. */
export async function launchIdentityVerification({
  clientSecret,
}: LaunchIdentityVerificationArgs): Promise<LaunchIdentityVerificationResult> {
  if (!clientSecret) {
    return { error: "Verification is not available in this environment." };
  }

  const stripe = await stripePromise;
  if (!stripe) {
    return { error: "Stripe is not configured for this environment." };
  }

  const result = await stripe.verifyIdentity(clientSecret);
  if (result.error) {
    return { error: result.error.message ?? "Verification was not completed." };
  }
  return {};
}
