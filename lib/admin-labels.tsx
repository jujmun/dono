import { View, Text } from "react-native";
import { cn } from "@/lib/utils";
import type { Campaign } from "@/lib/types";

export function humanCampaignStatus(campaign: Campaign): string {
  if (campaign.status === "pending") return "Waiting";
  if (campaign.status === "rejected") return "Removed";
  if (
    campaign.status === "active" ||
    campaign.status === "funded" ||
    campaign.status === "completed"
  ) {
    return "Live";
  }
  return campaign.status;
}

export function moderationActionLabel(
  action: Campaign["moderationAction"],
): string | null {
  if (action === "taken_down") return "Taken down";
  if (action === "rejected") return "Denied";
  return null;
}

export function AdminStatusChip({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "waiting" | "live" | "removed";
}) {
  return (
    <View
      className={cn(
        "rounded-md px-2 py-0.5",
        tone === "waiting" && "bg-amber-50",
        tone === "live" && "bg-emerald-50",
        tone === "removed" && "bg-rose-50",
        tone === "neutral" && "bg-dono-surface-muted",
      )}
    >
      <Text
        className={cn(
          "text-xs font-sans-medium",
          tone === "waiting" && "text-amber-800",
          tone === "live" && "text-emerald-800",
          tone === "removed" && "text-rose-700",
          tone === "neutral" && "text-dono-muted",
        )}
      >
        {label}
      </Text>
    </View>
  );
}

export function statusChipTone(
  label: string,
): "waiting" | "live" | "removed" | "neutral" {
  if (label === "Waiting") return "waiting";
  if (label === "Live" || label === "Funded" || label === "Completed") {
    return "live";
  }
  if (
    label === "Removed" ||
    label === "Denied" ||
    label === "Taken down"
  ) {
    return "removed";
  }
  return "neutral";
}
