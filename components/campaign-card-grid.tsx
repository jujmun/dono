import { View } from "react-native";
import { type Href } from "expo-router";
import type { Campaign } from "@/lib/types";
import { RetroCampaignCard } from "@/components/retro";
import { cn } from "@/lib/utils";

interface CampaignCardGridProps {
  campaigns: Campaign[];
  variant?: "default" | "compact";
  getHref?: (campaign: Campaign) => Href;
  /** Even 3-column grid for featured/home sections (1 col mobile, 2 md, 3 lg). */
  featured?: boolean;
  centered?: boolean;
}

export function CampaignCardGrid({
  campaigns,
  getHref,
  featured = false,
  centered = false,
}: CampaignCardGridProps) {
  const useFeaturedLayout = featured || centered;

  return (
    <View
      className={cn(
        "flex-row flex-wrap items-start gap-6",
        useFeaturedLayout ? "justify-center" : "justify-between",
      )}
    >
      {campaigns.map((campaign, index) => (
        <View
          key={campaign.id}
          className={cn(
            useFeaturedLayout
              ? "w-full md:w-[48%] lg:w-[31%]"
              : "w-full sm:w-[48%]",
          )}
        >
          <RetroCampaignCard
            campaign={campaign}
            accent={index % 2 === 0 ? "indigo" : "tan"}
            href={getHref?.(campaign)}
          />
        </View>
      ))}
    </View>
  );
}
