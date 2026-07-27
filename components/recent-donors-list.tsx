import { View, Text } from "react-native";
import { Gift } from "lucide-react-native";
import { formatCurrency } from "@/lib/constants";

export type RecentDonor = {
  displayName: string;
  amount: number;
  relativeTime: string;
  matchedAmountPounds?: number;
};

type RecentDonorsListProps = {
  donors: RecentDonor[];
};

export function RecentDonorsList({ donors }: RecentDonorsListProps) {
  if (donors.length === 0) {
    return (
      <Text className="font-retro-mono text-[12px] text-[#5c574f]">
        Be the first to support this campaign.
      </Text>
    );
  }

  return (
    <View className="gap-2">
      {donors.map((donor, index) => (
        <View
          key={`${donor.displayName}-${donor.relativeTime}-${index}`}
          className="flex-row items-center gap-3 rounded-lg border border-dashed border-retro-ink bg-white/70 px-3 py-2"
        >
          <View className="h-8 w-8 items-center justify-center rounded-full border-2 border-retro-ink bg-retro-cream">
            <Gift size={12} color="#211E1A" />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="font-retro-bold text-sm text-retro-ink" numberOfLines={1}>
              {donor.displayName}
            </Text>
            <Text className="font-retro-mono text-[11px] text-[#5c574f]">
              {donor.relativeTime}
            </Text>
          </View>
          <Text className="font-retro-mono-bold text-sm text-retro-ink">
            {formatCurrency(donor.amount)}
          </Text>
        </View>
      ))}
    </View>
  );
}
