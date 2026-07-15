import type { Doc } from "../_generated/dataModel";

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
