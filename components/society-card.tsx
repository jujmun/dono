import { View, Text } from "react-native";
import { CampaignImage } from "@/components/ui/campaign-image";
import type { Society } from "@/lib/types";

interface SocietyCardProps {
  society: Society;
}

function initialsFor(name: string): string {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return initials || "S";
}

export function SocietyCard({ society }: SocietyCardProps) {
  return (
    <View className="w-full overflow-hidden rounded-lg border border-dono-border bg-white">
      <CampaignImage image={society.coverImageUrl ?? "default"} className="h-28">
        <View className="absolute left-4 top-4 h-10 w-10 items-center justify-center rounded-xl border-2 border-white bg-dono-primary shadow">
          <Text className="font-sans-medium text-sm text-white">
            {initialsFor(society.name)}
          </Text>
        </View>
        {society.status === "pending" ? (
          <View className="absolute right-3 top-3 rounded-full bg-amber-500 px-2 py-0.5">
            <Text className="font-sans-medium text-[10px] text-white">Pending review</Text>
          </View>
        ) : null}
      </CampaignImage>
      <View className="p-4">
        <Text className="font-display-medium text-sm text-dono-text" numberOfLines={1}>
          {society.name}
        </Text>
      </View>
    </View>
  );
}
