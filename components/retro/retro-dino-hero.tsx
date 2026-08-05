import { View, Text, useWindowDimensions } from "react-native";
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

export function RetroDinoHero() {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const dinoHeight = isWide ? 160 : 104;
  // Padding that drops the mascot far enough for the tail to meet its mouth
  // once the row centres both children.
  const mouthDrop = dinoHeight * (1 - 2 * DONO_DINO_MOUTH_RATIO);

  const bubble = (
    <View
      className="justify-center rounded-[20px] border-[3px] border-retro-ink bg-retro-paper px-5 py-9 md:px-8 md:py-12"
      style={isWide ? { flex: 1 } : undefined}
    >
      <Text className="text-center font-retro-mono text-[15px] leading-8 text-retro-forest md:text-xl md:leading-10">
        People like knowing what difference they made. Dono is built around{" "}
        <Text className="font-retro-mono-bold">visible</Text>,{" "}
        <Text className="font-retro-mono-bold">specific</Text> giving, so every
        donor knows <Text className="font-retro-mono-bold">exactly</Text> where
        their money{"\u00A0"}went.
      </Text>
    </View>
  );

  if (!isWide) {
    return (
      <View className="mb-8">
        {bubble}
        <View className="items-center">
          <BubbleTail direction="down" length={28} spread={40} />
          <DonoDino height={dinoHeight} />
        </View>
      </View>
    );
  }

  return (
    <View className="mb-8 flex-row items-center">
      {bubble}
      <BubbleTail direction="right" length={40} spread={54} />
      <View style={{ paddingTop: mouthDrop }}>
        <DonoDino height={dinoHeight} />
      </View>
    </View>
  );
}
