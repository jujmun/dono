import { type Href, Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import type { Campaign } from "@/lib/types";
import {
  categoryLabels,
  creatorTypeLabels,
  formatCurrency,
  getProgress,
} from "@/lib/constants";
import { getPrimaryCampaignImage } from "@/lib/campaign-images";
import {
  buildGoalLineItems,
  buildReceiptFooter,
} from "@/lib/receipt";
import { CampaignImage } from "@/components/ui/campaign-image";
import { cn } from "@/lib/utils";

interface RetroCampaignCardProps {
  campaign: Campaign;
  accent?: "indigo" | "tan";
  href?: Href;
}

export function RetroCampaignCard({
  campaign,
  accent = "indigo",
  href,
}: RetroCampaignCardProps) {
  const progress = getProgress(campaign.raised, campaign.goal);
  const imageSource = getPrimaryCampaignImage(campaign);
  const goalLines = buildGoalLineItems(campaign).slice(0, 3);
  const footer = buildReceiptFooter(campaign);
  const categoryLabel =
    categoryLabels[campaign.category] ?? campaign.category;
  const creatorType =
    creatorTypeLabels[campaign.creator.type] ?? campaign.creator.type;
  const fundedLabel =
    campaign.status === "funded" ? "FUNDED" : `${progress}% FUNDED`;
  const tagMarigold =
    campaign.category === "travel" || campaign.category === "events";
  const destination = (href ?? `/campaigns/${campaign.id}`) as Href;

  return (
    <Link href={destination} asChild>
      <Pressable className="active:opacity-90">
        <View className="overflow-hidden rounded-[14px] border-[3px] border-retro-ink bg-retro-paper shadow-[5px_5px_0_#211E1A]">
          <CampaignImage
            image={imageSource}
            className={cn(
              "h-[170px] border-b-[3px] border-retro-ink",
              accent === "tan" ? "bg-retro-tan" : "bg-retro-indigo",
            )}
          >
            <View
              className={cn(
                "absolute left-3.5 top-3.5 rounded-full border-2 border-retro-ink px-3.5 py-1 shadow-[3px_3px_0_#211E1A]",
                tagMarigold ? "bg-retro-marigold" : "bg-retro-paper",
              )}
            >
              <Text className="font-retro-bold text-xs text-retro-ink">
                {categoryLabel}
              </Text>
            </View>
          </CampaignImage>

          <View className="px-[18px] pb-[18px] pt-4">
            <View className="mb-0.5 flex-row items-start justify-between gap-2">
              <Text
                className="min-w-0 flex-1 font-retro-bold text-[19px] text-retro-ink"
                numberOfLines={2}
              >
                {campaign.title}
              </Text>
              <View className="rounded-lg border-2 border-retro-ink bg-retro-cream px-2 py-0.5">
                <Text className="font-retro-mono-bold text-[11.5px] text-retro-ink">
                  {fundedLabel}
                </Text>
              </View>
            </View>

            <Text className="mb-3 text-[12.5px] text-[#5c574f]">
              {campaign.university} · {creatorType}
            </Text>

            <View className="mb-3 rounded-lg border-2 border-dashed border-retro-ink bg-retro-paper px-3 py-2.5">
              {goalLines.map((line) => (
                <View
                  key={line.label}
                  className="flex-row items-center justify-between py-0.5"
                >
                  <Text
                    className="mr-2 flex-1 font-retro-mono text-[12.5px] text-retro-ink"
                    numberOfLines={1}
                  >
                    {line.label}
                  </Text>
                  <Text className="font-retro-mono text-[12.5px] text-retro-ink">
                    {formatCurrency(line.amount)}
                  </Text>
                </View>
              ))}
              <View className="my-1.5 border-t border-dashed border-retro-ink" />
              <View className="flex-row items-center justify-between py-0.5">
                <Text className="font-retro-mono-bold text-[12.5px] text-retro-ink">
                  {footer.label}
                </Text>
                <Text className="font-retro-mono-bold text-[12.5px] text-retro-ink">
                  {formatCurrency(footer.amount)}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="font-retro-mono-bold text-xs text-retro-ink">
                {formatCurrency(campaign.raised)} of{" "}
                {formatCurrency(campaign.goal)}
              </Text>
              <View className="flex-row gap-3">
                <Text className="font-retro-mono text-xs text-[#5c574f]">
                  ♡ {campaign.likes} like{campaign.likes === 1 ? "" : "s"}
                </Text>
                <Text className="font-retro-mono text-xs text-[#5c574f]">
                  👥 {campaign.donors} donor{campaign.donors === 1 ? "" : "s"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
