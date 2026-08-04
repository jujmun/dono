import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import type { Href } from "expo-router";

export function DonorCreateGate({
  message,
  backHref = "/campaigns",
  backLabel = "Browse campaigns",
}: {
  message: string;
  backHref?: Href;
  backLabel?: string;
}) {
  return (
    <View className="mx-auto w-full max-w-7xl px-4 py-8">
      <View className="items-center rounded-2xl border border-dono-border bg-white p-10">
        <Text className="text-center font-retro-bold text-xl text-dono-text">
          Not available for donor accounts
        </Text>
        <Text className="mt-2 text-center text-sm text-dono-muted">{message}</Text>
        <Link href={backHref} asChild>
          <Pressable className="mt-6 items-center rounded-full bg-dono-primary px-6 py-3">
            <Text className="font-retro-bold text-sm text-white">{backLabel}</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
