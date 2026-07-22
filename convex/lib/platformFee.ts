/** Dono platform fee: 5% of gross donation amount. */
export const PLATFORM_FEE_RATE = 0.05;

export function calculateApplicationFeeMinor(grossAmountMinor: number) {
  return Math.round(grossAmountMinor * PLATFORM_FEE_RATE);
}

export function calculateApplicationFeeRefundMinor(refundedGrossMinor: number) {
  return calculateApplicationFeeMinor(refundedGrossMinor);
}
