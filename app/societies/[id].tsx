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
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  UserPlus,
  ArrowLeft,
  Target,
  Globe,
  ExternalLink,
  Repeat,
  Check,
  X,
} from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { SocietyFollowButton } from "@/components/society-follow-button";
import { SocietySubscribeSheet } from "@/components/society-subscribe-sheet";
import { SocietyPayoutSetupBanner } from "@/components/society-payout-setup-banner";
import { LeaderDonationLedger } from "@/components/leader-donation-ledger";
import { CampaignImage } from "@/components/ui/campaign-image";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { CampaignCardGrid } from "@/components/campaign-card-grid";
import { formatCurrency } from "@/lib/constants";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { getFriendlyPaymentError } from "@/lib/stripe/errors";
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
  const communityLookup = useQuery(api.communities.getBySlug, {
    slug: id ?? "",
  }) as
    | { society: Community; membership: unknown }
    | null
    | undefined;
  const community =
    communityLookup === undefined
      ? undefined
      : communityLookup === null
        ? null
        : communityLookup.society;

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
            <Text className="font-retro-bold text-dono-primary">
              Back to communities
            </Text>
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
            <Text className="text-sm text-dono-muted">Back to communities</Text>
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

          <SocietyActionHeader
            slug={slug}
            name={society.name}
            websiteUrl={society.websiteUrl}
            secondaryLink={society.secondaryLink}
            canJoin={canJoin}
          />
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
            <Text className="text-sm text-dono-muted">Back to communities</Text>
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
            <SocietyActionHeader
              slug={slug}
              name={community.name}
              university={community.university}
              canJoin
            />
          ) : (
            <SocietyFollowButton
              slug={slug}
              name={community.name}
              university={community.university}
            />
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

function MembershipActions({ slug }: { slug: string }) {
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
          className={`flex-row items-center justify-center gap-2 rounded-full border px-4 py-2 ${
            status === "approved"
              ? "border-dono-primary bg-dono-primary/5"
              : status === "pending"
                ? "border-amber-300 bg-amber-50 opacity-80"
                : "border-dono-border bg-white"
          }`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#17211B" />
          ) : (
            <UserPlus size={14} color="#17211B" />
          )}
          <Text className="font-retro-bold text-sm text-dono-text">
            {status === "approved" ? "Leave society" : joinLabel}
          </Text>
        </Pressable>
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

/**
 * Shared header actions for both society entity types (new `societies` table
 * and the legacy `communities` catalog). Subscribe is the primary conversion
 * goal, so it gets the large button; Join, Follow, and links are demoted to
 * a row of compact secondary actions.
 */
function SocietyActionHeader({
  slug,
  name,
  university,
  websiteUrl,
  secondaryLink,
  canJoin,
}: {
  slug: string;
  name: string;
  university?: string;
  websiteUrl?: string | null;
  secondaryLink?: string | null;
  /** True when the viewer can join/leave this society (bridged into the membership catalog). */
  canJoin: boolean;
}) {
  const { isAuthenticated } = useConvexAuth();
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [cancelingSubscription, setCancelingSubscription] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const communityCampaigns = useQuery(api.campaigns.listByCommunity, {
    communityId: slug,
  }) as Campaign[] | undefined;
  const campaignsLoaded = communityCampaigns !== undefined;
  const activeCampaignCount =
    communityCampaigns?.filter((c) => c.status === "active").length ?? 0;
  const canSubscribe = campaignsLoaded && activeCampaignCount > 0;

  const mySubscription = useQuery(
    api.donations.getMySocietySubscription,
    isAuthenticated ? { communitySlug: slug } : "skip",
  );
  const cancelSocietySubscription = useAction(api.stripe.cancelSocietySubscription);

  const handleCancelSubscription = () => {
    if (!mySubscription) return;
    setCancelingSubscription(true);
    setCancelError(null);
    void cancelSocietySubscription({ societySubscriptionId: mySubscription.id })
      .catch((err) => setCancelError(getFriendlyPaymentError(err)))
      .finally(() => setCancelingSubscription(false));
  };

  return (
    <View className="gap-3">
      {mySubscription ? (
        <View className="gap-2 rounded-2xl border-2 border-dono-primary bg-dono-primary/5 px-4 py-3.5">
          <View className="flex-row flex-wrap items-center justify-between gap-2">
            <View className="flex-row items-center gap-2">
              <Check size={18} color="#17211B" />
              <Text className="font-retro-bold text-base text-dono-text">
                Subscribed · £{mySubscription.amount}/month
              </Text>
            </View>
            <Pressable
              onPress={handleCancelSubscription}
              disabled={cancelingSubscription}
              className="rounded-full border border-dono-border bg-white px-3 py-1.5"
            >
              <Text className="font-retro-bold text-xs text-dono-muted">
                {cancelingSubscription ? "Canceling…" : "Cancel subscription"}
              </Text>
            </Pressable>
          </View>
          {mySubscription.status === "past_due" ? (
            <Text className="text-xs text-rose-700">
              Your last payment failed — update your payment method or it will be
              canceled automatically.
            </Text>
          ) : null}
          {cancelError ? <Text className="text-xs text-rose-700">{cancelError}</Text> : null}
        </View>
      ) : (
        <>
          <Pressable
            onPress={() => {
              if (canSubscribe) setSubscribeOpen(true);
            }}
            disabled={!canSubscribe}
            className={`flex-row items-center justify-center gap-2 rounded-full px-6 py-3.5 ${
              canSubscribe ? "bg-dono-primary" : "bg-dono-border"
            }`}
          >
            <Repeat size={18} color={canSubscribe ? "#fff" : "#8a8478"} />
            <Text
              className={`font-retro-bold text-base ${
                canSubscribe ? "text-white" : "text-dono-muted"
              }`}
            >
              Subscribe monthly
            </Text>
          </Pressable>
          {campaignsLoaded && !canSubscribe ? (
            <Text className="text-center text-xs text-dono-muted">
              No active campaigns to support right now.
            </Text>
          ) : null}
        </>
      )}

      <View className="flex-row flex-wrap items-center gap-2">
        {canJoin ? <MembershipActions slug={slug} /> : null}
        <SocietyFollowButton slug={slug} name={name} university={university} compact />
        {websiteUrl ? (
          <Pressable
            onPress={() => void Linking.openURL(normalizeExternalUrl(websiteUrl))}
            accessibilityRole="button"
            accessibilityLabel="Visit website"
            className="h-9 w-9 items-center justify-center rounded-full border border-dono-border bg-white"
          >
            <Globe size={16} color="#56615A" />
          </Pressable>
        ) : null}
        {secondaryLink ? (
          <Pressable
            onPress={() => void Linking.openURL(normalizeExternalUrl(secondaryLink))}
            accessibilityRole="button"
            accessibilityLabel="More links"
            className="h-9 w-9 items-center justify-center rounded-full border border-dono-border bg-white"
          >
            <ExternalLink size={16} color="#56615A" />
          </Pressable>
        ) : null}
      </View>

      <SocietySubscribeSheet
        visible={subscribeOpen}
        communitySlug={slug}
        societyName={name}
        isAuthenticated={isAuthenticated}
        legalAccepted={legalAccepted}
        onLegalAcceptedChange={setLegalAccepted}
        onClose={() => setSubscribeOpen(false)}
        onSuccess={() => setSubscribeOpen(false)}
      />
    </View>
  );
}

function SocietyCampaignsAndLeaderPanels({ slug }: { slug: string }) {
  const { isAuthenticated } = useConvexAuth();
  const mine = useQuery(
    api.societies.getMine,
    isAuthenticated && slug ? { slug } : "skip",
  );
  const membership = useQuery(
    api.societyMembers.getMyMembership,
    isAuthenticated && slug ? { communitySlug: slug } : "skip",
  );
  const isLeader =
    membership?.status === "approved" && membership.role === "leader";
  const canManage = Boolean(mine) || isLeader;

  const communityCampaigns = useQuery(
    api.campaigns.listByCommunity,
    slug ? { communityId: slug } : "skip",
  ) as Campaign[] | undefined;

  return (
    <View className="gap-8">
      {isLeader ? <LeaderJoinRequests slug={slug} /> : null}
      {isLeader ? <LeaderPendingCampaigns slug={slug} /> : null}
      {isLeader ? <LeaderCampaignUpdates slug={slug} /> : null}
      {canManage ? <LeaderDonationLedger slug={slug} /> : null}

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
