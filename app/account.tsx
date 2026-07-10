import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { AppShell } from "@/components/app-shell";
import { useCurrentProfile, useUpdateProfile } from "@/lib/auth/hooks";
import { updateProfileSchema } from "@/lib/validation/auth";
import { getFriendlyAuthError } from "@/lib/auth/errors";

export default function AccountPage() {
  const profile = useCurrentProfile();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name ?? "");
    setAvatarUrl(profile.avatarUrl ?? "");
  }, [profile]);

  const saveProfile = () => {
    const parsed = updateProfileSchema.safeParse({ name, avatarUrl });
    if (!parsed.success) {
      setProfileError(parsed.error.issues[0]?.message ?? "Invalid profile.");
      return;
    }
    setSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);
    void updateProfile({
      name: parsed.data.name,
      avatarUrl: parsed.data.avatarUrl || undefined,
    })
      .then(() => setProfileSuccess("Profile updated."))
      .catch((err) => setProfileError(getFriendlyAuthError(err)))
      .finally(() => setSavingProfile(false));
  };

  if (profile === undefined) {
    return (
      <AppShell>
        <View className="mx-auto w-full max-w-xl px-4 py-8">
          <Text className="text-dono-muted">Loading account...</Text>
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-xl gap-6 px-4 py-8">
        <View className="rounded-2xl border border-dono-border bg-white p-6">
          <Text className="font-display-medium text-xl text-dono-text">Account Settings</Text>
          <Text className="mt-1 text-sm text-dono-muted">
            {profile?.email ?? "Signed in account"}
          </Text>
        </View>

        <View className="rounded-2xl border border-dono-border bg-white p-6">
          <Text className="text-lg font-sans-medium text-dono-text">Profile</Text>
          <View className="mt-4 gap-3">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#5e6473"
              className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
            />
            <TextInput
              value={avatarUrl}
              onChangeText={setAvatarUrl}
              autoCapitalize="none"
              placeholder="Avatar URL (optional)"
              placeholderTextColor="#5e6473"
              className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
            />
            {profileError ? (
              <Text className="text-sm text-rose-700">{profileError}</Text>
            ) : null}
            {profileSuccess ? (
              <Text className="text-sm text-green-700">{profileSuccess}</Text>
            ) : null}
            <Pressable
              onPress={saveProfile}
              disabled={savingProfile}
              className={`items-center rounded-full bg-dono-primary py-3 ${
                savingProfile ? "opacity-50" : ""
              }`}
            >
              <Text className="font-sans-medium text-sm text-white">
                {savingProfile ? "Saving..." : "Save profile"}
              </Text>
            </Pressable>
          </View>
        </View>

      </View>
    </AppShell>
  );
}
