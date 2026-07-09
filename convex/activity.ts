import { mutation, query } from "./_generated/server";
import { toActivityItem } from "./lib/mappers";

const placeholderActivitySlugs = ["a1", "a2", "a3", "a4", "a5", "a6"];

export const list = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("activityItems").collect();
    return items.map(toActivityItem);
  },
});

export const removePlaceholderActivity = mutation({
  args: {},
  handler: async (ctx) => {
    let deleted = 0;

    for (const slug of placeholderActivitySlugs) {
      const item = await ctx.db
        .query("activityItems")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

      if (item) {
        await ctx.db.delete(item._id);
        deleted += 1;
      }
    }

    return { deleted, slugs: placeholderActivitySlugs };
  },
});
