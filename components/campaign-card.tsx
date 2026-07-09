import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { Heart, Users, MessageCircle } from "lucide-react-native";
import type { Campaign } from "@/lib/types";
import { formatCurrency, getProgress } from "@/lib/constants";
import { CampaignImage } from "./ui/campaign-image";
import { VerificationList } from "./ui/verification-badge";
import { ProgressBar } from "./ui/progress-bar";
import { CategoryBadge } from "./ui/category-badge";

interface CampaignCardProps {
  campaign: Campaign;
  variant?: "default" | "compact";
}

export function CampaignCard({ campaign, variant = "default" }: CampaignCardProps) {
  const progress = getProgress(campaign.raised, campaign.goal);
  const href = `/campaigns/${campaign.id}` as const;

  if (variant === "compact") {
    return (
      <Link href={href} asChild>
        <Pressable className="flex-row gap-3 rounded-xl border border-dono-border bg-white p-3 active:opacity-90">
          <CampaignImage image={campaign.image} className="h-16 w-16 shrink-0 rounded-lg" />
          <View className="min-w-0 flex-1">
            <Text className="text-sm font-semibold text-dono-text" numberOfLines={1}>
              {campaign.title}
            </Text>
            <Text className="text-xs text-dono-muted">{campaign.university}</Text>
            <View className="mt-1.5">
              <ProgressBar value={progress} />
            </View>
            <Text className="mt-1 text-xs font-medium text-dono-primary">
              {formatCurrency(campaign.raised)} of {formatCurrency(campaign.goal)}
            </Text>
          </View>
        </Pressable>
      </Link>
    );
  }

  return (
    <Link href={href} asChild>
      <Pressable className="overflow-hidden rounded-2xl border border-dono-border bg-white active:opacity-95">
        <CampaignImage image={campaign.image} className="h-44">
          <View className="absolute left-3 top-3">
            <CategoryBadge category={campaign.category} />
          </View>
          {campaign.status === "funded" && (
            <View className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5">
              <Text className="text-xs font-semibold text-emerald-700">Fully Funded</Text>
            </View>
          )}
        </CampaignImage>

        <View className="flex-1 p-4">
          <View className="mb-2">
            <VerificationList verifications={campaign.verifications.slice(0, 1)} />
          </View>

          <Text className="mb-1 text-base font-semibold text-dono-text" numberOfLines={2}>
            {campaign.title}
          </Text>

          <Text className="mb-3 text-sm text-dono-muted" numberOfLines={2}>
            {campaign.description}
          </Text>

          <View>
            <ProgressBar value={progress} className="mb-2" />
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-bold text-dono-primary">
                  {formatCurrency(campaign.raised)}
                </Text>
                <Text className="text-xs text-dono-muted">
                  of {formatCurrency(campaign.goal)} goal
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <Users size={14} color="#6b7c7a" />
                  <Text className="text-xs text-dono-muted">{campaign.donors}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Heart size={14} color="#6b7c7a" />
                  <Text className="text-xs text-dono-muted">{campaign.likes}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <MessageCircle size={14} color="#6b7c7a" />
                  <Text className="text-xs text-dono-muted">{campaign.comments}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
