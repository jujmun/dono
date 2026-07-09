import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useAction } from "convex/react";
import { AppShell } from "@/components/app-shell";
import { api } from "@convex/_generated/api";
import { useCurrentProfile, useUpdateProfile } from "@/lib/auth/hooks";
import { changePasswordSchema, updateProfileSchema } from "@/lib/validation/auth";
import { getFriendlyAuthError } from "@/lib/auth/errors";

export default function AccountPage() {
  const profile = useCurrentProfile();
  const updateProfile = useUpdateProfile();
  const changePassword = useAction(api.users.changePassword);

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

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

  const savePassword = () => {
    if (!profile) return;
    const parsed = changePasswordSchema.safeParse({
      email: profile.email,
      currentPassword,
      newPassword,
    });
    if (!parsed.success) {
      setPasswordError(parsed.error.issues[0]?.message ?? "Invalid password.");
      return;
    }

    setSavingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(null);
    void changePassword(parsed.data)
      .then(() => {
        setCurrentPassword("");
        setNewPassword("");
        setPasswordSuccess("Password updated.");
      })
      .catch((err) => setPasswordError(getFriendlyAuthError(err)))
      .finally(() => setSavingPassword(false));
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
          <Text className="text-xl font-bold text-dono-text">Account Settings</Text>
          <Text className="mt-1 text-sm text-dono-muted">
            {profile?.email ?? "Signed in account"}
          </Text>
        </View>

        <View className="rounded-2xl border border-dono-border bg-white p-6">
          <Text className="text-lg font-semibold text-dono-text">Profile</Text>
          <View className="mt-4 gap-3">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#6b7c7a"
              className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
            />
            <TextInput
              value={avatarUrl}
              onChangeText={setAvatarUrl}
              autoCapitalize="none"
              placeholder="Avatar URL (optional)"
              placeholderTextColor="#6b7c7a"
              className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
            />
            {profileError ? (
              <Text className="text-sm text-rose-700">{profileError}</Text>
            ) : null}
            {profileSuccess ? (
              <Text className="text-sm text-emerald-700">{profileSuccess}</Text>
            ) : null}
            <Pressable
              onPress={saveProfile}
              disabled={savingProfile}
              className={`items-center rounded-full bg-dono-primary py-3 ${
                savingProfile ? "opacity-50" : ""
              }`}
            >
              <Text className="text-sm font-semibold text-white">
                {savingProfile ? "Saving..." : "Save profile"}
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="rounded-2xl border border-dono-border bg-white p-6">
          <Text className="text-lg font-semibold text-dono-text">Change Password</Text>
          {profile ? (
            <View className="mt-4 gap-3">
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder="Current password"
                placeholderTextColor="#6b7c7a"
                className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
              />
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="New password"
                placeholderTextColor="#6b7c7a"
                className="w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
              />
              {passwordError ? (
                <Text className="text-sm text-rose-700">{passwordError}</Text>
              ) : null}
              {passwordSuccess ? (
                <Text className="text-sm text-emerald-700">{passwordSuccess}</Text>
              ) : null}
              <Pressable
                onPress={savePassword}
                disabled={savingPassword}
                className={`items-center rounded-full bg-dono-primary py-3 ${
                  savingPassword ? "opacity-50" : ""
                }`}
              >
                <Text className="text-sm font-semibold text-white">
                  {savingPassword ? "Updating..." : "Update password"}
                </Text>
              </Pressable>
            </View>
          ) : (
            <Text className="mt-4 text-sm text-dono-muted">
              Save your profile first, then you can update your password here.
            </Text>
          )}
        </View>
      </View>
    </AppShell>
  );
}
