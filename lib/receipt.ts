import type { Campaign } from "@/lib/types";
import { parseImpactItem } from "@/lib/fund-breakdown";

export interface ReceiptLine {
  label: string;
  amount: number;
  muted?: boolean;
}

const defaultLabelsByCategory: Record<string, string[]> = {
  textbooks: ["Core textbook", "Reference set", "Lab materials"],
  equipment: ["Primary equipment", "Accessories", "Setup costs"],
  travel: ["Conference fee", "Travel costs", "Accommodation"],
  welfare: ["Support kits", "Essential supplies", "Distribution"],
  events: ["Venue costs", "Materials", "Catering"],
  accessibility: ["Equipment", "Installation", "Support"],
  sports: ["Kit & gear", "Training costs", "Competition fees"],
  memorial: ["Memorial fund", "Materials", "Installation"],
  outreach: ["Program costs", "Materials", "Outreach events"],
};

function splitAmount(total: number, parts: number): number[] {
  if (parts <= 0 || total <= 0) return Array.from({ length: parts }, () => 0);
  const base = Math.floor(total / parts);
  const amounts = Array.from({ length: parts }, () => base);
  amounts[parts - 1] += total - base * parts;
  return amounts;
}

function goalLabels(campaign: Campaign): string[] {
  if (campaign.impactItems?.length && campaign.impactItems.length >= 2) {
    return campaign.impactItems.map((item) => parseImpactItem(item).label);
  }
  return (
    defaultLabelsByCategory[campaign.category] ?? [
      "Primary cost",
      "Secondary cost",
      "Additional costs",
    ]
  );
}

function goalAmountsFromImpactItems(campaign: Campaign): number[] | null {
  if (!campaign.impactItems?.length || campaign.impactItems.length < 2) {
    return null;
  }
  const parsed = campaign.impactItems.map((item) => parseImpactItem(item));
  if (!parsed.every((item) => item.amount !== undefined)) {
    return null;
  }
  return parsed.map((item) => item.amount!);
}

/** Line items for the campaign goal — uses creator breakdown when available. */
export function buildGoalLineItems(campaign: Campaign): ReceiptLine[] {
  const labels = goalLabels(campaign);
  const itemCount = Math.min(labels.length, 5);
  const customAmounts = goalAmountsFromImpactItems(campaign);
  const amounts =
    customAmounts?.slice(0, itemCount) ?? splitAmount(campaign.goal, itemCount);

  return labels.slice(0, itemCount).map((label, index) => ({
    label,
    amount: amounts[index] ?? 0,
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
