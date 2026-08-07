import { useEffect, useState } from "react";
import { Modal, Platform, Pressable, Share, Text, View } from "react-native";
import { Link } from "expo-router";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { CheckCircle2, Share2, Sparkles } from "lucide-react-native";
import QRCode from "react-native-qrcode-svg";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { formatCurrency } from "@/lib/constants";
import { EmailUpdateOptInCheckbox } from "@/components/email-update-opt-in-checkbox";
import {
  buildInstagramStoryShareUrl,
  getSiteOrigin,
  isLoopbackOrigin,
  resolveQrShareOrigin,
} from "@/lib/instagram-story";

const CONFETTI_COUNT = 14;
const CONFETTI_COLORS = ["#2f6844", "#168456", "#047857", "#86efac", "#bbf7d0", "#fbbf24"];

type DonationThankYouModalProps = {
  visible: boolean;
  amount?: number;
  matchedAmount?: number;
  campaignTitle: string;
  campaignSlug?: string;
  pendingConfirmation?: boolean;
  paymentIntentId?: string;
  /** CH-07: document versions accepted at checkout */
  legalVersions?: { title: string; href: string; version: string }[];
  onClose: () => void;
};

function ConfettiParticle({
  index,
  active,
}: {
  index: number;
  active: boolean;
}) {
  const progress = useSharedValue(0);
  const angle = (index / CONFETTI_COUNT) * Math.PI * 2;
  const distance = 72 + (index % 4) * 18;

  useEffect(() => {
    if (!active) {
      progress.value = 0;
      return;
    }
    progress.value = withDelay(
      index * 35,
      withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }),
    );
  }, [active, index, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateX: Math.cos(angle) * distance * progress.value },
      { translateY: Math.sin(angle) * distance * progress.value - 28 * progress.value },
      { rotate: `${progress.value * 280}deg` },
      { scale: 1 - progress.value * 0.4 },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: index % 2 === 0 ? 8 : 6,
          height: index % 2 === 0 ? 8 : 10,
          borderRadius: index % 3 === 0 ? 999 : 2,
          backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        },
        style,
      ]}
    />
  );
}

export function DonationThankYouModal({
  visible,
  amount,
  matchedAmount,
  campaignTitle,
  campaignSlug,
  pendingConfirmation = false,
  paymentIntentId,
  legalVersions,
  onClose,
}: DonationThankYouModalProps) {
  const iconScale = useSharedValue(0.4);
  const glowOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.6);
  const [emailUpdatesOptIn, setEmailUpdatesOptIn] = useState(false);
  const [shareHint, setShareHint] = useState<string | null>(null);
  const [storyShareUrl, setStoryShareUrl] = useState<string | null>(null);
  const setEmailUpdateOptIn = useMutation(api.donations.setEmailUpdateOptIn);

  useEffect(() => {
    if (!visible || !campaignSlug) {
      setStoryShareUrl(null);
      return;
    }

    // Show a QR immediately (may be localhost), then upgrade to LAN/public origin.
    setStoryShareUrl(
      buildInstagramStoryShareUrl({
        siteOrigin: getSiteOrigin(),
        campaignSlug,
        amount,
        matchedAmount,
      }),
    );

    let cancelled = false;
    void resolveQrShareOrigin().then((origin) => {
      if (cancelled) return;
      setStoryShareUrl(
        buildInstagramStoryShareUrl({
          siteOrigin: origin,
          campaignSlug,
          amount,
          matchedAmount,
        }),
      );
    });

    return () => {
      cancelled = true;
    };
  }, [visible, campaignSlug, amount, matchedAmount]);

  useEffect(() => {
    if (!visible) {
      setEmailUpdatesOptIn(false);
      setShareHint(null);
    }
  }, [visible]);

  const handleOptInChange = (value: boolean) => {
    setEmailUpdatesOptIn(value);
    if (!paymentIntentId) return;
    setEmailUpdateOptIn({ paymentIntentId, optedIn: value }).catch(() => {
      // Best-effort — the donation itself already succeeded, so we don't
      // want a failed preference save to disrupt the thank-you screen.
    });
  };

  const handleShareImpact = async () => {
    const total =
      amount != null
        ? amount + (matchedAmount && matchedAmount > 0 ? matchedAmount : 0)
        : null;
    const amountLabel = total != null ? formatCurrency(total) : "a gift";
    const path = campaignSlug ? `/campaigns/${campaignSlug}` : "";
    const url =
      typeof window !== "undefined" && path
        ? `${window.location.origin}${path}`
        : path
          ? `${getSiteOrigin()}${path}`
          : getSiteOrigin();
    const message = `I just gave ${amountLabel} to support ${campaignTitle} on Dono. Join me:`;

    try {
      await Share.share(
        Platform.OS === "ios"
          ? { url, message }
          : { message: `${message}\n${url}` },
      );
      setShareHint(null);
    } catch {
      if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${message}\n${url}`);
        setShareHint("Link copied");
      }
    }
  };

  useEffect(() => {
    if (!visible) {
      iconScale.value = 0.4;
      glowOpacity.value = 0;
      ringScale.value = 0.6;
      return;
    }

    iconScale.value = withSequence(
      withSpring(1.15, { damping: 8, stiffness: 220 }),
      withSpring(1, { damping: 12, stiffness: 180 }),
    );
    ringScale.value = withSequence(
      withTiming(1.35, { duration: 500, easing: Easing.out(Easing.cubic) }),
      withTiming(1.5, { duration: 700, easing: Easing.out(Easing.quad) }),
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 900 }),
        withTiming(0.12, { duration: 900 }),
      ),
      -1,
      true,
    );
  }, [visible, glowOpacity, iconScale, ringScale]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: 1 - (ringScale.value - 0.6) / 1.2,
    transform: [{ scale: ringScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const matchedTotal =
    amount != null && matchedAmount != null && matchedAmount > 0
      ? amount + matchedAmount
      : null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 px-6"
        onPress={onClose}
      >
        <Pressable onPress={(event) => event.stopPropagation()}>
          <Animated.View
            entering={FadeIn.duration(220)}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-dono-border bg-dono-cream shadow-2xl"
          >
            <View className="items-center px-8 pb-8 pt-10">
              <View className="mb-6 h-32 w-32 items-center justify-center">
                <Animated.View
                  style={glowStyle}
                  className="absolute h-28 w-28 rounded-full bg-dono-primary"
                />
                <Animated.View
                  style={ringStyle}
                  className="absolute h-24 w-24 rounded-full border-2 border-dono-primary/30"
                />
                <View className="absolute h-full w-full items-center justify-center">
                  {Array.from({ length: CONFETTI_COUNT }, (_, index) => (
                    <ConfettiParticle key={index} index={index} active={visible} />
                  ))}
                </View>
                <Animated.View
                  style={iconStyle}
                  className="h-20 w-20 items-center justify-center rounded-full bg-dono-primary shadow-lg"
                >
                  <CheckCircle2 size={40} color="#F7FAF8" strokeWidth={2.5} />
                </Animated.View>
              </View>

              <Animated.View entering={FadeInDown.delay(120).springify()} className="items-center">
                <View className="mb-3 flex-row items-center gap-2">
                  <Sparkles size={18} color="#168456" />
                  <Text className="font-retro-bold text-3xl text-dono-text">
                    Thank you!
                  </Text>
                  <Sparkles size={18} color="#168456" />
                </View>

                {amount != null ? (
                  <Text className="font-retro-mono-bold text-4xl text-dono-primary">
                    {formatCurrency(amount)}
                  </Text>
                ) : null}

                {matchedTotal != null ? (
                  <Text className="mt-1 font-retro-mono text-sm text-dono-muted">
                    With match: {formatCurrency(matchedTotal)}
                  </Text>
                ) : null}

                <Text className="mt-3 text-center text-base leading-relaxed text-dono-muted">
                  {pendingConfirmation
                    ? "Your payment was received. This campaign total may take a moment to update."
                    : amount != null
                      ? `Your generous gift is on its way to support`
                      : "Your generous gift is on its way to support"}
                </Text>
                <Text className="mt-1 text-center font-retro-bold text-base text-dono-text">
                  {campaignTitle}
                </Text>

                {legalVersions && legalVersions.length > 0 ? (
                  <View className="mt-4 w-full rounded-xl border border-dono-border bg-white px-3 py-3">
                    <Text className="text-xs font-semibold text-dono-text">
                      Documents accepted
                    </Text>
                    {legalVersions.map((doc) => (
                      <Link key={doc.href} href={doc.href as `/legal/${string}`} asChild>
                        <Pressable className="mt-1.5">
                          <Text className="text-xs text-dono-primary underline">
                            {doc.title} v{doc.version}
                          </Text>
                        </Pressable>
                      </Link>
                    ))}
                  </View>
                ) : null}
              </Animated.View>

              {paymentIntentId ? (
                <Animated.View
                  entering={FadeInDown.delay(300).springify()}
                  className="mt-4 w-full"
                >
                  <EmailUpdateOptInCheckbox
                    campaignTitle={campaignTitle}
                    checked={emailUpdatesOptIn}
                    onCheckedChange={handleOptInChange}
                  />
                </Animated.View>
              ) : null}

              {campaignSlug ? (
                <Animated.View
                  entering={FadeInDown.delay(320).springify()}
                  className="mt-5 w-full items-center"
                >
                  <View className="rounded-2xl border-2 border-dono-border bg-white p-3">
                    {storyShareUrl ? (
                      <QRCode
                        value={storyShareUrl}
                        size={148}
                        backgroundColor="#FFFFFF"
                        color="#17211B"
                      />
                    ) : (
                      <View className="h-[148px] w-[148px] items-center justify-center">
                        <Text className="font-retro-mono text-xs text-dono-muted">
                          Preparing…
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="mt-3 text-center font-retro-mono text-xs text-dono-muted">
                    Scan to share an Instagram Story
                  </Text>
                  {storyShareUrl && isLoopbackOrigin(storyShareUrl) ? (
                    <Text className="mt-1 max-w-xs text-center font-retro-mono text-[10px] text-dono-muted">
                      Using a local link — on joindono.com this QR opens for
                      phones automatically.
                    </Text>
                  ) : null}
                </Animated.View>
              ) : null}

              <Animated.View entering={FadeInDown.delay(340).springify()} className="mt-4 w-full">
                <Pressable
                  onPress={() => void handleShareImpact()}
                  className="flex-row items-center justify-center gap-2 rounded-full border-2 border-dono-border bg-white py-3"
                >
                  <Share2 size={16} color="#17211B" />
                  <Text className="font-retro-bold text-sm text-dono-text">
                    Share your impact
                  </Text>
                </Pressable>
                {shareHint ? (
                  <Text className="mt-2 text-center font-retro-mono text-xs text-dono-muted">
                    {shareHint}
                  </Text>
                ) : null}
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(360).springify()} className="mt-4 w-full">
                <Pressable
                  onPress={onClose}
                  className="retro-key items-center rounded-full bg-dono-primary py-3.5"
                >
                  <Text className="font-retro-bold text-sm text-white">
                    Continue exploring
                  </Text>
                </Pressable>
              </Animated.View>
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
