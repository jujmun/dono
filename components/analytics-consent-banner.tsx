import { Link, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";

type AnalyticsConsentBannerProps = {
  onGrant: () => void;
  onDeny: () => void;
};

export function AnalyticsConsentBanner({
  onGrant,
  onDeny,
}: AnalyticsConsentBannerProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0 z-50 border-t-2 border-retro-ink bg-retro-cream px-4 py-4">
      <Text className="font-retro-bold text-sm text-retro-ink">
        Analytics cookies
      </Text>
      <Text className="mt-1 text-xs leading-relaxed text-[#5c574f]">
        We use PostHog (EU) to understand how the app is used — only if you
        accept. Essential sign-in storage always works. Stripe may set its own
        cookies at checkout.{" "}
        <Link href={"/legal/cookie" as Href} className="underline">
          Cookie Policy
        </Link>
      </Text>
      <View className="mt-3 flex-row flex-wrap gap-2">
        <Pressable
          onPress={onGrant}
          className="rounded-full bg-retro-mint px-4 py-2"
          accessibilityRole="button"
          accessibilityLabel="Accept analytics"
        >
          <Text className="font-retro-bold text-sm text-retro-paper">Accept</Text>
        </Pressable>
        <Pressable
          onPress={onDeny}
          className="rounded-full border-2 border-retro-ink bg-white px-4 py-2"
          accessibilityRole="button"
          accessibilityLabel="Reject analytics"
        >
          <Text className="font-retro-bold text-sm text-retro-ink">Reject</Text>
        </Pressable>
      </View>
    </View>
  );
}
