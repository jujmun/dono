import { useConvexAuth, useQuery } from "convex/react";
import { useMemo } from "react";
import { AppShell } from "@/components/app-shell";
import { LandingScrollStory } from "@/components/retro";
import { api } from "@convex/_generated/api";
import type { Campaign } from "@/lib/types";
import { useCurrentProfile } from "@/lib/auth/hooks";

export default function HomePage() {
  const { isAuthenticated } = useConvexAuth();
  const profile = useCurrentProfile();
  const trendingCampaigns = (useQuery(api.campaigns.listTrending, {
    limit: 3,
  }) ?? undefined) as Campaign[] | undefined;
  const nearGoalCampaigns = (useQuery(api.campaigns.listNearGoal, {
    limit: 3,
  }) ?? undefined) as Campaign[] | undefined;
  const forYouCampaigns = (useQuery(
    api.campaigns.listForYou,
    isAuthenticated ? { limit: 3 } : "skip",
  ) ?? undefined) as Campaign[] | undefined;
  const activeMatches = useQuery(api.campaignMatches.listActive) ?? [];
  // CR-02a: match windows removed; listActive always returns [].
  void activeMatches;

  const matchBySlug = useMemo(() => {
    return new Map<string, { multiplier: number }>();
  }, []);

  const profileCollege = profile?.college?.trim().toLowerCase() ?? "";
  const getBadges = (campaign: Campaign) => {
    const match = matchBySlug.get(campaign.id);
    return {
      matched: Boolean(match),
      matchMultiplier: match?.multiplier,
      collegeMatch:
        Boolean(profileCollege) &&
        (campaign.college ?? "").trim().toLowerCase() === profileCollege,
    };
  };

  const trendingLoading = trendingCampaigns === undefined;
  const showForYou =
    isAuthenticated &&
    Boolean(profileCollege) &&
    forYouCampaigns &&
    forYouCampaigns.length > 0;

  return (
    <AppShell>
      {/* TODO(stats): re-add the receipt strip once there are enough live
          campaigns for it to feel credible. */}
      <LandingScrollStory
        profile={profile}
        trending={trendingCampaigns}
        nearGoal={nearGoalCampaigns ?? []}
        forYou={showForYou ? forYouCampaigns! : []}
        getBadges={getBadges}
        trendingLoading={trendingLoading}
      />
    </AppShell>
  );
}
