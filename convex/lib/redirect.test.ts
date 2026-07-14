import { describe, expect, it } from "vitest";
import { sanitizeRedirectTo } from "./redirect";

describe("sanitizeRedirectTo", () => {
  it("allows relative app paths", () => {
    expect(sanitizeRedirectTo("/dashboard")).toBe("/dashboard");
    expect(sanitizeRedirectTo("/verify-email?email=a%40ox.ac.uk")).toBe(
      "/verify-email?email=a%40ox.ac.uk",
    );
  });

  it("rejects open redirects to external hosts", () => {
    expect(sanitizeRedirectTo("https://evil.example/phish")).toBe("/");
    expect(sanitizeRedirectTo("//evil.example/phish")).toBe("/");
    expect(sanitizeRedirectTo("https://evil.example")).toBe("/");
  });

  it("rejects protocol-relative and non-http schemes", () => {
    expect(sanitizeRedirectTo("javascript:alert(1)")).toBe("/");
    expect(sanitizeRedirectTo("dono://stripe-redirect")).toBe("/");
  });

  it("falls back for empty or missing values", () => {
    expect(sanitizeRedirectTo(undefined)).toBe("/");
    expect(sanitizeRedirectTo(null)).toBe("/");
    expect(sanitizeRedirectTo("")).toBe("/");
  });
});
