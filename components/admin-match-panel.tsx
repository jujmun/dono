import { View, Text } from "react-native";

/**
 * CR-02a: Match window admin UI removed. Creation is blocked at the API boundary.
 */
export function AdminMatchPanel(_props: {
  campaignSlug: string;
  enabled: boolean;
}) {
  return (
    <View className="mt-6 rounded-2xl border border-dono-border bg-white p-5">
      <Text className="font-retro-bold text-base text-dono-text">
        Matched funding unavailable
      </Text>
      <Text className="mt-2 text-sm text-dono-muted">
        Match windows have been removed for the Society-only beta.
      </Text>
    </View>
  );
}
