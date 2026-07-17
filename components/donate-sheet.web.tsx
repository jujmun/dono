import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link } from "expo-router";
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
import { DonateAnonymouslyToggle } from "@/components/donate-anonymously-toggle";
import type { DonateSheetProps } from "./donate-sheet-types";

const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function PaymentForm({
  campaignId,
  campaignTitle,
  selectedAmount,
  frequency,
  paymentIntentId,
  onClose,
  onSuccess,
  onPaymentCompleted,
}: DonateSheetProps & {
  paymentIntentId: string;
  onPaymentCompleted: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const posthog = usePostHog();
  const confirmOneTimeDonation = useAction(api.stripe.confirmOneTimeDonation);
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

      let pendingConfirmation = false;
      if (frequency === "one_time") {
        try {
          await confirmOneTimeDonation({ paymentIntentId });
        } catch {
          pendingConfirmation = true;
        }
      }

      onPaymentCompleted();
      onSuccess(selectedAmount, pendingConfirmation ? { pendingConfirmation: true } : undefined);
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
            <Text className="font-retro-bold text-sm text-white">{payLabel}</Text>
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
  const abandonPaymentIntent = useAction(api.stripe.abandonPaymentIntent);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paymentCompletedRef = useRef(false);
  const activePaymentIntentIdRef = useRef<string | null>(null);
  const donorEmailRef = useRef(donorEmail);

  donorEmailRef.current = donorEmail;

  const frequencyLabel =
    frequency === "monthly" ? "Monthly donation" : "One-time donation";
  const monthlyBlockedForGuest = !isAuthenticated && frequency === "monthly";

  const abandonActivePaymentIntent = () => {
    const piId = activePaymentIntentIdRef.current;
    if (!piId || paymentCompletedRef.current || frequency !== "one_time") {
      return;
    }

    void abandonPaymentIntent({
      paymentIntentId: piId,
      donorEmail: donorEmailRef.current.trim() || undefined,
    });
    activePaymentIntentIdRef.current = null;
  };

  useEffect(() => {
    if (!visible) {
      abandonActivePaymentIntent();
      paymentCompletedRef.current = false;
      setClientSecret(null);
      setPaymentIntentId(null);
      setError(null);
      return;
    }

    if (monthlyBlockedForGuest) {
      setClientSecret(null);
      setPaymentIntentId(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    paymentCompletedRef.current = false;
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
            donorEmail: donorEmailRef.current.trim() || undefined,
            anonymous: donateAnonymously,
          });

    void createPayment
      .then((result) => {
        const piId =
          "paymentIntentId" in result && result.paymentIntentId
            ? result.paymentIntentId
            : null;

        if (cancelled) {
          if (piId && frequency === "one_time") {
            void abandonPaymentIntent({
              paymentIntentId: piId,
              donorEmail: donorEmailRef.current.trim() || undefined,
            });
          }
          return;
        }

        setClientSecret(result.clientSecret);
        if (piId) {
          setPaymentIntentId(piId);
          activePaymentIntentIdRef.current = piId;
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
      abandonActivePaymentIntent();
    };
    // donorEmail is read when the sheet opens / amount changes; avoid recreating
    // the PaymentIntent on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [
    visible,
    campaignId,
    selectedAmount,
    frequency,
    monthlyBlockedForGuest,
    donateAnonymously,
    createPaymentIntent,
    createRecurringDonationSubscription,
    abandonPaymentIntent,
  ]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="h-[90%] max-h-[90%] rounded-t-3xl bg-white px-6 pb-6 pt-6">
          <Text className="font-retro-bold text-xl text-dono-text">Donate to campaign</Text>
          <Text className="mt-1 text-sm text-dono-muted">{campaignTitle}</Text>
          <Text className="mt-4 font-retro-mono-bold text-3xl text-dono-primary">
            £{selectedAmount}
            {frequency === "monthly" ? (
              <Text className="text-base text-dono-muted">/month</Text>
            ) : null}
          </Text>
          <Text className="mt-1 mb-4 text-sm text-dono-muted">{frequencyLabel}</Text>

          {!isAuthenticated && frequency === "one_time" ? (
            <TextInput
              value={donorEmail}
              onChangeText={onDonorEmailChange}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email for receipt (optional)"
              placeholderTextColor="#56615A"
              className="mb-4 rounded-xl border border-dono-border px-4 py-3 text-dono-text"
            />
          ) : null}

          <DonateAnonymouslyToggle
            value={donateAnonymously}
            onChange={onDonateAnonymouslyChange}
            className="mb-4"
          />

          {monthlyBlockedForGuest ? (
            <View className="flex-1">
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
          ) : loading ? (
            <View className="flex-1 items-center justify-center py-8">
              <ActivityIndicator color="#17211B" />
            </View>
          ) : error ? (
            <Text className="mt-4 text-sm text-red-600">{error}</Text>
          ) : clientSecret && paymentIntentId && stripePromise ? (
            <View className="min-h-0 flex-1">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm
                  visible={visible}
                  campaignId={campaignId}
                  campaignTitle={campaignTitle}
                  selectedAmount={selectedAmount}
                  frequency={frequency}
                  isAuthenticated={isAuthenticated}
                  donorEmail={donorEmail}
                  onDonorEmailChange={onDonorEmailChange}
                  donateAnonymously={donateAnonymously}
                  onDonateAnonymouslyChange={onDonateAnonymouslyChange}
                  onClose={onClose}
                  onSuccess={onSuccess}
                  paymentIntentId={paymentIntentId}
                  onPaymentCompleted={() => {
                    paymentCompletedRef.current = true;
                    activePaymentIntentIdRef.current = null;
                  }}
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
