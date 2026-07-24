import type { Doc } from "../_generated/dataModel";

export const VERIFICATION_LABELS = {
  studentStatus: "Student status checked by Dono",
  stripeOnboarding: "Stripe onboarding completed",
  societyApproved: "Society approved",
  institutionallyEndorsed: "Institutionally endorsed",
} as const;

type CampaignLike = Pick<
  Doc<"campaigns">,
  | "stripeVerificationStatus"
  | "societyApprovalStatus"
  | "verifications"
  | "verifiedName"
> & {
  studentStatusChecked?: boolean;
  institutionallyEndorsed?: boolean;
  stripeConnectOnboardingComplete?: boolean;
};

/**
 * Build ToS §9 verification badges from live status fields.
 */
export function buildCampaignVerifications(
  campaign: CampaignLike,
  options?: {
    studentStatusChecked?: boolean;
    stripeConnectOnboardingComplete?: boolean;
    institutionallyEndorsed?: boolean;
  },
): { type: string; label: string; endorsedBy?: string }[] {
  const badges: { type: string; label: string; endorsedBy?: string }[] = [];

  const studentChecked =
    options?.studentStatusChecked ??
    campaign.studentStatusChecked ??
    campaign.stripeVerificationStatus === "verified";
  if (studentChecked) {
    badges.push({
      type: "student_status",
      label: VERIFICATION_LABELS.studentStatus,
    });
  }

  const stripeDone =
    options?.stripeConnectOnboardingComplete ??
    campaign.stripeConnectOnboardingComplete ??
    false;
  if (stripeDone) {
    badges.push({
      type: "stripe_onboarding",
      label: VERIFICATION_LABELS.stripeOnboarding,
    });
  }

  if (campaign.societyApprovalStatus === "approved") {
    badges.push({
      type: "society_approved",
      label: VERIFICATION_LABELS.societyApproved,
    });
  }

  const endorsed =
    options?.institutionallyEndorsed ?? campaign.institutionallyEndorsed ?? false;
  if (endorsed) {
    badges.push({
      type: "institutionally_endorsed",
      label: VERIFICATION_LABELS.institutionallyEndorsed,
    });
  }

  return badges;
}
