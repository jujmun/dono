import { useEffect, useRef, useState } from "react";
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
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { usePostHog } from "posthog-react-native";
import { api } from "@convex/_generated/api";
import { getFriendlyPaymentError } from "@/lib/stripe/errors";
import { DonateAnonymouslyToggle } from "@/components/donate-anonymously-toggle";
import type { DonateSheetProps } from "./donate-sheet-types";

const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

function ConnectedPaymentForm({
  campaignId,
  campaignTitle,
  selectedAmount,
  frequency,
  clientSecret,
  paymentIntentId,
  donorEmail,
  onClose,
  onSuccess,
  onPaymentCompleted,
}: DonateSheetProps & {
  clientSecret: string;
  paymentIntentId: string;
  onPaymentCompleted: () => void;
}) {
  const confirmOneTimeDonation = useAction(api.stripe.confirmOneTimeDonation);
  const abandonPaymentIntent = useAction(api.stripe.abandonPaymentIntent);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const posthog = usePostHog();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheetReady, setSheetReady] = useState(false);

  const donationType = frequency === "monthly" ? "recurring" : "one_time";

  useEffect(() => {
    let cancelled = false;
    setSheetReady(false);
    void initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: "Dono",
      returnURL: "dono://stripe-redirect",
    }).then((result) => {
      if (!cancelled) {
        setSheetReady(!result.error);
        if (result.error) {
          setError(result.error.message);
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [clientSecret, initPaymentSheet]);

  const handleDonate = async () => {
    setLoading(true);
    setError(null);

    try {
      posthog?.capture("donation_started", {
        campaign_id: campaignId,
        campaign_title: campaignTitle,
        amount: selectedAmount,
        donation_type: donationType,
      });

      const presentResult = await presentPaymentSheet();
      if (presentResult.error) {
        if (presentResult.error.code === "Canceled") {
          if (frequency === "one_time") {
            await abandonPaymentIntent({
              paymentIntentId,
              donorEmail: donorEmail.trim() || undefined,
            });
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
      if (frequency === "one_time") {
        try {
          await confirmOneTimeDonation({ paymentIntentId });
        } catch {
          pendingConfirmation = true;
        }
      }

      onPaymentCompleted();
      onSuccess(
        selectedAmount,
        pendingConfirmation ? { pendingConfirmation: true } : undefined,
      );
      onClose();
    } catch (err) {
      setError(getFriendlyPaymentError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error ? <Text className="mt-4 text-sm text-red-600">{error}</Text> : null}
      <Pressable
        onPress={() => void handleDonate()}
        disabled={loading || !sheetReady}
        className="mt-6 flex-row items-center justify-center rounded-full bg-dono-accent py-3"
      >
        {loading || !sheetReady ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="font-retro-bold text-sm text-white">Continue to payment</Text>
        )}
      </Pressable>
    </>
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
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
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
      setStripeAccountId(null);
      setError(null);
      return;
    }

    if (monthlyBlockedForGuest) {
      setClientSecret(null);
      setPaymentIntentId(null);
      setStripeAccountId(null);
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
        if ("stripeAccountId" in result && result.stripeAccountId) {
          setStripeAccountId(result.stripeAccountId);
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

  const paymentForm =
    clientSecret && paymentIntentId && stripeAccountId ? (
      <StripeProvider
        key={stripeAccountId}
        publishableKey={publishableKey}
        merchantIdentifier="merchant.com.dono.app"
        stripeAccountId={stripeAccountId}
      >
        <ConnectedPaymentForm
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
          clientSecret={clientSecret}
          paymentIntentId={paymentIntentId}
          onPaymentCompleted={() => {
            paymentCompletedRef.current = true;
            activePaymentIntentIdRef.current = null;
          }}
        />
      </StripeProvider>
    ) : frequency === "monthly" && clientSecret ? (
      <Text className="mt-4 text-sm text-dono-muted">
        Monthly donations on native are not yet supported in this build.
      </Text>
    ) : null;

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
          ) : loading ? (
            <View className="mt-6 items-center py-4">
              <ActivityIndicator color="#17211B" />
            </View>
          ) : error ? (
            <Text className="mt-4 text-sm text-red-600">{error}</Text>
          ) : publishableKey ? (
            paymentForm
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
