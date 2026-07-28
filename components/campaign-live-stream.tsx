import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { useMutation, useQuery } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { Camera, Gift, GraduationCap, Heart, MessageCircle, X } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { formatCurrency } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/relative-time";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { uploadImageToConvexStorage } from "@/lib/convex-storage-upload";
import { cn } from "@/lib/utils";

const MAX_STREAM_MESSAGE_LENGTH = 500;
const MAX_UPDATE_PHOTO_BYTES = 5 * 1024 * 1024;

type CampaignLiveStreamProps = {
  campaignSlug: string;
  /** Match donate sidebar height on wide campaign layout (width fills column). */
  matchHeight?: number;
  /** Renders inside a shared card with the media hero (no outer border/shadow). */
  connected?: boolean;
};

type PendingPhoto = {
  uri: string;
  mimeType?: string | null;
};

type DonationStreamItem = {
  type: "donation";
  id: string;
  displayName: string;
  amount: number;
  matchedAmountPounds?: number;
  createdAt: number;
};

type UpdateStreamItem = {
  type: "update";
  id: string;
  authorName: string;
  authorInitial: string;
  title: string;
  content: string;
  createdAt: number;
  imageUrl?: string;
};

type StreamItem = DonationStreamItem | UpdateStreamItem;

function UpdatesHeader({ postCount }: { postCount: number }) {
  const label = postCount === 1 ? "1 post" : `${postCount} posts`;
  return (
    <View className="flex-row items-center justify-between border-b-[3px] border-retro-ink px-4 py-3">
      <Text className="font-retro-bold text-sm uppercase tracking-wide text-retro-ink">
        Updates
      </Text>
      <Text className="font-retro-mono text-xs text-[#5c574f]">{label}</Text>
    </View>
  );
}

function UpdatesComposer({
  content,
  setContent,
  pendingPhoto,
  pickingPhoto,
  posting,
  error,
  onPickPhoto,
  onRemovePhoto,
  onPost,
}: {
  content: string;
  setContent: (value: string) => void;
  pendingPhoto: PendingPhoto | null;
  pickingPhoto: boolean;
  posting: boolean;
  error: string | null;
  onPickPhoto: () => void;
  onRemovePhoto: () => void;
  onPost: () => void;
}) {
  const canPost = Boolean(content.trim() || pendingPhoto);

  return (
    <View className="border-b-[3px] border-retro-ink bg-retro-cream px-4 py-3">
      <View className="flex-row gap-3">
        <View className="relative h-[72px] w-[72px] shrink-0">
          <Pressable
            onPress={() => void onPickPhoto()}
            disabled={pickingPhoto || posting}
            className="h-full w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-retro-ink/50 bg-retro-paper"
          >
            {pickingPhoto ? (
              <ActivityIndicator color="#211E1A" size="small" />
            ) : pendingPhoto ? (
              <Image
                source={{ uri: pendingPhoto.uri }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <>
                <Camera size={18} color="#5c574f" />
                <Text className="mt-1 font-retro-mono text-[9px] uppercase text-[#5c574f]">
                  Add photo
                </Text>
              </>
            )}
          </Pressable>
          {pendingPhoto && !pickingPhoto ? (
            <Pressable
              onPress={onRemovePhoto}
              className="absolute right-1 top-1 h-5 w-5 items-center justify-center rounded-full border border-retro-ink bg-retro-paper"
              hitSlop={6}
            >
              <X size={10} color="#211E1A" />
            </Pressable>
          ) : null}
        </View>
        <TextInput
          value={content}
          onChangeText={(value) => setContent(value.slice(0, MAX_STREAM_MESSAGE_LENGTH))}
          placeholder="Say what's happening..."
          placeholderTextColor="#8a8378"
          multiline
          className="min-h-[72px] flex-1 rounded-lg border-2 border-retro-ink bg-white px-3 py-2.5 font-retro-mono text-sm text-retro-ink"
          editable={!posting}
        />
      </View>
      <View className="mt-3 flex-row items-center justify-end gap-3">
        <Text className="font-retro-mono text-[10px] text-[#5c574f]">
          {content.length}/{MAX_STREAM_MESSAGE_LENGTH}
        </Text>
        <Pressable
          onPress={() => void onPost()}
          disabled={posting || !canPost}
          className="rounded-lg border-2 border-retro-ink bg-retro-indigo px-5 py-2 disabled:opacity-50"
        >
          {posting ? (
            <ActivityIndicator color="#F7F3E8" size="small" />
          ) : (
            <Text className="font-retro-mono-bold text-xs uppercase text-retro-paper">
              Post update
            </Text>
          )}
        </Pressable>
      </View>
      {error ? (
        <Text className="mt-2 font-retro-mono text-[11px] text-red-700">{error}</Text>
      ) : null}
    </View>
  );
}

function DonationPost({ item }: { item: DonationStreamItem }) {
  const matched =
    item.matchedAmountPounds && item.matchedAmountPounds > 0
      ? ` (+${formatCurrency(item.matchedAmountPounds)} matched)`
      : "";

  return (
    <View className="border-b-[3px] border-retro-ink bg-retro-cream">
      <View className="flex-row items-center gap-3 px-4 py-3">
        <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-retro-ink bg-retro-mint">
          <Gift size={16} color="#211E1A" />
        </View>
        <Text className="min-w-0 flex-1 font-retro-bold text-sm text-retro-ink" numberOfLines={1}>
          {item.displayName}
        </Text>
        <Text className="font-retro-mono text-xs text-[#5c574f]">
          {formatRelativeTime(item.createdAt)}
        </Text>
      </View>
      <View className="border-t border-retro-ink" />
      <Text className="px-4 py-3 text-sm leading-5 text-retro-ink">
        Donated {formatCurrency(item.amount)}
        {matched ? <Text className="text-[#5c574f]">{matched}</Text> : null}
        {" "}— thank you for supporting this campaign!
      </Text>
    </View>
  );
}

function UpdatePost({ item }: { item: UpdateStreamItem }) {
  return (
    <View className="border-b-[3px] border-retro-ink bg-retro-cream">
      <View className="flex-row items-center gap-3 px-4 py-3">
        <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-retro-ink bg-retro-marigold">
          <GraduationCap size={16} color="#211E1A" />
        </View>
        <Text className="min-w-0 flex-1 font-retro-bold text-sm text-retro-ink" numberOfLines={1}>
          {item.authorName}
        </Text>
        <Text className="font-retro-mono text-xs text-[#5c574f]">
          {formatRelativeTime(item.createdAt)}
        </Text>
      </View>

      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          className="h-44 w-full bg-white"
          resizeMode="cover"
        />
      ) : null}

      {item.content ? (
        <>
          <View className="border-t border-retro-ink" />
          <Text className="px-4 py-3 text-sm leading-5 text-retro-ink">{item.content}</Text>
        </>
      ) : null}

      <View className="flex-row gap-5 border-t border-dashed border-retro-ink/40 px-4 py-2.5">
        <Pressable className="flex-row items-center gap-1.5">
          <Heart size={14} color="#5c574f" />
          <Text className="font-retro-mono text-xs text-[#5c574f]">Like</Text>
        </Pressable>
        <Pressable className="flex-row items-center gap-1.5">
          <MessageCircle size={14} color="#5c574f" />
          <Text className="font-retro-mono text-xs text-[#5c574f]">Comment</Text>
        </Pressable>
      </View>
    </View>
  );
}

function UpdatesFeed({ items }: { items: StreamItem[] | undefined }) {
  if (items === undefined) {
    return (
      <View className="items-center bg-retro-cream py-10">
        <ActivityIndicator color="#211E1A" />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View className="bg-retro-cream px-4 py-8">
        <Text className="text-center font-retro-mono text-sm text-[#5c574f]">
          No updates yet — be the first to share what&apos;s happening.
        </Text>
      </View>
    );
  }

  const newestFirst = [...items].reverse();

  return (
    <>
      {newestFirst.map((item) =>
        item.type === "donation" ? (
          <DonationPost key={item.id} item={item} />
        ) : (
          <UpdatePost key={item.id} item={item} />
        ),
      )}
    </>
  );
}

export function CampaignLiveStream({
  campaignSlug,
  matchHeight,
  connected = false,
}: CampaignLiveStreamProps) {
  const items = useQuery(api.campaignStream.listForCampaign, {
    campaignSlug,
  }) as StreamItem[] | undefined;
  const composeState = useQuery(api.campaignStream.getComposeState, { campaignSlug });
  const publishUpdate = useMutation(api.campaignCreator.publishUpdate);
  const generateImageUploadUrl = useMutation(api.campaignCreator.generateImageUploadUrl);

  const [content, setContent] = useState("");
  const [pendingPhoto, setPendingPhoto] = useState<PendingPhoto | null>(null);
  const [pickingPhoto, setPickingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  const canCompose = composeState?.canCompose ?? false;
  const postCount = items?.length ?? 0;

  const handlePickPhoto = async () => {
    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Photo library permission is required to add photos.");
      return;
    }

    setPickingPhoto(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: false,
        quality: 0.85,
      });

      if (result.canceled || result.assets.length === 0) return;

      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > MAX_UPDATE_PHOTO_BYTES) {
        setError("Photos must be 5MB or smaller.");
        return;
      }

      setPendingPhoto({ uri: asset.uri, mimeType: asset.mimeType });
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setPickingPhoto(false);
    }
  };

  const handlePost = async () => {
    const trimmed = content.trim();
    if (!trimmed && !pendingPhoto) {
      setError("Add a message or photo before posting.");
      return;
    }
    if (trimmed.length > MAX_STREAM_MESSAGE_LENGTH) {
      setError(`Updates must be ${MAX_STREAM_MESSAGE_LENGTH} characters or fewer.`);
      return;
    }

    setPosting(true);
    setError(null);
    try {
      let imageStorageId: Id<"_storage"> | undefined;
      if (pendingPhoto) {
        const uploadUrl = await generateImageUploadUrl({ slug: campaignSlug });
        imageStorageId = await uploadImageToConvexStorage(
          uploadUrl,
          pendingPhoto.uri,
          pendingPhoto.mimeType,
        );
      }

      await publishUpdate({
        slug: campaignSlug,
        content: trimmed,
        imageStorageId,
      });
      setContent("");
      setPendingPhoto(null);
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setPosting(false);
    }
  };

  return (
    <View
      className={cn(
        "w-full bg-retro-cream",
        connected ? "h-full" : "overflow-hidden rounded-[14px] border-[3px] border-retro-ink shadow-[5px_5px_0_#211E1A]",
      )}
      style={
        matchHeight != null
          ? { height: matchHeight, flexDirection: "column" }
          : connected
            ? { flexDirection: "column", flex: 1 }
            : undefined
      }
    >
      <UpdatesHeader postCount={postCount} />

      {canCompose ? (
        <UpdatesComposer
          content={content}
          setContent={setContent}
          pendingPhoto={pendingPhoto}
          pickingPhoto={pickingPhoto}
          posting={posting}
          error={error}
          onPickPhoto={handlePickPhoto}
          onRemovePhoto={() => setPendingPhoto(null)}
          onPost={handlePost}
        />
      ) : null}

      <ScrollView
        className={cn("bg-retro-cream", matchHeight != null ? "min-h-0 flex-1" : "max-h-[420px]")}
        style={matchHeight != null ? { flex: 1 } : undefined}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator
      >
        <UpdatesFeed items={items} />
      </ScrollView>
    </View>
  );
}
