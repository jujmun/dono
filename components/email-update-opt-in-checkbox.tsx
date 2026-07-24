import { View, Text, Pressable } from "react-native";

type EmailUpdateOptInCheckboxProps = {
  campaignTitle: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  className?: string;
};

export function EmailUpdateOptInCheckbox({
  campaignTitle,
  checked,
  onCheckedChange,
  className,
}: EmailUpdateOptInCheckboxProps) {
  return (
    <Pressable
      onPress={() => onCheckedChange(!checked)}
      className={`flex-row items-start gap-2 py-1 ${className ?? ""}`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={`Email me when ${campaignTitle} posts an update on how this was used`}
    >
      <View
        className={`mt-0.5 h-4 w-4 shrink-0 items-center justify-center rounded border ${
          checked ? "border-dono-primary bg-dono-primary" : "border-dono-border bg-white"
        }`}
      >
        {checked ? (
          <Text className="text-[9px] font-bold leading-none text-white">✓</Text>
        ) : null}
      </View>
      <Text className="min-w-0 flex-1 text-sm leading-5 text-dono-text">
        Email me when <Text className="font-retro-bold">{campaignTitle}</Text> posts an
        update on how this was used.
      </Text>
    </Pressable>
  );
}
