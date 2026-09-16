export const STORY_FONT_FAMILY =
  "WorkSans_400Regular, Work Sans, sans-serif";

export function storyRunFontFamily(run: {
  bold: boolean;
  italic: boolean;
}): string {
  if (run.bold && run.italic) {
    return "WorkSans_700Bold_Italic, Work Sans, sans-serif";
  }
  if (run.italic) return "WorkSans_400Regular_Italic, Work Sans, sans-serif";
  if (run.bold) return "WorkSans_700Bold, Work Sans, sans-serif";
  return STORY_FONT_FAMILY;
}

export type StoryRun = {
  text: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

export type StoryMark = "bold" | "italic" | "underline";

const MARK: Record<StoryMark, string> = {
  bold: "**",
  italic: "_",
  underline: "++",
};

function clampIndex(value: number, length: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(Math.trunc(value), length));
}

function wordAt(text: string, index: number): { start: number; end: number } {
  const at = clampIndex(index, text.length);
  if (at < text.length && /\s/.test(text[at] ?? "")) {
    return { start: at, end: at };
  }
  let start = at;
  let end = at;
  while (start > 0 && !/\s/.test(text[start - 1] ?? "")) start -= 1;
  while (end < text.length && !/\s/.test(text[end] ?? "")) end += 1;
  return { start, end };
}

function peekMarker(
  s: string,
  i: number,
): { kind: StoryMark; token: string } | null {
  if (s.startsWith("**", i)) return { kind: "bold", token: "**" };
  if (s.startsWith("++", i)) return { kind: "underline", token: "++" };
  if (s[i] === "_") return { kind: "italic", token: "_" };
  return null;
}

/** Split story copy into Work Sans runs with bold / italic / underline. */
export function parseStoryRuns(
  input: string,
  marks: { bold: boolean; italic: boolean; underline: boolean } = {
    bold: false,
    italic: false,
    underline: false,
  },
): StoryRun[] {
  const parts: StoryRun[] = [];
  const flush = (text: string) => {
    if (text) parts.push({ text, ...marks });
  };

  let i = 0;
  let buf = "";
  while (i < input.length) {
    const marker = peekMarker(input, i);
    if (marker) {
      const close = input.indexOf(marker.token, i + marker.token.length);
      if (close !== -1) {
        flush(buf);
        buf = "";
        const inner = input.slice(i + marker.token.length, close);
        parts.push(
          ...parseStoryRuns(inner, { ...marks, [marker.kind]: true }),
        );
        i = close + marker.token.length;
        continue;
      }
    }
    buf += input[i] ?? "";
    i += 1;
  }
  flush(buf);
  return parts.length > 0
    ? parts
    : [{ text: input, bold: false, italic: false, underline: false }];
}

/** Flatten formatting markers to plain text. */
export function stripStoryMarkers(input: string): string {
  return parseStoryRuns(input)
    .map((run) => run.text)
    .join("");
}

function wrapMarkLines(text: string, token: string): string {
  return text
    .split("\n")
    .map((line) => (line ? `${token}${line}${token}` : ""))
    .join("\n");
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

/** Convert stored markers into HTML for the story editor. */
export function storyToEditorHtml(input: string): string {
  if (!input) return "";
  return parseStoryRuns(input)
    .map((run) => {
      const escaped = escapeStoryHtml(run.text).replace(/\n/g, "<br>");
      if (!escaped) return "";
      let html = escaped;
      if (run.bold) html = `<b>${html}</b>`;
      if (run.italic) html = `<i>${html}</i>`;
      if (run.underline) html = `<u>${html}</u>`;
      return html;
    })
    .join("");
}

/** Convert editor HTML back to stored markers. */
export function htmlToStory(html: string): string {
  let s = html.replace(/\u00a0/g, " ");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<\/(div|p)>/gi, "\n");
  s = s.replace(/<(div|p)(?:\s[^>]*)?>/gi, "");
  s = s.replace(
    /<span[^>]*style="([^"]*)"[^>]*>([\s\S]*?)<\/span>/gi,
    (_all, style: string, inner: string) => {
      let out = inner;
      if (/text-decoration:\s*underline/i.test(style)) {
        out = wrapMarkLines(out, MARK.underline);
      }
      if (/font-style:\s*italic/i.test(style)) {
        out = wrapMarkLines(out, MARK.italic);
      }
      if (/font-weight:\s*(?:bold|700)/i.test(style)) {
        out = wrapMarkLines(out, MARK.bold);
      }
      return out;
    },
  );
  for (let i = 0; i < 8; i += 1) {
    const next = s
      .replace(/<u(?:\s[^>]*)?>([\s\S]*?)<\/u>/gi, (_all, inner: string) =>
        wrapMarkLines(inner, MARK.underline),
      )
      .replace(
        /<(i|em)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi,
        (_all, _tag: string, inner: string) => wrapMarkLines(inner, MARK.italic),
      )
      .replace(
        /<(b|strong)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi,
        (_all, _tag: string, inner: string) => wrapMarkLines(inner, MARK.bold),
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
 * Wrap or unwrap a marker around the selected range. An empty selection
 * expands to the word at the cursor.
 */
export function toggleStoryMark(
  text: string,
  start: number,
  end: number,
  kind: StoryMark,
): string {
  const token = MARK[kind];
  const tokenLen = token.length;
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
  if (
    selected.startsWith(token) &&
    selected.endsWith(token) &&
    selected.length >= tokenLen * 2
  ) {
    return `${text.slice(0, lo)}${selected.slice(tokenLen, -tokenLen)}${text.slice(hi)}`;
  }
  if (
    lo >= tokenLen &&
    hi + tokenLen <= length &&
    text.slice(lo - tokenLen, lo) === token &&
    text.slice(hi, hi + tokenLen) === token
  ) {
    return `${text.slice(0, lo - tokenLen)}${selected}${text.slice(hi + tokenLen)}`;
  }
  return `${text.slice(0, lo)}${token}${selected}${token}${text.slice(hi)}`;
}
