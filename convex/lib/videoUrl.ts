/** Server-side YouTube / Vimeo URL validation (mirrors lib/video-url.ts). */

export type CampaignVideoProvider = "youtube" | "vimeo";

export interface ParsedCampaignVideo {
  provider: CampaignVideoProvider;
  watchUrl: string;
  embedUrl: string;
}

function youtubeEmbedId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");
  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id || null;
  }
  if (
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "music.youtube.com"
  ) {
    if (url.pathname === "/watch") {
      return url.searchParams.get("v");
    }
    const parts = url.pathname.split("/").filter(Boolean);
    if (
      (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live") &&
      parts[1]
    ) {
      return parts[1];
    }
  }
  return null;
}

function vimeoEmbedId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "vimeo.com" && host !== "player.vimeo.com") {
    return null;
  }
  const parts = url.pathname.split("/").filter(Boolean);
  if (host === "player.vimeo.com" && parts[0] === "video" && parts[1]) {
    return /^\d+$/.test(parts[1]) ? parts[1] : null;
  }
  for (let i = parts.length - 1; i >= 0; i--) {
    if (/^\d+$/.test(parts[i])) {
      return parts[i];
    }
  }
  return null;
}

export function parseCampaignVideoUrl(
  raw: string | null | undefined,
): ParsedCampaignVideo | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return null;
  }

  const youtubeId = youtubeEmbedId(url);
  if (youtubeId) {
    return {
      provider: "youtube",
      watchUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
    };
  }

  const vimeoId = vimeoEmbedId(url);
  if (vimeoId) {
    return {
      provider: "vimeo",
      watchUrl: `https://vimeo.com/${vimeoId}`,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
    };
  }

  return null;
}
