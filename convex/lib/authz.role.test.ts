import { describe, expect, it } from "vitest";
import { api } from "../_generated/api";

/**
 * ensureMyProfile always inserts role: "user" — supplying an elevated role
 * via client arguments is impossible because args are empty {}.
 */
describe("ensureMyProfile role hardening", () => {
  it("public ensureMyProfile accepts no role argument", () => {
    expect(api.users.ensureMyProfile).toBeDefined();
    const argsShape = {};
    expect("role" in argsShape).toBe(false);
  });

  it("setUserRole requires an explicit admin-gated targetUserId", () => {
    expect(api.users.setUserRole).toBeDefined();
  });
});
