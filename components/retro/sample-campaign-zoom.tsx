import { useState } from "react";
import { Text, View, type LayoutChangeEvent, type ViewStyle } from "react-native";
import { Gift } from "lucide-react-native";

type Box = { x: number; y: number; w: number; h: number };

const EMPTY: Box = { x: 0, y: 0, w: 0, h: 0 };

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function readBox(event: LayoutChangeEvent): Box {
  const { x, y, width, height } = event.nativeEvent.layout;
  return { x, y, w: width, h: height };
}

/**
 * A fixed campaign-page illustration. Scroll progress zooms partway toward
 * the donate button or the updates log and dims everything else.
 */
export function SampleCampaignZoom({
  zoom,
  spotlight,
  frameHeight,
}: {
  /** 0 = the whole page fits. 1 = zoomed toward the spotlight. */
  zoom: number;
  spotlight: "donate" | "updates" | null;
  frameHeight: number;
}) {
  const [frame, setFrame] = useState({ w: 0, h: frameHeight });
  const [page, setPage] = useState({ w: 0, h: 0 });
  const [body, setBody] = useState(EMPTY);
  const [card, setCard] = useState(EMPTY);
  const [donate, setDonate] = useState(EMPTY);
  const [updates, setUpdates] = useState(EMPTY);

  const progress = Math.min(1, Math.max(0, zoom));
  const fitScale =
    page.w > 0 && page.h > 0 && frame.w > 0
      ? Math.min(frame.w / page.w, frame.h / page.h)
      : 1;

  const donateBox = {
    x: body.x + card.x + donate.x,
    y: body.y + card.y + donate.y,
    w: donate.w,
    h: donate.h,
  };
  const updatesBox = {
    x: body.x + updates.x,
    y: body.y + updates.y,
    w: updates.w,
    h: updates.h,
  };
  const target = spotlight === "updates" ? updatesBox : donateBox;
  const scale = lerp(fitScale * 0.92, fitScale * 1.22, progress);
  const pull = progress * 0.28;
  const focusX = lerp(page.w / 2, target.x + target.w / 2, pull);
  const focusY = lerp(page.h / 2, target.y + target.h / 2, pull);
  const translateX = frame.w / 2 - focusX * scale;
  const translateY = frame.h / 2 - focusY * scale;

  const pageWidth = frame.w > 0 ? Math.min(480, frame.w) : 480;
  const pageStyle = {
    width: pageWidth,
    transform: [{ translateX }, { translateY }, { scale }],
    transformOrigin: "0px 0px",
  } as ViewStyle;
  const dim = lerp(1, 0.32, progress);
  const introOpacity = spotlight ? dim : 1;
  const donateOpacity = spotlight === "updates" ? dim : 1;
  const updatesOpacity = spotlight === "donate" ? dim : 1;

  return (
    <View
      className="w-full overflow-hidden"
      style={{ height: frameHeight }}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setFrame((current) =>
          Math.abs(current.w - width) < 1 && Math.abs(current.h - height) < 1
            ? current
            : { w: width, h: height },
        );
      }}
    >
      <View
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setPage((current) =>
            Math.abs(current.w - width) < 1 && Math.abs(current.h - height) < 1
              ? current
              : { w: width, h: height },
          );
        }}
        style={pageStyle}
      >
        <View style={{ opacity: introOpacity }}>
          <View className="h-16 bg-[#c4b7a6]" />
          <View className="px-4 pt-3">
            <Text className="font-retro-mono text-[11px] uppercase tracking-wide text-[#5c574f]">
              Sample College Boat Club
            </Text>
            <Text className="mt-1 font-retro-display text-xl text-retro-ink">
              Keep the boat on the water
            </Text>
            <Text className="mt-1 font-retro-mono text-xs text-[#5c574f]">£1,240 of £3,000</Text>
          </View>
        </View>
        <View className="px-4 pb-4" onLayout={(event) => setBody(readBox(event))}>
          <View
            className="mt-3 rounded-[14px] border-[3px] border-retro-ink bg-retro-paper p-3"
            onLayout={(event) => setCard(readBox(event))}
            style={{ opacity: donateOpacity }}
          >
            <Text className="mb-2 text-right font-retro-mono-bold text-xl text-retro-ink">£25</Text>
            <View
              className="flex-row items-center justify-center gap-2 rounded-[10px] border-2 border-retro-ink bg-retro-mint py-3"
              onLayout={(event) => setDonate(readBox(event))}
            >
              <Gift size={18} color="#FFFFFF" />
              <Text className="font-retro-bold text-[15px] text-white">Donate £25</Text>
            </View>
          </View>

          <View
            className="mt-3 overflow-hidden rounded-[14px] border-[3px] border-retro-ink bg-retro-paper"
            onLayout={(event) => setUpdates(readBox(event))}
            style={{ opacity: updatesOpacity }}
          >
            <View className="flex-row items-center justify-between border-b-[3px] border-retro-ink px-4 py-2.5">
              <Text className="font-retro-bold text-sm uppercase tracking-wide text-retro-ink">
                Updates
              </Text>
              <Text className="font-retro-mono text-xs text-[#5c574f]">3 posts</Text>
            </View>
            <UpdateRow when="12 Mar" text="Kit arrived — new oars are in the boathouse." />
            <UpdateRow when="2 Mar" text="Thank you — eight alumni covered the trailer repair." />
            <UpdateRow when="18 Feb" text="We launched. First outing of term is on the river." />
          </View>
        </View>
      </View>
    </View>
  );
}

function UpdateRow({ when, text }: { when: string; text: string }) {
  return (
    <View className="border-b border-[#e4dccb] px-4 py-2">
      <Text className="font-retro-mono text-[11px] text-[#5c574f]">{when}</Text>
      <Text className="mt-0.5 text-sm leading-5 text-retro-ink">{text}</Text>
    </View>
  );
}
