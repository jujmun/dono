/**
 * Fee envelope: 5% + 20p of the donation amount.
 * That envelope is split: estimated Stripe card fee first, Dono residual is the
 * Connect application fee (or platform retention on community funds).
 */
export const PLATFORM_FEE_RATE = 0.05;
/** Fixed 20p component of the Dono fee envelope (minor units). */
export const PLATFORM_FEE_FIXED_MINOR = 20;

/**
 * Estimated Stripe UK card fee for checkout display and envelope split.
 * Actual Stripe fees vary by card; this is an estimate only (1.5% + £0.20).
 */
export const ESTIMATED_STRIPE_PERCENT = 0.015;
export const ESTIMATED_STRIPE_FIXED_MINOR = 20;

/** Total fee cut from the donation: 5% + 20p (minor units). */
export function calculateFeeEnvelopeMinor(amountMinor: number) {
  return Math.round(amountMinor * PLATFORM_FEE_RATE) + PLATFORM_FEE_FIXED_MINOR;
}

export function estimateStripeFeeMinor(chargeAmountMinor: number) {
  return (
    Math.round(chargeAmountMinor * ESTIMATED_STRIPE_PERCENT) +
    ESTIMATED_STRIPE_FIXED_MINOR
  );
}

/**
 * Dono's share of the fee envelope (Connect application_fee / platform retention).
 * Stripe's estimated share is taken from the envelope first; residual goes to Dono.
 */
export function calculateApplicationFeeMinor(amountMinor: number) {
  const feeEnvelopeMinor = calculateFeeEnvelopeMinor(amountMinor);
  const stripeShareMinor = Math.min(
    estimateStripeFeeMinor(amountMinor),
    feeEnvelopeMinor,
  );
  return Math.max(0, feeEnvelopeMinor - stripeShareMinor);
}

/**
 * Proportional application-fee refund from the originally stored Dono fee.
 * Prefer this over re-deriving from the refunded gross alone.
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
  /** Full fee envelope (5% + 20p) in minor units. */
  feeEnvelopeMinor: number;
  /** Dono residual after allocating Stripe share of the envelope. */
  platformFeeMinor: number;
  /** Estimated Stripe share of the envelope (capped at envelope). */
  estimatedStripeFeeMinor: number;
  /** Total charged to the donor (minor units). */
  totalChargedMinor: number;
  /** Expected amount reaching the campaign after fees (minor units). */
  amountToCampaignMinor: number;
  /** Application fee taken by Dono on the PaymentIntent (minor units). */
  applicationFeeAmountMinor: number;
  coverFees: boolean;
};

/**
 * Fee-cover checkout math (Donor Terms §6).
 *
 * coverFees=false: donor pays intended amount; fee envelope reduces what the campaign receives.
 * coverFees=true: donor pays intended + fee envelope so intended reaches the campaign.
 */
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
