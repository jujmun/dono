import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "convex/react";
import { type Href, useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import { AdminShell } from "@/components/admin-shell";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { isPortalAdmin } from "@/lib/auth/is-portal-admin";
import { formatCurrency } from "@/lib/constants";
import type { Campaign } from "@/lib/types";

export default function AdminDiscoverPage() {
  const router = useRouter();
  const profile = useCurrentProfile();
  const adminUser = isPortalAdmin(profile);
  const campaigns = useQuery(
    api.campaigns.list,
    adminUser ? {} : "skip",
  ) as Campaign[] | undefined;

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
        <Text className="font-display-medium text-2xl text-dono-text">
          Discover
        </Text>
        <Text className="mt-1 text-dono-muted">
          Published campaigns. Open one to take it down or send feedback.
        </Text>

        {campaigns === undefined ? (
          <View className="items-center py-12">
            <ActivityIndicator color="#1d242f" />
          </View>
        ) : campaigns.length === 0 ? (
          <View className="mt-8 rounded-2xl border border-dono-border bg-white px-6 py-10">
            <Text className="font-sans-medium text-base text-dono-text">
              No published campaigns
            </Text>
            <Text className="mt-2 text-sm text-dono-muted">
              Approved campaigns will appear here.
            </Text>
          </View>
        ) : (
          <View className="mt-6 gap-4">
            {campaigns.map((campaign) => (
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
                    <Text className="font-display-medium text-lg text-dono-text">
                      {campaign.title}
                    </Text>
                    <Text className="mt-1 text-sm text-dono-muted">
                      {campaign.creator.name} · {campaign.university} ·{" "}
                      {formatCurrency(campaign.raised)} raised · {campaign.status}
                    </Text>
                    <Text
                      className="mt-3 text-sm text-dono-text"
                      numberOfLines={2}
                    >
                      {campaign.description}
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#5e6473" />
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </AdminShell>
  );
}
