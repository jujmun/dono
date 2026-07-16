import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TextInput,
  Platform,
} from "react-native";
import { useConvexAuth, useQuery, useAction, useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";
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
import { CampaignImageGallery } from "@/components/campaign-image-gallery";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CategoryBadge } from "@/components/ui/category-badge";
import { EngagementStats } from "@/components/activity-feed";
import { CampaignCommentsSection } from "@/components/campaign-comments-section";
import { CampaignCardGrid } from "@/components/campaign-card-grid";
import {
  FundBreakdownSection,
  ReceiptDivider,
  ReceiptLedger,
  ReceiptLineRow,
  ReceiptTotalRow,
} from "@/components/ui/receipt-lines";
import { formatCurrency, getProgress } from "@/lib/constants";
import { buildGoalLineItems } from "@/lib/receipt";
import type { Campaign } from "@/lib/types";
import { api } from "@convex/_generated/api";
import { DonateSheet } from "@/components/donate-sheet";
import { DonationThankYouModal } from "@/components/donation-thank-you-modal";
import { DonateAnonymouslyToggle } from "@/components/donate-anonymously-toggle";
import {
  PRESET_DONATION_AMOUNTS,
} from "@/components/donate-sheet-types";

const donationAmounts = [...PRESET_DONATION_AMOUNTS];

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
          <ActivityIndicator color="#17211B" />
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
              <Text className="font-sans-medium text-dono-primary">Back to campaigns</Text>
            </Pressable>
          </Link>
        </View>
      </AppShell>
    );
  }

  const progress = getProgress(campaign.raised, campaign.goal);
  const resolvedAmount = customAmount
    ? Number(customAmount)
    : selectedAmount;
  const liked = engagement?.liked ?? false;
  const following = engagement?.followingCampaign ?? false;

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

  const donationPanel = (
    <View className="rounded-2xl border border-dono-border bg-white p-6">
      <View className="mb-4 flex-row items-baseline justify-between">
        <Text className="font-mono-medium text-3xl text-dono-primary">
          {formatCurrency(campaign.raised)}
        </Text>
        <Text className="text-sm text-dono-muted">
          of {formatCurrency(campaign.goal)}
        </Text>
      </View>
      <ProgressBar value={progress} className="mt-3" showLabel />
      <Text className="mt-2 text-sm text-dono-muted">
        {campaign.likes} like{campaign.likes === 1 ? "" : "s"} · {campaign.donors} donor
        {campaign.donors === 1 ? "" : "s"} · {campaign.followers} follower
        {campaign.followers === 1 ? "" : "s"}
      </Text>

      {campaign.status !== "funded" && (
        <>
          <View className="mb-4 mt-4 flex-row gap-2">
            {donationAmounts.map((amount) => (
              <Pressable
                key={amount}
                onPress={() => {
                  setCustomAmount("");
                  setSelectedAmount(amount);
                  posthog?.capture("donation_amount_selected", {
                    campaign_id: campaign.id,
                    campaign_title: campaign.title,
                    amount,
                  });
                }}
                className={`flex-1 items-center rounded-xl border py-2.5 ${
                  !customAmount && selectedAmount === amount
                    ? "border-dono-primary bg-dono-primary/5"
                    : "border-dono-border"
                }`}
              >
                <Text className="font-sans-medium text-sm text-dono-text">£{amount}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            value={customAmount}
            onChangeText={setCustomAmount}
            keyboardType="numeric"
            placeholder="Custom amount (£)"
            className="mb-4 rounded-xl border border-dono-border px-4 py-3 text-dono-text"
          />
          <DonateAnonymouslyToggle
            value={donateAnonymously}
            onChange={setDonateAnonymously}
            className="mb-4"
          />
          <Pressable
            onPress={openDonateSheet}
            className="mb-3 flex-row items-center justify-center gap-2 rounded-full bg-dono-accent py-3"
          >
            <Gift size={16} color="#fff" />
            <Text className="font-sans-medium text-sm text-white">Donate Now</Text>
          </Pressable>
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
        </>
      )}

      <View className="flex-row gap-2">
        <Pressable
          onPress={() => void handleToggleLike()}
          disabled={likeLoading}
          className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border py-2.5 ${
            liked
              ? "border-red-200 bg-red-50"
              : "border-dono-border"
          }`}
        >
          {likeLoading ? (
            <ActivityIndicator size="small" color={liked ? "#C62828" : "#56615A"} />
          ) : (
            <Heart
              size={16}
              color={liked ? "#C62828" : "#56615A"}
              fill={liked ? "#C62828" : "transparent"}
            />
          )}
          <Text
            className={`font-sans-medium text-sm ${
              liked ? "text-red-700" : "text-dono-muted"
            }`}
          >
            {liked ? "Liked" : "Like"} · {campaign.likes}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => void handleToggleFollow()}
          disabled={followLoading}
          className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border py-2.5 ${
            following
              ? "border-dono-primary bg-dono-primary/5"
              : "border-dono-border"
          }`}
        >
          {followLoading ? (
            <ActivityIndicator size="small" color="#17211B" />
          ) : (
            <UserPlus
              size={16}
              color={following ? "#17211B" : "#56615A"}
            />
          )}
          <Text
            className={`font-sans-medium text-sm ${
              following ? "text-dono-primary" : "text-dono-muted"
            }`}
          >
            {following ? "Following" : "Follow"}
          </Text>
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
          <Share2 size={16} color="#56615A" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-7xl px-4 py-6">
        <Link href="/campaigns" asChild>
          <Pressable className="mb-4 flex-row items-center gap-1">
            <ArrowLeft size={16} color="#56615A" />
            <Text className="text-sm text-dono-muted">Back to campaigns</Text>
          </Pressable>
        </Link>

        <View className="flex-col lg:flex-row lg:items-start lg:gap-8">
          <View className="order-2 min-w-0 flex-1 lg:order-1">
        <CampaignImageGallery
          image={campaign.image}
          images={campaign.images}
          category={campaign.category}
          className="mb-6"
          heroClassName="h-56 rounded-2xl"
        >
          <View className="absolute left-4 top-4">
            <CategoryBadge category={campaign.category} />
          </View>
          {campaign.status === "funded" && (
            <View className="absolute right-4 top-4 flex-row items-center gap-1.5 rounded-full bg-white/90 px-3 py-1">
              <CheckCircle2 size={16} color="#047857" />
              <Text className="text-sm font-semibold text-green-700">Fully Funded</Text>
            </View>
          )}
        </CampaignImageGallery>

        <View className="mb-3 flex-row flex-wrap items-center gap-2">
          <Text className="font-display-medium text-2xl text-dono-text">{campaign.title}</Text>
          {campaign.verifications.length > 0 ? (
            <CheckCircle2 size={20} color="#168456" accessibilityLabel="Verified campaign" />
          ) : null}
        </View>

        <View className="mb-4 gap-2">
          <View className="flex-row items-center gap-1">
            <MapPin size={16} color="#56615A" />
            <Text className="text-sm text-dono-muted">
              {campaign.university}
              {campaign.college ? ` · ${campaign.college}` : ""}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Clock size={16} color="#56615A" />
            <Text className="font-mono text-sm text-dono-muted">
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
          liked={liked}
          likeLoading={likeLoading}
          onLikePress={() => void handleToggleLike()}
          onCommentPress={scrollToComments}
          className="mb-6"
        />

        <CampaignCommentsSection
          ref={commentsSectionRef}
          campaignSlug={campaign.id}
          isAuthenticated={isAuthenticated}
        />

        <View className="mb-8 rounded-2xl border border-dono-border bg-white p-6">
          <Text className="mb-3 text-lg font-sans-medium text-dono-text">The Story</Text>
          <Text className="leading-relaxed text-dono-muted">{campaign.story}</Text>
        </View>

        {(campaign.impactItems?.length ?? 0) >= 2 && (
          <FundBreakdownSection className="mb-8">
            <ReceiptLedger>
              {buildGoalLineItems(campaign).map((line) => (
                <ReceiptLineRow key={line.label} {...line} />
              ))}
              <ReceiptDivider />
              <ReceiptTotalRow label="Total goal" amount={campaign.goal} />
            </ReceiptLedger>
          </FundBreakdownSection>
        )}

        {campaign.updates.length > 0 && (
          <View className="mb-8">
            <Text className="mb-4 text-lg font-sans-medium text-dono-text">Updates</Text>
            <View className="gap-4">
              {campaign.updates.map((update) => (
                <View
                  key={update.id}
                  className="rounded-2xl border border-dono-border bg-white p-5"
                >
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="font-sans-medium text-dono-text">{update.title}</Text>
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

        {(related?.length ?? 0) > 0 && (
          <View className="mt-4">
            <Text className="mb-6 font-display-medium text-xl text-dono-text">Related Campaigns</Text>
            <CampaignCardGrid campaigns={related!} />
          </View>
        )}
          </View>

          <View className="order-1 mb-8 w-full shrink-0 self-start lg:order-2 lg:sticky lg:top-6 lg:mb-0 lg:w-80">
            {donationPanel}
          </View>
        </View>
      </View>

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
