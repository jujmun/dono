import { describe, expect, it } from "vitest";

function parseMetaLine(line: string): { label: string; value: string } | null {
  const match = line.trim().match(/^\*\*([^*]+):\*\*\s+(.*)$/);
  if (!match) return null;
  return { label: match[1], value: match[2] };
}

describe("legal markdown display helpers", () => {
  it("parses document metadata lines", () => {
    expect(parseMetaLine("**Version:** 3.0")).toEqual({
      label: "Version",
      value: "3.0",
    });
    expect(parseMetaLine("**Document type:** Notice — information")).toEqual({
      label: "Document type",
      value: "Notice — information",
    });
  });
});
