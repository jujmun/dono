/**
 * Pilot fee model (temporary override of legal-launch PF-00/01):
 * estimated Stripe processing only (UK card 1.5% + 20p). Dono application fee
 * is 0 — founders confirmed for pilot that Dono takes no cut. Production
 * schedule in TRUTH.md (5%+20p / demo 2%+20p) remains NOT YET IMPLEMENTED.
 * Processing is always added on top so the intended amount reaches the campaign.
 */

/** @deprecated No Dono platform fee; kept at 0 for callers that still reference it. */
export const PLATFORM_FEE_RATE = 0;
/** @deprecated No Dono platform fee; kept at 0 for callers that still reference it. */
export const PLATFORM_FEE_FIXED_MINOR = 0;

/**
 * Estimated Stripe UK card fee for checkout display and donor pass-through.
 * Actual Stripe fees vary by card; this is an estimate only (1.5% + £0.20).
 */
export const ESTIMATED_STRIPE_PERCENT = 0.015;
export const ESTIMATED_STRIPE_FIXED_MINOR = 20;

export function estimateStripeFeeMinor(chargeAmountMinor: number) {
  return (
    Math.round(chargeAmountMinor * ESTIMATED_STRIPE_PERCENT) +
    ESTIMATED_STRIPE_FIXED_MINOR
  );
}

/** Fee passed through to the donor — estimated Stripe processing only. */
export function calculateFeeEnvelopeMinor(amountMinor: number) {
  return estimateStripeFeeMinor(amountMinor);
}

/** Dono application fee — always zero (no platform cut). */
export function calculateApplicationFeeMinor(_amountMinor: number) {
  return 0;
}

/**
 * Proportional application-fee refund from the originally stored Dono fee.
 * Prefer this over re-deriving from the refunded gross alone.
 * Returns 0 when the original fee was 0.
 */
export function calculateApplicationFeeRefundMinor(args: {
  originalApplicationFeeMinor: number;
  originalGrossMinor: number;
  refundedGrossMinor: number;
}) {
  if (args.originalGrossMinor <= 0 || args.originalApplicationFeeMinor <= 0) {
    return 0;
  }
  const refunded = Math.min(
    Math.max(0, args.refundedGrossMinor),
    args.originalGrossMinor,
  );
  return Math.round(
    (args.originalApplicationFeeMinor * refunded) / args.originalGrossMinor,
  );
}

export type DonationFeeBreakdown = {
  /** Amount the donor intends for the campaign (major units GBP). */
  intendedCampaignAmount: number;
  intendedCampaignAmountMinor: number;
  /** Estimated Stripe processing fee (minor units). */
  feeEnvelopeMinor: number;
  /** Always 0 — Dono takes no platform fee. */
  platformFeeMinor: number;
  /** Estimated Stripe processing fee (minor units). */
  estimatedStripeFeeMinor: number;
  /** Total charged to the donor (minor units). */
  totalChargedMinor: number;
  /** Expected amount reaching the campaign after fees (minor units). */
  amountToCampaignMinor: number;
  /** Application fee taken by Dono on the PaymentIntent (always 0). */
  applicationFeeAmountMinor: number;
  /** Always true — processing is added on top of the intended gift. */
  coverFees: boolean;
};

/**
 * Checkout math: donor pays intended + estimated Stripe processing so the
 * intended amount reaches the campaign. No Dono platform fee.
 */
export function calculateDonationFeeBreakdown(
  intendedCampaignAmount: number,
): DonationFeeBreakdown {
  const intendedCampaignAmountMinor = Math.round(intendedCampaignAmount * 100);
  const estimatedStripeFeeMinor = estimateStripeFeeMinor(
    intendedCampaignAmountMinor,
  );
  const feeEnvelopeMinor = estimatedStripeFeeMinor;
  const platformFeeMinor = 0;
  const totalChargedMinor =
    intendedCampaignAmountMinor + estimatedStripeFeeMinor;

  return {
    intendedCampaignAmount,
    intendedCampaignAmountMinor,
    feeEnvelopeMinor,
    platformFeeMinor,
    estimatedStripeFeeMinor,
    totalChargedMinor,
    amountToCampaignMinor: intendedCampaignAmountMinor,
    applicationFeeAmountMinor: 0,
    coverFees: true,
  };
}
