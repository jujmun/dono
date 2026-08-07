/**
 * Convex-safe legal registry — must stay byte-identical to lib/legal/registry
 * for IDs, versions, and hashes (CH-13). Bodies live in legalArtifacts/generated.
 */
import {
  LIVE_LEGAL_MANIFEST,
  LIVE_LEGAL_VERSION,
} from "./legalArtifacts/generated";

export const LEGAL_SUITE_VERSION = LIVE_LEGAL_VERSION;

export const LEGAL_DOCUMENT_IDS = [
  "terms_of_service",
  "society_campaign_terms",
  "donor_terms",
  "community_guidelines",
  "privacy",
  "cookie",
  "refund_dispute",
  "verification",
  "complaints",
] as const;

export type LegalDocumentId = (typeof LEGAL_DOCUMENT_IDS)[number];

export type LegalAcceptanceEvent = "A" | "B" | "C";

export type LegalAcceptanceContext =
  | "signup"
  | "create_society"
  | "donate"
  | "donate_guest";

export type RegistryDocument = {
  id: LegalDocumentId;
  title: string;
  version: string;
  sourceHash: string;
  htmlHash: string;
  pdfHash: string;
};

function isDocumentId(value: string): value is LegalDocumentId {
  return (LEGAL_DOCUMENT_IDS as readonly string[]).includes(value);
}

export function resolveLiveDocument(
  docId: string,
  version?: string,
): RegistryDocument | null {
  if (!isDocumentId(docId)) return null;
  const entry = LIVE_LEGAL_MANIFEST.documents[docId];
  if (!entry) return null;
  const resolvedVersion = version ?? LIVE_LEGAL_VERSION;
  if (entry.version !== resolvedVersion) return null;
  if (!entry.sourceHash || !entry.htmlHash || !entry.pdfHash) return null;
  return {
    id: docId,
    title: entry.title,
    version: entry.version,
    sourceHash: entry.sourceHash,
    htmlHash: entry.htmlHash,
    pdfHash: entry.pdfHash,
  };
}

export function assertRegistryDocuments(docIds: LegalDocumentId[]): RegistryDocument[] {
  const resolved: RegistryDocument[] = [];
  for (const id of docIds) {
    const doc = resolveLiveDocument(id);
    if (!doc) {
      throw new Error(
        `LEGAL_REGISTRY_UNAVAILABLE: required document "${id}" v${LIVE_LEGAL_VERSION} is missing or hash-incomplete.`,
      );
    }
    resolved.push(doc);
  }
  return resolved;
}

export const LEGAL_DOCUMENT_VERSIONS: Record<LegalDocumentId, string> =
  Object.fromEntries(
    LEGAL_DOCUMENT_IDS.map((id) => [id, LIVE_LEGAL_VERSION]),
  ) as Record<LegalDocumentId, string>;

export const LEGAL_DOCUMENT_TITLES: Record<LegalDocumentId, string> =
  Object.fromEntries(
    LEGAL_DOCUMENT_IDS.map((id) => {
      const doc = resolveLiveDocument(id);
      return [id, doc?.title ?? id];
    }),
  ) as Record<LegalDocumentId, string>;

export function acceptanceContentHash(docId: LegalDocumentId): string {
  const doc = resolveLiveDocument(docId);
  if (!doc) throw new Error(`LEGAL_REGISTRY_UNAVAILABLE: ${docId}`);
  return doc.htmlHash;
}

export const LEGAL_ACCEPT_BY_EVENT: Record<
  LegalAcceptanceEvent,
  { accept: LegalDocumentId[]; acknowledge: LegalDocumentId[] }
> = {
  A: {
    accept: ["terms_of_service", "community_guidelines"],
    acknowledge: ["privacy"],
  },
  B: {
    accept: ["society_campaign_terms", "refund_dispute"],
    acknowledge: ["privacy", "verification"],
  },
  C: {
    accept: ["donor_terms", "refund_dispute"],
    acknowledge: ["privacy"],
  },
};

export const LEGAL_ACCEPT_EVENT_C_GUEST: LegalDocumentId[] = [
  "donor_terms",
  "refund_dispute",
  "terms_of_service",
];

export const CONTEXT_TO_EVENT: Record<
  LegalAcceptanceContext,
  LegalAcceptanceEvent
> = {
  signup: "A",
  create_society: "B",
  donate: "C",
  donate_guest: "C",
};

export function requiredAcceptDocsForContext(
  context: LegalAcceptanceContext,
): LegalDocumentId[] {
  if (context === "donate_guest") return LEGAL_ACCEPT_EVENT_C_GUEST;
  return LEGAL_ACCEPT_BY_EVENT[CONTEXT_TO_EVENT[context]].accept;
}

export const LEGAL_REQUIRED_BY_CONTEXT: Record<
  LegalAcceptanceContext,
  LegalDocumentId[]
> = {
  signup: requiredAcceptDocsForContext("signup"),
  create_society: requiredAcceptDocsForContext("create_society"),
  donate: requiredAcceptDocsForContext("donate"),
  donate_guest: requiredAcceptDocsForContext("donate_guest"),
};
