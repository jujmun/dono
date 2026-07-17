import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { CampaignImage } from "@/components/ui/campaign-image";
import { initialsFor } from "@/lib/utils";
import type { Society } from "@/lib/types";

interface SocietyCardProps {
  society: Society;
}

export function SocietyCard({ society }: SocietyCardProps) {
  return (
    <Link href={`/societies/${society.slug}`} asChild>
      <Pressable className="w-full overflow-hidden rounded-[14px] border-[3px] border-retro-ink bg-retro-paper shadow-[5px_5px_0_#211E1A] active:opacity-95">
        <CampaignImage
          image={society.coverImageUrl ?? "default"}
          className="h-28 border-b-[3px] border-retro-ink bg-retro-indigo"
        >
          <View className="absolute left-4 top-4 h-10 w-10 items-center justify-center rounded-xl border-2 border-retro-ink bg-retro-mint shadow-[3px_3px_0_#211E1A]">
            <Text className="font-retro-bold text-sm text-retro-paper">
              {initialsFor(society.name)}
            </Text>
          </View>
          {society.status === "pending" ? (
            <View className="absolute right-3 top-3 rounded-full border-2 border-retro-ink bg-retro-marigold px-2 py-0.5">
              <Text className="font-retro-bold text-[10px] text-retro-ink">
                Pending review
              </Text>
            </View>
          ) : null}
        </CampaignImage>
        <View className="p-4">
          <Text
            className="font-retro-bold text-sm text-retro-ink"
            numberOfLines={1}
          >
            {society.name}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
