import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import type { Campaign } from "@/lib/types";
import {
  categoryLabels,
  formatCurrency,
  getProgress,
} from "@/lib/constants";
import { buildGoalLineItems, getReceiptSubtitle } from "@/lib/receipt";
import { CampaignImage } from "@/components/ui/campaign-image";
import { cn } from "@/lib/utils";
import { RetroWindow } from "./retro-window";

const METER_COLORS = ["bg-retro-marigold", "bg-retro-mint", "bg-retro-pink"] as const;

interface BrowseCampaignsWindowProps {
  campaigns: Campaign[] | undefined;
  filtered: Campaign[];
  selectedId: string | null;
  onSelect: (campaign: Campaign) => void;
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
}

export function BrowseCampaignsWindow({
  campaigns,
  filtered,
  selectedId,
  onSelect,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
}: BrowseCampaignsWindowProps) {
  const router = useRouter();

  return (
    <RetroWindow title="BROWSE_CAMPAIGNS.exe" accent="coral" className="flex-1">
      <View className="mb-3">
        <View className="relative mb-3">
          <View className="absolute left-3 top-3 z-10">
            <Search size={14} color="#5c574f" />
          </View>
          <TextInput
            placeholder="Search campaigns…"
            placeholderTextColor="#5c574f"
            value={search}
            onChangeText={onSearchChange}
            className="w-full rounded-lg border-2 border-retro-ink bg-white py-2 pl-9 pr-3 font-retro-mono text-[13px] text-retro-ink"
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex-row items-center gap-2"
        >
          {categories.map((cat) => {
            const on = category === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => onCategoryChange(cat)}
                className={cn(
                  "rounded-lg border-2 border-retro-ink px-3 py-1.5 shadow-[2px_2px_0_#211E1A]",
                  on ? "bg-retro-sky" : "bg-retro-cream",
                )}
              >
                <Text
                  className={cn(
                    "font-retro-mono-bold text-[11px]",
                    on ? "text-retro-paper" : "text-retro-ink",
                  )}
                >
                  {cat === "all" ? "All" : categoryLabels[cat] ?? cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {campaigns === undefined ? (
        <ActivityIndicator color="#211E1A" />
      ) : filtered.length === 0 ? (
        <Text className="font-retro-mono text-xs text-[#5c574f]">
          No campaigns match your search.
        </Text>
      ) : (
        filtered.map((campaign, index) => {
          const progress = getProgress(campaign.raised, campaign.goal);
          const lineCount = buildGoalLineItems(campaign).length;
          const selected = campaign.id === selectedId;
          const meterColor = METER_COLORS[index % METER_COLORS.length];

          return (
            <Pressable
              key={campaign.id}
              onPress={() => onSelect(campaign)}
              className={cn(
                "mb-3 flex-row items-center gap-3 rounded-[10px] border-2 border-retro-ink px-3 py-2.5 last:mb-0",
                selected ? "bg-retro-marigold/40" : "bg-retro-cream",
              )}
            >
              <CampaignImage
                image={campaign.image}
                className="h-11 w-11 shrink-0 rounded-lg border-2 border-retro-ink"
              />
              <View className="min-w-0 flex-1">
                <Text
                  className="font-sans-medium text-sm text-retro-ink"
                  numberOfLines={1}
                >
                  {campaign.title}
                </Text>
                <Text
                  className="font-retro-mono text-[11.5px] text-[#5c574f]"
                  numberOfLines={1}
                >
                  {getReceiptSubtitle(campaign)} · {lineCount} line items
                </Text>
                <View className="mt-1.5 h-[9px] overflow-hidden rounded-[5px] border-2 border-retro-ink bg-white">
                  <View
                    className={cn("h-full", meterColor)}
                    style={{ width: `${progress}%` }}
                  />
                </View>
              </View>
              <View className="items-end">
                <Text className="font-retro-mono-bold text-xs text-retro-ink">
                  {formatCurrency(campaign.raised)}
                </Text>
                <Text className="font-retro-mono text-[11px] text-[#5c574f]">
                  / {formatCurrency(campaign.goal)}
                </Text>
                <Pressable
                  onPress={() => router.push(`/campaigns/${campaign.id}`)}
                  className="mt-1"
                  hitSlop={8}
                >
                  <Text className="font-retro-mono text-[10px] text-retro-sky underline">
                    Open
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          );
        })
      )}
    </RetroWindow>
  );
}
