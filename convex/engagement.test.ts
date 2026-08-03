import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

// convex-test needs the module map to resolve cross-file function references
// (internal.* calls, scheduler.runAfter) at test time.
const modules = import.meta.glob("./**/*.*s");

function newTestConvex() {
  return convexTest(schema, modules);
}

async function seedUser(
  t: ReturnType<typeof newTestConvex>,
  args: { email: string; role?: "user" | "admin" },
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
      emailVerifiedAt: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return userId;
  });
}

/** Verified "society" community — the only community type comments/membership apply to. */
async function seedSociety(
  t: ReturnType<typeof newTestConvex>,
  slug: string,
) {
  return await t.run(async (ctx) => {
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
    return slug;
  });
}

async function seedMembership(
  t: ReturnType<typeof newTestConvex>,
  args: {
    communitySlug: string;
    userId: Id<"users">;
    role: "leader" | "member";
    status: "pending" | "approved" | "rejected";
  },
) {
  return await t.run(async (ctx) => {
    return await ctx.db.insert("societyMembers", {
      communitySlug: args.communitySlug,
      userId: args.userId,
      role: args.role,
      status: args.status,
      createdAt: Date.now(),
    });
  });
}

async function seedFollow(
  t: ReturnType<typeof newTestConvex>,
  args: { communitySlug: string; userId: Id<"users"> },
) {
  await t.run(async (ctx) => {
    await ctx.db.insert("communityFollows", {
      communitySlug: args.communitySlug,
      userId: args.userId,
      createdAt: Date.now(),
    });
  });
}

async function seedCampaign(
  t: ReturnType<typeof newTestConvex>,
  args: { communitySlug: string; createdBy: Id<"users"> },
) {
  return await t.run(async (ctx) => {
    const slug = `campaign-${Math.random().toString(36).slice(2)}`;
    await ctx.db.insert("campaigns", {
      slug,
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
        communityId: args.communitySlug,
      },
      verifications: [],
      university: "University of Oxford",
      image: "",
      createdAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      status: "active",
      updates: [],
      createdBy: args.createdBy,
    });
    return slug;
  });
}

async function seedApprovedMemberWithCampaign(t: ReturnType<typeof newTestConvex>) {
  const societySlug = await seedSociety(t, `soc-${Math.random().toString(36).slice(2)}`);
  const leaderId = await seedUser(t, { email: `leader-${societySlug}@ox.ac.uk` });
  await seedMembership(t, {
    communitySlug: societySlug,
    userId: leaderId,
    role: "leader",
    status: "approved",
  });
  const campaignSlug = await seedCampaign(t, {
    communitySlug: societySlug,
    createdBy: leaderId,
  });
  return { societySlug, leaderId, campaignSlug };
}

describe("engagement.addComment — society membership gate", () => {
  it("an approved society member can comment", async () => {
    const t = newTestConvex();
    const { societySlug, campaignSlug } = await seedApprovedMemberWithCampaign(t);
    const memberId = await seedUser(t, { email: "member@ox.ac.uk" });
    await seedMembership(t, {
      communitySlug: societySlug,
      userId: memberId,
      role: "member",
      status: "approved",
    });

    const asMember = t.withIdentity({ subject: memberId });
    const { commentId } = await asMember.mutation(api.engagement.addComment, {
      campaignSlug,
      body: "Great work!",
    });
    expect(commentId).toBeDefined();

    const comments = await asMember.query(api.engagement.listComments, {
      campaignSlug,
    });
    expect(comments).toHaveLength(1);
    expect(comments[0].authorUserId).toBe(memberId);
  });

  it("a follower of the society cannot comment", async () => {
    const t = newTestConvex();
    const { societySlug, campaignSlug } = await seedApprovedMemberWithCampaign(t);
    const followerId = await seedUser(t, { email: "follower@ox.ac.uk" });
    await seedFollow(t, { communitySlug: societySlug, userId: followerId });

    const asFollower = t.withIdentity({ subject: followerId });
    await expect(
      asFollower.mutation(api.engagement.addComment, {
        campaignSlug,
        body: "Nice!",
      }),
    ).rejects.toThrow();
  });

  it("an unaffiliated user cannot comment", async () => {
    const t = newTestConvex();
    const { campaignSlug } = await seedApprovedMemberWithCampaign(t);
    const strangerId = await seedUser(t, { email: "stranger@ox.ac.uk" });

    const asStranger = t.withIdentity({ subject: strangerId });
    await expect(
      asStranger.mutation(api.engagement.addComment, {
        campaignSlug,
        body: "Hi",
      }),
    ).rejects.toThrow();
  });

  it("a member of a different society cannot comment", async () => {
    const t = newTestConvex();
    const { campaignSlug } = await seedApprovedMemberWithCampaign(t);

    const otherSocietySlug = await seedSociety(t, "other-society");
    const otherMemberId = await seedUser(t, { email: "other-member@ox.ac.uk" });
    await seedMembership(t, {
      communitySlug: otherSocietySlug,
      userId: otherMemberId,
      role: "member",
      status: "approved",
    });

    const asOtherMember = t.withIdentity({ subject: otherMemberId });
    await expect(
      asOtherMember.mutation(api.engagement.addComment, {
        campaignSlug,
        body: "Hi",
      }),
    ).rejects.toThrow();
  });

  it("a pending (not yet approved) member cannot comment", async () => {
    const t = newTestConvex();
    const { societySlug, campaignSlug } = await seedApprovedMemberWithCampaign(t);
    const pendingId = await seedUser(t, { email: "pending@ox.ac.uk" });
    await seedMembership(t, {
      communitySlug: societySlug,
      userId: pendingId,
      role: "member",
      status: "pending",
    });

    const asPending = t.withIdentity({ subject: pendingId });
    await expect(
      asPending.mutation(api.engagement.addComment, {
        campaignSlug,
        body: "Hi",
      }),
    ).rejects.toThrow();
  });

  it("a rejected/banned member cannot comment", async () => {
    const t = newTestConvex();
    const { societySlug, campaignSlug } = await seedApprovedMemberWithCampaign(t);
    const bannedId = await seedUser(t, { email: "banned@ox.ac.uk" });
    await seedMembership(t, {
      communitySlug: societySlug,
      userId: bannedId,
      role: "member",
      status: "rejected",
    });

    const asBanned = t.withIdentity({ subject: bannedId });
    await expect(
      asBanned.mutation(api.engagement.addComment, {
        campaignSlug,
        body: "Hi",
      }),
    ).rejects.toThrow();
  });
});

describe("engagement.editComment / deleteComment — membership re-checked", () => {
  it("a member can edit and delete their own comment", async () => {
    const t = newTestConvex();
    const { societySlug, campaignSlug } = await seedApprovedMemberWithCampaign(t);
    const memberId = await seedUser(t, { email: "member2@ox.ac.uk" });
    await seedMembership(t, {
      communitySlug: societySlug,
      userId: memberId,
      role: "member",
      status: "approved",
    });

    const asMember = t.withIdentity({ subject: memberId });
    const { commentId } = await asMember.mutation(api.engagement.addComment, {
      campaignSlug,
      body: "Original",
    });

    await asMember.mutation(api.engagement.editComment, {
      commentId,
      body: "Edited",
    });
    const comments = await asMember.query(api.engagement.listComments, {
      campaignSlug,
    });
    expect(comments[0].body).toBe("Edited");

    await expect(
      asMember.mutation(api.engagement.deleteComment, { commentId }),
    ).resolves.toBeNull();
  });

  it("a comment author who has lost their membership can no longer edit or delete it", async () => {
    const t = newTestConvex();
    const { societySlug, campaignSlug } = await seedApprovedMemberWithCampaign(t);
    const memberId = await seedUser(t, { email: "leaving@ox.ac.uk" });
    const membershipId = await seedMembership(t, {
      communitySlug: societySlug,
      userId: memberId,
      role: "member",
      status: "approved",
    });

    const asMember = t.withIdentity({ subject: memberId });
    const { commentId } = await asMember.mutation(api.engagement.addComment, {
      campaignSlug,
      body: "Original",
    });

    // Simulate the society removing this member after they commented.
    await t.run(async (ctx) => {
      await ctx.db.delete(membershipId);
    });

    await expect(
      asMember.mutation(api.engagement.editComment, {
        commentId,
        body: "Edited after removal",
      }),
    ).rejects.toThrow();

    await expect(
      asMember.mutation(api.engagement.deleteComment, { commentId }),
    ).rejects.toThrow();
  });

  it("an admin can delete any comment regardless of their own society membership", async () => {
    const t = newTestConvex();
    const { societySlug, campaignSlug } = await seedApprovedMemberWithCampaign(t);
    const memberId = await seedUser(t, { email: "member3@ox.ac.uk" });
    await seedMembership(t, {
      communitySlug: societySlug,
      userId: memberId,
      role: "member",
      status: "approved",
    });
    const adminId = await seedUser(t, {
      email: "admin@ox.ac.uk",
      role: "admin",
    });

    const asMember = t.withIdentity({ subject: memberId });
    const { commentId } = await asMember.mutation(api.engagement.addComment, {
      campaignSlug,
      body: "Original",
    });

    const asAdmin = t.withIdentity({ subject: adminId });
    await expect(
      asAdmin.mutation(api.engagement.deleteComment, { commentId }),
    ).resolves.toBeNull();
  });
});
