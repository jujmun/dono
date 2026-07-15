import { describe, expect, it } from "vitest";
import { isPublicCampaign, requiresSocietyApproval } from "./campaignVisibility";

describe("campaignVisibility", () => {
  it("requires society approval for society creators", () => {
    expect(requiresSocietyApproval("society")).toBe(true);
    expect(requiresSocietyApproval("student")).toBe(false);
  });

  it("hides society campaigns until society approved", () => {
    const campaign = {
      status: "active" as const,
      creator: { type: "society", name: "Soc", avatar: "SO", communityId: "soc" },
      societyApprovalStatus: "pending" as const,
    };
    expect(isPublicCampaign(campaign as never)).toBe(false);
  });

  it("shows society campaigns after society approval", () => {
    const campaign = {
      status: "active" as const,
      creator: { type: "society", name: "Soc", avatar: "SO", communityId: "soc" },
      societyApprovalStatus: "approved" as const,
    };
    expect(isPublicCampaign(campaign as never)).toBe(true);
  });
});
