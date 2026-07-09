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
});
