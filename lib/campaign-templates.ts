import type { RetroPanelAccent } from "@/components/retro/retro-panel";

/**
 * Controls section order everywhere a campaign is rendered — the review-step
 * preview (components/campaign-preview.tsx) and the published page
 * (app/campaigns/[id].tsx):
 *  - media-first  = media+donate, then story+breakdown, then photo gallery
 *  - text-first   = story leads, then media+donate, then breakdown, then gallery
 *  - gallery-grid = media+donate, then photo gallery, then story+breakdown
 *  - ledger-first = cost breakdown leads, then media+donate, then story, then gallery
 */
export type CampaignHeroLayout =
  | "media-first"
  | "text-first"
  | "gallery-grid"
  | "ledger-first";

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  unlocks: {
    accent: RetroPanelAccent;
    /** Solid hex of `accent`, for inline style overrides on tokens that aren't the retro palette (e.g. CampaignPreview's dono-* theme). */
    accentHex: string;
    heroLayout: CampaignHeroLayout;
  };
}

/**
 * Single source of truth for campaign page templates. Add/edit entries here only.
 * Each template maps to a genuinely distinct heroLayout — don't add a template
 * that only changes the accent color, that's not a distinct layout.
 *
 * NOTE: the list of valid ids is duplicated server-side in
 * convex/lib/campaignTemplates.ts (Convex only bundles convex/, so it can't
 * import this file) — keep the ids in both files in sync.
 */
export const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description:
      "Media hero leads, story and cost breakdown sit side-by-side below, photos last.",
    unlocks: { accent: "mint", accentHex: "#159E88", heroLayout: "media-first" },
  },
  {
    id: "story",
    name: "Story First",
    description:
      "Your story leads full-width before any media, for personal, narrative-driven appeals.",
    unlocks: { accent: "coral", accentHex: "#F2542D", heroLayout: "text-first" },
  },
  {
    id: "gallery",
    name: "Photo Gallery",
    description:
      "Media hero leads straight into a full photo gallery, story and breakdown come after.",
    unlocks: { accent: "indigo", accentHex: "#4D5FE3", heroLayout: "gallery-grid" },
  },
  {
    id: "ledger",
    name: "Transparent Ledger",
    description:
      "Cost breakdown leads full-width so donors see exactly what they're funding first.",
    unlocks: { accent: "marigold", accentHex: "#F8B400", heroLayout: "ledger-first" },
  },
];

export const DEFAULT_CAMPAIGN_TEMPLATE_ID = "classic";

export function getCampaignTemplate(id: string | null | undefined): CampaignTemplate {
  return (
    CAMPAIGN_TEMPLATES.find((template) => template.id === id) ?? CAMPAIGN_TEMPLATES[0]
  );
}
