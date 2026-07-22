import { Link } from "expo-router";
import { View, Text, Pressable, ActivityIndicator, Linking, Platform } from "react-native";
import { useAction } from "convex/react";
import { useState } from "react";
import * as ExpoLinking from "expo-linking";
import { CampaignImage } from "@/components/ui/campaign-image";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { initialsFor } from "@/lib/utils";
import type { MySociety, Society } from "@/lib/types";
import { api } from "@convex/_generated/api";

interface SocietyCardProps {
  society: Society | MySociety;
  /** When true, show Connect payout setup CTA for incomplete onboarding. */
  showConnectCta?: boolean;
}

function isMySociety(society: Society | MySociety): society is MySociety {
  return "connectOnboardingComplete" in society;
}

export function SocietyCard({ society, showConnectCta = false }: SocietyCardProps) {
  const createConnectOnboardingLink = useAction(
    api.stripeConnect.createConnectOnboardingLink,
  );
  const refreshConnectAccountStatus = useAction(
    api.stripeConnect.refreshConnectAccountStatus,
  );
  const [connectLoading, setConnectLoading] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const needsConnect =
    showConnectCta &&
    isMySociety(society) &&
    !society.connectCardPaymentsActive;

  const handleCompletePayoutSetup = async () => {
    setConnectLoading(true);
    setConnectError(null);
    try {
      const returnUrl =
        Platform.OS === "web" && typeof window !== "undefined"
          ? `${window.location.origin}/societies`
          : ExpoLinking.createURL("/societies");
      const { url } = await createConnectOnboardingLink({
        communitySlug: society.slug,
        returnUrl,
        refreshUrl: returnUrl,
      });
      await Linking.openURL(url);
      void refreshConnectAccountStatus({ communitySlug: society.slug }).catch(
        () => {},
      );
    } catch (err) {
      setConnectError(getFriendlyAuthError(err));
    } finally {
      setConnectLoading(false);
    }
  };

  return (
    <View className="w-full overflow-hidden rounded-[14px] border-[3px] border-retro-ink bg-retro-paper shadow-[5px_5px_0_#211E1A]">
      <Link href={`/societies/${society.slug}`} asChild>
        <Pressable className="active:opacity-95">
          <CampaignImage
            image={society.coverImageUrl ?? "default"}
            className="h-[170px] border-b-[3px] border-retro-ink bg-retro-indigo"
          >
            <View className="absolute left-4 top-4 h-10 w-10 items-center justify-center rounded-xl border-2 border-retro-ink bg-retro-mint shadow-[3px_3px_0_#211E1A]">
              <Text className="font-retro-bold text-sm text-retro-paper">
                {initialsFor(society.name)}
              </Text>
            </View>
            {society.status === "pending" ? (
              <View className="absolute right-3 top-3 rounded-full border-2 border-retro-ink bg-retro-marigold px-2 py-0.5">
                <Text className="font-retro-bold text-[10px] text-retro-ink">
                  Pending review
                </Text>
              </View>
            ) : null}
          </CampaignImage>
          <View className="p-4">
            <Text
              className="font-retro-bold text-sm text-retro-ink"
              numberOfLines={1}
            >
              {society.name}
            </Text>
          </View>
        </Pressable>
      </Link>
      {needsConnect ? (
        <View className="border-t-[3px] border-retro-ink px-4 pb-4">
          <Pressable
            onPress={() => void handleCompletePayoutSetup()}
            disabled={connectLoading}
            className={`mt-1 items-center rounded-full border-2 border-retro-ink bg-retro-marigold px-3 py-2 ${
              connectLoading ? "opacity-50" : ""
            }`}
          >
            {connectLoading ? (
              <ActivityIndicator color="#211E1A" />
            ) : (
              <Text className="font-retro-bold text-xs text-retro-ink">
                Complete payout setup
              </Text>
            )}
          </Pressable>
          {connectError ? (
            <Text className="mt-1 text-xs text-rose-700">{connectError}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
