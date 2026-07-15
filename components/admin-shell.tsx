import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView className="flex-1 bg-dono-bg" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
