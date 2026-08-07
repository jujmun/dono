import {
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { useConvexAuth, useQuery } from "convex/react";
import { useMemo } from "react";
import { AppShell } from "@/components/app-shell";
import { CampaignCardGrid } from "@/components/campaign-card-grid";
import {
  RetroDinoHero,
  LandingHeroActions,
  LandingHowItWorks,
  LandingAudienceSplit,
  LandingWhyDono,
  LandingFinalCta,
} from "@/components/retro";
import { api } from "@convex/_generated/api";
import type { Campaign } from "@/lib/types";
import { useCurrentProfile } from "@/lib/auth/hooks";

function CampaignSection({
  title,
  subtitle,
  campaigns,
  getBadges,
  loading,
}: {
  title: string;
  subtitle: string;
  campaigns: Campaign[];
  getBadges: (campaign: Campaign) => {
    matched?: boolean;
    matchMultiplier?: number;
    collegeMatch?: boolean;
  };
  loading?: boolean;
}) {
  return (
    <View className="mb-16">
      <View className="mb-6 items-center">
        <Text className="font-retro-bold text-2xl text-retro-ink">{title}</Text>
        {subtitle ? (
          <Text className="mt-1 text-center text-dono-muted">{subtitle}</Text>
        ) : null}
      </View>
      {loading ? (
        <ActivityIndicator color="#211E1A" />
      ) : (
        <CampaignCardGrid campaigns={campaigns} featured getBadges={getBadges} />
      )}
    </View>
  );
}

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

  const loading = trendingCampaigns === undefined;
  const showForYou =
    isAuthenticated &&
    Boolean(profileCollege) &&
    forYouCampaigns &&
    forYouCampaigns.length > 0;

  return (
    <AppShell>
      <RetroDinoHero />
      <LandingHeroActions profile={profile} />
      {/* TODO(stats): re-add <LandingTrustStrip totalRaised={…} campaignCount={…} />
          once there are enough live campaigns for the receipt strip to feel credible. */}

      {/* Live proof early: marketplace LPs put discovery before feature grids */}
      <CampaignSection
        title="Trending Campaigns"
        subtitle=""
        campaigns={trendingCampaigns ?? []}
        getBadges={getBadges}
        loading={loading}
      />

      <LandingHowItWorks />
      <LandingAudienceSplit profile={profile} />

      {nearGoalCampaigns && nearGoalCampaigns.length > 0 ? (
        <CampaignSection
          title="Almost there"
          subtitle="Campaigns close to their goal. Your gift can tip them over."
          campaigns={nearGoalCampaigns}
          getBadges={getBadges}
        />
      ) : null}

      {showForYou ? (
        <CampaignSection
          title="From your college"
          subtitle={`Campaigns connected to ${profile?.college}`}
          campaigns={forYouCampaigns!}
          getBadges={getBadges}
        />
      ) : null}

      <LandingWhyDono />
      <LandingFinalCta profile={profile} />
    </AppShell>
  );
}
