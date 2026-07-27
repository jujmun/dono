import { Link } from "expo-router";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useQuery } from "convex/react";
import { ArrowRight } from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { CampaignCardGrid } from "@/components/campaign-card-grid";
import { RetroPanel } from "@/components/retro";
import { ReceiptDivider, ReceiptLedger, ReceiptLineRow } from "@/components/ui/receipt-lines";
import { api } from "@convex/_generated/api";
import type { Campaign } from "@/lib/types";
import { formatCurrency } from "@/lib/constants";

export default function HomePage() {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const featuredCampaigns = (useQuery(api.campaigns.listFeatured, {
    limit: 3,
  }) ?? undefined) as Campaign[] | undefined;
  const allCampaigns = (useQuery(api.campaigns.list) ?? []) as Campaign[];

  const loading = featuredCampaigns === undefined;
  const totalRaised = allCampaigns.reduce((sum, c) => sum + c.raised, 0);
  const campaignCount = allCampaigns.length;

  return (
    <AppShell>
      <View className="mb-8 flex-row flex-wrap items-center justify-between gap-5 rounded-2xl border-[3px] border-retro-ink bg-retro-coral px-5 py-6 shadow-[5px_5px_0_#211E1A] md:px-8 md:py-8">
        <View className="min-w-0 flex-1">
          <Text className="mb-2 font-retro-mono text-xs uppercase text-retro-paper opacity-90">
            Community infrastructure for university giving
          </Text>
          <Text className="mb-3 font-retro-bold text-[32px] leading-tight text-retro-paper md:text-4xl">
            Give. See the receipt.
          </Text>
          <Text className="max-w-xl text-[15px] leading-6 text-retro-paper opacity-95">
            Fund specific, tangible improvements to student life — and watch
            exactly where the money goes, line by line.
          </Text>
        </View>
        <View className="rounded-lg border-2 border-retro-ink bg-retro-paper px-3 py-2 shadow-[3px_3px_0_#211E1A]">
          <Text className="font-retro-mono text-xs text-retro-ink">
            SYSTEM: TRANSPARENCY OK
          </Text>
        </View>
      </View>

      <View className="mb-10">
        <View className="mb-6 items-center">
          <Text className="font-retro-bold text-2xl text-retro-ink">
            Active Campaigns
          </Text>
          <Text className="mt-1 text-center text-dono-muted">
            Tangible projects with clear, specific outcomes
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator color="#211E1A" />
        ) : (
          <CampaignCardGrid campaigns={featuredCampaigns!} featured />
        )}
      </View>

      <RetroPanel title="WHY_DONO.txt" accent="marigold">
        <Text className="text-center font-retro-bold text-xl text-retro-ink">
          People don&apos;t dislike giving
        </Text>
        <View className="my-4 border-t border-dashed border-retro-ink" />
        <Text className="text-center text-base leading-6 text-dono-muted">
          They dislike giving without knowing what difference they made. Dono is
          built around visible, specific giving — so every donor knows exactly
          where their money went.
        </Text>
      </RetroPanel>

      <RetroPanel title="IMPACT.dat" accent="coral" className="mb-0">
        <Text className="text-center font-retro-bold text-2xl text-retro-ink">
          Ready to make a difference?
        </Text>
        <Text className="mx-auto mt-3 max-w-lg text-center text-dono-muted">
          Join young alumni building lifelong communities of generosity. Every
          donation deserves a visible outcome.
        </Text>

        <ReceiptLedger className="mx-auto mt-8 max-w-md">
          <ReceiptLineRow label="Given on Dono" amount={totalRaised} />
          <ReceiptDivider />
          <ReceiptLineRow
            label="Campaigns funded"
            amount={campaignCount.toString()}
          />
          <ReceiptDivider />
          <ReceiptLineRow label="Platform fee" amount="0%" />
        </ReceiptLedger>

        <Text className="mt-2 text-center font-retro-mono text-xs text-[#5c574f]">
          {formatCurrency(totalRaised)} raised across {campaignCount} campaigns
        </Text>

        <View
          className={
            isWide
              ? "mx-auto mt-8 flex-row justify-center gap-3"
              : "mt-8 gap-3"
          }
        >
          <Link href="/campaigns" asChild>
            <Pressable
              className={`flex-row items-center justify-center gap-2 rounded-full border-2 border-retro-ink bg-retro-mint px-6 py-3 shadow-[3px_3px_0_#211E1A] ${
                isWide ? "" : "w-full"
              }`}
            >
              <Text className="font-retro-bold text-sm text-retro-paper">
                Find a Campaign
              </Text>
              <ArrowRight size={16} color="#FFF9EF" />
            </Pressable>
          </Link>
          <Link href="/create" asChild>
            <Pressable
              className={`items-center rounded-full border-2 border-retro-ink bg-retro-paper px-6 py-3 shadow-[3px_3px_0_#211E1A] ${
                isWide ? "" : "w-full"
              }`}
            >
              <Text className="font-retro-bold text-sm text-retro-ink">
                Create a Campaign
              </Text>
            </Pressable>
          </Link>
        </View>
      </RetroPanel>
    </AppShell>
  );
}
