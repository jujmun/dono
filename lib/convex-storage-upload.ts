import type { Id } from "@convex/_generated/dataModel";

export async function uploadImageToConvexStorage(
  uploadUrl: string,
  assetUri: string,
  mimeType?: string | null,
): Promise<Id<"_storage">> {
  const response = await fetch(assetUri);
  const blob = await response.blob();
  const contentType = blob.type || mimeType || "image/jpeg";

  const uploadResult = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: blob,
  });

  if (!uploadResult.ok) {
    throw new Error("Image upload failed.");
  }

  const { storageId } = (await uploadResult.json()) as {
    storageId: Id<"_storage">;
  };

  return storageId;
}
