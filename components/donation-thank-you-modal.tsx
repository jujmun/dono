import { useEffect } from "react";
import { Modal, Pressable, Text, View } from "react-native";
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
import { CheckCircle2, Gift, Sparkles } from "lucide-react-native";
import { formatCurrency } from "@/lib/constants";

const CONFETTI_COUNT = 14;
const CONFETTI_COLORS = ["#2f6844", "#168456", "#047857", "#86efac", "#bbf7d0", "#fbbf24"];

type DonationThankYouModalProps = {
  visible: boolean;
  amount?: number;
  campaignTitle: string;
  pendingConfirmation?: boolean;
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
  campaignTitle,
  pendingConfirmation = false,
  onClose,
}: DonationThankYouModalProps) {
  const iconScale = useSharedValue(0.4);
  const glowOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.6);

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
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(260).springify()}
                className="mt-6 w-full rounded-2xl border border-dashed border-dono-border bg-white/80 px-4 py-4"
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-dono-primary/10">
                    <Gift size={18} color="#2f6844" />
                  </View>
                  <Text className="flex-1 text-sm leading-relaxed text-dono-muted">
                    You&apos;re helping students turn ideas into real impact. Every
                    donation moves this campaign closer to its goal.
                  </Text>
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(360).springify()} className="mt-8 w-full">
                <Pressable
                  onPress={onClose}
                  className="items-center rounded-full bg-dono-primary py-3.5"
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
