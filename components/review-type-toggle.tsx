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
  counts,
}: {
  value: ReviewType;
  onChange: (value: ReviewType) => void;
  /** Unfiltered list sizes for each tab; omit a key while its query is still loading. */
  counts?: Partial<Record<ReviewType, number>>;
}) {
  return (
    <View className="mb-6 flex-row gap-2">
      {reviewTypeTabs.map((t) => {
        const count = counts?.[t.id];
        const label =
          typeof count === "number" ? `${t.label} (${count})` : t.label;
        return (
          <Pressable
            key={t.id}
            onPress={() => onChange(t.id)}
            className={cn(
              "rounded-full px-3.5 py-1.5",
              value === t.id
                ? "bg-dono-primary"
                : "border border-dono-border bg-white",
            )}
            accessibilityRole="button"
            accessibilityState={{ selected: value === t.id }}
            accessibilityLabel={label}
          >
            <Text
              className={cn(
                "font-retro-bold text-xs",
                value === t.id ? "text-white" : "text-dono-muted",
              )}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
