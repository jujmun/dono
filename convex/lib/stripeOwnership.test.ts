import { describe, expect, it } from "vitest";
import { getRecurringDonationForUserHandler } from "./stripeOwnership";

/**
 * Ownership check used by cancelRecurringDonation:
 * substituting another user's recurringDonationId must return null (NOT_FOUND).
 */
describe("recurring donation ownership (IDOR guard)", () => {
  it("returns null when the caller is not the owner", () => {
    const result = getRecurringDonationForUserHandler({
      recurringDonation: {
        _id: "rd_victim" as never,
        userId: "user_victim" as never,
        status: "active",
        stripeSubscriptionId: "sub_1",
      },
      callerUserId: "user_attacker" as never,
    });
    expect(result).toBeNull();
  });

  it("returns the record when the caller owns it", () => {
    const record = {
      _id: "rd_own" as never,
      userId: "user_a" as never,
      status: "active" as const,
      stripeSubscriptionId: "sub_2",
    };
    const result = getRecurringDonationForUserHandler({
      recurringDonation: record,
      callerUserId: "user_a" as never,
    });
    expect(result).toEqual(record);
  });

  it("returns null for missing records without leaking existence", () => {
    expect(
      getRecurringDonationForUserHandler({
        recurringDonation: null,
        callerUserId: "user_a" as never,
      }),
    ).toBeNull();
  });
});
