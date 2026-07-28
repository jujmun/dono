import { afterEach, describe, expect, it } from "vitest";
import { isDemoOpenAdminEnabled } from "./demoOpenAdmin";

describe("demo open admin gate", () => {
  const originalFlag = process.env.DEMO_OPEN_ADMIN;
  const originalDeployment = process.env.CONVEX_DEPLOYMENT;

  afterEach(() => {
    if (originalFlag === undefined) {
      delete process.env.DEMO_OPEN_ADMIN;
    } else {
      process.env.DEMO_OPEN_ADMIN = originalFlag;
    }
    if (originalDeployment === undefined) {
      delete process.env.CONVEX_DEPLOYMENT;
    } else {
      process.env.CONVEX_DEPLOYMENT = originalDeployment;
    }
  });

  it("is off when DEMO_OPEN_ADMIN is unset", () => {
    delete process.env.DEMO_OPEN_ADMIN;
    process.env.CONVEX_DEPLOYMENT = "dev:brave-parakeet-947";
    expect(isDemoOpenAdminEnabled()).toBe(false);
  });

  it("is ignored on prod deployments even when enabled", () => {
    process.env.DEMO_OPEN_ADMIN = "true";
    process.env.CONVEX_DEPLOYMENT = "prod:shocking-poodle-569";
    expect(isDemoOpenAdminEnabled()).toBe(false);
  });

  it("is on for non-prod when DEMO_OPEN_ADMIN=true", () => {
    process.env.DEMO_OPEN_ADMIN = "true";
    process.env.CONVEX_DEPLOYMENT = "dev:brave-parakeet-947";
    expect(isDemoOpenAdminEnabled()).toBe(true);
  });
});
