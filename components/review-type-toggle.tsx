import { Pressable, Text, View } from "react-native";
import { cn } from "@/lib/utils";

export type ReviewType = "campaigns" | "societies";

const reviewTypeTabs: { id: ReviewType; label: string }[] = [
  { id: "campaigns", label: "Campaigns" },
  { id: "societies", label: "Societies" },
];

export function ReviewTypeToggle({
  value,
  onChange,
}: {
  value: ReviewType;
  onChange: (value: ReviewType) => void;
}) {
  return (
    <View className="mb-6 flex-row gap-2">
      {reviewTypeTabs.map((t) => (
        <Pressable
          key={t.id}
          onPress={() => onChange(t.id)}
          className={cn(
            "rounded-full px-3.5 py-1.5",
            value === t.id
              ? "bg-dono-primary"
              : "border border-dono-border bg-white",
          )}
        >
          <Text
            className={cn(
              "font-retro-bold text-xs",
              value === t.id ? "text-white" : "text-dono-muted",
            )}
          >
            {t.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
