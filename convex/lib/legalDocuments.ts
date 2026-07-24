/** Versioned legal documents — Convex-safe copy of lib/legal/documents.ts */

export const LEGAL_DOCUMENT_IDS = [
  "terms_of_service",
  "society_campaign_terms",
  "student_campaign_terms",
  "donor_terms",
  "community_guidelines",
  "privacy",
  "cookie",
  "refund_dispute",
  "verification",
] as const;

export type LegalDocumentId = (typeof LEGAL_DOCUMENT_IDS)[number];

export type LegalAcceptanceContext =
  | "signup"
  | "create_campaign"
  | "create_society"
  | "donate";

export const LEGAL_DOCUMENT_VERSIONS: Record<LegalDocumentId, string> = {
  terms_of_service: "2026-07-20-v0.1",
  society_campaign_terms: "2026-07-20-v0.1",
  student_campaign_terms: "2026-07-20-v0.1",
  donor_terms: "2026-07-20-v0.1",
  community_guidelines: "2026-07-20-v0.1",
  privacy: "2026-07-20-v0.1-stub",
  cookie: "2026-07-20-v0.1-stub",
  refund_dispute: "2026-07-20-v0.1-stub",
  verification: "2026-07-20-v0.1-stub",
};

export const LEGAL_REQUIRED_BY_CONTEXT: Record<
  LegalAcceptanceContext,
  LegalDocumentId[]
> = {
  signup: ["terms_of_service", "privacy", "community_guidelines"],
  create_campaign: [
    "terms_of_service",
    "society_campaign_terms",
    "student_campaign_terms",
    "community_guidelines",
  ],
  create_society: [
    "terms_of_service",
    "society_campaign_terms",
    "community_guidelines",
  ],
  donate: ["terms_of_service", "donor_terms", "refund_dispute"],
};
