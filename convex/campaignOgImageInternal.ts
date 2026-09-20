import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

/** Cover image to derive the OG-sized crop from — the first gallery image if
 * set, else the single legacy cover image. Includes the storage metadata's
 * contentType so the resize action knows which decoder to use. */
export const getImageSourceForOg = internalQuery({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign) return null;

    const storageId = campaign.imageStorageIds?.[0] ?? campaign.imageStorageId;
    if (!storageId) return null;

    const metadata = await ctx.db.system.get("_storage", storageId);
    if (!metadata) return null;

    return { storageId, contentType: metadata.contentType ?? null };
  },
});

export const saveOgImageStorageId = internalMutation({
  args: { slug: v.string(), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign) return null;

    const previous = campaign.ogImageStorageId;
    await ctx.db.patch(campaign._id, { ogImageStorageId: args.storageId });
    if (previous && previous !== args.storageId) {
      await ctx.storage.delete(previous);
    }
    return null;
  },
});
