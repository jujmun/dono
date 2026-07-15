import { View, Text } from "react-native";
import { formatCurrency } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ReceiptDivider({ className }: { className?: string }) {
  return (
    <View
      className={cn("border-t border-dashed border-dono-border/80", className ?? "my-3")}
    />
  );
}

export function ReceiptLedger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      className={cn(
        "rounded-xl border border-dono-border/70 bg-dono-surface-muted p-4",
        className,
      )}
    >
      {children}
    </View>
  );
}

export function ReceiptLineRow({
  label,
  amount,
  muted,
  emphasis,
  size = "sm",
}: {
  label: string;
  amount: number | string;
  muted?: boolean;
  emphasis?: boolean;
  size?: "xs" | "sm";
}) {
  const textSize = size === "xs" ? "text-xs" : "text-sm";
  const displayAmount =
    typeof amount === "number" ? formatCurrency(amount) : amount;

  return (
    <View className="mb-2.5 flex-row items-end gap-2 last:mb-0">
      <Text
        className={cn(
          "max-w-[55%] shrink",
          textSize,
          emphasis ? "font-sans-medium text-dono-text" : "text-dono-text",
          muted && !emphasis && "text-dono-muted",
        )}
        numberOfLines={2}
      >
        {label}
      </Text>
      <View
        className="mb-1 min-h-[1px] min-w-6 flex-1 border-b border-dotted border-dono-border"
      />
      <Text
        className={cn(
          "shrink-0 tabular-nums",
          textSize,
          emphasis ? "font-mono-medium text-dono-text" : "font-mono text-dono-text",
          muted && !emphasis && "text-dono-muted",
        )}
      >
        {displayAmount}
      </Text>
    </View>
  );
}

export function ReceiptTotalRow({
  label,
  amount,
  size = "sm",
}: {
  label: string;
  amount: number | string;
  size?: "xs" | "sm";
}) {
  return <ReceiptLineRow label={label} amount={amount} emphasis size={size} />;
}

export function FundBreakdownSection({
  title = "What your donation funds",
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View className={cn("rounded-2xl border border-dono-border bg-white p-6", className)}>
      <Text className="font-sans-medium text-lg text-dono-text">{title}</Text>
      {subtitle ? (
        <Text className="mt-1 text-sm text-dono-muted">{subtitle}</Text>
      ) : null}
      <View
        className={cn(
          "border-b border-dashed border-dono-border",
          subtitle ? "my-4" : "mb-4 mt-3",
        )}
      />
      {children}
    </View>
  );
}
