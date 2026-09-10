import { describe, expect, it } from "vitest";
import {
  assertExistingFunding,
  displayRaised,
  isCampaignFunded,
  liveStatusAfterTotals,
} from "./existingFunding";

describe("displayRaised", () => {
  it("adds existing funding to Dono raised", () => {
    expect(displayRaised({ raised: 50, existingFunding: 200 })).toBe(250);
  });

  it("treats missing existing funding as 0", () => {
    expect(displayRaised({ raised: 50 })).toBe(50);
  });
});

describe("isCampaignFunded", () => {
  it("is funded when seed plus donations meet the goal", () => {
    expect(
      isCampaignFunded({ raised: 300, existingFunding: 200, goal: 500 }),
    ).toBe(true);
  });

  it("is not funded when the goal has not been set yet", () => {
    expect(isCampaignFunded({ raised: 0, existingFunding: 0, goal: 0 })).toBe(
      false,
    );
  });
});

describe("assertExistingFunding", () => {
  it("allows 0 and amounts below the goal", () => {
    expect(() => assertExistingFunding(0, 500)).not.toThrow();
    expect(() => assertExistingFunding(200, 500)).not.toThrow();
  });

  it("rejects amounts that meet or exceed the goal", () => {
    expect(() => assertExistingFunding(500, 500)).toThrow();
    expect(() => assertExistingFunding(501, 500)).toThrow();
  });

  it("rejects negative or non-finite amounts", () => {
    expect(() => assertExistingFunding(-1, 500)).toThrow();
    expect(() => assertExistingFunding(Number.NaN, 500)).toThrow();
  });
});

describe("liveStatusAfterTotals", () => {
  it("marks an active campaign funded when display raised meets the goal", () => {
    expect(liveStatusAfterTotals("active", 300, 200, 500)).toBe("funded");
  });

  it("returns a funded campaign to active when display raised falls below the goal", () => {
    expect(liveStatusAfterTotals("funded", 100, 50, 500)).toBe("active");
  });

  it("leaves pending and completed statuses unchanged", () => {
    expect(liveStatusAfterTotals("pending", 500, 0, 500)).toBe("pending");
    expect(liveStatusAfterTotals("completed", 100, 0, 500)).toBe("completed");
  });
});
