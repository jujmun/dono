import { View } from "react-native";
import { type Href } from "expo-router";
import type { Campaign } from "@/lib/types";
import { RetroCampaignCard } from "@/components/retro";
import { cn } from "@/lib/utils";
import { isNearGoal } from "@/lib/donation-psychology";

export type CampaignCardBadges = {
  matched?: boolean;
  matchMultiplier?: number;
  collegeMatch?: boolean;
};

interface CampaignCardGridProps {
  campaigns: Campaign[];
  variant?: "default" | "compact";
  getHref?: (campaign: Campaign) => Href;
  /** Even 3-column grid for featured/home sections (1 col mobile, 2 md, 3 lg). */
  featured?: boolean;
  centered?: boolean;
  getBadges?: (campaign: Campaign) => CampaignCardBadges | undefined;
}

export function CampaignCardGrid({
  campaigns,
  getHref,
  featured = false,
  centered = false,
  getBadges,
}: CampaignCardGridProps) {
  const useFeaturedLayout = featured || centered;

  return (
    <View
      className={cn(
        "flex-row flex-wrap items-stretch gap-6",
        useFeaturedLayout ? "justify-center" : "justify-between",
      )}
    >
      {campaigns.map((campaign, index) => {
        const badges = getBadges?.(campaign);
        return (
          <View
            key={campaign.id}
            className={cn(
              "h-auto self-stretch",
              useFeaturedLayout
                ? "w-full md:w-[48%] lg:w-[31%]"
                : "w-full sm:w-[48%]",
            )}
          >
            <RetroCampaignCard
              campaign={campaign}
              accent={index % 2 === 0 ? "indigo" : "tan"}
              href={getHref?.(campaign)}
              nearGoal={isNearGoal(campaign)}
              matched={badges?.matched}
              matchMultiplier={badges?.matchMultiplier}
              collegeMatch={badges?.collegeMatch}
            />
          </View>
        );
      })}
    </View>
  );
}
