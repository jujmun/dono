import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { throwFeatureRemoved } from "./lib/featureGates";

/**
 * CF-01: Community-fund payment settlement on the platform account is removed.
 * Any webhook or confirm path that still references this mutation must fail closed.
 */
export const markFundDonationSucceeded = internalMutation({
  args: { stripePaymentIntentId: v.string() },
  handler: async () => {
    throwFeatureRemoved(
      "Community funds",
      "Community fund donations are not available. Dono does not settle charges on a platform payment account.",
    );
  },
});
