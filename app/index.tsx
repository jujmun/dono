import { Link } from "expo-router";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useConvexAuth, useQuery } from "convex/react";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { CampaignCardGrid } from "@/components/campaign-card-grid";
import { RetroDinoHero, RetroPanel } from "@/components/retro";
import { ReceiptDivider, ReceiptLedger, ReceiptLineRow } from "@/components/ui/receipt-lines";
import { api } from "@convex/_generated/api";
import type { Campaign } from "@/lib/types";
import { formatCurrency } from "@/lib/constants";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { canCreate } from "@/lib/auth/user-type";

export default function HomePage() {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
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
  const allCampaigns = (useQuery(api.campaigns.list) ?? []) as Campaign[];

  const matchBySlug = useMemo(() => {
    const map = new Map<
      string,
      { multiplier: number }
    >();
    for (const match of activeMatches) {
      map.set(match.campaignSlug, { multiplier: match.multiplier });
    }
    return map;
  }, [activeMatches]);

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
  const totalRaised = allCampaigns.reduce((sum, c) => sum + c.raised, 0);
  const campaignCount = allCampaigns.length;
  const showForYou =
    isAuthenticated &&
    Boolean(profileCollege) &&
    forYouCampaigns &&
    forYouCampaigns.length > 0;

  return (
    <AppShell>
      <RetroDinoHero />

      <View className="mb-10">
        <View className="mb-6 items-center">
          <Text className="font-retro-bold text-2xl text-retro-ink">
            Trending Campaigns
          </Text>
          <Text className="mt-1 text-center text-dono-muted">
            Tangible projects with clear, specific outcomes so you can see exactly what your donation does
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator color="#211E1A" />
        ) : (
          <CampaignCardGrid
            campaigns={trendingCampaigns!}
            featured
            getBadges={getBadges}
          />
        )}
      </View>

      {nearGoalCampaigns && nearGoalCampaigns.length > 0 ? (
        <View className="mb-10">
          <View className="mb-6 items-center">
            <Text className="font-retro-bold text-2xl text-retro-ink">
              Almost there
            </Text>
            <Text className="mt-1 text-center text-dono-muted">
              Campaigns close to their goal — your gift can tip them over
            </Text>
          </View>
          <CampaignCardGrid
            campaigns={nearGoalCampaigns}
            featured
            getBadges={getBadges}
          />
        </View>
      ) : null}

      {showForYou ? (
        <View className="mb-10">
          <View className="mb-6 items-center">
            <Text className="font-retro-bold text-2xl text-retro-ink">
              From your college
            </Text>
            <Text className="mt-1 text-center text-dono-muted">
              Campaigns connected to {profile?.college}
            </Text>
          </View>
          <CampaignCardGrid
            campaigns={forYouCampaigns!}
            featured
            getBadges={getBadges}
          />
        </View>
      ) : null}

      <RetroPanel title="IMPACT.dat" accent="coral" className="mb-0">
        <Text className="text-center font-retro-bold text-2xl text-retro-ink">
          Ready to make a difference?
        </Text>
        <Text className="mx-auto mt-3 max-w-lg text-center text-dono-muted">
          Join young alumni building lifelong communities of generosity. Every
          donation deserves a visible outcome.
        </Text>

        <ReceiptLedger className="mx-auto mt-8 max-w-md">
          <ReceiptLineRow label="Given on Dono" amount={totalRaised} />
          <ReceiptDivider />
          <ReceiptLineRow
            label="Campaigns funded"
            amount={campaignCount.toString()}
          />
          <ReceiptDivider />
          <ReceiptLineRow label="Platform fee" amount="0%" />
        </ReceiptLedger>

        <Text className="mt-2 text-center font-retro-mono text-xs text-[#5c574f]">
          {formatCurrency(totalRaised)} raised across {campaignCount} campaigns
        </Text>

        <View
          className={
            isWide
              ? "mx-auto mt-8 flex-row justify-center gap-3"
              : "mt-8 gap-3"
          }
        >
          <Link href="/campaigns" asChild>
            <Pressable
              className={`retro-key flex-row items-center justify-center gap-2 rounded-full border-2 border-retro-ink bg-retro-mint px-6 py-3 ${
                isWide ? "" : "w-full"
              }`}
            >
              <Text className="font-retro-bold text-sm text-retro-paper">
                Find a Campaign
              </Text>
              <ArrowRight size={16} color="#F7F3E8" />
            </Pressable>
          </Link>
          {canCreate(profile) ? (
            <Link href="/create" asChild>
              <Pressable
                className={`retro-key flex-row items-center justify-center gap-2 rounded-full border-2 border-retro-ink bg-retro-paper px-6 py-3 ${
                  isWide ? "" : "w-full"
                }`}
              >
                <Text className="font-retro-bold text-sm text-retro-ink">
                  Start a Campaign
                </Text>
              </Pressable>
            </Link>
          ) : null}
        </View>
      </RetroPanel>
    </AppShell>
  );
}
