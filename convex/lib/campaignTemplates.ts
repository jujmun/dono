/**
 * Valid campaign template ids, for server-side arg validation only.
 *
 * Convex only bundles files under convex/, so this can't import the
 * frontend's source of truth at lib/campaign-templates.ts — keep this list
 * in sync with the `id` field of every entry in CAMPAIGN_TEMPLATES there.
 */
export const CAMPAIGN_TEMPLATE_IDS = ["classic", "story", "gallery", "ledger"] as const;

export const DEFAULT_CAMPAIGN_TEMPLATE_ID = "classic";

export function isValidCampaignTemplateId(id: string): boolean {
  return (CAMPAIGN_TEMPLATE_IDS as readonly string[]).includes(id);
}
