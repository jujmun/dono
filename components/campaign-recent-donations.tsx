import { ActivityIndicator, Text, View } from "react-native";
import { useQuery } from "convex/react";
import { Repeat } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import { formatCurrency } from "@/lib/constants";

interface CampaignRecentDonationsProps {
  campaignSlug: string;
}

export function CampaignRecentDonations({ campaignSlug }: CampaignRecentDonationsProps) {
  const donations = useQuery(
    api.donations.listRecentForCampaign,
    campaignSlug ? { campaignSlug, limit: 8 } : "skip",
  );

  if (donations === undefined) {
    return (
      <View className="items-center py-6">
        <ActivityIndicator color="#211E1A" />
      </View>
    );
  }

  if (donations.length === 0) {
    return (
      <Text className="font-retro-mono text-[12.5px] text-[#5c574f]">
        No donations yet — be the first.
      </Text>
    );
  }

  return (
    <View className="gap-3">
      {donations.map((donation, index) => (
        <View
          key={`${donation.createdAt}-${index}`}
          className="flex-row items-start justify-between gap-3 border-b-2 border-dashed border-retro-ink/20 pb-3 last:border-b-0 last:pb-0"
        >
          <View className="flex-1">
            <Text className="font-retro-bold text-sm text-retro-ink">
              {donation.displayName} donated {formatCurrency(donation.amount)}
              {donation.matchedAmountPounds > 0
                ? ` (+${formatCurrency(donation.matchedAmountPounds)} matched)`
                : ""}
            </Text>
            {donation.viaSocietySubscription ? (
              <View className="mt-1 flex-row items-center gap-1 self-start rounded-full border border-retro-ink/30 bg-retro-cream px-2 py-0.5">
                <Repeat size={10} color="#5c574f" />
                <Text className="font-retro-mono text-[10px] text-[#5c574f]">
                  via society subscription
                </Text>
              </View>
            ) : null}
          </View>
          <Text className="font-retro-mono text-[11px] text-[#5c574f]">
            {donation.relativeTime}
          </Text>
        </View>
      ))}
    </View>
  );
}
