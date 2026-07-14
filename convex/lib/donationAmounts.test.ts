import { describe, expect, it } from "vitest";
import {
  MAX_DONATION_AMOUNT,
  MIN_DONATION_AMOUNT,
  validateDonationAmount,
} from "./donationAmounts";

describe("validateDonationAmount", () => {
  it("rejects non-finite amounts", () => {
    expect(validateDonationAmount(NaN).valid).toBe(false);
    expect(validateDonationAmount(Infinity).valid).toBe(false);
  });

  it("rejects amounts below minimum", () => {
    expect(validateDonationAmount(0).valid).toBe(false);
  });

  it("accepts minimum and maximum bounds", () => {
    expect(validateDonationAmount(MIN_DONATION_AMOUNT).valid).toBe(true);
    expect(validateDonationAmount(MAX_DONATION_AMOUNT).valid).toBe(true);
  });

  it("rejects amounts above maximum", () => {
    expect(validateDonationAmount(MAX_DONATION_AMOUNT + 1).valid).toBe(false);
  });
});
