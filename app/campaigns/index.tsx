import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useConvexAuth, useQuery } from "convex/react";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { FilterChip } from "@/components/filter-chip";
import { LoginGate } from "@/components/login-gate";
import { RetroCampaignCard } from "@/components/retro";
import {
  categoryLabels,
  getCampaignApprovalStage,
  isCampaignRejected,
} from "@/lib/constants";
import type { Campaign } from "@/lib/types";
import { api } from "@convex/_generated/api";
import { cn } from "@/lib/utils";
import { isNearGoal } from "@/lib/donation-psychology";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { canCreate } from "@/lib/auth/user-type";

const categories = ["all", ...Object.keys(categoryLabels)];

type CampaignsTab = "discover" | "mine";
type DiscoverSort = "all" | "trending" | "near_goal";

const allTabs: { id: CampaignsTab; label: string }[] = [
  { id: "discover", label: "Discover" },
  { id: "mine", label: "My campaigns" },
];

const sortChips: { id: DiscoverSort; label: string }[] = [
  { id: "all", label: "All" },
  { id: "trending", label: "Trending" },
  { id: "near_goal", label: "Near goal" },
];

function tabFromSearchParam(
  value: string | string[] | undefined,
): CampaignsTab {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "mine" ? "mine" : "discover";
}

export default function CampaignsPage() {
  const { width } = useWindowDimensions();
  const columns = width >= 1200 ? 3 : width >= 820 ? 2 : 1;
  const { isAuthenticated } = useConvexAuth();
  const profile = useCurrentProfile();
  const router = useRouter();
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string | string[] }>();
  const requestedTab = tabFromSearchParam(tabParam);
  const [tab, setTab] = useState<CampaignsTab>(requestedTab);
  const tabs =
    canCreate(profile) || tab === "mine"
      ? allTabs
      : allTabs.filter((t) => t.id !== "mine");

  useEffect(() => {
    setTab(requestedTab);
  }, [requestedTab]);

  const selectTab = (next: CampaignsTab) => {
    setTab(next);
    router.setParams({ tab: next });
  };
  const [discoverSort, setDiscoverSort] = useState<DiscoverSort>("all");
  const campaigns = (useQuery(api.campaigns.list) ?? undefined) as
    | Campaign[]
    | undefined;
  const trending = (useQuery(
    api.campaigns.listTrending,
    tab === "discover" ? { limit: 30 } : "skip",
  ) ?? undefined) as Campaign[] | undefined;
  const nearGoal = (useQuery(
    api.campaigns.listNearGoal,
    tab === "discover" ? { limit: 30 } : "skip",
  ) ?? undefined) as Campaign[] | undefined;
  const activeMatches = useQuery(api.campaignMatches.listActive) ?? [];
  // CR-02a: match windows removed; listActive always returns [].
  void activeMatches;
  const myCampaignsRaw = (useQuery(
    api.campaignCreator.listMine,
    isAuthenticated ? {} : "skip",
  ) ?? undefined) as Campaign[] | undefined;
  const myCampaigns = myCampaignsRaw?.filter((c) => !isCampaignRejected(c));
  const ownedIds = new Set((myCampaignsRaw ?? []).map((c) => c.id));

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const filtersActive =
    tab !== "discover" ||
    discoverSort !== "all" ||
    selectedCategories.length > 0;

  const matchBySlug = useMemo(() => {
    return new Map<string, { multiplier: number }>();
  }, []);

  const profileCollege = profile?.college?.trim().toLowerCase() ?? "";

  const toggleCategory = (cat: string) => {
    if (cat === "all") {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const discoverSource =
    tab === "discover"
      ? discoverSort === "trending"
        ? trending
        : discoverSort === "near_goal"
          ? nearGoal
          : campaigns
      : undefined;

  const scoped = tab === "mine" ? myCampaigns : discoverSource;
  const showMineLoginGate = tab === "mine" && !isAuthenticated;

  const filtered = (scoped ?? []).filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.university.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(c.category);
    return matchesSearch && matchesCategory;
  });

  const filterSummary = [
    tab === "mine" ? "My campaigns" : "Discover",
    tab === "discover"
      ? (sortChips.find((chip) => chip.id === discoverSort)?.label ?? "All")
      : null,
    selectedCategories.length === 0
      ? "All categories"
      : selectedCategories.map((cat) => categoryLabels[cat] ?? cat).join(", "),
  ]
    .filter((part): part is string => Boolean(part))
    .join(" · ");

  return (
    <AppShell>
      <Text className="mb-1.5 font-retro-bold text-[32px] text-retro-ink">
        Campaigns
      </Text>
      <Text className="mb-5 text-sm text-[#4a453c]">
        Support specific, tangible projects at universities across the UK
      </Text>

      <View className="mb-4 flex-row items-center gap-2.5">
        <View className="min-w-0 flex-1 flex-row items-center gap-2.5 rounded-[10px] border-[3px] border-retro-ink bg-retro-paper px-4 py-2.5">
          <Search size={16} color="#8a8478" />
          <TextInput
            placeholder="Search campaigns, universities…"
            placeholderTextColor="#8a8478"
            value={search}
            onChangeText={setSearch}
            className="min-w-0 flex-1 font-retro-mono text-[13px] text-retro-ink outline-none"
          />
        </View>
        <Pressable
          onPress={() => setShowFilters((v) => !v)}
          className={cn(
            "retro-key",
            "shrink-0 flex-row items-center gap-1.5 self-stretch rounded-[10px] border-[3px] border-retro-ink px-3.5",
            showFilters || filtersActive ? "bg-retro-mint" : "bg-retro-paper",
          )}
          accessibilityRole="button"
          accessibilityLabel="Filters"
          accessibilityState={{ expanded: showFilters }}
        >
          <SlidersHorizontal
            size={16}
            color={showFilters || filtersActive ? "#FFF9EF" : "#211E1A"}
          />
          <Text
            className={cn(
              "font-retro-bold text-[12.5px]",
              showFilters || filtersActive ? "text-retro-paper" : "text-retro-ink",
            )}
          >
            Filter
          </Text>
        </Pressable>
      </View>

      {showFilters ? (
        <View className="mb-5 gap-3.5 rounded-[14px] border-[3px] border-retro-ink bg-retro-cream p-4">
          <View className="gap-2">
            <Text className="font-retro-mono-bold text-[11px] uppercase tracking-wide text-[#5c574f]">
              Show
            </Text>
            <View className="flex-row flex-wrap items-center gap-2">
              {tabs.map((t) => {
                const count =
                  t.id === "discover" ? campaigns?.length : myCampaigns?.length;
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
                Sort
              </Text>
              <View className="flex-row flex-wrap items-center gap-2">
                {sortChips.map((chip) => {
                  const chipCount =
                    chip.id === "all"
                      ? campaigns?.length
                      : chip.id === "trending"
                        ? trending?.length
                        : nearGoal?.length;
                  const label =
                    typeof chipCount === "number"
                      ? `${chip.label} (${chipCount})`
                      : chip.label;
                  return (
                    <FilterChip
                      key={chip.id}
                      label={label}
                      selected={discoverSort === chip.id}
                      onPress={() => setDiscoverSort(chip.id)}
                      selectedClassName="bg-retro-sky"
                    />
                  );
                })}
              </View>
            </View>
          ) : null}

          <View className="gap-2">
            <Text className="font-retro-mono-bold text-[11px] uppercase tracking-wide text-[#5c574f]">
              Category
            </Text>
            <View className="flex-row flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const on =
                  cat === "all"
                    ? selectedCategories.length === 0
                    : selectedCategories.includes(cat);
                return (
                  <FilterChip
                    key={cat}
                    label={cat === "all" ? "All" : (categoryLabels[cat] ?? cat)}
                    selected={on}
                    onPress={() => toggleCategory(cat)}
                    selectedClassName="bg-retro-marigold"
                    selectedTextClassName="text-retro-ink"
                  />
                );
              })}
            </View>
          </View>
        </View>
      ) : (
        <Text className="mb-5 font-retro-mono text-[12px] text-[#5c574f]">
          {filterSummary}
        </Text>
      )}

      {showMineLoginGate ? null : scoped === undefined ? (
        <ActivityIndicator color="#211E1A" className="py-12" />
      ) : filtered.length === 0 ? (
        <View className="rounded-[14px] border-[3px] border-retro-ink bg-retro-cream p-10">
          <Text className="text-center font-retro-mono text-sm text-[#5c574f]">
            {tab === "mine"
              ? "You haven't created any campaigns yet."
              : "No campaigns match your search."}
          </Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-[22px]">
          {filtered.map((campaign, index) => {
            const match = matchBySlug.get(campaign.id);
            return (
              <View
                key={campaign.id}
                style={{
                  flexGrow: 1,
                  flexBasis:
                    columns === 3 ? "30%" : columns === 2 ? "45%" : "100%",
                  maxWidth:
                    columns === 3 ? "32%" : columns === 2 ? "48.5%" : "100%",
                }}
              >
                <RetroCampaignCard
                  campaign={campaign}
                  accent={index % 2 === 0 ? "indigo" : "tan"}
                  owned={tab === "discover" && ownedIds.has(campaign.id)}
                  nearGoal={isNearGoal(campaign)}
                  matched={Boolean(match)}
                  matchMultiplier={match?.multiplier}
                  collegeMatch={
                    Boolean(profileCollege) &&
                    (campaign.college ?? "").trim().toLowerCase() ===
                      profileCollege
                  }
                  href={
                    tab === "mine"
                      ? getCampaignApprovalStage(campaign)
                        ? (`/create?editSlug=${campaign.id}` as Href)
                        : campaign.status === "active" ||
                            campaign.status === "funded"
                          ? (`/create?editSlug=${campaign.id}` as Href)
                          : undefined
                      : undefined
                  }
                />
              </View>
            );
          })}
        </View>
      )}

      {showMineLoginGate ? (
        <LoginGate message="Sign in to see the campaigns you've created." />
      ) : null}
    </AppShell>
  );
}
