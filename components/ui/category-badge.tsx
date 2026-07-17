import { View, Text } from "react-native";
import { categoryColors, categoryLabels } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const fallback = { bg: "bg-gray-100", text: "text-gray-700" };

function splitColors(combined?: string) {
  if (!combined) return fallback;
  const parts = combined.split(" ");
  return {
    bg: parts.find((p) => p.startsWith("bg-")) || fallback.bg,
    text: parts.find((p) => p.startsWith("text-")) || fallback.text,
  };
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const colors = splitColors(categoryColors[category]);

  return (
    <View className={cn("rounded-full px-2.5 py-0.5", colors.bg, className)}>
      <Text className={cn("font-retro-bold text-xs", colors.text)}>
        {categoryLabels[category] || category}
      </Text>
    </View>
  );
}
