import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Linking,
  TextInput,
  Platform,
  Image,
} from "react-native";
import { useAction, useConvexAuth, useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  UserPlus,
  ArrowLeft,
  Target,
  Globe,
  ExternalLink,
  Check,
  X,
  Banknote,
} from "lucide-react-native";
import { usePostHog } from "posthog-react-native";
import * as ExpoLinking from "expo-linking";
import { AppShell } from "@/components/app-shell";
import { CampaignImage } from "@/components/ui/campaign-image";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { CampaignCardGrid } from "@/components/campaign-card-grid";
import { formatCurrency } from "@/lib/constants";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { initialsFor, normalizeExternalUrl } from "@/lib/utils";
import {
  uploadCampaignUpdateMedia,
  type CampaignUpdateMediaUpload,
} from "@/lib/upload-campaign-update-media";
import type { Campaign, Community, Society, VerificationType } from "@/lib/types";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

const MAX_UPDATE_MEDIA = 6;
const MAX_UPDATE_MEDIA_BYTES = 5 * 1024 * 1024;
const MAX_UPDATE_BODY_LENGTH = 500;

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
    return (
      <SocietyDetail
        society={society}
        community={community ?? null}
        slug={id ?? society.slug}
      />
    );
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

function SocietyDetail({
  society,
  community,
  slug,
}: {
  society: Society;
  community: Community | null;
  slug: string;
}) {
  const joinedDate = new Date(society.createdAt).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const banner =
    society.status !== "active" ? statusBanners[society.status] : null;
  const canJoin = society.status === "active" && Boolean(community);

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

          {canJoin ? <MembershipActions slug={slug} community={community!} /> : null}
          <SocietyPayoutSetupBanner slug={slug} />
        </View>

        <View className="mb-8">
          <Text className="mb-3 text-lg font-retro-bold text-dono-text">About</Text>
          <View className="rounded-2xl border border-dono-border bg-white p-6">
            <Text className="leading-relaxed text-dono-text">{society.story}</Text>
          </View>
        </View>

        {canJoin ? <SocietyCampaignsAndLeaderPanels slug={slug} /> : null}
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
  const isSociety = community.type === "society" && community.verified;

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

          {isSociety ? (
            <MembershipActions slug={slug} community={community} showFollow />
          ) : (
            <FollowOnlyButton community={community} slug={slug} />
          )}
          {isSociety ? <SocietyPayoutSetupBanner slug={slug} /> : null}
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

        <SocietyCampaignsAndLeaderPanels slug={slug} />
      </View>
    </AppShell>
  );
}

function FollowOnlyButton({
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
  );
}

function SocietyPayoutSetupBanner({ slug }: { slug: string }) {
  const { isAuthenticated } = useConvexAuth();
  const mine = useQuery(
    api.societies.getMine,
    isAuthenticated && slug ? { slug } : "skip",
  );
  const membership = useQuery(
    api.societyMembers.getMyMembership,
    isAuthenticated && slug ? { communitySlug: slug } : "skip",
  );
  const connectStatus = useQuery(
    api.stripeConnectInternal.getSocietyConnectStatus,
    isAuthenticated && slug ? { communitySlug: slug } : "skip",
  );
  const createConnectOnboardingLink = useAction(
    api.stripeConnect.createConnectOnboardingLink,
  );
  const createConnectDashboardLink = useAction(
    api.stripeConnect.createConnectDashboardLink,
  );
  const refreshConnectAccountStatus = useAction(
    api.stripeConnect.refreshConnectAccountStatus,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardLoginEmail, setDashboardLoginEmail] = useState<string | null>(
    null,
  );

  const isCreator = Boolean(mine);
  const isLeader =
    membership?.status === "approved" && membership.role === "leader";
  const canManage = isCreator || isLeader;
  const needsSetup =
    canManage &&
    connectStatus !== undefined &&
    connectStatus !== null &&
    (!connectStatus.cardPaymentsActive ||
      connectStatus.requiresMerchantReonboarding === true);
  const canOpenDashboard =
    canManage &&
    connectStatus !== undefined &&
    connectStatus !== null &&
    connectStatus.accountVersion === "v2" &&
    connectStatus.cardPaymentsActive === true;

  // Refresh status when landing back on this page after Stripe (or on mount).
  useEffect(() => {
    if (!isAuthenticated || !slug || !canManage) return;
    // Only refresh Stripe when a v2 merchant account already exists.
    if (!connectStatus?.exists || connectStatus.accountVersion !== "v2") {
      return;
    }
    void refreshConnectAccountStatus({ communitySlug: slug }).catch(() => {});
  }, [
    isAuthenticated,
    slug,
    canManage,
    connectStatus?.exists,
    connectStatus?.accountVersion,
    refreshConnectAccountStatus,
  ]);

  const handleOpenDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const { url, loginEmail } = await createConnectDashboardLink({
        communitySlug: slug,
      });
      if (loginEmail) setDashboardLoginEmail(loginEmail);
      await Linking.openURL(url);
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);
    try {
      const returnUrl =
        Platform.OS === "web" && typeof window !== "undefined"
          ? `${window.location.origin}/societies/${encodeURIComponent(slug)}`
          : ExpoLinking.createURL(`/societies/${slug}`);
      const { url } = await createConnectOnboardingLink({
        communitySlug: slug,
        returnUrl,
        refreshUrl: returnUrl,
      });
      await Linking.openURL(url);
      void refreshConnectAccountStatus({ communitySlug: slug }).catch(() => {});
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  if (!needsSetup && !canOpenDashboard) return null;

  // Prefer upgrade/setup CTA whenever merchant onboarding is incomplete.
  if (needsSetup) {
    return (
      <View className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <View className="mb-2 flex-row items-center gap-2">
          <Banknote size={16} color="#b45309" />
          <Text className="font-retro-bold text-sm text-amber-900">
            Complete payout setup
          </Text>
        </View>
        <Text className="mb-3 text-xs leading-relaxed text-amber-800">
          {connectStatus?.requiresMerchantReonboarding
            ? "This society still has the old Stripe payout account. Complete the new Stripe merchant setup so it can accept campaign donations directly. Dono will collect a 5% platform fee on each gift."
            : "Finish connecting a Stripe merchant account so this society can accept campaign donations directly. Dono will collect a 5% platform fee on each gift."}
        </Text>
        <Pressable
          onPress={() => void handleComplete()}
          disabled={loading}
          className={`flex-row items-center justify-center gap-2 self-start rounded-full bg-dono-primary px-4 py-2 ${
            loading ? "opacity-50" : ""
          }`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="font-retro-bold text-xs text-white">
              {connectStatus?.requiresMerchantReonboarding
                ? "Upgrade Stripe payment setup"
                : connectStatus?.exists
                  ? "Continue payout setup"
                  : "Set up payouts with Stripe"}
            </Text>
          )}
        </Pressable>
        {error ? <Text className="mt-2 text-xs text-rose-700">{error}</Text> : null}
      </View>
    );
  }

  return (
    <View className="rounded-2xl border border-green-200 bg-green-50 p-4">
      <View className="mb-2 flex-row items-center gap-2">
        <Banknote size={16} color="#15803d" />
        <Text className="font-retro-bold text-sm text-green-900">
          Stripe payments active
        </Text>
      </View>
      <Text className="mb-3 text-xs leading-relaxed text-green-800">
        This society can accept campaign donations directly. Dono collects a 5%
        platform fee on each gift.
      </Text>
      <Pressable
        onPress={() => void handleOpenDashboard()}
        disabled={loading}
        className={`flex-row items-center justify-center gap-2 self-start rounded-full bg-dono-primary px-4 py-2 ${
          loading ? "opacity-50" : ""
        }`}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="font-retro-bold text-xs text-white">
            Open Stripe dashboard
          </Text>
        )}
      </Pressable>
      <Text className="mt-2 text-xs leading-relaxed text-green-800">
        {dashboardLoginEmail
          ? `Sign in to Stripe with ${dashboardLoginEmail} (the email used during Connect onboarding).`
          : "Sign in to Stripe with the email used during Connect onboarding."}
      </Text>
      {error ? <Text className="mt-2 text-xs text-rose-700">{error}</Text> : null}
    </View>
  );
}

function MembershipActions({
  slug,
  community,
  showFollow = false,
}: {
  slug: string;
  community: Community;
  showFollow?: boolean;
}) {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const requestJoin = useMutation(api.societyMembers.requestJoin);
  const leaveSociety = useMutation(api.societyMembers.leaveSociety);
  const membership = useQuery(
    api.societyMembers.getMyMembership,
    isAuthenticated && slug ? { communitySlug: slug } : "skip",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const status = membership?.status;
  const role = membership?.role;

  const handleJoin = async () => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await requestJoin({ communitySlug: slug });
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    setLoading(true);
    setError(null);
    try {
      await leaveSociety({ communitySlug: slug });
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  let joinLabel = "Request to join";
  if (status === "pending") joinLabel = "Join request pending";
  if (status === "approved") {
    joinLabel = role === "leader" ? "You're a leader" : "You're a member";
  }

  return (
    <View className="gap-2">
      <View className="flex-row flex-wrap gap-3">
        <Pressable
          onPress={() => {
            if (status === "approved") {
              void handleLeave();
            } else if (status !== "pending") {
              void handleJoin();
            }
          }}
          disabled={loading || status === "pending"}
          className={`flex-row items-center justify-center gap-2 rounded-full px-5 py-2.5 ${
            status === "approved"
              ? "border border-dono-primary bg-dono-primary/5"
              : status === "pending"
                ? "border border-amber-300 bg-amber-50 opacity-80"
                : "bg-dono-primary"
          }`}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color={status === "approved" || status === "pending" ? "#17211B" : "#fff"}
            />
          ) : (
            <UserPlus
              size={16}
              color={
                status === "approved" || status === "pending" ? "#17211B" : "#fff"
              }
            />
          )}
          <Text
            className={`font-retro-bold text-sm ${
              status === "approved" || status === "pending"
                ? "text-dono-primary"
                : "text-white"
            }`}
          >
            {status === "approved" ? "Leave society" : joinLabel}
          </Text>
        </Pressable>
        {showFollow ? <FollowOnlyButton community={community} slug={slug} /> : null}
      </View>
      {status === "approved" && role === "leader" ? (
        <Text className="text-xs text-dono-muted">
          As a leader you can approve join requests and member campaigns below.
        </Text>
      ) : null}
      {error ? <Text className="text-xs text-rose-700">{error}</Text> : null}
    </View>
  );
}

function SocietyCampaignsAndLeaderPanels({ slug }: { slug: string }) {
  const { isAuthenticated } = useConvexAuth();
  const membership = useQuery(
    api.societyMembers.getMyMembership,
    isAuthenticated && slug ? { communitySlug: slug } : "skip",
  );
  const isLeader =
    membership?.status === "approved" && membership.role === "leader";

  const communityCampaigns = useQuery(
    api.campaigns.listByCommunity,
    slug ? { communityId: slug } : "skip",
  ) as Campaign[] | undefined;

  return (
    <View className="gap-8">
      {isLeader ? <LeaderJoinRequests slug={slug} /> : null}
      {isLeader ? <LeaderPendingCampaigns slug={slug} /> : null}
      {isLeader ? <LeaderCampaignUpdates slug={slug} /> : null}

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
  );
}

function LeaderJoinRequests({ slug }: { slug: string }) {
  const pending = useQuery(api.societyMembers.listPendingForLeader, {
    communitySlug: slug,
  });
  const approve = useMutation(api.societyMembers.approve);
  const reject = useMutation(api.societyMembers.reject);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (pending === undefined) {
    return (
      <View className="items-center py-4">
        <ActivityIndicator color="#17211B" />
      </View>
    );
  }

  if (pending.length === 0) return null;

  const handle = async (
    membershipId: Id<"societyMembers">,
    action: "approve" | "reject",
  ) => {
    setBusyId(membershipId);
    setError(null);
    try {
      if (action === "approve") {
        await approve({ membershipId });
      } else {
        await reject({ membershipId });
      }
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <View className="rounded-2xl border border-dono-border bg-white p-5">
      <Text className="mb-3 font-retro-bold text-lg text-dono-text">
        Pending join requests
      </Text>
      {error ? <Text className="mb-2 text-xs text-rose-700">{error}</Text> : null}
      <View className="gap-3">
        {pending.map((req) => (
          <View
            key={req.id}
            className="flex-row flex-wrap items-center justify-between gap-3 border-b border-dono-border pb-3"
          >
            <View className="flex-1">
              <Text className="font-retro-bold text-sm text-dono-text">{req.name}</Text>
              <Text className="text-xs text-dono-muted">{req.email}</Text>
            </View>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => void handle(req.id as Id<"societyMembers">, "approve")}
                disabled={busyId === req.id}
                className="flex-row items-center gap-1 rounded-full bg-dono-primary px-3 py-1.5"
              >
                <Check size={14} color="#fff" />
                <Text className="font-retro-bold text-xs text-white">Approve</Text>
              </Pressable>
              <Pressable
                onPress={() => void handle(req.id as Id<"societyMembers">, "reject")}
                disabled={busyId === req.id}
                className="flex-row items-center gap-1 rounded-full border border-dono-border px-3 py-1.5"
              >
                <X size={14} color="#17211B" />
                <Text className="font-retro-bold text-xs text-dono-text">Reject</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function LeaderPendingCampaigns({ slug }: { slug: string }) {
  const pending = useQuery(api.campaignCreator.listPendingForSocietyLeader, {
    communitySlug: slug,
  }) as Campaign[] | undefined;
  const approveBySociety = useMutation(api.campaignCreator.approveBySociety);
  const rejectBySociety = useMutation(api.campaignCreator.rejectBySociety);
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  if (pending === undefined) {
    return (
      <View className="items-center py-4">
        <ActivityIndicator color="#17211B" />
      </View>
    );
  }

  if (pending.length === 0) return null;

  const handleApprove = async (campaignSlug: string) => {
    setBusySlug(campaignSlug);
    setError(null);
    try {
      await approveBySociety({ slug: campaignSlug });
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusySlug(null);
    }
  };

  const handleReject = async (campaignSlug: string) => {
    const reason = (rejectNote[campaignSlug] ?? "").trim();
    if (!reason) {
      setError("Add a short note before rejecting a campaign.");
      return;
    }
    setBusySlug(campaignSlug);
    setError(null);
    try {
      await rejectBySociety({ slug: campaignSlug, reason });
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusySlug(null);
    }
  };

  return (
    <View className="rounded-2xl border border-dono-border bg-white p-5">
      <Text className="mb-3 font-retro-bold text-lg text-dono-text">
        Campaigns awaiting your approval
      </Text>
      {error ? <Text className="mb-2 text-xs text-rose-700">{error}</Text> : null}
      <View className="gap-4">
        {pending.map((campaign) => (
          <View
            key={campaign.id}
            className="gap-2 border-b border-dono-border pb-4"
          >
            <Link href={`/campaigns/${campaign.id}`} asChild>
              <Pressable>
                <Text className="font-retro-bold text-sm text-dono-text">
                  {campaign.title}
                </Text>
                <Text className="text-xs text-dono-muted" numberOfLines={2}>
                  {campaign.description}
                </Text>
              </Pressable>
            </Link>
            <TextInput
              value={rejectNote[campaign.id] ?? ""}
              onChangeText={(v) =>
                setRejectNote((prev) => ({ ...prev, [campaign.id]: v }))
              }
              placeholder="Rejection note (required to reject)"
              placeholderTextColor="#8a8478"
              className="rounded-lg border border-dono-border bg-white px-3 py-2 text-sm text-dono-text outline-none"
            />
            <View className="flex-row flex-wrap gap-2">
              <Pressable
                onPress={() => void handleApprove(campaign.id)}
                disabled={busySlug === campaign.id}
                className="flex-row items-center gap-1 rounded-full bg-dono-primary px-3 py-1.5"
              >
                {busySlug === campaign.id ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Check size={14} color="#fff" />
                )}
                <Text className="font-retro-bold text-xs text-white">Approve</Text>
              </Pressable>
              <Pressable
                onPress={() => void handleReject(campaign.id)}
                disabled={busySlug === campaign.id}
                className="flex-row items-center gap-1 rounded-full border border-dono-border px-3 py-1.5"
              >
                <X size={14} color="#17211B" />
                <Text className="font-retro-bold text-xs text-dono-text">Reject</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function LeaderCampaignUpdates({ slug }: { slug: string }) {
  const updatable = useQuery(api.campaignUpdates.listUpdatableForSocietyLeader, {
    communitySlug: slug,
  });
  const generateUploadUrl = useMutation(
    api.campaignUpdates.generateUpdateMediaUploadUrl,
  );
  const createUpdate = useMutation(api.campaignUpdates.create);

  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [amountSpent, setAmountSpent] = useState("");
  const [reconciliationNote, setReconciliationNote] = useState("");
  const [media, setMedia] = useState<CampaignUpdateMediaUpload[]>([]);
  const [pickingMedia, setPickingMedia] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (updatable === undefined) {
    return (
      <View className="items-center py-4">
        <ActivityIndicator color="#17211B" />
      </View>
    );
  }

  if (updatable.length === 0) return null;

  const resetForm = () => {
    setHeadline("");
    setBody("");
    setAmountSpent("");
    setReconciliationNote("");
    setMedia([]);
    setError(null);
  };

  const toggleComposer = (campaignSlug: string) => {
    setOpenSlug((current) => (current === campaignSlug ? null : campaignSlug));
    resetForm();
  };

  const pickMedia = async () => {
    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Photo library permission is required to add photos.");
      return;
    }

    setPickingMedia(true);
    try {
      const remaining = MAX_UPDATE_MEDIA - media.length;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: remaining,
        quality: 0.85,
      });

      if (result.canceled || result.assets.length === 0) return;

      const nextMedia: CampaignUpdateMediaUpload[] = [];
      for (const asset of result.assets) {
        if (asset.fileSize && asset.fileSize > MAX_UPDATE_MEDIA_BYTES) {
          setError("Each photo must be 5MB or smaller.");
          return;
        }
        nextMedia.push({ uri: asset.uri, mimeType: asset.mimeType });
      }
      setMedia((current) => [...current, ...nextMedia].slice(0, MAX_UPDATE_MEDIA));
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setPickingMedia(false);
    }
  };

  const removeMedia = (index: number) => {
    setMedia((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (campaignSlug: string, raised: number) => {
    setError(null);
    if (media.length === 0) {
      setError("Add at least one photo.");
      return;
    }
    const spent = Number(amountSpent);
    if (!amountSpent.trim() || Number.isNaN(spent) || spent < 0) {
      setError("Enter a valid amount spent.");
      return;
    }
    if (spent < raised && !reconciliationNote.trim()) {
      setError("Add a short note explaining the difference between raised and spent.");
      return;
    }

    setSubmitting(true);
    try {
      const storageIds = await uploadCampaignUpdateMedia({
        slug: campaignSlug,
        media,
        generateUploadUrl,
      });
      await createUpdate({
        slug: campaignSlug,
        mediaStorageIds: storageIds,
        headline,
        body,
        amountSpent: spent,
        reconciliationNote: reconciliationNote.trim() || undefined,
      });
      setOpenSlug(null);
      resetForm();
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="rounded-2xl border border-dono-border bg-white p-5">
      <Text className="mb-3 font-retro-bold text-lg text-dono-text">
        Post a campaign update
      </Text>
      <View className="gap-4">
        {updatable.map((campaign) => (
          <View key={campaign.slug} className="gap-2 border-b border-dono-border pb-4">
            <Pressable onPress={() => toggleComposer(campaign.slug)}>
              <Text className="font-retro-bold text-sm text-dono-text">
                {campaign.title}
              </Text>
              <Text className="text-xs text-dono-muted">
                {formatCurrency(campaign.raised)} raised of {formatCurrency(campaign.goal)}{" "}
                goal — funded, ready for an update
              </Text>
            </Pressable>

            {openSlug === campaign.slug ? (
              <View className="mt-2 gap-3">
                {error ? <Text className="text-xs text-rose-700">{error}</Text> : null}

                <View className="flex-row flex-wrap gap-2">
                  {media.map((item, index) => (
                    <View key={item.uri} className="relative">
                      <Image
                        source={{ uri: item.uri }}
                        className="h-16 w-16 rounded-lg"
                      />
                      <Pressable
                        onPress={() => removeMedia(index)}
                        className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-rose-600"
                      >
                        <X size={12} color="#fff" />
                      </Pressable>
                    </View>
                  ))}
                  <Pressable
                    onPress={() => void pickMedia()}
                    disabled={pickingMedia || media.length >= MAX_UPDATE_MEDIA}
                    className="h-16 w-16 items-center justify-center rounded-lg border border-dashed border-dono-border"
                  >
                    {pickingMedia ? (
                      <ActivityIndicator size="small" color="#17211B" />
                    ) : (
                      <Text className="text-xs text-dono-muted">+ Photo</Text>
                    )}
                  </Pressable>
                </View>

                <TextInput
                  value={headline}
                  onChangeText={setHeadline}
                  placeholder="Headline"
                  placeholderTextColor="#8a8478"
                  className="rounded-lg border border-dono-border bg-white px-3 py-2 text-sm text-dono-text outline-none"
                />
                <View>
                  <TextInput
                    value={body}
                    onChangeText={(v) => setBody(v.slice(0, MAX_UPDATE_BODY_LENGTH))}
                    placeholder="A couple of sentences on how the funds were used"
                    placeholderTextColor="#8a8478"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    className="rounded-lg border border-dono-border bg-white px-3 py-2 text-sm text-dono-text outline-none"
                  />
                  <Text className="mt-1 text-right text-xs text-dono-muted">
                    {body.length}/{MAX_UPDATE_BODY_LENGTH}
                  </Text>
                </View>
                <TextInput
                  value={amountSpent}
                  onChangeText={setAmountSpent}
                  placeholder="Amount spent (£)"
                  placeholderTextColor="#8a8478"
                  keyboardType="numeric"
                  className="rounded-lg border border-dono-border bg-white px-3 py-2 text-sm text-dono-text outline-none"
                />
                {amountSpent.trim() && Number(amountSpent) < campaign.raised ? (
                  <TextInput
                    value={reconciliationNote}
                    onChangeText={setReconciliationNote}
                    placeholder="Note explaining the difference between raised and spent (required)"
                    placeholderTextColor="#8a8478"
                    multiline
                    className="rounded-lg border border-dono-border bg-white px-3 py-2 text-sm text-dono-text outline-none"
                  />
                ) : null}

                <Pressable
                  onPress={() => void handleSubmit(campaign.slug, campaign.raised)}
                  disabled={submitting}
                  className="flex-row items-center justify-center gap-1 self-start rounded-full bg-dono-primary px-4 py-2"
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="font-retro-bold text-xs text-white">
                      Post update
                    </Text>
                  )}
                </Pressable>
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
