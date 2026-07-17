import { Pressable, Text, View } from "react-native";
import { EyeOff } from "lucide-react-native";

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
      className={`flex-row items-start gap-3 rounded-xl border border-dono-border bg-dono-surface-muted/60 px-4 py-3 ${className ?? ""}`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      accessibilityLabel="Donate anonymously"
    >
      <View
        className={`mt-0.5 h-5 w-5 items-center justify-center rounded-md border ${
          value ? "border-dono-primary bg-dono-primary" : "border-dono-border bg-white"
        }`}
      >
        {value ? <Text className="text-xs font-bold text-white">✓</Text> : null}
      </View>
      <View className="min-w-0 flex-1">
        <View className="flex-row items-center gap-2">
          <EyeOff size={14} color="#56615A" />
          <Text className="font-retro-bold text-sm text-dono-text">Donate anonymously</Text>
        </View>
        <Text className="mt-1 text-xs leading-relaxed text-dono-muted">
          Your name won&apos;t appear on public activity feeds. You can still receive a
          receipt by email.
        </Text>
      </View>
    </Pressable>
  );
}
