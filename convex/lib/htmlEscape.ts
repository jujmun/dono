/** Escapes text for safe interpolation into HTML attribute values and text
 * nodes alike — the OG meta builder only ever uses double-quoted attributes,
 * so escaping both `"` and `<`/`>`/`&` covers every injection point. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Trims to at most maxLength characters, backing up to the last word
 * boundary so scrapers don't render a description mid-word. */
export function trimToWordBoundary(value: string, maxLength: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;

  const cut = trimmed.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  const boundary = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return `${boundary.trimEnd()}…`;
}
