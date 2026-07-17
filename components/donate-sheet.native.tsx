import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link } from "expo-router";
import { useAction } from "convex/react";
import { useStripe } from "@stripe/stripe-react-native";
import { usePostHog } from "posthog-react-native";
import { api } from "@convex/_generated/api";
import { getFriendlyPaymentError } from "@/lib/stripe/errors";
import { DonateAnonymouslyToggle } from "@/components/donate-anonymously-toggle";
import type { DonateSheetProps } from "./donate-sheet-types";

export function DonateSheet({
  visible,
  campaignId,
  campaignTitle,
  selectedAmount,
  frequency,
  isAuthenticated,
  donorEmail,
  onDonorEmailChange,
  donateAnonymously,
  onDonateAnonymouslyChange,
  onClose,
  onSuccess,
}: DonateSheetProps) {
  const createPaymentIntent = useAction(api.stripe.createPaymentIntent);
  const createRecurringDonationSubscription = useAction(
    api.stripe.createRecurringDonationSubscription,
  );
  const confirmOneTimeDonation = useAction(api.stripe.confirmOneTimeDonation);
  const abandonPaymentIntent = useAction(api.stripe.abandonPaymentIntent);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const posthog = usePostHog();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const donationType = frequency === "monthly" ? "recurring" : "one_time";
  const frequencyLabel =
    frequency === "monthly" ? "Monthly donation" : "One-time donation";
  const monthlyBlockedForGuest = !isAuthenticated && frequency === "monthly";

  const abandonOneTimePayment = async (paymentIntentId: string) => {
    await abandonPaymentIntent({
      paymentIntentId,
      donorEmail: donorEmail.trim() || undefined,
    });
  };

  const handleDonate = async () => {
    if (monthlyBlockedForGuest) return;

    setLoading(true);
    setError(null);

    let paymentIntentId: string | undefined;

    try {
      posthog?.capture("donation_started", {
        campaign_id: campaignId,
        campaign_title: campaignTitle,
        amount: selectedAmount,
        donation_type: donationType,
      });

      const paymentResult =
        frequency === "monthly"
          ? await createRecurringDonationSubscription({
              campaignSlug: campaignId,
              amount: selectedAmount,
            })
          : await createPaymentIntent({
              campaignSlug: campaignId,
              amount: selectedAmount,
              donorEmail: donorEmail.trim() || undefined,
              anonymous: donateAnonymously,
            });

      if ("paymentIntentId" in paymentResult && paymentResult.paymentIntentId) {
        paymentIntentId = paymentResult.paymentIntentId;
      }

      const clientSecret = paymentResult.clientSecret;

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
          if (paymentIntentId && frequency === "one_time") {
            await abandonOneTimePayment(paymentIntentId);
          }
          return;
        }
        throw new Error(presentResult.error.message);
      }

      posthog?.capture("donation_completed", {
        campaign_id: campaignId,
        campaign_title: campaignTitle,
        amount: selectedAmount,
        donation_type: donationType,
      });

      let pendingConfirmation = false;
      if (paymentIntentId && frequency === "one_time") {
        try {
          await confirmOneTimeDonation({
            paymentIntentId,
          });
        } catch {
          pendingConfirmation = true;
        }
      }

      onSuccess(
        selectedAmount,
        pendingConfirmation ? { pendingConfirmation: true } : undefined,
      );
      onClose();
    } catch (err) {
      if (paymentIntentId && frequency === "one_time") {
        try {
          await abandonOneTimePayment(paymentIntentId);
        } catch {
          // Ignore abandon failures; surface the original payment error.
        }
      }
      setError(getFriendlyPaymentError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="rounded-t-3xl bg-white p-6">
          <Text className="font-retro-bold text-xl text-dono-text">Donate to campaign</Text>
          <Text className="mt-1 text-sm text-dono-muted">{campaignTitle}</Text>
          <Text className="mt-4 font-retro-mono-bold text-3xl text-dono-primary">
            £{selectedAmount}
            {frequency === "monthly" ? (
              <Text className="text-base text-dono-muted">/month</Text>
            ) : null}
          </Text>
          <Text className="mt-1 text-sm text-dono-muted">{frequencyLabel}</Text>

          {!isAuthenticated && frequency === "one_time" ? (
            <TextInput
              value={donorEmail}
              onChangeText={onDonorEmailChange}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email for receipt (optional)"
              placeholderTextColor="#56615A"
              className="mt-4 rounded-xl border border-dono-border px-4 py-3 text-dono-text"
            />
          ) : null}

          <DonateAnonymouslyToggle
            value={donateAnonymously}
            onChange={onDonateAnonymouslyChange}
            className="mt-4"
          />

          {monthlyBlockedForGuest ? (
            <View className="mt-4">
              <Text className="text-sm text-dono-muted">
                Monthly donations require an account so you can manage or cancel your
                subscription later.
              </Text>
              <Link href="/signin" asChild>
                <Pressable className="mt-4 items-center rounded-full bg-dono-primary py-3">
                  <Text className="font-retro-bold text-sm text-white">Sign in to continue</Text>
                </Pressable>
              </Link>
            </View>
          ) : (
            <>
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
                  <Text className="font-retro-bold text-sm text-white">Continue to payment</Text>
                )}
              </Pressable>
            </>
          )}

          <Pressable onPress={onClose} className="mt-3 items-center py-2">
            <Text className="text-sm text-dono-muted">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
