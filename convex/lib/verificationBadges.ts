/**
 * EL-05: Public verification / trust badges are removed.
 * The Terms prohibit presenting verification, validation, eligibility or trust
 * indicators. Live gate fields remain for internal use; badges must not render.
 */
export function buildCampaignVerifications(
  _campaign?: unknown,
  _options?: unknown,
): { type: string; label: string; endorsedBy?: string }[] {
  return [];
}

/** @deprecated Labels retained only so historical references compile. */
export const VERIFICATION_LABELS = {
  studentStatus: "Student status checked by Dono",
  stripeOnboarding: "Stripe onboarding completed",
  societyApproved: "Society approved",
  institutionallyEndorsed: "Institutionally endorsed",
} as const;
