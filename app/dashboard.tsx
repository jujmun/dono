import { Link } from "expo-router";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useConvexAuth, useQuery } from "convex/react";
import { useMemo } from "react";
import {
  Gift,
  Heart,
  Users,
  ArrowRight,
  TrendingUp,
  Calendar,
} from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { CampaignCardGrid } from "@/components/campaign-card-grid";
import { CommunityCard } from "@/components/community-card";
import { LoginGate } from "@/components/login-gate";
import { formatCurrency } from "@/lib/constants";
import type { Campaign, Community, DonorImpact } from "@/lib/types";
import { api } from "@convex/_generated/api";

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const donorImpact = useQuery(
    api.donations.getDonorImpact,
    isAuthenticated ? {} : "skip",
  ) as DonorImpact | null | undefined;
  const followedCampaigns = useQuery(
    api.engagement.listFollowedCampaigns,
    isAuthenticated ? {} : "skip",
  ) as Campaign[] | undefined;
  const followedCommunitySlugs = useQuery(
    api.engagement.listFollowedCommunities,
    isAuthenticated ? {} : "skip",
  ) as string[] | undefined;
  const communities = useQuery(
    api.communities.list,
    isAuthenticated ? {} : "skip",
  ) as Community[] | undefined;
  const followedCommunities = useMemo(() => {
    if (!followedCommunitySlugs || !communities) return undefined;
    return followedCommunitySlugs
      .map((slug) => communities.find((community) => community.id === slug))
      .filter((community): community is Community => community != null);
  }, [followedCommunitySlugs, communities]);

  if (isLoading) {
    return (
      <AppShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
        </View>
      </AppShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <AppShell>
        <LoginGate message="Sign in to track your generosity and see your impact." />
      </AppShell>
    );
  }

  if (donorImpact === undefined || followedCampaigns === undefined || followedCommunities === undefined) {
    return (
      <AppShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
          <Text className="mt-4 text-dono-muted">Loading your impact...</Text>
        </View>
      </AppShell>
    );
  }

  const impact = donorImpact ?? {
    totalDonated: 0,
    campaignsSupported: 0,
    communitiesFollowed: 0,
    impactHighlights: [],
    recentDonations: [],
  };

  return (
    <AppShell>
      <View className="mb-8">
        <Text className="font-retro-bold text-[32px] text-retro-ink">Your Impact</Text>
        <Text className="mt-1 text-dono-muted">
          Track your generosity and see the difference you&apos;ve made
        </Text>
      </View>

      <View className="mb-8 flex-row flex-wrap gap-4">
        {[
          {
            icon: Gift,
            label: "Total Donated",
            value: formatCurrency(impact.totalDonated),
          },
          {
            icon: Heart,
            label: "Campaigns Supported",
            value: impact.campaignsSupported.toString(),
          },
          {
            icon: Users,
            label: "Communities",
            value: impact.communitiesFollowed.toString(),
          },
        ].map((stat) => (
          <View
            key={stat.label}
            className="min-w-[140px] flex-1 rounded-[14px] border-[3px] border-retro-ink bg-retro-cream p-4 shadow-[5px_5px_0_#211E1A]"
          >
            <stat.icon size={20} color="#211E1A" />
            <Text className="mt-2 font-retro-bold text-xl text-retro-ink">{stat.value}</Text>
            <Text className="font-retro-mono text-xs text-dono-muted">{stat.label}</Text>
          </View>
        ))}
      </View>

        <View className="gap-8">
          <View>
            <View className="mb-4 flex-row items-center gap-2">
              <TrendingUp size={20} color="#17211B" />
              <Text className="text-lg font-retro-bold text-dono-text">Your Impact</Text>
            </View>
            <View className="gap-3">
              {impact.impactHighlights.length > 0 ? (
                impact.impactHighlights.map((highlight, i) => (
                  <View
                    key={i}
                    className="rounded-xl border border-dono-border bg-white p-4"
                  >
                    <Text className="text-sm leading-relaxed text-dono-text">
                      {highlight}
                    </Text>
                  </View>
                ))
              ) : (
                <View className="rounded-xl border border-dono-border bg-white p-4">
                  <Text className="text-sm text-dono-muted">
                    Your impact highlights will appear here after your first donation.
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View>
            <View className="mb-4 flex-row items-center gap-2">
              <Calendar size={20} color="#17211B" />
              <Text className="text-lg font-retro-bold text-dono-text">
                Recent Donations
              </Text>
            </View>
            <View className="gap-3">
              {impact.recentDonations.length > 0 ? (
                impact.recentDonations.map((donation, i) => (
                  <View
                    key={i}
                    className="flex-row items-center justify-between rounded-xl border border-dono-border bg-white p-4"
                  >
                    <View>
                      <Text className="font-retro-bold text-sm text-dono-text">
                        {donation.campaign}
                      </Text>
                      <Text className="text-xs text-dono-muted">
                        {new Date(donation.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Text>
                    </View>
                    <Text className="font-retro-mono-bold text-sm text-dono-primary">
                      {formatCurrency(donation.amount)}
                    </Text>
                  </View>
                ))
              ) : (
                <View className="rounded-xl border border-dono-border bg-white p-4">
                  <Text className="text-sm text-dono-muted">
                    No donations yet. Explore campaigns to get started.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View className="mt-8">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-retro-bold text-dono-text">
              Campaigns You Follow
            </Text>
            <Link href="/campaigns" asChild>
              <Pressable className="flex-row items-center gap-1">
                <Text className="font-retro-bold text-sm text-dono-primary">Browse more</Text>
                <ArrowRight size={16} color="#17211B" />
              </Pressable>
            </Link>
          </View>
          {followedCampaigns.length > 0 ? (
            <CampaignCardGrid campaigns={followedCampaigns} variant="compact" />
          ) : (
            <View className="rounded-xl border border-dono-border bg-white p-4">
              <Text className="text-sm text-dono-muted">
                You are not following any campaigns yet. Follow campaigns from their
                detail pages to see them here.
              </Text>
            </View>
          )}
        </View>

        <View className="mt-8">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-retro-bold text-dono-text">
              Communities You Follow
            </Text>
            <Link href="/societies" asChild>
              <Pressable className="flex-row items-center gap-1">
                <Text className="font-retro-bold text-sm text-dono-primary">Browse more</Text>
                <ArrowRight size={16} color="#17211B" />
              </Pressable>
            </Link>
          </View>
          {followedCommunities.length > 0 ? (
            <View className="flex-row flex-wrap justify-between gap-y-6">
              {followedCommunities.map((community) => (
                <View key={community.id} className="w-[48%]">
                  <CommunityCard community={community} />
                </View>
              ))}
            </View>
          ) : (
            <View className="rounded-xl border border-dono-border bg-white p-4">
              <Text className="text-sm text-dono-muted">
                You are not following any communities yet. Follow societies from their
                profile pages to see them here.
              </Text>
            </View>
          )}
        </View>
    </AppShell>
  );
}
