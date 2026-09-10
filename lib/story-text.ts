export type StoryTextPart = {
  text: string;
  bold: boolean;
};

const BOLD_PATTERN = /\*\*([^*]+)\*\*/g;

function clampIndex(value: number, length: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(Math.trunc(value), length));
}

function wordAt(text: string, index: number): { start: number; end: number } {
  const at = clampIndex(index, text.length);
  // Cursor on a space is not "inside" a word — don't grab the letters beside it.
  if (at < text.length && /\s/.test(text[at] ?? "")) {
    return { start: at, end: at };
  }
  let start = at;
  let end = at;
  while (start > 0 && !/\s/.test(text[start - 1] ?? "")) start -= 1;
  while (end < text.length && !/\s/.test(text[end] ?? "")) end += 1;
  return { start, end };
}

/** Split story copy into plain and **bold** segments. Unmatched markers stay literal. */
export function parseStoryBold(input: string): StoryTextPart[] {
  const parts: StoryTextPart[] = [];
  const pattern = new RegExp(BOLD_PATTERN.source, "g");
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(input)) !== null) {
    if (match.index > last) {
      parts.push({ text: input.slice(last, match.index), bold: false });
    }
    parts.push({ text: match[1] ?? "", bold: true });
    last = match.index + match[0].length;
  }
  if (last < input.length) {
    parts.push({ text: input.slice(last), bold: false });
  }
  return parts.length > 0 ? parts : [{ text: input, bold: false }];
}

export function storyHasBold(input: string): boolean {
  return /\*\*[^*]+\*\*/.test(input);
}

function escapeStoryHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function decodeStoryEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function wrapBoldLines(text: string): string {
  return text
    .split("\n")
    .map((line) => {
      const plain = line.replace(/\*\*/g, "");
      return plain ? `**${plain}**` : "";
    })
    .join("\n");
}

/** Convert stored `**bold**` story text into HTML for the inline editor. */
export function storyToEditorHtml(input: string): string {
  if (!input) return "";
  return parseStoryBold(input)
    .map((part) => {
      const escaped = escapeStoryHtml(part.text).replace(/\n/g, "<br>");
      return part.bold ? `<strong>${escaped}</strong>` : escaped;
    })
    .join("");
}

/** Convert editor HTML back to stored `**bold**` story text. */
export function htmlToStory(html: string): string {
  let s = html.replace(/\u00a0/g, " ");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<\/(div|p)>/gi, "\n");
  s = s.replace(/<(div|p)(?:\s[^>]*)?>/gi, "");
  s = s.replace(
    /<span[^>]*style="[^"]*font-weight:\s*(?:bold|700)[^"]*"[^>]*>([\s\S]*?)<\/span>/gi,
    (_all, inner: string) => wrapBoldLines(inner),
  );
  for (let i = 0; i < 8; i += 1) {
    const next = s.replace(
      /<(strong|b)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi,
      (_all, _tag: string, inner: string) => wrapBoldLines(inner),
    );
    if (next === s) break;
    s = next;
  }
  s = s.replace(/<[^>]+>/g, "");
  s = decodeStoryEntities(s);
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.endsWith("\n") ? s.slice(0, -1) : s;
}

/**
 * Wrap or unwrap `**` around the selected range. An empty selection expands to
 * the word at the cursor. Returns the original string when there is nothing
 * to wrap.
 */
export function toggleStoryBold(
  text: string,
  start: number,
  end: number,
): string {
  const length = text.length;
  let lo = Math.min(clampIndex(start, length), clampIndex(end, length));
  let hi = Math.max(clampIndex(start, length), clampIndex(end, length));

  if (lo === hi) {
    const word = wordAt(text, lo);
    lo = word.start;
    hi = word.end;
  }
  if (lo === hi) return text;

  const selected = text.slice(lo, hi);
  if (selected.startsWith("**") && selected.endsWith("**") && selected.length >= 4) {
    return `${text.slice(0, lo)}${selected.slice(2, -2)}${text.slice(hi)}`;
  }
  if (
    lo >= 2 &&
    hi + 2 <= length &&
    text.slice(lo - 2, lo) === "**" &&
    text.slice(hi, hi + 2) === "**"
  ) {
    return `${text.slice(0, lo - 2)}${selected}${text.slice(hi + 2)}`;
  }
  return `${text.slice(0, lo)}**${selected}**${text.slice(hi)}`;
}
