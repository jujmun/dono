import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import type { Id } from "./_generated/dataModel";

const modules = import.meta.glob("./**/*.*s");

function newTestConvex() {
  return convexTest(schema, modules);
}

type CampaignOverrides = Partial<{
  slug: string;
  title: string;
  description: string;
  status: "pending" | "rejected" | "active" | "funded" | "completed" | "changes_requested";
  imageStorageId: Id<"_storage">;
  ogImageStorageId: Id<"_storage">;
}>;

async function seedCampaign(
  t: ReturnType<typeof newTestConvex>,
  overrides: CampaignOverrides = {},
) {
  const slug = overrides.slug ?? `camp-${Math.random().toString(36).slice(2)}`;
  await t.run(async (ctx) => {
    await ctx.db.insert("campaigns", {
      slug,
      title: overrides.title ?? "Test Campaign",
      description: overrides.description ?? "desc",
      story: "story",
      category: "academic",
      goal: 5000,
      raised: 0,
      donors: 0,
      likes: 0,
      followers: 0,
      comments: 0,
      creator: {
        name: "Test Student",
        type: "student",
        avatar: "",
        communityId: "college-x",
      },
      verifications: [],
      university: "University of Oxford",
      image: "",
      imageStorageId: overrides.imageStorageId,
      ogImageStorageId: overrides.ogImageStorageId,
      createdAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      status: overrides.status ?? "active",
      updates: [],
    });
  });
  return slug;
}

async function seedStorageId(t: ReturnType<typeof newTestConvex>) {
  return await t.run(async (ctx) => {
    return await ctx.storage.store(new Blob(["fake-image-bytes"], { type: "image/jpeg" }));
  });
}

describe("campaignOgPage", () => {
  it("renders og/twitter tags with the precomputed image for a public campaign", async () => {
    const t = newTestConvex();
    const ogStorageId = await seedStorageId(t);
    const slug = await seedCampaign(t, {
      title: "Oxford Robotics Fund",
      description: "Help us build a robot for the Oxford robotics team.",
      ogImageStorageId: ogStorageId,
    });

    const res = await t.fetch(`/og/campaigns/${slug}`);
    expect(res.status).toBe(200);
    const html = await res.text();

    expect(html).toContain(
      '<meta property="og:title" content="Donate to Oxford Robotics Fund on Dono">',
    );
    expect(html).toContain(
      '<meta property="og:description" content="Help us build a robot for the Oxford robotics team.">',
    );
    expect(html).toContain('<meta property="og:site_name" content="Dono">');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image">');
    expect(html).toContain(`<meta property="og:url" content="https://joindono.com/campaigns/${slug}">`);

    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)">/);
    expect(imageMatch).not.toBeNull();
    const imageUrl = imageMatch![1];
    expect(imageUrl.startsWith("https://")).toBe(true);
    expect(html).toContain('<meta property="og:image:width" content="1200">');
    expect(html).toContain('<meta property="og:image:height" content="630">');
  });

  it("falls back to the default branded image when there's no cover image", async () => {
    const t = newTestConvex();
    const slug = await seedCampaign(t, { title: "No Cover Campaign" });

    const res = await t.fetch(`/og/campaigns/${slug}`);
    expect(res.status).toBe(200);
    const html = await res.text();

    expect(html).toContain(
      '<meta property="og:image" content="https://joindono.com/og/default.jpg">',
    );
    expect(html).toContain(
      '<meta name="twitter:image" content="https://joindono.com/og/default.jpg">',
    );
  });

  it("HTML-escapes titles containing quotes and ampersands", async () => {
    const t = newTestConvex();
    const slug = await seedCampaign(t, {
      title: `Sam & Dee's "Big" Run`,
      description: `Fund Sam & Dee's "Big" Run for charity.`,
    });

    const res = await t.fetch(`/og/campaigns/${slug}`);
    const html = await res.text();

    expect(html).toContain(
      "Donate to Sam &amp; Dee&#39;s &quot;Big&quot; Run on Dono",
    );
    expect(html).not.toContain(`Sam & Dee's "Big" Run`);
    expect(html).not.toMatch(/content="[^"]*"[^>]*"/); // no stray unescaped quote breaking an attribute
  });

  it("returns 404 and leaks nothing for a private/pending campaign", async () => {
    const t = newTestConvex();
    const slug = await seedCampaign(t, {
      title: "Secret Draft Campaign",
      status: "pending",
    });

    const res = await t.fetch(`/og/campaigns/${slug}`);
    expect(res.status).toBe(404);
    const body = await res.text();
    expect(body).not.toContain("Secret Draft Campaign");
  });

  it("returns 404 for a slug that doesn't exist", async () => {
    const t = newTestConvex();
    const res = await t.fetch("/og/campaigns/does-not-exist");
    expect(res.status).toBe(404);
  });
});
