import type { Doc } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import {
  seedActivity,
  seedCampaigns,
  seedCommunities,
  seedFunds,
} from "./seedData";

type CampaignInsert = Omit<Doc<"campaigns">, "_id" | "_creationTime">;
type ActivityInsert = Omit<Doc<"activityItems">, "_id" | "_creationTime">;

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("campaigns").first();
    if (existing) {
      return { seeded: false, message: "Database already has campaigns" };
    }

    for (const community of seedCommunities) {
      await ctx.db.insert("communities", community);
    }

    for (const campaign of seedCampaigns) {
      await ctx.db.insert("campaigns", campaign as CampaignInsert);
    }

    for (const fund of seedFunds) {
      await ctx.db.insert("communityFunds", fund);
    }

    for (const item of seedActivity) {
      await ctx.db.insert("activityItems", item as ActivityInsert);
    }

    return {
      seeded: true,
      communities: seedCommunities.length,
      campaigns: seedCampaigns.length,
      funds: seedFunds.length,
      activity: seedActivity.length,
    };
  },
});
