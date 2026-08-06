import { Platform, ScrollView, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RetroBrowserSitehead } from "./retro-browser-sitehead";
import { RetroBrowserFooter } from "./retro-browser-footer";

interface RetroBrowserShellProps {
  children: React.ReactNode;
  /** @deprecated Unused — kept for call-site compatibility */
  path?: string;
}

const WEB_HIDE_SCROLLBAR = {
  scrollbarWidth: "none",
  msOverflowStyle: "none",
} as ViewStyle;

export function RetroBrowserShell({ children }: RetroBrowserShellProps) {
  return (
    <SafeAreaView className="flex-1 bg-retro-paper" edges={["top", "bottom"]}>
      <View className="flex-1 bg-retro-paper">
        <ScrollView
          className="no-scrollbar flex-1"
          contentContainerClassName="grow"
          showsVerticalScrollIndicator={false}
          style={Platform.OS === "web" ? WEB_HIDE_SCROLLBAR : undefined}
        >
          <View className="min-h-full w-full flex-1 border-b-[3px] border-retro-ink bg-retro-paper">
            <RetroBrowserSitehead />
            <View className="w-full px-5 py-5 md:px-10 md:pb-10 md:pt-6 lg:px-14">
              {children}
            </View>
            <RetroBrowserFooter />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
