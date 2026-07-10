import { Link, useLocalSearchParams } from "expo-router";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useQuery } from "convex/react";
import { UserPlus, ArrowLeft, Target } from "lucide-react-native";
import { usePostHog } from "posthog-react-native";
import { AppShell } from "@/components/app-shell";
import { CampaignImage } from "@/components/ui/campaign-image";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { CampaignCard } from "@/components/campaign-card";
import { formatCurrency } from "@/lib/constants";
import type { Campaign, Community, VerificationType } from "@/lib/types";
import { api } from "@convex/_generated/api";

export default function CommunityDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const posthog = usePostHog();
  const community = useQuery(api.communities.getBySlug, {
    slug: id ?? "",
  }) as Community | null | undefined;

  const communityCampaigns = useQuery(
    api.campaigns.listByCommunity,
    id ? { communityId: id } : "skip"
  ) as Campaign[] | undefined;

  if (community === undefined) {
    return (
      <AppShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#1d242f" />
        </View>
      </AppShell>
    );
  }

  if (community === null) {
    return (
      <AppShell>
        <View className="mx-auto w-full max-w-7xl px-4 py-16">
          <Text className="text-center text-dono-muted">Community not found.</Text>
          <Link href="/communities" asChild>
            <Pressable className="mt-4 items-center">
              <Text className="font-sans-medium text-dono-primary">Back to communities</Text>
            </Pressable>
          </Link>
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-7xl px-4 py-6">
        <Link href="/communities" asChild>
          <Pressable className="mb-4 flex-row items-center gap-1">
            <ArrowLeft size={16} color="#5e6473" />
            <Text className="text-sm text-dono-muted">Back to communities</Text>
          </Pressable>
        </Link>

        <CampaignImage image={community.coverImage} className="mb-6 h-48 rounded-2xl" />

        <View className="mb-8 gap-4">
          <View className="flex-row items-start gap-4">
            <View className="h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-dono-primary shadow">
              <Text className="font-mono-medium text-xl text-white">{community.avatar}</Text>
            </View>
            <View className="flex-1">
              <View className="mb-2 flex-row flex-wrap items-center gap-2">
                <Text className="font-display-medium text-2xl text-dono-text">{community.name}</Text>
                {community.verified && community.verificationType && (
                  <VerificationBadge
                    verification={{
                      type: community.verificationType as VerificationType,
                      label: "Verified",
                    }}
                  />
                )}
              </View>
              <Text className="text-sm text-dono-muted">{community.university}</Text>
              <Text className="mt-2 leading-relaxed text-dono-muted">
                {community.description}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() =>
              posthog?.capture("community_followed", {
                community_id: community.id,
                community_name: community.name,
                community_university: community.university,
              })
            }
            className="flex-row items-center justify-center gap-2 rounded-full bg-dono-primary px-5 py-2.5"
          >
            <UserPlus size={16} color="#fff" />
            <Text className="font-sans-medium text-sm text-white">Follow</Text>
          </Pressable>
        </View>

        <View className="mb-8 flex-row gap-4">
          {[
            { label: "Followers", value: community.followers.toLocaleString() },
            { label: "Campaigns", value: community.campaigns.toString() },
            {
              label: "Total Raised",
              value: formatCurrency(community.totalRaised),
            },
          ].map((stat) => (
            <View
              key={stat.label}
              className="flex-1 rounded-2xl border border-dono-border bg-white p-4"
            >
              <Text className="text-center font-display-medium text-xl text-dono-text">
                {stat.value}
              </Text>
              <Text className="text-center text-xs text-dono-muted">{stat.label}</Text>
            </View>
          ))}
        </View>

        <View>
          <View className="mb-4 flex-row items-center gap-2">
            <Target size={20} color="#1d242f" />
            <Text className="text-lg font-sans-medium text-dono-text">Active Campaigns</Text>
          </View>
          {communityCampaigns === undefined ? (
            <ActivityIndicator color="#1d242f" />
          ) : communityCampaigns.length === 0 ? (
            <View className="rounded-2xl border border-dono-border bg-white p-8">
              <Text className="text-center text-dono-muted">No active campaigns yet.</Text>
            </View>
          ) : (
            <View className="gap-6">
              {communityCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </View>
          )}
        </View>
      </View>
    </AppShell>
  );
}
