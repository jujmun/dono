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
import { AdminStatusChip } from "@/lib/admin-labels";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { isPortalAdmin } from "@/lib/auth/is-portal-admin";
import { formatCurrency } from "@/lib/constants";
import type { Campaign } from "@/lib/types";

export default function AdminPortalPage() {
  const router = useRouter();
  const profile = useCurrentProfile();
  const adminUser = isPortalAdmin(profile);
  const [search, setSearch] = useState("");
  const trimmedSearch = search.trim();
  const pending = useQuery(
    api.campaigns.listPendingForAdmin,
    adminUser
      ? trimmedSearch
        ? { search: trimmedSearch }
        : {}
      : "skip",
  ) as Campaign[] | undefined;

  if (profile === undefined) {
    return (
      <AdminShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#1d242f" />
          <Text className="mt-4 text-dono-muted">Loading...</Text>
        </View>
      </AdminShell>
    );
  }

  if (!adminUser || profile === null) {
    return (
      <AdminShell>
        <View className="mx-auto w-full max-w-lg px-4 py-16">
          <Text className="font-display-medium text-2xl text-dono-text">
            Access denied
          </Text>
          <Text className="mt-2 text-dono-muted">
            This portal is only available to outreach admins.
          </Text>
        </View>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <View className="mx-auto w-full max-w-3xl px-4 py-8">
        <AdminStatsNav active="waiting" />

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

        {pending === undefined ? (
          <View className="items-center py-12">
            <ActivityIndicator color="#1d242f" />
            <Text className="mt-4 text-dono-muted">Loading posts...</Text>
          </View>
        ) : pending.length === 0 ? (
          <View className="rounded-2xl border border-dono-border bg-white px-6 py-10">
            <Text className="font-sans-medium text-base text-dono-text">
              {trimmedSearch ? "No matches" : "You’re all caught up"}
            </Text>
            <Text className="mt-2 text-sm text-dono-muted">
              {trimmedSearch
                ? "Try a different name or title."
                : "New student posts will show up here."}
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {pending.map((campaign) => (
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
                    <View className="mb-2">
                      <AdminStatusChip label="Waiting" tone="waiting" />
                    </View>
                    <Text className="font-display-medium text-lg text-dono-text">
                      {campaign.title}
                    </Text>
                    <Text className="mt-1 text-sm text-dono-muted">
                      {campaign.creator.name} · {campaign.university} · Goal{" "}
                      {formatCurrency(campaign.goal)}
                    </Text>
                    {campaign.createdAt ? (
                      <Text className="mt-1 text-xs text-dono-muted">
                        Submitted {campaign.createdAt}
                      </Text>
                    ) : null}
                    <Text
                      className="mt-3 text-sm text-dono-text"
                      numberOfLines={3}
                    >
                      {campaign.description}
                    </Text>
                  </View>
                  <View className="items-center gap-0.5 pt-1">
                    <Text className="text-xs font-sans-medium text-dono-muted">
                      Open
                    </Text>
                    <ChevronRight size={18} color="#5e6473" />
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </AdminShell>
  );
}
