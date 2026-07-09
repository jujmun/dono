import { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { type Href, Link, useRouter } from "expo-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { usePostHog } from "posthog-react-native";
import { AppShell } from "@/components/app-shell";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { signInSchema } from "@/lib/validation/auth";
import { api } from "@convex/_generated/api";

const hasPostHog = Boolean(process.env.EXPO_PUBLIC_POSTHOG_API_KEY);

type SignInFormProps = {
  onSuccess?: (email: string, step: "signIn" | "signUp") => void;
};

function SignInForm({ onSuccess }: SignInFormProps) {
  const { signIn } = useAuthActions();
  const assertAllowed = useMutation(api.security.assertAllowed);
  const recordAttempt = useMutation(api.security.record);
  const router = useRouter();
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();
  const isSignUp = step === "signUp";
  const passwordChecks = useMemo(
    () => [
      {
        label: "At least 10 characters",
        ok: password.length >= 10,
      },
      {
        label: "One uppercase and one lowercase letter",
        ok: /[A-Z]/.test(password) && /[a-z]/.test(password),
      },
      {
        label: "One number and one symbol",
        ok: /\d/.test(password) && /[^A-Za-z0-9]/.test(password),
      },
    ],
    [password],
  );
  const canSubmit =
    normalizedEmail.length > 0 &&
    password.length > 0 &&
    (!isSignUp || passwordChecks.every((check) => check.ok));

  const handleSubmit = () => {
    const parsed = signInSchema.safeParse({
      email: normalizedEmail,
      password,
      flow: step,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your input.");
      return;
    }
    setError(null);
    setLoading(true);
    const formData = new FormData();
    formData.append("email", parsed.data.email.toLowerCase());
    formData.append("password", password);
    formData.append("flow", parsed.data.flow);

    void assertAllowed({ flow: parsed.data.flow, email: normalizedEmail })
      .then(() => signIn("password", formData))
      .then((result) => {
        onSuccess?.(parsed.data.email, parsed.data.flow);
        void recordAttempt({
          flow: parsed.data.flow,
          email: normalizedEmail,
          success: true,
        });
        if (result.signingIn) {
          router.push("/dashboard");
          return;
        }
        router.push(`/verify-email?email=${encodeURIComponent(normalizedEmail)}` as Href);
      })
      .catch((err: Error) => {
        void recordAttempt({
          flow: parsed.data.flow,
          email: normalizedEmail,
          success: false,
        });
        setError(getFriendlyAuthError(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-md px-4 py-12">
        <View className="rounded-2xl border border-dono-border bg-white p-8">
          <View className="mb-8 items-center">
            <Text className="text-2xl font-bold text-dono-text">
              {step === "signIn" ? "Welcome back" : "Create your account"}
            </Text>
            <Text className="mt-1 text-sm text-dono-muted">
              {step === "signIn"
                ? "Sign in to track your impact and start campaigns"
                : "Join Dono to donate, follow communities, and launch campaigns"}
            </Text>
          </View>

          <View className="gap-4">
            <View>
              <Text className="mb-1.5 text-sm font-medium text-dono-text">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                placeholder="you@university.ac.uk"
                placeholderTextColor="#6b7c7a"
                className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
              />
              {isSignUp ? (
                <Text className="mt-1 text-xs text-dono-muted">
                  Use an email you can access right now for OTP verification.
                </Text>
              ) : null}
            </View>

            <View>
              <Text className="mb-1.5 text-sm font-medium text-dono-text">Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete={step === "signIn" ? "password" : "new-password"}
                placeholder={isSignUp ? "Create a strong password" : "Your password"}
                placeholderTextColor="#6b7c7a"
                className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
              />
            </View>

            {isSignUp ? (
              <View className="rounded-xl bg-dono-surface-muted px-4 py-3">
                <Text className="mb-1 text-xs font-semibold text-dono-text">
                  Password requirements
                </Text>
                {passwordChecks.map((check) => (
                  <Text
                    key={check.label}
                    className={`text-xs ${check.ok ? "text-emerald-700" : "text-dono-muted"}`}
                  >
                    • {check.label}
                  </Text>
                ))}
              </View>
            ) : null}

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
              <Text className="text-sm font-semibold text-white">
                {loading
                  ? "Please wait..."
                  : step === "signIn"
                    ? "Sign in"
                    : "Create account"}
              </Text>
            </Pressable>
            {isSignUp ? (
              <Text className="text-center text-xs text-dono-muted">
                We&apos;ll send a one-time verification code to your email.
              </Text>
            ) : null}
          </View>

          <Pressable
            onPress={() => {
              setError(null);
              setStep(step === "signIn" ? "signUp" : "signIn");
            }}
            className="mt-4 items-center"
          >
            <Text className="text-sm text-dono-muted">
              {step === "signIn"
                ? "Need an account? Sign up"
                : "Already have an account? Sign in"}
            </Text>
          </Pressable>

          <View className="mt-3 flex-row items-center justify-between">
            <Link href={"/forgot-password" as Href} asChild>
              <Pressable>
                <Text className="text-sm text-dono-primary">Forgot password?</Text>
              </Pressable>
            </Link>
            <Link href={"/verify-email" as Href} asChild>
              <Pressable>
                <Text className="text-sm text-dono-primary">Verify email</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </AppShell>
  );
}

function SignInWithPostHog() {
  const posthog = usePostHog();
  return (
    <SignInForm
      onSuccess={(email, step) => {
        posthog?.identify(email, { email });
        posthog?.capture(step === "signIn" ? "user_signed_in" : "user_signed_up");
      }}
    />
  );
}

export default function SignInPage() {
  if (hasPostHog) {
    return <SignInWithPostHog />;
  }
  return <SignInForm />;
}
