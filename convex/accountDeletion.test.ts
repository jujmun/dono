import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { api, internal } from "./_generated/api";

const modules = import.meta.glob("./**/*.*s");

const EMAIL = "someone@ox.ac.uk";

function newTestConvex() {
  return convexTest(schema, modules);
}

/**
 * Seeds the shape a real OTP/password signup leaves behind: a verified `users`
 * row, an `authAccounts` row keyed on the email, a live session with a refresh
 * token, and the app-side profile.
 */
async function seedSignedUpUser(t: ReturnType<typeof newTestConvex>) {
  return await t.run(async (ctx) => {
    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      email: EMAIL,
      emailVerificationTime: now,
    });
    const accountId = await ctx.db.insert("authAccounts", {
      userId,
      provider: "password",
      providerAccountId: EMAIL,
      secret: "hashed-secret",
      emailVerified: EMAIL,
    });
    await ctx.db.insert("authVerificationCodes", {
      accountId,
      provider: "password",
      code: "hashed-code",
      expirationTime: now + 60_000,
      emailVerified: EMAIL,
    });
    const sessionId = await ctx.db.insert("authSessions", {
      userId,
      expirationTime: now + 60_000,
    });
    await ctx.db.insert("authRefreshTokens", {
      sessionId,
      expirationTime: now + 60_000,
    });
    await ctx.db.insert("profiles", {
      userId,
      email: EMAIL,
      name: "Real Name",
      role: "user",
      emailVerifiedAt: now,
      createdAt: now,
      updatedAt: now,
    });
    return { userId, accountId, sessionId };
  });
}

/**
 * The two lookups @convex-dev/auth performs when a signup arrives for an email:
 * the `authAccounts` match in createAccountFromCredentials/createVerificationCode,
 * and the `uniqueUserWithVerifiedEmail` fallback in defaultCreateOrUpdateUser.
 * If either one resolves, the "new" signup is silently linked to the old user.
 */
async function resolveExistingUserForSignup(
  t: ReturnType<typeof newTestConvex>,
  email: string,
) {
  return await t.run(async (ctx) => {
    const account = await ctx.db
      .query("authAccounts")
      .withIndex("providerAndAccountId", (q) =>
        q.eq("provider", "password").eq("providerAccountId", email),
      )
      .unique();
    if (account) return account.userId;

    const verifiedUsers = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .filter((q) => q.neq(q.field("emailVerificationTime"), undefined))
      .take(2);
    return verifiedUsers.length === 1 ? verifiedUsers[0]._id : null;
  });
}

describe("account deletion severs the email from the account", () => {
  it("leaves nothing for a re-signup with the same email to match", async () => {
    const t = newTestConvex();
    const { userId } = await seedSignedUpUser(t);

    expect(await resolveExistingUserForSignup(t, EMAIL)).toBe(userId);

    await t.mutation(internal.users.severAccountIdentity, { userId });

    expect(await resolveExistingUserForSignup(t, EMAIL)).toBeNull();
  });

  it("keeps the users row so financial history stays resolvable", async () => {
    const t = newTestConvex();
    const { userId } = await seedSignedUpUser(t);

    await t.mutation(internal.users.severAccountIdentity, { userId });

    const user = await t.run(async (ctx) => await ctx.db.get(userId));
    expect(user).not.toBeNull();
    expect(user?.email).not.toBe(EMAIL);
    expect(user?.emailVerificationTime).toBeUndefined();
  });

  it("deletes every credential, verification code, session and refresh token", async () => {
    const t = newTestConvex();
    const { userId } = await seedSignedUpUser(t);

    await t.mutation(internal.users.severAccountIdentity, { userId });

    const remaining = await t.run(async (ctx) => ({
      accounts: await ctx.db.query("authAccounts").collect(),
      codes: await ctx.db.query("authVerificationCodes").collect(),
      sessions: await ctx.db.query("authSessions").collect(),
      refreshTokens: await ctx.db.query("authRefreshTokens").collect(),
    }));

    expect(remaining.accounts).toHaveLength(0);
    expect(remaining.codes).toHaveLength(0);
    expect(remaining.sessions).toHaveLength(0);
    expect(remaining.refreshTokens).toHaveLength(0);
  });

  it("tombstones the profile and ensureMyProfile does not un-anonymize it", async () => {
    const t = newTestConvex();
    const { userId } = await seedSignedUpUser(t);

    await t.mutation(internal.users.severAccountIdentity, { userId });

    // The regression: ensureMyProfile runs on every authenticated app load and
    // used to patch `email: user.email` straight back over the anonymized row.
    await t
      .withIdentity({ subject: userId })
      .mutation(api.users.ensureMyProfile, {});

    const profile = await t.run(
      async (ctx) =>
        await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", userId))
          .unique(),
    );

    expect(profile?.deletedAt).toBeGreaterThan(0);
    expect(profile?.name).toBe("Deleted User");
    expect(profile?.email).not.toBe(EMAIL);
  });

  it("unsubscribes campaign update emails that would go to the released address", async () => {
    const t = newTestConvex();
    const { userId } = await seedSignedUpUser(t);

    const optInId = await t.run(async (ctx) => {
      const campaignId = await ctx.db.insert("campaigns", {
        slug: "test-campaign",
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
        createdBy: userId,
      });
      const donationId = await ctx.db.insert("donations", {
        userId,
        campaignId,
        amount: 10,
        currency: "gbp",
        type: "one_time",
        paymentStatus: "succeeded",
        createdAt: Date.now(),
      });
      return await ctx.db.insert("campaignUpdateOptIns", {
        campaignId,
        donationId,
        userId,
        donorEmail: EMAIL,
        createdAt: Date.now(),
      });
    });

    await t.mutation(internal.users.severAccountIdentity, { userId });

    const optIn = await t.run(async (ctx) => await ctx.db.get(optInId));
    expect(optIn?.unsubscribedAt).toBeGreaterThan(0);
  });

  it("clears verifiedName/verifiedDob on campaigns and societies the user created", async () => {
    const t = newTestConvex();
    const { userId } = await seedSignedUpUser(t);

    const { campaignId, societyId } = await t.run(async (ctx) => {
      const campaignId = await ctx.db.insert("campaigns", {
        slug: "test-campaign",
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
        createdBy: userId,
        stripeVerificationStatus: "verified",
        verifiedName: "Real Name",
        verifiedDob: "2000-01-01",
        verifiedAt: Date.now(),
      });
      const societyId = await ctx.db.insert("societies", {
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
        verifiedAt: Date.now(),
      });
      return { campaignId, societyId };
    });

    await t.mutation(internal.users.severAccountIdentity, { userId });

    const [campaign, society] = await t.run(async (ctx) => [
      await ctx.db.get(campaignId),
      await ctx.db.get(societyId),
    ]);

    expect(campaign?.verifiedName).toBeUndefined();
    expect(campaign?.verifiedDob).toBeUndefined();
    expect(campaign?.verifiedAt).toBeUndefined();
    expect(campaign?.stripeVerificationStatus).toBeUndefined();

    expect(society?.verifiedName).toBeUndefined();
    expect(society?.verifiedDob).toBeUndefined();
    expect(society?.verifiedAt).toBeUndefined();
    expect(society?.stripeVerificationStatus).toBeUndefined();
  });
});
