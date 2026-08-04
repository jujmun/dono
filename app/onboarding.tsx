import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "convex/react";
import { AppShell } from "@/components/app-shell";
import {
  ProfileSetupForm,
  type ProfileSetupValues,
} from "@/components/profile-setup-form";
import { AlumniOnboardingForm } from "@/components/alumni-onboarding-form";
import { useCurrentProfile, useUpdateProfile } from "@/lib/auth/hooks";
import {
  YEAR_IN_COLLEGE_OPTIONS,
  type YearInCollege,
} from "@/lib/validation/profile";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { uploadImageToConvexStorage } from "@/lib/upload-avatar";
import { setWelcomeTourPending } from "@/lib/welcome-tour-storage";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export default function OnboardingPage() {
  const router = useRouter();
  const profile = useCurrentProfile();
  const updateProfile = useUpdateProfile();
  const generateAvatarUploadUrl = useMutation(api.users.generateAvatarUploadUrl);
  const skipOnboarding = useMutation(api.users.skipOnboarding);
  const completeAlumniOnboarding = useMutation(api.users.completeAlumniOnboarding);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skipping, setSkipping] = useState(false);

  const isAlumni = profile?.userType === "alumni";

  const initialYear = YEAR_IN_COLLEGE_OPTIONS.includes(
    profile?.yearInCollege as YearInCollege,
  )
    ? (profile?.yearInCollege as YearInCollege)
    : undefined;

  const afterOnboardingComplete = async () => {
    if (profile?.id) {
      await setWelcomeTourPending(profile.id, isAlumni ? "alumni" : "student");
    }
    router.replace("/welcome");
  };

  const completeStudentOnboarding = async (values: ProfileSetupValues) => {
    setLoading(true);
    setError(null);

    try {
      let avatarStorageId: Id<"_storage"> | undefined;

      if (values.avatarPreview && !values.avatarPreview.startsWith("http")) {
        const uploadUrl = await generateAvatarUploadUrl({});
        avatarStorageId = await uploadImageToConvexStorage(uploadUrl, {
          uri: values.avatarPreview,
        });
      }

      await updateProfile({
        name: values.name,
        phone: values.phone,
        college: values.college,
        degree: values.degree,
        yearInCollege: values.yearInCollege,
        dateOfBirth: values.dateOfBirth,
        ...(avatarStorageId ? { avatarStorageId } : {}),
      });

      await afterOnboardingComplete();
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const completeAlumni = async (values: {
    name: string;
    college: string;
    matriculationYear: string;
    dateOfBirth: string;
    interestedSocietySlugs: string[];
  }) => {
    setLoading(true);
    setError(null);
    try {
      await completeAlumniOnboarding(values);
      await afterOnboardingComplete();
    } catch (err) {
      setError(getFriendlyAuthError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setSkipping(true);
    setError(null);
    try {
      await skipOnboarding({});
      router.replace("/dashboard");
    } catch (err) {
      setError(getFriendlyAuthError(err));
      setSkipping(false);
    }
  };

  if (profile === undefined) {
    return (
      <AppShell>
        <View className="mx-auto w-full max-w-lg items-center px-4 py-12">
          <ActivityIndicator color="#17211B" />
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-lg px-4 py-12">
        <View className="rounded-2xl border border-dono-border bg-white p-8">
          <Text className="font-retro-bold text-2xl text-dono-text">
            {isAlumni ? "Welcome, alumni" : "Set up your profile"}
          </Text>
          <Text className="mt-1 text-sm leading-relaxed text-dono-muted">
            {isAlumni
              ? "A few details help us connect you with colleges and societies you care about."
              : "Welcome to Dono. Add a few details so donors and campaign creators know who you are."}
          </Text>

          <View className="mt-6">
            {isAlumni ? (
              <AlumniOnboardingForm
                initialName={profile?.name ?? ""}
                initialCollege={profile?.college ?? ""}
                loading={loading || skipping}
                error={error}
                onComplete={completeAlumni}
              />
            ) : (
              <ProfileSetupForm
                initialValues={{
                  name: profile?.name ?? "",
                  phone: profile?.phone ?? "",
                  college: profile?.college ?? "",
                  degree: profile?.degree ?? "",
                  yearInCollege: initialYear,
                  avatarPreview: profile?.avatarUrl ?? null,
                }}
                submitLabel={loading ? "Saving..." : "Complete setup"}
                loading={loading || skipping}
                error={error}
                onSubmit={completeStudentOnboarding}
              />
            )}
          </View>

          <Pressable
            onPress={() => void handleSkip()}
            disabled={loading || skipping}
            className="mt-4 items-center"
          >
            <Text className="text-sm text-dono-muted underline">
              {skipping ? "Skipping..." : "Skip for now"}
            </Text>
          </Pressable>
        </View>
      </View>
    </AppShell>
  );
}
