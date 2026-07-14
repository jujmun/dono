import { describe, expect, it } from "vitest";
import { computeCampaignAfterDonation } from "./applyDonationToCampaign";

describe("computeCampaignAfterDonation", () => {
  it("marks campaign funded when raised reaches goal", () => {
    const result = computeCampaignAfterDonation(
      { raised: 90, donors: 5, goal: 100, status: "active" },
      10,
    );

    expect(result).toEqual({
      raised: 100,
      donors: 6,
      goal: 100,
      status: "funded",
    });
  });

  it("keeps completed status when below goal", () => {
    const result = computeCampaignAfterDonation(
      { raised: 50, donors: 2, goal: 100, status: "completed" },
      10,
    );

    expect(result.status).toBe("completed");
  });
});
