import { createElement, type ReactNode } from "react";
import { View, Text, Platform, useWindowDimensions } from "react-native";
import {
  ReceiptDivider,
  ReceiptLedger,
  ReceiptLineRow,
  ReceiptTotalRow,
} from "@/components/ui/receipt-lines";
import type { ReceiptLine } from "@/lib/receipt";
import { cn } from "@/lib/utils";
import { RetroPanel, type RetroPanelAccent } from "./retro-panel";

const WIDE_BREAKPOINT = 820;

interface StoryWithCostBreakdownProps {
  story: string;
  goalLines: ReceiptLine[];
  goal: number;
  /** Accent for the outer Why? panel. */
  accent?: RetroPanelAccent;
  className?: string;
}

function CostCard({
  goalLines,
  goal,
}: {
  goalLines: ReceiptLine[];
  goal: number;
}) {
  const hasCostBreakdown = goalLines.length > 0;

  return (
    <RetroPanel
      title={hasCostBreakdown ? "Cost breakdown" : "Funding goal"}
      accent="sky"
      className="mb-0"
      bodyClassName="px-3.5 py-3"
    >
      <ReceiptLedger>
        {goalLines.map((line) => (
          <ReceiptLineRow key={line.label} {...line} />
        ))}
        {hasCostBreakdown ? <ReceiptDivider /> : null}
        <ReceiptTotalRow label="Total goal" amount={goal} />
      </ReceiptLedger>
    </RetroPanel>
  );
}

/**
 * Drop a leftover "Description" heading that some campaign stories still
 * carry from older form copy — it should not appear under Why?.
 */
function stripLeadingDescriptionLabel(story: string): string {
  return story
    .replace(/^\s*Description\s*(?:\r?\n)+/i, "")
    .replace(/^\s*Description\s+/i, "")
    .replace(/^Description(?=[A-Z])/i, "")
    .trimStart();
}

/**
 * Collapse soft line wraps so prose fills the column beside a CSS float.
 * Blank lines still start a new paragraph. Standalone section-title lines
 * (short, no sentence punctuation) also become their own paragraphs so they
 * don't glue onto the next sentence.
 */
function storyToParagraphs(story: string): string[] {
  const cleaned = stripLeadingDescriptionLabel(story);
  const lines = cleaned.replace(/\r\n/g, "\n").split("\n");
  const paragraphs: string[] = [];
  let buffer = "";

  const flush = () => {
    const trimmed = buffer.replace(/\s+/g, " ").trim();
    if (trimmed) paragraphs.push(trimmed);
    buffer = "";
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flush();
      continue;
    }
    // Short title-like lines (e.g. "What your donation will support") break.
    const looksLikeHeading =
      line.length <= 60 &&
      !/[.!?]$/.test(line) &&
      /^[A-Z0-9]/.test(line) &&
      line.split(/\s+/).length <= 8;
    if (looksLikeHeading && buffer) {
      flush();
      paragraphs.push(line);
      continue;
    }
    if (looksLikeHeading && !buffer) {
      paragraphs.push(line);
      continue;
    }
    buffer = buffer ? `${buffer} ${line}` : line;
  }
  flush();

  // Never show a bare "Description" paragraph if one slipped through.
  return paragraphs.filter((p) => !/^description$/i.test(p));
}

const storyParagraphStyle = {
  margin: 0,
  fontFamily: "Fredoka, Fredoka_500Medium, sans-serif",
  fontSize: 18,
  lineHeight: "24px",
  color: "#211E1A",
} as const;

/** Web-only: CSS float so story paragraphs wrap around the cost card. */
function WebFloatBody({
  story,
  cost,
}: {
  story: string;
  cost: ReactNode;
}) {
  const paragraphs = storyToParagraphs(story);

  return createElement(
    "div",
    {
      style: {
        display: "block",
        overflow: "auto",
        width: "100%",
      },
    },
    createElement(
      "div",
      {
        style: {
          float: "right",
          width: "min(300px, 38%)",
          maxWidth: 320,
          marginLeft: 24,
          marginBottom: 12,
        },
      },
      cost,
    ),
    ...paragraphs.map((paragraph, index) =>
      createElement(
        "p",
        {
          key: `story-p-${index}`,
          style: {
            ...storyParagraphStyle,
            marginBottom: index === paragraphs.length - 1 ? 0 : 14,
          },
        },
        paragraph,
      ),
    ),
  );
}

/**
 * Single Why? panel with Cost breakdown nested upper-right.
 * Wide web: cost floats so story text wraps beside/under it.
 * Native + narrow: story stacked above a full-width cost card.
 */
export function StoryWithCostBreakdown({
  story,
  goalLines,
  goal,
  accent = "marigold",
  className,
}: StoryWithCostBreakdownProps) {
  const { width } = useWindowDimensions();
  const useFloat = Platform.OS === "web" && width >= WIDE_BREAKPOINT;
  const displayStory = stripLeadingDescriptionLabel(story);

  const cost = (
    <CostCard goalLines={goalLines} goal={goal} />
  );

  return (
    <RetroPanel title="Why?" accent={accent} className={cn("mb-0", className)}>
      {useFloat ? (
        <WebFloatBody story={displayStory} cost={cost} />
      ) : (
        <View className="gap-4">
          <Text className="text-[18px] leading-6 text-retro-ink">
            {displayStory}
          </Text>
          {cost}
        </View>
      )}
    </RetroPanel>
  );
}
