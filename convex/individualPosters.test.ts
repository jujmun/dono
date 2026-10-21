import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { api } from "./_generated/api";
import { recordLegalAcceptancesForContext } from "./lib/legalAcceptance";
import { requiresSocietyApproval } from "./lib/campaignVisibility";

// convex-test needs the module map to resolve cross-file function references
// (internal.* calls, scheduler.runAfter) at test time.
const modules = import.meta.glob("./**/*.*s");

function newTestConvex() {
  return convexTest(schema, modules);
}

const ADULT_DOB = "1990-01-01";

async function seedUser(
  t: ReturnType<typeof newTestConvex>,
  args: { email: string; role?: "user" | "admin"; dateOfBirth?: string },
) {
  return await t.run(async (ctx) => {
    const userId = await ctx.db.insert("users", {
      email: args.email,
      emailVerificationTime: Date.now(),
    });
    await ctx.db.insert("profiles", {
      userId,
      email: args.email,
      role: args.role ?? "user",
      userType: "student",
      dateOfBirth: args.dateOfBirth,
      emailVerifiedAt: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return userId;
  });
}

describe("individualPosters application lifecycle", () => {
  it("apply -> admin approves -> caller becomes an approved individual poster", async () => {
    const t = newTestConvex();
    const applicantId = await seedUser(t, { email: "applicant@ox.ac.uk" });
    const adminId = await seedUser(t, {
      email: "admin@ox.ac.uk",
      role: "admin",
    });
    const asApplicant = t.withIdentity({ subject: applicantId });
    const asAdmin = t.withIdentity({ subject: adminId });

    const { applicationId } = await asApplicant.mutation(
      api.individualPosters.apply,
      {
        reason: "I run a solo tutoring project with no society behind it.",
      },
    );

    const pending = await asAdmin.query(api.individualPosters.listPending, {});
    expect(pending.map((p) => p.id)).toContain(applicationId);

    await asAdmin.mutation(api.individualPosters.approve, { applicationId });

    const status = await asApplicant.query(api.individualPosters.myStatus, {});
    expect(status?.status).toBe("approved");
  });

  it("rejecting records a reviewNote and allows immediate re-application", async () => {
    const t = newTestConvex();
    const applicantId = await seedUser(t, { email: "retry@ox.ac.uk" });
    const adminId = await seedUser(t, {
      email: "admin2@ox.ac.uk",
      role: "admin",
    });
    const asApplicant = t.withIdentity({ subject: applicantId });
    const asAdmin = t.withIdentity({ subject: adminId });

    const { applicationId } = await asApplicant.mutation(
      api.individualPosters.apply,
      {
        reason: "First attempt",
      },
    );
    await asAdmin.mutation(api.individualPosters.reject, {
      applicationId,
      reviewNote: "Please provide more detail.",
    });

    const rejectedStatus = await asApplicant.query(
      api.individualPosters.myStatus,
      {},
    );
    expect(rejectedStatus?.status).toBe("rejected");
    expect(rejectedStatus?.reviewNote).toBe("Please provide more detail.");

    // No cooldown — re-applying immediately is allowed and reuses the same row.
    const second = await asApplicant.mutation(api.individualPosters.apply, {
      reason: "Second attempt with more detail.",
    });
    expect(second.applicationId).toBe(applicationId);

    const pendingStatus = await asApplicant.query(
      api.individualPosters.myStatus,
      {},
    );
    expect(pendingStatus?.status).toBe("pending");
  });

  it("a non-approved user cannot create a campaign as an individual poster", async () => {
    const t = newTestConvex();
    const studentId = await seedUser(t, { email: "unapproved@ox.ac.uk" });
    const asStudent = t.withIdentity({ subject: studentId });

    await expect(
      asStudent.mutation(api.campaigns.create, {
        title: "Solo project",
        category: "textbooks",
        communitySlug: "",
        description: "desc",
        story: "story",
        goal: 100,
        template: "classic",
        postAsIndividual: true,
      }),
    ).rejects.toThrow();
  });

  it("an approved individual poster can create and submit a campaign with no society, straight into admin review", async () => {
    const t = newTestConvex();
    const posterId = await seedUser(t, {
      email: "poster@ox.ac.uk",
      dateOfBirth: ADULT_DOB,
    });
    const adminId = await seedUser(t, {
      email: "admin3@ox.ac.uk",
      role: "admin",
    });
    const asPoster = t.withIdentity({ subject: posterId });
    const asAdmin = t.withIdentity({ subject: adminId });

    const { applicationId } = await asPoster.mutation(
      api.individualPosters.apply,
      {
        reason: "Personal fundraiser, no society involved.",
      },
    );
    await asAdmin.mutation(api.individualPosters.approve, { applicationId });

    await t.run(async (ctx) => {
      await recordLegalAcceptancesForContext(ctx, {
        userId: posterId,
        context: "create_society",
      });
    });

    const created = await asPoster.mutation(api.campaigns.create, {
      title: "Solo project",
      category: "textbooks",
      communitySlug: "",
      description: "desc",
      story: "story",
      goal: 100,
      template: "classic",
      postAsIndividual: true,
    });

    const draft = await t.run(async (ctx) => {
      return await ctx.db
        .query("campaigns")
        .withIndex("by_slug", (q) => q.eq("slug", created.slug))
        .unique();
    });
    expect(draft?.creator.type).toBe("student");
    expect(draft?.creator.communityId).toBeUndefined();
    expect(requiresSocietyApproval(draft!.creator.type)).toBe(false);

    // Identity verification is normally mid-wizard; bypass it directly here
    // the same way creationGating.test.ts does for the society path.
    await t.run(async (ctx) => {
      if (!draft) throw new Error("missing campaign");
      await ctx.db.patch(draft._id, { stripeVerificationStatus: "verified" });
    });

    await asPoster.mutation(api.campaignCreator.submitForReview, {
      slug: created.slug,
    });

    const submitted = await t.run(async (ctx) => {
      return await ctx.db
        .query("campaigns")
        .withIndex("by_slug", (q) => q.eq("slug", created.slug))
        .unique();
    });
    // No leader tier for individual posters — auto-approved straight into
    // the admin queue, same outcome as a society leader's auto-approval.
    expect(submitted?.societyApprovalStatus).toBe("approved");
    expect(submitted?.status).toBe("pending");

    const adminQueue = await asAdmin.query(
      api.campaigns.listPendingForAdmin,
      {},
    );
    expect(adminQueue.some((c) => c.id === created.slug)).toBe(true);
  });
});
