export const IMPACT_ITEM_DELIMITER = "::";

export function encodeImpactItem(label: string, amount: number): string {
  return `${label.trim()}${IMPACT_ITEM_DELIMITER}${amount}`;
}

export function parseImpactItem(item: string): { label: string; amount?: number } {
  const idx = item.lastIndexOf(IMPACT_ITEM_DELIMITER);
  if (idx === -1) {
    return { label: item };
  }
  const label = item.slice(0, idx).trim();
  const amount = Number(item.slice(idx + IMPACT_ITEM_DELIMITER.length));
  return {
    label,
    amount: Number.isFinite(amount) ? amount : undefined,
  };
}

export function encodeImpactItems(
  lines: { label: string; amount: number }[],
): string[] {
  return lines.map((line) => encodeImpactItem(line.label, line.amount));
}
