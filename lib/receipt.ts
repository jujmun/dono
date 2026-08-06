import type { Campaign } from "@/lib/types";
import { parseImpactItem } from "@/lib/fund-breakdown";

export interface ReceiptLine {
  label: string;
  amount: number;
  muted?: boolean;
}

/**
 * Creator-provided cost breakdown line items.
 * Returns an empty array when the submitter left the breakdown blank —
 * callers should still show Total goal / raised separately.
 */
export function buildGoalLineItems(campaign: Campaign): ReceiptLine[] {
  if (!campaign.impactItems?.length) {
    return [];
  }
  const parsed = campaign.impactItems.map((item) => parseImpactItem(item));
  if (!parsed.every((item) => item.amount !== undefined && item.label.trim())) {
    return [];
  }
  return parsed.slice(0, 5).map((item) => ({
    label: item.label.trim(),
    amount: item.amount!,
  }));
}

/** Closing ledger row — always present on campaign cards. */
export function buildReceiptFooter(campaign: Campaign): ReceiptLine {
  const remaining = Math.max(0, campaign.goal - campaign.raised);

  if (campaign.raised === 0) {
    return { label: "Total goal", amount: campaign.goal };
  }

  if (remaining === 0 || campaign.status === "funded") {
    return { label: "Fully funded", amount: campaign.goal, muted: true };
  }

  return { label: "Remaining", amount: remaining, muted: true };
}

/** @deprecated Use buildGoalLineItems + buildReceiptFooter for consistent card layout. */
export function buildReceiptLines(campaign: Campaign): ReceiptLine[] {
  return [...buildGoalLineItems(campaign), buildReceiptFooter(campaign)];
}

function formatPlaceName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "";
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("university of ")) {
    const place = lower.slice("university of ".length);
    const formattedPlace =
      place.length > 0 ? `${place.charAt(0).toUpperCase()}${place.slice(1)}` : place;
    return `University of ${formattedPlace}`;
  }
  return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
}

export function getReceiptSubtitle(campaign: Campaign): string {
  const university = campaign.university
    ? formatPlaceName(campaign.university)
    : "";
  const parts = [university, campaign.college, campaign.creator.name].filter(Boolean);
  return parts.slice(0, 2).join(" · ");
}
