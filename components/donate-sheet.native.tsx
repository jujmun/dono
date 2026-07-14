import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { useAction } from "convex/react";
import { useStripe } from "@stripe/stripe-react-native";
import { usePostHog } from "posthog-react-native";
import { api } from "@convex/_generated/api";
import { getFriendlyPaymentError } from "@/lib/stripe/errors";
import type { DonateSheetProps } from "./donate-sheet-types";

export function DonateSheet({
  visible,
  campaignId,
  campaignTitle,
  selectedAmount,
  onClose,
  onSuccess,
}: DonateSheetProps) {
  const createPaymentIntent = useAction(api.stripe.createPaymentIntent);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const posthog = usePostHog();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDonate = async () => {
    setLoading(true);
    setError(null);

    try {
      posthog?.capture("donation_started", {
        campaign_id: campaignId,
        campaign_title: campaignTitle,
        amount: selectedAmount,
        donation_type: "one_time",
      });

      const { clientSecret } = await createPaymentIntent({
        campaignSlug: campaignId,
        amount: selectedAmount,
      });

      const initResult = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Dono",
        returnURL: "dono://stripe-redirect",
      });

      if (initResult.error) {
        throw new Error(initResult.error.message);
      }

      const presentResult = await presentPaymentSheet();
      if (presentResult.error) {
        if (presentResult.error.code === "Canceled") {
          return;
        }
        throw new Error(presentResult.error.message);
      }

      posthog?.capture("donation_completed", {
        campaign_id: campaignId,
        campaign_title: campaignTitle,
        amount: selectedAmount,
        donation_type: "one_time",
      });

      onSuccess(selectedAmount);
      onClose();
    } catch (err) {
      setError(getFriendlyPaymentError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="rounded-t-3xl bg-white p-6">
          <Text className="font-display-medium text-xl text-dono-text">Donate to campaign</Text>
          <Text className="mt-1 text-sm text-dono-muted">{campaignTitle}</Text>
          <Text className="mt-4 font-mono-medium text-3xl text-dono-primary">
            £{selectedAmount}
          </Text>
          <Text className="mt-1 text-sm text-dono-muted">One-time donation</Text>

          {error ? (
            <Text className="mt-4 text-sm text-red-600">{error}</Text>
          ) : null}

          <Pressable
            onPress={() => void handleDonate()}
            disabled={loading}
            className="mt-6 flex-row items-center justify-center rounded-full bg-dono-accent py-3"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-sans-medium text-sm text-white">Continue to payment</Text>
            )}
          </Pressable>

          <Pressable onPress={onClose} className="mt-3 items-center py-2">
            <Text className="text-sm text-dono-muted">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
