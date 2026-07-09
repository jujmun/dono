import { Link, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import {
  Heart,
  Share2,
  UserPlus,
  Gift,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react-native";
import { usePostHog } from "posthog-react-native";
import { AppShell } from "@/components/app-shell";
import { CampaignImage } from "@/components/ui/campaign-image";
import { VerificationList } from "@/components/ui/verification-badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CategoryBadge } from "@/components/ui/category-badge";
import { EngagementStats } from "@/components/activity-feed";
import { CampaignCard } from "@/components/campaign-card";
import { formatCurrency, getProgress } from "@/lib/constants";
import type { Campaign } from "@/lib/types";
import { api } from "@convex/_generated/api";

const donationAmounts = [10, 25, 50, 100];

export default function CampaignDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const posthog = usePostHog();
  const campaign = useQuery(api.campaigns.getBySlug, {
    slug: id ?? "",
  }) as Campaign | null | undefined;

  const related = useQuery(
    api.campaigns.listRelated,
    campaign
      ? { slug: campaign.id, category: campaign.category, limit: 2 }
      : "skip"
  ) as Campaign[] | undefined;

  useEffect(() => {
    if (campaign) {
      posthog?.capture("campaign_viewed", {
        campaign_id: campaign.id,
        campaign_title: campaign.title,
        campaign_category: campaign.category,
        campaign_university: campaign.university,
        campaign_goal: campaign.goal,
        campaign_raised: campaign.raised,
        campaign_status: campaign.status,
      });
    }
  }, [campaign?.id]);

  if (campaign === undefined) {
    return (
      <AppShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#0d5c4b" />
        </View>
      </AppShell>
    );
  }

  if (campaign === null) {
    return (
      <AppShell>
        <View className="mx-auto w-full max-w-7xl px-4 py-16">
          <Text className="text-center text-dono-muted">Campaign not found.</Text>
          <Link href="/campaigns" asChild>
            <Pressable className="mt-4 items-center">
              <Text className="font-semibold text-dono-primary">Back to campaigns</Text>
            </Pressable>
          </Link>
        </View>
      </AppShell>
    );
  }

  const progress = getProgress(campaign.raised, campaign.goal);

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-7xl px-4 py-6">
        <Link href="/campaigns" asChild>
          <Pressable className="mb-4 flex-row items-center gap-1">
            <ArrowLeft size={16} color="#6b7c7a" />
            <Text className="text-sm text-dono-muted">Back to campaigns</Text>
          </Pressable>
        </Link>

        <CampaignImage image={campaign.image} className="mb-6 h-56 rounded-2xl">
          <View className="absolute left-4 top-4">
            <CategoryBadge category={campaign.category} />
          </View>
          {campaign.status === "funded" && (
            <View className="absolute right-4 top-4 flex-row items-center gap-1.5 rounded-full bg-white/90 px-3 py-1">
              <CheckCircle2 size={16} color="#047857" />
              <Text className="text-sm font-semibold text-emerald-700">Fully Funded</Text>
            </View>
          )}
        </CampaignImage>

        <View className="mb-4">
          <VerificationList verifications={campaign.verifications} size="md" />
        </View>

        <Text className="mb-3 text-2xl font-bold text-dono-text">{campaign.title}</Text>

        <View className="mb-4 gap-2">
          <View className="flex-row items-center gap-1">
            <MapPin size={16} color="#6b7c7a" />
            <Text className="text-sm text-dono-muted">
              {campaign.university}
              {campaign.college ? ` · ${campaign.college}` : ""}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Clock size={16} color="#6b7c7a" />
            <Text className="text-sm text-dono-muted">
              Deadline:{" "}
              {new Date(campaign.deadline).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        <EngagementStats
          likes={campaign.likes}
          donors={campaign.donors}
          followers={campaign.followers}
          comments={campaign.comments}
          className="mb-6"
        />

        <View className="mb-8 rounded-2xl border border-dono-border bg-white p-6">
          <Text className="mb-3 text-lg font-semibold text-dono-text">The Story</Text>
          <Text className="leading-relaxed text-dono-muted">{campaign.story}</Text>
        </View>

        {campaign.impactItems && (
          <View className="mb-8 rounded-2xl border border-dono-border bg-white p-6">
            <Text className="mb-3 text-lg font-semibold text-dono-text">
              What your donation funds
            </Text>
            <View className="gap-2">
              {campaign.impactItems.map((item) => (
                <View key={item} className="flex-row items-start gap-2">
                  <CheckCircle2 size={16} color="#0d5c4b" />
                  <Text className="flex-1 text-sm text-dono-muted">{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {campaign.updates.length > 0 && (
          <View className="mb-8">
            <Text className="mb-4 text-lg font-semibold text-dono-text">Updates</Text>
            <View className="gap-4">
              {campaign.updates.map((update) => (
                <View
                  key={update.id}
                  className="rounded-2xl border border-dono-border bg-white p-5"
                >
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="font-semibold text-dono-text">{update.title}</Text>
                    <Text className="text-xs text-dono-muted">
                      {new Date(update.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                  <Text className="text-sm leading-relaxed text-dono-muted">
                    {update.content}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className="mb-8 rounded-2xl border border-dono-border bg-white p-5">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-xl bg-dono-primary">
              <Text className="text-sm font-bold text-white">{campaign.creator.avatar}</Text>
            </View>
            <View>
              <Text className="font-semibold text-dono-text">{campaign.creator.name}</Text>
              <Text className="text-sm capitalize text-dono-muted">
                {campaign.creator.type}
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-8 rounded-2xl border border-dono-border bg-white p-6">
          <View className="mb-4 flex-row items-baseline justify-between">
            <Text className="text-3xl font-bold text-dono-primary">
              {formatCurrency(campaign.raised)}
            </Text>
            <Text className="text-sm text-dono-muted">
              of {formatCurrency(campaign.goal)}
            </Text>
          </View>
          <ProgressBar value={progress} className="mt-3" showLabel />
          <Text className="mt-2 text-sm text-dono-muted">
            {campaign.donors} donors · {campaign.followers} followers
          </Text>

          {campaign.status !== "funded" && (
            <>
              <View className="mb-4 mt-4 flex-row gap-2">
                {donationAmounts.map((amount) => (
                  <Pressable
                    key={amount}
                    onPress={() =>
                      posthog?.capture("donation_amount_selected", {
                        campaign_id: campaign.id,
                        campaign_title: campaign.title,
                        amount,
                      })
                    }
                    className="flex-1 items-center rounded-xl border border-dono-border py-2.5"
                  >
                    <Text className="text-sm font-semibold text-dono-text">£{amount}</Text>
                  </Pressable>
                ))}
              </View>
              <Pressable
                onPress={() =>
                  posthog?.capture("donation_started", {
                    campaign_id: campaign.id,
                    campaign_title: campaign.title,
                    campaign_category: campaign.category,
                    campaign_goal: campaign.goal,
                    campaign_raised: campaign.raised,
                  })
                }
                className="mb-3 flex-row items-center justify-center gap-2 rounded-full bg-dono-accent py-3"
              >
                <Gift size={16} color="#fff" />
                <Text className="text-sm font-semibold text-white">Donate Now</Text>
              </Pressable>
            </>
          )}

          <View className="flex-row gap-2">
            <Pressable
              onPress={() =>
                posthog?.capture("campaign_liked", {
                  campaign_id: campaign.id,
                  campaign_title: campaign.title,
                  campaign_category: campaign.category,
                })
              }
              className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border border-dono-border py-2.5"
            >
              <Heart size={16} color="#6b7c7a" />
              <Text className="text-sm font-medium text-dono-muted">Like</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                posthog?.capture("campaign_followed", {
                  campaign_id: campaign.id,
                  campaign_title: campaign.title,
                  campaign_category: campaign.category,
                })
              }
              className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border border-dono-border py-2.5"
            >
              <UserPlus size={16} color="#6b7c7a" />
              <Text className="text-sm font-medium text-dono-muted">Follow</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                posthog?.capture("campaign_shared", {
                  campaign_id: campaign.id,
                  campaign_title: campaign.title,
                  campaign_category: campaign.category,
                })
              }
              className="items-center justify-center rounded-xl border border-dono-border px-3 py-2.5"
            >
              <Share2 size={16} color="#6b7c7a" />
            </Pressable>
          </View>
        </View>

        <View className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <Text className="mb-2 text-sm font-semibold text-emerald-800">
            Trust & Verification
          </Text>
          <Text className="text-xs leading-relaxed text-emerald-700">
            This campaign has been verified by its creator&apos;s identity and
            {campaign.verifications.some((v) => v.type === "institutional")
              ? " institutionally endorsed."
              : " validated by the community."}
          </Text>
        </View>

        {(related?.length ?? 0) > 0 && (
          <View className="mt-4">
            <Text className="mb-6 text-xl font-bold text-dono-text">Related Campaigns</Text>
            <View className="gap-6">
              {related!.map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </View>
          </View>
        )}
      </View>
    </AppShell>
  );
}
