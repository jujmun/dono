import { internalMutation } from "./_generated/server";

const STALE_PENDING_MS = 24 * 60 * 60 * 1000;

export const reconcileStalePendingDonations = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - STALE_PENDING_MS;
    const donations = await ctx.db.query("donations").collect();
    const stale = donations.filter(
      (d) => d.paymentStatus === "pending" && d.createdAt < cutoff,
    );

    let failed = 0;
    for (const donation of stale) {
      await ctx.db.patch(donation._id, { paymentStatus: "failed" });
      failed += 1;
    }

    return { failed };
  },
});

export const completeExpiredCampaigns = internalMutation({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().slice(0, 10);
    const campaigns = await ctx.db.query("campaigns").collect();
    let completed = 0;

    for (const campaign of campaigns) {
      if (
        (campaign.status === "active" || campaign.status === "funded") &&
        campaign.deadline < today
      ) {
        await ctx.db.patch(campaign._id, { status: "completed" });
        completed += 1;
      }
    }

    return { completed };
  },
});
