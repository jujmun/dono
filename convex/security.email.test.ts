import { describe, expect, it } from "vitest";
import { normalizeAndValidateOxfordEmail } from "./security";

describe("Oxford email normalization (auth abuse keying)", () => {
  it("accepts ox.ac.uk and college subdomains", () => {
    expect(normalizeAndValidateOxfordEmail("  Student@ox.ac.uk ")).toBe(
      "student@ox.ac.uk",
    );
    expect(normalizeAndValidateOxfordEmail("a@st-annes.ox.ac.uk")).toBe(
      "a@st-annes.ox.ac.uk",
    );
  });

  it("rejects non-Oxford domains", () => {
    expect(() => normalizeAndValidateOxfordEmail("user@gmail.com")).toThrow();
    expect(() =>
      normalizeAndValidateOxfordEmail("admin@ox.ac.uk.evil.com"),
    ).toThrow();
  });

  it("rejects malformed emails", () => {
    expect(() => normalizeAndValidateOxfordEmail("not-an-email")).toThrow();
  });
});
