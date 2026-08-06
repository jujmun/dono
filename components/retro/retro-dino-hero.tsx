import { View, Text, useWindowDimensions } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInRight } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { DonoDino, DONO_DINO_MOUTH_RATIO } from "./dono-dino";

const INK = "#211E1A";
const PAPER = "#FFF9EF";
const BORDER_WIDTH = 3;

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
 * Bubble + tail share `.retro-hero-speech` so they lift together on hover;
 * the hard shadow stays on the panel (`.retro-hero-bubble`). See global.css.
 */
export function RetroDinoHero() {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const dinoHeight = isWide ? 168 : 112;
  const mouthDrop = dinoHeight * (1 - 2 * DONO_DINO_MOUTH_RATIO);

  const bubbleBody = (
    <View
      className="retro-hero-bubble justify-center rounded-[20px] border-[3px] border-retro-ink bg-retro-paper px-5 py-8 md:px-8 md:py-10"
      style={isWide ? { flex: 1 } : undefined}
    >
      <Text className="mb-3 text-center font-retro-bold text-[22px] leading-7 text-retro-ink md:text-3xl md:leading-9">
        Where did my last donation{"\u00A0"}go?
      </Text>
      <Text className="text-center font-retro-mono text-[14px] leading-7 text-retro-forest md:text-lg md:leading-8">
        Most alumni giving disappears into a black box. Dono is built around{" "}
        <Text className="font-retro-mono-bold">visible</Text>,{" "}
        <Text className="font-retro-mono-bold">specific</Text> Oxford campaigns,
        so you know <Text className="font-retro-mono-bold">exactly</Text> what
        your money{"\u00A0"}funded.
      </Text>
    </View>
  );

  const dino = (
    <Animated.View
      entering={(isWide ? FadeInRight : FadeIn).delay(140).duration(520)}
      className="retro-hero-dino items-center"
    >
      <DonoDino height={dinoHeight} />
    </Animated.View>
  );

  if (!isWide) {
    return (
      <View className="mb-10">
        <Animated.View
          entering={FadeInDown.duration(480).springify().damping(18)}
          className="retro-hero-speech"
        >
          {bubbleBody}
          <View className="items-center">
            <BubbleTail direction="down" length={28} spread={40} />
          </View>
        </Animated.View>
        {dino}
      </View>
    );
  }

  return (
    <View className="mb-10 flex-row items-center">
      <Animated.View
        entering={FadeInDown.duration(480).springify().damping(18)}
        className="retro-hero-speech flex-1 flex-row items-center"
      >
        {bubbleBody}
        <BubbleTail direction="right" length={40} spread={54} />
      </Animated.View>
      <View style={{ paddingTop: mouthDrop }}>{dino}</View>
    </View>
  );
}
