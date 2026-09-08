import { isCampaignFunded } from "./existingFunding";

type CampaignCounters = {
  raised: number;
  donors: number;
  goal: number;
  existingFunding?: number;
  status:
    | "pending"
    | "rejected"
    | "active"
    | "funded"
    | "completed"
    | "changes_requested";
};

export function computeCampaignAfterDonation(
  campaign: CampaignCounters,
  amount: number,
): CampaignCounters {
  const raised = campaign.raised + amount;
  const donors = campaign.donors + 1;
  const status: CampaignCounters["status"] = isCampaignFunded({
    raised,
    existingFunding: campaign.existingFunding,
    goal: campaign.goal,
  })
    ? "funded"
    : campaign.status === "completed"
      ? "completed"
      : "active";

  return { raised, donors, status, goal: campaign.goal };
}
