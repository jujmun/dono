import { Link } from "expo-router";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useQuery } from "convex/react";
import {
  Gift,
  Heart,
  Users,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Calendar,
} from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { CampaignCard } from "@/components/campaign-card";
import { formatCurrency } from "@/lib/constants";
import type { Campaign, DonorImpact, DonoWrapped } from "@/lib/types";
import { api } from "@convex/_generated/api";

export default function DashboardPage() {
  const donorImpact = useQuery(api.donations.getDonorImpact) as
    | DonorImpact
    | null
    | undefined;
  const donoWrapped = useQuery(api.donations.getDonoWrapped) as
    | DonoWrapped
    | null
    | undefined;
  const campaigns = (useQuery(api.campaigns.list) ?? []) as Campaign[];
  const followedCampaigns = campaigns.slice(0, 2);

  if (donorImpact === undefined || donoWrapped === undefined) {
    return (
      <AppShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#0d5c4b" />
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

  const wrapped = donoWrapped ?? {
    year: new Date().getFullYear(),
    totalDonated: 0,
    campaignsSupported: 0,
    topCommunity: "Your communities",
    rank: "Start your giving journey",
    impactStatement:
      "Make your first donation to see your impact grow throughout the year.",
  };

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-7xl px-4 py-8">
        <View className="mb-8">
          <Text className="text-2xl font-bold text-dono-text">Your Impact</Text>
          <Text className="mt-1 text-dono-muted">
            Track your generosity and see the difference you&apos;ve made
          </Text>
        </View>

        <View className="mb-8 flex-row gap-4">
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
              className="flex-1 rounded-2xl border border-dono-border bg-white p-4"
            >
              <stat.icon size={20} color="#0d5c4b" />
              <Text className="mt-2 text-xl font-bold text-dono-text">{stat.value}</Text>
              <Text className="text-xs text-dono-muted">{stat.label}</Text>
            </View>
          ))}
        </View>

        <View className="mb-8 overflow-hidden rounded-2xl bg-dono-primary p-6">
          <View className="mb-2 flex-row items-center gap-2">
            <Sparkles size={20} color="#e8724a" />
            <Text className="text-sm font-semibold uppercase tracking-wider text-emerald-200">
              Dono Wrapped {wrapped.year}
            </Text>
          </View>
          <Text className="mb-2 text-2xl font-bold text-white">{wrapped.rank}</Text>
          <Text className="leading-relaxed text-emerald-100">{wrapped.impactStatement}</Text>

          <View className="mt-6 flex-row gap-4 border-t border-white/20 pt-6">
            <View className="flex-1">
              <Text className="text-lg font-bold text-white">
                {formatCurrency(wrapped.totalDonated)}
              </Text>
              <Text className="text-xs text-emerald-200">donated</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-white">
                {wrapped.campaignsSupported}
              </Text>
              <Text className="text-xs text-emerald-200">campaigns</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-white" numberOfLines={1}>
                {wrapped.topCommunity}
              </Text>
              <Text className="text-xs text-emerald-200">top community</Text>
            </View>
          </View>
        </View>

        <View className="gap-8">
          <View>
            <View className="mb-4 flex-row items-center gap-2">
              <TrendingUp size={20} color="#0d5c4b" />
              <Text className="text-lg font-semibold text-dono-text">Your Impact</Text>
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
              <Calendar size={20} color="#0d5c4b" />
              <Text className="text-lg font-semibold text-dono-text">
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
                      <Text className="text-sm font-medium text-dono-text">
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
                    <Text className="text-sm font-bold text-dono-primary">
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
            <Text className="text-lg font-semibold text-dono-text">
              Campaigns You Follow
            </Text>
            <Link href="/campaigns" asChild>
              <Pressable className="flex-row items-center gap-1">
                <Text className="text-sm font-semibold text-dono-primary">Browse more</Text>
                <ArrowRight size={16} color="#0d5c4b" />
              </Pressable>
            </Link>
          </View>
          <View className="gap-6">
            {followedCampaigns.length > 0 ? (
              followedCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} variant="compact" />
              ))
            ) : (
              <View className="rounded-xl border border-dono-border bg-white p-4">
                <Text className="text-sm text-dono-muted">
                  You are not following any campaigns yet.
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </AppShell>
  );
}
