import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { type Href, useRouter } from "expo-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { usePostHog } from "posthog-react-native";
import { AppShell } from "@/components/app-shell";
import { RetroPanel } from "@/components/retro";
import {
  getAuthProviderId,
  type AuthProviderId,
} from "@/lib/auth/admin";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { requestOtpSchema } from "@/lib/validation/auth";

const hasPostHog = Boolean(process.env.EXPO_PUBLIC_POSTHOG_API_KEY);

/** Must match server ADMIN_BYPASS_EMAIL. Only used in __DEV__ with public flag. */
const ADMIN_BYPASS_EMAIL = "admin@ox.ac.uk";
const ADMIN_BYPASS_OTP = "000000";
const adminOtpBypassEnabled =
  typeof __DEV__ !== "undefined" &&
  __DEV__ &&
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

function verifyHref(email: string, provider: AuthProviderId): Href {
  const params = new URLSearchParams({ email });
  if (provider === "admin-email") {
    params.set("provider", provider);
  }
  return `/verify-email?${params.toString()}` as Href;
}

function OtpRequestFormInner({
  flow,
  title,
  subtitle,
  submitLabel,
  footer,
  onSuccess,
}: OtpRequestFormProps) {
  const { signIn } = useAuthActions();
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
    // Bypass always uses resend; outreach portal uses admin-email when configured.
    const provider = useAdminBypass ? "resend" : getAuthProviderId(emailValue);

    void (async () => {
      try {
        // Rate limits are enforced server-side in sendVerificationRequest.
        await signIn(provider, formData);
        onSuccess?.(parsed.data.email);

        if (useAdminBypass) {
          const verifyData = new FormData();
          verifyData.append("email", emailValue);
          verifyData.append("code", ADMIN_BYPASS_OTP);
          verifyData.append("flow", "email-verification");
          await signIn("resend", verifyData);
          router.replace("/dashboard");
          return;
        }

        router.push(verifyHref(emailValue, provider));
      } catch (err) {
        setError(getFriendlyAuthError(err as Error));
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-md">
        <RetroPanel title="AUTH.exe" accent="mint">
          <View className="mb-6 items-center">
            <Text className="font-retro-bold text-2xl text-retro-ink">{title}</Text>
            <Text className="mt-1 text-sm text-dono-muted">{subtitle}</Text>
          </View>

          <View className="gap-4">
            <View>
              <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                placeholder="you@st-annes.ox.ac.uk"
                placeholderTextColor="#8a8478"
                className="w-full rounded-lg border-2 border-retro-ink bg-white px-4 py-2.5 font-retro-mono text-sm text-retro-ink outline-none"
                {...({ "ph-no-capture": true } as object)}
              />
              <Text className="mt-1 text-xs text-dono-muted">
                Use your Oxford email address (ending in ox.ac.uk).
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
              className={`items-center rounded-full border-2 border-retro-ink bg-retro-mint py-3 shadow-[3px_3px_0_#211E1A] ${
                loading || !canSubmit ? "opacity-50" : ""
              }`}
            >
              <Text className="font-retro-bold text-sm text-retro-paper">
                {loading ? "Please wait..." : submitLabel}
              </Text>
            </Pressable>
            <Text className="text-center text-xs text-dono-muted">
              We&apos;ll send a 6-digit one-time code to your email.
            </Text>
          </View>

          {footer}
        </RetroPanel>
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
