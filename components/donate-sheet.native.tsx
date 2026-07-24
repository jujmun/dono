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
import { useAction, useMutation } from "convex/react";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { usePostHog } from "posthog-react-native";
import { api } from "@convex/_generated/api";
import { getFriendlyPaymentError } from "@/lib/stripe/errors";
import { LegalAcceptanceCheckbox } from "@/components/legal-acceptance-checkbox";
import {
  calculateDonationFeeBreakdown,
  formatMinorGbp,
} from "@/lib/platform-fee";
import {
  getOrCreateDonateGuestKey,
  type DonateSheetProps,
} from "./donate-sheet-types";

const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

function ConnectedPaymentForm({
  campaignId,
  campaignTitle,
  selectedAmount,
  frequency,
  clientSecret,
  paymentIntentId,
  donorEmail,
  feeTotalLabel,
  onClose,
  onSuccess,
  onPaymentCompleted,
}: {
  campaignId: string;
  campaignTitle: string;
  selectedAmount: number;
  frequency: DonateSheetProps["frequency"];
  clientSecret: string;
  paymentIntentId: string;
  donorEmail: string;
  feeTotalLabel: string;
  onClose: () => void;
  onSuccess: DonateSheetProps["onSuccess"];
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
    <View className="mt-4">
      {error ? <Text className="mb-3 text-sm text-red-600">{error}</Text> : null}
      <Pressable
        onPress={() => void handleDonate()}
        disabled={loading || !sheetReady}
        className="flex-row items-center justify-center rounded-full bg-dono-accent py-3"
      >
        {loading || !sheetReady ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="font-retro-bold text-sm text-white">
            {frequency === "monthly"
              ? `Subscribe ${feeTotalLabel}/month`
              : `Pay ${feeTotalLabel}`}
          </Text>
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
  frequency,
  isAuthenticated,
  donorEmail,
  onDonorEmailChange,
  coverFees,
  onCoverFeesChange,
  legalAccepted,
  onLegalAcceptedChange,
  onClose,
  onSuccess,
}: DonateSheetProps) {
  const createPaymentIntent = useAction(api.stripe.createPaymentIntent);
  const createRecurringDonationSubscription = useAction(
    api.stripe.createRecurringDonationSubscription,
  );
  const abandonPaymentIntent = useAction(api.stripe.abandonPaymentIntent);
  const acceptDocuments = useMutation(api.legal.acceptDocuments);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paymentCompletedRef = useRef(false);
  const activePaymentIntentIdRef = useRef<string | null>(null);
  const donorEmailRef = useRef(donorEmail);
  const guestKeyRef = useRef(getOrCreateDonateGuestKey());

  donorEmailRef.current = donorEmail;

  const frequencyLabel =
    frequency === "monthly" ? "Monthly donation" : "One-time donation";
  const monthlyBlockedForGuest = !isAuthenticated && frequency === "monthly";
  const feeBreakdown = calculateDonationFeeBreakdown(selectedAmount, coverFees);
  const feeTotalLabel = formatMinorGbp(feeBreakdown.totalChargedMinor);
  const stripeConfigured = Boolean(publishableKey);

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
      setLoading(false);
      return;
    }

    if (monthlyBlockedForGuest || !legalAccepted || !stripeConfigured) {
      setClientSecret(null);
      setPaymentIntentId(null);
      setStripeAccountId(null);
      setLoading(false);
      if (!legalAccepted && !monthlyBlockedForGuest) {
        setError(null);
      }
      return;
    }

    let cancelled = false;
    paymentCompletedRef.current = false;
    setLoading(true);
    setError(null);

    const createPayment = async () => {
      await acceptDocuments({
        context: "donate",
        guestKey: isAuthenticated ? undefined : guestKeyRef.current,
      });
      if (frequency === "monthly") {
        return createRecurringDonationSubscription({
          campaignSlug: campaignId,
          amount: selectedAmount,
        });
      }
      return createPaymentIntent({
        campaignSlug: campaignId,
        amount: selectedAmount,
        donorEmail: donorEmailRef.current.trim() || undefined,
        anonymous: false,
        coverFees,
        ageAttested: true,
        guestKey: isAuthenticated ? undefined : guestKeyRef.current,
      });
    };

    void createPayment()
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
          setClientSecret(null);
          setPaymentIntentId(null);
          setStripeAccountId(null);
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
    coverFees,
    legalAccepted,
    stripeConfigured,
    isAuthenticated,
    createPaymentIntent,
    createRecurringDonationSubscription,
    abandonPaymentIntent,
    acceptDocuments,
  ]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[92%] rounded-t-3xl bg-white px-6 pb-6 pt-6">
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text className="font-retro-bold text-xl text-dono-text">Donate</Text>
            <Text className="mt-1 text-sm text-dono-muted" numberOfLines={2}>
              {campaignTitle}
            </Text>

            <Text className="mt-5 font-retro-mono-bold text-3xl text-dono-primary">
              {feeTotalLabel}
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

            <View className="mt-4 gap-2">
              <Pressable
                onPress={() => onCoverFeesChange(!coverFees)}
                className="flex-row items-center gap-2 py-1"
                accessibilityRole="checkbox"
                accessibilityState={{ checked: coverFees }}
              >
                <View
                  className={`h-4 w-4 items-center justify-center rounded border ${
                    coverFees
                      ? "border-dono-primary bg-dono-primary"
                      : "border-dono-border bg-white"
                  }`}
                >
                  {coverFees ? (
                    <Text className="text-[9px] font-bold leading-none text-white">✓</Text>
                  ) : null}
                </View>
                <Text className="min-w-0 flex-1 text-sm text-dono-text">
                  {coverFees
                    ? `Cover fees so £${selectedAmount} reaches the campaign`
                    : `Cover fees (£${selectedAmount} gift → ${formatMinorGbp(feeBreakdown.amountToCampaignMinor)} to campaign)`}
                </Text>
              </Pressable>

              <LegalAcceptanceCheckbox
                context="donate"
                accepted={legalAccepted}
                onAcceptedChange={onLegalAcceptedChange}
              />
            </View>

            <Text className="mt-3 text-xs leading-relaxed text-dono-muted">
              Not Gift Aid. Dono does not issue charitable tax receipts.
            </Text>

            {monthlyBlockedForGuest ? (
              <View className="mt-6">
                <Text className="text-sm text-dono-muted">
                  Monthly donations need an account so you can manage your subscription.
                </Text>
                <Link href="/signin" asChild>
                  <Pressable className="mt-4 items-center rounded-full bg-dono-primary py-3">
                    <Text className="font-retro-bold text-sm text-white">
                      Sign in to continue
                    </Text>
                  </Pressable>
                </Link>
              </View>
            ) : !stripeConfigured ? (
              <Text className="mt-6 text-sm text-red-600">
                Stripe is not configured for this environment. Set
                EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY and restart the app.
              </Text>
            ) : !legalAccepted ? (
              <Text className="mt-6 text-sm text-dono-muted">
                Accept the terms above to continue to payment.
              </Text>
            ) : loading ? (
              <View className="mt-8 items-center py-6">
                <ActivityIndicator color="#17211B" />
                <Text className="mt-3 text-sm text-dono-muted">Preparing payment…</Text>
              </View>
            ) : error ? (
              <Text className="mt-6 text-sm text-red-600">{error}</Text>
            ) : clientSecret && paymentIntentId && stripeAccountId ? (
              <StripeProvider
                key={stripeAccountId}
                publishableKey={publishableKey}
                merchantIdentifier="merchant.com.dono.app"
                stripeAccountId={stripeAccountId}
              >
                <ConnectedPaymentForm
                  campaignId={campaignId}
                  campaignTitle={campaignTitle}
                  selectedAmount={selectedAmount}
                  frequency={frequency}
                  clientSecret={clientSecret}
                  paymentIntentId={paymentIntentId}
                  donorEmail={donorEmail}
                  feeTotalLabel={feeTotalLabel}
                  onClose={onClose}
                  onSuccess={onSuccess}
                  onPaymentCompleted={() => {
                    paymentCompletedRef.current = true;
                    activePaymentIntentIdRef.current = null;
                  }}
                />
              </StripeProvider>
            ) : frequency === "monthly" && clientSecret ? (
              <Text className="mt-6 text-sm text-dono-muted">
                Monthly donations on native are not yet supported in this build.
              </Text>
            ) : null}
          </ScrollView>

          <Pressable onPress={onClose} className="mt-2 items-center py-2">
            <Text className="text-sm text-dono-muted">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
