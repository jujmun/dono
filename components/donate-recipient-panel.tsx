import { View, Text } from "react-native";
import { LEGAL_WORDINGS } from "@/lib/legal/wordings";

export type RecipientPanelData = {
  ownerLegalName: string;
  legalStatus: string;
  representativeName: string;
  connectedAccountHolder: string;
  propertyOwner: string;
};

export function isRecipientPanelComplete(
  panel: Partial<RecipientPanelData> | null | undefined,
): panel is RecipientPanelData {
  if (!panel) return false;
  return Boolean(
    panel.ownerLegalName?.trim() &&
      panel.legalStatus?.trim() &&
      panel.representativeName?.trim() &&
      panel.connectedAccountHolder?.trim() &&
      panel.propertyOwner?.trim(),
  );
}

type Props = {
  panel: RecipientPanelData;
  className?: string;
};

/** CH-01 — six-field “You're donating to” panel. */
export function DonateRecipientPanel({ panel, className }: Props) {
  const rows: { label: string; value: string }[] = [
    { label: "Campaign owner", value: panel.ownerLegalName },
    { label: "Legal status", value: panel.legalStatus },
    { label: "Representative", value: panel.representativeName },
    { label: "Connected Account holder", value: panel.connectedAccountHolder },
    { label: "Owner of purchased property", value: panel.propertyOwner },
  ];

  return (
    <View
      className={`rounded-xl border border-dono-border bg-white px-4 py-3 ${className ?? ""}`}
    >
      <Text className="font-retro-mono-bold text-sm text-dono-primary">
        You&apos;re donating to
      </Text>
      <View className="mt-3 gap-2">
        {rows.map((row) => (
          <View key={row.label}>
            <Text className="text-xs text-dono-muted">{row.label}</Text>
            <Text className="text-sm text-dono-text">{row.value}</Text>
          </View>
        ))}
      </View>
      <Text className="mt-3 text-xs leading-relaxed text-dono-muted">
        {LEGAL_WORDINGS["W-ROLE-1"]}
      </Text>
    </View>
  );
}
