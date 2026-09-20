/**
 * Stripe Identity (document + selfie) for campaign and society creators.
 * Always on — required during create flows and before admin approval.
 */
export function isStripeIdentityEnabled() {
  return true;
}
