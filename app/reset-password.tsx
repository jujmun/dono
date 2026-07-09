import { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { AppShell } from "@/components/app-shell";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { resetPasswordSchema } from "@/lib/validation/auth";
import { api } from "@convex/_generated/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const defaultEmail = useMemo(
    () => (typeof params.email === "string" ? params.email : ""),
    [params.email],
  );
  const { signIn } = useAuthActions();
  const assertAllowed = useMutation(api.security.assertAllowed);
  const recordAttempt = useMutation(api.security.record);

  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetPassword = () => {
    const parsed = resetPasswordSchema.safeParse({ email, code, newPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input.");
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("email", parsed.data.email.toLowerCase());
    formData.append("code", parsed.data.code.trim());
    formData.append("newPassword", parsed.data.newPassword);
    formData.append("flow", "reset-verification");

    void assertAllowed({ flow: "reset-verification", email: parsed.data.email })
      .then(() => signIn("password", formData))
      .then(() => router.replace("/signin"))
      .then(() =>
        recordAttempt({
          flow: "reset-verification",
          email: parsed.data.email,
          success: true,
        }),
      )
      .catch((err) => {
        void recordAttempt({
          flow: "reset-verification",
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
          <Text className="text-2xl font-bold text-dono-text">
            Enter Reset Code
          </Text>
          <Text className="mt-1 text-sm text-dono-muted">
            Use the email code and set your new password.
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
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="New strong password"
              placeholderTextColor="#6b7c7a"
              className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
            />

            {error ? (
              <View className="rounded-xl bg-rose-50 px-4 py-3">
                <Text className="text-sm text-rose-700">{error}</Text>
              </View>
            ) : null}

            <Pressable
              onPress={resetPassword}
              disabled={loading}
              className={`items-center rounded-full bg-dono-primary py-3 ${
                loading ? "opacity-50" : ""
              }`}
            >
              <Text className="text-sm font-semibold text-white">
                {loading ? "Resetting..." : "Reset password"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </AppShell>
  );
}
