import { useEffect, useRef, useState, type ReactNode } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import { DonoDino, DONO_DINO_MOUTH_RATIO } from "./dono-dino";

const INK = "#211E1A";
const PAPER = "#FFF9EF";
const BORDER_WIDTH = 3;
const TYPEWRITER_KEY = "dono.hero-typewriter-seen";
const TYPEWRITER_MS = 22;

const TYPEWRITER_SEGMENTS: { text: string; bold?: boolean }[] = [
  { text: "Most alumni giving disappears into a void. Dono is built around " },
  { text: "visible", bold: true },
  { text: ", " },
  { text: "specific", bold: true },
  { text: " Oxford campaigns, so you know " },
  { text: "exactly", bold: true },
  { text: " what your money\u00A0funded." },
];

const TYPEWRITER_TOTAL = TYPEWRITER_SEGMENTS.reduce((sum, segment) => sum + segment.text.length, 0);
const TYPEWRITER_LABEL = TYPEWRITER_SEGMENTS.map((segment) => segment.text).join("");

let typewriterPlayedThisSession = false;

function hasSeenTypewriter() {
  if (typewriterPlayedThisSession) return true;
  try {
    return typeof localStorage !== "undefined" && localStorage.getItem(TYPEWRITER_KEY) === "1";
  } catch {
    return false;
  }
}

function markTypewriterSeen() {
  typewriterPlayedThisSession = true;
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(TYPEWRITER_KEY, "1");
  } catch {
    // Private mode can reject storage; the session flag still prevents a replay.
  }
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Types the speech-bubble line once, the first time this browser opens the page. */
function TypewriterCopy() {
  const [shown, setShown] = useState(() =>
    hasSeenTypewriter() || prefersReducedMotion() ? TYPEWRITER_TOTAL : 0,
  );
  const shouldAnimate = useRef(shown < TYPEWRITER_TOTAL);

  useEffect(() => {
    if (!shouldAnimate.current) return;
    let current = 0;
    let interval = 0;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        current += 1;
        setShown(current);
        if (current >= TYPEWRITER_TOTAL) {
          clearInterval(interval);
          markTypewriterSeen();
        }
      }, TYPEWRITER_MS);
    }, 400);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, []);

  let remaining = shown;
  return (
    <Text
      nativeID="hero-typewriter"
      accessibilityLabel={TYPEWRITER_LABEL}
      className="text-center font-retro-mono text-[14px] leading-7 text-retro-forest md:text-lg md:leading-8"
    >
      {TYPEWRITER_SEGMENTS.map((segment) => {
        const take = Math.min(segment.text.length, Math.max(remaining, 0));
        remaining -= take;
        const visible = segment.text.slice(0, take);
        const hidden = segment.text.slice(take);
        return (
          <Text key={segment.text} className={segment.bold ? "font-retro-mono-bold" : undefined}>
            {visible}
            {hidden ? <Text className="text-transparent">{hidden}</Text> : null}
          </Text>
        );
      })}
    </Text>
  );
}

interface BubbleTailProps {
  length: number;
  spread: number;
  direction: "right" | "down";
}

/**
 * Speech-bubble pointer. Only the two slanted edges are stroked; the open edge
 * overlaps the bubble by one border width so its fill knocks a gap in that
 * border, leaving bubble and tail reading as one continuous outline.
 */
function BubbleTail({ length, spread, direction }: BubbleTailProps) {
  const isRight = direction === "right";
  const width = isRight ? length : spread;
  const height = isRight ? spread : length;
  const d = isRight
    ? `M0 0 L${width} ${height / 2} L0 ${height}`
    : `M0 0 L${width / 2} ${height} L${width} 0`;

  return (
    <View className={isRight ? "-ml-[3px]" : "-mt-[3px]"}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Path
          d={d}
          fill={PAPER}
          stroke={INK}
          strokeWidth={BORDER_WIDTH}
          strokeLinejoin="miter"
        />
      </Svg>
    </View>
  );
}

/**
 * Brand hero: curiosity hook in the speech bubble, mascot as the speaker.
 * Bubble + tail share `.retro-hero-speech` so they read as one outline;
 * the hard shadow stays on the panel (`.retro-hero-bubble`). See global.css.
 */
export function RetroDinoHero({
  embedded = false,
  actions,
}: {
  embedded?: boolean;
  actions?: ReactNode;
}) {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const dinoHeight = embedded && !isWide ? 88 : isWide ? 168 : 112;
  const mouthDrop = dinoHeight * (1 - 2 * DONO_DINO_MOUTH_RATIO);

  const bubbleBody = (
    <View
      className={`retro-hero-bubble justify-center rounded-[20px] border-[3px] border-retro-ink bg-retro-paper ${
        embedded && !isWide ? "px-4 py-4" : "px-5 py-8 md:px-8 md:py-10"
      }`}
      style={isWide ? { flex: 1 } : undefined}
    >
      <Text className="mb-3 text-center font-retro-display text-[22px] leading-7 text-retro-ink md:text-3xl md:leading-9">
        Where did my last donation{"\u00A0"}go?
      </Text>
      <TypewriterCopy />
      {actions ? (
        <View className="mt-5 flex-row flex-wrap items-center justify-center gap-3">
          {actions}
        </View>
      ) : null}
    </View>
  );

  const dino = (
    <View className="retro-hero-dino items-center">
      <DonoDino height={dinoHeight} />
    </View>
  );

  if (!isWide) {
    return (
      <View className={embedded ? "mb-4" : "mb-10"}>
        <View className="retro-hero-speech">
          {bubbleBody}
          <View className="items-center">
            <BubbleTail direction="down" length={28} spread={40} />
          </View>
        </View>
        {dino}
      </View>
    );
  }

  return (
    <View className={embedded ? "mb-4 flex-row items-center" : "mb-10 flex-row items-center"}>
      <View className="retro-hero-speech flex-1 flex-row items-center">
        {bubbleBody}
        <BubbleTail direction="right" length={40} spread={54} />
      </View>
      <View style={{ paddingTop: mouthDrop }}>{dino}</View>
    </View>
  );
}
