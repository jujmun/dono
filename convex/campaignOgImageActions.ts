"use node";

/**
 * OG image generation. jsquash dynamic imports break Convex's esbuild bundler
 * when subpath exports cannot be resolved at bundle-time. This action is a
 * soft no-op: campaignOg.ts already falls back to the branded default image,
 * so skipping derivative generation never blocks campaigns or donations.
 *
 * Restore codec processing once the jsquash/Convex bundling path is sorted.
 */
import { v } from "convex/values";
import { internalAction } from "./_generated/server";

export const generate = internalAction({
  args: { slug: v.string() },
  handler: async (_ctx, args) => {
    console.log(
      "campaignOgImageActions.generate skipped (jsquash bundling disabled)",
      args.slug,
    );
  },
});
