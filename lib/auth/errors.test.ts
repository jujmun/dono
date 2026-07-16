import { describe, expect, it } from "vitest";
import { getFriendlyAuthError } from "./errors";

describe("getFriendlyAuthError", () => {
  it("maps InvalidAccountId to setup guidance", () => {
    expect(getFriendlyAuthError(new Error("InvalidAccountId"))).toBe(
      "No password is set for this email yet. We'll send a sign-in code so you can create one.",
    );
  });

  it("maps InvalidSecret to sign-in guidance", () => {
    expect(getFriendlyAuthError(new Error("InvalidSecret"))).toBe(
      "Email or password is incorrect.",
    );
  });

  it("maps Invalid code before generic password errors", () => {
    expect(getFriendlyAuthError(new Error("Invalid code"))).toBe(
      "That code is invalid or expired. Request a new one and try again.",
    );
  });

  it("maps Invalid credentials to sign-in guidance", () => {
    expect(getFriendlyAuthError(new Error("Invalid credentials"))).toBe(
      "Email or password is incorrect.",
    );
  });

  it("maps TooManyFailedAttempts to rate limit guidance", () => {
    expect(getFriendlyAuthError(new Error("TooManyFailedAttempts"))).toBe(
      "Too many attempts. Please wait a little and try again.",
    );
  });

  it("surfaces INVALID_PASSWORD convex details", () => {
    const message =
      'ConvexError: {"code":"INVALID_PASSWORD","message":"Password does not meet security requirements.","details":["Password must be at least 10 characters."]}';
    expect(getFriendlyAuthError(new Error(message))).toBe(
      "Password must be at least 10 characters.",
    );
  });
});
