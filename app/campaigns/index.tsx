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
import { useQuery } from "convex/react";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { RetroCampaignCard } from "@/components/retro";
import { categoryLabels } from "@/lib/constants";
import type { Campaign } from "@/lib/types";
import { api } from "@convex/_generated/api";
import { cn } from "@/lib/utils";

const categories = ["all", ...Object.keys(categoryLabels)];

export default function CampaignsPage() {
  const { width } = useWindowDimensions();
  const columns = width >= 1200 ? 3 : width >= 820 ? 2 : 1;
  const campaigns = (useQuery(api.campaigns.list) ?? undefined) as
    | Campaign[]
    | undefined;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = (campaigns ?? []).filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.university.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || c.category === category;
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-5"
        contentContainerClassName="flex-row items-center gap-2"
      >
        <View className="rounded-lg border-2 border-retro-ink bg-retro-cream px-2.5 py-2">
          <SlidersHorizontal size={14} color="#211E1A" />
        </View>
        {categories.map((cat) => {
          const on = category === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
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

      {campaigns === undefined ? (
        <ActivityIndicator color="#211E1A" className="py-12" />
      ) : filtered.length === 0 ? (
        <View className="rounded-[14px] border-[3px] border-retro-ink bg-retro-cream p-10 shadow-[5px_5px_0_#211E1A]">
          <Text className="text-center font-retro-mono text-sm text-[#5c574f]">
            No campaigns match your search.
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
              />
            </View>
          ))}
        </View>
      )}
    </AppShell>
  );
}
