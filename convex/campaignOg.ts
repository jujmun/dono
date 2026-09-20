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

    const imageUrl = campaign.ogImageStorageId
      ? await ctx.storage.getUrl(campaign.ogImageStorageId)
      : null;

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
