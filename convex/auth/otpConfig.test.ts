import { describe, expect, it } from "vitest";
import { OTP_ALPHABET, OTP_LENGTH } from "./otpConfig";

describe("otp config", () => {
  it("uses numeric alphabet", () => {
    expect(OTP_ALPHABET).toBe("0123456789");
  });

  it("uses 6-digit codes", () => {
    expect(OTP_LENGTH).toBe(6);
  });
});
