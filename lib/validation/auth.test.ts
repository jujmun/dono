import { describe, expect, it } from "vitest";
import {
  changePasswordSchema,
  resetPasswordSchema,
  signInSchema,
  verifyEmailSchema,
} from "./auth";

describe("auth validation", () => {
  it("accepts valid sign in input", () => {
    const result = signInSchema.safeParse({
      email: "test@example.com",
      password: "Password123!",
      flow: "signIn",
    });
    expect(result.success).toBe(true);
  });

  it("supports sign-up flow in the same schema", () => {
    const result = signInSchema.safeParse({
      email: "signup@example.com",
      password: "Password123!",
      flow: "signUp",
    });
    expect(result.success).toBe(true);
  });

  it("rejects weak password on reset", () => {
    const result = resetPasswordSchema.safeParse({
      email: "user@example.com",
      code: "123456",
      newPassword: "weak",
    });
    expect(result.success).toBe(false);
  });

  it("requires current password for change flow", () => {
    const result = changePasswordSchema.safeParse({
      email: "user@example.com",
      currentPassword: "",
      newPassword: "StrongPass123!",
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
