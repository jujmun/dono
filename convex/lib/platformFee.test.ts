import { describe, expect, it } from "vitest";
import {
  calculateApplicationFeeMinor,
  calculateApplicationFeeRefundMinor,
  calculateDonationFeeBreakdown,
  calculateDonoFeeMinor,
  DONO_FEE_FIXED_MINOR,
  estimateStripeFeeMinor,
  PROD_DONO_FEE_RATE,
} from "./platformFee";

describe("platformFee", () => {
  it("uses production Dono fee 5% + 20p by default", () => {
    expect(PROD_DONO_FEE_RATE).toBe(0.05);
    expect(DONO_FEE_FIXED_MINOR).toBe(20);
    // £100 → 5% + 20p = 520
    expect(calculateDonoFeeMinor(10000, "production")).toBe(520);
    expect(calculateApplicationFeeMinor(10000, "production")).toBe(520);
  });

  it("uses demo Dono fee 2% + 20p", () => {
    // £100 → 2% + 20p = 220
    expect(calculateDonoFeeMinor(10000, "demo")).toBe(220);
  });

  it("estimates Stripe fee for transparency only", () => {
    expect(estimateStripeFeeMinor(10000)).toBe(170);
  });

  it("refunds Dono application fee proportionally to refunded gross", () => {
    expect(
      calculateApplicationFeeRefundMinor({
        originalApplicationFeeMinor: 350,
        originalGrossMinor: 10000,
        refundedGrossMinor: 5000,
      }),
    ).toBe(175);
  });

  it("does not add Stripe cost to donor total; coverFees optional", () => {
    const uncovered = calculateDonationFeeBreakdown(100, false, "production");
    expect(uncovered.platformFeeMinor).toBe(520);
    expect(uncovered.totalChargedMinor).toBe(10000);
    expect(uncovered.coverFees).toBe(false);
    expect(uncovered.amountToCampaignMinor).toBe(10000 - 520 - 170);

    const covered = calculateDonationFeeBreakdown(100, true, "production");
    expect(covered.totalChargedMinor).toBe(10000 + 520);
    expect(covered.amountToCampaignMinor).toBe(10000 - 170);
    expect(covered.coverFees).toBe(true);
  });
});
