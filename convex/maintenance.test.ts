import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { internal } from "./_generated/api";

const modules = import.meta.glob("./**/*.*s");

function newTestConvex() {
  return convexTest(schema, modules);
}

const RETENTION_MS = 90 * 24 * 60 * 60 * 1000;

async function insertCampaign(
  t: ReturnType<typeof newTestConvex>,
  overrides: { verifiedAt?: number; verifiedName?: string; verifiedDob?: string },
) {
  return await t.run(async (ctx) => {
    return await ctx.db.insert("campaigns", {
      slug: `campaign-${Math.random()}`,
      title: "Test Campaign",
      description: "desc",
      story: "story",
      category: "academic",
      goal: 1000,
      raised: 0,
      donors: 0,
      likes: 0,
      followers: 0,
      comments: 0,
      creator: {
        name: "Test Society",
        type: "society",
        avatar: "",
        communityId: "test-society",
      },
      verifications: [],
      university: "University of Oxford",
      image: "",
      createdAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 86_400_000).toISOString(),
      status: "active",
      updates: [],
      stripeVerificationStatus: overrides.verifiedName ? "verified" : undefined,
      ...overrides,
    });
  });
}

describe("expireVerifiedIdentityPii", () => {
  it("clears verifiedName/verifiedDob past the retention window", async () => {
    const t = newTestConvex();
    const staleCampaignId = await insertCampaign(t, {
      verifiedName: "Real Name",
      verifiedDob: "2000-01-01",
      verifiedAt: Date.now() - RETENTION_MS - 1000,
    });

    const result = await t.mutation(
      internal.maintenance.expireVerifiedIdentityPii,
      {},
    );
    expect(result.campaignsCleared).toBe(1);

    const campaign = await t.run(async (ctx) => await ctx.db.get(staleCampaignId));
    expect(campaign?.verifiedName).toBeUndefined();
    expect(campaign?.verifiedDob).toBeUndefined();
    expect(campaign?.verifiedAt).toBeUndefined();
    expect(campaign?.stripeVerificationStatus).toBeUndefined();
  });

  it("leaves verifiedName/verifiedDob within the retention window untouched", async () => {
    const t = newTestConvex();
    const freshCampaignId = await insertCampaign(t, {
      verifiedName: "Real Name",
      verifiedDob: "2000-01-01",
      verifiedAt: Date.now() - 1000,
    });

    const result = await t.mutation(
      internal.maintenance.expireVerifiedIdentityPii,
      {},
    );
    expect(result.campaignsCleared).toBe(0);

    const campaign = await t.run(async (ctx) => await ctx.db.get(freshCampaignId));
    expect(campaign?.verifiedName).toBe("Real Name");
    expect(campaign?.verifiedDob).toBe("2000-01-01");
  });

  it("ignores campaigns/societies that were never verified", async () => {
    const t = newTestConvex();
    await insertCampaign(t, {});

    const result = await t.mutation(
      internal.maintenance.expireVerifiedIdentityPii,
      {},
    );
    expect(result.campaignsCleared).toBe(0);
    expect(result.societiesCleared).toBe(0);
  });

  it("clears stale societies too", async () => {
    const t = newTestConvex();
    const staleSocietyId = await t.run(async (ctx) => {
      const userId = await ctx.db.insert("users", {
        email: "leader@ox.ac.uk",
      });
      return await ctx.db.insert("societies", {
        slug: "test-society",
        name: "Test Society",
        description: "desc",
        story: "story",
        websiteUrl: "https://example.com",
        supportingDocumentStorageIds: [],
        creatorId: userId,
        status: "active",
        createdAt: Date.now(),
        stripeVerificationStatus: "verified",
        verifiedName: "Real Name",
        verifiedDob: "2000-01-01",
        verifiedAt: Date.now() - RETENTION_MS - 1000,
      });
    });

    const result = await t.mutation(
      internal.maintenance.expireVerifiedIdentityPii,
      {},
    );
    expect(result.societiesCleared).toBe(1);

    const society = await t.run(async (ctx) => await ctx.db.get(staleSocietyId));
    expect(society?.verifiedName).toBeUndefined();
    expect(society?.verifiedDob).toBeUndefined();
    expect(society?.stripeVerificationStatus).toBeUndefined();
  });

  it("respects a custom olderThanMs override", async () => {
    const t = newTestConvex();
    const campaignId = await insertCampaign(t, {
      verifiedName: "Real Name",
      verifiedDob: "2000-01-01",
      verifiedAt: Date.now() - 5000,
    });

    const result = await t.mutation(
      internal.maintenance.expireVerifiedIdentityPii,
      { olderThanMs: 1000 },
    );
    expect(result.campaignsCleared).toBe(1);

    const campaign = await t.run(async (ctx) => await ctx.db.get(campaignId));
    expect(campaign?.verifiedName).toBeUndefined();
  });
});
