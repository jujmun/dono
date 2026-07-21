import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "convex/react";
import { type Href, useRouter } from "expo-router";
import { ChevronRight, Search } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import { AdminShell } from "@/components/admin-shell";
import { AdminStatsNav } from "@/components/admin-stats-nav";
import { CampaignCardGrid } from "@/components/campaign-card-grid";
import { ReviewTypeToggle, type ReviewType } from "@/components/review-type-toggle";
import { AdminStatusChip } from "@/lib/admin-labels";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { isPortalAdmin } from "@/lib/auth/is-portal-admin";
import type { AdminSociety, Campaign } from "@/lib/types";

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

function matchesSocietySearch(society: AdminSociety, query: string) {
  if (!query) return true;
  return society.name.toLowerCase().includes(query.toLowerCase());
}

export default function AdminDiscoverPage() {
  const router = useRouter();
  const profile = useCurrentProfile();
  const adminUser = isPortalAdmin(profile);
  const [reviewType, setReviewType] = useState<ReviewType>("campaigns");
  const [search, setSearch] = useState("");
  const trimmedSearch = search.trim();
  const campaigns = (useQuery(
    api.campaigns.list,
    adminUser && reviewType === "campaigns" ? {} : "skip",
  ) ?? undefined) as Campaign[] | undefined;
  const societies = useQuery(
    api.societies.listActiveForAdmin,
    adminUser && reviewType === "societies" ? {} : "skip",
  ) as AdminSociety[] | undefined;

  const liveCampaigns = [...(campaigns ?? []).filter((c) =>
    matchesCampaignSearch(c, trimmedSearch),
  )].sort((a, b) => b.likes + b.donors - (a.likes + a.donors));
  const liveSocieties = (societies ?? []).filter((s) =>
    matchesSocietySearch(s, trimmedSearch),
  );

  if (profile === undefined) {
    return (
      <AdminShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
        </View>
      </AdminShell>
    );
  }

  if (!adminUser) {
    return (
      <AdminShell>
        <View className="mx-auto w-full max-w-lg px-4 py-16">
          <Text className="font-retro-bold text-2xl text-dono-text">
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

        <ReviewTypeToggle value={reviewType} onChange={setReviewType} />

        <View className="mb-6 flex-row items-center gap-2 rounded-xl border border-dono-border bg-white px-3 py-2">
          <Search size={16} color="#56615A" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={
              reviewType === "campaigns"
                ? "Search by name or title…"
                : "Search by society name…"
            }
            placeholderTextColor="#56615A"
            className="flex-1 py-2 text-sm text-dono-text"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {reviewType === "campaigns" ? (
          <View>
            <Text className="mb-4 text-lg font-retro-bold text-dono-text">
              {trimmedSearch ? "Matching posts" : "All live posts"}
            </Text>
            {campaigns === undefined ? (
              <ActivityIndicator color="#17211B" />
            ) : liveCampaigns.length === 0 ? (
              <View className="rounded-2xl border border-dono-border bg-white p-6">
                <Text className="text-center font-retro-bold text-dono-text">
                  {trimmedSearch ? "No matches" : "No live posts yet"}
                </Text>
                <Text className="mt-2 text-center text-sm text-dono-muted">
                  {trimmedSearch
                    ? "Try a different name or title."
                    : "Approved posts will appear here."}
                </Text>
              </View>
            ) : (
              <CampaignCardGrid
                campaigns={liveCampaigns}
                getHref={(campaign) => `/admin/${campaign.id}` as Href}
              />
            )}
          </View>
        ) : (
          <View>
            <Text className="mb-4 text-lg font-retro-bold text-dono-text">
              {trimmedSearch ? "Matching societies" : "All live societies"}
            </Text>
            {societies === undefined ? (
              <ActivityIndicator color="#17211B" />
            ) : liveSocieties.length === 0 ? (
              <View className="rounded-2xl border border-dono-border bg-white p-6">
                <Text className="text-center font-retro-bold text-dono-text">
                  {trimmedSearch ? "No matches" : "No live societies yet"}
                </Text>
                <Text className="mt-2 text-center text-sm text-dono-muted">
                  {trimmedSearch
                    ? "Try a different society name."
                    : "Approved societies will appear here."}
                </Text>
              </View>
            ) : (
              <View className="gap-4">
                {liveSocieties.map((society) => (
                  <Pressable
                    key={society.slug}
                    onPress={() =>
                      router.push(
                        `/admin/societies/${encodeURIComponent(society.slug)}` as Href,
                      )
                    }
                    className="flex-row items-center justify-between gap-3 rounded-2xl border border-dono-border bg-white p-5"
                  >
                    <View className="flex-1">
                      <View className="mb-2">
                        <AdminStatusChip label="Live" tone="live" />
                      </View>
                      <Text className="font-retro-bold text-lg text-dono-text">
                        {society.name}
                      </Text>
                      <Text className="mt-1 text-sm text-dono-muted" numberOfLines={2}>
                        {society.description}
                      </Text>
                    </View>
                    <View className="items-center gap-0.5 pt-1">
                      <Text className="text-xs font-retro-bold text-dono-muted">
                        Open
                      </Text>
                      <ChevronRight size={18} color="#56615A" />
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </AdminShell>
  );
}
