import { type Href, Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { Users, Heart } from "lucide-react-native";
import type { Campaign } from "@/lib/types";
import { formatCurrency, getProgress } from "@/lib/constants";
import { getPrimaryCampaignImage } from "@/lib/campaign-images";
import {
  buildGoalLineItems,
  buildReceiptFooter,
  getReceiptSubtitle,
} from "@/lib/receipt";
import { CampaignImage } from "@/components/ui/campaign-image";
import { CategoryBadge } from "@/components/ui/category-badge";
import { ReceiptDivider, ReceiptLedger, ReceiptLineRow } from "@/components/ui/receipt-lines";

interface CampaignCardProps {
  campaign: Campaign;
  variant?: "default" | "compact";
  /** Override destination (defaults to the public campaign page). */
  href?: Href;
}

function CampaignCardLedger({
  campaign,
  size = "sm",
  boxed = false,
}: {
  campaign: Campaign;
  size?: "xs" | "sm";
  boxed?: boolean;
}) {
  const goalLines = buildGoalLineItems(campaign);
  const footer = buildReceiptFooter(campaign);
  const dividerClass = size === "xs" ? "my-2" : "my-3";

  const ledger = (
    <>
      {goalLines.map((line) => (
        <ReceiptLineRow key={line.label} {...line} size={size} />
      ))}
      <ReceiptDivider className={dividerClass} />
      <ReceiptLineRow {...footer} emphasis size={size} />
    </>
  );

  if (boxed) {
    return <ReceiptLedger>{ledger}</ReceiptLedger>;
  }

  return ledger;
}

export function CampaignCard({
  campaign,
  variant = "default",
  href,
}: CampaignCardProps) {
  const progress = getProgress(campaign.raised, campaign.goal);
  const destination = (href ?? `/campaigns/${campaign.id}`) as Href;
  const subtitle = getReceiptSubtitle(campaign);
  const imageSource = getPrimaryCampaignImage(campaign);
  const fundedLabel =
    campaign.status === "funded" ? "Fully funded" : `${progress}% funded`;

  if (variant === "compact") {
    return (
      <Link href={destination} asChild>
        <Pressable className="w-full active:opacity-90">
          <View className="overflow-hidden rounded-xl border border-dono-border bg-white">
            <CampaignImage image={imageSource} className="h-32">
              <View className="absolute left-3 top-3">
                <CategoryBadge category={campaign.category} />
              </View>
            </CampaignImage>
            <View className="p-4">
              <Text
                className="font-retro-bold text-base text-dono-text"
                numberOfLines={2}
              >
                {campaign.title}
              </Text>
              {subtitle ? (
                <Text className="mt-1 text-xs text-dono-muted" numberOfLines={1}>
                  {subtitle}
                </Text>
              ) : null}
              <View className="mt-2 flex-row items-center justify-between">
                <Text className="font-retro-mono text-xs text-dono-muted">{fundedLabel}</Text>
              </View>

              <View className="mt-3">
                <CampaignCardLedger campaign={campaign} size="xs" boxed />
              </View>

              <View className="mt-3 flex-row items-center justify-between border-t border-dashed border-dono-border pt-3">
                <Text className="font-retro-mono text-xs text-dono-text">
                  {formatCurrency(campaign.raised)} of {formatCurrency(campaign.goal)}
                </Text>
                <View className="flex-row items-center gap-3">
                  <View className="flex-row items-center gap-1">
                    <Heart size={12} color="#56615A" />
                    <Text className="font-retro-mono text-xs text-dono-muted">
                      {campaign.likes}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Users size={12} color="#56615A" />
                    <Text className="font-retro-mono text-xs text-dono-muted">
                      {campaign.donors} donor{campaign.donors === 1 ? "" : "s"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Link>
    );
  }

  return (
    <Link href={destination} asChild>
      <Pressable className="w-full active:opacity-95">
        <View className="overflow-hidden rounded-lg border border-dono-border bg-white">
          <CampaignImage image={imageSource} className="h-40">
            <View className="absolute left-4 top-4">
              <CategoryBadge category={campaign.category} />
            </View>
          </CampaignImage>
          <View className="p-5">
            <View className="flex-row items-start justify-between gap-4">
              <View className="min-w-0 flex-1">
                <Text className="font-retro-bold text-xl text-dono-text" numberOfLines={2}>
                  {campaign.title}
                </Text>
                {subtitle ? (
                  <Text className="mt-1 text-sm text-dono-muted">{subtitle}</Text>
                ) : null}
              </View>
              <Text className="shrink-0 font-retro-mono text-sm text-dono-muted">
                {fundedLabel}
              </Text>
            </View>

            <View className="mt-4">
              <CampaignCardLedger campaign={campaign} boxed />
            </View>

            <View className="mt-4 flex-row items-center justify-between border-t border-dashed border-dono-border pt-4">
              <Text className="font-retro-mono text-sm text-dono-text">
                {formatCurrency(campaign.raised)} of {formatCurrency(campaign.goal)}
              </Text>
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-1.5">
                  <Heart size={14} color="#56615A" />
                  <Text className="font-retro-mono text-sm text-dono-muted">
                    {campaign.likes} like{campaign.likes === 1 ? "" : "s"}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Users size={14} color="#56615A" />
                  <Text className="font-retro-mono text-sm text-dono-muted">
                    {campaign.donors} donor{campaign.donors === 1 ? "" : "s"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
