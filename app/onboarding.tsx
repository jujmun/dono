import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { AppShell } from "@/components/app-shell";
import { useCurrentProfile, useUpdateProfile } from "@/lib/auth/hooks";
import { updateProfileSchema } from "@/lib/validation/auth";
import { getFriendlyAuthError } from "@/lib/auth/errors";

export default function OnboardingPage() {
  const router = useRouter();
  const profile = useCurrentProfile();
  const updateProfile = useUpdateProfile();
  const [name, setName] = useState(profile?.name ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeOnboarding = () => {
    const parsed = updateProfileSchema.safeParse({ name });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }

    setLoading(true);
    setError(null);
    void updateProfile({
      name: parsed.data.name,
    })
      .then(() => router.replace("/dashboard"))
      .catch((err) => setError(getFriendlyAuthError(err)))
      .finally(() => setLoading(false));
  };

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-md px-4 py-12">
        <View className="rounded-2xl border border-dono-border bg-white p-8">
          <Text className="font-display-medium text-2xl text-dono-text">Finish onboarding</Text>
          <Text className="mt-1 text-sm text-dono-muted">
            Tell us your name to complete your account setup.
          </Text>

          <View className="mt-6 gap-4">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              placeholderTextColor="#56615A"
              className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
            />

            {error ? (
              <View className="rounded-xl bg-rose-50 px-4 py-3">
                <Text className="text-sm text-rose-700">{error}</Text>
              </View>
            ) : null}

            <Pressable
              onPress={completeOnboarding}
              disabled={loading}
              className={`items-center rounded-full bg-dono-primary py-3 ${
                loading ? "opacity-50" : ""
              }`}
            >
              <Text className="font-sans-medium text-sm text-white">
                {loading ? "Saving..." : "Complete setup"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </AppShell>
  );
}
