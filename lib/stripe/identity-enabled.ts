/**
 * Stripe Identity UI — off by default to match server STRIPE_IDENTITY_ENABLED.
 * Set EXPO_PUBLIC_STRIPE_IDENTITY_ENABLED=true (and server flag) to re-enable.
 */
export function isStripeIdentityEnabled() {
  return process.env.EXPO_PUBLIC_STRIPE_IDENTITY_ENABLED === "true";
}
