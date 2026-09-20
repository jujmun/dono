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

  it("marks campaign funded when existing funding plus the donation reach the goal", () => {
    const result = computeCampaignAfterDonation(
      {
        raised: 250,
        donors: 3,
        goal: 500,
        existingFunding: 200,
        status: "active",
      },
      50,
    );

    expect(result.status).toBe("funded");
    expect(result.raised).toBe(300);
  });
});
