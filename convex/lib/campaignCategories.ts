/** Campaign categories permitted under ToS §8.2 (Convex-safe). */
export const ALLOWED_CAMPAIGN_CATEGORIES = [
  "textbooks",
  "equipment",
  "travel",
  "events",
  "sports",
  "accessibility",
  "outreach",
] as const;

export function isAllowedCampaignCategory(category: string): boolean {
  return (ALLOWED_CAMPAIGN_CATEGORIES as readonly string[]).includes(category);
}
