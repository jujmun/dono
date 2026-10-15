import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useConvexAuth, useQuery } from "convex/react";
import { Plus, SlidersHorizontal } from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { ExpandableSearchRow } from "@/components/expandable-search-row";
import { FilterChip } from "@/components/filter-chip";
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

function tabFromSearchParam(
  value: string | string[] | undefined,
): SocietiesTab {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "mine" ? "mine" : "discover";
}

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
  const router = useRouter();
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string | string[] }>();
  const requestedTab = tabFromSearchParam(tabParam);
  const [tab, setTab] = useState<SocietiesTab>(requestedTab);
  const [orgTypeFilter, setOrgTypeFilter] = useState<OrgTypeFilter>("all");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { isAuthenticated } = useConvexAuth();
  const profile = useCurrentProfile();
  const canCreateSociety = canCreate(profile);
  const tabs =
    canCreateSociety || tab === "mine"
      ? allTabs
      : allTabs.filter((t) => t.id !== "mine");

  useEffect(() => {
    setTab(requestedTab);
  }, [requestedTab]);

  const selectTab = (next: SocietiesTab) => {
    setTab(next);
    router.setParams({ tab: next });
  };

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
  const filtersActive = tab !== "discover" || orgTypeFilter !== "all";
  const filterSummary = [
    tab === "mine" ? "My societies" : "Discover",
    tab === "discover"
      ? (orgTypeFilters.find((f) => f.id === orgTypeFilter)?.label ?? "All")
      : null,
  ]
    .filter((part): part is string => Boolean(part))
    .join(" · ");

  return (
    <AppShell>
      <ExpandableSearchRow
        title="Communities"
        expanded={showSearch}
        onToggle={() => setShowSearch((open) => !open)}
        value={search}
        onChangeText={setSearch}
        placeholder="Search colleges & societies…"
        active={showSearch || search.trim().length > 0}
        trailing={
          <Pressable
            onPress={() => setShowFilters((open) => !open)}
            className={cn(
              "retro-key",
              "h-11 w-11 items-center justify-center rounded-lg border-[3px] border-retro-ink",
              showFilters || filtersActive ? "bg-retro-mint" : "bg-retro-paper",
            )}
            accessibilityRole="button"
            accessibilityLabel="Filters"
            accessibilityState={{ expanded: showFilters }}
          >
            <SlidersHorizontal
              size={18}
              color={showFilters || filtersActive ? "#FFF9EF" : "#211E1A"}
            />
          </Pressable>
        }
      />

      {showFilters ? (
        <View className="mb-5 gap-3.5 rounded-[14px] border-[3px] border-retro-ink bg-retro-cream p-4">
          <View className="gap-2">
            <Text className="font-retro-mono-bold text-[11px] uppercase tracking-wide text-[#5c574f]">
              Show
            </Text>
            <View className="flex-row flex-wrap items-center gap-2">
              {tabs.map((t) => {
                const count =
                  t.id === "discover"
                    ? discoverItems?.length
                    : mySocieties?.length;
                const label =
                  typeof count === "number" ? `${t.label} (${count})` : t.label;
                return (
                  <FilterChip
                    key={t.id}
                    label={label}
                    selected={tab === t.id}
                    onPress={() => selectTab(t.id)}
                    selectedClassName="bg-retro-mint"
                  />
                );
              })}
            </View>
          </View>
          {tab === "discover" ? (
            <View className="gap-2">
              <Text className="font-retro-mono-bold text-[11px] uppercase tracking-wide text-[#5c574f]">
                Type
              </Text>
              <View className="flex-row flex-wrap items-center gap-2">
                {orgTypeFilters.map((f) => {
                  const filterCount =
                    f.id === "all"
                      ? discoverItems?.length
                      : discoverItems?.filter((s) => s.orgType === f.id).length;
                  const label =
                    typeof filterCount === "number"
                      ? `${f.label} (${filterCount})`
                      : f.label;
                  return (
                    <FilterChip
                      key={f.id}
                      label={label}
                      selected={orgTypeFilter === f.id}
                      onPress={() => setOrgTypeFilter(f.id)}
                      selectedClassName="bg-retro-marigold"
                      selectedTextClassName="text-retro-ink"
                    />
                  );
                })}
              </View>
            </View>
          ) : null}
        </View>
      ) : filtersActive ? (
        <Text className="mb-5 font-retro-mono text-[12px] text-[#5c574f]">
          {filterSummary}
        </Text>
      ) : null}

      {tab === "discover" && orgTypeFilter === "society" && canCreateSociety ? (
        <View className="mb-4 flex-row justify-end">
          <Link href="/create-society" asChild>
            <Pressable className="retro-key flex-row items-center gap-1.5 rounded-full border-2 border-retro-ink bg-retro-mint px-4 py-1.5">
              <Plus size={14} color="#FFF9EF" />
              <Text className="font-retro-bold text-[11.5px] text-retro-paper">
                Create Society
              </Text>
            </Pressable>
          </Link>
        </View>
      ) : null}
      {tab === "discover" && orgTypeFilter === "college" && canCreateSociety ? (
        <View className="mb-4 flex-row justify-end">
          <Link href="/create-college" asChild>
            <Pressable className="retro-key flex-row items-center gap-1.5 rounded-full border-2 border-retro-ink bg-retro-mint px-4 py-1.5">
              <Plus size={14} color="#FFF9EF" />
              <Text className="font-retro-bold text-[11.5px] text-retro-paper">
                Create College
              </Text>
            </Pressable>
          </Link>
        </View>
      ) : null}

      {showMineLoginGate ? null : scoped === undefined ? (
        <View className="items-center py-16">
          <ActivityIndicator color="#211E1A" />
        </View>
      ) : filtered.length === 0 ? (
        <View className="rounded-[14px] border-[3px] border-retro-ink bg-retro-cream p-12">
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
