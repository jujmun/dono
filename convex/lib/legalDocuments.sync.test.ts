import { describe, expect, it } from "vitest";
import {
  LEGAL_DOCUMENT_IDS as clientIds,
  LEGAL_DOCUMENT_VERSIONS as clientVersions,
  acceptanceContentHash as clientHash,
} from "../../lib/legal/documents";
import {
  LEGAL_DOCUMENT_IDS as serverIds,
  LEGAL_DOCUMENT_VERSIONS as serverVersions,
  acceptanceContentHash as serverHash,
} from "./legalDocuments";

describe("CH-13 legal registry sync", () => {
  it("client and convex document IDs match", () => {
    expect([...clientIds]).toEqual([...serverIds]);
  });

  it("client and convex versions and hashes match for every doc", () => {
    for (const id of clientIds) {
      expect(clientVersions[id]).toBe(serverVersions[id]);
      expect(clientHash(id)).toBe(serverHash(id));
    }
  });

  it("does not include student_campaign_terms (CR-00)", () => {
    expect((clientIds as readonly string[]).includes("student_campaign_terms")).toBe(
      false,
    );
  });
});
