import { describe, expect, it } from "vitest";
import {
  requestOtpSchema,
  verifyOtpSchema,
  verifyEmailSchema,
} from "./auth";

describe("auth validation", () => {
  it("accepts valid otp request input for an Oxford email", () => {
    const result = requestOtpSchema.safeParse({
      email: "test@ox.ac.uk",
    });
    expect(result.success).toBe(true);
  });

  it("accepts Oxford college subdomains", () => {
    const result = requestOtpSchema.safeParse({
      email: "student@st-annes.ox.ac.uk",
    });
    expect(result.success).toBe(true);
  });

  it("normalizes uppercase Oxford emails to lowercase", () => {
    const result = requestOtpSchema.safeParse({
      email: "Student@ST-ANNES.OX.AC.UK",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("student@st-annes.ox.ac.uk");
    }
  });

  it("rejects non-Oxford email domains", () => {
    const result = requestOtpSchema.safeParse({
      email: "test@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects lookalike domains that merely contain ox.ac.uk", () => {
    const result = requestOtpSchema.safeParse({
      email: "test@fakeox.ac.uk.evil.com",
    });
    expect(result.success).toBe(false);
  });

  it("requires six-digit otp verification code", () => {
    const result = verifyOtpSchema.safeParse({
      email: "user@ox.ac.uk",
      code: "1234",
    });
    expect(result.success).toBe(false);
  });

  it("rejects malformed verification code payload", () => {
    const result = verifyEmailSchema.safeParse({
      email: "bad-email",
      code: "",
    });
    expect(result.success).toBe(false);
  });
});
