/**
 * Client-side fee breakdown (mirrors convex/lib/platformFee.ts for donate UI).
 * Keep in sync with the Convex module.
 *
 * Fee envelope: 5% + 20p, split Stripe estimate first then Dono residual.
 */
export const PLATFORM_FEE_RATE = 0.05;
export const PLATFORM_FEE_FIXED_MINOR = 20;
export const ESTIMATED_STRIPE_PERCENT = 0.015;
export const ESTIMATED_STRIPE_FIXED_MINOR = 20;

export function calculateFeeEnvelopeMinor(amountMinor: number) {
  return Math.round(amountMinor * PLATFORM_FEE_RATE) + PLATFORM_FEE_FIXED_MINOR;
}

export function estimateStripeFeeMinor(chargeAmountMinor: number) {
  return (
    Math.round(chargeAmountMinor * ESTIMATED_STRIPE_PERCENT) +
    ESTIMATED_STRIPE_FIXED_MINOR
  );
}

export function calculateApplicationFeeMinor(amountMinor: number) {
  const feeEnvelopeMinor = calculateFeeEnvelopeMinor(amountMinor);
  const stripeShareMinor = Math.min(
    estimateStripeFeeMinor(amountMinor),
    feeEnvelopeMinor,
  );
  return Math.max(0, feeEnvelopeMinor - stripeShareMinor);
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
  coverFees: boolean,
): DonationFeeBreakdown {
  const intendedCampaignAmountMinor = Math.round(intendedCampaignAmount * 100);
  const feeEnvelopeMinor = calculateFeeEnvelopeMinor(intendedCampaignAmountMinor);
  const rawStripeEstimate = estimateStripeFeeMinor(intendedCampaignAmountMinor);
  const estimatedStripeFeeMinor = Math.min(rawStripeEstimate, feeEnvelopeMinor);
  const platformFeeMinor = Math.max(0, feeEnvelopeMinor - estimatedStripeFeeMinor);

  if (coverFees) {
    const totalChargedMinor = intendedCampaignAmountMinor + feeEnvelopeMinor;
    return {
      intendedCampaignAmount,
      intendedCampaignAmountMinor,
      feeEnvelopeMinor,
      platformFeeMinor,
      estimatedStripeFeeMinor,
      totalChargedMinor,
      amountToCampaignMinor: intendedCampaignAmountMinor,
      applicationFeeAmountMinor: platformFeeMinor,
      coverFees: true,
    };
  }

  const totalChargedMinor = intendedCampaignAmountMinor;
  const amountToCampaignMinor = Math.max(0, totalChargedMinor - feeEnvelopeMinor);
  return {
    intendedCampaignAmount,
    intendedCampaignAmountMinor,
    feeEnvelopeMinor,
    platformFeeMinor,
    estimatedStripeFeeMinor,
    totalChargedMinor,
    amountToCampaignMinor,
    applicationFeeAmountMinor: platformFeeMinor,
    coverFees: false,
  };
}

export function formatMinorGbp(minor: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(minor / 100);
}
