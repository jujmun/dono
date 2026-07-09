import { describe, expect, it } from "vitest";
import { validatePasswordRequirements } from "./auth/passwordPolicy";

describe("password policy", () => {
  it("accepts strong passwords", () => {
    expect(() => validatePasswordRequirements("StrongPass123!")).not.toThrow();
  });

  it("rejects weak passwords", () => {
    expect(() => validatePasswordRequirements("password")).toThrow();
  });
});
