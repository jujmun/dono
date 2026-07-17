import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export function RetroBrowserFooter() {
  return (
    <View className="flex-row flex-wrap justify-between gap-6 border-t-[3px] border-retro-ink bg-retro-cream px-[26px] py-7">
      <View className="max-w-xs">
        <Text className="mb-1.5 font-retro-bold text-[17px] text-retro-ink">
          Dono
        </Text>
        <Text className="text-[12.5px] leading-5 text-[#5c574f]">
          Community infrastructure for transparent university giving.
        </Text>
      </View>
      <View>
        <Text className="mb-2 font-retro-bold text-[13px] text-retro-ink">
          Platform
        </Text>
        <Link href="/campaigns" asChild>
          <Pressable className="mb-1.5">
            <Text className="text-[12.5px] text-[#4a453c]">Campaigns</Text>
          </Pressable>
        </Link>
        <Link href="/societies" asChild>
          <Pressable>
            <Text className="text-[12.5px] text-[#4a453c]">Societies</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
