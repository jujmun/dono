import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Image,
  Platform,
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
const OVERLAY_LATEST_COUNT = 3;

type CampaignLiveStreamProps = {
  campaignSlug: string;
  /** Match donate sidebar height on wide campaign layout (width fills column). */
  matchHeight?: number;
  /** Renders inside a shared card with the media hero (no outer border/shadow). */
  connected?: boolean;
  /**
   * `overlay` — compact latest posts on an ombre fade over the hero image.
   * `panel` — full bordered/connected updates panel (default).
   */
  variant?: "panel" | "overlay";
  /**
   * Extra right padding for overlay content (e.g. clear a floating donate card).
   * Ombre still spans the full width — only the text/composer insets.
   */
  contentInsetRight?: number;
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

const OVERLAY_OMBRE_STYLE =
  Platform.OS === "web"
    ? ({
        backgroundImage:
          "linear-gradient(to top, rgba(33,30,26,0.88) 0%, rgba(33,30,26,0.55) 45%, rgba(33,30,26,0.15) 75%, transparent 100%)",
      } as const)
    : ({ backgroundColor: "rgba(33,30,26,0.78)" } as const);

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

function OverlayUpdatesHeader({ postCount }: { postCount: number }) {
  const label = postCount === 1 ? "1 post" : `${postCount} posts`;
  return (
    <View className="mb-2 flex-row items-baseline gap-2 px-1">
      <Text className="font-retro-bold text-sm uppercase tracking-wide text-retro-paper">
        Updates
      </Text>
      <Text className="font-retro-mono text-xs text-retro-paper/70">{label}</Text>
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
  compact = false,
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
  compact?: boolean;
}) {
  const canPost = Boolean(content.trim() || pendingPhoto);

  return (
    <View
      className={cn(
        compact
          ? "mb-2 rounded-lg border border-retro-paper/30 bg-black/25 px-3 py-2"
          : "border-b-[3px] border-retro-ink bg-retro-cream px-4 py-3",
      )}
    >
      <View className="flex-row gap-3">
        <View className={cn("relative shrink-0", compact ? "h-12 w-12" : "h-[72px] w-[72px]")}>
          <Pressable
            onPress={() => void onPickPhoto()}
            disabled={pickingPhoto || posting}
            className={cn(
              "h-full w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed",
              compact
                ? "border-retro-paper/40 bg-black/20"
                : "border-retro-ink/50 bg-retro-paper",
            )}
          >
            {pickingPhoto ? (
              <ActivityIndicator color={compact ? "#F7F3E8" : "#211E1A"} size="small" />
            ) : pendingPhoto ? (
              <Image
                source={{ uri: pendingPhoto.uri }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <>
                <Camera size={compact ? 14 : 18} color={compact ? "#F7F3E8" : "#5c574f"} />
                {!compact ? (
                  <Text className="mt-1 font-retro-mono text-[9px] uppercase text-[#5c574f]">
                    Add photo
                  </Text>
                ) : null}
              </>
            )}
          </Pressable>
          {pendingPhoto && !pickingPhoto ? (
            <Pressable
              onPress={onRemovePhoto}
              className="retro-key absolute right-1 top-1 h-5 w-5 items-center justify-center rounded-full border border-retro-ink bg-retro-paper"
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
          placeholderTextColor={compact ? "#c4bfb4" : "#8a8378"}
          multiline
          className={cn(
            "flex-1 rounded-lg border-2 px-3 py-2.5 font-retro-mono text-sm",
            compact
              ? "min-h-[48px] border-retro-paper/30 bg-black/20 text-retro-paper"
              : "min-h-[72px] border-retro-ink bg-white text-retro-ink",
          )}
          editable={!posting}
        />
      </View>
      <View className="mt-2 flex-row items-center justify-end gap-3">
        <Text
          className={cn(
            "font-retro-mono text-[10px]",
            compact ? "text-retro-paper/60" : "text-[#5c574f]",
          )}
        >
          {content.length}/{MAX_STREAM_MESSAGE_LENGTH}
        </Text>
        <Pressable
          onPress={() => void onPost()}
          disabled={posting || !canPost}
          className="rounded-lg border-2 border-retro-ink bg-retro-indigo px-4 py-1.5 disabled:opacity-50"
        >
          {posting ? (
            <ActivityIndicator color="#F7F3E8" size="small" />
          ) : (
            <Text className="font-retro-mono-bold text-xs uppercase text-retro-paper">
              Post
            </Text>
          )}
        </Pressable>
      </View>
      {error ? (
        <Text
          className={cn(
            "mt-2 font-retro-mono text-[11px]",
            compact ? "text-rose-300" : "text-red-700",
          )}
        >
          {error}
        </Text>
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

function OverlayDonationPost({ item }: { item: DonationStreamItem }) {
  const matched =
    item.matchedAmountPounds && item.matchedAmountPounds > 0
      ? ` (+${formatCurrency(item.matchedAmountPounds)} matched)`
      : "";

  return (
    <View className="mb-2.5">
      <View className="mb-0.5 flex-row items-center gap-2">
        <View className="h-6 w-6 items-center justify-center rounded-full border border-retro-paper/50 bg-retro-mint">
          <Gift size={11} color="#211E1A" />
        </View>
        <Text className="min-w-0 flex-1 font-retro-bold text-sm text-retro-paper" numberOfLines={1}>
          {item.displayName}
        </Text>
        <Text className="font-retro-mono text-[10px] text-retro-paper/65">
          {formatRelativeTime(item.createdAt)}
        </Text>
      </View>
      <Text className="pl-8 text-sm leading-5 text-retro-paper/90" numberOfLines={2}>
        Donated {formatCurrency(item.amount)}
        {matched}
        {" "}— thank you!
      </Text>
    </View>
  );
}

function OverlayUpdatePost({ item }: { item: UpdateStreamItem }) {
  return (
    <View className="mb-2.5">
      <View className="mb-0.5 flex-row items-center gap-2">
        <View className="h-6 w-6 items-center justify-center rounded-full border border-retro-paper/50 bg-retro-marigold">
          <GraduationCap size={11} color="#211E1A" />
        </View>
        <Text className="min-w-0 flex-1 font-retro-bold text-sm text-retro-paper" numberOfLines={1}>
          {item.authorName}
        </Text>
        <Text className="font-retro-mono text-[10px] text-retro-paper/65">
          {formatRelativeTime(item.createdAt)}
        </Text>
      </View>
      {item.content ? (
        <Text className="pl-8 text-sm leading-5 text-retro-paper/90" numberOfLines={2}>
          {item.content}
        </Text>
      ) : null}
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

function OverlayUpdatesFeed({ items }: { items: StreamItem[] | undefined }) {
  if (items === undefined) {
    return (
      <View className="items-center py-4">
        <ActivityIndicator color="#F7F3E8" />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <Text className="font-retro-mono text-sm text-retro-paper/75">
        No updates yet — be the first to share what&apos;s happening.
      </Text>
    );
  }

  const latest = [...items].reverse().slice(0, OVERLAY_LATEST_COUNT);

  return (
    <>
      {latest.map((item) =>
        item.type === "donation" ? (
          <OverlayDonationPost key={item.id} item={item} />
        ) : (
          <OverlayUpdatePost key={item.id} item={item} />
        ),
      )}
    </>
  );
}

export function CampaignLiveStream({
  campaignSlug,
  matchHeight,
  connected = false,
  variant = "panel",
  contentInsetRight,
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
  const isOverlay = variant === "overlay";

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

  const composer = canCompose ? (
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
      compact={isOverlay}
    />
  ) : null;

  if (isOverlay) {
    return (
      <View
        className="w-full px-4 pb-4 pt-10"
        style={[
          OVERLAY_OMBRE_STYLE,
          contentInsetRight != null ? { paddingRight: contentInsetRight } : null,
        ]}
      >
        <OverlayUpdatesHeader postCount={postCount} />
        {composer}
        <ScrollView
          className="max-h-40"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <OverlayUpdatesFeed items={items} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      className={cn(
        "w-full bg-retro-cream",
        connected ? "h-full" : "overflow-hidden rounded-[14px] border-[3px] border-retro-ink",
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

      {composer}

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
