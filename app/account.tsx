import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { useAction, useConvexAuth, useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Link, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { AppShell } from "@/components/app-shell";
import { LoginGate } from "@/components/login-gate";
import { useCurrentProfile, useUpdateProfile } from "@/lib/auth/hooks";
import { profileDetailsSchema, YEAR_IN_COLLEGE_OPTIONS } from "@/lib/validation/profile";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { uploadImageToConvexStorage } from "@/lib/upload-avatar";
import { getFriendlyPaymentError } from "@/lib/stripe/errors";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

function formatMemberSince(emailVerifiedAt: number | null | undefined) {
  if (!emailVerifiedAt) return null;
  return `MEMBER SINCE ${new Date(emailVerifiedAt).getFullYear()}`;
}

function formatRole(role: "user" | "admin") {
  if (role === "admin") return "Admin";
  return "Donor";
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <>
      <View className="flex-row items-center justify-between py-3">
        <Text className="text-sm text-dono-text">{label}</Text>
        <Text
          className={`text-sm text-dono-text ${mono ? "font-retro-mono" : ""}`}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
      <View className="border-t border-dashed border-dono-border" />
    </>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <View className="rounded-2xl border border-dono-border bg-white p-6">
      <Text className="font-retro-bold text-lg text-dono-text">{title}</Text>
      <Text className="mt-1 text-sm text-dono-muted">{subtitle}</Text>
      {children}
    </View>
  );
}

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
  const requestAccountDeletion = useMutation(api.users.requestAccountDeletion);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [degree, setDegree] = useState("");
  const [yearInCollege, setYearInCollege] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [cancelingId, setCancelingId] = useState<Id<"recurringDonations"> | null>(
    null,
  );
  const [recurringError, setRecurringError] = useState<string | null>(null);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name ?? "");
    setPhone(profile.phone ?? "");
    setCollege(profile.college ?? "");
    setDegree(profile.degree ?? "");
    setYearInCollege(profile.yearInCollege ?? "");
    setDateOfBirth(profile.dateOfBirth ?? "");
    setAvatarPreview(profile.avatarUrl ?? null);
  }, [profile]);

  const saveProfile = () => {
    const parsed = profileDetailsSchema.safeParse({
      name,
      phone,
      college,
      degree,
      yearInCollege,
      dateOfBirth,
    });
    if (!parsed.success) {
      setProfileError(parsed.error.issues[0]?.message ?? "Invalid profile.");
      return;
    }
    setSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);
    void updateProfile({
      name: parsed.data.name,
      phone: parsed.data.phone,
      college: parsed.data.college,
      degree: parsed.data.degree,
      yearInCollege: parsed.data.yearInCollege,
      dateOfBirth: parsed.data.dateOfBirth,
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
      const storageId = await uploadImageToConvexStorage(uploadUrl, {
        uri: asset.uri,
        mimeType: asset.mimeType,
        fileSize: asset.fileSize,
      });

      const currentName = (name || profile?.name || "Member").trim();
      await updateProfile({
        name: currentName,
        phone: phone || profile?.phone || undefined,
        college: college || profile?.college || undefined,
        degree: degree || profile?.degree || undefined,
        yearInCollege: yearInCollege || profile?.yearInCollege || undefined,
        dateOfBirth: dateOfBirth || profile?.dateOfBirth || undefined,
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

  const handleDeleteAccount = () => {
    if (!confirmDeleteAccount) {
      setConfirmDeleteAccount(true);
      setDeleteAccountError(null);
      return;
    }
    setDeletingAccount(true);
    setDeleteAccountError(null);
    void requestAccountDeletion({})
      .then(() => signOut())
      .then(() => {
        router.replace("/signin");
      })
      .catch((err) => {
        setDeleteAccountError(getFriendlyAuthError(err));
        setDeletingAccount(false);
      });
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
        <View className="mx-auto w-full max-w-3xl px-4 py-8">
          <Text className="text-dono-muted">Loading account...</Text>
        </View>
      </AppShell>
    );
  }

  const initials = (profile?.name || profile?.email || "D")
    .trim()
    .charAt(0)
    .toUpperCase();
  const memberSince = formatMemberSince(profile?.emailVerifiedAt);
  const activeRecurringDonations =
    recurringDonations?.filter((donation) => donation.status !== "canceled") ?? [];

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-3xl gap-6 px-4 py-8">
        <View>
          <View className="flex-row items-center gap-2">
            <Link href="/dashboard" asChild>
              <Pressable>
                <Text className="text-sm text-dono-muted">Dashboard</Text>
              </Pressable>
            </Link>
            <Text className="text-sm text-dono-muted">/</Text>
            <Text className="text-sm text-dono-muted">Account settings</Text>
          </View>
          <Text className="mt-3 font-retro-bold text-2xl text-dono-text">
            Account settings
          </Text>
          <Text className="mt-1 text-dono-muted">
            Manage your profile, subscriptions, and campaign feedback.
          </Text>
        </View>

        <View className="rounded-2xl border border-dono-border bg-white p-6">
          <View className="mb-1 flex-row items-center justify-between gap-4">
            <Text className="font-retro-bold text-lg text-dono-text">Account</Text>
            {memberSince ? (
              <Text className="font-retro-mono text-xs uppercase tracking-wide text-dono-muted">
                {memberSince}
              </Text>
            ) : null}
          </View>

          <InfoRow label="Email" value={profile?.email ?? ""} mono />
          <InfoRow label="Role" value={formatRole(profile?.role ?? "user")} />
          {profile?.phone ? <InfoRow label="Phone" value={profile.phone} mono /> : null}
          {profile?.college ? <InfoRow label="College" value={profile.college} /> : null}
          {profile?.degree ? <InfoRow label="Degree" value={profile.degree} /> : null}
          {profile?.yearInCollege ? (
            <InfoRow label="Year" value={profile.yearInCollege} />
          ) : null}

          <View className="mt-5 flex-row items-center gap-4">
            <View className="h-16 w-16 overflow-hidden rounded-full border border-dono-border bg-dono-surface-muted">
              {avatarPreview ? (
                <Image
                  source={{ uri: avatarPreview }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                  accessibilityLabel="Profile picture"
                />
              ) : (
                <View className="h-full w-full items-center justify-center">
                  <Text className="font-retro-bold text-2xl text-dono-text">
                    {initials}
                  </Text>
                </View>
              )}
            </View>
            <Pressable
              onPress={() => void uploadAvatar()}
              disabled={uploadingAvatar || savingProfile}
              className={`flex-1 ${uploadingAvatar ? "opacity-50" : ""}`}
            >
              <Text className="font-retro-bold text-sm text-dono-text">
                {uploadingAvatar ? "Uploading..." : "Upload photo"}
              </Text>
              <Text className="mt-0.5 text-xs text-dono-muted">
                JPG or PNG, up to 5MB
              </Text>
            </Pressable>
          </View>

          <Text className="mt-6 text-xs uppercase tracking-wide text-dono-muted">
            Display name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#56615A"
            className="mt-2 w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
          />
          <Text className="mt-4 text-xs uppercase tracking-wide text-dono-muted">
            Phone number
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="+44 7700 900000"
            placeholderTextColor="#56615A"
            keyboardType="phone-pad"
            className="mt-2 w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
          />
          <Text className="mt-4 text-xs uppercase tracking-wide text-dono-muted">
            College
          </Text>
          <TextInput
            value={college}
            onChangeText={setCollege}
            placeholder="e.g. Balliol College"
            placeholderTextColor="#56615A"
            className="mt-2 w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
          />
          <Text className="mt-4 text-xs uppercase tracking-wide text-dono-muted">
            Degree
          </Text>
          <TextInput
            value={degree}
            onChangeText={setDegree}
            placeholder="e.g. BA History"
            placeholderTextColor="#56615A"
            className="mt-2 w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
          />
          <Text className="mt-4 text-xs uppercase tracking-wide text-dono-muted">
            Date of birth
          </Text>
          <TextInput
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#56615A"
            autoCapitalize="none"
            className="mt-2 w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text"
          />
          <Text className="mt-1 text-xs text-dono-muted">
            You must be at least 18 to use Dono.
          </Text>
          <Text className="mt-4 text-xs uppercase tracking-wide text-dono-muted">
            Year in college
          </Text>
          <View className="mt-2 flex-row flex-wrap gap-2">
            {YEAR_IN_COLLEGE_OPTIONS.map((option) => {
              const selected = yearInCollege === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setYearInCollege(option)}
                  className={`rounded-full border px-3 py-2 ${
                    selected
                      ? "border-dono-primary bg-dono-primary/10"
                      : "border-dono-border bg-white"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selected ? "font-retro-bold text-dono-primary" : "text-dono-muted"
                    }`}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {profileError ? (
            <Text className="mt-3 text-sm text-rose-700">{profileError}</Text>
          ) : null}
          {profileSuccess ? (
            <Text className="mt-3 text-sm text-green-700">{profileSuccess}</Text>
          ) : null}
          <Pressable
            onPress={saveProfile}
            disabled={savingProfile || uploadingAvatar}
            className={`mt-4 items-center self-start rounded-full bg-dono-primary px-6 py-2.5 ${
              savingProfile ? "opacity-50" : ""
            }`}
          >
            <Text className="font-retro-bold text-sm text-white">
              {savingProfile ? "Saving..." : "Save changes"}
            </Text>
          </Pressable>
        </View>

        <SectionCard
          title="Review feedback"
          subtitle="Comments from the Dono team about your campaigns."
        >
          {reviewMessages === undefined ? (
            <View className="mt-4 items-center rounded-xl border border-dashed border-dono-border bg-dono-bg py-8">
              <ActivityIndicator color="#17211B" />
            </View>
          ) : reviewMessages.length === 0 ? (
            <View className="mt-4 rounded-xl border border-dashed border-dono-border bg-dono-bg px-4 py-5">
              <Text className="text-sm text-dono-muted">
                Nothing to review yet — feedback appears here once a campaign you run
                is checked.
              </Text>
            </View>
          ) : (
            <View className="mt-4 gap-3">
              {reviewMessages.map((message) => (
                <View
                  key={message.id}
                  className="rounded-xl border border-dono-border bg-dono-bg p-4"
                >
                  <Text className="font-retro-bold text-dono-text">
                    {message.campaignTitle}
                  </Text>
                  <Text className="mt-2 text-sm text-dono-text">{message.body}</Text>
                  <Text className="mt-2 text-xs text-dono-muted">
                    {new Date(message.createdAt).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </SectionCard>

        <SectionCard
          title="Recurring donations"
          subtitle="Manage your monthly campaign subscriptions."
        >
          {recurringError ? (
            <Text className="mt-3 text-sm text-rose-700">{recurringError}</Text>
          ) : null}

          {recurringDonations === undefined ? (
            <View className="mt-4 items-center rounded-xl border border-dono-border bg-dono-bg py-8">
              <ActivityIndicator color="#17211B" />
            </View>
          ) : activeRecurringDonations.length === 0 ? (
            <View className="mt-4 flex-row items-center justify-between gap-4 rounded-xl border border-dono-border bg-dono-bg px-4 py-5">
              <Text className="flex-1 text-sm text-dono-muted">
                No active monthly donations.
              </Text>
              <Link href="/campaigns" asChild>
                <Pressable>
                  <Text className="font-retro-bold text-sm text-dono-primary">
                    Browse campaigns →
                  </Text>
                </Pressable>
              </Link>
            </View>
          ) : (
            <View className="mt-4 gap-3">
              {activeRecurringDonations.map((donation) => (
                <View
                  key={donation.id}
                  className="rounded-xl border border-dono-border bg-dono-bg p-4"
                >
                  <Text className="font-retro-bold text-dono-text">
                    {donation.campaignTitle}
                  </Text>
                  <Text className="mt-1 text-sm text-dono-muted">
                    £{donation.amount}/month · {donation.status.replace("_", " ")}
                  </Text>
                  {donation.status !== "canceled" ? (
                    <Pressable
                      onPress={() => handleCancelRecurring(donation.id)}
                      disabled={cancelingId === donation.id}
                      className="mt-3 items-center self-start rounded-full border border-dono-border px-4 py-2"
                    >
                      <Text className="font-retro-bold text-sm text-dono-muted">
                        {cancelingId === donation.id
                          ? "Canceling..."
                          : "Cancel subscription"}
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
              ))}
            </View>
          )}
        </SectionCard>

        <View className="border-t border-dono-border pt-6">
          <View className="flex-row items-start justify-between gap-6">
            <View className="flex-1">
              <Text className="font-retro-bold text-dono-text">Delete account</Text>
              <Text className="mt-1 text-sm text-dono-muted">
                Anonymises your profile data. This cannot be undone.
              </Text>
              {confirmDeleteAccount ? (
                <Text className="mt-2 text-sm text-rose-700">
                  Tap confirm again to permanently delete your account.
                </Text>
              ) : null}
              {deleteAccountError ? (
                <Text className="mt-2 text-sm text-rose-700">{deleteAccountError}</Text>
              ) : null}
            </View>
            <Pressable
              onPress={handleDeleteAccount}
              disabled={deletingAccount}
              className="rounded-full border border-red-300 bg-white px-6 py-2.5"
            >
              <Text className="font-retro-bold text-sm text-red-600">
                {deletingAccount
                  ? "Deleting..."
                  : confirmDeleteAccount
                    ? "Confirm delete"
                    : "Delete account"}
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="border-t border-dono-border pt-6">
          <View className="flex-row items-center justify-between gap-6">
            <View className="flex-1">
              <Text className="font-retro-bold text-dono-text">Sign out</Text>
              <Text className="mt-1 text-sm text-dono-muted">
                You&apos;ll need to sign back in to manage campaigns.
              </Text>
            </View>
            <Pressable
              onPress={handleSignOut}
              className="rounded-full border border-red-300 bg-white px-6 py-2.5"
            >
              <Text className="font-retro-bold text-sm text-red-600">Sign out</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </AppShell>
  );
}
