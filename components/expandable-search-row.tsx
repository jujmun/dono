import { useEffect, useRef, type ReactNode } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Search } from "lucide-react-native";
import { cn } from "@/lib/utils";

const BUTTON = 44;
const GAP = 8;
const FIELD_CAP = 380;
const MIN_FIELD = 168;

function fieldTarget(rowWidth: number, titleWidth: number) {
  const chrome = GAP + BUTTON + GAP + BUTTON;
  const room = Math.max(0, rowWidth - chrome - GAP);
  let reservedTitle = titleWidth;
  if (room - reservedTitle < MIN_FIELD) {
    reservedTitle = Math.max(0, room - MIN_FIELD);
  }
  return Math.min(FIELD_CAP, Math.max(0, room - reservedTitle));
}

type ExpandableSearchRowProps = {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  active: boolean;
  trailing: ReactNode;
};

export function ExpandableSearchRow({
  title,
  expanded,
  onToggle,
  value,
  onChangeText,
  placeholder,
  active,
  trailing,
}: ExpandableSearchRowProps) {
  const inputRef = useRef<TextInput>(null);
  const rowWidthRef = useRef(0);
  const titleWidthRef = useRef(0);
  const progress = useSharedValue(0);
  const targetWidth = useSharedValue(0);

  const syncTarget = () => {
    targetWidth.value = fieldTarget(rowWidthRef.current, titleWidthRef.current);
  };

  useEffect(() => {
    progress.value = withTiming(expanded ? 1 : 0, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [expanded, progress]);

  useEffect(() => {
    if (!expanded) {
      inputRef.current?.blur();
      return;
    }
    const id = setTimeout(() => inputRef.current?.focus(), 180);
    return () => clearTimeout(id);
  }, [expanded]);

  const clipStyle = useAnimatedStyle(() => ({
    width: progress.value * targetWidth.value,
    minWidth: 0,
    overflow: "hidden",
    opacity: interpolate(progress.value, [0, 0.2, 1], [0, 1, 1]),
  }));

  return (
    <View
      className="mb-5 flex-row items-center"
      onLayout={(event) => {
        rowWidthRef.current = event.nativeEvent.layout.width;
        syncTarget();
      }}
    >
      <Text
        className="min-w-0 shrink font-retro-display text-[32px] text-retro-ink"
        numberOfLines={1}
        onLayout={(event) => {
          if (expanded) return;
          titleWidthRef.current = event.nativeEvent.layout.width;
          syncTarget();
        }}
      >
        {title}
      </Text>
      <View className="ml-auto shrink-0 flex-row items-center">
        <Animated.View
          style={clipStyle}
          pointerEvents={expanded ? "auto" : "none"}
          accessibilityElementsHidden={!expanded}
          importantForAccessibility={expanded ? "auto" : "no-hide-descendants"}
          className="h-11 flex-row items-center overflow-hidden rounded-lg border-[3px] border-retro-ink bg-retro-paper"
        >
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#8a8478"
            editable={expanded}
            accessibilityLabel={placeholder}
            className="h-full min-w-0 flex-1 px-3 font-retro-mono text-[13px] text-retro-ink outline-none"
          />
        </Animated.View>
        <Pressable
          onPress={onToggle}
          className={cn(
            "retro-key",
            "ml-2 h-11 w-11 items-center justify-center rounded-lg border-[3px] border-retro-ink",
            active ? "bg-retro-mint" : "bg-retro-paper",
          )}
          accessibilityRole="button"
          accessibilityLabel="Search"
          accessibilityState={{ expanded }}
        >
          <Search size={18} color={active ? "#FFF9EF" : "#211E1A"} />
        </Pressable>
      </View>
      <View className="ml-2 shrink-0">{trailing}</View>
    </View>
  );
}
