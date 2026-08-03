import { describe, expect, it } from "vitest";
import {
  normalizeAndValidateEmail,
  normalizeAndValidateOxfordEmail,
} from "./security";

describe("Oxford email normalization (auth abuse keying)", () => {
  it("accepts ox.ac.uk and college subdomains", () => {
    expect(normalizeAndValidateOxfordEmail("  Student@ox.ac.uk ")).toBe(
      "student@ox.ac.uk",
    );
    expect(normalizeAndValidateOxfordEmail("a@st-annes.ox.ac.uk")).toBe(
      "a@st-annes.ox.ac.uk",
    );
  });

  it("rejects non-Oxford domains for Oxford-only helper", () => {
    expect(() => normalizeAndValidateOxfordEmail("user@gmail.com")).toThrow();
    expect(() =>
      normalizeAndValidateOxfordEmail("admin@ox.ac.uk.evil.com"),
    ).toThrow();
  });

  it("accepts allowlisted outreach admin emails (Oxford domain bypass)", () => {
    expect(normalizeAndValidateOxfordEmail("juyeon27312@gmail.com")).toBe(
      "juyeon27312@gmail.com",
    );
    expect(normalizeAndValidateOxfordEmail("joindono.team@gmail.com")).toBe(
      "joindono.team@gmail.com",
    );
  });

  it("rejects malformed emails", () => {
    expect(() => normalizeAndValidateOxfordEmail("not-an-email")).toThrow();
    expect(() => normalizeAndValidateEmail("not-an-email")).toThrow();
  });
});

describe("any-email normalization (alumni / sign-in)", () => {
  it("accepts personal email addresses", () => {
    expect(normalizeAndValidateEmail("  Alumni@Gmail.com ")).toBe(
      "alumni@gmail.com",
    );
  });
});
