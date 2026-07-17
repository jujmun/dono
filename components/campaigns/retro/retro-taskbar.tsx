import { Link } from "expo-router";
import { View, Text, Pressable, Platform } from "react-native";
import type { ActivityItem } from "@/lib/types";
import { formatCurrency } from "@/lib/constants";
import { RetroClock } from "./retro-clock";

function formatTickerItem(item: ActivityItem) {
  const amount =
    item.amount != null ? ` ${formatCurrency(item.amount)}` : "";
  return `${item.user} ${item.action}${amount} ${item.target}`;
}

interface RetroTaskbarProps {
  activity: ActivityItem[] | undefined;
}

export function RetroTaskbar({ activity }: RetroTaskbarProps) {
  const donationItems = (activity ?? [])
    .filter((item) => item.type === "donation" || item.type === "campaign")
    .slice(0, 12);

  const tickerText =
    donationItems.length > 0
      ? `RECEIPT LOG — ${donationItems.map(formatTickerItem).join("  ·  ")}  ·  `
      : "RECEIPT LOG — Waiting for the next gift…  ·  ";

  return (
    <View className="z-[60] flex-row items-center gap-3 border-t-[3px] border-retro-ink bg-retro-ink px-4 py-2.5 md:gap-4 md:px-[18px]">
      <Link href="/create" asChild>
        <Pressable className="rounded-lg border-2 border-retro-paper bg-retro-marigold px-3.5 py-1.5">
          <Text className="font-retro-bold text-[13px] text-retro-ink">◆ START</Text>
        </Pressable>
      </Link>

      <View className="min-w-0 flex-1 overflow-hidden rounded-md border-2 border-retro-paper bg-[#151310] py-1.5">
        {Platform.OS === "web" ? (
          <View className="retro-ticker-track flex-row">
            <Text className="font-retro-mono text-xs text-retro-paper">
              {tickerText}
            </Text>
            <Text className="font-retro-mono text-xs text-retro-paper">
              {tickerText}
            </Text>
          </View>
        ) : (
          <Text
            className="px-2 font-retro-mono text-xs text-retro-paper"
            numberOfLines={1}
          >
            {tickerText}
          </Text>
        )}
      </View>

      <RetroClock variant="taskbar" className="text-xs" />
    </View>
  );
}
