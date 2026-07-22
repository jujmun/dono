import { describe, expect, it } from "vitest";
import {
  calculateApplicationFeeMinor,
  calculateApplicationFeeRefundMinor,
  PLATFORM_FEE_RATE,
} from "./platformFee";

describe("platformFee", () => {
  it("charges 5% of gross donation amount in minor units", () => {
    expect(PLATFORM_FEE_RATE).toBe(0.05);
    expect(calculateApplicationFeeMinor(1000)).toBe(50);
    expect(calculateApplicationFeeMinor(105)).toBe(5);
    expect(calculateApplicationFeeMinor(101)).toBe(5);
  });

  it("refunds platform fees proportionally to refunded gross", () => {
    expect(calculateApplicationFeeRefundMinor(500)).toBe(25);
    expect(calculateApplicationFeeRefundMinor(1000)).toBe(50);
  });
});
