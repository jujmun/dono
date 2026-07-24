export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getProgress(raised: number, goal: number): number {
  return Math.min(Math.round((raised / goal) * 100), 100);
}

export const categoryLabels: Record<string, string> = {
  textbooks: "Textbooks",
  equipment: "Equipment",
  travel: "Travel & Conferences",
  events: "Events",
  accessibility: "Accessibility",
  sports: "Sports",
  outreach: "Community Outreach",
};

export const categoryColors: Record<string, string> = {
  textbooks: "bg-blue-100 text-blue-700",
  equipment: "bg-purple-100 text-purple-700",
  travel: "bg-amber-100 text-amber-700",
  events: "bg-pink-100 text-pink-700",
  accessibility: "bg-teal-100 text-teal-700",
  sports: "bg-green-100 text-green-700",
  outreach: "bg-indigo-100 text-indigo-700",
};

export const creatorTypeLabels: Record<string, string> = {
  student: "Individual Student",
  society: "Student Society",
  college: "College",
  department: "Department",
  category: "Category",
};

interface CampaignApprovalStage {
  label: string;
}

type ApprovalCampaign = {
  status: string;
  creator: { type: string };
  societyApprovalStatus?: "pending" | "approved" | "rejected";
};

/**
 * Human-readable approval stage for a non-live campaign, or null if it's already
 * public (active/funded/completed). Society-created campaigns must clear a society
 * leader review before admin review; other creator types skip straight to admin.
 */
export function getCampaignApprovalStage(
  campaign: ApprovalCampaign,
): CampaignApprovalStage | null {
  if (campaign.status === "rejected") {
    return { label: "Rejected" };
  }
  if (
    campaign.creator.type === "society" &&
    campaign.societyApprovalStatus === "rejected"
  ) {
    return { label: "Rejected by society" };
  }
  if (campaign.status !== "pending" && campaign.status !== "changes_requested") {
    return null;
  }
  if (
    campaign.creator.type === "society" &&
    campaign.societyApprovalStatus !== "approved"
  ) {
    return { label: "Awaiting society leader approval" };
  }
  return { label: "Awaiting admin approval" };
}

export function isCampaignRejected(campaign: ApprovalCampaign): boolean {
  return getCampaignApprovalStage(campaign)?.label.startsWith("Rejected") ?? false;
}
