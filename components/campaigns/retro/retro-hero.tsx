import { View, Text } from "react-native";

export function RetroHero() {
  return (
    <View className="mx-4 mt-6 flex-row flex-wrap items-center justify-between gap-5 rounded-2xl border-[3px] border-retro-ink bg-retro-coral px-5 py-[22px] shadow-[5px_5px_0_#211E1A] md:mx-[22px] md:px-[26px]">
      <View className="min-w-0 flex-1">
        <Text className="mb-1.5 font-retro-bold text-[28px] tracking-wide text-retro-paper md:text-[34px]">
          Give. See the receipt.
        </Text>
        <Text className="max-w-md text-[14.5px] leading-5 text-retro-paper opacity-95">
          Fund specific, tangible improvements to Oxford student life — and watch
          exactly where the money goes, line by line.
        </Text>
      </View>
      <View className="rounded-lg border-2 border-retro-ink bg-retro-paper px-3 py-2 shadow-[3px_3px_0_#211E1A]">
        <Text className="font-retro-mono text-xs text-retro-ink">
          SYSTEM: TRANSPARENCY OK
        </Text>
      </View>
    </View>
  );
}
