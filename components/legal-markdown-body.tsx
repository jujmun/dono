import { Text, View } from "react-native";

type InlinePart =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "italic"; value: string }
  | { type: "code"; value: string };

type Block =
  | { type: "h1" | "h2" | "h3" | "h4"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "hr" }
  | { type: "meta"; rows: { label: string; value: string }[] };

function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ type: "text", value: text.slice(last, match.index) });
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push({ type: "bold", value: token.slice(2, -2) });
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push({ type: "code", value: token.slice(1, -1) });
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push({ type: "italic", value: token.slice(1, -1) });
    } else {
      parts.push({ type: "text", value: token });
    }
    last = match.index + token.length;
  }
  if (last < text.length) {
    parts.push({ type: "text", value: text.slice(last) });
  }
  return parts.length > 0 ? parts : [{ type: "text", value: text }];
}

function InlineText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = parseInline(text);
  return (
    <Text className={className}>
      {parts.map((part, i) => {
        if (part.type === "bold") {
          return (
            <Text key={i} className="font-retro-bold text-retro-ink">
              {part.value}
            </Text>
          );
        }
        if (part.type === "italic") {
          return (
            <Text key={i} className="italic text-retro-ink">
              {part.value}
            </Text>
          );
        }
        if (part.type === "code") {
          return (
            <Text
              key={i}
              className="font-retro-mono text-[12.5px] text-dono-primary"
            >
              {part.value}
            </Text>
          );
        }
        return <Text key={i}>{part.value}</Text>;
      })}
    </Text>
  );
}

function isMetaLine(line: string): boolean {
  return /^\*\*[^*]+:\*\*\s+/.test(line.trim());
}

function parseMetaLine(line: string): { label: string; value: string } | null {
  const match = line.trim().match(/^\*\*([^*]+):\*\*\s+(.*)$/);
  if (!match) return null;
  return { label: match[1], value: match[2] };
}

function parseMarkdownBlocks(source: string, skipTitle?: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  let skippedTitle = false;

  // Pull leading metadata (**Label:** value) into one card.
  const metaRows: { label: string; value: string }[] = [];
  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (trimmed === "" || trimmed === "---") {
      i += 1;
      continue;
    }
    if (/^#\s+/.test(trimmed) && !skippedTitle) {
      const title = trimmed.replace(/^#\s+/, "").trim();
      if (
        !skipTitle ||
        title.toLowerCase() === skipTitle.toLowerCase() ||
        title.toLowerCase().includes(skipTitle.toLowerCase())
      ) {
        skippedTitle = true;
        i += 1;
        continue;
      }
    }
    if (isMetaLine(trimmed)) {
      const row = parseMetaLine(trimmed);
      if (row) metaRows.push(row);
      i += 1;
      continue;
    }
    break;
  }
  if (metaRows.length > 0) {
    blocks.push({ type: "meta", rows: metaRows });
  }

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (trimmed === "") {
      i += 1;
      continue;
    }

    if (trimmed === "---") {
      blocks.push({ type: "hr" });
      i += 1;
      continue;
    }

    const heading = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].trim();
      if (
        level === 1 &&
        !skippedTitle &&
        skipTitle &&
        text.toLowerCase().includes(skipTitle.toLowerCase())
      ) {
        skippedTitle = true;
        i += 1;
        continue;
      }
      const type =
        level === 1 ? "h1" : level === 2 ? "h2" : level === 3 ? "h3" : "h4";
      blocks.push({ type, text });
      i += 1;
      continue;
    }

    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ type: "quote", text: quoteLines.join(" ") });
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    const para: string[] = [trimmed];
    i += 1;
    while (i < lines.length) {
      const next = lines[i].trim();
      if (
        next === "" ||
        next === "---" ||
        /^#{1,4}\s+/.test(next) ||
        next.startsWith("> ") ||
        /^[-*]\s+/.test(next) ||
        /^\d+\.\s+/.test(next)
      ) {
        break;
      }
      para.push(next);
      i += 1;
    }
    blocks.push({ type: "p", text: para.join(" ") });
  }

  return blocks;
}

type LegalMarkdownBodyProps = {
  source: string;
  /** Panel already shows this title — skip duplicate H1 when it matches. */
  documentTitle?: string;
  className?: string;
};

/**
 * Renders legal Markdown as NativeWind typography that matches the retro site.
 * Does not mutate hashed source files — formatting is display-only.
 */
export function LegalMarkdownBody({
  source,
  documentTitle,
  className,
}: LegalMarkdownBodyProps) {
  const blocks = parseMarkdownBlocks(source, documentTitle);

  return (
    <View className={`gap-4 ${className ?? ""}`}>
      {blocks.map((block, index) => {
        if (block.type === "meta") {
          return (
            <View
              key={index}
              className="rounded-xl border border-dono-border bg-dono-bg px-4 py-3"
            >
              {block.rows.map((row) => (
                <View key={row.label} className="mb-2 last:mb-0">
                  <Text className="text-[11px] font-retro-bold uppercase tracking-wide text-dono-muted">
                    {row.label}
                  </Text>
                  <InlineText
                    text={row.value}
                    className="mt-0.5 text-sm leading-5 text-retro-ink"
                  />
                </View>
              ))}
            </View>
          );
        }

        if (block.type === "hr") {
          return (
            <View
              key={index}
              className="my-1 border-t border-dashed border-dono-border"
            />
          );
        }

        if (block.type === "h1") {
          return (
            <InlineText
              key={index}
              text={block.text}
              className="font-retro-bold text-2xl leading-8 text-retro-ink"
            />
          );
        }

        if (block.type === "h2") {
          return (
            <InlineText
              key={index}
              text={block.text}
              className="mt-2 font-retro-bold text-xl leading-7 text-retro-ink"
            />
          );
        }

        if (block.type === "h3") {
          return (
            <InlineText
              key={index}
              text={block.text}
              className="mt-1 font-retro-bold text-lg leading-6 text-retro-ink"
            />
          );
        }

        if (block.type === "h4") {
          return (
            <InlineText
              key={index}
              text={block.text}
              className="font-retro-bold text-base leading-6 text-retro-ink"
            />
          );
        }

        if (block.type === "quote") {
          return (
            <View
              key={index}
              className="border-l-4 border-dono-primary bg-dono-bg px-4 py-3"
            >
              <InlineText
                text={block.text}
                className="text-sm leading-6 text-[#4a453c]"
              />
            </View>
          );
        }

        if (block.type === "ul") {
          return (
            <View key={index} className="gap-2 pl-1">
              {block.items.map((item, itemIndex) => (
                <View key={itemIndex} className="flex-row gap-2">
                  <Text className="mt-0.5 text-sm text-dono-primary">•</Text>
                  <InlineText
                    text={item}
                    className="min-w-0 flex-1 text-sm leading-6 text-retro-ink"
                  />
                </View>
              ))}
            </View>
          );
        }

        if (block.type === "ol") {
          return (
            <View key={index} className="gap-2 pl-1">
              {block.items.map((item, itemIndex) => (
                <View key={itemIndex} className="flex-row gap-2">
                  <Text className="mt-0.5 w-5 font-retro-mono text-sm text-dono-muted">
                    {itemIndex + 1}.
                  </Text>
                  <InlineText
                    text={item}
                    className="min-w-0 flex-1 text-sm leading-6 text-retro-ink"
                  />
                </View>
              ))}
            </View>
          );
        }

        return (
          <InlineText
            key={index}
            text={block.text}
            className="text-sm leading-6 text-retro-ink"
          />
        );
      })}
    </View>
  );
}
