import type { Id } from "@convex/_generated/dataModel";
import { uploadImageToConvexStorage } from "@/lib/convex-storage-upload";

export interface CampaignUpdateMediaUpload {
  uri: string;
  mimeType?: string | null;
}

interface UploadCampaignUpdateMediaOptions {
  slug: string;
  media: CampaignUpdateMediaUpload[];
  generateUploadUrl: (args: { slug: string }) => Promise<string>;
}

export async function uploadCampaignUpdateMedia({
  slug,
  media,
  generateUploadUrl,
}: UploadCampaignUpdateMediaOptions): Promise<Id<"_storage">[]> {
  const storageIds: Id<"_storage">[] = [];

  for (const item of media) {
    const uploadUrl = await generateUploadUrl({ slug });
    const storageId = await uploadImageToConvexStorage(
      uploadUrl,
      item.uri,
      item.mimeType,
    );
    storageIds.push(storageId);
  }

  return storageIds;
}
