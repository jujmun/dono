import { View, Text } from "react-native";
import { AppShell } from "@/components/app-shell";

export default function SocietiesPage() {
  return (
    <AppShell>
      <View className="mx-auto w-full max-w-7xl px-4 py-8">
        <View className="mb-8">
          <Text className="font-display-medium text-2xl text-dono-text">Societies</Text>
        </View>

        <View className="min-h-[40vh] rounded-2xl border border-dono-border bg-white" />
      </View>
    </AppShell>
  );
}
