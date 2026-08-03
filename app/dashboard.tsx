import { Link } from "expo-router";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useConvexAuth, useQuery } from "convex/react";
import { useMemo } from "react";
import {
  Gift,
  Heart,
  Users,
  ArrowRight,
  Calendar,
} from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { CampaignCardGrid } from "@/components/campaign-card-grid";
import { SocietyCard } from "@/components/society-card";
import { LoginGate } from "@/components/login-gate";
import {
  ReceiptDivider,
  ReceiptLedger,
  ReceiptLineRow,
} from "@/components/ui/receipt-lines";
import { formatCurrency } from "@/lib/constants";
import type { Campaign, DonorImpact, Society } from "@/lib/types";
import { api } from "@convex/_generated/api";

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const donorImpact = useQuery(
    api.donations.getDonorImpact,
    isAuthenticated ? {} : "skip",
  ) as DonorImpact | null | undefined;
  const donoWrapped = useQuery(
    api.donations.getDonoWrapped,
    isAuthenticated ? {} : "skip",
  );
  const followedCampaigns = useQuery(
    api.engagement.listFollowedCampaigns,
    isAuthenticated ? {} : "skip",
  ) as Campaign[] | undefined;
  const followedSocietySlugs = useQuery(
    api.engagement.listFollowedSocieties,
    isAuthenticated ? {} : "skip",
  ) as string[] | undefined;
  const societies = useQuery(
    api.societies.listActive,
    isAuthenticated ? {} : "skip",
  ) as Society[] | undefined;
  const followedSocieties = useMemo(() => {
    if (!followedSocietySlugs || !societies) return undefined;
    return followedSocietySlugs
      .map((slug) => societies.find((society) => society.slug === slug))
      .filter((society): society is Society => society != null);
  }, [followedSocietySlugs, societies]);

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

  if (donorImpact === undefined || followedCampaigns === undefined || followedSocieties === undefined) {
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
    societiesFollowed: 0,
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
            label: "Societies",
            value: impact.societiesFollowed.toString(),
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

      {donoWrapped ? (
        <View className="mb-8 rounded-[14px] border-[3px] border-retro-ink bg-retro-mint/15 p-5 shadow-[5px_5px_0_#211E1A]">
          <Text className="font-retro-mono text-xs uppercase text-[#5c574f]">
            Your {donoWrapped.year}
          </Text>
          <Text className="mt-1 font-retro-bold text-xl text-retro-ink">
            {donoWrapped.rank}
          </Text>
          <Text className="mt-2 text-sm leading-relaxed text-dono-muted">
            {formatCurrency(donoWrapped.totalDonated)} across{" "}
            {donoWrapped.campaignsSupported} campaign
            {donoWrapped.campaignsSupported === 1 ? "" : "s"}
            {donoWrapped.topSociety
              ? ` · Top society: ${donoWrapped.topSociety}`
              : ""}
          </Text>
          <Text className="mt-2 text-sm text-dono-text">
            {donoWrapped.impactStatement}
          </Text>
        </View>
      ) : null}

        <View>
          <View className="mb-4 flex-row items-center gap-2">
            <Calendar size={20} color="#17211B" />
            <Text className="text-lg font-retro-bold text-dono-text">
              Recent Donations
            </Text>
          </View>
          <ReceiptLedger>
            {impact.recentDonations.length > 0 ? (
              impact.recentDonations.map((donation, i) => (
                <View key={i}>
                  {i > 0 ? <ReceiptDivider /> : null}
                  <ReceiptLineRow
                    label={donation.campaign}
                    amount={donation.amount}
                  />
                  <Text className="-mt-1.5 text-xs text-dono-muted">
                    {new Date(donation.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              ))
            ) : (
              <Text className="text-sm text-dono-muted">
                No donations yet. Explore campaigns to get started.
              </Text>
            )}
          </ReceiptLedger>
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
              Societies You Follow
            </Text>
            <Link href="/societies" asChild>
              <Pressable className="flex-row items-center gap-1">
                <Text className="font-retro-bold text-sm text-dono-primary">Browse more</Text>
                <ArrowRight size={16} color="#17211B" />
              </Pressable>
            </Link>
          </View>
          {followedSocieties.length > 0 ? (
            <View className="flex-row flex-wrap justify-between gap-y-6">
              {followedSocieties.map((society) => (
                <View key={society.slug} className="w-[48%]">
                  <SocietyCard society={society} />
                </View>
              ))}
            </View>
          ) : (
            <View className="rounded-xl border border-dono-border bg-white p-4">
              <Text className="text-sm text-dono-muted">
                You are not following any societies yet.
              </Text>
              <Link href="/societies" asChild>
                <Pressable className="mt-3 flex-row items-center gap-1 self-start">
                  <Text className="font-retro-bold text-sm text-dono-primary">
                    Browse societies to follow
                  </Text>
                  <ArrowRight size={16} color="#17211B" />
                </Pressable>
              </Link>
            </View>
          )}
        </View>
    </AppShell>
  );
}
