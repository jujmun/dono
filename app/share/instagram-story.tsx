import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "convex/react";
import { Download, Instagram, Copy, Share2 } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import type { Campaign } from "@/lib/types";
import { formatCurrency } from "@/lib/constants";
import { downloadBlob } from "@/lib/download-blob";
import {
  buildCampaignUrl,
  buildInstagramStoryCaption,
  canShareStoryImageFile,
  getSiteOrigin,
  openInstagramStoryCamera,
  renderInstagramStoryPngBlob,
  shareStoryImageToOsSheet,
} from "@/lib/instagram-story";

function parseOptionalNumber(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw == null || raw === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export default function InstagramStorySharePage() {
  const { campaign, amount, matched } = useLocalSearchParams<{
    campaign?: string;
    amount?: string;
    matched?: string;
  }>();
  const campaignSlug = Array.isArray(campaign) ? campaign[0] : campaign;
  const amountValue = parseOptionalNumber(amount);
  const matchedValue = parseOptionalNumber(matched);

  const campaignDoc = useQuery(
    api.campaigns.getBySlug,
    campaignSlug ? { slug: campaignSlug } : "skip",
  ) as Campaign | null | undefined;

  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [storyBlob, setStoryBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState<"share" | "save" | "ig" | "copy" | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [fileShareSupported, setFileShareSupported] = useState(false);
  const autoShareAttempted = useRef(false);

  const siteOrigin = useMemo(() => getSiteOrigin(), []);
  const campaignTitle = campaignDoc?.title ?? "this campaign";
  const campaignUrl = campaignSlug
    ? buildCampaignUrl(siteOrigin, campaignSlug)
    : siteOrigin;

  const caption = buildInstagramStoryCaption({
    campaignTitle,
    campaignUrl,
    amount: amountValue,
  });

  const storyFilename = `dono-story-${campaignSlug ?? "gift"}.png`;

  useEffect(() => {
    setFileShareSupported(canShareStoryImageFile());
  }, []);

  useEffect(() => {
    if (campaignDoc === undefined) return;
    if (Platform.OS !== "web") return;

    let cancelled = false;
    let objectUrl: string | null = null;

    void (async () => {
      const blob = await renderInstagramStoryPngBlob({
        campaignTitle,
        campaignUrl,
        amount: amountValue,
        matchedAmount: matchedValue,
      });
      if (cancelled || !blob) return;
      objectUrl = URL.createObjectURL(blob);
      setStoryBlob(blob);
      setPreviewUri(objectUrl);
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [campaignDoc, campaignTitle, campaignUrl, amountValue, matchedValue]);

  const shareToInstagramSheet = async (blob: Blob) => {
    const result = await shareStoryImageToOsSheet({
      blob,
      filename: storyFilename,
      caption,
    });
    if (result === "shared") {
      setHint("Pick Instagram Stories in the share sheet to post.");
      return true;
    }
    if (result === "cancelled") {
      setHint(null);
      return true;
    }
    return false;
  };

  // Spotify-like: once the story image is ready on mobile, open the OS share
  // sheet so Instagram Stories can be chosen with the image attached.
  useEffect(() => {
    if (!storyBlob || autoShareAttempted.current) return;
    if (Platform.OS !== "web") return;
    if (!canShareStoryImageFile()) return;
    if (typeof window === "undefined") return;
    // Avoid auto-prompt on large desktop viewports; QR scans are phones.
    const likelyPhone = window.matchMedia("(max-width: 900px)").matches;
    if (!likelyPhone) return;

    autoShareAttempted.current = true;
    void (async () => {
      setBusy("share");
      try {
        await shareToInstagramSheet(storyBlob);
      } finally {
        setBusy(null);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when blob ready
  }, [storyBlob]);

  const handleShareStory = async () => {
    setHint(null);
    setBusy("share");
    try {
      let blob = storyBlob;
      if (!blob) {
        blob = await renderInstagramStoryPngBlob({
          campaignTitle,
          campaignUrl,
          amount: amountValue,
          matchedAmount: matchedValue,
        });
      }
      if (!blob) {
        setHint("Could not create the story image on this device.");
        return;
      }
      const ok = await shareToInstagramSheet(blob);
      if (!ok) {
        downloadBlob(blob, storyFilename);
        setHint(
          "Your browser can’t attach the image to Instagram directly. Image saved — add it in Instagram Stories.",
        );
      }
    } finally {
      setBusy(null);
    }
  };

  const handleSave = async () => {
    setHint(null);
    setBusy("save");
    try {
      let blob = storyBlob;
      if (!blob) {
        blob = await renderInstagramStoryPngBlob({
          campaignTitle,
          campaignUrl,
          amount: amountValue,
          matchedAmount: matchedValue,
        });
      }
      if (!blob) {
        setHint("Could not create the story image on this device.");
        return;
      }
      downloadBlob(blob, storyFilename);
      setHint("Story image saved — add it to your Instagram Story.");
    } finally {
      setBusy(null);
    }
  };

  const handleOpenInstagram = async () => {
    setHint(null);
    setBusy("ig");
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(caption).catch(() => undefined);
      }
      await openInstagramStoryCamera();
      setHint("Caption copied. Add your saved story image in Instagram.");
    } finally {
      setBusy(null);
    }
  };

  const handleCopyCaption = async () => {
    setBusy("copy");
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(caption);
        setHint("Caption copied");
      } else {
        setHint(caption);
      }
    } finally {
      setBusy(null);
    }
  };

  if (!campaignSlug) {
    return (
      <View className="min-h-screen flex-1 items-center justify-center bg-retro-cream px-6">
        <Text className="text-center font-retro-bold text-lg text-retro-ink">
          Missing campaign
        </Text>
        <Text className="mt-2 text-center text-sm text-[#5c574f]">
          This Instagram Story link is incomplete.
        </Text>
      </View>
    );
  }

  if (campaignDoc === undefined) {
    return (
      <View className="min-h-screen flex-1 items-center justify-center bg-retro-cream">
        <ActivityIndicator color="#211E1A" />
      </View>
    );
  }

  if (campaignDoc === null) {
    return (
      <View className="min-h-screen flex-1 items-center justify-center bg-retro-cream px-6">
        <Text className="text-center font-retro-bold text-lg text-retro-ink">
          Campaign not found
        </Text>
      </View>
    );
  }

  const displayAmount =
    amountValue != null
      ? amountValue + (matchedValue && matchedValue > 0 ? matchedValue : 0)
      : null;

  return (
    <ScrollView
      className="flex-1 bg-retro-cream"
      contentContainerClassName="items-center px-5 pb-12 pt-8"
    >
      <Text className="font-retro-mono text-xs uppercase text-[#5c574f]">
        Instagram Stories
      </Text>
      <Text className="mt-2 text-center font-retro-bold text-2xl text-retro-ink">
        Share your gift
      </Text>
      <Text className="mt-2 max-w-sm text-center text-sm leading-5 text-[#5c574f]">
        {fileShareSupported
          ? "Tap below and choose Instagram Stories — your story image is ready to post."
          : "Save the story image, then add it in Instagram Stories."}
        {displayAmount != null
          ? ` You gave ${formatCurrency(amountValue!)}${
              matchedValue && matchedValue > 0
                ? ` (${formatCurrency(displayAmount)} with match)`
                : ""
            }.`
          : ""}
      </Text>

      <View className="mt-6 overflow-hidden rounded-[18px] border-[3px] border-retro-ink bg-white shadow-[5px_5px_0_#211E1A]">
        {previewUri ? (
          <Image
            source={{ uri: previewUri }}
            style={{ width: 270, height: 480 }}
            resizeMode="cover"
            accessibilityLabel="Instagram story preview"
          />
        ) : (
          <View
            className="items-center justify-center bg-retro-coral"
            style={{ width: 270, height: 480 }}
          >
            <ActivityIndicator color="#F7F3E8" />
            <Text className="mt-3 font-retro-mono text-xs text-retro-paper">
              Building story…
            </Text>
          </View>
        )}
      </View>

      <View className="mt-8 w-full max-w-sm gap-3">
        <Pressable
          onPress={() => void handleShareStory()}
          disabled={busy != null}
          className="flex-row items-center justify-center gap-2 rounded-full border-2 border-retro-ink bg-retro-mint py-3.5 shadow-[3px_3px_0_#211E1A]"
        >
          {fileShareSupported ? (
            <Share2 size={18} color="#F7F3E8" />
          ) : (
            <Instagram size={18} color="#F7F3E8" />
          )}
          <Text className="font-retro-bold text-sm text-retro-paper">
            {busy === "share"
              ? "Opening…"
              : fileShareSupported
                ? "Add to Instagram Story"
                : "Prepare Instagram Story"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => void handleSave()}
          disabled={busy != null}
          className="flex-row items-center justify-center gap-2 rounded-full border-2 border-retro-ink bg-retro-marigold py-3.5 shadow-[3px_3px_0_#211E1A]"
        >
          <Download size={18} color="#211E1A" />
          <Text className="font-retro-bold text-sm text-retro-ink">
            {busy === "save" ? "Saving…" : "Save story image"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => void handleOpenInstagram()}
          disabled={busy != null}
          className="flex-row items-center justify-center gap-2 rounded-full border-2 border-retro-ink bg-retro-paper py-3"
        >
          <Instagram size={16} color="#211E1A" />
          <Text className="font-retro-bold text-sm text-retro-ink">
            {busy === "ig" ? "Opening…" : "Open Instagram"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => void handleCopyCaption()}
          disabled={busy != null}
          className="flex-row items-center justify-center gap-2 rounded-full border-2 border-retro-ink bg-retro-paper py-3"
        >
          <Copy size={16} color="#211E1A" />
          <Text className="font-retro-bold text-sm text-retro-ink">
            {busy === "copy" ? "Copying…" : "Copy caption"}
          </Text>
        </Pressable>
      </View>

      {hint ? (
        <Text className="mt-4 max-w-sm text-center font-retro-mono text-xs text-[#5c574f]">
          {hint}
        </Text>
      ) : null}
    </ScrollView>
  );
}
