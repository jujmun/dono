import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAction, useMutation } from "convex/react";
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
import {
  AgeAttestationCheckbox,
  LegalAcceptanceCheckbox,
} from "@/components/legal-acceptance-checkbox";
import {
  DonateDobGateForm,
  useDonateDobGate,
} from "@/components/donate-dob-gate";
import {
  calculateDonationFeeBreakdown,
  formatMinorGbp,
} from "@/lib/platform-fee";
import {
  ReceiptDivider,
  ReceiptLedger,
  ReceiptLineRow,
} from "@/components/ui/receipt-lines";
import {
  getOrCreateDonateGuestKey,
  type DonateSheetProps,
} from "./donate-sheet-types";

const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

const stripePromiseCache = new Map<string, ReturnType<typeof loadStripe>>();

function getStripePromise(stripeAccountId: string) {
  const cached = stripePromiseCache.get(stripeAccountId);
  if (cached) {
    return cached;
  }

  const promise = loadStripe(publishableKey, { stripeAccount: stripeAccountId });
  stripePromiseCache.set(stripeAccountId, promise);
  return promise;
}

function PaymentForm({
  campaignId,
  campaignTitle,
  selectedAmount,
  paymentIntentId,
  feeTotalLabel,
  onClose,
  onSuccess,
  onPaymentCompleted,
}: {
  campaignId: string;
  campaignTitle: string;
  selectedAmount: number;
  paymentIntentId: string;
  feeTotalLabel: string;
  onClose: () => void;
  onSuccess: DonateSheetProps["onSuccess"];
  onPaymentCompleted: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const posthog = usePostHog();
  const confirmOneTimeDonation = useAction(api.stripe.confirmOneTimeDonation);
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
        cover_fees: true,
      });

      const submitResult = await elements.submit();
      if (submitResult.error) {
        throw new Error(submitResult.error.message ?? "Payment details are incomplete.");
      }

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

      let pendingConfirmation = false;
      try {
        await confirmOneTimeDonation({ paymentIntentId });
      } catch {
        pendingConfirmation = true;
      }

      onPaymentCompleted();
      onSuccess(selectedAmount, { pendingConfirmation, paymentIntentId });
      onClose();
    } catch (err) {
      setError(getFriendlyPaymentError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mt-4">
      <div className="min-h-[220px] w-full">
        <PaymentElement
          onLoadError={(event) => {
            setError(event.error.message ?? "Could not load the payment form.");
          }}
        />
      </div>

      {error ? <Text className="mt-4 text-sm text-red-600">{error}</Text> : null}

      <View className="mt-4 border-t border-dono-border pt-4">
        <Pressable
          onPress={() => void handleDonate()}
          disabled={loading || !stripe || !elements}
          className="flex-row items-center justify-center rounded-full bg-dono-accent py-3"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-retro-bold text-sm text-white">
              Pay {feeTotalLabel}
            </Text>
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
  isAuthenticated,
  donorEmail,
  onDonorEmailChange,
  isAnonymous,
  onAnonymousChange,
  legalAccepted,
  onLegalAcceptedChange,
  ageAttested,
  onAgeAttestedChange,
  onClose,
  onSuccess,
}: DonateSheetProps) {
  const createPaymentIntent = useAction(api.stripe.createPaymentIntent);
  const abandonPaymentIntent = useAction(api.stripe.abandonPaymentIntent);
  const acceptDocuments = useMutation(api.legal.acceptDocuments);
  const {
    needsDob,
    dobReady,
    dobInput,
    setDobInput,
    dobError,
    dobSaving,
    saveDob,
  } = useDonateDobGate(isAuthenticated);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const paymentCompletedRef = useRef(false);
  const activePaymentIntentIdRef = useRef<string | null>(null);
  const donorEmailRef = useRef(donorEmail);
  const guestKeyRef = useRef(getOrCreateDonateGuestKey());

  donorEmailRef.current = donorEmail;

  const feeBreakdown = calculateDonationFeeBreakdown(selectedAmount);
  const feeTotalLabel = formatMinorGbp(feeBreakdown.totalChargedMinor);
  const stripeConfigured = Boolean(publishableKey);

  const abandonActivePaymentIntent = () => {
    const piId = activePaymentIntentIdRef.current;
    if (!piId || paymentCompletedRef.current) {
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
      setShowBreakdown(false);
      return;
    }

    if (!legalAccepted || !ageAttested || !stripeConfigured || !dobReady) {
      setClientSecret(null);
      setPaymentIntentId(null);
      setStripeAccountId(null);
      setLoading(false);
      if (!legalAccepted || !ageAttested) {
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
      return createPaymentIntent({
        campaignSlug: campaignId,
        amount: selectedAmount,
        donorEmail: donorEmailRef.current.trim() || undefined,
        anonymous: isAnonymous,
        coverFees: true,
        ageAttested,
        guestKey: isAuthenticated ? undefined : guestKeyRef.current,
      });
    };

    void createPayment()
      .then((result) => {
        if (cancelled) {
          if (result.paymentIntentId) {
            void abandonPaymentIntent({
              paymentIntentId: result.paymentIntentId,
              donorEmail: donorEmailRef.current.trim() || undefined,
            });
          }
          return;
        }

        setClientSecret(result.clientSecret);
        setPaymentIntentId(result.paymentIntentId);
        activePaymentIntentIdRef.current = result.paymentIntentId;
        setStripeAccountId(result.stripeAccountId);
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
    isAnonymous,
    legalAccepted,
    ageAttested,
    stripeConfigured,
    isAuthenticated,
    dobReady,
  ]);

  const paymentReady = Boolean(clientSecret && paymentIntentId && stripeAccountId);

  const stripePromise = useMemo(
    () => (stripeAccountId ? getStripePromise(stripeAccountId) : null),
    [stripeAccountId],
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[92%] rounded-t-3xl bg-white px-6 pb-6 pt-6">
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <Text className="font-retro-bold text-2xl text-dono-text">Donate</Text>
            <Text className="mt-1 text-sm text-dono-muted" numberOfLines={2}>
              {campaignTitle}
            </Text>

            <Text className="mt-5 font-retro-mono-bold text-4xl text-dono-primary">
              {feeTotalLabel}
            </Text>
            <Pressable
              onPress={() => setShowBreakdown((prev) => !prev)}
              className="mt-1 flex-row flex-wrap items-center gap-1"
              accessibilityRole="button"
            >
              <Text className="text-sm text-dono-muted">One-time donation ·</Text>
              <Text className="text-sm text-dono-primary underline">
                {showBreakdown ? "Hide breakdown" : "See breakdown"}
              </Text>
            </Pressable>

            {!isAuthenticated ? (
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
              <AgeAttestationCheckbox
                accepted={ageAttested}
                onAcceptedChange={onAgeAttestedChange}
              />
              <LegalAcceptanceCheckbox
                context="donate"
                accepted={legalAccepted}
                onAcceptedChange={onLegalAcceptedChange}
                showAgeAttestation={false}
              />

              {needsDob ? (
                <DonateDobGateForm
                  dobInput={dobInput}
                  onDobInputChange={setDobInput}
                  dobError={dobError}
                  dobSaving={dobSaving}
                  onSave={() => void saveDob()}
                />
              ) : null}
            </View>

            {showBreakdown ? (
              <ReceiptLedger className="mt-4">
                <ReceiptLineRow
                  label="Your donation"
                  amount={formatMinorGbp(feeBreakdown.intendedCampaignAmountMinor)}
                />
                <ReceiptLineRow
                  label="Estimated processing fee (typical UK card)"
                  amount={formatMinorGbp(feeBreakdown.estimatedStripeFeeMinor)}
                  muted
                />
                <ReceiptDivider />
                <ReceiptLineRow
                  label="Estimated amount reaching the campaign"
                  amount={formatMinorGbp(feeBreakdown.amountToCampaignMinor)}
                  emphasis
                />
              </ReceiptLedger>
            ) : null}

            <Pressable
              onPress={() => onAnonymousChange(!isAnonymous)}
              className="mt-3 flex-row items-center gap-2 py-1"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isAnonymous }}
            >
              <View
                className={`h-3 w-3 items-center justify-center rounded border ${
                  isAnonymous
                    ? "border-dono-primary bg-dono-primary"
                    : "border-dono-border bg-white"
                }`}
              >
                {isAnonymous ? (
                  <Text className="text-[8px] font-bold leading-none text-white">✓</Text>
                ) : null}
              </View>
              <Text className="min-w-0 flex-1 text-sm text-dono-text">
                Make this donation anonymous
              </Text>
            </Pressable>

            <Text className="mt-3 text-xs leading-relaxed text-dono-muted">
              Donations are paid to this society&apos;s Stripe Connected Account,
              which is the Merchant of Record. The processing fee shown is an
              estimate based on a typical UK card; your card&apos;s actual fee may
              be higher or lower, so the amount the campaign receives may differ
              slightly from the estimate above.
            </Text>

            <Text className="mt-2 text-xs leading-relaxed text-dono-muted">
              Not Gift Aid. Dono does not issue charitable tax receipts.
            </Text>

            {!stripeConfigured ? (
              <Text className="mt-6 text-sm text-red-600">
                Stripe is not configured for this environment. Set
                EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY and restart the app.
              </Text>
            ) : needsDob ? (
              <Text className="mt-6 text-sm text-dono-muted">
                Confirm your date of birth above to continue to payment.
              </Text>
            ) : !ageAttested ? (
              <Text className="mt-6 text-sm text-dono-muted">
                Confirm you are at least 18 above to continue to payment.
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
            ) : paymentReady &&
              clientSecret &&
              stripeAccountId &&
              paymentIntentId &&
              stripePromise ? (
              <View className="min-h-[280px]">
                <Elements
                  key={`${stripeAccountId}:${paymentIntentId}`}
                  stripe={stripePromise}
                  options={{ clientSecret }}
                >
                  <PaymentForm
                    campaignId={campaignId}
                    campaignTitle={campaignTitle}
                    selectedAmount={selectedAmount}
                    paymentIntentId={paymentIntentId}
                    feeTotalLabel={feeTotalLabel}
                    onClose={onClose}
                    onSuccess={onSuccess}
                    onPaymentCompleted={() => {
                      paymentCompletedRef.current = true;
                      activePaymentIntentIdRef.current = null;
                    }}
                  />
                </Elements>
              </View>
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
