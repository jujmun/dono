import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RetroBrowserChrome } from "./retro-browser-chrome";
import { RetroBrowserSitehead } from "./retro-browser-sitehead";
import { RetroBrowserFooter } from "./retro-browser-footer";

interface RetroBrowserShellProps {
  /** Path after joindono.com/, e.g. "campaigns" or "campaigns/my-slug" */
  path: string;
  children: React.ReactNode;
}

export function RetroBrowserShell({ path, children }: RetroBrowserShellProps) {
  return (
    <SafeAreaView className="flex-1 bg-retro-paper" edges={["top", "bottom"]}>
      <View className="flex-1 bg-retro-paper">
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow"
          showsVerticalScrollIndicator={false}
        >
          <View className="min-h-full w-full flex-1 overflow-hidden border-b-[3px] border-retro-ink bg-retro-paper">
            <RetroBrowserChrome path={path} />
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
