/**
 * Client-side fee breakdown — keep in sync with convex/lib/platformFee.ts.
 */

export const DEMO_DONO_FEE_RATE = 0.02;
export const PROD_DONO_FEE_RATE = 0.05;
export const DONO_FEE_FIXED_MINOR = 20;

export const ESTIMATED_STRIPE_PERCENT = 0.015;
export const ESTIMATED_STRIPE_FIXED_MINOR = 20;

/** @deprecated */
export const PLATFORM_FEE_RATE = PROD_DONO_FEE_RATE;
/** @deprecated */
export const PLATFORM_FEE_FIXED_MINOR = DONO_FEE_FIXED_MINOR;

export type FeeSchedule = "demo" | "production";

export function resolveFeeSchedule(
  explicit?: FeeSchedule | null,
): FeeSchedule {
  if (explicit === "demo" || explicit === "production") return explicit;
  if (process.env.EXPO_PUBLIC_DONO_FEE_SCHEDULE === "demo") return "demo";
  if (process.env.EXPO_PUBLIC_DEMO_OPEN_ADMIN === "true") return "demo";
  return "production";
}

export function getDonoFeeRate(schedule: FeeSchedule = "production") {
  return schedule === "demo" ? DEMO_DONO_FEE_RATE : PROD_DONO_FEE_RATE;
}

export function donoFeeLabel(schedule: FeeSchedule = "production") {
  return schedule === "demo"
    ? "Payment processing fee (Dono)"
    : "Dono fee";
}

export function calculateDonoFeeMinor(
  contributionMinor: number,
  schedule: FeeSchedule = "production",
) {
  return (
    Math.round(contributionMinor * getDonoFeeRate(schedule)) +
    DONO_FEE_FIXED_MINOR
  );
}

export function estimateStripeFeeMinor(chargeAmountMinor: number) {
  return (
    Math.round(chargeAmountMinor * ESTIMATED_STRIPE_PERCENT) +
    ESTIMATED_STRIPE_FIXED_MINOR
  );
}

export function calculateFeeEnvelopeMinor(amountMinor: number) {
  return calculateDonoFeeMinor(amountMinor, resolveFeeSchedule());
}

export function calculateApplicationFeeMinor(amountMinor: number) {
  return calculateDonoFeeMinor(amountMinor, resolveFeeSchedule());
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
  schedule: FeeSchedule;
  donoFeeLabel: string;
};

export function calculateDonationFeeBreakdown(
  intendedCampaignAmount: number,
  coverFees = false,
  schedule: FeeSchedule = resolveFeeSchedule(),
): DonationFeeBreakdown {
  const intendedCampaignAmountMinor = Math.round(intendedCampaignAmount * 100);
  const platformFeeMinor = calculateDonoFeeMinor(
    intendedCampaignAmountMinor,
    schedule,
  );
  const estimatedStripeFeeMinor = estimateStripeFeeMinor(
    intendedCampaignAmountMinor,
  );
  const totalChargedMinor =
    intendedCampaignAmountMinor + (coverFees ? platformFeeMinor : 0);
  const amountToCampaignMinor = Math.max(
    0,
    intendedCampaignAmountMinor -
      (coverFees ? 0 : platformFeeMinor) -
      estimatedStripeFeeMinor,
  );

  return {
    intendedCampaignAmount,
    intendedCampaignAmountMinor,
    feeEnvelopeMinor: platformFeeMinor,
    platformFeeMinor,
    estimatedStripeFeeMinor,
    totalChargedMinor,
    amountToCampaignMinor,
    applicationFeeAmountMinor: platformFeeMinor,
    coverFees,
    schedule,
    donoFeeLabel: donoFeeLabel(schedule),
  };
}

export function formatMinorGbp(minor: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(minor / 100);
}
