"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
const MAX_BYTES = 600 * 1024;
const JPEG_QUALITIES = [82, 68, 55, 42, 30];

/** jsquash's codecs default to loading their .wasm binary via
 * `fetch(new URL("*.wasm", import.meta.url))`, which resolves to a
 * `file://` path — Convex's "use node" action sandbox doesn't implement
 * fetch() for that scheme ("not implemented... yet" from undici). We fetch
 * the exact same wasm bytes ourselves over https (pinned to the installed
 * package versions below) and hand them to each codec's init() directly,
 * bypassing that internal file:// resolution entirely. */
const WASM_CDN_BASE = "https://unpkg.com";
const WASM_URLS = {
  resize: `${WASM_CDN_BASE}/@jsquash/resize@2.1.1/lib/resize/pkg/squoosh_resize_bg.wasm`,
  pngDecode: `${WASM_CDN_BASE}/@jsquash/png@3.1.1/codec/pkg/squoosh_png_bg.wasm`,
  jpegDecode: `${WASM_CDN_BASE}/@jsquash/jpeg@1.6.0/codec/dec/mozjpeg_dec.wasm`,
  jpegEncode: `${WASM_CDN_BASE}/@jsquash/jpeg@1.6.0/codec/enc/mozjpeg_enc.wasm`,
};

async function fetchWasmBytes(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch wasm codec (${res.status}): ${url}`);
  }
  return await res.arrayBuffer();
}

async function decodeSourceImage(buffer: ArrayBuffer, contentType: string | null) {
  if (contentType === "image/png") {
    const { init, decode } = await import("@jsquash/png/decode.js");
    await init(await fetchWasmBytes(WASM_URLS.pngDecode));
    return await decode(buffer);
  }
  if (contentType === "image/jpeg" || contentType === "image/jpg") {
    const { init, default: decode } = await import("@jsquash/jpeg/decode.js");
    const compiled = await WebAssembly.compile(await fetchWasmBytes(WASM_URLS.jpegDecode));
    await init(compiled);
    return await decode(buffer);
  }
  // Unsupported source format (e.g. webp/gif/heic) — caller falls back to
  // the site default OG image rather than guessing at a conversion.
  return null;
}

async function resizeToOgDimensions(imageData: ImageData) {
  const { initResize, default: resize } = await import("@jsquash/resize");
  await initResize(await fetchWasmBytes(WASM_URLS.resize));
  return await resize(imageData, {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    fitMethod: "contain",
  });
}

async function encodeJpegUnderBudget(imageData: ImageData) {
  const { init, default: encode } = await import("@jsquash/jpeg/encode.js");
  const compiled = await WebAssembly.compile(await fetchWasmBytes(WASM_URLS.jpegEncode));
  await init(compiled);

  let best: ArrayBuffer | null = null;
  for (const quality of JPEG_QUALITIES) {
    const encoded = await encode(imageData, { quality });
    best = encoded;
    if (encoded.byteLength <= MAX_BYTES) {
      return encoded;
    }
  }
  // Every quality step still exceeded the budget — return the smallest
  // (lowest-quality) attempt rather than nothing.
  return best;
}

/** Generates the 1200x630 center-cropped OG-image derivative for a
 * campaign's cover photo and stores it, or leaves ogImageStorageId unset on
 * any failure — campaignOg.ts falls back to the branded default image, so a
 * decode/resize/encode failure here never blocks campaign publishing. */
export const generate = internalAction({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    try {
      const source = await ctx.runQuery(
        internal.campaignOgImageInternal.getImageSourceForOg,
        { slug: args.slug },
      );
      if (!source) return;

      const blob = await ctx.storage.get(source.storageId);
      if (!blob) return;

      const buffer = await blob.arrayBuffer();
      const decoded = await decodeSourceImage(buffer, source.contentType);
      if (!decoded) return;

      const resized = await resizeToOgDimensions(decoded);
      const encoded = await encodeJpegUnderBudget(resized);
      if (!encoded) return;

      const storageId = await ctx.storage.store(
        new Blob([encoded], { type: "image/jpeg" }),
      );
      await ctx.runMutation(internal.campaignOgImageInternal.saveOgImageStorageId, {
        slug: args.slug,
        storageId,
      });
    } catch (err) {
      console.error("campaignOgImageActions.generate failed", args.slug, err);
    }
  },
});
