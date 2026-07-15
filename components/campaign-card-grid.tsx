import { View } from "react-native";
import { type Href } from "expo-router";
import type { Campaign } from "@/lib/types";
import { CampaignCard } from "@/components/campaign-card";
import { cn } from "@/lib/utils";

interface CampaignCardGridProps {
  campaigns: Campaign[];
  variant?: "default" | "compact";
  getHref?: (campaign: Campaign) => Href;
  centered?: boolean;
}

export function CampaignCardGrid({
  campaigns,
  variant,
  getHref,
  centered = false,
}: CampaignCardGridProps) {
  return (
    <View
      className={cn(
        "flex-row flex-wrap gap-6",
        centered ? "justify-center" : "justify-between",
      )}
    >
      {campaigns.map((campaign) => (
        <View
          key={campaign.id}
          className={cn(centered ? "w-full max-w-md sm:w-[46%]" : "w-[48%]")}
        >
          <CampaignCard
            campaign={campaign}
            variant={variant}
            href={getHref?.(campaign)}
          />
        </View>
      ))}
    </View>
  );
}
