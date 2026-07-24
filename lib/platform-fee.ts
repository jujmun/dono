/**
 * Client-side fee breakdown (mirrors convex/lib/platformFee.ts for donate UI).
 * Keep in sync with the Convex module.
 */
export const PLATFORM_FEE_RATE = 0.05;
export const ESTIMATED_STRIPE_PERCENT = 0.015;
export const ESTIMATED_STRIPE_FIXED_MINOR = 20;

export function calculateApplicationFeeMinor(grossAmountMinor: number) {
  return Math.round(grossAmountMinor * PLATFORM_FEE_RATE);
}

export function estimateStripeFeeMinor(chargeAmountMinor: number) {
  return (
    Math.round(chargeAmountMinor * ESTIMATED_STRIPE_PERCENT) +
    ESTIMATED_STRIPE_FIXED_MINOR
  );
}

export type DonationFeeBreakdown = {
  intendedCampaignAmount: number;
  intendedCampaignAmountMinor: number;
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
  const platformFeeMinor = calculateApplicationFeeMinor(intendedCampaignAmountMinor);

  if (coverFees) {
    const totalChargedMinor = Math.ceil(
      (intendedCampaignAmountMinor + platformFeeMinor + ESTIMATED_STRIPE_FIXED_MINOR) /
        (1 - ESTIMATED_STRIPE_PERCENT),
    );
    const estimatedStripeFeeMinor = estimateStripeFeeMinor(totalChargedMinor);
    return {
      intendedCampaignAmount,
      intendedCampaignAmountMinor,
      platformFeeMinor,
      estimatedStripeFeeMinor,
      totalChargedMinor,
      amountToCampaignMinor: intendedCampaignAmountMinor,
      applicationFeeAmountMinor: platformFeeMinor,
      coverFees: true,
    };
  }

  const totalChargedMinor = intendedCampaignAmountMinor;
  const estimatedStripeFeeMinor = estimateStripeFeeMinor(totalChargedMinor);
  const amountToCampaignMinor = Math.max(
    0,
    totalChargedMinor - platformFeeMinor - estimatedStripeFeeMinor,
  );
  return {
    intendedCampaignAmount,
    intendedCampaignAmountMinor,
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
