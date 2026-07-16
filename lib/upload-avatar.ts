import type { Id } from "@convex/_generated/dataModel";

type ImageAsset = {
  uri: string;
  mimeType?: string | null;
  fileSize?: number | null;
};

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export async function uploadImageToConvexStorage(
  uploadUrl: string,
  asset: ImageAsset,
): Promise<Id<"_storage">> {
  if (asset.fileSize && asset.fileSize > MAX_AVATAR_BYTES) {
    throw new Error("Avatar must be 5MB or smaller.");
  }

  const response = await fetch(asset.uri);
  const blob = await response.blob();
  const contentType = blob.type || asset.mimeType || "image/jpeg";

  const uploadResult = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: blob,
  });

  if (!uploadResult.ok) {
    throw new Error("Upload failed.");
  }

  const { storageId } = (await uploadResult.json()) as {
    storageId: Id<"_storage">;
  };

  return storageId;
}
