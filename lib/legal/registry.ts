/**
 * Fail-closed live legal document registry (CH-18).
 * Source of truth: dono-brain/legal/live-terms (synced into artifacts/generated).
 */
import {
  LIVE_LEGAL_BODIES,
  LIVE_LEGAL_MANIFEST,
  LIVE_LEGAL_VERSION,
} from "./artifacts/generated";

export const LEGAL_SUITE_VERSION = LIVE_LEGAL_VERSION;

/** Operative beta documents — Student Campaign Terms intentionally absent (CR-00). */
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

/** Product contexts mapped to Acceptance Matrix events. */
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
  htmlPath: string;
  pdfPath: string;
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
    htmlPath: entry.htmlPath,
    pdfPath: entry.pdfPath,
  };
}

/** Fail closed: throws if any required document is missing or incomplete. */
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

export function getLiveDocumentBody(docId: string, version?: string): string | null {
  const doc = resolveLiveDocument(docId, version);
  if (!doc) return null;
  const body = LIVE_LEGAL_BODIES[docId];
  return body ?? null;
}

/** Current live document — always the operative wording. */
export function legalCurrentHref(docId: LegalDocumentId): `/legal/${string}` {
  return `/legal/${docId}`;
}

/** Immutable version address for receipts / acceptance history. */
export function legalVersionedHref(
  docId: LegalDocumentId,
  version: string = LIVE_LEGAL_VERSION,
): `/legal/${string}` {
  return `/legal/${docId}/${version}`;
}

/** Everyday in-product links point at the live (changing) document. */
export function legalHref(docId: LegalDocumentId): `/legal/${string}` {
  return legalCurrentHref(docId);
}

export const LEGAL_DOCUMENT_TITLES: Record<LegalDocumentId, string> = Object.fromEntries(
  LEGAL_DOCUMENT_IDS.map((id) => {
    const doc = resolveLiveDocument(id);
    return [id, doc?.title ?? id];
  }),
) as Record<LegalDocumentId, string>;

export const LEGAL_DOCUMENT_VERSIONS: Record<LegalDocumentId, string> = Object.fromEntries(
  LEGAL_DOCUMENT_IDS.map((id) => [id, LIVE_LEGAL_VERSION]),
) as Record<LegalDocumentId, string>;

/** Content hash stored on acceptance records = HTML artifact hash users effectively see. */
export function acceptanceContentHash(docId: LegalDocumentId): string {
  const doc = resolveLiveDocument(docId);
  if (!doc) {
    throw new Error(`LEGAL_REGISTRY_UNAVAILABLE: ${docId}`);
  }
  return doc.htmlHash;
}

/**
 * Matrix-required documents by event.
 * Privacy is acknowledged (linked) at A/B/C but not in accept-lists where noted.
 */
export const LEGAL_ACCEPT_BY_EVENT: Record<
  LegalAcceptanceEvent,
  {
    accept: LegalDocumentId[];
    acknowledge: LegalDocumentId[];
  }
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

/** Guest Event C also accepts ToS (never accepted at A). */
export const LEGAL_ACCEPT_EVENT_C_GUEST: LegalDocumentId[] = [
  "donor_terms",
  "refund_dispute",
  "terms_of_service",
];

export const CONTEXT_TO_EVENT: Record<LegalAcceptanceContext, LegalAcceptanceEvent> = {
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

/** @deprecated Use requiredAcceptDocsForContext — kept for gradual migration. */
export const LEGAL_REQUIRED_BY_CONTEXT: Record<
  LegalAcceptanceContext,
  LegalDocumentId[]
> = {
  signup: requiredAcceptDocsForContext("signup"),
  create_society: requiredAcceptDocsForContext("create_society"),
  donate: requiredAcceptDocsForContext("donate"),
  donate_guest: requiredAcceptDocsForContext("donate_guest"),
};

export function listRegistryDocuments(): RegistryDocument[] {
  return LEGAL_DOCUMENT_IDS.map((id) => {
    const doc = resolveLiveDocument(id);
    if (!doc) {
      throw new Error(`LEGAL_REGISTRY_UNAVAILABLE: ${id}`);
    }
    return doc;
  });
}
