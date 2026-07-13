import { describe, expect, it } from "vitest";
import { getFriendlyAuthError } from "./errors";

describe("friendly auth errors", () => {
  it("maps rate-limit errors", () => {
    const msg = getFriendlyAuthError(new Error("RATE_LIMITED"));
    expect(msg.toLowerCase()).toContain("too many attempts");
  });

  it("maps unauthenticated errors", () => {
    const msg = getFriendlyAuthError(new Error("Not authenticated"));
    expect(msg.toLowerCase()).toContain("sign in");
  });

  it("maps OTP send failures without calling them invalid codes", () => {
    const msg = getFriendlyAuthError(
      new Error(
        'Uncaught ConvexError: {"code":"OTP_SEND_FAILED","message":"Unable to send OTP email. Please try again."}',
      ),
    );
    expect(msg.toLowerCase()).toContain("couldn't send");
    expect(msg.toLowerCase()).not.toContain("invalid or expired");
  });

  it("maps invalid/expired verification codes", () => {
    const msg = getFriendlyAuthError(new Error("Invalid verification token"));
    expect(msg.toLowerCase()).toContain("invalid or expired");
  });

  it("maps domain allowlist failures", () => {
    const msg = getFriendlyAuthError(
      new Error(
        'ConvexError: {"code":"EMAIL_DOMAIN_NOT_ALLOWED","message":"Only Oxford email addresses (ending in ox.ac.uk) are allowed."}',
      ),
    );
    expect(msg.toLowerCase()).toContain("domain is not allowed");
  });
});
