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
  it("builds a 5% + 20p fee envelope", () => {
    expect(PLATFORM_FEE_RATE).toBe(0.05);
    expect(PLATFORM_FEE_FIXED_MINOR).toBe(20);
    // £100 → 500 + 20 = 520
    expect(calculateFeeEnvelopeMinor(10000)).toBe(520);
    // £1 → 5 + 20 = 25
    expect(calculateFeeEnvelopeMinor(100)).toBe(25);
  });

  it("allocates Stripe share first and Dono residual from the envelope", () => {
    const amountMinor = 10000; // £100
    const envelope = calculateFeeEnvelopeMinor(amountMinor); // 520
    const stripe = Math.min(estimateStripeFeeMinor(amountMinor), envelope);
    const dono = calculateApplicationFeeMinor(amountMinor);
    expect(envelope).toBe(520);
    expect(stripe).toBe(170); // 1.5% + 20p of £100
    expect(dono).toBe(350); // 520 - 170
    expect(dono + stripe).toBe(envelope);
  });

  it("clamps Dono residual at zero when Stripe estimate exceeds envelope", () => {
    // Very small amounts: envelope is mostly the fixed 20p; Stripe fixed 20p can dominate.
    const dono = calculateApplicationFeeMinor(100); // £1 → envelope 25
    expect(dono).toBeGreaterThanOrEqual(0);
    expect(dono).toBe(calculateFeeEnvelopeMinor(100) - Math.min(estimateStripeFeeMinor(100), 25));
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
        originalApplicationFeeMinor: 350,
        originalGrossMinor: 0,
        refundedGrossMinor: 100,
      }),
    ).toBe(0);
  });

  it("keeps intended amount for the campaign when covering fees", () => {
    const breakdown = calculateDonationFeeBreakdown(100, true);
    expect(breakdown.feeEnvelopeMinor).toBe(520);
    expect(breakdown.amountToCampaignMinor).toBe(10000);
    expect(breakdown.totalChargedMinor).toBe(10520); // £100 + £5.20
    expect(breakdown.platformFeeMinor).toBe(350);
    expect(breakdown.applicationFeeAmountMinor).toBe(350);
    expect(breakdown.estimatedStripeFeeMinor).toBe(170);
  });

  it("deducts the fee envelope from campaign amount when not covering", () => {
    const breakdown = calculateDonationFeeBreakdown(100, false);
    expect(breakdown.totalChargedMinor).toBe(10000);
    expect(breakdown.feeEnvelopeMinor).toBe(520);
    expect(breakdown.amountToCampaignMinor).toBe(9480); // 10000 - 520
    expect(breakdown.platformFeeMinor).toBe(350);
    expect(breakdown.applicationFeeAmountMinor).toBe(350);
  });
});
