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

export type StripeVerificationStatus =
  | "created"
  | "requires_input"
  | "processing"
  | "verified"
  | "canceled"
  | null;

export function stripeStatusChip(
  status: StripeVerificationStatus | undefined,
): { label: string; tone: "neutral" | "waiting" | "live" | "removed" } {
  switch (status) {
    case "verified":
      return { label: "Verified", tone: "live" };
    case "processing":
    case "created":
      return { label: "Pending", tone: "waiting" };
    case "requires_input":
      return { label: "Needs attention", tone: "removed" };
    case "canceled":
      return { label: "Canceled", tone: "removed" };
    default:
      return { label: "Not started", tone: "neutral" };
  }
}

/**
 * Distinct from the overall stripeVerificationStatus: whether the selfie
 * specifically matched. Derived (no dedicated backend field) — "verified"
 * implies the selfie check passed (require_matching_selfie is set at
 * session creation); a requires_input with a selfie_* last_error means it
 * didn't; anything else is treated as pending/unknown rather than assumed.
 */
export function selfieMatchChip(record: {
  stripeVerificationStatus: StripeVerificationStatus | undefined;
  stripeVerificationLastErrorCode: string | null | undefined;
}): { label: string; tone: "neutral" | "waiting" | "live" | "removed" } {
  if (record.stripeVerificationStatus === "verified") {
    return { label: "Selfie match: Yes", tone: "live" };
  }
  if (
    record.stripeVerificationStatus === "requires_input" &&
    record.stripeVerificationLastErrorCode?.startsWith("selfie_")
  ) {
    return { label: "Selfie match: No", tone: "removed" };
  }
  return { label: "Selfie match: Pending", tone: "waiting" };
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
