/**
 * Client-side fee breakdown (mirrors convex/lib/platformFee.ts for donate UI).
 * Keep in sync with the Convex module.
 *
 * Pilot override: donor pays estimated Stripe processing only (1.5% + 20p).
 * No Dono platform fee. Legal-launch production/demo schedules (5%+20p / 2%+20p)
 * remain NOT YET IMPLEMENTED per founder pilot decision.
 */

/** @deprecated No Dono platform fee during pilot; kept at 0 for callers. */
export const PLATFORM_FEE_RATE = 0;
/** @deprecated No Dono platform fee during pilot; kept at 0 for callers. */
export const PLATFORM_FEE_FIXED_MINOR = 0;
export const ESTIMATED_STRIPE_PERCENT = 0.015;
export const ESTIMATED_STRIPE_FIXED_MINOR = 20;

export function estimateStripeFeeMinor(chargeAmountMinor: number) {
  return (
    Math.round(chargeAmountMinor * ESTIMATED_STRIPE_PERCENT) +
    ESTIMATED_STRIPE_FIXED_MINOR
  );
}

export function calculateFeeEnvelopeMinor(amountMinor: number) {
  return estimateStripeFeeMinor(amountMinor);
}

export function calculateApplicationFeeMinor(_amountMinor: number) {
  return 0;
}

export type DonationFeeBreakdown = {
  intendedCampaignAmount: number;
  intendedCampaignAmountMinor: number;
  feeEnvelopeMinor: number;
  platformFeeMinor: number;
  estimatedStripeFeeMinor: number;
  totalChargedMinor: number;
  amountToCampaignMinor: number;
  applicationFeeAmountMinor: number;
  coverFees: boolean;
};

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

export function formatMinorGbp(minor: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(minor / 100);
}
