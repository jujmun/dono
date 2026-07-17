import { View, Text } from "react-native";
import type { Campaign } from "@/lib/types";
import { formatCurrency, getProgress } from "@/lib/constants";
import { buildGoalLineItems } from "@/lib/receipt";
import { RetroWindow } from "./retro-window";

interface CampaignReceiptWindowProps {
  campaign: Campaign | null;
}

export function CampaignReceiptWindow({ campaign }: CampaignReceiptWindowProps) {
  if (!campaign) {
    return (
      <RetroWindow title="CAMPAIGN_RECEIPT.sys" accent="marigold" className="flex-1">
        <Text className="font-retro-mono text-xs text-[#5c574f]">
          Select a campaign to view its goal breakdown.
        </Text>
      </RetroWindow>
    );
  }

  const lines = buildGoalLineItems(campaign);
  const progress = getProgress(campaign.raised, campaign.goal);
  const title = campaign.title.toUpperCase();

  return (
    <RetroWindow title="CAMPAIGN_RECEIPT.sys" accent="marigold" className="flex-1">
      <View className="rounded-lg border-2 border-dashed border-retro-ink bg-retro-paper px-3.5 py-3.5">
        <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
          {title.length > 28 ? `${title.slice(0, 28)}…` : title} — GOAL BREAKDOWN
        </Text>
        {lines.map((line) => (
          <View
            key={line.label}
            className="flex-row items-center justify-between py-1"
          >
            <Text
              className="mr-2 flex-1 font-retro-mono text-[12.5px] text-retro-ink"
              numberOfLines={1}
            >
              {line.label}
            </Text>
            <Text className="font-retro-mono text-[12.5px] text-retro-ink">
              {formatCurrency(line.amount)}
            </Text>
          </View>
        ))}
        <View className="my-2 border-t border-dashed border-retro-ink" />
        <View className="flex-row items-center justify-between py-1">
          <Text className="font-retro-mono-bold text-[12.5px] text-retro-ink">
            TOTAL GOAL
          </Text>
          <Text className="font-retro-mono-bold text-[12.5px] text-retro-ink">
            {formatCurrency(campaign.goal)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between py-1">
          <Text className="font-retro-mono text-[12.5px] text-retro-ink">RAISED</Text>
          <Text className="font-retro-mono text-[12.5px] text-retro-ink">
            {formatCurrency(campaign.raised)}
          </Text>
        </View>
        <View
          className="mt-2.5 self-start rounded-full border-2 border-retro-coral px-2.5 py-1"
          style={{ transform: [{ rotate: "-4deg" }] }}
        >
          <Text className="font-retro-bold text-[11px] text-retro-coral">
            {progress}% FUNDED
          </Text>
        </View>
      </View>
    </RetroWindow>
  );
}
