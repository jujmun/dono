import { Link } from "expo-router";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
  Image,
} from "react-native";
import { useQuery } from "convex/react";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
} from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { CampaignCard } from "@/components/campaign-card";
import { CommunityCard } from "@/components/community-card";
import { FundCard } from "@/components/fund-card";
import { api } from "@convex/_generated/api";
import type { Campaign, Community, CommunityFund } from "@/lib/types";

export default function HomePage() {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const featuredCampaigns = (useQuery(api.campaigns.listFeatured, {
    limit: 3,
  }) ?? undefined) as Campaign[] | undefined;
  const featuredCommunities = (useQuery(api.communities.listFeatured, {
    limit: 3,
  }) ?? undefined) as Community[] | undefined;
  const featuredFunds = (useQuery(api.funds.listFeatured, {
    limit: 3,
  }) ?? undefined) as CommunityFund[] | undefined;

  const loading =
    featuredCampaigns === undefined ||
    featuredCommunities === undefined ||
    featuredFunds === undefined;

  return (
    <AppShell>
      <View className="bg-dono-cream px-8 py-20 md:px-16 lg:px-24">
        <View className="mx-auto w-full max-w-7xl">
          <View
            className={
              isWide
                ? "flex-row items-center justify-between gap-10"
                : "gap-8"
            }
          >
            <View className={isWide ? "max-w-2xl flex-1" : ""}>
              <Text className="mb-4 font-mono uppercase tracking-wider text-dono-primary">
                Community infrastructure for university giving
              </Text>
              <Text className="mb-4 font-display-medium text-4xl leading-tight text-dono-text">
                Where did my money{" "}
                <Text className="font-display-medium text-dono-accent">actually go?</Text>
              </Text>
              <Text className="text-lg leading-relaxed text-dono-muted">
                Dono enables young alumni to collectively fund tangible improvements
                to student life. Support specific campaigns, follow communities, and
                see the real impact of every contribution.
              </Text>
            </View>
            <Image
              source={require("../assets/dino-hero.png")}
              style={{
                width: isWide ? 220 : 180,
                height: isWide ? 220 : 180,
              }}
              resizeMode="contain"
              accessibilityLabel="Dono dinosaur mascot"
            />
          </View>
        </View>
      </View>

      <View className="mx-auto w-full max-w-7xl py-16 pl-10 pr-4 md:pl-20 lg:pl-28">
        <View className="mb-8">
          <Text className="font-display-medium text-2xl text-dono-text">Active Campaigns</Text>
          <Text className="mt-1 text-dono-muted">
            Tangible projects with clear, specific outcomes
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator color="#1d242f" />
        ) : (
          <View className="w-full gap-6 md:w-1/2">
            {featuredCampaigns!.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </View>
        )}
      </View>

      <View className="mx-auto w-full max-w-7xl px-4 py-16">
        <View className="rounded-2xl border border-dono-border bg-white p-8">
          <View className="items-center">
            <Sparkles size={32} color="#1d242f" />
            <Text className="mb-4 mt-4 text-center font-display text-2xl text-dono-text">
              People don&apos;t dislike giving
            </Text>
            <Text className="text-center text-lg leading-relaxed text-dono-muted">
              They dislike giving without knowing what difference they made. Dono is
              built around visible, specific, low-opacity giving — so every donor knows
              exactly where their money went.
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-dono-surface-muted">
        <View className="mx-auto w-full max-w-7xl px-4 py-16">
          <View className="mb-8">
            <Text className="font-display-medium text-2xl text-dono-text">Communities</Text>
            <Text className="mt-1 text-dono-muted">
              Follow colleges, societies, and departments you care about
            </Text>
          </View>
          {!loading && (
            <View className="gap-6">
              {featuredCommunities!.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </View>
          )}
        </View>
      </View>

      <View className="mx-auto w-full max-w-7xl px-4 py-16">
        <View className="mb-8">
          <Text className="font-display-medium text-2xl text-dono-text">Community Funds</Text>
          <Text className="mt-1 text-dono-muted">
            Donate across related projects without choosing a single campaign
          </Text>
        </View>
        {!loading && (
          <View className="gap-6">
            {featuredFunds!.map((fund) => (
              <FundCard key={fund.id} fund={fund} />
            ))}
          </View>
        )}
      </View>

      <View className="mx-auto w-full max-w-7xl px-4 pb-20">
        <View className="rounded-2xl bg-dono-primary p-8">
          <View className="items-center">
            <TrendingUp size={32} color="#f7f4ed" />
            <Text className="mb-4 mt-4 text-center font-display-medium text-2xl text-white">
              Ready to make a difference?
            </Text>
            <Text className="mb-8 max-w-lg text-center text-dono-cream">
              Join thousands of young alumni building lifelong communities of
              generosity. Every donation deserves a visible outcome.
            </Text>
            <View className="w-full gap-3">
              <Link href="/campaigns" asChild>
                <Pressable className="flex-row items-center justify-center gap-2 rounded-full bg-dono-cream px-6 py-3">
                  <Text className="font-sans-medium text-sm text-dono-text">Find a Campaign</Text>
                  <ArrowRight size={16} color="#1d242f" />
                </Pressable>
              </Link>
              <Link href="/create" asChild>
                <Pressable className="items-center rounded-full border border-dono-cream px-6 py-3">
                  <Text className="font-sans-medium text-sm text-dono-cream">Create a Campaign</Text>
                </Pressable>
              </Link>
            </View>
            <View className="mt-8 flex-row flex-wrap justify-center gap-4">
              {["Free for students", "Secure payments", "Full transparency"].map(
                (label) => (
                  <View key={label} className="flex-row items-center gap-1.5">
                    <CheckCircle2 size={16} color="#f7f4ed" />
                    <Text className="text-sm text-dono-cream/80">{label}</Text>
                  </View>
                )
              )}
            </View>
          </View>
        </View>
      </View>
    </AppShell>
  );
}
