import type { MutationCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

export async function incrementCommunityRaised(
  ctx: MutationCtx,
  communitySlug: string,
  amount: number,
) {
  const community = await ctx.db
    .query("communities")
    .withIndex("by_slug", (q) => q.eq("slug", communitySlug))
    .unique();
  if (!community) return;
  await ctx.db.patch(community._id, {
    totalRaised: community.totalRaised + amount,
  });
}

export async function incrementFundRaised(
  ctx: MutationCtx,
  fundId: Id<"communityFunds">,
  amount: number,
  campaignsSupportedDelta = 0,
) {
  const fund = await ctx.db.get(fundId);
  if (!fund) return;
  await ctx.db.patch(fundId, {
    totalRaised: fund.totalRaised + amount,
    donors: fund.donors + 1,
    campaignsSupported: fund.campaignsSupported + campaignsSupportedDelta,
  });
}
