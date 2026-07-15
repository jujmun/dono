import type { Campaign } from "@/lib/types";

const PHOTO_URI_PATTERN = /^(https?|file|blob|data):/;

export const MAX_CAMPAIGN_IMAGES = 5;

export function isCampaignPhotoSource(image: string): boolean {
  return PHOTO_URI_PATTERN.test(image);
}

/** Resolved display URLs/keys for a campaign's image gallery. */
export function getCampaignImages(
  campaign: Pick<Campaign, "image" | "images"> & { category: string },
): string[] {
  if (campaign.images?.length) {
    return campaign.images;
  }

  if (campaign.image !== "default" && isCampaignPhotoSource(campaign.image)) {
    return [campaign.image];
  }

  return [];
}

export function getPrimaryCampaignImage(
  campaign: Pick<Campaign, "image" | "images"> & { category: string },
): string {
  const images = getCampaignImages(campaign);
  if (images.length > 0) {
    return images[0];
  }
  return campaign.image === "default" ? campaign.category : campaign.image;
}
