import { ConvexError } from "convex/values";

type CampaignTotals = {
  raised: number;
  existingFunding?: number;
  goal: number;
};

type LiveStatus = "active" | "funded";

export function displayRaised(campaign: {
  raised: number;
  existingFunding?: number;
}): number {
  return campaign.raised + (campaign.existingFunding ?? 0);
}

export function isCampaignFunded(campaign: CampaignTotals): boolean {
  if (!(campaign.goal > 0)) return false;
  return displayRaised(campaign) >= campaign.goal;
}

/** Off-platform seed money: 0 allowed, must be finite, and strictly below the goal. */
export function assertExistingFunding(amount: number, goal: number): void {
  if (!Number.isFinite(amount) || amount < 0 || amount >= goal) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: "Already received must be at least 0 and less than the funding goal.",
    });
  }
}

/** Recompute active/funded from display totals. Leaves every other status untouched. */
export function liveStatusAfterTotals(
  status: string,
  raised: number,
  existingFunding: number,
  goal: number,
): string {
  if (status !== "active" && status !== "funded") {
    return status;
  }
  const next: LiveStatus = isCampaignFunded({
    raised,
    existingFunding,
    goal,
  })
    ? "funded"
    : "active";
  return next;
}
