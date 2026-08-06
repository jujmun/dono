import type { MutationCtx } from "../_generated/server";
import { internal } from "../_generated/api";

/** Email approved society leaders that a campaign is ready for their review. */
export async function notifySocietyLeadersCampaignPending(
  ctx: MutationCtx,
  args: {
    communitySlug: string;
    societyName: string;
    campaignTitle: string;
  },
) {
  const leaders = await ctx.db
    .query("societyMembers")
    .withIndex("by_community_status", (q) =>
      q.eq("communitySlug", args.communitySlug).eq("status", "approved"),
    )
    .collect();
  for (const leader of leaders.filter((m) => m.role === "leader")) {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", leader.userId))
      .unique();
    if (profile?.email) {
      await ctx.scheduler.runAfter(0, internal.emails.sendSocietyCampaignPending, {
        leaderEmail: profile.email,
        societyName: args.societyName,
        campaignTitle: args.campaignTitle,
      });
    }
  }
}
