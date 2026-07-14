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

export default function AdminPortalPage() {
  const router = useRouter();
  const profile = useCurrentProfile();
  const adminUser = isPortalAdmin(profile);
  const pending = useQuery(
    api.campaigns.listPendingForAdmin,
    adminUser ? {} : "skip",
  ) as Campaign[] | undefined;

  if (profile === undefined) {
    return (
      <AdminShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
          <Text className="mt-4 text-dono-muted">Loading admin portal...</Text>
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
          <Pressable
            onPress={() => router.replace("/dashboard")}
            className="mt-6 items-center rounded-full bg-dono-primary py-3"
          >
            <Text className="font-sans-medium text-sm text-white">
              Back to dashboard
            </Text>
          </Pressable>
        </View>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <View className="mx-auto w-full max-w-3xl px-4 py-8">
        <View className="mb-8">
          <Text className="font-display-medium text-2xl text-dono-text">
            Review
          </Text>
          <Text className="mt-1 text-dono-muted">
            Tap a campaign to read the full story, view the student profile, and
            send feedback.
          </Text>
          {profile.email ? (
            <Text className="mt-2 text-xs text-dono-muted">
              Signed in as {profile.email}
            </Text>
          ) : null}
        </View>

        {pending === undefined ? (
          <View className="items-center py-12">
            <ActivityIndicator color="#17211B" />
            <Text className="mt-4 text-dono-muted">Loading pending campaigns...</Text>
          </View>
        ) : pending.length === 0 ? (
          <View className="rounded-2xl border border-dono-border bg-white px-6 py-10">
            <Text className="font-sans-medium text-base text-dono-text">
              No campaigns waiting for review
            </Text>
            <Text className="mt-2 text-sm text-dono-muted">
              New submissions will appear here after a student creates a
              campaign.
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {pending.map((campaign) => (
              <Pressable
                key={campaign.id}
                onPress={() =>
                  router.push(`/admin/${encodeURIComponent(campaign.id)}` as Href)
                }
                className="rounded-2xl border border-dono-border bg-white p-5"
              >
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1">
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
                  <ChevronRight size={20} color="#56615A" />
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </AdminShell>
  );
}
