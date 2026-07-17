import { View, Text } from "react-native";
import { ReceiptDivider, ReceiptLineRow } from "@/components/ui/receipt-lines";

interface LedgerHeroIllustrationProps {
  size?: "sm" | "md";
}

export function LedgerHeroIllustration({ size = "md" }: LedgerHeroIllustrationProps) {
  const dimensions = size === "md" ? "w-56 p-5" : "w-44 p-4";
  const titleSize = size === "md" ? "text-xs" : "text-[10px]";

  return (
    <View
      className={`rounded-2xl border border-dono-border bg-white shadow-sm ${dimensions}`}
      accessibilityLabel="Illustration of a transparent donation receipt"
    >
      <View className="mb-3 flex-row items-center justify-between">
        <Text className={`font-retro-mono uppercase tracking-wider text-dono-primary ${titleSize}`}>
          Donation receipt
        </Text>
        <View className="h-2 w-2 rounded-full bg-dono-primary" />
      </View>

      <ReceiptLineRow label="Lab materials" amount={45} size="xs" />
      <ReceiptLineRow label="Reference set" amount={38} size="xs" />
      <ReceiptLineRow label="Core textbook" amount={49} size="xs" />

      <ReceiptDivider className="my-3" />

      <ReceiptLineRow label="Total goal" amount={132} size="xs" />

      <View className="mt-4 rounded-lg bg-dono-surface-muted px-3 py-2">
        <Text className="text-center font-retro-mono text-[10px] text-dono-muted">
          Every line item visible
        </Text>
      </View>
    </View>
  );
}
