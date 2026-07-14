import { describe, expect, expectTypeOf, it } from "vitest";
import { api, internal } from "./_generated/api";
import * as securityModule from "./security";
import * as fixedOtpModule from "./fixedOtpCleanup";
import * as usersModule from "./users";

/**
 * Prove sensitive auth/rate-limit/OTP helpers are internal-only.
 * Runtime `api` is an anyApi proxy, so we assert both module exports and types.
 */
describe("Convex public API security surface", () => {
  it("security module only exports internalMutation wrappers", () => {
    expect(Object.keys(securityModule).sort()).toEqual(
      ["FLOW_LIMITS", "consumeOtpSend", "consumeQuota", "normalizeAndValidateOxfordEmail"].sort(),
    );
    // Public `mutation` exports like record/assertAllowed must not exist.
    expect("record" in securityModule).toBe(false);
    expect("assertAllowed" in securityModule).toBe(false);
  });

  it("fixed OTP cleanup exports are all internalMutation wrappers", () => {
    expect(Object.keys(fixedOtpModule).sort()).toEqual(
      [
        "clearFixedOtpCodes",
        "keepNewestFixedOtpCode",
        "setFixedBypassCodeForEmail",
      ].sort(),
    );
  });

  it("bootstrapFirstAdmin is exported from users but not on the public api type", () => {
    expect("bootstrapFirstAdmin" in usersModule).toBe(true);
    expectTypeOf(api.users).not.toHaveProperty("bootstrapFirstAdmin");
    expectTypeOf(internal.users).toHaveProperty("bootstrapFirstAdmin");
  });

  it("types exclude security and fixedOtpCleanup from public api", () => {
    expectTypeOf(api).not.toHaveProperty("security");
    expectTypeOf(api).not.toHaveProperty("fixedOtpCleanup");
    expectTypeOf(internal).toHaveProperty("security");
    expectTypeOf(internal).toHaveProperty("fixedOtpCleanup");
  });
});
