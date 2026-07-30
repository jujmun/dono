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

type SocietySubscriptionLike = {
  _id: Id<"societySubscriptions">;
  userId: Id<"users">;
  communitySlug: string;
  status: string;
  stripeSubscriptionId: string;
};

/**
 * Pure ownership check matching stripeInternal.getSocietySubscriptionForUser.
 * Extracted for security regression tests (User A cannot cancel User B).
 */
export function getSocietySubscriptionForUserHandler(args: {
  societySubscription: SocietySubscriptionLike | null;
  callerUserId: Id<"users">;
}): SocietySubscriptionLike | null {
  const { societySubscription, callerUserId } = args;
  if (!societySubscription || societySubscription.userId !== callerUserId) {
    return null;
  }
  return societySubscription;
}
