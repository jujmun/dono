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
  RetroBrowserShell,
  RetroDonateSidebar,
  RetroPanel,
} from "@/components/campaigns/retro";
import { CampaignImageGallery } from "@/components/campaign-image-gallery";
import { CampaignCommentsSection } from "@/components/campaign-comments-section";
import {
  ReceiptDivider,
  ReceiptLedger,
  ReceiptLineRow,
  ReceiptTotalRow,
} from "@/components/ui/receipt-lines";
import { categoryLabels, formatCurrency } from "@/lib/constants";
import { buildGoalLineItems } from "@/lib/receipt";
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
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donateAnonymously, setDonateAnonymously] = useState(false);
  const [donateSheetOpen, setDonateSheetOpen] = useState(false);
  const [thankYou, setThankYou] = useState<DonationThankYouState | null>(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const commentsSectionRef = useRef<View>(null);
  const campaign = useQuery(api.campaigns.getBySlug, {
    slug: id ?? "",
  }) as Campaign | null | undefined;

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
      <RetroBrowserShell path={id ? `campaigns/${id}` : "campaigns"}>
        <View className="items-center py-16">
          <ActivityIndicator color="#211E1A" />
        </View>
      </RetroBrowserShell>
    );
  }

  if (campaign === null) {
    return (
      <RetroBrowserShell path={id ? `campaigns/${id}` : "campaigns/not-found"}>
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
      </RetroBrowserShell>
    );
  }

  const resolvedAmount = customAmount ? Number(customAmount) : selectedAmount;
  const liked = engagement?.liked ?? false;
  const following = engagement?.followingCampaign ?? false;
  const categoryLabel =
    categoryLabels[campaign.category] ?? campaign.category;
  const deadlineLabel = new Date(campaign.deadline).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

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

  const scrollToComments = () => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document
        .getElementById("campaign-comments")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      donateAnonymously={donateAnonymously}
      liked={liked}
      following={following}
      likeLoading={likeLoading}
      followLoading={followLoading}
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
      onAnonymousChange={setDonateAnonymously}
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

  return (
    <RetroBrowserShell path={`campaigns/${campaign.id}`}>
      <Link href="/campaigns" asChild>
        <Pressable className="mb-4 self-start">
          <Text className="font-retro-mono-bold text-[12.5px] text-retro-ink">
            ← BACK TO CAMPAIGNS
          </Text>
        </Pressable>
      </Link>

      <View
        className="flex-row flex-wrap gap-6"
        style={{ alignItems: "flex-start" }}
      >
        <View
          style={{
            flexGrow: 1,
            flexBasis: isWide ? "58%" : "100%",
            maxWidth: isWide ? "62%" : "100%",
            minWidth: 0,
          }}
        >
          {!isWide ? <View className="mb-5">{donateSidebar}</View> : null}

          <CampaignImageGallery
            image={campaign.image}
            images={campaign.images}
            category={campaign.category}
            className="mb-5"
            heroClassName="min-h-[260px] rounded-[14px] border-[3px] border-retro-ink bg-retro-indigo shadow-[5px_5px_0_#211E1A]"
          >
            <View className="absolute left-3.5 top-3.5 rounded-full border-2 border-retro-ink bg-retro-paper px-3.5 py-1 shadow-[3px_3px_0_#211E1A]">
              <Text className="font-retro-bold text-[12.5px] text-retro-ink">
                {categoryLabel}
              </Text>
            </View>
            {campaign.status === "funded" ? (
              <View className="absolute right-3.5 top-3.5 rounded-full border-2 border-retro-ink bg-retro-mint px-3 py-1">
                <Text className="font-retro-bold text-[12px] text-retro-paper">
                  Fully Funded
                </Text>
              </View>
            ) : null}
          </CampaignImageGallery>

          <View className="mb-1.5 flex-row flex-wrap items-center gap-2">
            <Text className="font-retro-bold text-[26px] text-retro-ink">
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

          <View className="mb-3.5 flex-row flex-wrap gap-4">
            <Text className="font-retro-mono text-[12.5px] text-[#4a453c]">
              📍{" "}
              {(campaign.university +
                (campaign.college ? ` · ${campaign.college}` : "")
              ).toUpperCase()}
            </Text>
            <Text className="font-retro-mono text-[12.5px] text-[#4a453c]">
              ⏱ DEADLINE: {deadlineLabel.toUpperCase()}
            </Text>
          </View>

          <View className="mb-5 flex-row flex-wrap gap-3">
            <Pressable
              onPress={() => void handleToggleLike()}
              className="rounded-full border-2 border-retro-ink bg-retro-cream px-3 py-1.5"
            >
              <Text className="font-retro-mono-bold text-[12.5px] text-retro-ink">
                ♡ {campaign.likes} like{campaign.likes === 1 ? "" : "s"}
              </Text>
            </Pressable>
            <View className="rounded-full border-2 border-retro-ink bg-retro-cream px-3 py-1.5">
              <Text className="font-retro-mono-bold text-[12.5px] text-retro-ink">
                🎁 {campaign.donors} donor{campaign.donors === 1 ? "" : "s"}
              </Text>
            </View>
            <View className="rounded-full border-2 border-retro-ink bg-retro-cream px-3 py-1.5">
              <Text className="font-retro-mono-bold text-[12.5px] text-retro-ink">
                👥 {campaign.followers} follower
                {campaign.followers === 1 ? "" : "s"}
              </Text>
            </View>
            <Pressable
              onPress={scrollToComments}
              className="rounded-full border-2 border-retro-ink bg-retro-cream px-3 py-1.5"
            >
              <Text className="font-retro-mono-bold text-[12.5px] text-retro-ink">
                💬 {campaign.comments} comment
                {campaign.comments === 1 ? "" : "s"}
              </Text>
            </Pressable>
          </View>

          <View nativeID="campaign-comments">
            <RetroPanel title="Comments.log" accent="marigold">
              <CampaignCommentsSection
                ref={commentsSectionRef}
                campaignSlug={campaign.id}
                isAuthenticated={isAuthenticated}
                embedded
              />
            </RetroPanel>
          </View>

          <RetroPanel title="The_Story.txt" accent="marigold">
            <Text className="text-sm leading-6 text-retro-ink">
              {campaign.story}
            </Text>
          </RetroPanel>

          {(campaign.impactItems?.length ?? 0) >= 2 ? (
            <RetroPanel title="Fund_Breakdown.sys" accent="marigold">
              <ReceiptLedger>
                {buildGoalLineItems(campaign).map((line) => (
                  <ReceiptLineRow key={line.label} {...line} />
                ))}
                <ReceiptDivider />
                <ReceiptTotalRow label="Total goal" amount={campaign.goal} />
              </ReceiptLedger>
              <Text className="mt-2 font-retro-mono text-[11px] text-[#5c574f]">
                Raised {formatCurrency(campaign.raised)} of{" "}
                {formatCurrency(campaign.goal)}
              </Text>
            </RetroPanel>
          ) : null}

          {campaign.updates.length > 0 ? (
            <RetroPanel title="Updates.log" accent="marigold">
              <View className="gap-4">
                {campaign.updates.map((update) => (
                  <View
                    key={update.id}
                    className="rounded-lg border-2 border-retro-ink bg-retro-cream p-3.5"
                  >
                    <View className="mb-1.5 flex-row items-center justify-between gap-2">
                      <Text className="flex-1 font-sans-medium text-retro-ink">
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
        </View>

        {isWide ? (
          <View
            style={{
              flexGrow: 1,
              flexBasis: "34%",
              maxWidth: "38%",
              minWidth: 280,
            }}
            className="lg:sticky lg:top-4"
          >
            {donateSidebar}
          </View>
        ) : null}
      </View>

      <DonateSheet
        visible={donateSheetOpen}
        campaignId={campaign.id}
        campaignTitle={campaign.title}
        selectedAmount={resolvedAmount}
        isAuthenticated={isAuthenticated}
        donorEmail={donorEmail}
        onDonorEmailChange={setDonorEmail}
        donateAnonymously={donateAnonymously}
        onDonateAnonymouslyChange={setDonateAnonymously}
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
    </RetroBrowserShell>
  );
}
