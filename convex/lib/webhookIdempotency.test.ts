import { describe, expect, it } from "vitest";
import { shouldProcessWebhookEvent } from "./webhookIdempotency";

describe("shouldProcessWebhookEvent", () => {
  it("processes new events", () => {
    expect(shouldProcessWebhookEvent(null)).toBe(true);
  });

  it("skips duplicate events", () => {
    expect(
      shouldProcessWebhookEvent({ stripeEventId: "evt_123" }),
    ).toBe(false);
  });
});
