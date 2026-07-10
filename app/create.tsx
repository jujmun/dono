import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "convex/react";
import { CheckCircle2, ArrowRight } from "lucide-react-native";
import { usePostHog } from "posthog-react-native";
import { AppShell } from "@/components/app-shell";
import { categoryLabels } from "@/lib/constants";
import { api } from "@convex/_generated/api";

const steps = ["Details", "Story", "Goal", "Review"];

const creatorTypes = [
  "Individual Student",
  "Student Society",
  "College",
  "Department",
  "University",
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const posthog = usePostHog();
  const createCampaign = useMutation(api.campaigns.create);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "",
    creatorType: "",
    university: "",
    description: "",
    story: "",
    goal: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canProceed = () => {
    switch (step) {
      case 0:
        return form.title && form.category && form.creatorType && form.university;
      case 1:
        return form.description && form.story;
      case 2:
        return form.goal && Number(form.goal) > 0;
      default:
        return true;
    }
  };

  const inputClass =
    "w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text";

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-2xl px-4 py-8">
        <View className="mb-8 items-center">
          <Text className="font-display-medium text-2xl text-dono-text">Start a Campaign</Text>
          <Text className="mt-1 text-center text-dono-muted">
            Free for students. Reach alumni who care about your community.
          </Text>
        </View>

        <View className="mb-8 flex-row items-center justify-between">
          {steps.map((s, i) => (
            <View key={s} className="flex-1 flex-row items-center">
              <View className="items-center">
                <View
                  className={`h-8 w-8 items-center justify-center rounded-full ${
                    i <= step ? "bg-dono-primary" : "bg-dono-surface-muted"
                  }`}
                >
                  {i < step ? (
                    <CheckCircle2 size={16} color="#fff" />
                  ) : (
                    <Text
                      className={`text-xs font-bold ${
                        i === step ? "text-white" : "text-dono-muted"
                      }`}
                    >
                      {i + 1}
                    </Text>
                  )}
                </View>
              </View>
              {i < steps.length - 1 && (
                <View
                  className={`mx-2 h-0.5 flex-1 ${
                    i < step ? "bg-dono-primary" : "bg-dono-border"
                  }`}
                />
              )}
            </View>
          ))}
        </View>

        <View className="rounded-2xl border border-dono-border bg-white p-6">
          {step === 0 && (
            <View className="gap-5">
              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">
                  Campaign Title
                </Text>
                <TextInput
                  value={form.title}
                  onChangeText={(v) => update("title", v)}
                  placeholder="e.g. Anatomy Models for Medical Students"
                  placeholderTextColor="#5e6473"
                  className={inputClass}
                />
              </View>

              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <Pressable
                        key={key}
                        onPress={() => update("category", key)}
                        className={`rounded-xl border px-3 py-2.5 ${
                          form.category === key
                            ? "border-dono-primary bg-dono-primary/5"
                            : "border-dono-border"
                        }`}
                      >
                        <Text
                          className={`font-sans-medium text-xs ${
                            form.category === key
                              ? "text-dono-primary"
                              : "text-dono-muted"
                          }`}
                        >
                          {label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">
                  I am creating this as a...
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {creatorTypes.map((type) => (
                    <Pressable
                      key={type}
                      onPress={() => update("creatorType", type)}
                      className={`rounded-xl border px-3 py-2.5 ${
                        form.creatorType === type
                          ? "border-dono-primary bg-dono-primary/5"
                          : "border-dono-border"
                      }`}
                    >
                      <Text
                        className={`font-sans-medium text-xs ${
                          form.creatorType === type
                            ? "text-dono-primary"
                            : "text-dono-muted"
                        }`}
                      >
                        {type}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">
                  University
                </Text>
                <TextInput
                  value={form.university}
                  onChangeText={(v) => update("university", v)}
                  placeholder="e.g. University of Cambridge"
                  placeholderTextColor="#5e6473"
                  className={inputClass}
                />
              </View>
            </View>
          )}

          {step === 1 && (
            <View className="gap-5">
              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">
                  Short Description
                </Text>
                <TextInput
                  value={form.description}
                  onChangeText={(v) => update("description", v)}
                  placeholder="One-line summary of your campaign"
                  placeholderTextColor="#5e6473"
                  className={inputClass}
                />
              </View>
              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">
                  Your Story
                </Text>
                <TextInput
                  value={form.story}
                  onChangeText={(v) => update("story", v)}
                  placeholder="Tell donors why this matters..."
                  placeholderTextColor="#5e6473"
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  className={`${inputClass} min-h-[140px]`}
                />
              </View>
            </View>
          )}

          {step === 2 && (
            <View className="gap-5">
              <View>
                <Text className="mb-1.5 font-sans-medium text-sm text-dono-text">
                  Funding Goal (£)
                </Text>
                <TextInput
                  value={form.goal}
                  onChangeText={(v) => update("goal", v)}
                  placeholder="e.g. 3500"
                  placeholderTextColor="#5e6473"
                  keyboardType="numeric"
                  className={inputClass}
                />
                <Text className="mt-1.5 text-xs text-dono-muted">
                  Dono is optimised for small-to-medium funding needs (£500–£10,000)
                </Text>
              </View>
              <View className="rounded-xl border border-green-200 bg-green-50 p-4">
                <Text className="text-sm text-green-800">
                  Students never pay to create campaigns. Dono takes a small transaction
                  fee on donations to keep the platform running.
                </Text>
              </View>
            </View>
          )}

          {step === 3 && (
            <View className="gap-4">
              <Text className="text-lg font-sans-medium text-dono-text">
                Review your campaign
              </Text>
              {(
                [
                  ["Title", form.title],
                  ["Category", categoryLabels[form.category] || form.category],
                  ["Creator", form.creatorType],
                  ["University", form.university],
                  ["Description", form.description],
                  ["Goal", `£${Number(form.goal).toLocaleString()}`],
                ] as const
              ).map(([label, value]) => (
                <View
                  key={label}
                  className="flex-row justify-between border-b border-dono-border pb-3"
                >
                  <Text className="text-sm text-dono-muted">{label}</Text>
                  <Text className="max-w-[60%] text-right font-sans-medium text-sm text-dono-text">
                    {value}
                  </Text>
                </View>
              ))}
              <View className="rounded-xl border border-dono-border bg-dono-surface-muted p-4">
                <Text className="text-sm leading-relaxed text-dono-muted">{form.story}</Text>
              </View>
            </View>
          )}

          <View className="mt-8 flex-row justify-between">
            {step > 0 ? (
              <Pressable
                onPress={() => setStep(step - 1)}
                className="rounded-full border border-dono-border px-5 py-2.5"
              >
                <Text className="font-sans-medium text-sm text-dono-muted">Back</Text>
              </Pressable>
            ) : (
              <View />
            )}

            {step < steps.length - 1 ? (
              <Pressable
                onPress={() => setStep(step + 1)}
                disabled={!canProceed()}
                className={`flex-row items-center gap-2 rounded-full bg-dono-primary px-5 py-2.5 ${
                  !canProceed() ? "opacity-50" : ""
                }`}
              >
                <Text className="font-sans-medium text-sm text-white">Continue</Text>
                <ArrowRight size={16} color="#fff" />
              </Pressable>
            ) : (
              <Pressable
                disabled={submitting}
                onPress={() => {
                  setError(null);
                  setSubmitting(true);
                  void createCampaign({
                    title: form.title,
                    category: form.category,
                    creatorType: form.creatorType,
                    university: form.university,
                    description: form.description,
                    story: form.story,
                    goal: Number(form.goal),
                  })
                    .then((result) => {
                      posthog?.capture("campaign_created", {
                        campaign_title: form.title,
                        campaign_category: form.category,
                        campaign_creator_type: form.creatorType,
                        campaign_university: form.university,
                        campaign_goal: Number(form.goal),
                      });
                      router.push(`/campaigns/${result.slug}`);
                    })
                    .catch((err: Error) => {
                      setError(err.message || "Failed to create campaign.");
                    })
                    .finally(() => {
                      setSubmitting(false);
                    });
                }}
                className={`rounded-full bg-dono-accent px-6 py-2.5 ${
                  submitting ? "opacity-50" : ""
                }`}
              >
                <Text className="font-sans-medium text-sm text-white">
                  {submitting ? "Launching..." : "Launch Campaign"}
                </Text>
              </Pressable>
            )}
          </View>

          {error && (
            <View className="mt-4 rounded-xl bg-rose-50 px-4 py-3">
              <Text className="text-sm text-rose-700">{error}</Text>
            </View>
          )}
        </View>
      </View>
    </AppShell>
  );
}
