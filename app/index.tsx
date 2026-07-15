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
import { LedgerHeroIllustration } from "@/components/ledger-hero-illustration";
import { ReceiptDivider, ReceiptLedger, ReceiptLineRow } from "@/components/ui/receipt-lines";
import { api } from "@convex/_generated/api";
import type { Campaign } from "@/lib/types";

const sectionClass = "mx-auto w-full max-w-7xl px-4 md:px-8 py-12 md:py-16";

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
      <View className="bg-dono-cream px-4 py-16 md:px-8 md:py-20">
        <View className="mx-auto w-full max-w-7xl">
          <View
            className={
              isWide
                ? "flex-row items-center justify-between gap-10"
                : "items-center gap-8"
            }
          >
            <View className={isWide ? "max-w-2xl flex-1" : "w-full"}>
              <Text className="mb-4 font-mono uppercase tracking-wider text-dono-primary">
                Community infrastructure for university giving
              </Text>
              <Text className="mb-4 font-display-medium text-4xl leading-tight text-dono-text">
                Where did my{" "}
                <Text className="font-display-medium text-dono-accent">dono</Text> actually go?
              </Text>
              <Text className="text-lg leading-relaxed text-dono-muted">
                Dono enables young alumni to collectively fund tangible improvements
                to student life. Support specific campaigns, follow communities, and
                see the real impact of every contribution.
              </Text>
            </View>
            <LedgerHeroIllustration size={isWide ? "md" : "sm"} />
          </View>
        </View>
      </View>

      <View className={sectionClass}>
        <View className="mb-8 items-center">
          <Text className="font-display-medium text-2xl text-dono-text">
            Active Campaigns
          </Text>
          <Text className="mt-1 text-center text-dono-muted">
            Tangible projects with clear, specific outcomes
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator color="#1c2420" />
        ) : (
          <CampaignCardGrid
            campaigns={featuredCampaigns!}
            variant="compact"
            featured
          />
        )}
      </View>

      <View className={sectionClass}>
        <View className="rounded-2xl border border-dono-border bg-white p-8">
          <View className="items-center">
            <Text className="text-center font-display text-2xl text-dono-text">
              People don&apos;t dislike giving
            </Text>
            <View className="my-4 w-full max-w-md border-b border-dashed border-dono-border" />
            <Text className="text-center text-lg leading-relaxed text-dono-muted">
              They dislike giving without knowing what difference they made. Dono is
              built around visible, specific, low-opacity giving — so every donor knows
              exactly where their money went.
            </Text>
          </View>
        </View>
      </View>

      <View className={sectionClass}>
        <View className="rounded-2xl border border-dono-border bg-white p-8">
          <Text className="text-center font-display-medium text-2xl text-dono-text">
            Ready to make a difference?
          </Text>
          <Text className="mx-auto mt-3 max-w-lg text-center text-dono-muted">
            Join thousands of young alumni building lifelong communities of
            generosity. Every donation deserves a visible outcome.
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

          <View
            className={
              isWide
                ? "mx-auto mt-8 flex-row justify-center gap-3"
                : "mt-8 gap-3"
            }
          >
            <Link href="/campaigns" asChild>
              <Pressable
                className={`flex-row items-center justify-center gap-2 rounded-full bg-dono-primary px-6 py-3 ${
                  isWide ? "" : "w-full"
                }`}
              >
                <Text className="font-sans-medium text-sm text-white">
                  Find a Campaign
                </Text>
                <ArrowRight size={16} color="#ffffff" />
              </Pressable>
            </Link>
            <Link href="/create" asChild>
              <Pressable
                className={`items-center rounded-full border border-dono-primary px-6 py-3 ${
                  isWide ? "" : "w-full"
                }`}
              >
                <Text className="font-sans-medium text-sm text-dono-primary">
                  Create a Campaign
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </AppShell>
  );
}
