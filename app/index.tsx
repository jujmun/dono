import { Link } from "expo-router";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useQuery } from "convex/react";
import {
  ArrowRight,
  Shield,
  Heart,
  Users,
  Eye,
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

const principles = [
  {
    icon: Eye,
    title: "Radical transparency",
    description: "See exactly where every pound goes. No opaque institutional funds.",
  },
  {
    icon: Heart,
    title: "Small donations, big impact",
    description: "Thousands of meaningful £10–£50 donations create enormous collective change.",
  },
  {
    icon: Users,
    title: "Communities over campaigns",
    description: "Campaigns come and go. Communities of supporters remain.",
  },
  {
    icon: Shield,
    title: "Trust through visibility",
    description: "Verified identities, institutional endorsements, and community validation.",
  },
];

const engagementLoop = [
  "Donate",
  "Receive updates",
  "See impact",
  "Friends donate",
  "Match donations",
  "Dono Wrapped",
  "Donate again",
];

export default function HomePage() {
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
      <View className="bg-dono-primary px-4 py-20">
        <View className="mx-auto w-full max-w-7xl">
          <Text className="mb-4 text-sm font-semibold uppercase tracking-wider text-emerald-200">
            Community infrastructure for university giving
          </Text>
          <Text className="mb-6 text-4xl font-bold leading-tight text-white">
            Where did my money{" "}
            <Text className="text-dono-accent">actually go?</Text>
          </Text>
          <Text className="mb-8 text-lg leading-relaxed text-emerald-100">
            Dono enables young alumni to collectively fund tangible improvements to
            student life. Support specific campaigns, follow communities, and see the
            real impact of every contribution.
          </Text>
          <View className="flex-col gap-3 sm:flex-row">
            <Link href="/campaigns" asChild>
              <Pressable className="flex-row items-center justify-center gap-2 rounded-full bg-dono-accent px-6 py-3">
                <Text className="text-sm font-semibold text-white">Explore Campaigns</Text>
                <ArrowRight size={16} color="#fff" />
              </Pressable>
            </Link>
            <Link href="/create" asChild>
              <Pressable className="items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3">
                <Text className="text-sm font-semibold text-white">Start a Campaign</Text>
              </Pressable>
            </Link>
          </View>

          <View className="mt-12 flex-row gap-8">
            {[
              { value: "£2.4M+", label: "Raised" },
              { value: "12K+", label: "Donors" },
              { value: "340+", label: "Campaigns" },
            ].map((stat) => (
              <View key={stat.label}>
                <Text className="text-2xl font-bold text-white">{stat.value}</Text>
                <Text className="text-sm text-emerald-200">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className="mx-auto w-full max-w-7xl px-4 py-16">
        <View className="rounded-2xl border border-dono-border bg-white p-8">
          <View className="items-center">
            <Sparkles size={32} color="#e8724a" />
            <Text className="mb-4 mt-4 text-center text-2xl font-bold text-dono-text">
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

      <View className="mx-auto w-full max-w-7xl px-4 py-16">
        <View className="mb-8">
          <Text className="text-2xl font-bold text-dono-text">Active Campaigns</Text>
          <Text className="mt-1 text-dono-muted">
            Tangible projects with clear, specific outcomes
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator color="#0d5c4b" />
        ) : (
          <View className="gap-6">
            {featuredCampaigns!.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </View>
        )}
      </View>

      <View className="bg-dono-surface-muted">
        <View className="mx-auto w-full max-w-7xl px-4 py-16">
          <View className="mb-10 items-center">
            <Text className="text-2xl font-bold text-dono-text">Built on trust</Text>
            <Text className="mt-2 text-dono-muted">
              Every product decision reinforces transparency and community
            </Text>
          </View>
          <View className="gap-6">
            {principles.map((p) => (
              <View
                key={p.title}
                className="rounded-2xl border border-dono-border bg-white p-6"
              >
                <View className="mb-4 h-10 w-10 items-center justify-center rounded-xl bg-dono-primary/10">
                  <p.icon size={20} color="#0d5c4b" />
                </View>
                <Text className="mb-2 font-semibold text-dono-text">{p.title}</Text>
                <Text className="text-sm leading-relaxed text-dono-muted">
                  {p.description}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className="mx-auto w-full max-w-7xl px-4 py-16">
        <View className="mb-10 items-center">
          <Text className="text-2xl font-bold text-dono-text">
            Making generosity habitual
          </Text>
          <Text className="mt-2 text-dono-muted">
            The donor journey is continuous, not one-off
          </Text>
        </View>
        <View className="flex-row flex-wrap items-center justify-center gap-2">
          {engagementLoop.map((step, i) => (
            <View key={step} className="flex-row items-center gap-2">
              <View className="rounded-full bg-dono-primary/10 px-4 py-2">
                <Text className="text-sm font-medium text-dono-primary">{step}</Text>
              </View>
              {i < engagementLoop.length - 1 && (
                <Text className="text-dono-muted">→</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      <View className="bg-dono-surface-muted">
        <View className="mx-auto w-full max-w-7xl px-4 py-16">
          <View className="mb-8">
            <Text className="text-2xl font-bold text-dono-text">Communities</Text>
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
          <Text className="text-2xl font-bold text-dono-text">Community Funds</Text>
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
            <TrendingUp size={32} color="#e8724a" />
            <Text className="mb-4 mt-4 text-center text-2xl font-bold text-white">
              Ready to make a difference?
            </Text>
            <Text className="mb-8 max-w-lg text-center text-emerald-100">
              Join thousands of young alumni building lifelong communities of
              generosity. Every donation deserves a visible outcome.
            </Text>
            <View className="w-full gap-3">
              <Link href="/campaigns" asChild>
                <Pressable className="flex-row items-center justify-center gap-2 rounded-full bg-dono-accent px-6 py-3">
                  <Text className="text-sm font-semibold text-white">Find a Campaign</Text>
                  <ArrowRight size={16} color="#fff" />
                </Pressable>
              </Link>
              <Link href="/create" asChild>
                <Pressable className="items-center rounded-full border border-white/30 px-6 py-3">
                  <Text className="text-sm font-semibold text-white">Create a Campaign</Text>
                </Pressable>
              </Link>
            </View>
            <View className="mt-8 flex-row flex-wrap justify-center gap-4">
              {["Free for students", "Secure payments", "Full transparency"].map(
                (label) => (
                  <View key={label} className="flex-row items-center gap-1.5">
                    <CheckCircle2 size={16} color="#a7f3d0" />
                    <Text className="text-sm text-emerald-200">{label}</Text>
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
