import { describe, expect, it } from "vitest";
import { clampLimit } from "./pagination";

describe("clampLimit", () => {
  it("uses the default when limit is missing", () => {
    expect(clampLimit(undefined, 3)).toBe(3);
  });

  it("caps oversized client limits", () => {
    expect(clampLimit(10_000, 3)).toBe(50);
    expect(clampLimit(100, 3, 25)).toBe(25);
  });

  it("rejects non-positive and non-finite values", () => {
    expect(clampLimit(0, 3)).toBe(3);
    expect(clampLimit(-5, 3)).toBe(3);
    expect(clampLimit(Number.NaN, 3)).toBe(3);
  });

  it("floors fractional limits", () => {
    expect(clampLimit(4.9, 3)).toBe(4);
  });
});
