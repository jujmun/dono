import { escapeHtml, trimToWordBoundary } from "./htmlEscape";

const DESCRIPTION_MAX_LENGTH = 155;
const SITE_NAME = "Dono";
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

function formatGoal(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export type CampaignOgInput = {
  title: string;
  description: string;
  goal: number;
  canonicalUrl: string;
  imageUrl: string;
};

/** Builds the standalone HTML document served to crawlers for a public
 * campaign — see convex/campaignOg.ts. Kept as a pure function so it's
 * testable without spinning up convex-test. */
export function buildCampaignOgHtml(input: CampaignOgInput): string {
  const pageTitle = `Donate to ${input.title} on Dono`;
  const rawDescription = input.description.trim()
    ? input.description
    : `Help reach the ${formatGoal(input.goal)} goal for ${input.title} on Dono.`;
  const description = trimToWordBoundary(rawDescription, DESCRIPTION_MAX_LENGTH);
  const imageAlt = `${input.title} — cover photo`;

  const title = escapeHtml(pageTitle);
  const desc = escapeHtml(description);
  const url = escapeHtml(input.canonicalUrl);
  const image = escapeHtml(input.imageUrl);
  const alt = escapeHtml(imageAlt);
  const siteName = escapeHtml(SITE_NAME);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${siteName}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="${OG_IMAGE_WIDTH}">
<meta property="og:image:height" content="${OG_IMAGE_HEIGHT}">
<meta property="og:image:alt" content="${alt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${image}">
<meta http-equiv="refresh" content="0; url=${url}">
</head>
<body>
<p><a href="${url}">${title}</a></p>
</body>
</html>
`;
}
