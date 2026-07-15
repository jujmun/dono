import { View, Text } from "react-native";
import { CampaignImage } from "@/components/ui/campaign-image";
import type { MockSociety } from "@/lib/mock-societies";

interface SocietyCardProps {
  society: MockSociety;
}

export function SocietyCard({ society }: SocietyCardProps) {
  return (
    <View className="w-full overflow-hidden rounded-lg border border-dono-border bg-white">
      <CampaignImage image={society.id} className="h-28">
        <View className="absolute left-4 top-4 h-10 w-10 items-center justify-center rounded-xl border-2 border-white bg-dono-primary shadow">
          <Text className="font-sans-medium text-sm text-white">{society.icon}</Text>
        </View>
      </CampaignImage>
      <View className="p-4">
        <Text className="font-display-medium text-sm text-dono-text" numberOfLines={1}>
          {society.name}
        </Text>
      </View>
    </View>
  );
}
