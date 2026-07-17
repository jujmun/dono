import { View, Text, Pressable, ActivityIndicator, Image } from "react-native";
import { useQuery } from "convex/react";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, ChevronRight } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { AdminShell } from "@/components/admin-shell";
import {
  AdminStatusChip,
  humanCampaignStatus,
  moderationActionLabel,
  statusChipTone,
} from "@/lib/admin-labels";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { isPortalAdmin } from "@/lib/auth/is-portal-admin";
import { formatCurrency } from "@/lib/constants";
import type { Campaign } from "@/lib/types";

type StudentAdminPayload = {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: "user" | "admin";
  emailVerifiedAt: number | null;
  createdAt: number;
  campaigns: Campaign[];
};

function formatJoined(ms: number) {
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminStudentProfilePage() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const profile = useCurrentProfile();
  const adminUser = isPortalAdmin(profile);
  const student = useQuery(
    api.users.getStudentForAdmin,
    adminUser && userId ? { userId: userId as Id<"users"> } : "skip",
  ) as StudentAdminPayload | null | undefined;

  if (profile === undefined || (adminUser && student === undefined)) {
    return (
      <AdminShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
          <Text className="mt-4 text-dono-muted">Loading student...</Text>
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

  if (!student) {
    return (
      <AdminShell>
        <View className="mx-auto w-full max-w-lg px-4 py-16">
          <Pressable
            onPress={() => router.back()}
            className="mb-6 flex-row items-center gap-2"
          >
            <ArrowLeft size={16} color="#56615A" />
            <Text className="text-sm text-dono-muted">Back</Text>
          </Pressable>
          <Text className="text-center text-dono-muted">
            Student not found.
          </Text>
        </View>
      </AdminShell>
    );
  }

  const initials = (student.name || student.email || "?")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AdminShell>
      <View className="mx-auto w-full max-w-3xl px-4 py-8">
        <Pressable
          onPress={() => router.back()}
          className="mb-6 flex-row items-center gap-2"
        >
          <ArrowLeft size={16} color="#56615A" />
          <Text className="text-sm text-dono-muted">Back</Text>
        </Pressable>

        <View className="rounded-2xl border border-dono-border bg-white p-5">
          <View className="flex-row items-center gap-4">
            {student.avatarUrl ? (
              <Image
                source={{ uri: student.avatarUrl }}
                className="h-16 w-16 rounded-full"
              />
            ) : (
              <View className="h-16 w-16 items-center justify-center rounded-full bg-dono-primary/10">
                <Text className="font-retro-mono-bold text-lg text-dono-primary">
                  {initials}
                </Text>
              </View>
            )}
            <View className="flex-1">
              <Text className="font-retro-bold text-2xl text-dono-text">
                {student.name || "Unnamed student"}
              </Text>
              <Text className="mt-1 text-sm text-dono-muted">{student.email}</Text>
              <Text className="mt-2 text-sm text-dono-muted">
                Member since {formatJoined(student.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-8">
          <Text className="font-retro-bold text-base text-dono-text">
            Their posts
          </Text>
          <Text className="mt-1 text-sm text-dono-muted">
            {student.campaigns.length === 0
              ? "No posts linked to this account."
              : `${student.campaigns.length} post${student.campaigns.length === 1 ? "" : "s"}`}
          </Text>

          {student.campaigns.length > 0 ? (
            <View className="mt-4 gap-3">
              {student.campaigns.map((campaign) => {
                const status = humanCampaignStatus(campaign);
                const action = moderationActionLabel(campaign.moderationAction);
                return (
                  <Pressable
                    key={campaign.id}
                    onPress={() =>
                      router.push(
                        `/admin/${encodeURIComponent(campaign.id)}` as Href,
                      )
                    }
                    className="rounded-2xl border border-dono-border bg-white p-4"
                  >
                    <View className="flex-row items-start justify-between gap-3">
                      <View className="flex-1">
                        <View className="mb-2 flex-row flex-wrap gap-2">
                          <AdminStatusChip
                            label={status}
                            tone={statusChipTone(status)}
                          />
                          {action ? (
                            <AdminStatusChip
                              label={action}
                              tone={statusChipTone(action)}
                            />
                          ) : null}
                        </View>
                        <Text className="font-retro-bold text-base text-dono-text">
                          {campaign.title}
                        </Text>
                        <Text className="mt-1 text-sm text-dono-muted">
                          Goal {formatCurrency(campaign.goal)} · Raised{" "}
                          {formatCurrency(campaign.raised)}
                        </Text>
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
          ) : null}
        </View>
      </View>
    </AdminShell>
  );
}
