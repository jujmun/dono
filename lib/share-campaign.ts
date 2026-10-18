import { Platform, Share } from "react-native";
import { isCampaignPhotoSource } from "@/lib/campaign-images";
import { canShareStoryImageFile, shareStoryImageToOsSheet } from "@/lib/instagram-story";

export type ShareCampaignResult = "shared" | "copied" | "cancelled" | "failed";

/**
 * Shares a campaign message + link, attaching the campaign's real thumbnail
 * photo when possible (Web Share API with files). Falls back to the
 * text/link-only share sheet when there's no real photo, the photo can't be
 * fetched, or the browser doesn't support file sharing.
 */
export async function shareCampaignWithThumbnail(args: {
  url: string;
  message: string;
  image?: string | null;
}): Promise<ShareCampaignResult> {
  if (Platform.OS === "web" && args.image && isCampaignPhotoSource(args.image) && canShareStoryImageFile()) {
    try {
      const response = await fetch(args.image);
      const blob = await response.blob();
      const result = await shareStoryImageToOsSheet({
        blob,
        filename: "campaign.jpg",
        caption: `${args.message}\n${args.url}`,
      });
      if (result === "shared") return "shared";
      if (result === "cancelled") return "cancelled";
      // "unsupported" — fall through to the text-only share below.
    } catch {
      // Fetching/decoding the thumbnail failed — fall through to text-only share.
    }
  }

  try {
    await Share.share(
      Platform.OS === "ios"
        ? { url: args.url, message: args.message }
        : { message: `${args.message}\n${args.url}` },
    );
    return "shared";
  } catch {
    if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(`${args.message}\n${args.url}`);
      return "copied";
    }
    return "failed";
  }
}
