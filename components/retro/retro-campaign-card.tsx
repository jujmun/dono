import { type Href, Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import type { Campaign } from "@/lib/types";
import {
  categoryLabels,
  creatorTypeLabels,
  formatCurrency,
  getCampaignApprovalStage,
  getProgress,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { retroKeyClass, retroKeyMintClass } from "@/lib/retro-key";
import { getPrimaryCampaignImage, CAMPAIGN_IMAGE_ASPECT } from "@/lib/campaign-images";
import {
  buildGoalLineItems,
  buildReceiptFooter,
} from "@/lib/receipt";
import { CampaignImage } from "@/components/ui/campaign-image";

interface RetroCampaignCardProps {
  campaign: Campaign;
  accent?: "indigo" | "tan";
  href?: Href;
  /** Highlights campaigns the current user owns (e.g. in the Discover tab). */
  owned?: boolean;
  nearGoal?: boolean;
  matched?: boolean;
  matchMultiplier?: number;
  collegeMatch?: boolean;
}

export function RetroCampaignCard({
  campaign,
  accent = "indigo",
  href,
  owned = false,
  nearGoal = false,
  matched = false,
  matchMultiplier,
  collegeMatch = false,
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
  const approvalStage = getCampaignApprovalStage(campaign);
  const destination = (href ?? `/campaigns/${campaign.id}`) as Href;

  return (
    <Link href={destination} asChild>
      <Pressable
        className={cn(
          "group h-full active:opacity-90",
          approvalStage && "opacity-60",
        )}
      >
        <View
          className={cn(
            "h-full overflow-hidden rounded-[14px] border-[3px] bg-retro-paper",
            owned
              ? cn("border-retro-mint", retroKeyMintClass)
              : cn("border-retro-ink", retroKeyClass),
          )}
        >
          <CampaignImage
            image={imageSource}
            zoomOnHover
            className={cn(
              "w-full border-b-[3px] border-retro-ink",
              accent === "tan" ? "bg-retro-tan" : "bg-retro-indigo",
            )}
            style={{ aspectRatio: CAMPAIGN_IMAGE_ASPECT }}
          >
            <View
              className={cn(
                "absolute left-3.5 top-3.5 rounded-full border-2 border-retro-ink px-3.5 py-1",
                tagMarigold ? "bg-retro-marigold" : "bg-retro-paper",
              )}
            >
              <Text className="font-retro-bold text-xs text-retro-ink">
                {categoryLabel}
              </Text>
            </View>
            <View className="absolute right-3.5 top-3.5 flex-row flex-wrap justify-end gap-1">
              {matched ? (
                <View className="rounded-full border-2 border-retro-ink bg-retro-mint px-2 py-0.5">
                  <Text className="font-retro-mono-bold text-[10px] text-retro-paper">
                    {matchMultiplier ? `${matchMultiplier}× MATCH` : "MATCHED"}
                  </Text>
                </View>
              ) : null}
              {nearGoal ? (
                <View className="rounded-full border-2 border-retro-ink bg-retro-marigold px-2 py-0.5">
                  <Text className="font-retro-mono-bold text-[10px] text-retro-ink">
                    NEAR GOAL
                  </Text>
                </View>
              ) : null}
              {collegeMatch ? (
                <View className="rounded-full border-2 border-retro-ink bg-retro-sky px-2 py-0.5">
                  <Text className="font-retro-mono-bold text-[10px] text-retro-paper">
                    YOUR COLLEGE
                  </Text>
                </View>
              ) : null}
            </View>
            {approvalStage && (
              <View
                className={cn(
                  "absolute inset-x-3.5 bottom-3.5 rounded-full border-2 border-retro-ink px-3.5 py-1.5",
                  approvalStage.label === "Rejected" ||
                    approvalStage.label === "Rejected by society"
                    ? "bg-retro-coral"
                    : "bg-retro-marigold",
                )}
              >
                <Text className="text-center font-retro-bold text-xs text-retro-ink">
                  {approvalStage.label}
                </Text>
              </View>
            )}
          </CampaignImage>

          <View className="flex-1 justify-between px-[18px] pb-[18px] pt-4">
            <View>
              <View className="mb-0.5 min-h-[52px] flex-row items-start justify-between gap-2">
                <Text
                  className="min-w-0 flex-1 font-retro-bold text-[19px] leading-[26px] text-retro-ink"
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

              <View
                className={cn(
                  "mb-3 rounded-sm border border-dashed border-retro-ink bg-white px-3 py-2.5",
                  goalLines.length > 0 && "min-h-[108px]",
                )}
              >
                {goalLines.map((line) => (
                  <View
                    key={line.label}
                    className="flex-row items-end gap-2 py-0.5"
                  >
                    <Text
                      className="max-w-[55%] shrink font-retro-mono text-[12.5px] text-retro-ink"
                      numberOfLines={1}
                    >
                      {line.label}
                    </Text>
                    <View className="mb-1 min-h-[1px] min-w-6 flex-1 border-b border-dotted border-retro-ink/50" />
                    <Text className="shrink-0 font-retro-mono text-[12.5px] text-retro-ink">
                      {formatCurrency(line.amount)}
                    </Text>
                  </View>
                ))}
                {goalLines.length > 0 ? (
                  <View className="my-1.5 border-t border-dashed border-retro-ink" />
                ) : null}
                <View className="flex-row items-end gap-2 py-0.5">
                  <Text className="shrink font-retro-mono-bold text-[12.5px] text-retro-ink">
                    {footer.label}
                  </Text>
                  <View className="mb-1 min-h-[1px] min-w-6 flex-1 border-b border-dotted border-retro-ink/50" />
                  <Text className="shrink-0 font-retro-mono-bold text-[12.5px] text-retro-ink">
                    {formatCurrency(footer.amount)}
                  </Text>
                </View>
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
