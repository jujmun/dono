import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
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
  onClose,
  onSuccess,
}: DonateSheetProps) {
  const stripe = useStripe();
  const elements = useElements();
  const posthog = usePostHog();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDonate = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      posthog?.capture("donation_started", {
        campaign_id: campaignId,
        campaign_title: campaignTitle,
        amount: selectedAmount,
        donation_type: "one_time",
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
    <View>
      <PaymentElement />
      {error ? <Text className="mt-4 text-sm text-red-600">{error}</Text> : null}
      <Pressable
        onPress={() => void handleDonate()}
        disabled={loading || !stripe || !elements}
        className="mt-6 flex-row items-center justify-center rounded-full bg-dono-accent py-3"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="font-sans-medium text-sm text-white">Pay £{selectedAmount}</Text>
        )}
      </Pressable>
    </View>
  );
}

export function DonateSheet({
  visible,
  campaignId,
  campaignTitle,
  selectedAmount,
  onClose,
  onSuccess,
}: DonateSheetProps) {
  const createPaymentIntent = useAction(api.stripe.createPaymentIntent);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setClientSecret(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    void createPaymentIntent({
      campaignSlug: campaignId,
      amount: selectedAmount,
    })
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
  }, [visible, campaignId, selectedAmount, createPaymentIntent]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[90%] rounded-t-3xl bg-white p-6">
          <Text className="font-display-medium text-xl text-dono-text">Donate to campaign</Text>
          <Text className="mt-1 text-sm text-dono-muted">{campaignTitle}</Text>
          <Text className="mt-4 font-mono-medium text-3xl text-dono-primary">
            £{selectedAmount}
          </Text>
          <Text className="mt-1 text-sm text-dono-muted">One-time donation</Text>

          {loading ? (
            <View className="items-center py-8">
              <ActivityIndicator color="#1d242f" />
            </View>
          ) : error ? (
            <Text className="mt-4 text-sm text-red-600">{error}</Text>
          ) : clientSecret && stripePromise ? (
            <View className="mt-4">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm
                  visible={visible}
                  campaignId={campaignId}
                  campaignTitle={campaignTitle}
                  selectedAmount={selectedAmount}
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
