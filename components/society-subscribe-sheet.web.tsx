import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Link } from "expo-router";
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
import { LegalAcceptanceCheckbox } from "@/components/legal-acceptance-checkbox";
import {
  SOCIETY_SUBSCRIBE_PRESET_AMOUNTS,
  type SocietySubscribeSheetProps,
} from "./society-subscribe-sheet-types";

const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

function getStripePromise(stripeAccountId: string | null) {
  if (!publishableKey || !stripeAccountId) {
    return null;
  }
  return loadStripe(publishableKey, { stripeAccount: stripeAccountId });
}

function PaymentForm({
  communitySlug,
  societyName,
  amount,
  onClose,
  onSuccess,
}: {
  communitySlug: string;
  societyName: string;
  amount: number;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const posthog = usePostHog();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      posthog?.capture("society_subscription_started", {
        community_slug: communitySlug,
        society_name: societyName,
        amount,
      });

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/societies/${communitySlug}`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        throw new Error(result.error.message ?? "Payment failed.");
      }

      posthog?.capture("society_subscription_completed", {
        community_slug: communitySlug,
        society_name: societyName,
        amount,
      });

      onSuccess(amount);
      onClose();
    } catch (err) {
      setError(getFriendlyPaymentError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mt-4 flex-1">
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
          onPress={() => void handleSubscribe()}
          disabled={loading || !stripe || !elements}
          className="flex-row items-center justify-center rounded-full bg-dono-accent py-3"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-retro-bold text-sm text-white">
              Subscribe £{amount}/month
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export function SocietySubscribeSheet({
  visible,
  communitySlug,
  societyName,
  isAuthenticated,
  legalAccepted,
  onLegalAcceptedChange,
  onClose,
  onSuccess,
}: SocietySubscribeSheetProps) {
  const createSocietySubscription = useAction(api.stripe.createSocietySubscription);
  const acceptDocuments = useMutation(api.legal.acceptDocuments);
  const [selectedAmount, setSelectedAmount] = useState<number>(
    SOCIETY_SUBSCRIBE_PRESET_AMOUNTS[1],
  );
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const stripeConfigured = Boolean(publishableKey);

  useEffect(() => {
    if (!visible) {
      setSelectedAmount(SOCIETY_SUBSCRIBE_PRESET_AMOUNTS[1]);
      setClientSecret(null);
      setSubscriptionId(null);
      setStripeAccountId(null);
      setError(null);
      setLoading(false);
      return;
    }

    if (!isAuthenticated || !legalAccepted || !stripeConfigured) {
      setClientSecret(null);
      setSubscriptionId(null);
      setStripeAccountId(null);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    const createSubscription = async () => {
      await acceptDocuments({ context: "donate" });
      return createSocietySubscription({ communitySlug, amount: selectedAmount });
    };

    void createSubscription()
      .then((result) => {
        if (requestIdRef.current !== requestId) return;
        setClientSecret(result.clientSecret);
        setSubscriptionId(result.subscriptionId);
        setStripeAccountId(result.stripeAccountId);
      })
      .catch((err) => {
        if (requestIdRef.current !== requestId) return;
        setError(getFriendlyPaymentError(err));
        setClientSecret(null);
        setSubscriptionId(null);
        setStripeAccountId(null);
      })
      .finally(() => {
        if (requestIdRef.current === requestId) {
          setLoading(false);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [visible, communitySlug, selectedAmount, isAuthenticated, legalAccepted, stripeConfigured]);

  const paymentReady = Boolean(clientSecret && subscriptionId && stripeAccountId);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[92%] rounded-t-3xl bg-white px-6 pb-6 pt-6">
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <Text className="font-retro-bold text-xl text-dono-text">
              Subscribe to {societyName}
            </Text>
            <Text className="mt-1 text-sm text-dono-muted">
              A monthly gift, automatically split across their active campaigns.
            </Text>

            {!isAuthenticated ? (
              <View className="mt-6">
                <Text className="text-sm text-dono-muted">
                  Society subscriptions need an account so you can manage your subscription.
                </Text>
                <Link href="/signin" asChild>
                  <Pressable className="retro-key mt-4 items-center rounded-full bg-dono-primary py-3">
                    <Text className="font-retro-bold text-sm text-white">
                      Sign in to continue
                    </Text>
                  </Pressable>
                </Link>
              </View>
            ) : (
              <>
                <View className="mt-5 flex-row gap-2">
                  {SOCIETY_SUBSCRIBE_PRESET_AMOUNTS.map((amount) => {
                    const on = selectedAmount === amount;
                    return (
                      <Pressable
                        key={amount}
                        onPress={() => setSelectedAmount(amount)}
                        className={`flex-1 items-center rounded-xl border py-3 ${
                          on
                            ? "border-dono-primary bg-dono-primary/10"
                            : "border-dono-border bg-white"
                        }`}
                      >
                        <Text
                          className={`font-retro-bold text-sm ${
                            on ? "text-dono-primary" : "text-dono-text"
                          }`}
                        >
                          £{amount}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Text className="mt-3 text-xs leading-relaxed text-dono-muted">
                  Charged monthly until you cancel. Stripe processing fees apply
                  normally. Not Gift Aid.
                </Text>

                <View className="mt-4">
                  <LegalAcceptanceCheckbox
                    context="donate"
                    accepted={legalAccepted}
                    onAcceptedChange={onLegalAcceptedChange}
                  />
                </View>

                {!stripeConfigured ? (
                  <Text className="mt-6 text-sm text-red-600">
                    Stripe is not configured for this environment.
                  </Text>
                ) : !legalAccepted ? (
                  <Text className="mt-6 text-sm text-dono-muted">
                    Accept the terms above to continue to payment.
                  </Text>
                ) : loading ? (
                  <View className="mt-8 items-center py-6">
                    <ActivityIndicator color="#17211B" />
                    <Text className="mt-3 text-sm text-dono-muted">
                      Preparing subscription…
                    </Text>
                  </View>
                ) : error ? (
                  <Text className="mt-6 text-sm text-red-600">{error}</Text>
                ) : paymentReady && clientSecret && stripeAccountId && subscriptionId ? (
                  <View className="min-h-[280px]">
                    <Elements
                      key={`${stripeAccountId}:${subscriptionId}`}
                      stripe={getStripePromise(stripeAccountId)}
                      options={{ clientSecret }}
                    >
                      <PaymentForm
                        communitySlug={communitySlug}
                        societyName={societyName}
                        amount={selectedAmount}
                        onClose={onClose}
                        onSuccess={onSuccess}
                      />
                    </Elements>
                  </View>
                ) : null}
              </>
            )}
          </ScrollView>

          <Pressable onPress={onClose} className="mt-2 items-center py-2">
            <Text className="text-sm text-dono-muted">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
