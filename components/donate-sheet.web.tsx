import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useAction } from "convex/react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { usePostHog } from "posthog-react-native";
import { api } from "@convex/_generated/api";
import { getFriendlyPaymentError } from "@/lib/stripe/errors";
import type { DonateSheetProps } from "./donate-sheet-types";

const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function PaymentForm({
  campaignId,
  campaignTitle,
  selectedAmount,
  frequency,
  onClose,
  onSuccess,
}: DonateSheetProps) {
  const stripe = useStripe();
  const elements = useElements();
  const posthog = usePostHog();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const donationType = frequency === "monthly" ? "recurring" : "one_time";

  const handleDonate = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      posthog?.capture("donation_started", {
        campaign_id: campaignId,
        campaign_title: campaignTitle,
        amount: selectedAmount,
        donation_type: donationType,
      });

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/campaigns/${campaignId}`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        throw new Error(result.error.message ?? "Payment failed.");
      }

      posthog?.capture("donation_completed", {
        campaign_id: campaignId,
        campaign_title: campaignTitle,
        amount: selectedAmount,
        donation_type: donationType,
      });

      onSuccess(selectedAmount);
      onClose();
    } catch (err) {
      setError(getFriendlyPaymentError(err));
    } finally {
      setLoading(false);
    }
  };

  const payLabel =
    frequency === "monthly"
      ? `Subscribe £${selectedAmount}/month`
      : `Pay £${selectedAmount}`;

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator
      >
        <PaymentElement />
        {error ? <Text className="mt-4 text-sm text-red-600">{error}</Text> : null}
      </ScrollView>

      <View className="border-t border-dono-border pt-4">
        <Pressable
          onPress={() => void handleDonate()}
          disabled={loading || !stripe || !elements}
          className="flex-row items-center justify-center rounded-full bg-dono-accent py-3"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-sans-medium text-sm text-white">{payLabel}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export function DonateSheet({
  visible,
  campaignId,
  campaignTitle,
  selectedAmount,
  frequency,
  onClose,
  onSuccess,
}: DonateSheetProps) {
  const createPaymentIntent = useAction(api.stripe.createPaymentIntent);
  const createRecurringDonationSubscription = useAction(
    api.stripe.createRecurringDonationSubscription,
  );
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const frequencyLabel =
    frequency === "monthly" ? "Monthly donation" : "One-time donation";

  useEffect(() => {
    if (!visible) {
      setClientSecret(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const createPayment =
      frequency === "monthly"
        ? createRecurringDonationSubscription({
            campaignSlug: campaignId,
            amount: selectedAmount,
          })
        : createPaymentIntent({
            campaignSlug: campaignId,
            amount: selectedAmount,
          });

    void createPayment
      .then((result) => {
        if (!cancelled) {
          setClientSecret(result.clientSecret);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getFriendlyPaymentError(err));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    visible,
    campaignId,
    selectedAmount,
    frequency,
    createPaymentIntent,
    createRecurringDonationSubscription,
  ]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="h-[90%] max-h-[90%] rounded-t-3xl bg-white px-6 pb-6 pt-6">
          <Text className="font-display-medium text-xl text-dono-text">Donate to campaign</Text>
          <Text className="mt-1 text-sm text-dono-muted">{campaignTitle}</Text>
          <Text className="mt-4 font-mono-medium text-3xl text-dono-primary">
            £{selectedAmount}
            {frequency === "monthly" ? (
              <Text className="text-base text-dono-muted">/month</Text>
            ) : null}
          </Text>
          <Text className="mt-1 mb-4 text-sm text-dono-muted">{frequencyLabel}</Text>

          {loading ? (
            <View className="flex-1 items-center justify-center py-8">
              <ActivityIndicator color="#1d242f" />
            </View>
          ) : error ? (
            <Text className="mt-4 text-sm text-red-600">{error}</Text>
          ) : clientSecret && stripePromise ? (
            <View className="min-h-0 flex-1">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm
                  visible={visible}
                  campaignId={campaignId}
                  campaignTitle={campaignTitle}
                  selectedAmount={selectedAmount}
                  frequency={frequency}
                  onClose={onClose}
                  onSuccess={onSuccess}
                />
              </Elements>
            </View>
          ) : (
            <Text className="mt-4 text-sm text-dono-muted">
              Stripe is not configured for this environment.
            </Text>
          )}

          <Pressable onPress={onClose} className="mt-3 items-center py-2">
            <Text className="text-sm text-dono-muted">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
