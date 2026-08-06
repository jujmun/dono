import type { Doc } from "../_generated/dataModel";
import { isStripeIdentityEnabled } from "./stripeIdentityEnabled";

type CampaignDoc = Doc<"campaigns">;

const PUBLIC_STATUSES = new Set(["active", "funded", "completed"]);

export function isPublicStatus(status: string) {
  return PUBLIC_STATUSES.has(status);
}

/** Campaign is browsable when admin-approved and society-approved (if applicable). */
export function isPublicCampaign(campaign: CampaignDoc) {
  if (!isPublicStatus(campaign.status)) return false;
  if (campaign.creator.type === "society") {
    return campaign.societyApprovalStatus === "approved";
  }
  return true;
}

export function requiresSocietyApproval(creatorType: string) {
  return creatorType === "society";
}

/** Stripe Identity must be verified before society or admin review when enabled. */
export function hasCompletedStripeIdentity(
  campaign: Pick<CampaignDoc, "stripeVerificationStatus">,
) {
  if (!isStripeIdentityEnabled()) return true;
  return campaign.stripeVerificationStatus === "verified";
}

/** True when a campaign should appear in the society leader approval queue. */
export function isReadyForSocietyReview(campaign: CampaignDoc) {
  if (campaign.societyApprovalStatus !== "pending") return false;
  return hasCompletedStripeIdentity(campaign);
}

/** True when a pending campaign should appear in the admin review queue —
 * society-created campaigns must already have leader approval, and Stripe
 * Identity must be verified when enabled. */
export function isReadyForAdminReview(campaign: CampaignDoc) {
  if (campaign.status !== "pending") return false;
  if (!hasCompletedStripeIdentity(campaign)) return false;
  if (requiresSocietyApproval(campaign.creator.type)) {
    return campaign.societyApprovalStatus === "approved";
  }
  return true;
}

/** True while a campaign is awaiting an admin decision — either freshly
 * submitted or sent back for edits. approve/reject both operate on either. */
export function isUnderReview(status: string) {
  return status === "pending" || status === "changes_requested";
}

/** True while the owner is allowed to edit fields / resubmit — mirrors the
 * guard already used by campaignCreator.update and .resubmit. */
export function isEditableByOwner(status: string) {
  return status === "pending" || status === "rejected" || status === "changes_requested";
}
