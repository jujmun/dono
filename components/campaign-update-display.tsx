import { Image, ScrollView, Text, View } from "react-native";
import { useQuery } from "convex/react";
import { Clock } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import { RetroPanel } from "@/components/retro/retro-panel";
import { formatCurrency } from "@/lib/constants";
import type { Campaign } from "@/lib/types";

type CampaignUpdateDisplayProps = {
  campaign: Pick<Campaign, "id" | "raised" | "goal" | "status">;
};

export function CampaignUpdateDisplay({ campaign }: CampaignUpdateDisplayProps) {
  const update = useQuery(api.campaignUpdates.getForCampaign, { slug: campaign.id });

  if (update === undefined) return null;

  const eligible = campaign.raised >= campaign.goal || campaign.status === "completed";

  if (!update) {
    if (!eligible) return null;
    return (
      <RetroPanel title="Updates.log" accent="mint">
        <View className="flex-row items-center gap-2">
          <Clock size={16} color="#5c574f" />
          <Text className="text-sm text-[#5c574f]">
            This campaign has reached its goal — an update on how funds were used is
            coming soon.
          </Text>
        </View>
      </RetroPanel>
    );
  }

  const dateLabel = new Date(update.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <RetroPanel title="Updates.log" accent="mint">
      <View className="gap-3">
        {update.mediaUrls.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
            {update.mediaUrls.map((url, index) => (
              <Image
                key={`${url}-${index}`}
                source={{ uri: url }}
                className="mx-1 h-40 w-56 rounded-lg border-2 border-retro-ink"
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        ) : null}

        <View className="rounded-lg border-2 border-retro-ink bg-retro-cream p-3.5">
          <View className="mb-1.5 flex-row items-center justify-between gap-2">
            <Text className="flex-1 font-retro-bold text-retro-ink">
              {update.headline}
            </Text>
            <Text className="font-retro-mono text-[11px] text-[#5c574f]">
              {dateLabel}
            </Text>
          </View>
          <Text className="text-sm leading-5 text-[#4a453c]">{update.body}</Text>

          <View className="mt-3 flex-row flex-wrap gap-x-4 gap-y-1 border-t border-dashed border-[#c9c2b4] pt-3">
            <Text className="font-retro-mono-bold text-xs text-retro-ink">
              {formatCurrency(update.amountRaised)} raised
            </Text>
            <Text className="font-retro-mono-bold text-xs text-retro-ink">
              {formatCurrency(update.amountSpent)} spent
            </Text>
          </View>
          {update.reconciliationNote ? (
            <Text className="mt-1.5 text-xs italic leading-relaxed text-[#5c574f]">
              {update.reconciliationNote}
            </Text>
          ) : null}

          <Text className="mt-2 text-xs text-[#5c574f]">
            Posted by {update.postedByName}
          </Text>
        </View>
      </View>
    </RetroPanel>
  );
}
