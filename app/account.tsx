import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import { useAction, useConvexAuth, useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { AppShell } from "@/components/app-shell";
import { LoginGate } from "@/components/login-gate";
import { useCurrentProfile, useUpdateProfile } from "@/lib/auth/hooks";
import { updateProfileSchema } from "@/lib/validation/auth";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { getFriendlyPaymentError } from "@/lib/stripe/errors";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export default function AccountPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const profile = useCurrentProfile();
  const updateProfile = useUpdateProfile();
  const generateAvatarUploadUrl = useMutation(api.users.generateAvatarUploadUrl);
  const recurringDonations = useQuery(
    api.donations.listMyRecurringDonations,
    isAuthenticated ? {} : "skip",
  );
  const reviewMessages = useQuery(
    api.reviewMessages.listMine,
    isAuthenticated ? {} : "skip",
  );
  const cancelRecurringDonation = useAction(api.stripe.cancelRecurringDonation);

  const [name, setName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [cancelingId, setCancelingId] = useState<Id<"recurringDonations"> | null>(
    null,
  );
  const [recurringError, setRecurringError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name ?? "");
    setAvatarPreview(profile.avatarUrl ?? null);
  }, [profile]);

  const saveProfile = () => {
    const parsed = updateProfileSchema.safeParse({ name });
    if (!parsed.success) {
      setProfileError(parsed.error.issues[0]?.message ?? "Invalid profile.");
      return;
    }
    setSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);
    void updateProfile({
      name: parsed.data.name,
    })
      .then(() => setProfileSuccess("Profile updated."))
      .catch((err) => setProfileError(getFriendlyAuthError(err)))
      .finally(() => setSavingProfile(false));
  };

  const uploadAvatar = async () => {
    setProfileError(null);
    setProfileSuccess(null);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setProfileError("Photo library permission is required to upload a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      setProfileError("Avatar must be 5MB or smaller.");
      return;
    }

    setUploadingAvatar(true);
    try {
      const uploadUrl = await generateAvatarUploadUrl({});
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const contentType = blob.type || asset.mimeType || "image/jpeg";

      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": contentType },
        body: blob,
      });

      if (!uploadResult.ok) {
        throw new Error("Upload failed.");
      }

      const { storageId } = (await uploadResult.json()) as {
        storageId: Id<"_storage">;
      };

      const currentName = (name || profile?.name || "Member").trim();
      await updateProfile({
        name: currentName,
        avatarStorageId: storageId,
      });

      setAvatarPreview(asset.uri);
      setProfileSuccess("Profile picture updated.");
    } catch (err) {
      setProfileError(getFriendlyAuthError(err));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSignOut = () => {
    void signOut().then(() => {
      router.replace("/signin");
    });
  };

  const handleCancelRecurring = (recurringDonationId: Id<"recurringDonations">) => {
    setCancelingId(recurringDonationId);
    setRecurringError(null);
    void cancelRecurringDonation({ recurringDonationId })
      .catch((err) => setRecurringError(getFriendlyPaymentError(err)))
      .finally(() => setCancelingId(null));
  };

  if (isLoading) {
    return (
      <AppShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
        </View>
      </AppShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <AppShell>
        <LoginGate message="To access your account, you need to log in." />
      </AppShell>
    );
  }

  if (profile === undefined) {
    return (
      <AppShell>
        <View className="mx-auto w-full max-w-xl px-4 py-8">
          <Text className="text-dono-muted">Loading account...</Text>
        </View>
      </AppShell>
    );
  }

  const initials = (profile?.name || profile?.email || "D")
    .trim()
    .charAt(0)
    .toUpperCase();

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
            <View className="items-center gap-3">
              <View className="h-24 w-24 overflow-hidden rounded-full border border-dono-border bg-dono-surface-muted">
                {avatarPreview ? (
                  <Image
                    source={{ uri: avatarPreview }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                    accessibilityLabel="Profile picture"
                  />
                ) : (
                  <View className="h-full w-full items-center justify-center">
                    <Text className="font-display-medium text-3xl text-dono-text">
                      {initials}
                    </Text>
                  </View>
                )}
              </View>
              <Pressable
                onPress={() => void uploadAvatar()}
                disabled={uploadingAvatar || savingProfile}
                className={`rounded-full border border-dono-border px-4 py-2 ${
                  uploadingAvatar ? "opacity-50" : ""
                }`}
              >
                <Text className="font-sans-medium text-sm text-dono-text">
                  {uploadingAvatar
                    ? "Uploading..."
                    : avatarPreview
                      ? "Change photo"
                      : "Upload photo"}
                </Text>
              </Pressable>
              {Platform.OS === "web" ? (
                <Text className="text-center text-xs text-dono-muted">
                  JPG or PNG, up to 5MB
                </Text>
              ) : null}
            </View>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#56615A"
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
              disabled={savingProfile || uploadingAvatar}
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

        <View className="rounded-2xl border border-dono-border bg-white p-6">
          <Text className="text-lg font-sans-medium text-dono-text">
            Review feedback
          </Text>
          <Text className="mt-1 text-sm text-dono-muted">
            Comments from the Dono team about your campaigns.
          </Text>

          {reviewMessages === undefined ? (
            <View className="items-center py-6">
              <ActivityIndicator color="#17211B" />
            </View>
          ) : reviewMessages.length === 0 ? (
            <Text className="mt-4 text-sm text-dono-muted">
              No review comments yet.
            </Text>
          ) : (
            <View className="mt-4 gap-3">
              {reviewMessages.map((message) => (
                <View
                  key={message.id}
                  className="rounded-xl border border-dono-border p-4"
                >
                  <Text className="font-sans-medium text-dono-text">
                    {message.campaignTitle}
                  </Text>
                  <Text className="mt-2 text-sm text-dono-text">{message.body}</Text>
                  <Text className="mt-2 text-xs text-dono-muted">
                    {new Date(message.createdAt).toLocaleString("en-GB")}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View className="rounded-2xl border border-dono-border bg-white p-6">
          <Text className="text-lg font-sans-medium text-dono-text">
            Recurring Donations
          </Text>
          <Text className="mt-1 text-sm text-dono-muted">
            Manage your monthly campaign subscriptions.
          </Text>

          {recurringError ? (
            <Text className="mt-3 text-sm text-rose-700">{recurringError}</Text>
          ) : null}

          {recurringDonations === undefined ? (
            <View className="items-center py-6">
              <ActivityIndicator color="#17211B" />
            </View>
          ) : recurringDonations.length === 0 ? (
            <Text className="mt-4 text-sm text-dono-muted">
              You do not have any active monthly donations yet.
            </Text>
          ) : (
            <View className="mt-4 gap-3">
              {recurringDonations.map((donation) => (
                <View
                  key={donation.id}
                  className="rounded-xl border border-dono-border p-4"
                >
                  <Text className="font-sans-medium text-dono-text">
                    {donation.campaignTitle}
                  </Text>
                  <Text className="mt-1 text-sm text-dono-muted">
                    £{donation.amount}/month · {donation.status.replace("_", " ")}
                  </Text>
                  {donation.status !== "canceled" ? (
                    <Pressable
                      onPress={() => handleCancelRecurring(donation.id)}
                      disabled={cancelingId === donation.id}
                      className="mt-3 items-center rounded-full border border-dono-border py-2"
                    >
                      <Text className="font-sans-medium text-sm text-dono-muted">
                        {cancelingId === donation.id ? "Canceling..." : "Cancel subscription"}
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
              ))}
            </View>
          )}
        </View>

        <View className="rounded-2xl border border-dono-border bg-white p-6">
          <Pressable
            onPress={handleSignOut}
            className="items-center rounded-full bg-dono-primary py-3"
          >
            <Text className="font-sans-medium text-sm text-white">Sign out</Text>
          </Pressable>
        </View>
      </View>
    </AppShell>
  );
}
