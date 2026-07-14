import { afterEach, describe, expect, it } from "vitest";
import {
  ADMIN_BYPASS_EMAIL,
  ADMIN_BYPASS_OTP,
  isAdminOtpBypassEnabled,
  isBypassAdminEmail,
} from "./ResendEmailOTP";

describe("admin OTP bypass gates", () => {
  const originalBypass = process.env.AUTH_ADMIN_OTP_BYPASS;
  const originalDeployment = process.env.CONVEX_DEPLOYMENT;

  afterEach(() => {
    if (originalBypass === undefined) {
      delete process.env.AUTH_ADMIN_OTP_BYPASS;
    } else {
      process.env.AUTH_ADMIN_OTP_BYPASS = originalBypass;
    }
    if (originalDeployment === undefined) {
      delete process.env.CONVEX_DEPLOYMENT;
    } else {
      process.env.CONVEX_DEPLOYMENT = originalDeployment;
    }
  });

  it("is disabled when the env flag is unset", () => {
    delete process.env.AUTH_ADMIN_OTP_BYPASS;
    process.env.CONVEX_DEPLOYMENT = "dev:local-test";
    expect(isAdminOtpBypassEnabled()).toBe(false);
  });

  it("is disabled on prod deployments even if the flag is true", () => {
    process.env.AUTH_ADMIN_OTP_BYPASS = "true";
    process.env.CONVEX_DEPLOYMENT = "prod:brave-parakeet-947";
    expect(isAdminOtpBypassEnabled()).toBe(false);
  });

  it("is enabled only on non-prod when the flag is true", () => {
    process.env.AUTH_ADMIN_OTP_BYPASS = "true";
    process.env.CONVEX_DEPLOYMENT = "dev:brave-parakeet-947";
    expect(isAdminOtpBypassEnabled()).toBe(true);
  });

  it("only treats admin@ox.ac.uk as the bypass email", () => {
    expect(isBypassAdminEmail("admin@ox.ac.uk")).toBe(true);
    expect(isBypassAdminEmail("Admin@ox.ac.uk")).toBe(true);
    expect(isBypassAdminEmail("student@ox.ac.uk")).toBe(false);
    expect(isBypassAdminEmail("admin@example.com")).toBe(false);
  });

  it("uses a fixed bypass OTP constant (not emailed in production)", () => {
    expect(ADMIN_BYPASS_OTP).toBe("000000");
    expect(ADMIN_BYPASS_EMAIL).toBe("admin@ox.ac.uk");
  });
});
