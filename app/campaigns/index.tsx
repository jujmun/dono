import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useConvexAuth, useQuery } from "convex/react";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
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

const categories = ["all", ...Object.keys(categoryLabels)];

type CampaignsTab = "discover" | "mine";

const tabs: { id: CampaignsTab; label: string }[] = [
  { id: "discover", label: "Discover Campaigns" },
  { id: "mine", label: "My Campaigns" },
];

export default function CampaignsPage() {
  const { width } = useWindowDimensions();
  const columns = width >= 1200 ? 3 : width >= 820 ? 2 : 1;
  const { isAuthenticated } = useConvexAuth();

  const [tab, setTab] = useState<CampaignsTab>("discover");
  const campaigns = (useQuery(api.campaigns.list) ?? undefined) as
    | Campaign[]
    | undefined;
  const myCampaignsRaw = (useQuery(
    api.campaignCreator.listMine,
    isAuthenticated ? {} : "skip",
  ) ?? undefined) as Campaign[] | undefined;
  const myCampaigns = myCampaignsRaw?.filter((c) => !isCampaignRejected(c));
  const ownedIds = new Set((myCampaignsRaw ?? []).map((c) => c.id));

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (cat: string) => {
    if (cat === "all") {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const scoped = tab === "mine" ? myCampaigns : campaigns;
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

  return (
    <AppShell>
      <Text className="mb-1.5 font-retro-bold text-[32px] text-retro-ink">
        Campaigns
      </Text>
      <Text className="mb-5 text-sm text-[#4a453c]">
        Support specific, tangible projects at universities across the UK
      </Text>

      <View className="mb-4 flex-row items-center gap-2.5 rounded-[10px] border-[3px] border-retro-ink bg-retro-paper px-4 py-2.5 shadow-[3px_3px_0_#211E1A]">
        <Search size={16} color="#8a8478" />
        <TextInput
          placeholder="Search campaigns, universities…"
          placeholderTextColor="#8a8478"
          value={search}
          onChangeText={setSearch}
          className="min-w-0 flex-1 font-retro-mono text-[13px] text-retro-ink outline-none"
        />
      </View>

      <View className="mb-5 flex-row flex-wrap gap-2">
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

      <View className="mb-5 flex-row items-center gap-2">
        <Pressable
          onPress={() => setShowFilters((v) => !v)}
          className={cn(
            "rounded-lg border-2 border-retro-ink px-2.5 py-2",
            showFilters
              ? "bg-retro-mint shadow-[3px_3px_0_#211E1A]"
              : "bg-retro-cream",
          )}
        >
          <SlidersHorizontal size={14} color="#211E1A" />
        </Pressable>
        {showFilters && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="min-w-0 flex-1"
            contentContainerClassName="flex-row items-center gap-2"
          >
            {categories.map((cat) => {
              const on =
                cat === "all"
                  ? selectedCategories.length === 0
                  : selectedCategories.includes(cat);
              return (
                <Pressable
                  key={cat}
                  onPress={() => toggleCategory(cat)}
                  className={cn(
                    "rounded-full border-2 border-retro-ink px-3.5 py-1.5",
                    on
                      ? "bg-retro-mint shadow-[3px_3px_0_#211E1A]"
                      : "bg-retro-paper",
                  )}
                >
                  <Text
                    className={cn(
                      "font-retro-bold text-[12.5px]",
                      on ? "text-retro-paper" : "text-retro-ink",
                    )}
                  >
                    {cat === "all" ? "All" : categoryLabels[cat]}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      {showMineLoginGate ? null : scoped === undefined ? (
        <ActivityIndicator color="#211E1A" className="py-12" />
      ) : filtered.length === 0 ? (
        <View className="rounded-[14px] border-[3px] border-retro-ink bg-retro-cream p-10 shadow-[5px_5px_0_#211E1A]">
          <Text className="text-center font-retro-mono text-sm text-[#5c574f]">
            {tab === "mine"
              ? "You haven't created any campaigns yet."
              : "No campaigns match your search."}
          </Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-[22px]">
          {filtered.map((campaign, index) => (
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
                href={
                  tab === "mine" && getCampaignApprovalStage(campaign)
                    ? `/create?editSlug=${campaign.id}`
                    : undefined
                }
              />
            </View>
          ))}
        </View>
      )}

      {showMineLoginGate ? (
        <LoginGate message="Sign in to see the campaigns you've created." />
      ) : null}
    </AppShell>
  );
}
