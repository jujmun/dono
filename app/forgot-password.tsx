import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { type Href, useRouter } from "expo-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { AppShell } from "@/components/app-shell";
import { resetRequestSchema } from "@/lib/validation/auth";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { api } from "@convex/_generated/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const assertAllowed = useMutation(api.security.assertAllowed);
  const recordAttempt = useMutation(api.security.record);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const requestReset = () => {
    const parsed = resetRequestSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email.");
      return;
    }
    setError(null);
    setLoading(true);
    const formData = new FormData();
    formData.append("email", parsed.data.email.toLowerCase());
    formData.append("flow", "reset");

    void assertAllowed({ flow: "reset", email: parsed.data.email })
      .then(() => signIn("password", formData))
      .then(() => {
        void recordAttempt({
          flow: "reset",
          email: parsed.data.email,
          success: true,
        });
        setSent(true);
      })
      .catch((err) => {
        void recordAttempt({
          flow: "reset",
          email: parsed.data.email,
          success: false,
        });
        if (String(err).toLowerCase().includes("rate")) {
          setError(getFriendlyAuthError(err));
          return;
        }
        // Keep response neutral to prevent account enumeration.
        setSent(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-md px-4 py-12">
        <View className="rounded-2xl border border-dono-border bg-white p-8">
          <Text className="text-2xl font-bold text-dono-text">Reset Password</Text>
          <Text className="mt-1 text-sm text-dono-muted">
            We&apos;ll send a reset code to your email.
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

            {error ? (
              <View className="rounded-xl bg-rose-50 px-4 py-3">
                <Text className="text-sm text-rose-700">{error}</Text>
              </View>
            ) : null}

            {sent ? (
              <View className="rounded-xl bg-emerald-50 px-4 py-3">
                <Text className="text-sm text-emerald-700">
                  If an account exists, a reset code has been sent. Use it on the next
                  screen.
                </Text>
              </View>
            ) : null}

            <Pressable
              onPress={requestReset}
              disabled={loading}
              className={`items-center rounded-full bg-dono-primary py-3 ${
                loading ? "opacity-50" : ""
              }`}
            >
              <Text className="text-sm font-semibold text-white">
                {loading ? "Sending..." : "Send reset code"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                router.push(
                  `/reset-password?email=${encodeURIComponent(email)}` as Href,
                )
              }
              className="items-center"
            >
              <Text className="text-sm text-dono-primary">I already have a code</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </AppShell>
  );
}
