import { describe, expect, it } from "vitest";
import {
  LEGAL_DOCUMENT_IDS as clientIds,
  LEGAL_DOCUMENT_VERSIONS as clientVersions,
  acceptanceContentHash as clientHash,
  getLiveDocumentBody,
} from "../../lib/legal/documents";
import {
  LEGAL_DOCUMENT_IDS as serverIds,
  LEGAL_DOCUMENT_VERSIONS as serverVersions,
  acceptanceContentHash as serverHash,
} from "./legalDocuments";
import { LIVE_LEGAL_MANIFEST } from "./legalArtifacts/generated";

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

  it("serves stripped live-terms bodies, not suite approval material", () => {
    expect(LIVE_LEGAL_MANIFEST.source).toBe("dono-brain/legal/live-terms");
    for (const id of clientIds) {
      const body = getLiveDocumentBody(id);
      expect(body).toBeTruthy();
      expect(body).not.toMatch(/Solicitor review outstanding/i);
      expect(body).not.toMatch(/This block is unsigned/i);
      expect(body).not.toMatch(/prepared for approval and is not approved/i);
    }
  });
});
