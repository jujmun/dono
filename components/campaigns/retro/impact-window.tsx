import { View, Text } from "react-native";
import type { Campaign, DonorImpact } from "@/lib/types";
import { formatCurrency, getProgress } from "@/lib/constants";
import { RetroWindow } from "./retro-window";

interface ImpactWindowProps {
  isAuthenticated: boolean;
  impact: DonorImpact | undefined;
  selectedCampaign: Campaign | null;
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <View className="items-center rounded-[10px] border-2 border-retro-ink bg-retro-cream p-3">
      <Text className="font-retro-bold text-[22px] text-retro-ink">{value}</Text>
      <Text className="mt-0.5 text-center font-retro-mono text-[10.5px] text-[#5c574f]">
        {label}
      </Text>
    </View>
  );
}

export function ImpactWindow({
  isAuthenticated,
  impact,
  selectedCampaign,
}: ImpactWindowProps) {
  const selectedProgress = selectedCampaign
    ? getProgress(selectedCampaign.raised, selectedCampaign.goal)
    : null;

  const stats: { value: string; label: string }[] = isAuthenticated
    ? [
        {
          value: impact ? formatCurrency(impact.totalDonated) : "…",
          label: "TOTAL GIVEN",
        },
        {
          value: impact ? String(impact.campaignsSupported) : "…",
          label: "CAMPAIGNS SUPPORTED",
        },
        {
          value: impact ? String(impact.communitiesFollowed) : "…",
          label: "COMMUNITIES FOLLOWED",
        },
        {
          value: selectedCampaign
            ? formatCurrency(selectedCampaign.raised)
            : "—",
          label: selectedCampaign
            ? `RAISED FOR ${selectedCampaign.title.slice(0, 18).toUpperCase()}`
            : "SELECT A CAMPAIGN",
        },
        {
          value: selectedProgress != null ? `${selectedProgress}%` : "—",
          label: selectedCampaign
            ? `${selectedCampaign.title.slice(0, 20).toUpperCase()} FUNDED`
            : "FUNDING PROGRESS",
        },
        {
          value: impact
            ? String(Math.min(impact.campaignsSupported, impact.impactHighlights.length || impact.campaignsSupported))
            : "…",
          label: "OUTCOMES VERIFIED",
        },
      ]
    : [
        { value: "—", label: "TOTAL GIVEN" },
        { value: "—", label: "CAMPAIGNS SUPPORTED" },
        { value: "—", label: "COMMUNITIES FOLLOWED" },
        {
          value: selectedCampaign
            ? formatCurrency(selectedCampaign.raised)
            : "—",
          label: selectedCampaign
            ? `RAISED FOR ${selectedCampaign.title.slice(0, 18).toUpperCase()}`
            : "SELECT A CAMPAIGN",
        },
        {
          value: selectedProgress != null ? `${selectedProgress}%` : "—",
          label: selectedCampaign
            ? `${selectedCampaign.title.slice(0, 20).toUpperCase()} FUNDED`
            : "FUNDING PROGRESS",
        },
        { value: "—", label: "OUTCOMES VERIFIED" },
      ];

  return (
    <RetroWindow title="IMPACT.dat — your.dashboard" accent="pink">
      {!isAuthenticated ? (
        <Text className="mb-3 font-retro-mono text-[11px] text-[#5c574f]">
          Sign in to load your personal impact stats.
        </Text>
      ) : null}
      <View className="flex-row flex-wrap gap-2.5">
        {stats.map((stat) => (
          <View key={stat.label} className="w-full min-w-[140px] flex-1 basis-[30%]">
            <StatCell value={stat.value} label={stat.label} />
          </View>
        ))}
      </View>
    </RetroWindow>
  );
}
