/**
 * Locked fee schedules (PF-01):
 * - production: 5% + 20p Dono fee
 * - demo: 2% + 20p Dono fee (labelled "Payment processing fee (Dono)" in UI)
 *
 * Stripe processing cost is shown for transparency and borne by the campaign;
 * it is never added to the donor total. Optional fee cover adds only the Dono fee.
 */

export const DEMO_DONO_FEE_RATE = 0.02;
export const PROD_DONO_FEE_RATE = 0.05;
export const DONO_FEE_FIXED_MINOR = 20;

/** Estimated Stripe UK card fee for transparency display only. */
export const ESTIMATED_STRIPE_PERCENT = 0.015;
export const ESTIMATED_STRIPE_FIXED_MINOR = 20;

/** @deprecated Use getDonoFeeRate / calculateDonoFeeMinor */
export const PLATFORM_FEE_RATE = PROD_DONO_FEE_RATE;
/** @deprecated Use DONO_FEE_FIXED_MINOR */
export const PLATFORM_FEE_FIXED_MINOR = DONO_FEE_FIXED_MINOR;

export type FeeSchedule = "demo" | "production";

export function resolveFeeSchedule(
  explicit?: FeeSchedule | null,
): FeeSchedule {
  if (explicit === "demo" || explicit === "production") return explicit;
  if (process.env.DONO_FEE_SCHEDULE === "demo") return "demo";
  if (process.env.DEMO_OPEN_ADMIN === "true") return "demo";
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

/** @deprecated Prefer calculateDonationFeeBreakdown with coverFees */
export function calculateFeeEnvelopeMinor(amountMinor: number) {
  return calculateDonoFeeMinor(amountMinor, resolveFeeSchedule());
}

export function calculateApplicationFeeMinor(
  amountMinor: number,
  schedule: FeeSchedule = resolveFeeSchedule(),
) {
  return calculateDonoFeeMinor(amountMinor, schedule);
}

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

/**
 * Donor total = contribution + (coverFees ? Dono fee : 0).
 * Stripe cost is never added to the donor total; campaign bears it.
 * Application fee collected by Dono = Dono fee (from campaign or donor cover).
 */
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
