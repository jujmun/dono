import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  /** Overrides the default dono-primary fill color, e.g. with a campaign template's accent. */
  fillColor?: string;
}

export function ProgressBar({ value, className, showLabel = false, fillColor }: ProgressBarProps) {
  const width = `${Math.min(value, 100)}%`;

  return (
    <View className={cn("w-full", className)}>
      <View className="h-2 w-full overflow-hidden rounded-full bg-dono-surface-muted">
        <View
          className={cn("h-full rounded-full", !fillColor && "bg-dono-primary")}
          style={{
            width: width as `${number}%`,
            ...(fillColor ? { backgroundColor: fillColor } : null),
          }}
        />
      </View>
      {showLabel && (
        <Text className="mt-1 text-right font-retro-bold text-xs text-dono-muted">
          {value}% funded
        </Text>
      )}
    </View>
  );
}
