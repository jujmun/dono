import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import { useAction, useConvexAuth, useQuery } from "convex/react";
import { Banknote } from "lucide-react-native";
import * as ExpoLinking from "expo-linking";
import { api } from "@convex/_generated/api";
import { getFriendlyConnectError } from "@/lib/stripe/errors";

interface SocietyPayoutSetupBannerProps {
  slug: string;
  /** Path after origin for Stripe return/refresh URLs (default: /societies/:slug). */
  returnPath?: string;
  className?: string;
}

export function SocietyPayoutSetupBanner({
  slug,
  returnPath,
  className,
}: SocietyPayoutSetupBannerProps) {
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

  useEffect(() => {
    if (!isAuthenticated || !slug || !canManage) return;
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

  const buildReturnUrl = () => {
    const path = returnPath ?? `/societies/${encodeURIComponent(slug)}`;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const siteUrl = process.env.EXPO_PUBLIC_SITE_URL?.replace(/\/$/, "");
    if (Platform.OS === "web" && siteUrl) {
      return `${siteUrl}${normalizedPath}`;
    }
    if (Platform.OS === "web" && typeof window !== "undefined") {
      return `${window.location.origin}${normalizedPath}`;
    }
    return ExpoLinking.createURL(normalizedPath.replace(/^\//, ""));
  };

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
      setError(getFriendlyConnectError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);
    try {
      const returnUrl = buildReturnUrl();
      const { url } = await createConnectOnboardingLink({
        communitySlug: slug,
        returnUrl,
        refreshUrl: returnUrl,
      });
      await Linking.openURL(url);
      void refreshConnectAccountStatus({ communitySlug: slug }).catch(() => {});
    } catch (err) {
      setError(getFriendlyConnectError(err));
    } finally {
      setLoading(false);
    }
  };

  if (!needsSetup && !canOpenDashboard) return null;

  if (needsSetup) {
    return (
      <View className={className ?? "rounded-2xl border border-amber-200 bg-amber-50 p-4"}>
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
    <View className={className ?? "rounded-2xl border border-green-200 bg-green-50 p-4"}>
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
