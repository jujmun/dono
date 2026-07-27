import { formatCurrency } from "./constants";

export const INSTAGRAM_STORY_WIDTH = 1080;
export const INSTAGRAM_STORY_HEIGHT = 1920;

export type InstagramStoryShareParams = {
  siteOrigin: string;
  campaignSlug: string;
  amount?: number;
  matchedAmount?: number;
};

function normalizeOrigin(value: string | undefined | null): string | null {
  if (!value) return null;
  const trimmed = value.trim().replace(/\/$/, "");
  return trimmed || null;
}

/** True for origins a phone cannot open via QR from another device. */
export function isLoopbackOrigin(origin: string): boolean {
  try {
    const host = new URL(origin).hostname.toLowerCase();
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "[::1]" ||
      host === "::1"
    );
  } catch {
    return /localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]/.test(origin);
  }
}

/**
 * Origin for links that must work off-device (QR scan on a phone).
 * Prefers EXPO_PUBLIC_SITE_URL when the current page is localhost.
 */
export function getSiteOrigin(): string {
  const fromEnv = normalizeOrigin(process.env.EXPO_PUBLIC_SITE_URL);
  const windowOrigin =
    typeof window !== "undefined" && window.location?.origin
      ? normalizeOrigin(window.location.origin)
      : null;

  if (windowOrigin && !isLoopbackOrigin(windowOrigin)) {
    return windowOrigin;
  }
  if (fromEnv) {
    return fromEnv;
  }
  if (windowOrigin) {
    return windowOrigin;
  }
  return "https://joindono.com";
}

/**
 * Best-effort LAN IPv4 for rewriting localhost → phone-reachable QR URLs
 * on the same Wi‑Fi. Returns null if unavailable (permissions / browser).
 */
async function detectLanIpv4(): Promise<string | null> {
  if (typeof window === "undefined" || typeof RTCPeerConnection === "undefined") {
    return null;
  }

  return await new Promise((resolve) => {
    let settled = false;
    const finish = (value: string | null) => {
      if (settled) return;
      settled = true;
      try {
        pc.close();
      } catch {
        // ignore
      }
      resolve(value);
    };

    const pc = new RTCPeerConnection({ iceServers: [] });
    const timeout = window.setTimeout(() => finish(null), 1500);

    try {
      pc.createDataChannel("dono-qr");
      void pc.createOffer().then((offer) => pc.setLocalDescription(offer));
    } catch {
      window.clearTimeout(timeout);
      finish(null);
      return;
    }

    pc.onicecandidate = (event) => {
      const candidate = event.candidate?.candidate;
      if (!candidate) return;
      const match = /([0-9]{1,3}(?:\.[0-9]{1,3}){3})/.exec(candidate);
      if (!match) return;
      const ip = match[1];
      if (
        ip.startsWith("127.") ||
        ip.startsWith("0.") ||
        ip.startsWith("169.254.")
      ) {
        return;
      }
      window.clearTimeout(timeout);
      finish(ip);
    };
  });
}

/**
 * Origin encoded in QR codes. Always returns a value so the QR can render.
 * On localhost, rewrites to LAN IP when possible so phones on the same Wi‑Fi
 * can open the share page; otherwise falls back to EXPO_PUBLIC_SITE_URL /
 * window origin.
 */
export async function resolveQrShareOrigin(): Promise<string> {
  const fromEnv = normalizeOrigin(process.env.EXPO_PUBLIC_SITE_URL);
  if (fromEnv && !isLoopbackOrigin(fromEnv)) {
    return fromEnv;
  }

  const windowOrigin =
    typeof window !== "undefined" && window.location?.origin
      ? normalizeOrigin(window.location.origin)
      : null;

  if (windowOrigin && !isLoopbackOrigin(windowOrigin)) {
    return windowOrigin;
  }

  if (windowOrigin && isLoopbackOrigin(windowOrigin)) {
    const lanIp = await detectLanIpv4();
    if (lanIp) {
      try {
        const url = new URL(windowOrigin);
        url.hostname = lanIp;
        return url.origin;
      } catch {
        // fall through
      }
    }
  }

  return getSiteOrigin();
}

/** @deprecated Prefer resolveQrShareOrigin — sync helper for non-QR uses. */
export function getQrShareOrigin(): string {
  return getSiteOrigin();
}

export function buildInstagramStoryShareUrl({
  siteOrigin,
  campaignSlug,
  amount,
  matchedAmount,
}: InstagramStoryShareParams): string {
  const origin = siteOrigin.replace(/\/$/, "");
  const params = new URLSearchParams();
  params.set("campaign", campaignSlug);
  if (amount != null && Number.isFinite(amount)) {
    params.set("amount", String(amount));
  }
  if (matchedAmount != null && matchedAmount > 0 && Number.isFinite(matchedAmount)) {
    params.set("matched", String(matchedAmount));
  }
  return `${origin}/share/instagram-story?${params.toString()}`;
}

export function buildCampaignUrl(siteOrigin: string, campaignSlug: string): string {
  return `${siteOrigin.replace(/\/$/, "")}/campaigns/${campaignSlug}`;
}

export function buildInstagramStoryCaption({
  campaignTitle,
  campaignUrl,
  amount,
}: {
  campaignTitle: string;
  campaignUrl: string;
  amount?: number;
}): string {
  const amountLabel =
    amount != null && Number.isFinite(amount) ? formatCurrency(amount) : "a gift";
  return `I just gave ${amountLabel} to support ${campaignTitle} on Dono. Join me: ${campaignUrl}`;
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 5);
}

/** Web-only: render a 9:16 Instagram Story PNG. Returns null outside the browser. */
export async function renderInstagramStoryPngBlob(args: {
  campaignTitle: string;
  campaignUrl: string;
  amount?: number;
  matchedAmount?: number;
}): Promise<Blob | null> {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = INSTAGRAM_STORY_WIDTH;
  canvas.height = INSTAGRAM_STORY_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const ink = "#211E1A";
  const cream = "#F7F3E8";
  const coral = "#F2542D";
  const mint = "#159E88";
  const paper = "#FFFbf5";

  // Background
  ctx.fillStyle = cream;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Coral hero band
  ctx.fillStyle = coral;
  ctx.fillRect(0, 0, canvas.width, 520);

  // Border frame
  ctx.strokeStyle = ink;
  ctx.lineWidth = 24;
  ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

  // Brand
  ctx.fillStyle = paper;
  ctx.font = "bold 64px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("DONO", canvas.width / 2, 180);

  ctx.font = "32px ui-monospace, monospace";
  ctx.fillText("I SUPPORTED THIS", canvas.width / 2, 260);

  // Amount card
  const displayAmount =
    args.amount != null && Number.isFinite(args.amount)
      ? formatCurrency(
          args.matchedAmount && args.matchedAmount > 0
            ? args.amount + args.matchedAmount
            : args.amount,
        )
      : null;

  const cardX = 120;
  const cardY = 620;
  const cardW = canvas.width - 240;
  const cardH = 780;

  ctx.fillStyle = paper;
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 10;
  ctx.strokeRect(cardX, cardY, cardW, cardH);
  // Drop shadow block
  ctx.fillStyle = ink;
  ctx.fillRect(cardX + 18, cardY + cardH + 8, cardW, 18);

  if (displayAmount) {
    ctx.fillStyle = mint;
    ctx.font = "bold 140px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText(displayAmount, canvas.width / 2, cardY + 280);
  }

  ctx.fillStyle = ink;
  ctx.font = "bold 56px system-ui, sans-serif";
  const titleLines = wrapCanvasText(ctx, args.campaignTitle, cardW - 100);
  let titleY = cardY + (displayAmount ? 420 : 280);
  for (const line of titleLines) {
    ctx.fillText(line, canvas.width / 2, titleY);
    titleY += 72;
  }

  ctx.fillStyle = "#5c574f";
  ctx.font = "36px ui-monospace, monospace";
  ctx.fillText("on Dono", canvas.width / 2, cardY + cardH - 80);

  // Footer URL
  ctx.fillStyle = ink;
  ctx.font = "28px ui-monospace, monospace";
  ctx.fillText(args.campaignUrl.replace(/^https?:\/\//, ""), canvas.width / 2, 1760);

  ctx.font = "bold 40px system-ui, sans-serif";
  ctx.fillText("Give. See the receipt.", canvas.width / 2, 1840);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  if (typeof document === "undefined") return;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function canShareStoryImageFile(): boolean {
  if (typeof navigator === "undefined" || typeof File === "undefined") {
    return false;
  }
  if (typeof navigator.share !== "function") return false;
  try {
    const probe = new File([new Blob(["x"], { type: "image/png" })], "x.png", {
      type: "image/png",
    });
    if (typeof navigator.canShare !== "function") {
      // Older Android Chrome often supports share+files without canShare.
      return true;
    }
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

/**
 * Closest web equivalent of Spotify → Instagram Stories:
 * system share sheet with the story PNG so the user can pick Instagram Stories.
 * Instagram does not allow attaching story media via a plain HTTPS / QR link.
 */
export async function shareStoryImageToOsSheet(args: {
  blob: Blob;
  filename: string;
  caption: string;
}): Promise<"shared" | "unsupported" | "cancelled"> {
  if (typeof navigator === "undefined" || typeof File === "undefined") {
    return "unsupported";
  }
  if (typeof navigator.share !== "function") {
    return "unsupported";
  }

  const file = new File([args.blob], args.filename, { type: "image/png" });
  const payload: ShareData = { files: [file], title: "Dono", text: args.caption };

  try {
    if (typeof navigator.canShare === "function" && !navigator.canShare(payload)) {
      return "unsupported";
    }
    await navigator.share(payload);
    return "shared";
  } catch (error) {
    const name =
      error && typeof error === "object" && "name" in error
        ? String((error as { name?: string }).name)
        : "";
    if (name === "AbortError") return "cancelled";
    return "unsupported";
  }
}

export async function openInstagramStoryCamera(): Promise<void> {
  if (typeof window === "undefined") return;
  const deepLink = "instagram://story-camera";
  const fallback = "https://www.instagram.com/";

  window.location.href = deepLink;
  window.setTimeout(() => {
    window.location.href = fallback;
  }, 1200);
}
