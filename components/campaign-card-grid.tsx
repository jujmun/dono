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
  /** Tighter gap for the pinned landing story, where the row has to fit one screen. */
  compact?: boolean;
  /** Force a column count inside the pinned story so the row does not wrap. */
  columns?: 1 | 3;
  centered?: boolean;
  /**
   * 0 = cards are off toward the sides, 1 = settled.
   * Other pages leave this at 1.
   */
  enter?: number;
  getBadges?: (campaign: Campaign) => CampaignCardBadges | undefined;
}

export function CampaignCardGrid({
  campaigns,
  getHref,
  featured = false,
  centered = false,
  compact = false,
  columns,
  enter = 1,
  getBadges,
}: CampaignCardGridProps) {
  const useFeaturedLayout = featured || centered;
  const settled = enter >= 0.995;

  return (
    <View
      className={cn(
        "flex-row flex-wrap items-stretch",
        compact ? "gap-3" : "gap-6",
        useFeaturedLayout ? "justify-center" : "justify-between",
      )}
    >
      {campaigns.map((campaign, index) => {
        const badges = getBadges?.(campaign);
        const travel = settled ? 0 : 1 - enter;
        const stacked = columns === 1;
        const center = !stacked && campaigns.length % 2 === 1 ? (campaigns.length - 1) / 2 : -1;
        const fromLeft = stacked ? index % 2 === 0 : index < campaigns.length / 2;
        const motion =
          travel === 0
            ? undefined
            : center === index && campaigns.length > 1
              ? { opacity: enter, transform: [{ translateY: travel * 10 }] }
              : {
                  transform: [{ translateX: (fromLeft ? -1 : 1) * travel * (stacked ? 48 : 72) }],
                };
        return (
          <View
            key={campaign.id}
            className={cn(
              "h-auto self-stretch",
              columns === 3
                ? "w-[31%]"
                : columns === 1
                  ? "w-full max-w-md"
                  : useFeaturedLayout
                    ? "w-full md:w-[48%] lg:w-[31%]"
                    : "w-full sm:w-[48%]",
            )}
            style={motion}
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
