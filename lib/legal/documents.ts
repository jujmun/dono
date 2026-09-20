/**
 * Client legal document API — re-exports the fail-closed live registry (CH-13/18).
 * Student Campaign Terms are not operative in beta (CR-00).
 */
export {
  LEGAL_DOCUMENT_IDS,
  LEGAL_DOCUMENT_TITLES,
  LEGAL_DOCUMENT_VERSIONS,
  LEGAL_REQUIRED_BY_CONTEXT,
  LEGAL_ACCEPT_BY_EVENT,
  LEGAL_ACCEPT_EVENT_C_GUEST,
  LEGAL_SUITE_VERSION,
  type LegalDocumentId,
  type LegalAcceptanceContext,
  type LegalAcceptanceEvent,
  legalHref,
  legalCurrentHref,
  legalVersionedHref,
  resolveLiveDocument,
  getLiveDocumentBody,
  assertRegistryDocuments,
  requiredAcceptDocsForContext,
  acceptanceContentHash,
  listRegistryDocuments,
} from "./registry";
