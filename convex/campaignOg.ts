import { v } from "convex/values";
import { httpAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { isPublicCampaign } from "./lib/campaignVisibility";
import { buildCampaignOgHtml } from "./lib/campaignOgHtml";

const OG_ROUTE_PREFIX = "/og/campaigns/";

function getSiteUrl(): string {
  return (
    process.env.EXPO_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    process.env.SITE_URL?.replace(/\/$/, "") ??
    "https://joindono.com"
  );
}

/** Public-safe projection for the crawler-facing OG page — never returns
 * anything for a campaign that isn't publicly visible (mirrors
 * campaigns.getBySlug's isPublicCampaign gate). */
export const getPublicOgData = internalQuery({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign || !isPublicCampaign(campaign)) {
      return null;
    }

    // ogImageStorageId would hold a precomputed 1200x630 crop, but generation
    // is currently disabled (see campaignOgImageActions.generate) so it's
    // almost never set — fall back to the same cover image shown on the
    // website rather than the generic branded default. Mirrors
    // enrichCampaignWithMedia (convex/lib/campaignMedia.ts): some campaigns
    // predate imageStorageId/imageStorageIds and only have the resolved
    // `image` URL string stored directly, so that needs its own fallback too.
    const coverImageStorageId =
      campaign.ogImageStorageId ?? campaign.imageStorageIds?.[0] ?? campaign.imageStorageId;
    const storageImageUrl = coverImageStorageId
      ? await ctx.storage.getUrl(coverImageStorageId)
      : null;
    const legacyImageUrl =
      campaign.image !== "default" && /^https?:\/\//.test(campaign.image)
        ? campaign.image
        : null;
    const imageUrl = storageImageUrl ?? legacyImageUrl;

    return {
      title: campaign.title,
      description: campaign.description,
      goal: campaign.goal,
      imageUrl,
    };
  },
});

export const campaignOgPage = httpAction(async (ctx, request) => {
  const { pathname } = new URL(request.url);
  const slug = decodeURIComponent(pathname.slice(OG_ROUTE_PREFIX.length));
  if (!slug) {
    return new Response("Not found.", { status: 404 });
  }

  const data = await ctx.runQuery(internal.campaignOg.getPublicOgData, { slug });
  if (!data) {
    return new Response("Not found.", { status: 404 });
  }

  const siteUrl = getSiteUrl();
  const html = buildCampaignOgHtml({
    title: data.title,
    description: data.description,
    goal: data.goal,
    canonicalUrl: `${siteUrl}/campaigns/${encodeURIComponent(slug)}`,
    imageUrl: data.imageUrl ?? `${siteUrl}/og/default.jpg`,
  });

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
});
