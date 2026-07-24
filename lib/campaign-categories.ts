/** Campaign categories permitted under ToS §8.2 (society-only product). */
export const ALLOWED_CAMPAIGN_CATEGORIES = [
  "textbooks",
  "equipment",
  "travel",
  "events",
  "sports",
  "accessibility",
  "outreach",
] as const;

export type AllowedCampaignCategory = (typeof ALLOWED_CAMPAIGN_CATEGORIES)[number];

/** Categories that remain in the UI historically but are not accepted under draft ToS. */
export const PROHIBITED_CAMPAIGN_CATEGORIES = ["welfare", "memorial"] as const;

export function isAllowedCampaignCategory(category: string): boolean {
  return (ALLOWED_CAMPAIGN_CATEGORIES as readonly string[]).includes(category);
}
