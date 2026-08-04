import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { useConvexAuth, useQuery } from "convex/react";
import { Search, Plus } from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { LoginGate } from "@/components/login-gate";
import { SocietyCardGrid } from "@/components/society-card-grid";
import { api } from "@convex/_generated/api";
import type { MySociety, OrgType, Society } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { canCreate } from "@/lib/auth/user-type";

type SocietiesTab = "discover" | "mine";
type OrgTypeFilter = "all" | OrgType;

const allTabs: { id: SocietiesTab; label: string }[] = [
  { id: "discover", label: "Discover" },
  { id: "mine", label: "My societies" },
];

const orgTypeFilters: { id: OrgTypeFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "college", label: "Colleges" },
  { id: "society", label: "Societies" },
];

function dedupeBySlug(items: Society[]): Society[] {
  const seen = new Set<string>();
  const result: Society[] = [];
  for (const item of items) {
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    result.push(item);
  }
  return result;
}

export default function SocietiesPage() {
  const [tab, setTab] = useState<SocietiesTab>("discover");
  const [orgTypeFilter, setOrgTypeFilter] = useState<OrgTypeFilter>("all");
  const [search, setSearch] = useState("");
  const { isAuthenticated } = useConvexAuth();
  const profile = useCurrentProfile();
  const canCreateSociety = canCreate(profile);
  const tabs = canCreateSociety
    ? allTabs
    : allTabs.filter((t) => t.id !== "mine");

  const activeSocieties = (useQuery(api.societies.listActive) ?? undefined) as
    | Society[]
    | undefined;
  const publicColleges = (useQuery(api.communities.listPublicColleges) ??
    undefined) as Society[] | undefined;
  const mySocieties = (useQuery(
    api.societies.listMine,
    isAuthenticated ? {} : "skip",
  ) ?? undefined) as MySociety[] | undefined;

  // Colleges first so a bridged college wins if slug ever overlaps listActive.
  const discoverItems =
    activeSocieties === undefined || publicColleges === undefined
      ? undefined
      : dedupeBySlug([...publicColleges, ...activeSocieties]).sort((a, b) =>
          a.name.localeCompare(b.name),
        );

  const scoped = tab === "mine" ? mySocieties : discoverItems;
  const filtered = (scoped ?? []).filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (tab !== "discover" || orgTypeFilter === "all") return true;
    return s.orgType === orgTypeFilter;
  });

  const showMineLoginGate = tab === "mine" && !isAuthenticated;

  return (
    <AppShell>
      <View className="mb-6">
        <Text className="font-retro-bold text-[32px] text-retro-ink">
          Communities
        </Text>
      </View>

      <View className="mb-4 flex-row items-center gap-2.5 rounded-[10px] border-[3px] border-retro-ink bg-retro-paper px-4 py-2.5 shadow-[3px_3px_0_#211E1A]">
        <Search size={16} color="#8a8478" />
        <TextInput
          placeholder="Search colleges & societies…"
          placeholderTextColor="#8a8478"
          value={search}
          onChangeText={setSearch}
          className="min-w-0 flex-1 font-retro-mono text-[13px] text-retro-ink outline-none"
        />
      </View>

      <View className="mb-4 flex-row flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => setTab(t.id)}
            className={cn(
              "rounded-full border-2 border-retro-ink px-3.5 py-1.5",
              tab === t.id
                ? "bg-retro-mint shadow-[3px_3px_0_#211E1A]"
                : "bg-retro-paper",
            )}
          >
            <Text
              className={cn(
                "font-retro-bold text-[12.5px]",
                tab === t.id ? "text-retro-paper" : "text-retro-ink",
              )}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === "discover" ? (
        <View className="mb-6 flex-row flex-wrap items-center justify-between gap-2">
          <View className="flex-row flex-wrap items-center gap-2">
            {orgTypeFilters.map((f) => (
              <Pressable
                key={f.id}
                onPress={() => setOrgTypeFilter(f.id)}
                className={cn(
                  "rounded-full border-2 border-retro-ink px-3 py-1",
                  orgTypeFilter === f.id
                    ? "bg-retro-marigold shadow-[2px_2px_0_#211E1A]"
                    : "bg-retro-cream",
                )}
              >
                <Text className="font-retro-bold text-[11.5px] text-retro-ink">
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </View>
          {orgTypeFilter === "society" && canCreateSociety ? (
            <Link href="/create-society" asChild>
              <Pressable className="ml-auto flex-row items-center gap-1.5 rounded-full border-2 border-retro-ink bg-retro-mint px-4 py-1.5 shadow-[3px_3px_0_#211E1A]">
                <Plus size={14} color="#FFF9EF" />
                <Text className="font-retro-bold text-[11.5px] text-retro-paper">
                  Create Society
                </Text>
              </Pressable>
            </Link>
          ) : null}
          {orgTypeFilter === "college" && canCreateSociety ? (
            <Link href="/create-college" asChild>
              <Pressable className="ml-auto flex-row items-center gap-1.5 rounded-full border-2 border-retro-ink bg-retro-mint px-4 py-1.5 shadow-[3px_3px_0_#211E1A]">
                <Plus size={14} color="#FFF9EF" />
                <Text className="font-retro-bold text-[11.5px] text-retro-paper">
                  Create College
                </Text>
              </Pressable>
            </Link>
          ) : null}
        </View>
      ) : null}

      {showMineLoginGate ? null : scoped === undefined ? (
        <View className="items-center py-16">
          <ActivityIndicator color="#211E1A" />
        </View>
      ) : filtered.length === 0 ? (
        <View className="rounded-[14px] border-[3px] border-retro-ink bg-retro-cream p-12 shadow-[5px_5px_0_#211E1A]">
          <Text className="text-center font-retro-mono text-sm text-[#5c574f]">
            No communities match your search.
          </Text>
        </View>
      ) : (
        <SocietyCardGrid societies={filtered} showConnectCta={tab === "mine"} />
      )}

      {showMineLoginGate ? (
        <LoginGate message="Sign in to see the societies you've created." />
      ) : null}
    </AppShell>
  );
}
