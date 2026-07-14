type CampaignCounters = {
  raised: number;
  donors: number;
  goal: number;
  status: "pending" | "rejected" | "active" | "funded" | "completed";
};

export function computeCampaignAfterDonation(
  campaign: CampaignCounters,
  amount: number,
): CampaignCounters {
  const raised = campaign.raised + amount;
  const donors = campaign.donors + 1;
  const status: CampaignCounters["status"] =
    raised >= campaign.goal
      ? "funded"
      : campaign.status === "completed"
        ? "completed"
        : "active";

  return { raised, donors, status, goal: campaign.goal };
}
