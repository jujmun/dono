import { ConvexError, v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const WIKI_UA =
  "DonoCollegePrefill/1.0 (https://dono.app; college onboarding; contact=support@dono.app)";
const MAX_EXTRACT = 500;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type WikiSummary = {
  title?: string;
  extract?: string;
  description?: string;
  type?: string;
  thumbnail?: { source?: string };
  originalimage?: { source?: string };
  content_urls?: { desktop?: { page?: string } };
};

function oxfordTitleCandidates(name: string): string[] {
  const trimmed = name.trim().replace(/\s+/g, " ");
  if (!trimmed) return [];
  const lower = trimmed.toLowerCase();
  const candidates: string[] = [];
  if (lower.includes("oxford")) {
    candidates.push(trimmed);
  } else {
    candidates.push(`${trimmed}, Oxford`);
    if (!/college$/i.test(trimmed)) {
      candidates.push(`${trimmed} College, Oxford`);
    }
    candidates.push(trimmed);
  }
  return [...new Set(candidates)];
}

async function fetchWikiJson<T>(url: string): Promise<T | null> {
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": WIKI_UA,
      "Api-User-Agent": WIKI_UA,
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return (await res.json()) as T;
}

async function fetchSummary(title: string): Promise<WikiSummary | null> {
  const encoded = encodeURIComponent(title.replace(/ /g, "_"));
  return await fetchWikiJson<WikiSummary>(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`,
  );
}

async function searchTitle(query: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: "opensearch",
    search: query,
    limit: "5",
    namespace: "0",
    format: "json",
  });
  const data = await fetchWikiJson<[string, string[], string[], string[]]>(
    `https://en.wikipedia.org/w/api.php?${params.toString()}`,
  );
  if (!data || !Array.isArray(data[1]) || data[1].length === 0) return null;
  const titles = data[1];
  const oxfordish = titles.find((t) => /oxford/i.test(t) && /college/i.test(t));
  return oxfordish ?? titles[0] ?? null;
}

function emptyPrefill() {
  return {
    found: false as const,
    title: null as string | null,
    extract: null as string | null,
    pageUrl: null as string | null,
    imageUrl: null as string | null,
    coverImageStorageId: null as Id<"_storage"> | null,
    coverImageUrl: null as string | null,
  };
}

/**
 * Look up an Oxford college on Wikipedia and optionally import the lead image
 * into Convex storage for cover prefill.
 */
export const lookupCollegePrefill = action({
  args: {
    name: v.string(),
    /** When true (default), fetch and store the Wikimedia image if present. */
    storeCover: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to look up college details.",
      });
    }

    const name = args.name.trim();
    if (!name) return emptyPrefill();

    let summary: WikiSummary | null = null;
    for (const title of oxfordTitleCandidates(name)) {
      const candidate = await fetchSummary(title);
      if (candidate && candidate.type !== "disambiguation") {
        summary = candidate;
        break;
      }
    }

    if (!summary) {
      const searched = await searchTitle(`${name} Oxford College`);
      if (searched) {
        summary = await fetchSummary(searched);
      }
    }

    if (!summary || summary.type === "disambiguation") {
      return emptyPrefill();
    }

    const extractRaw = (summary.extract ?? summary.description ?? "").trim();
    const extract = extractRaw
      ? extractRaw.slice(0, MAX_EXTRACT)
      : null;
    const imageUrl =
      summary.originalimage?.source ?? summary.thumbnail?.source ?? null;

    let coverImageStorageId: Id<"_storage"> | null = null;
    let coverImageUrl: string | null = null;

    const shouldStore = args.storeCover !== false && Boolean(imageUrl);
    if (shouldStore && imageUrl) {
      try {
        const imgRes = await fetch(imageUrl, {
          headers: { "User-Agent": WIKI_UA, "Api-User-Agent": WIKI_UA },
        });
        if (imgRes.ok) {
          const blob = await imgRes.blob();
          if (blob.size > 0 && blob.size <= MAX_IMAGE_BYTES) {
            coverImageStorageId = await ctx.storage.store(blob);
            await ctx.runMutation(internal.societies.claimCoverStorage, {
              userId,
              storageId: coverImageStorageId,
            });
            coverImageUrl = await ctx.storage.getUrl(coverImageStorageId);
          }
        }
      } catch {
        // Prefill is best-effort — user can upload manually.
        coverImageStorageId = null;
        coverImageUrl = null;
      }
    }

    return {
      found: true as const,
      title: summary.title ?? null,
      extract,
      pageUrl: summary.content_urls?.desktop?.page ?? null,
      imageUrl,
      coverImageStorageId,
      coverImageUrl,
    };
  },
});
