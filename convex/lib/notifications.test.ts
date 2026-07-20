import { describe, expect, it } from "vitest";
import {
  MAX_ADMIN_MESSAGE_LENGTH,
  ONBOARDING_MESSAGE,
  buildCampaignActiveMessage,
  buildCampaignPendingMessage,
  buildCampaignRejectedMessage,
  validateAdminMessageBody,
} from "./notifications";

describe("notification message builders", () => {
  it("builds the pending message with the campaign title", () => {
    expect(buildCampaignPendingMessage("Anatomy Models")).toBe(
      "Your campaign 'Anatomy Models' is waiting for verification.",
    );
  });

  it("builds the active message with the campaign title", () => {
    expect(buildCampaignActiveMessage("Anatomy Models")).toBe(
      "Your campaign 'Anatomy Models' is now active.",
    );
  });

  it("builds the rejected message with the campaign title", () => {
    expect(buildCampaignRejectedMessage("Anatomy Models")).toBe(
      "Your campaign 'Anatomy Models' was not approved.",
    );
  });

  it("has a stable onboarding placeholder message", () => {
    expect(ONBOARDING_MESSAGE).toBe("Click here for onboarding.");
  });
});

describe("validateAdminMessageBody", () => {
  it("rejects empty or whitespace-only messages", () => {
    expect(validateAdminMessageBody("").valid).toBe(false);
    expect(validateAdminMessageBody("   ").valid).toBe(false);
  });

  it("trims and accepts a normal message", () => {
    const result = validateAdminMessageBody("  Hello there  ");
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.message).toBe("Hello there");
    }
  });

  it("accepts a message exactly at the length cap", () => {
    const atCap = "a".repeat(MAX_ADMIN_MESSAGE_LENGTH);
    expect(validateAdminMessageBody(atCap).valid).toBe(true);
  });

  it("rejects a message over the length cap", () => {
    const overCap = "a".repeat(MAX_ADMIN_MESSAGE_LENGTH + 1);
    expect(validateAdminMessageBody(overCap).valid).toBe(false);
  });
});
