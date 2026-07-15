import { View, Text, ActivityIndicator } from "react-native";
import { useQuery } from "convex/react";
import { Sparkles } from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { ActivityFeedItem } from "@/components/activity-feed";
import { CampaignCard } from "@/components/campaign-card";
import { api } from "@convex/_generated/api";
import type { ActivityItem, Campaign } from "@/lib/types";

export default function DiscoverPage() {
  const campaigns = (useQuery(api.campaigns.list) ?? undefined) as
    | Campaign[]
    | undefined;
  const activityFeed = (useQuery(api.activity.list) ?? undefined) as
    | ActivityItem[]
    | undefined;

  const trending = [...(campaigns ?? [])]
    .sort((a, b) => b.likes + b.donors - (a.likes + a.donors))
    .slice(0, 3);

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-7xl px-4 py-8">
        <View className="mb-8">
          <Text className="font-display-medium text-2xl text-dono-text">Discover</Text>
          <Text className="mt-1 text-dono-muted">
            See what&apos;s happening across the Dono community
          </Text>
        </View>

        <View className="gap-8">
          <View>
            <View className="mb-4 flex-row items-center gap-2">
              <Sparkles size={20} color="#17211B" />
              <Text className="text-lg font-sans-medium text-dono-text">
                Trending Campaigns
              </Text>
            </View>
            {campaigns === undefined ? (
              <ActivityIndicator color="#17211B" />
            ) : trending.length === 0 ? (
              <View className="rounded-2xl border border-dono-border bg-white p-6">
                <Text className="text-center text-dono-muted">
                  No campaigns yet. Check back soon or start the first campaign.
                </Text>
              </View>
            ) : (
              <View className="gap-6">
                {trending.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </View>
            )}
          </View>

          <View>
            <Text className="mb-4 text-lg font-sans-medium text-dono-text">
              Live Activity
            </Text>
            {activityFeed === undefined ? (
              <ActivityIndicator color="#17211B" />
            ) : activityFeed.length === 0 ? (
              <View className="rounded-2xl border border-dono-border bg-white p-6">
                <Text className="text-center text-dono-muted">
                  No activity yet.
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {activityFeed.map((item) => (
                  <ActivityFeedItem key={item.id} item={item} />
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </AppShell>
  );
}
