import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

interface RetroBrowserChromeProps {
  /** Path after joindono.com/, e.g. "campaigns" or "campaigns/my-slug" */
  path: string;
}

export function RetroBrowserChrome({ path }: RetroBrowserChromeProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center gap-3 border-b-[3px] border-retro-ink bg-retro-indigo px-3.5 py-2.5">
      <View className="flex-row gap-1.5">
        <View className="h-3 w-3 rounded-full border-2 border-retro-ink bg-white" />
        <View className="h-3 w-3 rounded-full border-2 border-retro-ink bg-retro-marigold" />
        <View className="h-3 w-3 rounded-full border-2 border-retro-ink bg-retro-ink" />
      </View>
      <Pressable
        onPress={() => router.push("/campaigns")}
        hitSlop={8}
        accessibilityLabel="Back to campaigns"
      >
        <Text className="font-retro-bold text-sm text-retro-paper opacity-90">‹ ›</Text>
      </Pressable>
      <View className="min-w-0 flex-1 rounded-lg border-2 border-retro-ink bg-retro-paper px-3 py-1.5">
        <Text
          className="font-retro-mono text-[12.5px] text-retro-ink"
          numberOfLines={1}
        >
          joindono.com/{path}
        </Text>
      </View>
    </View>
  );
}
