import { describe, expect, it } from "vitest";
import {
  calculateApplicationFeeMinor,
  calculateApplicationFeeRefundMinor,
  calculateDonationFeeBreakdown,
  calculateFeeEnvelopeMinor,
  estimateStripeFeeMinor,
  PLATFORM_FEE_FIXED_MINOR,
  PLATFORM_FEE_RATE,
} from "./platformFee";

describe("platformFee", () => {
  it("has no Dono platform fee", () => {
    expect(PLATFORM_FEE_RATE).toBe(0);
    expect(PLATFORM_FEE_FIXED_MINOR).toBe(0);
    expect(calculateApplicationFeeMinor(10000)).toBe(0);
  });

  it("uses estimated Stripe fee as the donor pass-through envelope", () => {
    // £100 → 1.5% + 20p = 170
    expect(calculateFeeEnvelopeMinor(10000)).toBe(170);
    expect(estimateStripeFeeMinor(10000)).toBe(170);
    // £1 → 1.5% + 20p = 22
    expect(calculateFeeEnvelopeMinor(100)).toBe(22);
  });

  it("refunds Dono application fee proportionally to refunded gross", () => {
    expect(
      calculateApplicationFeeRefundMinor({
        originalApplicationFeeMinor: 350,
        originalGrossMinor: 10000,
        refundedGrossMinor: 5000,
      }),
    ).toBe(175);
    expect(
      calculateApplicationFeeRefundMinor({
        originalApplicationFeeMinor: 350,
        originalGrossMinor: 10000,
        refundedGrossMinor: 10000,
      }),
    ).toBe(350);
    expect(
      calculateApplicationFeeRefundMinor({
        originalApplicationFeeMinor: 0,
        originalGrossMinor: 10000,
        refundedGrossMinor: 5000,
      }),
    ).toBe(0);
    expect(
      calculateApplicationFeeRefundMinor({
        originalApplicationFeeMinor: 350,
        originalGrossMinor: 0,
        refundedGrossMinor: 100,
      }),
    ).toBe(0);
  });

  it("always adds estimated Stripe fee on top so intended reaches the campaign", () => {
    const breakdown = calculateDonationFeeBreakdown(100);
    expect(breakdown.estimatedStripeFeeMinor).toBe(170);
    expect(breakdown.feeEnvelopeMinor).toBe(170);
    expect(breakdown.platformFeeMinor).toBe(0);
    expect(breakdown.applicationFeeAmountMinor).toBe(0);
    expect(breakdown.amountToCampaignMinor).toBe(10000);
    expect(breakdown.totalChargedMinor).toBe(10170); // £100 + £1.70
    expect(breakdown.coverFees).toBe(true);
  });
});
