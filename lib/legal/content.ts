/**
 * @deprecated Prefer getLiveDocumentBody from the fail-closed registry.
 * Kept so any stray imports resolve to live v3.0 bodies rather than stubs.
 */
import {
  getLiveDocumentBody,
  LEGAL_DOCUMENT_IDS,
  type LegalDocumentId,
} from "./documents";

export function getLegalDocumentBody(docId: LegalDocumentId): string {
  const body = getLiveDocumentBody(docId);
  if (body == null) {
    throw new Error(
      `LEGAL_REGISTRY_UNAVAILABLE: document "${docId}" is not in the live registry.`,
    );
  }
  return body;
}

export function listLegalDocumentBodies(): Record<LegalDocumentId, string> {
  const out = {} as Record<LegalDocumentId, string>;
  for (const id of LEGAL_DOCUMENT_IDS) {
    out[id] = getLegalDocumentBody(id);
  }
  return out;
}
