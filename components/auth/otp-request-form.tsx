import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { type Href, useRouter } from "expo-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { usePostHog } from "posthog-react-native";
import { AppShell } from "@/components/app-shell";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { requestOtpSchema } from "@/lib/validation/auth";
import { api } from "@convex/_generated/api";

const hasPostHog = Boolean(process.env.EXPO_PUBLIC_POSTHOG_API_KEY);

/** Must match server ADMIN_BYPASS_EMAIL. Only used when EXPO_PUBLIC_AUTH_ADMIN_OTP_BYPASS=true. */
const ADMIN_BYPASS_EMAIL = "admin@ox.ac.uk";
const ADMIN_BYPASS_OTP = "000000";
const adminOtpBypassEnabled =
  process.env.EXPO_PUBLIC_AUTH_ADMIN_OTP_BYPASS === "true";

export type OtpRequestFlow = "signIn" | "signUp";

type OtpRequestFormProps = {
  flow: OtpRequestFlow;
  title: string;
  subtitle: string;
  submitLabel: string;
  footer?: React.ReactNode;
  onSuccess?: (email: string) => void;
};

function OtpRequestFormInner({
  flow,
  title,
  subtitle,
  submitLabel,
  footer,
  onSuccess,
}: OtpRequestFormProps) {
  const { signIn } = useAuthActions();
  const assertAllowed = useMutation(api.security.assertAllowed);
  const recordAttempt = useMutation(api.security.record);
  const clearFixedOtpCodes = useMutation(api.fixedOtpCleanup.clearFixedOtpCodes);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();
  const canSubmit = normalizedEmail.length > 0;

  const handleSubmit = () => {
    const parsed = requestOtpSchema.safeParse({ email: normalizedEmail });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your input.");
      return;
    }
    setError(null);
    setLoading(true);
    const emailValue = parsed.data.email.toLowerCase();
    const formData = new FormData();
    formData.append("email", emailValue);

    const useAdminBypass =
      adminOtpBypassEnabled && emailValue === ADMIN_BYPASS_EMAIL;

    void (async () => {
      try {
        // Only the admin bypass path uses a fixed OTP hash; clear collisions
        // before issuing so verify's .unique() can succeed.
        if (useAdminBypass) {
          await clearFixedOtpCodes({});
        }
        await assertAllowed({ flow, email: emailValue });
        await signIn("resend", formData);
        onSuccess?.(parsed.data.email);
        void recordAttempt({ flow, email: emailValue, success: true });

        if (useAdminBypass) {
          const verifyData = new FormData();
          verifyData.append("email", emailValue);
          verifyData.append("code", ADMIN_BYPASS_OTP);
          verifyData.append("flow", "email-verification");
          await assertAllowed({
            flow: "email-verification",
            email: emailValue,
          });
          await signIn("resend", verifyData);
          void recordAttempt({
            flow: "email-verification",
            email: emailValue,
            success: true,
          });
          router.replace("/dashboard");
          return;
        }

        router.push(
          `/verify-email?email=${encodeURIComponent(emailValue)}` as Href,
        );
      } catch (err) {
        void recordAttempt({ flow, email: emailValue, success: false });
        setError(getFriendlyAuthError(err as Error));
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-md px-4 py-12">
        <View className="rounded-2xl border border-dono-border bg-white p-8">
          <View className="mb-8 items-center">
            <Text className="font-display-medium text-2xl text-dono-text">{title}</Text>
            <Text className="mt-1 text-sm text-dono-muted">{subtitle}</Text>
          </View>

          <View className="gap-4">
            <View>
              <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                placeholder="you@st-annes.ox.ac.uk"
                placeholderTextColor="#5e6473"
                className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
              />
              <Text className="mt-1 text-xs text-dono-muted">
                Only Oxford email addresses (ending in ox.ac.uk) are accepted.
              </Text>
            </View>

            {error && (
              <View className="rounded-xl bg-rose-50 px-4 py-3">
                <Text className="text-sm text-rose-700">{error}</Text>
              </View>
            )}

            <Pressable
              onPress={handleSubmit}
              disabled={loading || !canSubmit}
              className={`items-center rounded-full bg-dono-primary py-3 ${
                loading || !canSubmit ? "opacity-50" : ""
              }`}
            >
              <Text className="font-sans-medium text-sm text-white">
                {loading ? "Please wait..." : submitLabel}
              </Text>
            </Pressable>
            <Text className="text-center text-xs text-dono-muted">
              We&apos;ll send a 6-digit one-time code to your email.
            </Text>
          </View>

          {footer}
        </View>
      </View>
    </AppShell>
  );
}

function OtpRequestFormWithPostHog(props: OtpRequestFormProps) {
  const posthog = usePostHog();
  return (
    <OtpRequestFormInner
      {...props}
      onSuccess={(email) => {
        posthog?.capture(
          props.flow === "signIn" ? "user_signed_in" : "user_signed_up",
        );
        props.onSuccess?.(email);
      }}
    />
  );
}

export function OtpRequestForm(props: OtpRequestFormProps) {
  if (hasPostHog) {
    return <OtpRequestFormWithPostHog {...props} />;
  }
  return <OtpRequestFormInner {...props} />;
}
