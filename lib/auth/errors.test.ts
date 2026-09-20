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

  it("reads structured ConvexError.data when message is redacted", () => {
    const err = new Error("[CONVEX M(campaigns:approve)] Server Error") as Error & {
      data: { code: string; message: string };
    };
    err.data = {
      code: "CAMPAIGN_FIELDS_REQUIRED",
      message:
        "Ownership statement, planned update schedule, and expected expenditure date are required.",
    };
    expect(getFriendlyAuthError(err)).toBe(
      "Ownership statement, planned update schedule, and expected expenditure date are required.",
    );
  });

  it("surfaces client-thrown Error messages used outside auth", () => {
    expect(getFriendlyAuthError(new Error("A student card is required."))).toBe(
      "A student card is required.",
    );
  });

  it("keeps a generic fallback for redacted Convex Server Error", () => {
    expect(
      getFriendlyAuthError(new Error("[CONVEX M(campaigns:create)] Server Error")),
    ).toBe("Something went wrong. Please try again.");
  });

  it("does not leak Convex request-id Server Error wrappers", () => {
    expect(
      getFriendlyAuthError(
        new Error(
          "[CONVEX M(campaigns:create)] [Request ID: 6a5a5243d65084a3] Server Error\nCalled by client",
        ),
      ),
    ).toBe("Something went wrong. Please try again.");
  });

  it("surfaces LEGAL_ACCEPTANCE_REQUIRED from ConvexError.data", () => {
    const err = new Error(
      "[CONVEX M(campaigns:create)] [Request ID: abc] Server Error\nCalled by client",
    ) as Error & { data: { code: string; message: string } };
    err.data = {
      code: "LEGAL_ACCEPTANCE_REQUIRED",
      message: "Please accept the latest society campaign terms before continuing.",
    };
    expect(getFriendlyAuthError(err)).toBe(
      "Please accept the latest society campaign terms before continuing.",
    );
  });
});
