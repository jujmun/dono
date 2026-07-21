import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useQuery } from "convex/react";
import { type Href, useRouter } from "expo-router";
import { ChevronRight, Search } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import { AdminShell } from "@/components/admin-shell";
import { AdminStatsNav } from "@/components/admin-stats-nav";
import {
  AdminStatusChip,
  moderationActionLabel,
  statusChipTone,
} from "@/lib/admin-labels";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { isPortalAdmin } from "@/lib/auth/is-portal-admin";
import { formatCurrency } from "@/lib/constants";
import type { AdminSociety, Campaign } from "@/lib/types";

function formatModeratedAt(ms: number | undefined | null) {
  if (!ms) return null;
  return new Date(ms).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function matchesSearch(campaign: Campaign, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    campaign.title.toLowerCase().includes(q) ||
    campaign.university.toLowerCase().includes(q) ||
    campaign.creator.name.toLowerCase().includes(q)
  );
}

function matchesSocietySearch(society: AdminSociety, query: string) {
  if (!query) return true;
  return society.name.toLowerCase().includes(query.toLowerCase());
}

export default function AdminArchivePage() {
  const router = useRouter();
  const profile = useCurrentProfile();
  const adminUser = isPortalAdmin(profile);
  const [search, setSearch] = useState("");
  const trimmedSearch = search.trim();
  const moderated = useQuery(
    api.campaigns.listModeratedForAdmin,
    adminUser ? {} : "skip",
  ) as Campaign[] | undefined;
  const moderatedSocieties = useQuery(
    api.societies.listModeratedForAdmin,
    adminUser ? {} : "skip",
  ) as AdminSociety[] | undefined;

  const filtered = (moderated ?? []).filter((c) =>
    matchesSearch(c, trimmedSearch),
  );
  const filteredSocieties = (moderatedSocieties ?? []).filter((s) =>
    matchesSocietySearch(s, trimmedSearch),
  );

  if (profile === undefined) {
    return (
      <AdminShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
          <Text className="mt-4 text-dono-muted">Loading...</Text>
        </View>
      </AdminShell>
    );
  }

  if (!adminUser || profile === null) {
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
        <AdminStatsNav active="removed" />

        <View className="mb-6 flex-row items-center gap-2 rounded-xl border border-dono-border bg-white px-3 py-2">
          <Search size={16} color="#56615A" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name or title…"
            placeholderTextColor="#56615A"
            className="flex-1 py-2 text-sm text-dono-text"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Text className="mb-4 text-lg font-retro-bold text-dono-text">
          Campaigns
        </Text>
        {moderated === undefined ? (
          <View className="items-center py-12">
            <ActivityIndicator color="#17211B" />
            <Text className="mt-4 text-dono-muted">Loading posts...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View className="rounded-2xl border border-dono-border bg-white px-6 py-10">
            <Text className="font-retro-bold text-base text-dono-text">
              {trimmedSearch ? "No matches" : "Nothing removed yet"}
            </Text>
            <Text className="mt-2 text-sm text-dono-muted">
              {trimmedSearch
                ? "Try a different name or title."
                : "Denied submissions and take-downs will appear here."}
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {filtered.map((campaign) => {
              const when = formatModeratedAt(campaign.moderatedAt);
              const badge =
                moderationActionLabel(campaign.moderationAction) ?? "Removed";
              return (
                <Pressable
                  key={campaign.id}
                  onPress={() =>
                    router.push(
                      `/admin/${encodeURIComponent(campaign.id)}` as Href,
                    )
                  }
                  className="rounded-2xl border border-dono-border bg-white p-5"
                >
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <View className="mb-2 flex-row flex-wrap items-center gap-2">
                        <AdminStatusChip
                          label={badge}
                          tone={statusChipTone(badge)}
                        />
                        {when ? (
                          <Text className="text-xs text-dono-muted">{when}</Text>
                        ) : null}
                      </View>
                      <Text className="font-retro-bold text-lg text-dono-text">
                        {campaign.title}
                      </Text>
                      <Text className="mt-1 text-sm text-dono-muted">
                        {campaign.creator.name} · {campaign.university} · Goal{" "}
                        {formatCurrency(campaign.goal)}
                      </Text>
                      {campaign.moderationNote ? (
                        <Text
                          className="mt-3 text-sm text-dono-text"
                          numberOfLines={2}
                        >
                          {campaign.moderationNote}
                        </Text>
                      ) : null}
                    </View>
                    <View className="items-center gap-0.5 pt-1">
                      <Text className="text-xs font-retro-bold text-dono-muted">
                        Open
                      </Text>
                      <ChevronRight size={18} color="#56615A" />
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        <Text className="mb-4 mt-8 text-lg font-retro-bold text-dono-text">
          Societies
        </Text>
        {moderatedSocieties === undefined ? (
          <View className="items-center py-12">
            <ActivityIndicator color="#17211B" />
            <Text className="mt-4 text-dono-muted">Loading societies...</Text>
          </View>
        ) : filteredSocieties.length === 0 ? (
          <View className="rounded-2xl border border-dono-border bg-white px-6 py-10">
            <Text className="font-retro-bold text-base text-dono-text">
              {trimmedSearch ? "No matches" : "Nothing removed yet"}
            </Text>
            <Text className="mt-2 text-sm text-dono-muted">
              {trimmedSearch
                ? "Try a different society name."
                : "Denied applications and take-downs will appear here."}
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {filteredSocieties.map((society) => {
              const when = formatModeratedAt(society.moderatedAt);
              const badge = moderationActionLabel(society.moderationAction) ?? "Removed";
              return (
                <Pressable
                  key={society.slug}
                  onPress={() =>
                    router.push(
                      `/admin/societies/${encodeURIComponent(society.slug)}` as Href,
                    )
                  }
                  className="rounded-2xl border border-dono-border bg-white p-5"
                >
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <View className="mb-2 flex-row flex-wrap items-center gap-2">
                        <AdminStatusChip label={badge} tone={statusChipTone(badge)} />
                        {when ? (
                          <Text className="text-xs text-dono-muted">{when}</Text>
                        ) : null}
                      </View>
                      <Text className="font-retro-bold text-lg text-dono-text">
                        {society.name}
                      </Text>
                      {society.moderationNote ? (
                        <Text className="mt-3 text-sm text-dono-text" numberOfLines={2}>
                          {society.moderationNote}
                        </Text>
                      ) : null}
                    </View>
                    <View className="items-center gap-0.5 pt-1">
                      <Text className="text-xs font-retro-bold text-dono-muted">
                        Open
                      </Text>
                      <ChevronRight size={18} color="#56615A" />
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </AdminShell>
  );
}
