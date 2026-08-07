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
        context: "create_campaign",
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
});
