import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { AppShell } from "@/components/app-shell";
import { verifyEmailSchema, requestOtpSchema } from "@/lib/validation/auth";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { api } from "@convex/_generated/api";

const RESEND_COOLDOWN_SECONDS = 30;
const FIXED_BYPASS_OTP = "000000";
const ADMIN_BYPASS_EMAIL = "admin@ox.ac.uk";
const adminOtpBypassEnabled =
  process.env.EXPO_PUBLIC_AUTH_ADMIN_OTP_BYPASS === "true";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const defaultEmail = useMemo(
    () => (typeof params.email === "string" ? params.email : ""),
    [params.email],
  );
  const { signIn } = useAuthActions();
  const assertAllowed = useMutation(api.security.assertAllowed);
  const recordAttempt = useMutation(api.security.record);
  const keepNewestFixedOtpCode = useMutation(
    api.fixedOtpCleanup.keepNewestFixedOtpCode,
  );
  const clearFixedOtpCodes = useMutation(api.fixedOtpCleanup.clearFixedOtpCodes);
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
    const formData = new FormData();
    formData.append("email", parsed.data.email.toLowerCase());
    formData.append("code", parsed.data.code.trim());
    formData.append("flow", "email-verification");
    const normalizedSubmitEmail = parsed.data.email.toLowerCase();
    const isAdminBypassVerify =
      adminOtpBypassEnabled &&
      normalizedSubmitEmail === ADMIN_BYPASS_EMAIL &&
      parsed.data.code.trim() === FIXED_BYPASS_OTP;

    void (async () => {
      try {
        if (isAdminBypassVerify) {
          await keepNewestFixedOtpCode({});
        }
        await assertAllowed({
          flow: "email-verification",
          email: parsed.data.email,
        });
        await signIn("resend", formData);
        router.replace("/dashboard");
        await recordAttempt({
          flow: "email-verification",
          email: parsed.data.email,
          success: true,
        });
      } catch (err) {
        void recordAttempt({
          flow: "email-verification",
          email: parsed.data.email,
          success: false,
        });
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
    const formData = new FormData();
    formData.append("email", normalizedEmail);

    const maybeClear =
      adminOtpBypassEnabled && normalizedEmail === ADMIN_BYPASS_EMAIL
        ? clearFixedOtpCodes({})
        : Promise.resolve(null);

    void maybeClear
      .then(() => assertAllowed({ flow: "signIn", email: normalizedEmail }))
      .then(() => signIn("resend", formData))
      .then(() => {
        void recordAttempt({
          flow: "signIn",
          email: normalizedEmail,
          success: true,
        });
        setInfo("A new code is on its way to your inbox.");
        setCooldown(RESEND_COOLDOWN_SECONDS);
      })
      .catch((err) => {
        void recordAttempt({
          flow: "signIn",
          email: normalizedEmail,
          success: false,
        });
        setError(getFriendlyAuthError(err));
      })
      .finally(() => setResending(false));
  };

  const resendDisabled = resending || cooldown > 0;

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-md px-4 py-12">
        <View className="rounded-2xl border border-dono-border bg-white p-8">
          <Text className="font-display-medium text-2xl text-dono-text">Verify Email</Text>
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
              placeholderTextColor="#5e6473"
              className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
            />
            <TextInput
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              autoComplete="one-time-code"
              placeholder="6-digit code"
              placeholderTextColor="#5e6473"
              className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
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
              <Text className="font-sans-medium text-sm text-white">
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
