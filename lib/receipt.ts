import type { Campaign } from "@/lib/types";

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

export function buildReceiptLines(campaign: Campaign): ReceiptLine[] {
  const labels =
    campaign.impactItems?.length && campaign.impactItems.length >= 2
      ? campaign.impactItems
      : defaultLabelsByCategory[campaign.category] ?? [
          "Primary cost",
          "Secondary cost",
          "Additional costs",
        ];

  const itemCount = Math.min(labels.length, 3);
  const remaining = Math.max(0, campaign.goal - campaign.raised);

  if (remaining === campaign.goal) {
    const amounts = splitAmount(campaign.goal, itemCount);
    return labels.slice(0, itemCount).map((label, index) => ({
      label,
      amount: amounts[index] ?? 0,
    }));
  }

  const amounts = splitAmount(campaign.goal - remaining, itemCount);
  const lines: ReceiptLine[] = labels.slice(0, itemCount).map((label, index) => ({
    label,
    amount: amounts[index] ?? 0,
  }));

  if (remaining > 0) {
    lines.push({ label: "Remaining", amount: remaining, muted: true });
  }

  return lines;
}

export function getReceiptSubtitle(campaign: Campaign): string {
  const parts = [campaign.university, campaign.college, campaign.creator.name].filter(
    Boolean,
  );
  return parts.slice(0, 2).join(", ");
}
