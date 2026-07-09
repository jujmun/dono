import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { AppShell } from "@/components/app-shell";
import { verifyEmailSchema } from "@/lib/validation/auth";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { api } from "@convex/_generated/api";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const assertAllowed = useMutation(api.security.assertAllowed);
  const recordAttempt = useMutation(api.security.record);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    const parsed = verifyEmailSchema.safeParse({ email, code });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input.");
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("email", parsed.data.email.toLowerCase());
    formData.append("code", parsed.data.code.trim());
    formData.append("flow", "email-verification");

    void assertAllowed({ flow: "email-verification", email: parsed.data.email })
      .then(() => signIn("password", formData))
      .then(() => router.replace("/dashboard"))
      .then(() =>
        recordAttempt({
          flow: "email-verification",
          email: parsed.data.email,
          success: true,
        }),
      )
      .catch((err) => {
        void recordAttempt({
          flow: "email-verification",
          email: parsed.data.email,
          success: false,
        });
        setError(getFriendlyAuthError(err));
      })
      .finally(() => setLoading(false));
  };

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-md px-4 py-12">
        <View className="rounded-2xl border border-dono-border bg-white p-8">
          <Text className="text-2xl font-bold text-dono-text">Verify Email</Text>
          <Text className="mt-1 text-sm text-dono-muted">
            Enter the verification code sent to your inbox.
          </Text>

          <View className="mt-6 gap-4">
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@university.ac.uk"
              placeholderTextColor="#6b7c7a"
              className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
            />
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="6-digit code"
              placeholderTextColor="#6b7c7a"
              className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
            />

            {error ? (
              <View className="rounded-xl bg-rose-50 px-4 py-3">
                <Text className="text-sm text-rose-700">{error}</Text>
              </View>
            ) : null}

            <Pressable
              onPress={onSubmit}
              disabled={loading}
              className={`items-center rounded-full bg-dono-primary py-3 ${
                loading ? "opacity-50" : ""
              }`}
            >
              <Text className="text-sm font-semibold text-white">
                {loading ? "Verifying..." : "Verify email"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </AppShell>
  );
}
