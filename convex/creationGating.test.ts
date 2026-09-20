import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { requireStudentCreator } from "./lib/authz";
import { recordLegalAcceptancesForContext } from "./lib/legalAcceptance";

// convex-test needs the module map to resolve cross-file function references
// (internal.* calls, scheduler.runAfter) at test time.
const modules = import.meta.glob("./**/*.*s");

function newTestConvex() {
  return convexTest(schema, modules);
}

async function seedUser(
  t: ReturnType<typeof newTestConvex>,
  args: {
    email: string;
    userType?: "student" | "alumni";
    dateOfBirth?: string;
  },
) {
  return await t.run(async (ctx) => {
    const userId = await ctx.db.insert("users", {
      email: args.email,
      emailVerificationTime: Date.now(),
    });
    await ctx.db.insert("profiles", {
      userId,
      email: args.email,
      role: "user",
      userType: args.userType,
      dateOfBirth: args.dateOfBirth,
      emailVerifiedAt: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return userId;
  });
}

async function seedStorageId(t: ReturnType<typeof newTestConvex>) {
  return await t.run(async (ctx) => {
    return await ctx.storage.store(new Blob(["test"]));
  });
}

const ADULT_DOB = "1990-01-01";

describe("requireStudentCreator", () => {
  it("rejects an alumni profile with FORBIDDEN", async () => {
    const t = newTestConvex();
    const alumniId = await seedUser(t, {
      email: "grad@gmail.com",
      userType: "alumni",
    });
    const asAlumni = t.withIdentity({ subject: alumniId });

    await expect(
      asAlumni.run((ctx) => requireStudentCreator(ctx)),
    ).rejects.toThrow();
  });

  it("allows a student profile", async () => {
    const t = newTestConvex();
    const studentId = await seedUser(t, {
      email: "stu@ox.ac.uk",
      userType: "student",
    });
    const asStudent = t.withIdentity({ subject: studentId });

    const result = await asStudent.run((ctx) => requireStudentCreator(ctx));
    expect(result.userId).toBe(studentId);
  });

  it("allows a legacy profile with no userType set (non-regression)", async () => {
    const t = newTestConvex();
    const legacyId = await seedUser(t, { email: "legacy@ox.ac.uk" });
    const asLegacy = t.withIdentity({ subject: legacyId });

    const result = await asLegacy.run((ctx) => requireStudentCreator(ctx));
    expect(result.userId).toBe(legacyId);
  });
});

describe("creation mutations reject alumni/donor accounts", () => {
  it("campaigns.create rejects an alumni identity", async () => {
    const t = newTestConvex();
    const alumniId = await seedUser(t, {
      email: "grad@gmail.com",
      userType: "alumni",
      dateOfBirth: ADULT_DOB,
    });
    const asAlumni = t.withIdentity({ subject: alumniId });

    await expect(
      asAlumni.mutation(api.campaigns.create, {
        title: "Test Campaign",
        category: "textbooks",
        communitySlug: "some-society",
        description: "desc",
        story: "story",
        goal: 100,
        template: "classic",
      }),
    ).rejects.toThrow();
  });

  it("campaignCreator.saveDraft rejects an alumni identity", async () => {
    const t = newTestConvex();
    const alumniId = await seedUser(t, {
      email: "grad@gmail.com",
      userType: "alumni",
      dateOfBirth: ADULT_DOB,
    });
    const asAlumni = t.withIdentity({ subject: alumniId });

    await expect(
      asAlumni.mutation(api.campaignCreator.saveDraft, {
        title: "Test Campaign",
        category: "textbooks",
        communitySlug: "some-society",
        description: "desc",
        story: "story",
        goal: 100,
        template: "classic",
      }),
    ).rejects.toThrow();
  });

  it("societies.create rejects an alumni identity", async () => {
    const t = newTestConvex();
    const alumniId = await seedUser(t, {
      email: "grad@gmail.com",
      userType: "alumni",
      dateOfBirth: ADULT_DOB,
    });
    const asAlumni = t.withIdentity({ subject: alumniId });

    await expect(
      asAlumni.mutation(api.societies.create, {
        name: "Test Society",
        description: "desc",
        story: "story",
        websiteUrl: "https://example.com",
        supportingDocumentStorageIds: [],
      }),
    ).rejects.toThrow();
  });

  it("societies.createCollege rejects an alumni identity", async () => {
    const t = newTestConvex();
    const alumniId = await seedUser(t, {
      email: "grad@gmail.com",
      userType: "alumni",
      dateOfBirth: ADULT_DOB,
    });
    const asAlumni = t.withIdentity({ subject: alumniId });

    await expect(
      asAlumni.mutation(api.societies.createCollege, {
        name: "Test College",
        description: "desc",
      }),
    ).rejects.toThrow();
  });

  it("societies.createCollege still succeeds for a student identity", async () => {
    const t = newTestConvex();
    const studentId = await seedUser(t, {
      email: "stu@ox.ac.uk",
      userType: "student",
      dateOfBirth: ADULT_DOB,
    });
    await t.run(async (ctx) => {
      await recordLegalAcceptancesForContext(ctx, {
        userId: studentId,
        context: "create_society",
      });
    });
    const asStudent = t.withIdentity({ subject: studentId });

    const result = await asStudent.mutation(api.societies.createCollege, {
      name: "Test College",
      description: "desc",
    });
    expect(result.slug).toBeDefined();
  });
});

async function seedVerifiedSocietyCommunity(
  t: ReturnType<typeof newTestConvex>,
  slug: string,
) {
  await t.run(async (ctx) => {
    await ctx.db.insert("communities", {
      slug,
      name: `Society ${slug}`,
      type: "society",
      description: "desc",
      avatar: "",
      coverImage: "",
      university: "University of Oxford",
      followers: 0,
      campaigns: 0,
      totalRaised: 0,
      verified: true,
      verificationType: "society",
      verificationStatus: "verified",
    });
  });
}

async function seedApprovedMembership(
  t: ReturnType<typeof newTestConvex>,
  args: { communitySlug: string; userId: Id<"users"> },
) {
  await t.run(async (ctx) => {
    await ctx.db.insert("societyMembers", {
      communitySlug: args.communitySlug,
      userId: args.userId,
      role: "member",
      status: "approved",
      createdAt: Date.now(),
    });
  });
}

describe("creation mutations without student card", () => {
  it("societies.create succeeds without idDocumentStorageId", async () => {
    const t = newTestConvex();
    const studentId = await seedUser(t, {
      email: "stu@ox.ac.uk",
      userType: "student",
      dateOfBirth: ADULT_DOB,
    });
    await t.run(async (ctx) => {
      await recordLegalAcceptancesForContext(ctx, {
        userId: studentId,
        context: "create_society",
      });
    });
    const asStudent = t.withIdentity({ subject: studentId });

    const result = await asStudent.mutation(api.societies.create, {
      name: "Test Society",
      description: "desc",
      story: "story",
      websiteUrl: "https://example.com",
      supportingDocumentStorageIds: [],
    });
    expect(result.slug).toBeDefined();
  });

  it("societies.create rejects idDocumentStorageId uploads", async () => {
    const t = newTestConvex();
    const studentId = await seedUser(t, {
      email: "stu2@ox.ac.uk",
      userType: "student",
      dateOfBirth: ADULT_DOB,
    });
    const storageId = await seedStorageId(t);
    await t.run(async (ctx) => {
      await recordLegalAcceptancesForContext(ctx, {
        userId: studentId,
        context: "create_society",
      });
    });
    const asStudent = t.withIdentity({ subject: studentId });

    await expect(
      asStudent.mutation(api.societies.create, {
        name: "Legacy Card Society",
        description: "desc",
        story: "story",
        websiteUrl: "https://example.com",
        supportingDocumentStorageIds: [],
        idDocumentStorageId: storageId,
      }),
    ).rejects.toThrow(/Identity documents are not accepted/);
  });

  it("campaigns.create succeeds without idDocumentStorageId", async () => {
    const t = newTestConvex();
    const studentId = await seedUser(t, {
      email: "camp@ox.ac.uk",
      userType: "student",
      dateOfBirth: ADULT_DOB,
    });
    const societySlug = "test-society";
    await seedVerifiedSocietyCommunity(t, societySlug);
    await seedApprovedMembership(t, { communitySlug: societySlug, userId: studentId });
    await t.run(async (ctx) => {
      await recordLegalAcceptancesForContext(ctx, {
        userId: studentId,
        context: "create_society",
      });
    });
    const asStudent = t.withIdentity({ subject: studentId });

    const result = await asStudent.mutation(api.campaigns.create, {
      title: "Test Campaign",
      category: "textbooks",
      communitySlug: societySlug,
      description: "desc",
      story: "story",
      goal: 100,
      template: "classic",
    });
    expect(result.slug).toBeDefined();
  });

  it("campaigns.create rejects stale Society Campaign Terms", async () => {
    const t = newTestConvex();
    const studentId = await seedUser(t, {
      email: "stale-terms@ox.ac.uk",
      userType: "student",
      dateOfBirth: ADULT_DOB,
    });
    const societySlug = "stale-terms-society";
    await seedVerifiedSocietyCommunity(t, societySlug);
    await seedApprovedMembership(t, {
      communitySlug: societySlug,
      userId: studentId,
    });
    await t.run(async (ctx) => {
      await ctx.db.insert("legalAcceptances", {
        userId: studentId,
        documentId: "society_campaign_terms",
        version: "2026-07-20-v0.1",
        context: "create_society",
        event: "B",
        acceptedAt: Date.now(),
      });
    });
    const asStudent = t.withIdentity({ subject: studentId });

    await expect(
      asStudent.mutation(api.campaigns.create, {
        title: "Stale Terms Campaign",
        category: "textbooks",
        communitySlug: societySlug,
        description: "desc",
        story: "story",
        goal: 100,
        template: "classic",
      }),
    ).rejects.toThrow(/society campaign terms/i);
  });

  it("campaignCreator.saveDraft inserts pending without opening review", async () => {
    const t = newTestConvex();
    const studentId = await seedUser(t, {
      email: "draft@ox.ac.uk",
      userType: "student",
      dateOfBirth: ADULT_DOB,
    });
    const societySlug = "draft-society";
    await seedVerifiedSocietyCommunity(t, societySlug);
    await seedApprovedMembership(t, { communitySlug: societySlug, userId: studentId });
    await t.run(async (ctx) => {
      await recordLegalAcceptancesForContext(ctx, {
        userId: studentId,
        context: "create_society",
      });
    });
    const asStudent = t.withIdentity({ subject: studentId });

    const result = await asStudent.mutation(api.campaignCreator.saveDraft, {
      title: "Draft Campaign",
      category: "textbooks",
      communitySlug: societySlug,
      description: "desc",
      story: "story",
      goal: 100,
      template: "classic",
    });
    expect(result.slug).toBeDefined();

    const campaign = await t.run(async (ctx) => {
      return await ctx.db
        .query("campaigns")
        .withIndex("by_slug", (q) => q.eq("slug", result.slug))
        .unique();
    });
    expect(campaign?.status).toBe("pending");
    expect(campaign?.societyApprovalStatus).toBeUndefined();
  });

  it("campaignCreator.saveDraft allows an incomplete form", async () => {
    const t = newTestConvex();
    const studentId = await seedUser(t, {
      email: "mid-draft@ox.ac.uk",
      userType: "student",
      dateOfBirth: ADULT_DOB,
    });
    const societySlug = "mid-draft-society";
    await seedVerifiedSocietyCommunity(t, societySlug);
    await seedApprovedMembership(t, { communitySlug: societySlug, userId: studentId });
    await t.run(async (ctx) => {
      await recordLegalAcceptancesForContext(ctx, {
        userId: studentId,
        context: "create_society",
      });
    });
    const asStudent = t.withIdentity({ subject: studentId });

    const result = await asStudent.mutation(api.campaignCreator.saveDraft, {
      title: "",
      category: "",
      communitySlug: societySlug,
      description: "",
      story: "",
      goal: 0,
      template: "classic",
    });
    const campaign = await t.run(async (ctx) => {
      return await ctx.db
        .query("campaigns")
        .withIndex("by_slug", (q) => q.eq("slug", result.slug))
        .unique();
    });
    expect(campaign?.title).toBe("Untitled campaign");
    expect(campaign?.goal).toBe(0);
    expect(campaign?.description).toBe("");
    expect(campaign?.societyApprovalStatus).toBeUndefined();
  });

  it("campaignCreator.saveDraft works before society, terms, or date of birth", async () => {
    const t = newTestConvex();
    const studentId = await seedUser(t, {
      email: "early-draft@ox.ac.uk",
      userType: "student",
    });
    const asStudent = t.withIdentity({ subject: studentId });

    const result = await asStudent.mutation(api.campaignCreator.saveDraft, {
      title: "Halfway",
      category: "",
      communitySlug: "",
      description: "",
      story: "",
      goal: 0,
      template: "classic",
    });
    const campaign = await t.run(async (ctx) => {
      return await ctx.db
        .query("campaigns")
        .withIndex("by_slug", (q) => q.eq("slug", result.slug))
        .unique();
    });
    expect(campaign?.title).toBe("Halfway");
    expect(campaign?.creator.communityId).toBe("");
    expect(campaign?.societyApprovalStatus).toBeUndefined();
  });

  it("campaignCreator.saveDraft attaches a society chosen after the first save", async () => {
    const t = newTestConvex();
    const studentId = await seedUser(t, {
      email: "late-society@ox.ac.uk",
      userType: "student",
    });
    const societySlug = "late-society";
    await seedVerifiedSocietyCommunity(t, societySlug);
    await seedApprovedMembership(t, { communitySlug: societySlug, userId: studentId });
    const asStudent = t.withIdentity({ subject: studentId });

    const created = await asStudent.mutation(api.campaignCreator.saveDraft, {
      title: "Later society",
      category: "",
      communitySlug: "",
      description: "",
      story: "",
      goal: 0,
      template: "classic",
    });
    await asStudent.mutation(api.campaignCreator.saveDraft, {
      slug: created.slug,
      title: "Later society",
      category: "",
      communitySlug: societySlug,
      description: "",
      story: "",
      goal: 0,
      template: "classic",
    });
    const campaign = await t.run(async (ctx) => {
      return await ctx.db
        .query("campaigns")
        .withIndex("by_slug", (q) => q.eq("slug", created.slug))
        .unique();
    });
    expect(campaign?.creator.communityId).toBe(societySlug);
    expect(campaign?.creator.name).toBe(`Society ${societySlug}`);
    expect(campaign?.societyApprovalStatus).toBeUndefined();
  });

  it("campaignCreator.update attaches a society chosen after an incomplete draft", async () => {
    const t = newTestConvex();
    const studentId = await seedUser(t, {
      email: "late-update@ox.ac.uk",
      userType: "student",
      dateOfBirth: ADULT_DOB,
    });
    const societySlug = "late-update-society";
    await seedVerifiedSocietyCommunity(t, societySlug);
    await seedApprovedMembership(t, { communitySlug: societySlug, userId: studentId });
    const asStudent = t.withIdentity({ subject: studentId });

    const created = await asStudent.mutation(api.campaignCreator.saveDraft, {
      title: "Complete later",
      category: "",
      communitySlug: "",
      description: "",
      story: "",
      goal: 0,
      template: "classic",
    });
    await asStudent.mutation(api.campaignCreator.update, {
      slug: created.slug,
      title: "Complete later",
      category: "textbooks",
      communitySlug: societySlug,
      description: "desc",
      story: "story",
      goal: 100,
      template: "classic",
    });
    const campaign = await t.run(async (ctx) => {
      return await ctx.db
        .query("campaigns")
        .withIndex("by_slug", (q) => q.eq("slug", created.slug))
        .unique();
    });
    expect(campaign?.creator.communityId).toBe(societySlug);
    expect(campaign?.category).toBe("textbooks");
    expect(campaign?.societyApprovalStatus).toBeUndefined();
  });

  it("campaignCreator.deleteDraft removes the owner's incomplete draft", async () => {
    const t = newTestConvex();
    const studentId = await seedUser(t, {
      email: "delete-draft@ox.ac.uk",
      userType: "student",
    });
    const asStudent = t.withIdentity({ subject: studentId });
    const created = await asStudent.mutation(api.campaignCreator.saveDraft, {
      title: "Throwaway",
      category: "",
      communitySlug: "",
      description: "",
      story: "",
      goal: 0,
      template: "classic",
    });

    await asStudent.mutation(api.campaignCreator.deleteDraft, {
      slug: created.slug,
    });

    const campaign = await t.run(async (ctx) => {
      return await ctx.db
        .query("campaigns")
        .withIndex("by_slug", (q) => q.eq("slug", created.slug))
        .unique();
    });
    expect(campaign).toBeNull();
  });

  it("campaignCreator.deleteDraft refuses another user", async () => {
    const t = newTestConvex();
    const ownerId = await seedUser(t, {
      email: "draft-owner@ox.ac.uk",
      userType: "student",
    });
    const otherId = await seedUser(t, {
      email: "draft-other@ox.ac.uk",
      userType: "student",
    });
    const asOwner = t.withIdentity({ subject: ownerId });
    const created = await asOwner.mutation(api.campaignCreator.saveDraft, {
      title: "Private draft",
      category: "",
      communitySlug: "",
      description: "",
      story: "",
      goal: 0,
      template: "classic",
    });

    const asOther = t.withIdentity({ subject: otherId });
    await expect(
      asOther.mutation(api.campaignCreator.deleteDraft, { slug: created.slug }),
    ).rejects.toThrow();
  });

  it("campaignCreator.deleteDraft refuses after submitForReview", async () => {
    const t = newTestConvex();
    const studentId = await seedUser(t, {
      email: "submitted-draft@ox.ac.uk",
      userType: "student",
      dateOfBirth: ADULT_DOB,
    });
    const societySlug = "submitted-draft-society";
    await seedVerifiedSocietyCommunity(t, societySlug);
    await seedApprovedMembership(t, {
      communitySlug: societySlug,
      userId: studentId,
    });
    await t.run(async (ctx) => {
      await recordLegalAcceptancesForContext(ctx, {
        userId: studentId,
        context: "create_society",
      });
    });
    const asStudent = t.withIdentity({ subject: studentId });
    const created = await asStudent.mutation(api.campaignCreator.saveDraft, {
      title: "Ready to submit",
      category: "textbooks",
      communitySlug: societySlug,
      description: "desc",
      story: "story",
      goal: 100,
      template: "classic",
    });
    await t.run(async (ctx) => {
      const campaign = await ctx.db
        .query("campaigns")
        .withIndex("by_slug", (q) => q.eq("slug", created.slug))
        .unique();
      if (!campaign) throw new Error("missing campaign");
      await ctx.db.patch(campaign._id, {
        stripeVerificationStatus: "verified",
      });
    });
    await asStudent.mutation(api.campaignCreator.submitForReview, {
      slug: created.slug,
    });

    await expect(
      asStudent.mutation(api.campaignCreator.deleteDraft, {
        slug: created.slug,
      }),
    ).rejects.toThrow(/unsubmitted drafts/i);
  });

  it("campaignCreator.deleteDraft refuses live or rejected campaigns", async () => {
    const t = newTestConvex();
    const studentId = await seedUser(t, {
      email: "not-a-draft@ox.ac.uk",
      userType: "student",
    });
    const asStudent = t.withIdentity({ subject: studentId });
    const live = await asStudent.mutation(api.campaignCreator.saveDraft, {
      title: "Live later",
      category: "",
      communitySlug: "",
      description: "",
      story: "",
      goal: 0,
      template: "classic",
    });
    const rejected = await asStudent.mutation(api.campaignCreator.saveDraft, {
      title: "Rejected later",
      category: "",
      communitySlug: "",
      description: "",
      story: "",
      goal: 0,
      template: "classic",
    });
    await t.run(async (ctx) => {
      const liveRow = await ctx.db
        .query("campaigns")
        .withIndex("by_slug", (q) => q.eq("slug", live.slug))
        .unique();
      const rejectedRow = await ctx.db
        .query("campaigns")
        .withIndex("by_slug", (q) => q.eq("slug", rejected.slug))
        .unique();
      if (!liveRow || !rejectedRow) throw new Error("missing campaign");
      await ctx.db.patch(liveRow._id, { status: "active" });
      await ctx.db.patch(rejectedRow._id, { status: "rejected" });
    });

    await expect(
      asStudent.mutation(api.campaignCreator.deleteDraft, { slug: live.slug }),
    ).rejects.toThrow(/unsubmitted drafts/i);
    await expect(
      asStudent.mutation(api.campaignCreator.deleteDraft, {
        slug: rejected.slug,
      }),
    ).rejects.toThrow(/unsubmitted drafts/i);
  });
});
