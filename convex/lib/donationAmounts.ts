export const MIN_DONATION_AMOUNT = 1;
export const MAX_DONATION_AMOUNT = 100_000;
export const DONATION_CURRENCY = "gbp";

export function normalizeCampaignSlug(slug: string) {
  return slug.trim().toLowerCase();
}

export function validateDonationAmount(amount: number) {
  if (!Number.isFinite(amount)) {
    return {
      valid: false as const,
      message: "Donation amount must be between 1 and 100000.",
    };
  }
  if (amount < MIN_DONATION_AMOUNT || amount > MAX_DONATION_AMOUNT) {
    return {
      valid: false as const,
      message: "Donation amount must be between 1 and 100000.",
    };
  }
  return { valid: true as const };
}

export function donationAmountToStripeMinorUnits(amount: number) {
  return Math.round(amount * 100);
}
