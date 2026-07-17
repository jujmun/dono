import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ActivityItem } from "@/lib/types";
import { RetroMenubar } from "./retro-menubar";
import { RetroTaskbar } from "./retro-taskbar";

interface RetroCampaignsShellProps {
  children: React.ReactNode;
  activity: ActivityItem[] | undefined;
}

export function RetroCampaignsShell({
  children,
  activity,
}: RetroCampaignsShellProps) {
  return (
    <SafeAreaView className="flex-1 bg-retro-cream" edges={["top"]}>
      <View className="retro-desktop-bg flex-1 bg-retro-cream">
        <RetroMenubar />
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-28"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        <SafeAreaView
          edges={["bottom"]}
          className="absolute bottom-0 left-0 right-0 bg-retro-ink"
        >
          <RetroTaskbar activity={activity} />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
