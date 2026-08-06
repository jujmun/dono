import type { Campaign } from "@/lib/types";
import { buildGoalLineItems } from "./receipt";
import { formatCurrency, getProgress } from "./constants";

export const DETAIL_DONATION_PRESETS = [5, 10, 25, 100, 150, 200] as const;
export const RECOMMENDED_DONATION_AMOUNT = 25;

/** Motivational standing copy by gift size (UX framing, not live donor stats). */
export function donorStandingForAmount(amount: number): {
  before: string;
  emphasis: string;
  after: string;
} | null {
  if (!Number.isFinite(amount) || amount <= 0) return null;
  if (amount >= 200) {
    return {
      before: "Congratulations! You're in the ",
      emphasis: "top 1%",
      after: " of donors",
    };
  }
  if (amount >= 150) {
    return {
      before: "Amazing — you're in the ",
      emphasis: "top 2%",
      after: " of donors",
    };
  }
  if (amount >= 100) {
    return {
      before: "Fantastic — you're in the ",
      emphasis: "top 5%",
      after: " of donors",
    };
  }
  if (amount >= 25) {
    return {
      before: "Great choice — you're in the ",
      emphasis: "top 10%",
      after: " of donors",
    };
  }
  if (amount >= 10) {
    return {
      before: "Nice — you're among the ",
      emphasis: "top 25%",
      after: " of donors",
    };
  }
  return {
    before: "Every gift counts — you're already ahead of ",
    emphasis: "most visitors",
    after: "",
  };
}

export type ActiveMatchSummary = {
  multiplier: number;
  budgetPounds: number;
  consumedPounds: number;
  remainingPounds: number;
  sponsorLabel: string;
};

/** Match credit for a donor gift (does not include the gift itself). */
export function computeMatchCredit(
  donationPounds: number,
  match: Pick<ActiveMatchSummary, "multiplier" | "remainingPounds"> | null | undefined,
): number {
  if (!match || donationPounds <= 0 || match.multiplier <= 1) return 0;
  const raw = donationPounds * (match.multiplier - 1);
  return Math.min(raw, Math.max(0, match.remainingPounds));
}

export function computeMatchedTotal(
  donationPounds: number,
  match: Pick<ActiveMatchSummary, "multiplier" | "remainingPounds"> | null | undefined,
): number {
  return donationPounds + computeMatchCredit(donationPounds, match);
}

/** Round up to the next £5 boundary (no-op if already on a multiple of 5). */
export function nextRoundUpAmount(amount: number): number | null {
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const rounded = Math.ceil(amount / 5) * 5;
  if (rounded <= amount) return null;
  return rounded;
}

export function isNearGoal(campaign: Pick<Campaign, "raised" | "goal" | "status">): boolean {
  if (campaign.status === "funded" || campaign.status === "completed") return false;
  if (campaign.goal <= 0) return false;
  const progress = getProgress(campaign.raised, campaign.goal);
  return progress >= 80 && campaign.raised < campaign.goal;
}

export function nearGoalRemaining(campaign: Pick<Campaign, "raised" | "goal">): number {
  return Math.max(0, campaign.goal - campaign.raised);
}

/** Short copy tying the selected amount to a budget line item. */
export function outcomeCopyForAmount(
  campaign: Campaign,
  amount: number,
): string | null {
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const lines = buildGoalLineItems(campaign).filter((line) => line.amount > 0);
  if (lines.length === 0) return null;

  const exact = lines.find((line) => line.amount === amount);
  if (exact) {
    return `${formatCurrency(amount)} funds ${exact.label}`;
  }

  const nearest = [...lines].sort(
    (a, b) => Math.abs(a.amount - amount) - Math.abs(b.amount - amount),
  )[0];
  if (!nearest) return null;

  if (amount >= nearest.amount) {
    return `${formatCurrency(amount)} covers ${nearest.label}`;
  }

  const pct = Math.max(1, Math.round((amount / nearest.amount) * 100));
  return `${formatCurrency(amount)} ≈ ${pct}% of ${nearest.label}`;
}

/** Impact line without the leading amount — for “Your £X unlocks …” frames. */
export function outcomeLabelForAmount(
  campaign: Campaign,
  amount: number,
): string | null {
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const lines = buildGoalLineItems(campaign).filter((line) => line.amount > 0);
  if (lines.length === 0) return null;

  const exact = lines.find((line) => line.amount === amount);
  if (exact) {
    return exact.label;
  }

  const nearest = [...lines].sort(
    (a, b) => Math.abs(a.amount - amount) - Math.abs(b.amount - amount),
  )[0];
  if (!nearest) return null;

  if (amount >= nearest.amount) {
    return nearest.label;
  }

  const pct = Math.max(1, Math.round((amount / nearest.amount) * 100));
  return `about ${pct}% of ${nearest.label}`;
}
