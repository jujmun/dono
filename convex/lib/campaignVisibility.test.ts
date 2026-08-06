import { describe, expect, it } from "vitest";
import {
  hasCompletedStripeIdentity,
  isEditableByOwner,
  isPublicCampaign,
  isReadyForAdminReview,
  isReadyForSocietyReview,
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

describe("hasCompletedStripeIdentity", () => {
  it("requires verified status when Identity is enabled", () => {
    expect(hasCompletedStripeIdentity({} as never)).toBe(false);
    expect(
      hasCompletedStripeIdentity({ stripeVerificationStatus: "processing" } as never),
    ).toBe(false);
    expect(
      hasCompletedStripeIdentity({ stripeVerificationStatus: "verified" } as never),
    ).toBe(true);
  });
});

describe("isReadyForSocietyReview", () => {
  const societyCreator = {
    type: "society" as const,
    name: "Soc",
    avatar: "SO",
    communityId: "soc",
  };

  it("excludes society-pending campaigns until Stripe verified", () => {
    expect(
      isReadyForSocietyReview({
        status: "pending",
        creator: societyCreator,
        societyApprovalStatus: "pending",
        stripeVerificationStatus: "processing",
      } as never),
    ).toBe(false);
  });

  it("includes society-pending campaigns after Stripe verified", () => {
    expect(
      isReadyForSocietyReview({
        status: "pending",
        creator: societyCreator,
        societyApprovalStatus: "pending",
        stripeVerificationStatus: "verified",
      } as never),
    ).toBe(true);
  });
});

describe("isReadyForAdminReview", () => {
  const societyCreator = {
    type: "society" as const,
    name: "Soc",
    avatar: "SO",
    communityId: "soc",
  };

  it("excludes society campaigns awaiting leader approval", () => {
    expect(
      isReadyForAdminReview({
        status: "pending",
        creator: societyCreator,
        societyApprovalStatus: "pending",
        stripeVerificationStatus: "verified",
      } as never),
    ).toBe(false);
  });

  it("excludes society-approved campaigns until Stripe verified", () => {
    expect(
      isReadyForAdminReview({
        status: "pending",
        creator: societyCreator,
        societyApprovalStatus: "approved",
        stripeVerificationStatus: "processing",
      } as never),
    ).toBe(false);
  });

  it("includes society campaigns after leader approval and Stripe verified", () => {
    expect(
      isReadyForAdminReview({
        status: "pending",
        creator: societyCreator,
        societyApprovalStatus: "approved",
        stripeVerificationStatus: "verified",
      } as never),
    ).toBe(true);
  });

  it("excludes non-pending campaigns even if society-approved", () => {
    expect(
      isReadyForAdminReview({
        status: "active",
        creator: societyCreator,
        societyApprovalStatus: "approved",
        stripeVerificationStatus: "verified",
      } as never),
    ).toBe(false);
  });

  it("includes pending non-society campaigns when Stripe verified", () => {
    expect(
      isReadyForAdminReview({
        status: "pending",
        creator: { type: "student", name: "Stu", avatar: "ST" },
        stripeVerificationStatus: "verified",
      } as never),
    ).toBe(true);
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
