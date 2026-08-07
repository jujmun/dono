import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Platform,
  Share,
  useWindowDimensions,
} from "react-native";
import { useConvexAuth, useQuery, useAction, useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { usePostHog } from "posthog-react-native";
import { Pencil, Heart, Share2, UserPlus, Flag } from "lucide-react-native";
import {
  CampaignMediaHero,
  CampaignHeroProgressStrip,
  RECOMMENDED_DONATION_AMOUNT,
  RetroDonateSidebar,
  RetroPanel,
  StoryWithCostBreakdown,
} from "@/components/retro";
import { AppShell } from "@/components/app-shell";
import { SocietyPayoutSetupBanner } from "@/components/society-payout-setup-banner";
import { CampaignCommentsSection } from "@/components/campaign-comments-section";
import { ReportContentModal } from "@/components/report-content-modal";
import { CampaignLiveStream } from "@/components/campaign-live-stream";
import { buildGoalLineItems } from "@/lib/receipt";
import { getCampaignTemplate } from "@/lib/campaign-templates";
import { ENABLE_CAMPAIGN_TEMPLATES } from "@/lib/featureFlags";
import type { Campaign } from "@/lib/types";
import { api } from "@convex/_generated/api";
import { DonateSheet } from "@/components/donate-sheet";
import { DonationThankYouModal } from "@/components/donation-thank-you-modal";
import { CampaignUpdateDisplay } from "@/components/campaign-update-display";
import { computeMatchCredit } from "@/lib/donation-psychology";
import { cn } from "@/lib/utils";

type DonationThankYouState = {
  amount?: number;
  matchedAmount?: number;
  pendingConfirmation?: boolean;
  paymentIntentId?: string;
};

export default function CampaignDetailPage() {
  const { id, payment_intent, redirect_status } = useLocalSearchParams<{
    id: string;
    payment_intent?: string;
    redirect_status?: string;
  }>();
  const { width } = useWindowDimensions();
  const isWide = width >= 820;
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const confirmOneTimeDonation = useAction(api.stripe.confirmOneTimeDonation);
  const likeCampaign = useMutation(api.engagement.likeCampaign);
  const unlikeCampaign = useMutation(api.engagement.unlikeCampaign);
  const followCampaign = useMutation(api.engagement.followCampaign);
  const unfollowCampaign = useMutation(api.engagement.unfollowCampaign);
  const createReport = useMutation(api.reports.createReport);
  const engagement = useQuery(
    api.engagement.isFollowing,
    id ? { campaignSlug: id } : "skip",
  );
  const activeMatch = useQuery(
    api.campaignMatches.getActiveForCampaign,
    id ? { campaignSlug: id } : "skip",
  );
  // activeMatch is always null after CR-02a; query retained so types stay wired.
  void activeMatch;
  const posthog = usePostHog();
  const [selectedAmount, setSelectedAmount] = useState<number>(
    RECOMMENDED_DONATION_AMOUNT,
  );
  const [customAmount, setCustomAmount] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [ageAttested, setAgeAttested] = useState(false);
  const [donateSheetOpen, setDonateSheetOpen] = useState(false);
  const [thankYou, setThankYou] = useState<DonationThankYouState | null>(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const commentsSectionRef = useRef<View>(null);
  const campaign = useQuery(api.campaigns.getBySlug, {
    slug: id ?? "",
  }) as Campaign | null | undefined;
  const mineForEdit = useQuery(
    api.campaignCreator.getMineForEdit,
    isAuthenticated && id ? { slug: id } : "skip",
  );
  const showEditPencil = Boolean(mineForEdit?.requiresApproval);
  const donationReadiness = useQuery(
    api.stripeConnectInternal.getCampaignDonationReadiness,
    id ? { campaignSlug: id } : "skip",
  );
  const stripePlatform = useQuery(api.stripePlatform.isConfigured, {});
  const commenterMembership = useQuery(
    api.societyMembers.getMyMembership,
    campaign ? { communitySlug: campaign.creator.communityId } : "skip",
  );
  const canComment =
    commenterMembership === undefined
      ? undefined
      : commenterMembership?.status === "approved";

  const clientStripeConfigured = Boolean(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY);

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

  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (redirect_status !== "succeeded" || !payment_intent) return;

    const paymentIntentId = Array.isArray(payment_intent)
      ? payment_intent[0]
      : payment_intent;

    let cancelled = false;

    void confirmOneTimeDonation({ paymentIntentId })
      .then(() => {
        if (!cancelled) {
          setThankYou({ pendingConfirmation: false, paymentIntentId });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setThankYou({ pendingConfirmation: true, paymentIntentId });
        }
      })
      .finally(() => {
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.delete("payment_intent");
          url.searchParams.delete("payment_intent_client_secret");
          url.searchParams.delete("redirect_status");
          window.history.replaceState({}, "", url.pathname + url.search);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [confirmOneTimeDonation, payment_intent, redirect_status]);

  if (campaign === undefined) {
    return (
      <AppShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#211E1A" />
        </View>
      </AppShell>
    );
  }

  if (campaign === null) {
    return (
      <AppShell>
        <Text className="text-center font-retro-mono text-sm text-[#5c574f]">
          Campaign not found.
        </Text>
        <Link href="/campaigns" asChild>
          <Pressable className="mt-4 items-center">
            <Text className="font-retro-mono-bold text-sm text-retro-ink">
              ← BACK TO CAMPAIGNS
            </Text>
          </Pressable>
        </Link>
      </AppShell>
    );
  }

  const resolvedAmount = customAmount ? Number(customAmount) : selectedAmount;
  const platformPaymentsReady =
    stripePlatform?.configured === true && clientStripeConfigured;
  const donationsDisabled =
    donationReadiness !== undefined &&
    (!platformPaymentsReady || !donationReadiness.canAcceptDonations);
  const donationsDisabledReason = (() => {
    if (!platformPaymentsReady) {
      if (stripePlatform?.configured === false) {
        return "Payments are not configured on this deployment yet.";
      }
      if (!clientStripeConfigured) {
        return "Payments are not configured for this site yet.";
      }
    }
    if (donationReadiness && !donationReadiness.canAcceptDonations) {
      return donationReadiness.reason;
    }
    return undefined;
  })();
  const liked = engagement?.liked ?? false;
  const following = engagement?.followingCampaign ?? false;
  const deadlineLabel = new Date(campaign.deadline).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
  const creatorInitial = (campaign.creator.name || "?").trim().charAt(0).toUpperCase();
  const goalLines = buildGoalLineItems(campaign);
  const resolvedTemplate = ENABLE_CAMPAIGN_TEMPLATES
    ? getCampaignTemplate(campaign.template)
    : null;
  const accent = resolvedTemplate?.unlocks.accent;
  const heroLayout = resolvedTemplate?.unlocks.heroLayout ?? "media-first";

  const handleToggleLike = async () => {
    if (!id || likeLoading) return;

    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    setLikeLoading(true);
    try {
      if (liked) {
        await unlikeCampaign({ campaignSlug: id });
      } else {
        await likeCampaign({ campaignSlug: id });
        posthog?.capture("campaign_liked", {
          campaign_id: campaign.id,
          campaign_title: campaign.title,
          campaign_category: campaign.category,
        });
      }
    } finally {
      setLikeLoading(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!id || followLoading) return;

    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    setFollowLoading(true);
    try {
      if (following) {
        await unfollowCampaign({ campaignSlug: id });
      } else {
        await followCampaign({ campaignSlug: id });
        posthog?.capture("campaign_followed", {
          campaign_id: campaign.id,
          campaign_title: campaign.title,
          campaign_category: campaign.category,
        });
      }
    } finally {
      setFollowLoading(false);
    }
  };

  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : `https://joindono.com/campaigns/${campaign.id}`;
    const message = `Support ${campaign.title} on Dono`;

    posthog?.capture("campaign_shared", {
      campaign_id: campaign.id,
      campaign_title: campaign.title,
      campaign_category: campaign.category,
    });

    try {
      await Share.share(
        Platform.OS === "ios"
          ? { url, message }
          : { message: `${message}\n${url}` },
      );
    } catch {
      if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    }
  };

  const openDonateSheet = () => {
    posthog?.capture("donation_started", {
      campaign_id: campaign.id,
      campaign_title: campaign.title,
      campaign_category: campaign.category,
      campaign_goal: campaign.goal,
      campaign_raised: campaign.raised,
      amount: resolvedAmount,
      donation_type: "one_time",
    });
    setDonateSheetOpen(true);
  };

  const donateAndUpdatesCard = (
    <View className="gap-4">
      <SocietyPayoutSetupBanner
        slug={campaign.creator.communityId}
        returnPath={`/campaigns/${encodeURIComponent(campaign.id)}`}
      />
      <View className="overflow-hidden rounded-[14px] border-[3px] border-retro-ink bg-retro-paper">
        <RetroDonateSidebar
          campaign={campaign}
          selectedAmount={selectedAmount}
          customAmount={customAmount}
          activeMatch={activeMatch ?? null}
          donationsDisabled={donationsDisabled}
          donationsDisabledReason={donationsDisabledReason}
          embedded
          onSelectPreset={(amount) => {
            setCustomAmount("");
            setSelectedAmount(amount);
            posthog?.capture("donation_amount_selected", {
              campaign_id: campaign.id,
              campaign_title: campaign.title,
              amount,
            });
          }}
          onCustomAmountChange={setCustomAmount}
          onDonate={openDonateSheet}
        />
        {id ? (
          <View className="border-t-[3px] border-retro-ink">
            <CampaignLiveStream
              campaignSlug={id}
              variant="panel"
              connected
            />
          </View>
        ) : null}
      </View>
    </View>
  );

  const mediaBlock = (
    <View className="overflow-hidden rounded-[14px] border-[3px] border-retro-ink bg-retro-cream">
      <CampaignMediaHero
        campaign={campaign}
        accent={accent}
        embedded
        thumbnailsAlign="end"
        className="w-full"
      />
      <CampaignHeroProgressStrip
        raised={campaign.raised}
        goal={campaign.goal}
      />
    </View>
  );

  const whyBlock = (
    <View className="gap-2">
      <StoryWithCostBreakdown
        story={campaign.story}
        goalLines={goalLines}
        goal={campaign.goal}
        accent={accent}
      />
      {campaign.ownershipStatement ? (
        <Text className="px-0.5 font-retro-mono text-[10px] leading-4 text-[#5c574f]">
          Ownership: {campaign.ownershipStatement}
        </Text>
      ) : null}
    </View>
  );

  // GoFundMe-style: left = media + story; right = linked donate + updates card.
  const mainColumn =
    heroLayout === "text-first" || heroLayout === "ledger-first" ? (
      <View className="min-w-0 flex-1 gap-5">
        {whyBlock}
        {mediaBlock}
      </View>
    ) : (
      <View className="min-w-0 flex-1 gap-5">
        {mediaBlock}
        {whyBlock}
      </View>
    );

  const pageSections = isWide ? (
    <View key="gfm-layout" className="mb-6 flex-row items-start gap-6">
      {mainColumn}
      <View
        className="w-80 shrink-0 self-start"
        style={
          Platform.OS === "web"
            ? ({ position: "sticky", top: 16, zIndex: 20 } as const)
            : undefined
        }
      >
        {donateAndUpdatesCard}
      </View>
    </View>
  ) : (
    <View key="gfm-layout-narrow" className="mb-6 gap-5">
      {mediaBlock}
      {donateAndUpdatesCard}
      {whyBlock}
    </View>
  );

  return (
    <AppShell>
      <Link href="/campaigns" asChild>
        <Pressable className="mb-4 self-start">
          <Text className="font-retro-mono-bold text-[12.5px] text-retro-ink">
            ← BACK TO CAMPAIGNS
          </Text>
        </Pressable>
      </Link>

      <View className="mb-1.5 flex-row flex-wrap items-center gap-2">
        <Text
          className={cn(
            "font-retro-bold uppercase leading-tight text-retro-ink",
            isWide ? "max-w-full text-[34px]" : "w-full text-[22px]",
          )}
        >
          {campaign.title}
        </Text>
        {showEditPencil ? (
          <Link href={`/create?editSlug=${campaign.id}`} asChild>
            <Pressable
              accessibilityLabel="Edit campaign"
              className="h-8 w-8 items-center justify-center rounded-full border-2 border-retro-ink bg-retro-cream"
            >
              <Pencil size={14} color="#211E1A" />
            </Pressable>
          </Link>
        ) : null}
        {/* CR-02a: match window badge removed */}
      </View>

      <View className="mb-6 w-full gap-2">
        <View className="w-full flex-row items-center gap-2.5">
          <View className="h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-retro-ink bg-retro-cream">
            <Text className="font-retro-bold text-base text-retro-ink">
              {creatorInitial}
            </Text>
          </View>
          <View className="min-w-0 flex-1">
            <Text className="font-retro-bold text-sm text-retro-ink">
              {campaign.creator.name}
            </Text>
            <Text className="font-retro-mono text-[11px] text-[#5c574f]">
              Deadline {deadlineLabel}
            </Text>
          </View>
          <View className="shrink-0 flex-row items-center gap-1.5">
            <Pressable
              onPress={() => void handleToggleLike()}
              disabled={likeLoading}
              accessibilityLabel={liked ? "Unlike" : "Like"}
              className={`retro-key h-10 w-10 items-center justify-center rounded-lg border-2 border-retro-ink ${
                liked ? "bg-retro-cream" : "bg-retro-paper"
              }`}
            >
              {likeLoading ? (
                <ActivityIndicator size="small" color="#211E1A" />
              ) : (
                <Heart
                  size={16}
                  color="#211E1A"
                  fill={liked ? "#F2542D" : "transparent"}
                />
              )}
            </Pressable>
            <Pressable
              onPress={() => void handleToggleFollow()}
              disabled={followLoading}
              accessibilityLabel={following ? "Unfollow" : "Follow"}
              className={`retro-key h-10 w-10 items-center justify-center rounded-lg border-2 border-retro-ink ${
                following ? "bg-retro-cream" : "bg-retro-paper"
              }`}
            >
              {followLoading ? (
                <ActivityIndicator size="small" color="#211E1A" />
              ) : (
                <UserPlus size={16} color="#211E1A" />
              )}
            </Pressable>
            <Pressable
              onPress={() => void handleShare()}
              accessibilityLabel="Share campaign"
              className="retro-key h-10 w-10 items-center justify-center rounded-lg border-2 border-retro-ink bg-retro-paper"
            >
              <Share2 size={16} color="#211E1A" />
            </Pressable>
            <Pressable
              onPress={() =>
                isAuthenticated ? setReportOpen(true) : router.push("/signin")
              }
              accessibilityLabel="Report campaign"
              className="retro-key h-10 w-10 items-center justify-center rounded-lg border-2 border-retro-ink bg-retro-paper"
            >
              <Flag size={16} color="#211E1A" />
            </Pressable>
          </View>
        </View>
      </View>

      {pageSections}

      {campaign.additionalNotes ? (
        <View className="mb-6">
          <RetroPanel title="Anything else?" accent={accent}>
            <Text className="text-sm leading-6 text-retro-ink">
              {campaign.additionalNotes}
            </Text>
          </RetroPanel>
        </View>
      ) : null}

      <View nativeID="campaign-comments" className="mb-4">
        <RetroPanel title="Comments.log" accent="marigold">
          <CampaignCommentsSection
            ref={commentsSectionRef}
            campaignSlug={campaign.id}
            isAuthenticated={isAuthenticated}
            canComment={canComment}
            embedded
          />
        </RetroPanel>
      </View>

      <CampaignUpdateDisplay campaign={campaign} />

      <DonateSheet
        visible={donateSheetOpen}
        campaignId={campaign.id}
        campaignTitle={campaign.title}
        selectedAmount={resolvedAmount}
        isAuthenticated={isAuthenticated}
        donorEmail={donorEmail}
        onDonorEmailChange={setDonorEmail}
        isAnonymous={isAnonymous}
        onAnonymousChange={setIsAnonymous}
        legalAccepted={legalAccepted}
        onLegalAcceptedChange={setLegalAccepted}
        ageAttested={ageAttested}
        onAgeAttestedChange={setAgeAttested}
        onClose={() => setDonateSheetOpen(false)}
        onSuccess={(amount, options) => {
          const matchedAmount = computeMatchCredit(amount, activeMatch ?? null);
          setThankYou({
            amount,
            matchedAmount: matchedAmount > 0 ? matchedAmount : undefined,
            pendingConfirmation: options?.pendingConfirmation,
            paymentIntentId: options?.paymentIntentId,
          });
        }}
      />

      <DonationThankYouModal
        visible={thankYou != null}
        amount={thankYou?.amount}
        matchedAmount={thankYou?.matchedAmount}
        campaignTitle={campaign.title}
        campaignSlug={campaign.id}
        pendingConfirmation={thankYou?.pendingConfirmation}
        paymentIntentId={thankYou?.paymentIntentId}
        onClose={() => setThankYou(null)}
      />

      <ReportContentModal
        visible={reportOpen}
        label="campaign"
        onClose={() => setReportOpen(false)}
        onSubmit={async (reason) => {
          await createReport({
            targetType: "campaign",
            campaignSlug: campaign.id,
            reason,
          });
        }}
      />
    </AppShell>
  );
}
