import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useQuery } from "convex/react";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { CampaignCard } from "@/components/campaign-card";
import { categoryLabels } from "@/lib/constants";
import type { Campaign } from "@/lib/types";
import { api } from "@convex/_generated/api";

const categories = ["all", ...Object.keys(categoryLabels)];

export default function CampaignsPage() {
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
      <View className="mx-auto w-full max-w-7xl px-4 py-8">
        <View className="mb-8">
          <Text className="font-display-medium text-2xl text-dono-text">Campaigns</Text>
          <Text className="mt-1 text-dono-muted">
            Support specific, tangible projects at universities across the UK
          </Text>
        </View>

        <View className="mb-6">
          <View className="relative">
            <View className="absolute left-3 top-3 z-10">
              <Search size={16} color="#56615A" />
            </View>
            <TextInput
              placeholder="Search campaigns, universities..."
              placeholderTextColor="#56615A"
              value={search}
              onChangeText={setSearch}
              className="w-full rounded-xl border border-dono-border bg-white py-2.5 pl-10 pr-4 text-sm text-dono-text"
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerClassName="items-center gap-2"
        >
          <SlidersHorizontal size={16} color="#56615A" />
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 ${
                category === cat
                  ? "bg-dono-primary"
                  : "border border-dono-border bg-white"
              }`}
            >
              <Text
                className={`font-sans-medium text-xs ${
                  category === cat ? "text-white" : "text-dono-muted"
                }`}
              >
                {cat === "all" ? "All" : categoryLabels[cat]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {campaigns === undefined ? (
          <ActivityIndicator color="#17211B" />
        ) : filtered.length === 0 ? (
          <View className="rounded-2xl border border-dono-border bg-white p-12">
            <Text className="text-center text-dono-muted">
              No campaigns match your search.
            </Text>
          </View>
        ) : (
          <View className="gap-6">
            {filtered.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </View>
        )}
      </View>
    </AppShell>
  );
}
