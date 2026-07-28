import type { Doc, Id } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import { toCampaign } from "./mappers";

type CampaignDoc = Doc<"campaigns">;

/** Resolve fresh Convex storage URLs for campaign hero/gallery images. */
export async function enrichCampaignWithMedia(
  ctx: Pick<QueryCtx, "storage">,
  campaign: CampaignDoc,
) {
  const base = toCampaign(campaign);

  const storageIds: Id<"_storage">[] = [];
  if (campaign.imageStorageIds?.length) {
    storageIds.push(...campaign.imageStorageIds);
  } else if (campaign.imageStorageId) {
    storageIds.push(campaign.imageStorageId);
  }

  if (storageIds.length === 0) {
    return base;
  }

  const urls = await Promise.all(storageIds.map((id) => ctx.storage.getUrl(id)));
  const resolved = urls.filter((url): url is string => Boolean(url));
  if (resolved.length === 0) {
    return base;
  }

  return {
    ...base,
    image: resolved[0],
    images: resolved,
  };
}

export async function enrichCampaignsWithMedia(
  ctx: Pick<QueryCtx, "storage">,
  campaigns: CampaignDoc[],
) {
  return await Promise.all(
    campaigns.map((campaign) => enrichCampaignWithMedia(ctx, campaign)),
  );
}
