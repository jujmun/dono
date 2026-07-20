import { describe, expect, it } from "vitest";
import {
  isEditableByOwner,
  isPublicCampaign,
  isUnderReview,
  requiresSocietyApproval,
} from "./campaignVisibility";

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

describe("isUnderReview", () => {
  it("treats pending and changes_requested as under review", () => {
    expect(isUnderReview("pending")).toBe(true);
    expect(isUnderReview("changes_requested")).toBe(true);
  });

  it("does not treat other statuses as under review", () => {
    expect(isUnderReview("active")).toBe(false);
    expect(isUnderReview("rejected")).toBe(false);
    expect(isUnderReview("funded")).toBe(false);
    expect(isUnderReview("completed")).toBe(false);
  });
});

describe("isEditableByOwner", () => {
  it("allows editing while pending, rejected, or changes_requested", () => {
    expect(isEditableByOwner("pending")).toBe(true);
    expect(isEditableByOwner("rejected")).toBe(true);
    expect(isEditableByOwner("changes_requested")).toBe(true);
  });

  it("blocks editing once live or funded", () => {
    expect(isEditableByOwner("active")).toBe(false);
    expect(isEditableByOwner("funded")).toBe(false);
    expect(isEditableByOwner("completed")).toBe(false);
  });
});
