/**
 * Shared retention policy for Stripe Identity data (verifiedName/verifiedDob)
 * on campaigns and societies — used by the expiry cron (convex/maintenance.ts),
 * the account-deletion cascade (convex/users.ts severAccountIdentity), and the
 * admin Stripe reset tool (convex/adminStripeReset.ts).
 */

export const VERIFICATION_RETENTION_MS = 90 * 24 * 60 * 60 * 1000;

/**
 * Clears captured Stripe Identity data and resets verification to require
 * re-verification, rather than leaving stripeVerificationStatus at "verified"
 * with the underlying name/DOB gone.
 */
export const clearVerificationPatch = {
  stripeVerificationSessionId: undefined,
  stripeVerificationStatus: undefined,
  verifiedName: undefined,
  verifiedDob: undefined,
  verifiedAt: undefined,
  stripeVerificationLastErrorCode: undefined,
  stripeVerificationLastErrorReason: undefined,
} as const;
