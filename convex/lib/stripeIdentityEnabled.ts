/**
 * Stripe Identity (document + selfie KYC) is off by default.
 * Set STRIPE_IDENTITY_ENABLED=true on the Convex deployment to re-enable.
 */
export function isStripeIdentityEnabled() {
  return process.env.STRIPE_IDENTITY_ENABLED === "true";
}
