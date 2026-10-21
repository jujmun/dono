import { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useAction, useConvexAuth, useQuery } from "convex/react";
import { Banknote } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import { buildConnectReturnUrl } from "@/lib/stripe/connect-return-url";
import { getFriendlyConnectError } from "@/lib/stripe/errors";
import { openStripeUrl } from "@/lib/stripe/open-url";

interface IndividualPayoutSetupBannerProps {
  /** True when the current viewer owns the campaign this banner is shown on. */
  isOwner: boolean;
  returnPath: string;
  className?: string;
}

/** Per-user Stripe Connect onboarding for an approved individual poster —
 * mirrors SocietyPayoutSetupBanner but scoped to the caller's own account
 * (no communitySlug) rather than a society's. */
export function IndividualPayoutSetupBanner({
  isOwner,
  returnPath,
  className,
}: IndividualPayoutSetupBannerProps) {
  const { isAuthenticated } = useConvexAuth();
  const connectStatus = useQuery(
    api.stripeConnectInternal.getMyConnectStatus,
    isAuthenticated && isOwner ? {} : "skip",
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

  const needsSetup =
    isOwner &&
    connectStatus !== undefined &&
    connectStatus !== null &&
    (!connectStatus.cardPaymentsActive ||
      connectStatus.requiresMerchantReonboarding === true);
  const canOpenDashboard =
    isOwner &&
    connectStatus !== undefined &&
    connectStatus !== null &&
    connectStatus.accountVersion === "v2" &&
    connectStatus.cardPaymentsActive === true;

  useEffect(() => {
    if (!isAuthenticated || !isOwner) return;
    if (!connectStatus?.exists || connectStatus.accountVersion !== "v2") {
      return;
    }
    void refreshConnectAccountStatus({}).catch(() => {});
  }, [
    isAuthenticated,
    isOwner,
    connectStatus?.exists,
    connectStatus?.accountVersion,
    refreshConnectAccountStatus,
  ]);

  const handleOpenDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const { url, loginEmail } = await createConnectDashboardLink({});
      if (loginEmail) setDashboardLoginEmail(loginEmail);
      await openStripeUrl(url);
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
      const returnUrl = buildConnectReturnUrl(returnPath);
      const { url } = await createConnectOnboardingLink({
        returnUrl,
        refreshUrl: returnUrl,
      });
      await openStripeUrl(url);
      void refreshConnectAccountStatus({}).catch(() => {});
    } catch (err) {
      setError(getFriendlyConnectError(err));
    } finally {
      setLoading(false);
    }
  };

  if (!needsSetup && !canOpenDashboard) return null;

  if (needsSetup) {
    return (
      <View
        className={
          className ?? "rounded-2xl border border-amber-200 bg-amber-50 p-4"
        }
      >
        <View className="mb-2 flex-row items-center gap-2">
          <Banknote size={16} color="#b45309" />
          <Text className="font-retro-bold text-sm text-amber-900">
            Complete payout setup
          </Text>
        </View>
        <Text className="mb-3 text-xs leading-relaxed text-amber-800">
          {connectStatus?.requiresMerchantReonboarding
            ? "You still have the old Stripe payout account. Complete the new Stripe merchant setup so this campaign can accept donations directly. Donors pay an estimated Stripe processing fee so the intended amount reaches you."
            : "Finish connecting a Stripe merchant account so this campaign can accept donations directly. Donors pay an estimated Stripe processing fee so the intended amount reaches you."}
        </Text>
        <Pressable
          onPress={() => void handleComplete()}
          disabled={loading}
          className={`retro-key flex-row items-center justify-center gap-2 self-start rounded-full bg-dono-primary px-4 py-2 ${
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
        {error ? (
          <Text className="mt-2 text-xs text-rose-700">{error}</Text>
        ) : null}
      </View>
    );
  }

  return (
    <View
      className={
        className ?? "rounded-2xl border border-green-200 bg-green-50 p-4"
      }
    >
      <View className="mb-2 flex-row items-center gap-2">
        <Banknote size={16} color="#15803d" />
        <Text className="font-retro-bold text-sm text-green-900">
          Stripe payments active
        </Text>
      </View>
      <Text className="mb-3 text-xs leading-relaxed text-green-800">
        This campaign can accept donations directly. Donors pay an estimated
        Stripe processing fee so the intended amount reaches you.
      </Text>
      <Pressable
        onPress={() => void handleOpenDashboard()}
        disabled={loading}
        className={`retro-key flex-row items-center justify-center gap-2 self-start rounded-full bg-dono-primary px-4 py-2 ${
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
      {error ? (
        <Text className="mt-2 text-xs text-rose-700">{error}</Text>
      ) : null}
    </View>
  );
}
