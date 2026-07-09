import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, className, showLabel = false }: ProgressBarProps) {
  const width = `${Math.min(value, 100)}%`;

  return (
    <View className={cn("w-full", className)}>
      <View className="h-2 w-full overflow-hidden rounded-full bg-dono-surface-muted">
        <View
          className="h-full rounded-full bg-dono-primary"
          style={{ width: width as `${number}%` }}
        />
      </View>
      {showLabel && (
        <Text className="mt-1 text-right text-xs font-medium text-dono-muted">
          {value}% funded
        </Text>
      )}
    </View>
  );
}
