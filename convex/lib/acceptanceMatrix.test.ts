/**
 * CH-10 / matrix tests for acceptance document sets and fail-closed registry.
 */
import { describe, expect, it } from "vitest";
import {
  LEGAL_ACCEPT_BY_EVENT,
  LEGAL_ACCEPT_EVENT_C_GUEST,
  LEGAL_REQUIRED_BY_CONTEXT,
  assertRegistryDocuments,
  resolveLiveDocument,
} from "./legalDocuments";

describe("Acceptance Matrix document sets (CH-00)", () => {
  it("Event A accepts ToS + Community Guidelines; acknowledges Privacy", () => {
    expect(LEGAL_ACCEPT_BY_EVENT.A.accept).toEqual([
      "terms_of_service",
      "community_guidelines",
    ]);
    expect(LEGAL_ACCEPT_BY_EVENT.A.acknowledge).toContain("privacy");
    expect(LEGAL_REQUIRED_BY_CONTEXT.signup).toEqual(
      LEGAL_ACCEPT_BY_EVENT.A.accept,
    );
  });

  it("Event B accepts Society Campaign Terms + Refund Policy", () => {
    expect(LEGAL_ACCEPT_BY_EVENT.B.accept).toEqual([
      "society_campaign_terms",
      "refund_dispute",
    ]);
  });

  it("Event C guest also accepts ToS", () => {
    expect(LEGAL_ACCEPT_EVENT_C_GUEST).toEqual([
      "donor_terms",
      "refund_dispute",
      "terms_of_service",
    ]);
    expect(LEGAL_REQUIRED_BY_CONTEXT.donate_guest).toEqual(
      LEGAL_ACCEPT_EVENT_C_GUEST,
    );
  });

  it("never requires student_campaign_terms (CR-00)", () => {
    const all = [
      ...LEGAL_REQUIRED_BY_CONTEXT.signup,
      ...LEGAL_REQUIRED_BY_CONTEXT.create_society,
      ...LEGAL_REQUIRED_BY_CONTEXT.donate,
      ...LEGAL_REQUIRED_BY_CONTEXT.donate_guest,
    ];
    expect(all.includes("student_campaign_terms" as never)).toBe(false);
  });
});

describe("Fail-closed registry (CH-18)", () => {
  it("resolves every Matrix-required document", () => {
    const docs = assertRegistryDocuments([
      ...LEGAL_ACCEPT_BY_EVENT.A.accept,
      ...LEGAL_ACCEPT_BY_EVENT.B.accept,
      ...LEGAL_ACCEPT_EVENT_C_GUEST,
      "privacy",
      "cookie",
      "verification",
      "complaints",
    ]);
    expect(docs.length).toBeGreaterThan(0);
    for (const doc of docs) {
      expect(doc.htmlHash.length).toBe(64);
      expect(doc.version).toBe("3.0");
    }
  });

  it("returns null for unknown or excluded documents", () => {
    expect(resolveLiveDocument("student_campaign_terms")).toBeNull();
    expect(resolveLiveDocument("terms_of_service", "9.9")).toBeNull();
  });
});
