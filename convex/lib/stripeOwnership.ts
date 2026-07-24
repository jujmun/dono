import type { Id } from "../_generated/dataModel";

type RecurringDonationLike = {
  _id: Id<"recurringDonations">;
  userId: Id<"users">;
  campaignId: Id<"campaigns">;
  status: string;
  stripeSubscriptionId: string;
};

/**
 * Pure ownership check matching stripeInternal.getRecurringDonationForUser.
 * Extracted for security regression tests (User A cannot cancel User B).
 */
export function getRecurringDonationForUserHandler(args: {
  recurringDonation: RecurringDonationLike | null;
  callerUserId: Id<"users">;
}): RecurringDonationLike | null {
  const { recurringDonation, callerUserId } = args;
  if (!recurringDonation || recurringDonation.userId !== callerUserId) {
    return null;
  }
  return recurringDonation;
}
