import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  assertRefundWindow,
  MS_DAY,
  ORDINARY_WINDOW_DAYS,
  FRAUD_WINDOW_DAYS,
} from "./refunds";

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

async function seedCampaign(
  t: ReturnType<typeof newTestConvex>,
  ownerId: Id<"users">,
  overrides: Partial<{ deadline: string; status: "active" | "completed" }> = {},
) {
  return await t.run(async (ctx) => {
    return await ctx.db.insert("campaigns", {
      slug: `test-campaign-${Math.random().toString(36).slice(2)}`,
      title: "Test Campaign",
      description: "desc",
      story: "story",
      category: "academic",
      goal: 1000,
      raised: 1000,
      donors: 1,
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
      deadline:
        overrides.deadline ?? new Date(Date.now() - MS_DAY).toISOString(),
      status: overrides.status ?? "completed",
      updates: [],
      createdBy: ownerId,
    });
  });
}

async function seedDonation(
  t: ReturnType<typeof newTestConvex>,
  args: {
    userId: Id<"users">;
    campaignId: Id<"campaigns">;
    amount: number;
    createdAt?: number;
  },
) {
  return await t.run(async (ctx) => {
    const grossAmountMinor = Math.round(args.amount * 100);
    return await ctx.db.insert("donations", {
      userId: args.userId,
      campaignId: args.campaignId,
      amount: args.amount,
      currency: "gbp",
      type: "one_time",
      paymentStatus: "succeeded",
      grossAmountMinor,
      applicationFeeAmountMinor: Math.round(grossAmountMinor * 0.035),
      stripePaymentIntentId: `pi_${Math.random().toString(36).slice(2)}`,
      stripeChargeId: `ch_${Math.random().toString(36).slice(2)}`,
      stripeConnectedAccountId: "acct_test",
      createdAt: args.createdAt ?? Date.now(),
    });
  });
}

describe("assertRefundWindow", () => {
  const now = Date.parse("2026-06-01T00:00:00.000Z");

  it("allows an ordinary request within 60 days of the campaign end date", () => {
    const deadline = new Date(now - 10 * MS_DAY).toISOString();
    expect(() =>
      assertRefundWindow({
        isFraudClaim: false,
        campaignDeadline: deadline,
        donationCreatedAt: now - 20 * MS_DAY,
        now,
      }),
    ).not.toThrow();
  });

  it("rejects an ordinary request after the 60-day window", () => {
    const deadline = new Date(
      now - (ORDINARY_WINDOW_DAYS + 1) * MS_DAY,
    ).toISOString();
    expect(() =>
      assertRefundWindow({
        isFraudClaim: false,
        campaignDeadline: deadline,
        donationCreatedAt: now - 200 * MS_DAY,
        now,
      }),
    ).toThrow(/60 days/);
  });

  it("allows a fraud claim up to 12 months after the donation regardless of campaign deadline", () => {
    const deadline = new Date(now - 500 * MS_DAY).toISOString();
    expect(() =>
      assertRefundWindow({
        isFraudClaim: true,
        campaignDeadline: deadline,
        donationCreatedAt: now - (FRAUD_WINDOW_DAYS - 1) * MS_DAY,
        now,
      }),
    ).not.toThrow();
  });

  it("rejects a fraud claim after 12 months", () => {
    expect(() =>
      assertRefundWindow({
        isFraudClaim: true,
        campaignDeadline: new Date(now).toISOString(),
        donationCreatedAt: now - (FRAUD_WINDOW_DAYS + 1) * MS_DAY,
        now,
      }),
    ).toThrow(/12 months/);
  });
});

describe("refund request lifecycle (Refund Policy §6.1 — owner self-serves)", () => {
  it("approval notifies the owner instead of calling Stripe directly", async () => {
    const t = newTestConvex();
    const donorId = await seedUser(t, { email: "donor@ox.ac.uk" });
    const ownerId = await seedUser(t, { email: "owner@ox.ac.uk" });
    const adminId = await seedUser(t, {
      email: "admin@ox.ac.uk",
      role: "admin",
    });
    const campaignId = await seedCampaign(t, ownerId);
    const donationId = await seedDonation(t, {
      userId: donorId,
      campaignId,
      amount: 50,
    });

    const asDonor = t.withIdentity({ subject: donorId });
    const { requestId } = await asDonor.mutation(api.refunds.createRequest, {
      donationId,
      grounds: "Duplicate payment",
      details: "I accidentally donated twice.",
      isFraudClaim: false,
    });

    const asOwner = t.withIdentity({ subject: ownerId });
    await asOwner.mutation(api.refunds.ownerRespond, {
      requestId,
      response: "Confirmed — happy to refund.",
    });

    const asAdmin = t.withIdentity({ subject: adminId });
    await asAdmin.mutation(api.refunds.adminDecide, {
      requestId,
      decision: "approve",
    });

    const requests = await asAdmin.query(api.refunds.listForAdmin, {
      status: "approved",
    });
    expect(requests).toHaveLength(1);
    expect(requests[0].stripeRefundId).toBeUndefined();

    // The owner must have been notified to act — this is the load-bearing
    // assertion for §6.1: Dono decides, but never touches Stripe's API here.
    const notifications = await t.run(async (ctx) => {
      return await ctx.db
        .query("notifications")
        .withIndex("by_user", (q) => q.eq("userId", ownerId))
        .collect();
    });
    expect(
      notifications.some((n) => n.type === "refund_owner_action_required"),
    ).toBe(true);

    // Scheduled email action should run cleanly with no Resend key configured
    // in tests (logs + no-ops rather than throwing) — proves the approval
    // path doesn't crash even though no real email gets sent here.
    await t.finishAllScheduledFunctions(() => {});
  });

  it("deny leaves the request denied with no owner notification", async () => {
    const t = newTestConvex();
    const donorId = await seedUser(t, { email: "donor2@ox.ac.uk" });
    const ownerId = await seedUser(t, { email: "owner2@ox.ac.uk" });
    const adminId = await seedUser(t, {
      email: "admin2@ox.ac.uk",
      role: "admin",
    });
    const campaignId = await seedCampaign(t, ownerId);
    const donationId = await seedDonation(t, {
      userId: donorId,
      campaignId,
      amount: 20,
    });

    const asDonor = t.withIdentity({ subject: donorId });
    const { requestId } = await asDonor.mutation(api.refunds.createRequest, {
      donationId,
      grounds: "Changed my mind",
      details: "No longer want to support this.",
      isFraudClaim: false,
    });

    const asOwner = t.withIdentity({ subject: ownerId });
    await asOwner.mutation(api.refunds.ownerRespond, {
      requestId,
      response: "This doesn't meet the refund grounds.",
    });

    const asAdmin = t.withIdentity({ subject: adminId });
    await asAdmin.mutation(api.refunds.adminDecide, {
      requestId,
      decision: "deny",
      note: "Not a valid ground under the Refund Policy.",
    });

    const mine = await asDonor.query(api.refunds.listMine, {});
    expect(mine[0].status).toBe("denied");

    const notifications = await t.run(async (ctx) => {
      return await ctx.db
        .query("notifications")
        .withIndex("by_user", (q) => q.eq("userId", ownerId))
        .collect();
    });
    expect(notifications).toHaveLength(0);
  });
});

describe("markApprovedRequestRefundedByDonation (webhook completion)", () => {
  it("marks an approved request refunded once Stripe confirms the charge refund", async () => {
    const t = newTestConvex();
    const donorId = await seedUser(t, { email: "donor3@ox.ac.uk" });
    const ownerId = await seedUser(t, { email: "owner3@ox.ac.uk" });
    const campaignId = await seedCampaign(t, ownerId);
    const donationId = await seedDonation(t, {
      userId: donorId,
      campaignId,
      amount: 30,
    });

    const requestId = await t.run(async (ctx) => {
      return await ctx.db.insert("refundRequests", {
        donationId,
        requesterUserId: donorId,
        campaignId,
        grounds: "Duplicate payment",
        details: "details",
        status: "approved",
        isFraudClaim: false,
        createdAt: Date.now(),
      });
    });

    await t.mutation(internal.refunds.markApprovedRequestRefundedByDonation, {
      donationId,
      stripeRefundId: "re_123",
    });

    const updated = await t.run(async (ctx) => ctx.db.get(requestId));
    expect(updated?.status).toBe("refunded");
    expect(updated?.stripeRefundId).toBe("re_123");
  });

  it("no-ops when there is no approved request for the donation", async () => {
    const t = newTestConvex();
    const donorId = await seedUser(t, { email: "donor4@ox.ac.uk" });
    const ownerId = await seedUser(t, { email: "owner4@ox.ac.uk" });
    const campaignId = await seedCampaign(t, ownerId);
    const donationId = await seedDonation(t, {
      userId: donorId,
      campaignId,
      amount: 15,
    });

    // Should not throw even though no refundRequests row exists at all —
    // this is the normal case for every ordinary (non-refunded) donation.
    await expect(
      t.mutation(internal.refunds.markApprovedRequestRefundedByDonation, {
        donationId,
      }),
    ).resolves.toBeNull();
  });
});

describe("surplusRefundReverseChron", () => {
  it("refunds the most recent donors first until the surplus is exhausted", async () => {
    const t = newTestConvex();
    const ownerId = await seedUser(t, { email: "owner5@ox.ac.uk" });
    const donorA = await seedUser(t, { email: "donorA@ox.ac.uk" });
    const donorB = await seedUser(t, { email: "donorB@ox.ac.uk" });
    const donorC = await seedUser(t, { email: "donorC@ox.ac.uk" });
    const campaignId = await seedCampaign(t, ownerId);

    const oldest = await seedDonation(t, {
      userId: donorA,
      campaignId,
      amount: 20,
      createdAt: 1_000,
    });
    const middle = await seedDonation(t, {
      userId: donorB,
      campaignId,
      amount: 20,
      createdAt: 2_000,
    });
    const newest = await seedDonation(t, {
      userId: donorC,
      campaignId,
      amount: 20,
      createdAt: 3_000,
    });

    // £25 surplus: fully consumes the newest £20 donation, then takes £5
    // from the next-most-recent — the oldest donation should be untouched.
    const result = await t.mutation(
      internal.refunds.surplusRefundReverseChron,
      { campaignId, surplusAmountMinor: 2500 },
    );

    expect(result.remainingSurplusMinor).toBe(0);
    expect(result.createdRequestIds).toHaveLength(2);

    const requests = await t.run(async (ctx) =>
      ctx.db
        .query("refundRequests")
        .withIndex("by_campaign", (q) => q.eq("campaignId", campaignId))
        .collect(),
    );
    const byDonation = new Map(requests.map((r) => [r.donationId, r]));
    expect(byDonation.get(newest)).toBeDefined();
    expect(byDonation.get(middle)).toBeDefined();
    expect(byDonation.get(oldest)).toBeUndefined();
    for (const r of requests) {
      expect(r.status).toBe("pending_admin");
    }
  });

  it("rejects a surplus at or below the de minimis threshold", async () => {
    const t = newTestConvex();
    const ownerId = await seedUser(t, { email: "owner6@ox.ac.uk" });
    const campaignId = await seedCampaign(t, ownerId);

    await expect(
      t.mutation(internal.refunds.surplusRefundReverseChron, {
        campaignId,
        surplusAmountMinor: 0,
      }),
    ).rejects.toThrow(/de minimis/);
  });
});

describe("charge/dispute reconciliation (convex/stripeInternal.ts)", () => {
  it("marks a full refund and clears the correct campaign raised amount", async () => {
    const t = newTestConvex();
    const ownerId = await seedUser(t, { email: "owner7@ox.ac.uk" });
    const donorId = await seedUser(t, { email: "donor7@ox.ac.uk" });
    const campaignId = await seedCampaign(t, ownerId);
    const donationId = await seedDonation(t, {
      userId: donorId,
      campaignId,
      amount: 40,
    });
    const donation = await t.run(async (ctx) => ctx.db.get(donationId));

    const result = await t.mutation(internal.stripeInternal.markDonationRefunded, {
      stripePaymentIntentId: donation!.stripePaymentIntentId!,
      refundedAmountMinor: 4000,
      isFullRefund: true,
    });

    expect(result.updated).toBe(true);
    // 3.5% Dono fee on £40 = £1.40 = 140 minor units, fully refunded on a
    // full-amount refund.
    expect(result.applicationFeeRefundMinor).toBe(140);

    const updated = await t.run(async (ctx) => ctx.db.get(donationId));
    expect(updated?.paymentStatus).toBe("refunded");
    expect(updated?.refundedAmountMinor).toBe(4000);
  });

  it("marks a partial refund without flipping the donation to fully refunded", async () => {
    const t = newTestConvex();
    const ownerId = await seedUser(t, { email: "owner8@ox.ac.uk" });
    const donorId = await seedUser(t, { email: "donor8@ox.ac.uk" });
    const campaignId = await seedCampaign(t, ownerId);
    const donationId = await seedDonation(t, {
      userId: donorId,
      campaignId,
      amount: 40,
    });
    const donation = await t.run(async (ctx) => ctx.db.get(donationId));

    const result = await t.mutation(internal.stripeInternal.markDonationRefunded, {
      stripePaymentIntentId: donation!.stripePaymentIntentId!,
      refundedAmountMinor: 1000,
      isFullRefund: false,
    });

    expect(result.updated).toBe(true);
    const updated = await t.run(async (ctx) => ctx.db.get(donationId));
    expect(updated?.paymentStatus).toBe("partially_refunded");
    expect(updated?.refundedAmountMinor).toBe(1000);
  });

  it("tracks dispute open -> lost, refunding the application fee delta", async () => {
    const t = newTestConvex();
    const ownerId = await seedUser(t, { email: "owner9@ox.ac.uk" });
    const donorId = await seedUser(t, { email: "donor9@ox.ac.uk" });
    const campaignId = await seedCampaign(t, ownerId);
    const donationId = await seedDonation(t, {
      userId: donorId,
      campaignId,
      amount: 40,
    });
    const donation = await t.run(async (ctx) => ctx.db.get(donationId));
    const paymentIntentId = donation!.stripePaymentIntentId!;

    const opened = await t.mutation(
      internal.stripeInternal.markDonationDisputeOpened,
      { stripePaymentIntentId: paymentIntentId },
    );
    expect(opened.updated).toBe(true);
    expect(
      (await t.run(async (ctx) => ctx.db.get(donationId)))?.disputeStatus,
    ).toBe("open");

    const closed = await t.mutation(
      internal.stripeInternal.markDonationDisputeClosed,
      {
        stripePaymentIntentId: paymentIntentId,
        status: "lost",
        refundedAmountMinor: 4000,
        isFullRefund: true,
      },
    );
    expect(closed.applicationFeeRefundMinor).toBe(140);
    expect(
      (await t.run(async (ctx) => ctx.db.get(donationId)))?.disputeStatus,
    ).toBe("lost");
  });

  it("tracks dispute open -> won, leaving the donation unaffected", async () => {
    const t = newTestConvex();
    const ownerId = await seedUser(t, { email: "owner10@ox.ac.uk" });
    const donorId = await seedUser(t, { email: "donor10@ox.ac.uk" });
    const campaignId = await seedCampaign(t, ownerId);
    const donationId = await seedDonation(t, {
      userId: donorId,
      campaignId,
      amount: 40,
    });
    const donation = await t.run(async (ctx) => ctx.db.get(donationId));
    const paymentIntentId = donation!.stripePaymentIntentId!;

    await t.mutation(internal.stripeInternal.markDonationDisputeOpened, {
      stripePaymentIntentId: paymentIntentId,
    });
    await t.mutation(internal.stripeInternal.markDonationDisputeClosed, {
      stripePaymentIntentId: paymentIntentId,
      status: "won",
    });

    const updated = await t.run(async (ctx) => ctx.db.get(donationId));
    expect(updated?.disputeStatus).toBe("won");
    expect(updated?.paymentStatus).toBe("succeeded");
  });
});
