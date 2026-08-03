import { describe, expect, it } from "vitest";
import {
  changePasswordSchema,
  requestOtpSchema,
  setPasswordSchema,
  signInWithPasswordSchema,
  signUpWithPasswordSchema,
  verifyEmailSchema,
  verifyOtpSchema,
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

  it("accepts any valid email for OTP / sign-in flows", () => {
    expect(
      requestOtpSchema.safeParse({ email: "alumni@gmail.com" }).success,
    ).toBe(true);
    expect(
      signInWithPasswordSchema.safeParse({
        email: "alumni@gmail.com",
        password: "x",
      }).success,
    ).toBe(true);
  });

  it("accepts allowlisted outreach admin emails", () => {
    expect(
      requestOtpSchema.safeParse({ email: "dono.outreach@gmail.com" }).success,
    ).toBe(true);
    expect(
      requestOtpSchema.safeParse({ email: "juyeon27312@gmail.com" }).success,
    ).toBe(true);
    expect(
      requestOtpSchema.safeParse({ email: "joindono.team@gmail.com" }).success,
    ).toBe(true);
  });

  it("rejects lookalike domains that merely contain ox.ac.uk for student signup", () => {
    const result = signUpWithPasswordSchema.safeParse({
      email: "test@fakeox.ac.uk.evil.com",
      userType: "student",
      newPassword: "StrongPass123!",
      confirmPassword: "StrongPass123!",
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

  it("accepts a strong password in setPasswordSchema", () => {
    const result = setPasswordSchema.safeParse({
      newPassword: "StrongPass123!",
      confirmPassword: "StrongPass123!",
    });
    expect(result.success).toBe(true);
  });

  it("accepts student sign-up with Oxford email and matching passwords", () => {
    const result = signUpWithPasswordSchema.safeParse({
      email: "student@st-annes.ox.ac.uk",
      userType: "student",
      newPassword: "StrongPass123!",
      confirmPassword: "StrongPass123!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects student sign-up with a non-Oxford email", () => {
    const result = signUpWithPasswordSchema.safeParse({
      email: "student@gmail.com",
      userType: "student",
      newPassword: "StrongPass123!",
      confirmPassword: "StrongPass123!",
    });
    expect(result.success).toBe(false);
  });

  it("accepts alumni sign-up with a personal email", () => {
    const result = signUpWithPasswordSchema.safeParse({
      email: "alumni@gmail.com",
      userType: "alumni",
      newPassword: "StrongPass123!",
      confirmPassword: "StrongPass123!",
    });
    expect(result.success).toBe(true);
  });

  it("requires a password for sign-in", () => {
    const result = signInWithPasswordSchema.safeParse({
      email: "student@st-annes.ox.ac.uk",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched passwords in setPasswordSchema", () => {
    const result = setPasswordSchema.safeParse({
      newPassword: "StrongPass123!",
      confirmPassword: "DifferentPass123!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects weak passwords in changePasswordSchema", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "old-password",
      newPassword: "weak",
      confirmPassword: "weak",
    });
    expect(result.success).toBe(false);
  });
});
