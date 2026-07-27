/** Validate a remotely hosted MP3 URL for campaign audio. */
export function parseCampaignAudioUrl(raw: string | null | undefined): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (
    (url.protocol !== "http:" && url.protocol !== "https:") ||
    !url.pathname.toLowerCase().endsWith(".mp3")
  ) {
    return null;
  }

  return url.toString();
}
