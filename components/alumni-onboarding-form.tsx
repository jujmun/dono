import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useAction, useQuery } from "convex/react";
import { ShieldCheck } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import {
  alumniOnboardingDetailsSchema,
  MATRICULATION_YEAR_OPTIONS,
} from "@/lib/validation/profile";
import { launchIdentityVerification } from "@/lib/stripe/launch-identity-verification";
import { isStripeIdentityEnabled } from "@/lib/stripe/identity-enabled";
import { getFriendlyAuthError } from "@/lib/auth/errors";

const inputClassName =
  "w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text";

type AlumniOnboardingFormProps = {
  initialName?: string;
  initialCollege?: string;
  loading?: boolean;
  error?: string | null;
  onComplete: (values: {
    name: string;
    college: string;
    matriculationYear: string;
    dateOfBirth: string;
    interestedSocietySlugs: string[];
  }) => void | Promise<void>;
};

const STEPS = [
  "Matriculation year",
  "College",
  "Societies",
  "Identity",
] as const;

export function AlumniOnboardingForm({
  initialName = "",
  initialCollege = "",
  loading = false,
  error,
  onComplete,
}: AlumniOnboardingFormProps) {
  const societies = useQuery(api.societies.listActive);
  const profile = useQuery(api.users.me);
  const createVerificationSession = useAction(
    api.alumniIdentity.createVerificationSession,
  );
  const refreshVerificationStatus = useAction(
    api.alumniIdentity.refreshVerificationStatus,
  );

  const [step, setStep] = useState(0);
  const [name, setName] = useState(initialName);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [matriculationYear, setMatriculationYear] = useState("");
  const [college, setCollege] = useState(initialCollege);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const identityEnabled = isStripeIdentityEnabled();
  const stripeStatus = profile?.stripeVerificationStatus ?? null;
  const stripeVerified = stripeStatus === "verified";
  const stripeFailed = stripeStatus === "requires_input";

  useEffect(() => {
    if (!identityEnabled || stripeVerified || !profile?.userType) {
      return;
    }
    if (profile.userType !== "alumni") return;
    if (!stripeStatus) return;

    const interval = setInterval(() => {
      void refreshVerificationStatus({}).catch(() => {
        // Best-effort poll; webhook may still succeed.
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [
    identityEnabled,
    stripeVerified,
    stripeStatus,
    profile?.userType,
    refreshVerificationStatus,
  ]);

  const toggleSociety = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const validateThroughCollege = () => {
    const parsed = alumniOnboardingDetailsSchema
      .pick({
        name: true,
        dateOfBirth: true,
        matriculationYear: true,
        college: true,
      })
      .safeParse({ name, dateOfBirth, matriculationYear, college });
    if (!parsed.success) {
      setLocalError(parsed.error.issues[0]?.message ?? "Please check your details.");
      return false;
    }
    setLocalError(null);
    return true;
  };

  const goNext = () => {
    if (step === 0) {
      const parsed = alumniOnboardingDetailsSchema
        .pick({ name: true, dateOfBirth: true, matriculationYear: true })
        .safeParse({ name, dateOfBirth, matriculationYear });
      if (!parsed.success) {
        setLocalError(
          parsed.error.issues[0]?.message ?? "Please check your details.",
        );
        return;
      }
    }
    if (step === 1 && !validateThroughCollege()) {
      return;
    }
    setLocalError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleVerifyIdentity = async () => {
    setLocalError(null);
    setVerifying(true);
    try {
      const { clientSecret, url } = await createVerificationSession({});
      const result = await launchIdentityVerification({ clientSecret, url });
      if (result.error) {
        setLocalError(result.error);
        return;
      }
      await refreshVerificationStatus({}).catch(() => undefined);
    } catch (err) {
      setLocalError(getFriendlyAuthError(err));
    } finally {
      setVerifying(false);
    }
  };

  const handleComplete = async () => {
    const parsed = alumniOnboardingDetailsSchema.safeParse({
      name,
      college,
      matriculationYear,
      dateOfBirth,
      interestedSocietySlugs: selectedSlugs,
    });
    if (!parsed.success) {
      setLocalError(
        parsed.error.issues[0]?.message ?? "Please check your details.",
      );
      return;
    }
    if (identityEnabled && !stripeVerified) {
      setLocalError("Complete identity verification before finishing setup.");
      return;
    }

    setSubmitting(true);
    setLocalError(null);
    try {
      await onComplete(parsed.data);
    } catch (err) {
      setLocalError(getFriendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = error ?? localError;
  const busy = loading || submitting || verifying;

  return (
    <View className="gap-5">
      <View className="flex-row flex-wrap gap-2">
        {STEPS.map((label, index) => {
          const active = index === step;
          const done = index < step;
          return (
            <View
              key={label}
              className={`rounded-full border px-3 py-1.5 ${
                active
                  ? "border-dono-primary bg-dono-primary/10"
                  : done
                    ? "border-dono-border bg-dono-surface-muted"
                    : "border-dono-border bg-white"
              }`}
            >
              <Text
                className={`text-xs ${
                  active
                    ? "font-retro-bold text-dono-primary"
                    : "text-dono-muted"
                }`}
              >
                {index + 1}. {label}
              </Text>
            </View>
          );
        })}
      </View>

      {step === 0 ? (
        <View className="gap-4">
          <Text className="text-sm leading-relaxed text-dono-muted">
            Tell us when you matriculated or graduated, plus a few basics.
          </Text>
          <View>
            <Text className="mb-2 text-xs uppercase tracking-wide text-dono-muted">
              Full name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              placeholderTextColor="#56615A"
              className={inputClassName}
            />
          </View>
          <View>
            <Text className="mb-2 text-xs uppercase tracking-wide text-dono-muted">
              Date of birth
            </Text>
            <TextInput
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#56615A"
              autoCapitalize="none"
              className={inputClassName}
            />
            <Text className="mt-1 text-xs text-dono-muted">
              You must be at least 18 to use Dono.
            </Text>
          </View>
          <View>
            <Text className="mb-2 text-xs uppercase tracking-wide text-dono-muted">
              Matriculation / graduation year
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="max-h-40"
            >
              <View className="flex-row flex-wrap gap-2" style={{ maxWidth: 360 }}>
                {MATRICULATION_YEAR_OPTIONS.slice(0, 30).map((year) => {
                  const selected = matriculationYear === year;
                  return (
                    <Pressable
                      key={year}
                      onPress={() => setMatriculationYear(year)}
                      className={`rounded-full border px-3 py-2 ${
                        selected
                          ? "border-dono-primary bg-dono-primary/10"
                          : "border-dono-border bg-white"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          selected
                            ? "font-retro-bold text-dono-primary"
                            : "text-dono-muted"
                        }`}
                      >
                        {year}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
            <Text className="mt-2 text-xs text-dono-muted">
              Or type a year
            </Text>
            <TextInput
              value={matriculationYear}
              onChangeText={setMatriculationYear}
              placeholder="e.g. 2019"
              placeholderTextColor="#56615A"
              keyboardType="number-pad"
              maxLength={4}
              className={`mt-1 ${inputClassName}`}
            />
          </View>
        </View>
      ) : null}

      {step === 1 ? (
        <View className="gap-4">
          <Text className="text-sm leading-relaxed text-dono-muted">
            Which college were you at?
          </Text>
          <View>
            <Text className="mb-2 text-xs uppercase tracking-wide text-dono-muted">
              College
            </Text>
            <TextInput
              value={college}
              onChangeText={setCollege}
              placeholder="e.g. Balliol College"
              placeholderTextColor="#56615A"
              className={inputClassName}
            />
          </View>
        </View>
      ) : null}

      {step === 2 ? (
        <View className="gap-4">
          <Text className="text-sm leading-relaxed text-dono-muted">
            Pick societies you care about — we&apos;ll follow them for you.
            Optional.
          </Text>
          {societies === undefined ? (
            <ActivityIndicator color="#17211B" />
          ) : societies.length === 0 ? (
            <Text className="text-sm text-dono-muted">
              No active societies yet — you can skip this step.
            </Text>
          ) : (
            <View className="flex-row flex-wrap gap-2">
              {societies.map((society) => {
                const selected = selectedSlugs.includes(society.slug);
                return (
                  <Pressable
                    key={society.slug}
                    onPress={() => toggleSociety(society.slug)}
                    className={`rounded-full border px-3 py-2 ${
                      selected
                        ? "border-dono-primary bg-dono-primary/10"
                        : "border-dono-border bg-white"
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        selected
                          ? "font-retro-bold text-dono-primary"
                          : "text-dono-muted"
                      }`}
                    >
                      {society.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      ) : null}

      {step === 3 ? (
        <View className="gap-4">
          <View className="gap-3 rounded-xl border border-dono-border bg-dono-surface-muted p-4">
            <View className="flex-row items-center gap-2">
              <ShieldCheck size={16} color="#17211B" />
              <Text className="font-retro-bold text-base text-dono-text">
                Identity check
              </Text>
            </View>
            <Text className="text-sm leading-relaxed text-dono-muted">
              Confirm it&apos;s you with a quick ID photo and selfie. Required
              before you finish alumni setup.
            </Text>

            {stripeVerified ? (
              <View className="rounded-xl bg-green-50 px-4 py-3">
                <Text className="text-sm text-green-700">
                  Identity verified. You can finish setup.
                </Text>
              </View>
            ) : stripeStatus === "processing" ? (
              <View className="rounded-xl bg-amber-50 px-4 py-3">
                <Text className="text-sm text-amber-800">
                  Verifying your identity... this usually takes a moment.
                </Text>
              </View>
            ) : stripeFailed ? (
              <View className="rounded-xl bg-rose-50 px-4 py-3">
                <Text className="text-sm text-rose-700">
                  {profile?.stripeVerificationLastErrorReason ??
                    "That didn't go through — please try again."}
                </Text>
              </View>
            ) : null}

            {identityEnabled && !stripeVerified ? (
              <Pressable
                onPress={() => void handleVerifyIdentity()}
                disabled={busy}
                className={`items-center self-start rounded-full bg-dono-primary px-4 py-3 ${
                  busy ? "opacity-50" : ""
                }`}
              >
                {verifying ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="font-retro-bold text-sm text-white">
                    Verify your identity
                  </Text>
                )}
              </Pressable>
            ) : null}

            {!identityEnabled ? (
              <Text className="text-xs text-dono-muted">
                Identity verification is temporarily unavailable — you can still
                finish setup.
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}

      {displayError ? (
        <View className="rounded-xl bg-rose-50 px-4 py-3">
          <Text className="text-sm text-rose-700">{displayError}</Text>
        </View>
      ) : null}

      <View className="flex-row gap-3">
        {step > 0 ? (
          <Pressable
            onPress={() => {
              setLocalError(null);
              setStep((s) => s - 1);
            }}
            disabled={busy}
            className="flex-1 items-center rounded-full border border-dono-border py-3"
          >
            <Text className="font-retro-bold text-sm text-dono-text">Back</Text>
          </Pressable>
        ) : null}

        {step < STEPS.length - 1 ? (
          <Pressable
            onPress={goNext}
            disabled={busy}
            className={`flex-1 items-center rounded-full bg-dono-primary py-3 ${
              busy ? "opacity-50" : ""
            }`}
          >
            <Text className="font-retro-bold text-sm text-white">Continue</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => void handleComplete()}
            disabled={
              busy || (identityEnabled && !stripeVerified)
            }
            className={`flex-1 items-center rounded-full bg-dono-primary py-3 ${
              busy || (identityEnabled && !stripeVerified) ? "opacity-50" : ""
            }`}
          >
            {submitting || loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-retro-bold text-sm text-white">
                Complete setup
              </Text>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}
