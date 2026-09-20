import { Pressable, Text } from "react-native";
import { cn } from "@/lib/utils";

export function FilterChip({
  label,
  selected,
  onPress,
  selectedClassName,
  selectedTextClassName = "text-retro-paper",
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  selectedClassName: string;
  selectedTextClassName?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "retro-key",
        "rounded-full border-2 border-retro-ink px-3.5 py-1.5",
        selected ? selectedClassName : "bg-retro-paper",
      )}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      <Text
        className={cn(
          "font-retro-bold text-[12.5px]",
          selected ? selectedTextClassName : "text-retro-ink",
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
