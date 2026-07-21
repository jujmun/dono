import { View, Text, Pressable } from "react-native";
import { type Href, useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { LogOut } from "lucide-react-native";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { cn } from "@/lib/utils";

export type AdminSection = "pending" | "live" | "removed";

const sections: {
  key: AdminSection;
  label: string;
  title: string;
  subtitle: string;
  href: Href;
}[] = [
  {
    key: "pending",
    label: "Pending",
    title: "Needs review",
    subtitle: "New posts waiting for your decision",
    href: "/admin",
  },
  {
    key: "live",
    label: "Live",
    title: "Live posts",
    subtitle: "Published posts you can search or remove",
    href: "/admin/discover",
  },
  {
    key: "removed",
    label: "Removed",
    title: "Removed",
    subtitle: "Denied or taken down — open to restore",
    href: "/admin/archive",
  },
];

export function AdminStatsNav({ active }: { active: AdminSection }) {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const stats = useQuery(api.campaigns.getAdminStats, {});
  const current = sections.find((s) => s.key === active) ?? sections[0];

  const countFor = (key: AdminSection) => {
    if (!stats) return "—";
    if (key === "pending") return stats.pending;
    if (key === "live") return stats.live;
    return stats.moderated;
  };

  const handleSignOut = () => {
    void signOut().then(() => {
      router.replace("/signin");
    });
  };

  return (
    <View className="mb-6">
      <View className="mb-6 flex-row items-start justify-between gap-4">
        <View className="min-h-[56px] flex-1">
          <Text className="font-retro-bold text-2xl text-retro-ink">
            {current.title}
          </Text>
          <Text className="mt-1 text-sm text-dono-muted">{current.subtitle}</Text>
        </View>
        <Pressable
          onPress={handleSignOut}
          className="flex-row items-center gap-1.5 pt-1"
          accessibilityLabel="Sign out"
        >
          <LogOut size={14} color="#5e6473" />
          <Text className="text-sm text-dono-muted">Sign out</Text>
        </Pressable>
      </View>

      <View className="flex-row gap-3">
        {sections.map((section) => {
          const isActive = section.key === active;
          return (
            <Pressable
              key={section.key}
              onPress={() => router.replace(section.href)}
              className={cn(
                "flex-1 rounded-xl border-2 px-4 py-3",
                isActive
                  ? "border-dono-primary bg-dono-primary/5"
                  : "border-dono-border bg-white",
              )}
              style={({ pressed }) =>
                pressed ? { opacity: 1 } : undefined
              }
            >
              <Text
                className={cn(
                  "text-xs font-retro-bold",
                  isActive ? "text-dono-primary" : "text-dono-muted",
                )}
              >
                {section.label}
              </Text>
              <Text className="mt-1 font-retro-bold text-xl text-dono-text">
                {countFor(section.key)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
