import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { AppShell } from "@/components/app-shell";
import {
  getAuthProviderId,
  type AuthProviderId,
} from "@/lib/auth/admin";
import { verifyEmailSchema, requestOtpSchema } from "@/lib/validation/auth";
import { getFriendlyAuthError } from "@/lib/auth/errors";

const RESEND_COOLDOWN_SECONDS = 30;

function resolveProvider(
  email: string,
  param: string | undefined,
): AuthProviderId {
  if (param === "admin-email" || param === "resend") {
    return param;
  }
  return getAuthProviderId(email);
}

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; provider?: string }>();
  const defaultEmail = useMemo(
    () => (typeof params.email === "string" ? params.email : ""),
    [params.email],
  );
  const providerParam =
    typeof params.provider === "string" ? params.provider : undefined;
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const onSubmit = () => {
    const parsed = verifyEmailSchema.safeParse({ email, code });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input.");
      return;
    }

    setLoading(true);
    setError(null);
    setInfo(null);
    const normalizedEmail = parsed.data.email.toLowerCase();
    const provider = resolveProvider(normalizedEmail, providerParam);
    const formData = new FormData();
    formData.append("email", normalizedEmail);
    formData.append("code", parsed.data.code.trim());
    formData.append("flow", "email-verification");

    void (async () => {
      try {
        await signIn(provider, formData);
        router.replace(provider === "admin-email" ? "/admin" : "/dashboard");
      } catch (err) {
        setError(getFriendlyAuthError(err));
      } finally {
        setLoading(false);
      }
    })();
  };

  const onResend = () => {
    const parsed = requestOtpSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid email first.");
      return;
    }

    setResending(true);
    setError(null);
    setInfo(null);
    const normalizedEmail = parsed.data.email.toLowerCase();
    const provider = resolveProvider(normalizedEmail, providerParam);
    const formData = new FormData();
    formData.append("email", normalizedEmail);

    void signIn(provider, formData)
      .then(() => {
        setInfo("A new code is on its way to your inbox.");
        setCooldown(RESEND_COOLDOWN_SECONDS);
      })
      .catch((err) => {
        setError(getFriendlyAuthError(err));
      })
      .finally(() => setResending(false));
  };

  const resendDisabled = resending || cooldown > 0;

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-md px-4 py-12">
        <View className="rounded-2xl border border-dono-border bg-white p-8">
          <Text className="font-retro-bold text-2xl text-dono-text">Verify Email</Text>
          <Text className="mt-1 text-sm text-dono-muted">
            Enter the 6-digit code sent to your inbox.
          </Text>

          <View className="mt-6 gap-4">
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholder="you@st-annes.ox.ac.uk"
              placeholderTextColor="#56615A"
              className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
              {...({ "ph-no-capture": true } as object)}
            />
            <TextInput
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              autoComplete="one-time-code"
              placeholder="6-digit code"
              placeholderTextColor="#56615A"
              className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
              {...({ "ph-no-capture": true } as object)}
            />

            {error ? (
              <View className="rounded-xl bg-rose-50 px-4 py-3">
                <Text className="text-sm text-rose-700">{error}</Text>
              </View>
            ) : null}

            {info ? (
              <View className="rounded-xl bg-green-50 px-4 py-3">
                <Text className="text-sm text-green-700">{info}</Text>
              </View>
            ) : null}

            <Pressable
              onPress={onSubmit}
              disabled={loading}
              className={`items-center rounded-full bg-dono-primary py-3 ${
                loading ? "opacity-50" : ""
              }`}
            >
              <Text className="font-retro-bold text-sm text-white">
                {loading ? "Verifying..." : "Verify email"}
              </Text>
            </Pressable>

            <Pressable
              onPress={onResend}
              disabled={resendDisabled}
              className={`items-center ${resendDisabled ? "opacity-50" : ""}`}
            >
              <Text className="text-sm text-dono-primary">
                {resending
                  ? "Sending..."
                  : cooldown > 0
                    ? `Resend code in ${cooldown}s`
                    : "Resend code"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </AppShell>
  );
}
