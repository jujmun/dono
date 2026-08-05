import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { CheckCircle2, ImagePlus } from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { LoginGate } from "@/components/login-gate";
import { CampaignImage } from "@/components/ui/campaign-image";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { uploadImageToConvexStorage } from "@/lib/convex-storage-upload";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { OrgType } from "@/lib/types";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_DESCRIPTION = 500;

function isValidOptionalUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

export function EditSocietyForm({
  editSlug,
  orgType,
}: {
  editSlug: string;
  orgType: OrgType;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const editSociety = useQuery(
    api.societies.getMineForEdit,
    isAuthenticated ? { slug: editSlug } : "skip",
  );
  const pendingEdit = useQuery(
    api.societyEditRequests.getPendingForEntity,
    isAuthenticated ? { slug: editSlug } : "skip",
  );
  const proposeEdit = useMutation(api.societyEditRequests.propose);
  const generateUploadUrl = useMutation(api.societies.generateUploadUrl);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [secondaryLink, setSecondaryLink] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [coverStorageId, setCoverStorageId] = useState<Id<"_storage"> | null>(
    null,
  );
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (editSociety && loadedSlug !== editSociety.slug) {
      setName(editSociety.name);
      setDescription(editSociety.description);
      setStory(editSociety.story);
      setWebsiteUrl(editSociety.websiteUrl);
      setSecondaryLink(editSociety.secondaryLink);
      setSocialUrl(editSociety.socialUrl);
      setCoverUri(editSociety.coverImageUrl);
      setCoverStorageId(null);
      setLoadedSlug(editSociety.slug);
    }
  }, [editSociety, loadedSlug]);

  const inputClass =
    "w-full rounded-lg border-2 border-retro-ink bg-white px-4 py-2.5 font-retro-mono text-sm text-retro-ink outline-none";
  const primaryBtnClass =
    "retro-key items-center rounded-full border-2 border-retro-ink bg-retro-mint px-5 py-2.5";

  const pickCover = async () => {
    setPicking(true);
    setError(null);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.85,
      });
      if (result.canceled || !result.assets[0]) return;
      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > MAX_FILE_BYTES) {
        setError("Cover image must be under 5MB.");
        return;
      }
      setCoverUri(asset.uri);
      const uploadUrl = await generateUploadUrl({});
      const storageId = await uploadImageToConvexStorage(
        uploadUrl,
        asset.uri,
        asset.mimeType ?? "image/jpeg",
      );
      setCoverStorageId(storageId);
    } catch (err) {
      setError(getFriendlyAuthError(err) || "Could not upload cover image.");
    } finally {
      setPicking(false);
    }
  };

  const canSubmit =
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    description.trim().length <= MAX_DESCRIPTION &&
    story.trim().length > 0 &&
    isValidOptionalUrl(websiteUrl) &&
    isValidOptionalUrl(secondaryLink) &&
    isValidOptionalUrl(socialUrl);

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await proposeEdit({
        slug: editSlug,
        proposed: {
          name: name.trim(),
          description: description.trim(),
          story: story.trim(),
          websiteUrl: websiteUrl.trim(),
          secondaryLink: secondaryLink.trim(),
          socialUrl: socialUrl.trim(),
          ...(coverStorageId ? { coverImageStorageId: coverStorageId } : {}),
        },
      });
      setDone(true);
    } catch (err) {
      setError(getFriendlyAuthError(err) || "Failed to submit edits for review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || (isAuthenticated && editSociety === undefined)) {
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
        <LoginGate message="Sign in to edit your society." />
      </AppShell>
    );
  }

  if (editSociety === null) {
    return (
      <AppShell>
        <View className="mx-auto w-full max-w-2xl px-4 py-16">
          <Text className="font-retro-bold text-xl text-retro-ink">
            Society not found
          </Text>
          <Text className="mt-2 text-sm text-[#5c574f]">
            You can only edit societies you created or lead.
          </Text>
        </View>
      </AppShell>
    );
  }

  if (!editSociety) {
    return (
      <AppShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
        </View>
      </AppShell>
    );
  }

  if (!editSociety.requiresApproval) {
    return (
      <AppShell>
        <View className="mx-auto w-full max-w-2xl px-4 py-16">
          <Text className="font-retro-bold text-xl text-retro-ink">
            This society can&apos;t be edited right now
          </Text>
          <Text className="mt-2 text-sm text-[#5c574f]">
            Only active societies can propose profile edits for admin review.
          </Text>
          <Pressable
            onPress={() => router.push(`/societies/${editSociety.slug}`)}
            className={`mt-6 self-start ${primaryBtnClass}`}
          >
            <Text className="font-retro-bold text-sm text-retro-paper">
              View society
            </Text>
          </Pressable>
        </View>
      </AppShell>
    );
  }

  if (done) {
    return (
      <AppShell>
        <View className="mx-auto w-full max-w-2xl items-center px-4 py-16">
          <CheckCircle2 size={32} color="#17211B" />
          <Text className="mt-3 text-center text-lg font-retro-bold text-retro-ink">
            Submitted for review
          </Text>
          <Text className="mt-2 text-center text-sm text-[#5c574f]">
            Your live page stays unchanged until an admin approves your edits.
          </Text>
          <Link href={`/societies/${editSlug}`} asChild>
            <Pressable className={`mt-6 ${primaryBtnClass}`}>
              <Text className="font-retro-bold text-sm text-retro-paper">
                Back to {orgType === "college" ? "college" : "society"}
              </Text>
            </Pressable>
          </Link>
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-2xl px-4 py-8">
        <Text className="mb-1 text-center font-retro-bold text-2xl text-retro-ink">
          Edit {orgType === "college" ? "College" : "Society"}
        </Text>
        <Text className="mb-6 text-center text-sm text-[#5c574f]">
          Propose changes for admin review. The public page stays as-is until
          approved.
        </Text>

        {pendingEdit ? (
          <View className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <Text className="text-sm text-amber-900">
              You already have edits pending review. Submitting again will
              replace them.
            </Text>
          </View>
        ) : null}

        <View className="gap-4 rounded-[14px] border-[3px] border-retro-ink bg-retro-paper p-6">
          <View className="gap-1.5">
            <Text className="font-retro-bold text-sm text-retro-ink">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              className={inputClass}
              placeholderTextColor="#9a948a"
            />
          </View>

          <View className="gap-1.5">
            <Text className="font-retro-bold text-sm text-retro-ink">
              Short description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              className={`${inputClass} min-h-[72px]`}
              multiline
              placeholderTextColor="#9a948a"
            />
            <Text className="text-xs text-[#5c574f]">
              {description.trim().length}/{MAX_DESCRIPTION}
            </Text>
          </View>

          <View className="gap-1.5">
            <Text className="font-retro-bold text-sm text-retro-ink">About</Text>
            <TextInput
              value={story}
              onChangeText={setStory}
              className={`${inputClass} min-h-[120px]`}
              multiline
              placeholderTextColor="#9a948a"
            />
          </View>

          <View className="gap-1.5">
            <Text className="font-retro-bold text-sm text-retro-ink">Website</Text>
            <TextInput
              value={websiteUrl}
              onChangeText={setWebsiteUrl}
              autoCapitalize="none"
              className={inputClass}
              placeholderTextColor="#9a948a"
            />
          </View>

          <View className="gap-1.5">
            <Text className="font-retro-bold text-sm text-retro-ink">
              Secondary link
            </Text>
            <TextInput
              value={secondaryLink}
              onChangeText={setSecondaryLink}
              autoCapitalize="none"
              className={inputClass}
              placeholderTextColor="#9a948a"
            />
          </View>

          {orgType === "college" ? (
            <View className="gap-1.5">
              <Text className="font-retro-bold text-sm text-retro-ink">
                Social URL
              </Text>
              <TextInput
                value={socialUrl}
                onChangeText={setSocialUrl}
                autoCapitalize="none"
                className={inputClass}
                placeholderTextColor="#9a948a"
              />
            </View>
          ) : null}

          <View className="gap-2">
            <Text className="font-retro-bold text-sm text-retro-ink">Cover</Text>
            {coverUri ? (
              coverUri.startsWith("http") || coverUri.startsWith("file") || coverUri.startsWith("data") ? (
                <Image
                  source={{ uri: coverUri }}
                  className="h-40 w-full rounded-xl"
                  resizeMode="cover"
                />
              ) : (
                <CampaignImage image={coverUri} className="h-40 rounded-xl" />
              )
            ) : (
              <View className="h-40 items-center justify-center rounded-xl bg-retro-cream">
                <Text className="text-sm text-[#5c574f]">No cover image</Text>
              </View>
            )}
            <Pressable
              onPress={() => void pickCover()}
              disabled={picking}
              className={`flex-row items-center gap-2 self-start ${primaryBtnClass} ${picking ? "opacity-50" : ""}`}
            >
              <ImagePlus size={16} color="#fff" />
              <Text className="font-retro-bold text-sm text-retro-paper">
                {picking ? "Uploading..." : "Change cover"}
              </Text>
            </Pressable>
          </View>

          {error ? (
            <View className="rounded-xl bg-rose-50 px-4 py-3">
              <Text className="text-sm text-rose-700">{error}</Text>
            </View>
          ) : null}

          <Pressable
            onPress={() => void handleSubmit()}
            disabled={!canSubmit || submitting}
            className={`${primaryBtnClass} ${!canSubmit || submitting ? "opacity-50" : ""}`}
          >
            <Text className="font-retro-bold text-sm text-retro-paper">
              {submitting ? "Submitting..." : "Submit for review"}
            </Text>
          </Pressable>
        </View>
      </View>
    </AppShell>
  );
}
