import { type Href, Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { Users } from "lucide-react-native";
import type { Campaign } from "@/lib/types";
import { formatCurrency, getProgress } from "@/lib/constants";
import { getPrimaryCampaignImage } from "@/lib/campaign-images";
import { buildReceiptLines, getReceiptSubtitle } from "@/lib/receipt";
import { CampaignImage } from "@/components/ui/campaign-image";
import { CategoryBadge } from "@/components/ui/category-badge";

interface CampaignCardProps {
  campaign: Campaign;
  variant?: "default" | "compact";
  /** Override destination (defaults to the public campaign page). */
  href?: Href;
}

function ReceiptDivider() {
  return <View className="my-4 border-t border-dashed border-dono-border" />;
}

function ReceiptLineRow({
  label,
  amount,
  muted,
}: {
  label: string;
  amount: number;
  muted?: boolean;
}) {
  return (
    <View className="mb-2 flex-row items-baseline justify-between gap-4">
      <Text
        className={`flex-1 font-mono text-sm ${muted ? "text-dono-muted" : "text-dono-text"}`}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Text
        className={`font-mono text-sm ${muted ? "text-dono-muted" : "text-dono-text"}`}
      >
        {formatCurrency(amount)}
      </Text>
    </View>
  );
}

export function CampaignCard({
  campaign,
  variant = "default",
  href,
}: CampaignCardProps) {
  const progress = getProgress(campaign.raised, campaign.goal);
  const destination = (href ?? `/campaigns/${campaign.id}`) as Href;
  const receiptLines = buildReceiptLines(campaign);
  const subtitle = getReceiptSubtitle(campaign);
  const imageSource = getPrimaryCampaignImage(campaign);

  if (variant === "compact") {
    return (
      <Link href={destination} asChild>
        <Pressable className="w-full overflow-hidden rounded-lg border border-dono-border bg-white active:opacity-90">
          <CampaignImage image={imageSource} className="h-28">
            <View className="absolute left-3 top-3">
              <CategoryBadge category={campaign.category} />
            </View>
          </CampaignImage>
          <View className="p-4">
          <View className="mb-2 flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1">
              <Text className="font-display-medium text-sm text-dono-text" numberOfLines={1}>
                {campaign.title}
              </Text>
              <Text className="text-xs text-dono-muted" numberOfLines={1}>
                {subtitle}
              </Text>
            </View>
            <Text className="font-mono text-xs text-dono-muted">{progress}% funded</Text>
          </View>
          <ReceiptDivider />
          {receiptLines.slice(0, 3).map((line) => (
            <ReceiptLineRow key={line.label} {...line} />
          ))}
          <ReceiptDivider />
          <View className="flex-row items-center justify-between">
            <Text className="font-mono text-xs text-dono-text">
              {formatCurrency(campaign.raised)} of {formatCurrency(campaign.goal)}
            </Text>
            <View className="flex-row items-center gap-1">
              <Users size={12} color="#56615A" />
              <Text className="font-mono text-xs text-dono-muted">
                {campaign.donors} donor{campaign.donors === 1 ? "" : "s"}
              </Text>
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
              <Text className="font-display-medium text-2xl text-dono-text">{campaign.title}</Text>
              {subtitle ? (
                <Text className="mt-1 text-sm text-dono-muted">{subtitle}</Text>
              ) : null}
            </View>
            <Text className="font-mono text-sm text-dono-muted">
              {campaign.status === "funded" ? "Fully funded" : `${progress}% funded`}
            </Text>
          </View>

          <ReceiptDivider />

          {receiptLines.map((line) => (
            <ReceiptLineRow key={line.label} {...line} />
          ))}

          <ReceiptDivider />

          <View className="flex-row items-center justify-between">
            <Text className="font-mono text-sm text-dono-text">
              {formatCurrency(campaign.raised)} of {formatCurrency(campaign.goal)}
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Users size={14} color="#56615A" />
              <Text className="font-mono text-sm text-dono-muted">
                {campaign.donors} donor{campaign.donors === 1 ? "" : "s"}
              </Text>
            </View>
          </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
