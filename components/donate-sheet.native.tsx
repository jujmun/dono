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
  ReceiptDivider,
  ReceiptLedger,
  ReceiptLineRow,
  ReceiptTotalRow,
} from "@/components/ui/receipt-lines";
import {
  getOrCreateDonateGuestKey,
  type DonateSheetProps,
} from "./donate-sheet-types";

const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

function ConnectedPaymentForm({
  campaignId,
  campaignTitle,
  selectedAmount,
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
        donation_type: "one_time",
      });

      const presentResult = await presentPaymentSheet();
      if (presentResult.error) {
        if (presentResult.error.code === "Canceled") {
          await abandonPaymentIntent({
            paymentIntentId,
            donorEmail: donorEmail.trim() || undefined,
          });
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
      {error ? <Text className="mb-3 text-sm text-red-600">{error}</Text> : null}
      <Pressable
        onPress={() => void handleDonate()}
        disabled={loading || !sheetReady}
        className="flex-row items-center justify-center rounded-full bg-dono-accent py-3"
      >
        {loading || !sheetReady ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="font-retro-bold text-sm text-white">Pay {feeTotalLabel}</Text>
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
  isAuthenticated,
  donorEmail,
  onDonorEmailChange,
  coverFees,
  onCoverFeesChange,
  isAnonymous,
  onAnonymousChange,
  legalAccepted,
  onLegalAcceptedChange,
  onClose,
  onSuccess,
}: DonateSheetProps) {
  const createPaymentIntent = useAction(api.stripe.createPaymentIntent);
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

  const feeBreakdown = calculateDonationFeeBreakdown(selectedAmount, coverFees);
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
      return;
    }

    if (!legalAccepted || !stripeConfigured) {
      setClientSecret(null);
      setPaymentIntentId(null);
      setStripeAccountId(null);
      setLoading(false);
      if (!legalAccepted) {
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
        coverFees,
        ageAttested: true,
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
    coverFees,
    isAnonymous,
    legalAccepted,
    stripeConfigured,
    isAuthenticated,
    createPaymentIntent,
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
            </Text>
            <Text className="mt-1 text-sm text-dono-muted">One-time donation</Text>

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
                  Cover fees so the full £{selectedAmount} reaches the campaign
                </Text>
              </Pressable>

              <Pressable
                onPress={() => onAnonymousChange(!isAnonymous)}
                className="flex-row items-center gap-2 py-1"
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isAnonymous }}
              >
                <View
                  className={`h-4 w-4 items-center justify-center rounded border ${
                    isAnonymous
                      ? "border-dono-primary bg-dono-primary"
                      : "border-dono-border bg-white"
                  }`}
                >
                  {isAnonymous ? (
                    <Text className="text-[9px] font-bold leading-none text-white">✓</Text>
                  ) : null}
                </View>
                <Text className="min-w-0 flex-1 text-sm text-dono-text">
                  Hide my name (your amount still shows publicly; your name is hidden
                  from the public and from the campaign owner)
                </Text>
              </Pressable>

              <LegalAcceptanceCheckbox
                context="donate"
                accepted={legalAccepted}
                onAcceptedChange={onLegalAcceptedChange}
              />
            </View>

            <ReceiptLedger className="mt-4">
              <ReceiptLineRow
                label="Your donation"
                amount={formatMinorGbp(feeBreakdown.intendedCampaignAmountMinor)}
              />
              <ReceiptLineRow
                label="Dono platform fee"
                amount={formatMinorGbp(feeBreakdown.platformFeeMinor)}
                muted
              />
              <ReceiptLineRow
                label="Estimated payment processing fee"
                amount={formatMinorGbp(feeBreakdown.estimatedStripeFeeMinor)}
                muted
              />
              <ReceiptDivider />
              <ReceiptTotalRow label="Total charged" amount={feeTotalLabel} />
              <ReceiptLineRow
                label="Amount reaching the campaign"
                amount={formatMinorGbp(feeBreakdown.amountToCampaignMinor)}
                emphasis
              />
            </ReceiptLedger>

            <Text className="mt-3 text-xs leading-relaxed text-dono-muted">
              Not Gift Aid. Dono does not issue charitable tax receipts.
            </Text>

            {!stripeConfigured ? (
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
