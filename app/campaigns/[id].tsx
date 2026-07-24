import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useConvexAuth, useQuery, useAction, useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { usePostHog } from "posthog-react-native";
import {
  CampaignMediaHero,
  CampaignPhotoGrid,
  DETAIL_DONATION_PRESETS,
  RetroDonateSidebar,
  RetroPanel,
} from "@/components/retro";
import { AppShell } from "@/components/app-shell";
import { CampaignCommentsSection } from "@/components/campaign-comments-section";
import {
  ReceiptDivider,
  ReceiptLedger,
  ReceiptLineRow,
  ReceiptTotalRow,
} from "@/components/ui/receipt-lines";
import { formatCurrency } from "@/lib/constants";
import { buildGoalLineItems } from "@/lib/receipt";
import { getCampaignTemplate } from "@/lib/campaign-templates";
import { ENABLE_CAMPAIGN_TEMPLATES } from "@/lib/featureFlags";
import type { Campaign } from "@/lib/types";
import { api } from "@convex/_generated/api";
import { DonateSheet } from "@/components/donate-sheet";
import { DonationThankYouModal } from "@/components/donation-thank-you-modal";

type DonationThankYouState = {
  amount?: number;
  pendingConfirmation?: boolean;
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
  const engagement = useQuery(
    api.engagement.isFollowing,
    id ? { campaignSlug: id } : "skip",
  );
  const posthog = usePostHog();
  const [selectedAmount, setSelectedAmount] = useState<number>(
    DETAIL_DONATION_PRESETS[2],
  );
  const [customAmount, setCustomAmount] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [coverFees, setCoverFees] = useState(true);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [donateSheetOpen, setDonateSheetOpen] = useState(false);
  const [thankYou, setThankYou] = useState<DonationThankYouState | null>(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const commentsSectionRef = useRef<View>(null);
  const campaign = useQuery(api.campaigns.getBySlug, {
    slug: id ?? "",
  }) as Campaign | null | undefined;
  const donationReadiness = useQuery(
    api.stripeConnectInternal.getCampaignDonationReadiness,
    id ? { campaignSlug: id } : "skip",
  );

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
          setThankYou({ pendingConfirmation: false });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setThankYou({ pendingConfirmation: true });
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
  const donationsDisabled =
    donationReadiness !== undefined && !donationReadiness.canAcceptDonations;
  const donationsDisabledReason =
    donationReadiness && !donationReadiness.canAcceptDonations
      ? donationReadiness.reason
      : undefined;
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
  // Only resolve the campaign's template while the feature is enabled — with
  // it off, `accent` stays undefined (each component's own default applies:
  // indigo for the media hero/photo grid, marigold for RetroPanel, matching
  // the original hardcoded pre-template look) and `heroLayout` defaults to
  // "media-first" so the section order below is unchanged too.
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

  const donateSidebar = (
    <RetroDonateSidebar
      campaign={campaign}
      selectedAmount={selectedAmount}
      customAmount={customAmount}
      liked={liked}
      following={following}
      likeLoading={likeLoading}
      followLoading={followLoading}
      donationsDisabled={donationsDisabled}
      donationsDisabledReason={donationsDisabledReason}
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
      onToggleLike={() => void handleToggleLike()}
      onToggleFollow={() => void handleToggleFollow()}
      onShare={() =>
        posthog?.capture("campaign_shared", {
          campaign_id: campaign.id,
          campaign_title: campaign.title,
          campaign_category: campaign.category,
        })
      }
    />
  );

  // Section pieces, composed below in an order driven by the campaign's
  // chosen template (lib/campaign-templates.ts) — media-first keeps the
  // original layout, gallery-grid promotes photos, text-first leads with
  // the story.
  const heroSection = (
    <View
      key="hero"
      className="mb-6 flex-row flex-wrap gap-5"
      style={{ alignItems: "flex-start" }}
    >
      <View
        style={{
          flexGrow: 1,
          flexBasis: isWide ? "58%" : "100%",
          maxWidth: isWide ? "64%" : "100%",
          minWidth: 0,
        }}
      >
        <CampaignMediaHero campaign={campaign} accent={accent} />
      </View>
      <View
        style={{
          flexGrow: 1,
          flexBasis: isWide ? "30%" : "100%",
          maxWidth: isWide ? "34%" : "100%",
          minWidth: isWide ? 260 : undefined,
        }}
        className={isWide ? "lg:sticky lg:top-4" : ""}
      >
        {donateSidebar}
      </View>
    </View>
  );

  const storyPanel = (
    <RetroPanel title="Why?" accent={accent} className="mb-0 h-full">
      <Text className="text-sm leading-6 text-retro-ink">{campaign.story}</Text>
    </RetroPanel>
  );

  const breakdownPanel = (
    <RetroPanel title="Cost breakdown" accent="sky" className="mb-0 h-full">
      <ReceiptLedger>
        {goalLines.map((line) => (
          <ReceiptLineRow key={line.label} {...line} />
        ))}
        <ReceiptDivider />
        <ReceiptTotalRow label="Total goal" amount={campaign.goal} />
      </ReceiptLedger>
      <Text className="mt-2 font-retro-mono text-[11px] text-[#5c574f]">
        Raised {formatCurrency(campaign.raised)} of {formatCurrency(campaign.goal)}
      </Text>
    </RetroPanel>
  );

  const storyAndBreakdownSection = (
    <View
      key="story-breakdown"
      className="mb-6 flex-row flex-wrap gap-5"
      style={{ alignItems: "stretch" }}
    >
      <View
        style={{
          flexGrow: 1,
          flexBasis: isWide ? "48%" : "100%",
          maxWidth: isWide ? "50%" : "100%",
        }}
      >
        {storyPanel}
      </View>
      <View
        style={{
          flexGrow: 1,
          flexBasis: isWide ? "45%" : "100%",
          maxWidth: isWide ? "48%" : "100%",
        }}
      >
        {breakdownPanel}
      </View>
    </View>
  );

  const galleryGridSection = (
    <View key="gallery" className="mb-6">
      <CampaignPhotoGrid campaign={campaign} accent={accent} />
    </View>
  );

  const pageSections = (() => {
    switch (heroLayout) {
      case "gallery-grid":
        return [heroSection, galleryGridSection, storyAndBreakdownSection];
      case "text-first":
        return [
          <View key="story" className="mb-6">
            {storyPanel}
          </View>,
          heroSection,
          <View key="breakdown" className="mb-6">
            {breakdownPanel}
          </View>,
          galleryGridSection,
        ];
      case "ledger-first":
        return [
          <View key="breakdown" className="mb-6">
            {breakdownPanel}
          </View>,
          heroSection,
          <View key="story" className="mb-6">
            {storyPanel}
          </View>,
          galleryGridSection,
        ];
      default:
        return [heroSection, storyAndBreakdownSection, galleryGridSection];
    }
  })();

  return (
    <AppShell>
      <Link href="/campaigns" asChild>
        <Pressable className="mb-4 self-start">
          <Text className="font-retro-mono-bold text-[12.5px] text-retro-ink">
            ← BACK TO CAMPAIGNS
          </Text>
        </Pressable>
      </Link>

      {/* Title + creator */}
      <View className="mb-1.5 flex-row flex-wrap items-center gap-2">
        <Text className="font-retro-bold text-[28px] uppercase leading-tight text-retro-ink md:text-[34px]">
          {campaign.title}
        </Text>
        {campaign.verifications.length > 0 ? (
          <View
            className="h-5 w-5 items-center justify-center rounded-full border-2 border-retro-ink bg-retro-mint"
            accessibilityLabel="Verified campaign"
          >
            <Text className="text-[11px] font-bold text-white">✓</Text>
          </View>
        ) : null}
      </View>

      <View className="mb-6 flex-row items-center gap-2.5">
        <View className="h-8 w-8 items-center justify-center rounded-full border-2 border-retro-ink bg-retro-cream">
          <Text className="font-retro-bold text-sm text-retro-ink">
            {creatorInitial}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-retro-bold text-sm text-retro-ink">
            {campaign.creator.name}
          </Text>
          <Text className="font-retro-mono text-[11px] text-[#5c574f]">
            Deadline {deadlineLabel}
          </Text>
          <Text className="mt-1 text-xs leading-relaxed text-[#5c574f]">
            Donations are paid to this society&apos;s Stripe Connected Account. The
            Connected Account holder is the Merchant of Record. Dono receives only its
            platform fee.
          </Text>
          {campaign.ownershipStatement ? (
            <Text className="mt-1 text-xs text-[#5c574f]">
              Ownership: {campaign.ownershipStatement}
            </Text>
          ) : null}
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

      {/* Comments + updates */}
      <View nativeID="campaign-comments" className="mb-4">
        <RetroPanel title="Comments.log" accent="marigold">
          <CampaignCommentsSection
            ref={commentsSectionRef}
            campaignSlug={campaign.id}
            isAuthenticated={isAuthenticated}
            embedded
          />
        </RetroPanel>
      </View>

      {campaign.updates.length > 0 ? (
        <RetroPanel title="Updates.log" accent="mint">
          <View className="gap-4">
            {campaign.updates.map((update) => (
              <View
                key={update.id}
                className="rounded-lg border-2 border-retro-ink bg-retro-cream p-3.5"
              >
                <View className="mb-1.5 flex-row items-center justify-between gap-2">
                  <Text className="flex-1 font-retro-bold text-retro-ink">
                    {update.title}
                  </Text>
                  <Text className="font-retro-mono text-[11px] text-[#5c574f]">
                    {new Date(update.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                <Text className="text-sm leading-5 text-[#4a453c]">
                  {update.content}
                </Text>
              </View>
            ))}
          </View>
        </RetroPanel>
      ) : null}

      <DonateSheet
        visible={donateSheetOpen}
        campaignId={campaign.id}
        campaignTitle={campaign.title}
        selectedAmount={resolvedAmount}
        isAuthenticated={isAuthenticated}
        donorEmail={donorEmail}
        onDonorEmailChange={setDonorEmail}
        coverFees={coverFees}
        onCoverFeesChange={setCoverFees}
        legalAccepted={legalAccepted}
        onLegalAcceptedChange={setLegalAccepted}
        onClose={() => setDonateSheetOpen(false)}
        onSuccess={(amount, options) => {
          setThankYou({
            amount,
            pendingConfirmation: options?.pendingConfirmation,
          });
        }}
        frequency="one_time"
      />

      <DonationThankYouModal
        visible={thankYou != null}
        amount={thankYou?.amount}
        campaignTitle={campaign.title}
        pendingConfirmation={thankYou?.pendingConfirmation}
        onClose={() => setThankYou(null)}
      />
    </AppShell>
  );
}
