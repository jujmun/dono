import { Pressable, Text, View } from "react-native";

type DonateAnonymouslyToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
};

export function DonateAnonymouslyToggle({
  value,
  onChange,
  className,
}: DonateAnonymouslyToggleProps) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      className={`flex-row items-center gap-2 py-1 ${className ?? ""}`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      accessibilityLabel="Donate anonymously"
    >
      <View
        className={`h-4 w-4 items-center justify-center rounded border ${
          value ? "border-dono-primary bg-dono-primary" : "border-dono-border bg-white"
        }`}
      >
        {value ? <Text className="text-[9px] font-bold leading-none text-white">✓</Text> : null}
      </View>
      <Text className="text-sm text-dono-text">Donate anonymously</Text>
    </Pressable>
  );
}
