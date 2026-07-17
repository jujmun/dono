import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Pressable, ActivityIndicator, Linking } from "react-native";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { UserPlus, ArrowLeft, Target, Globe, ExternalLink } from "lucide-react-native";
import { usePostHog } from "posthog-react-native";
import { AppShell } from "@/components/app-shell";
import { CampaignImage } from "@/components/ui/campaign-image";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { CampaignCardGrid } from "@/components/campaign-card-grid";
import { formatCurrency } from "@/lib/constants";
import { initialsFor, normalizeExternalUrl } from "@/lib/utils";
import type { Campaign, Community, Society, VerificationType } from "@/lib/types";
import { api } from "@convex/_generated/api";

/**
 * /societies/[id] serves two entity types that share the URL namespace:
 * user-created societies (the `societies` table, matched first) and the
 * legacy communities catalog that dashboard cards link to.
 */
export default function SocietyOrCommunityPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const society = useQuery(
    api.societies.getPublicBySlug,
    id ? { slug: id } : "skip",
  ) as Society | null | undefined;
  const community = useQuery(api.communities.getBySlug, {
    slug: id ?? "",
  }) as Community | null | undefined;

  if (society === undefined || (society === null && community === undefined)) {
    return (
      <AppShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
        </View>
      </AppShell>
    );
  }

  if (society) {
    return <SocietyDetail society={society} />;
  }

  if (community) {
    return <CommunityDetail community={community} slug={id ?? ""} />;
  }

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-7xl px-4 py-16">
        <Text className="text-center text-dono-muted">Society not found.</Text>
        <Link href="/societies" asChild>
          <Pressable className="mt-4 items-center">
            <Text className="font-retro-bold text-dono-primary">Back to societies</Text>
          </Pressable>
        </Link>
      </View>
    </AppShell>
  );
}

const statusBanners = {
  pending: {
    container: "border-amber-200 bg-amber-50",
    title: "text-amber-800",
    body: "text-amber-700",
    heading: "Pending review",
    message:
      "Only you can see this page until your society is approved by the Dono team.",
  },
  rejected: {
    container: "border-red-200 bg-red-50",
    title: "text-red-800",
    body: "text-red-700",
    heading: "Not approved",
    message:
      "This society was not approved, so only you can see this page. Check My Societies for the reviewer's note.",
  },
} as const;

function SocietyDetail({ society }: { society: Society }) {
  const joinedDate = new Date(society.createdAt).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const banner =
    society.status !== "active" ? statusBanners[society.status] : null;

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-7xl px-4 py-6">
        <Link href="/societies" asChild>
          <Pressable className="mb-4 flex-row items-center gap-1">
            <ArrowLeft size={16} color="#56615A" />
            <Text className="text-sm text-dono-muted">Back to societies</Text>
          </Pressable>
        </Link>

        {banner ? (
          <View className={`mb-6 rounded-2xl border p-4 ${banner.container}`}>
            <Text className={`font-retro-bold text-sm ${banner.title}`}>
              {banner.heading}
            </Text>
            <Text className={`mt-1 text-sm ${banner.body}`}>{banner.message}</Text>
          </View>
        ) : null}

        <CampaignImage
          image={society.coverImageUrl ?? "default"}
          className="mb-6 h-48 rounded-2xl"
        />

        <View className="mb-8 gap-4">
          <View className="flex-row items-start gap-4">
            <View className="h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-dono-primary shadow">
              <Text className="font-retro-mono-bold text-xl text-white">
                {initialsFor(society.name)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-retro-bold text-2xl text-dono-text">
                {society.name}
              </Text>
              <Text className="mt-1 text-sm text-dono-muted">
                Student society · On Dono since {joinedDate}
              </Text>
              <Text className="mt-2 leading-relaxed text-dono-muted">
                {society.description}
              </Text>
            </View>
          </View>

          {society.websiteUrl || society.secondaryLink ? (
            <View className="flex-row flex-wrap gap-3">
              {society.websiteUrl ? (
                <Pressable
                  onPress={() =>
                    void Linking.openURL(normalizeExternalUrl(society.websiteUrl))
                  }
                  className="flex-row items-center justify-center gap-2 rounded-full bg-dono-primary px-5 py-2.5"
                >
                  <Globe size={16} color="#fff" />
                  <Text className="font-retro-bold text-sm text-white">
                    Visit website
                  </Text>
                </Pressable>
              ) : null}
              {society.secondaryLink ? (
                <Pressable
                  onPress={() =>
                    void Linking.openURL(
                      normalizeExternalUrl(society.secondaryLink ?? ""),
                    )
                  }
                  className="flex-row items-center justify-center gap-2 rounded-full border border-dono-border bg-white px-5 py-2.5"
                >
                  <ExternalLink size={16} color="#17211B" />
                  <Text className="font-retro-bold text-sm text-dono-primary">
                    More links
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </View>

        <View className="mb-8">
          <Text className="mb-3 text-lg font-retro-bold text-dono-text">About</Text>
          <View className="rounded-2xl border border-dono-border bg-white p-6">
            <Text className="leading-relaxed text-dono-text">{society.story}</Text>
          </View>
        </View>
      </View>
    </AppShell>
  );
}

function CommunityDetail({
  community,
  slug,
}: {
  community: Community;
  slug: string;
}) {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const posthog = usePostHog();
  const followCommunity = useMutation(api.engagement.followCommunity);
  const unfollowCommunity = useMutation(api.engagement.unfollowCommunity);
  const engagement = useQuery(
    api.engagement.isFollowing,
    slug ? { communitySlug: slug } : "skip",
  );
  const [followLoading, setFollowLoading] = useState(false);

  const communityCampaigns = useQuery(
    api.campaigns.listByCommunity,
    slug ? { communityId: slug } : "skip",
  ) as Campaign[] | undefined;

  const following = engagement?.followingCommunity ?? false;

  const handleToggleFollow = async () => {
    if (!slug || followLoading) return;

    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    setFollowLoading(true);
    try {
      if (following) {
        await unfollowCommunity({ communitySlug: slug });
      } else {
        await followCommunity({ communitySlug: slug });
        posthog?.capture("community_followed", {
          community_id: community.id,
          community_name: community.name,
          community_university: community.university,
        });
      }
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-7xl px-4 py-6">
        <Link href="/societies" asChild>
          <Pressable className="mb-4 flex-row items-center gap-1">
            <ArrowLeft size={16} color="#56615A" />
            <Text className="text-sm text-dono-muted">Back to societies</Text>
          </Pressable>
        </Link>

        <CampaignImage image={community.coverImage} className="mb-6 h-48 rounded-2xl" />

        <View className="mb-8 gap-4">
          <View className="flex-row items-start gap-4">
            <View className="h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-dono-primary shadow">
              <Text className="font-retro-mono-bold text-xl text-white">{community.avatar}</Text>
            </View>
            <View className="flex-1">
              <View className="mb-2 flex-row flex-wrap items-center gap-2">
                <Text className="font-retro-bold text-2xl text-dono-text">{community.name}</Text>
                {community.verified && community.verificationType && (
                  <VerificationBadge
                    verification={{
                      type: community.verificationType as VerificationType,
                      label: "Verified",
                    }}
                  />
                )}
              </View>
              <Text className="text-sm text-dono-muted">{community.university}</Text>
              <Text className="mt-2 leading-relaxed text-dono-muted">
                {community.description}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => void handleToggleFollow()}
            disabled={followLoading}
            className={`flex-row items-center justify-center gap-2 rounded-full px-5 py-2.5 ${
              following ? "border border-dono-primary bg-dono-primary/5" : "bg-dono-primary"
            }`}
          >
            {followLoading ? (
              <ActivityIndicator size="small" color={following ? "#17211B" : "#fff"} />
            ) : (
              <UserPlus size={16} color={following ? "#17211B" : "#fff"} />
            )}
            <Text
              className={`font-retro-bold text-sm ${
                following ? "text-dono-primary" : "text-white"
              }`}
            >
              {following ? "Following" : "Follow"}
            </Text>
          </Pressable>
        </View>

        <View className="mb-8 flex-row gap-4">
          {[
            { label: "Followers", value: community.followers.toLocaleString() },
            { label: "Campaigns", value: community.campaigns.toString() },
            {
              label: "Total Raised",
              value: formatCurrency(community.totalRaised),
            },
          ].map((stat) => (
            <View
              key={stat.label}
              className="flex-1 rounded-2xl border border-dono-border bg-white p-4"
            >
              <Text className="text-center font-retro-bold text-xl text-dono-text">
                {stat.value}
              </Text>
              <Text className="text-center text-xs text-dono-muted">{stat.label}</Text>
            </View>
          ))}
        </View>

        <View>
          <View className="mb-4 flex-row items-center gap-2">
            <Target size={20} color="#17211B" />
            <Text className="text-lg font-retro-bold text-dono-text">Active Campaigns</Text>
          </View>
          {communityCampaigns === undefined ? (
            <ActivityIndicator color="#17211B" />
          ) : communityCampaigns.length === 0 ? (
            <View className="rounded-2xl border border-dono-border bg-white p-8">
              <Text className="text-center text-dono-muted">No active campaigns yet.</Text>
            </View>
          ) : (
            <CampaignCardGrid campaigns={communityCampaigns} />
          )}
        </View>
      </View>
    </AppShell>
  );
}
