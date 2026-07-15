import type { Id } from "@convex/_generated/dataModel";
import { uploadImageToConvexStorage } from "@/lib/convex-storage-upload";

export interface CampaignImageUpload {
  uri: string;
  mimeType?: string | null;
}

interface UploadCampaignImagesOptions {
  slug: string;
  images: CampaignImageUpload[];
  generateUploadUrl: (args: { slug: string }) => Promise<string>;
  setImage: (args: {
    slug: string;
    storageId: Id<"_storage">;
  }) => Promise<null | undefined>;
  setImages?: (args: {
    slug: string;
    storageIds: Id<"_storage">[];
  }) => Promise<null | undefined>;
}

export async function uploadCampaignImages({
  slug,
  images,
  generateUploadUrl,
  setImage,
  setImages,
}: UploadCampaignImagesOptions): Promise<boolean> {
  if (images.length === 0) {
    return true;
  }

  const storageIds: Id<"_storage">[] = [];

  for (const image of images) {
    const uploadUrl = await generateUploadUrl({ slug });
    const storageId = await uploadImageToConvexStorage(
      uploadUrl,
      image.uri,
      image.mimeType,
    );
    storageIds.push(storageId);
  }

  if (setImages) {
    await setImages({ slug, storageIds });
    return true;
  }

  await setImage({ slug, storageId: storageIds[0] });
  return storageIds.length === 1;
}
