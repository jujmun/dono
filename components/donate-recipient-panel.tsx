import { useState } from "react";
import { Pressable, View, Text } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";

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

function RecipientField({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text className="text-xs text-dono-muted">{label}</Text>
      <Text className="text-sm text-dono-text">{value}</Text>
    </View>
  );
}

/** “You're donating to” panel. Legal status, account holder, and property owner sit under More information. */
export function DonateRecipientPanel({ panel, className }: Props) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRows: { label: string; value: string }[] = [
    { label: "Legal status", value: panel.legalStatus },
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
        <RecipientField label="Campaign owner" value={panel.ownerLegalName} />
        <RecipientField label="Representative" value={panel.representativeName} />
      </View>
      <Pressable
        onPress={() => setMoreOpen((open) => !open)}
        className="mt-3 flex-row items-center gap-1"
        accessibilityRole="button"
        accessibilityState={{ expanded: moreOpen }}
        accessibilityLabel="More information"
      >
        <Text className="text-sm text-dono-muted">More information</Text>
        {moreOpen ? (
          <ChevronUp size={14} color="#56615A" />
        ) : (
          <ChevronDown size={14} color="#56615A" />
        )}
      </Pressable>
      {moreOpen ? (
        <View className="mt-2 gap-2">
          {moreRows.map((row) => (
            <RecipientField key={row.label} label={row.label} value={row.value} />
          ))}
        </View>
      ) : null}
    </View>
  );
}
