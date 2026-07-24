import { ConvexError, v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { assertLegalAcceptedForContext } from "./lib/legalAcceptance";
import { assertAdultOrThrow } from "./lib/ageGate";

/** Gates for donate flow callable from Stripe actions. */
export const assertDonateGates = internalMutation({
  args: {
    userId: v.optional(v.id("users")),
    guestKey: v.optional(v.string()),
    ageAttested: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (!args.ageAttested) {
      throw new ConvexError({
        code: "AGE_RESTRICTED",
        message: "You must confirm you are at least 18 years old to donate.",
      });
    }
    if (!args.userId && !args.guestKey) {
      throw new ConvexError({
        code: "LEGAL_ACCEPTANCE_REQUIRED",
        message: "Please accept the Donor Terms before donating.",
      });
    }
    await assertLegalAcceptedForContext(ctx, {
      userId: args.userId,
      guestKey: args.guestKey,
      context: "donate",
    });
    if (args.userId) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId!))
        .unique();
      if (profile?.dateOfBirth) {
        assertAdultOrThrow(profile.dateOfBirth);
      }
    }
    return null;
  },
});
