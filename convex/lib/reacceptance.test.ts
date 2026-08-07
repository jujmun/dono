/**
 * CH-10: material document version changes require re-acceptance.
 * hasAcceptedVersion compares stored version+hash to the live registry.
 */
import { describe, expect, it } from "vitest";
import {
  LEGAL_DOCUMENT_VERSIONS,
  acceptanceContentHash,
  requiredAcceptDocsForContext,
} from "./legalDocuments";

describe("re-acceptance gating inputs (CH-10)", () => {
  it("every required doc has a live version and hash", () => {
    for (const context of [
      "signup",
      "create_society",
      "donate",
      "donate_guest",
    ] as const) {
      for (const id of requiredAcceptDocsForContext(context)) {
        expect(LEGAL_DOCUMENT_VERSIONS[id]).toBe("3.0");
        expect(acceptanceContentHash(id)).toMatch(/^[a-f0-9]{64}$/);
      }
    }
  });
});
