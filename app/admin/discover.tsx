import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "convex/react";
import { type Href } from "expo-router";
import { Search } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import { AdminShell } from "@/components/admin-shell";
import { AdminStatsNav } from "@/components/admin-stats-nav";
import { ActivityFeedItem } from "@/components/activity-feed";
import { CampaignCard } from "@/components/campaign-card";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { isPortalAdmin } from "@/lib/auth/is-portal-admin";
import type { ActivityItem, Campaign } from "@/lib/types";

function matchesCampaignSearch(campaign: Campaign, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    campaign.title.toLowerCase().includes(q) ||
    campaign.university.toLowerCase().includes(q) ||
    campaign.creator.name.toLowerCase().includes(q) ||
    campaign.description.toLowerCase().includes(q)
  );
}

export default function AdminDiscoverPage() {
  const profile = useCurrentProfile();
  const adminUser = isPortalAdmin(profile);
  const [search, setSearch] = useState("");
  const trimmedSearch = search.trim();
  const campaigns = (useQuery(
    api.campaigns.list,
    adminUser ? {} : "skip",
  ) ?? undefined) as Campaign[] | undefined;
  const activityFeed = (useQuery(
    api.activity.list,
    adminUser && !trimmedSearch ? {} : "skip",
  ) ?? undefined) as ActivityItem[] | undefined;

  const liveCampaigns = [...(campaigns ?? []).filter((c) =>
    matchesCampaignSearch(c, trimmedSearch),
  )].sort((a, b) => b.likes + b.donors - (a.likes + a.donors));

  if (profile === undefined) {
    return (
      <AdminShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#1d242f" />
        </View>
      </AdminShell>
    );
  }

  if (!adminUser) {
    return (
      <AdminShell>
        <View className="mx-auto w-full max-w-lg px-4 py-16">
          <Text className="font-display-medium text-2xl text-dono-text">
            Access denied
          </Text>
        </View>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <View className="mx-auto w-full max-w-3xl px-4 py-8">
        <AdminStatsNav active="live" />

        <View className="mb-6 flex-row items-center gap-2 rounded-xl border border-dono-border bg-white px-3 py-2">
          <Search size={16} color="#5e6473" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name or title…"
            placeholderTextColor="#5e6473"
            className="flex-1 py-2 text-sm text-dono-text"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View className="gap-8">
          <View>
            <Text className="mb-4 text-lg font-sans-medium text-dono-text">
              {trimmedSearch ? "Matching posts" : "All live posts"}
            </Text>
            {campaigns === undefined ? (
              <ActivityIndicator color="#1d242f" />
            ) : liveCampaigns.length === 0 ? (
              <View className="rounded-2xl border border-dono-border bg-white p-6">
                <Text className="text-center font-sans-medium text-dono-text">
                  {trimmedSearch ? "No matches" : "No live posts yet"}
                </Text>
                <Text className="mt-2 text-center text-sm text-dono-muted">
                  {trimmedSearch
                    ? "Try a different name or title."
                    : "Approved posts will appear here."}
                </Text>
              </View>
            ) : (
              <View className="gap-6">
                {liveCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    href={`/admin/${campaign.id}` as Href}
                  />
                ))}
              </View>
            )}
          </View>

          {!trimmedSearch &&
          activityFeed !== undefined &&
          activityFeed.length > 0 ? (
            <View>
              <Text className="mb-4 text-lg font-sans-medium text-dono-text">
                Recent activity
              </Text>
              <View className="gap-3">
                {activityFeed.map((item) => (
                  <ActivityFeedItem key={item.id} item={item} />
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </AdminShell>
  );
}
