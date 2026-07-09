import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header, MobileNav, Footer } from "@/components/layout";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView className="flex-1 bg-dono-bg" edges={["top"]}>
      <View className="flex-1">
        <Header />
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-24 md:pb-0"
          keyboardShouldPersistTaps="handled"
        >
          {children}
          <Footer />
        </ScrollView>
        <MobileNav />
      </View>
    </SafeAreaView>
  );
}
