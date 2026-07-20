import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { AppShell } from "@/components/app-shell";
import { LoginGate } from "@/components/login-gate";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { categoryLabels } from "@/lib/constants";
import { api } from "@convex/_generated/api";

const inputClass =
  "w-full rounded-lg border-2 border-retro-ink bg-white px-4 py-2.5 font-retro-mono text-sm text-retro-ink outline-none";
const primaryBtnClass =
  "items-center rounded-full border-2 border-retro-ink bg-retro-mint px-5 py-2.5 shadow-[3px_3px_0_#211E1A]";
const accentBtnClass =
  "items-center rounded-full border-2 border-retro-ink bg-retro-marigold px-6 py-2.5 shadow-[3px_3px_0_#211E1A]";

/** Minimal owner-facing edit page — title/category/description/story/goal
 * via campaignCreator.update (already supported these fields, just never
 * had a UI). Photo/video/fund-line editing use their own dedicated
 * mutations and aren't wired up here yet — a reasonable fast-follow using
 * the same pattern as app/create.tsx's picker if needed later. */
export default function EditCampaignPage() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { isAuthenticated, isLoading } = useConvexAuth();

  const campaign = useQuery(
    api.campaignCreator.getMineForEdit,
    isAuthenticated && slug ? { slug } : "skip",
  );
  const updateCampaign = useMutation(api.campaignCreator.update);
  const resubmit = useMutation(api.campaignCreator.resubmit);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");
  const [goal, setGoal] = useState("");
  const [saving, setSaving] = useState(false);
  const [resubmitting, setResubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);

  // Populate the form once, when the campaign first loads — not on every
  // refetch, so it doesn't clobber in-progress edits.
  useEffect(() => {
    if (campaign && loadedSlug !== campaign.id) {
      setTitle(campaign.title);
      setCategory(campaign.category);
      setDescription(campaign.description);
      setStory(campaign.story);
      setGoal(String(campaign.goal));
      setLoadedSlug(campaign.id);
    }
  }, [campaign, loadedSlug]);

  const goalAmount = Number(goal);
  const goalInvalid = goal.trim().length > 0 && (!Number.isFinite(goalAmount) || goalAmount <= 0);

  const handleSave = async () => {
    if (!slug) return;
    setError(null);
    setInfo(null);
    setSaving(true);
    try {
      await updateCampaign({
        slug,
        title,
        category,
        description,
        story,
        goal: goalAmount,
        logEdit: true,
      });
      setInfo("Changes saved.");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleResubmit = async () => {
    if (!slug) return;
    setError(null);
    setInfo(null);
    setResubmitting(true);
    try {
      await resubmit({ slug });
      router.push(`/campaigns/${slug}`);
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setResubmitting(false);
    }
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
        <LoginGate message="Sign in to edit your campaign." />
      </AppShell>
    );
  }

  if (campaign === undefined) {
    return (
      <AppShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
        </View>
      </AppShell>
    );
  }

  if (!campaign) {
    return (
      <AppShell>
        <View className="mx-auto w-full max-w-2xl px-4 py-16">
          <Text className="text-center text-[#5c574f]">
            Campaign not found, or you don&apos;t own this campaign.
          </Text>
        </View>
      </AppShell>
    );
  }

  if (!campaign.editable) {
    return (
      <AppShell>
        <View className="mx-auto w-full max-w-2xl px-4 py-16">
          <Text className="font-retro-bold text-xl text-retro-ink">
            This campaign can&apos;t be edited right now
          </Text>
          <Text className="mt-2 text-sm text-[#5c574f]">
            Only campaigns that are pending, rejected, or have changes
            requested can be edited.
          </Text>
          <Pressable
            onPress={() => router.push(`/campaigns/${campaign.id}`)}
            className={`mt-6 self-start ${primaryBtnClass}`}
          >
            <Text className="font-retro-bold text-sm text-retro-paper">
              View campaign
            </Text>
          </Pressable>
        </View>
      </AppShell>
    );
  }

  const canResubmit = campaign.status === "rejected" || campaign.status === "changes_requested";

  return (
    <AppShell>
      <ScrollView>
        <View className="mx-auto w-full max-w-2xl px-4 py-8">
          <Text className="font-retro-bold text-2xl text-retro-ink">Edit campaign</Text>
          <Text className="mt-1 text-sm text-[#5c574f]">
            {campaign.status === "changes_requested"
              ? "An admin requested changes — update the fields below and resubmit for review."
              : campaign.status === "rejected"
                ? "Update the fields below and resubmit for review."
                : "Update your campaign details."}
          </Text>

          <View className="mt-6 gap-5 rounded-[14px] border-[3px] border-retro-ink bg-retro-paper p-6 shadow-[5px_5px_0_#211E1A]">
            <View>
              <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
                Campaign Title
              </Text>
              <TextInput value={title} onChangeText={setTitle} className={inputClass} />
            </View>

            <View>
              <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <Pressable
                      key={key}
                      onPress={() => setCategory(key)}
                      className={`rounded-lg border-2 px-3 py-2.5 ${
                        category === key ? "border-retro-ink bg-retro-mint/10" : "border-retro-ink"
                      }`}
                    >
                      <Text
                        className={`font-retro-bold text-xs ${
                          category === key ? "text-retro-mint" : "text-[#5c574f]"
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
              <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
                Short Description
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                className={inputClass}
              />
            </View>

            <View>
              <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
                Your Story
              </Text>
              <TextInput
                value={story}
                onChangeText={setStory}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                className={`${inputClass} min-h-[140px]`}
              />
            </View>

            <View>
              <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
                Funding Goal (£)
              </Text>
              <TextInput
                value={goal}
                onChangeText={setGoal}
                keyboardType="numeric"
                className={inputClass}
              />
              {goalInvalid ? (
                <Text className="mt-1 text-xs text-rose-700">
                  Enter your goal as a plain number, e.g. 3500.
                </Text>
              ) : null}
            </View>

            <View className="flex-row flex-wrap items-center gap-3">
              <Pressable
                onPress={() => void handleSave()}
                disabled={saving || !title.trim() || goalInvalid}
                className={`${primaryBtnClass} ${
                  saving || !title.trim() || goalInvalid ? "opacity-50" : ""
                }`}
              >
                <Text className="font-retro-bold text-sm text-retro-paper">
                  {saving ? "Saving..." : "Save changes"}
                </Text>
              </Pressable>

              {canResubmit ? (
                <Pressable
                  onPress={() => void handleResubmit()}
                  disabled={resubmitting}
                  className={`${accentBtnClass} ${resubmitting ? "opacity-50" : ""}`}
                >
                  <Text className="font-retro-bold text-sm text-retro-paper">
                    {resubmitting ? "Resubmitting..." : "Resubmit for review"}
                  </Text>
                </Pressable>
              ) : null}
            </View>

            {info ? (
              <View className="rounded-xl bg-green-50 px-4 py-3">
                <Text className="text-sm text-green-700">{info}</Text>
              </View>
            ) : null}
            {error ? (
              <View className="rounded-xl bg-rose-50 px-4 py-3">
                <Text className="text-sm text-rose-700">{error}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </AppShell>
  );
}
