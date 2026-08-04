import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "convex/react";
import { Check } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import {
  alumniOnboardingDetailsSchema,
  BIRTH_YEAR_OPTIONS,
  DAY_OF_MONTH_OPTIONS,
  MONTH_OPTIONS,
} from "@/lib/validation/profile";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { SelectField } from "@/components/select-field";

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

const STEPS = ["Matriculation year", "College", "Societies"] as const;

export function AlumniOnboardingForm({
  initialName = "",
  initialCollege = "",
  loading = false,
  error,
  onComplete,
}: AlumniOnboardingFormProps) {
  const societies = useQuery(api.societies.listActive);

  const [step, setStep] = useState(0);
  const [name, setName] = useState(initialName);
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const dateOfBirth =
    dobDay && dobMonth && dobYear
      ? `${dobYear}-${dobMonth.padStart(2, "0")}-${dobDay.padStart(2, "0")}`
      : "";
  const [matriculationYear, setMatriculationYear] = useState("");
  const [college, setCollege] = useState(initialCollege);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
  const busy = loading || submitting;

  return (
    <View className="gap-5">
      <View className="w-full flex-row items-start">
        {STEPS.map((label, index) => {
          const active = index === step;
          const done = index < step;
          return (
            <View key={label} className="flex-1 items-center">
              <View className="w-full flex-row items-center">
                {index > 0 ? (
                  <View
                    className={`h-0.5 flex-1 ${
                      index <= step ? "bg-dono-primary" : "bg-dono-border/20"
                    }`}
                  />
                ) : (
                  <View className="flex-1" />
                )}
                <View
                  className={`h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    index <= step ? "bg-dono-primary" : "bg-dono-surface-muted"
                  }`}
                >
                  {done ? (
                    <Check size={16} color="#fff" />
                  ) : (
                    <Text
                      className={`text-xs font-bold ${
                        active ? "text-white" : "text-dono-muted"
                      }`}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
                {index < STEPS.length - 1 ? (
                  <View
                    className={`h-0.5 flex-1 ${
                      index < step ? "bg-dono-primary" : "bg-dono-border/20"
                    }`}
                  />
                ) : (
                  <View className="flex-1" />
                )}
              </View>
              <Text
                className={`mt-2 text-center text-[10px] ${
                  active ? "font-retro-bold text-dono-text" : "text-dono-muted"
                }`}
                numberOfLines={1}
              >
                {label}
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
            <View className="flex-row gap-2">
              <SelectField
                value={dobDay}
                onChange={setDobDay}
                options={DAY_OF_MONTH_OPTIONS}
                placeholder="Day"
                title="Day"
                className="flex-1"
              />
              <SelectField
                value={dobMonth}
                onChange={setDobMonth}
                options={MONTH_OPTIONS}
                placeholder="Month"
                title="Month"
                className="flex-[1.6]"
              />
              <SelectField
                value={dobYear}
                onChange={setDobYear}
                options={BIRTH_YEAR_OPTIONS}
                placeholder="Year"
                title="Year"
                className="flex-1"
              />
            </View>
            <Text className="mt-1 text-xs text-dono-muted">
              You must be at least 18 to use Dono.
            </Text>
          </View>
          <View>
            <Text className="mb-2 text-xs uppercase tracking-wide text-dono-muted">
              Matriculation / graduation year
            </Text>
            <TextInput
              value={matriculationYear}
              onChangeText={setMatriculationYear}
              placeholder="e.g. 2019"
              placeholderTextColor="#56615A"
              keyboardType="number-pad"
              maxLength={4}
              className={inputClassName}
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
            disabled={busy}
            className={`flex-1 items-center rounded-full bg-dono-primary py-3 ${
              busy ? "opacity-50" : ""
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
