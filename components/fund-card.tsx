import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { Users, Target } from "lucide-react-native";
import type { CommunityFund } from "@/lib/types";
import { formatCurrency } from "@/lib/constants";
import { CampaignImage } from "./ui/campaign-image";
import { CategoryBadge } from "./ui/category-badge";

interface FundCardProps {
  fund: CommunityFund;
}

export function FundCard({ fund }: FundCardProps) {
  return (
    <Link href="/funds" asChild>
      <Pressable className="overflow-hidden rounded-2xl border border-dono-border bg-white active:opacity-95">
        <CampaignImage image={fund.image} className="h-36">
          <View className="absolute left-3 top-3">
            <CategoryBadge category={fund.category} />
          </View>
        </CampaignImage>

        <View className="flex-1 p-4">
          <Text className="mb-1 font-sans-medium text-dono-text">{fund.name}</Text>
          <Text className="mb-3 text-sm text-dono-muted" numberOfLines={2}>
            {fund.description}
          </Text>

          <Text className="mb-3 font-mono-medium text-xl text-dono-primary">
            {formatCurrency(fund.totalRaised)}
          </Text>

          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <Users size={14} color="#5e6473" />
              <Text className="text-xs text-dono-muted">
                {fund.donors.toLocaleString()} donors
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Target size={14} color="#5e6473" />
              <Text className="text-xs text-dono-muted">
                {fund.campaignsSupported} campaigns
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
