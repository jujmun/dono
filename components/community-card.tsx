import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { Users, Target } from "lucide-react-native";
import type { Community } from "@/lib/types";
import { formatCurrency } from "@/lib/constants";
import { CampaignImage } from "./ui/campaign-image";
import { VerificationBadge } from "./ui/verification-badge";

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Link href={`/communities/${community.id}`} asChild>
      <Pressable className="overflow-hidden rounded-2xl border border-dono-border bg-white active:opacity-95">
        <CampaignImage image={community.coverImage} className="h-28" />

        <View className="relative px-4 pb-4">
          <View className="absolute -top-8 left-4 h-14 w-14 items-center justify-center rounded-xl border-2 border-white bg-dono-primary shadow">
            <Text className="text-lg font-bold text-white">{community.avatar}</Text>
          </View>

          <View className="pt-9">
            <View className="mb-1 flex-row items-start justify-between gap-2">
              <Text className="flex-1 font-semibold text-dono-text">{community.name}</Text>
              {community.verified && community.verificationType && (
                <VerificationBadge
                  verification={{
                    type: community.verificationType,
                    label: "Verified",
                  }}
                />
              )}
            </View>

            <Text className="mb-3 text-xs text-dono-muted">{community.university}</Text>

            <Text className="mb-3 text-sm text-dono-muted" numberOfLines={2}>
              {community.description}
            </Text>

            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center gap-1">
                <Users size={14} color="#6b7c7a" />
                <Text className="text-xs text-dono-muted">
                  {community.followers.toLocaleString()} followers
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Target size={14} color="#6b7c7a" />
                <Text className="text-xs text-dono-muted">
                  {community.campaigns} campaigns
                </Text>
              </View>
            </View>

            <Text className="mt-2 text-sm font-semibold text-dono-primary">
              {formatCurrency(community.totalRaised)} raised
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
