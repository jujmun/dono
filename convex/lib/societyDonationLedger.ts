import type { Doc, Id } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import { resolveCreatorContact } from "./authz";

export type SocietyDonationLedgerRow = {
  donationId: Id<"donations">;
  createdAt: number;
  campaignTitle: string;
  campaignSlug: string;
  campaignContactName: string;
  campaignContactEmail: string;
  donationAmountGbp: number;
  grossChargedGbp: number | null;
  platformFeeGbp: number | null;
  refundedGbp: number;
  netToCampaignGbp: number;
  paymentStatus: Doc<"donations">["paymentStatus"];
  donationType: Doc<"donations">["type"];
  donorName: string;
  donorEmail: string;
  stripePaymentIntentId: string | null;
  stripeChargeId: string | null;
};

const DEFAULT_LEDGER_STATUSES = new Set<Doc<"donations">["paymentStatus"]>([
  "succeeded",
  "partially_refunded",
  "refunded",
]);

function minorToGbp(minor: number | undefined): number | null {
  if (minor === undefined) return null;
  return minor / 100;
}

function computeNetToCampaignGbp(donation: Doc<"donations">): number {
  const refundedMinor = donation.refundedAmountMinor ?? 0;
  const grossMinor = donation.grossAmountMinor;
  if (
    donation.paymentStatus === "partially_refunded" &&
    grossMinor &&
    grossMinor > 0 &&
    refundedMinor > 0
  ) {
    const refundRatio = refundedMinor / grossMinor;
    return donation.amount * (1 - refundRatio);
  }
  if (donation.paymentStatus === "refunded") {
    return 0;
  }
  return donation.amount;
}

async function resolveCampaignContact(
  ctx: QueryCtx,
  campaign: Doc<"campaigns">,
): Promise<{ name: string; email: string }> {
  const contactUserId =
    campaign.responsibleIndividualUserId ?? campaign.createdBy ?? null;
  if (contactUserId) {
    const contact = await resolveCreatorContact(ctx, contactUserId);
    if (contact) {
      return { name: contact.name, email: contact.email };
    }
  }
  return { name: "", email: "" };
}

async function resolveDonorDetails(
  ctx: QueryCtx,
  donation: Doc<"donations">,
): Promise<{ name: string; email: string }> {
  if (donation.isAnonymous) {
    return { name: "Anonymous", email: "" };
  }

  if (donation.userId) {
    const contact = await resolveCreatorContact(ctx, donation.userId);
    if (contact) {
      return { name: contact.name, email: contact.email };
    }
  }

  return {
    name: "",
    email: donation.donorEmail?.trim() ?? "",
  };
}

export async function loadSocietyDonationLedger(
  ctx: QueryCtx,
  args: {
    communitySlug: string;
    campaignSlug?: string;
    statuses?: Doc<"donations">["paymentStatus"][];
    from?: number;
    to?: number;
    limit?: number;
  },
): Promise<SocietyDonationLedgerRow[]> {
  const statusFilter = args.statuses
    ? new Set(args.statuses)
    : DEFAULT_LEDGER_STATUSES;

  const campaigns = await ctx.db
    .query("campaigns")
    .withIndex("by_community", (q) => q.eq("creator.communityId", args.communitySlug))
    .collect();

  const filteredCampaigns = args.campaignSlug
    ? campaigns.filter((campaign) => campaign.slug === args.campaignSlug)
    : campaigns;

  const campaignById = new Map(filteredCampaigns.map((campaign) => [campaign._id, campaign]));
  const contactCache = new Map<Id<"campaigns">, { name: string; email: string }>();

  const donations: Doc<"donations">[] = [];
  for (const campaign of filteredCampaigns) {
    const rows = await ctx.db
      .query("donations")
      .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
      .collect();
    donations.push(...rows);
  }

  const filtered = donations
    .filter((donation) => donation.campaignId && campaignById.has(donation.campaignId))
    .filter((donation) => statusFilter.has(donation.paymentStatus))
    .filter((donation) => (args.from === undefined ? true : donation.createdAt >= args.from))
    .filter((donation) => (args.to === undefined ? true : donation.createdAt <= args.to))
    .sort((a, b) => b.createdAt - a.createdAt);

  const limited =
    args.limit !== undefined ? filtered.slice(0, Math.max(1, args.limit)) : filtered;

  const rows: SocietyDonationLedgerRow[] = [];
  for (const donation of limited) {
    const campaign = campaignById.get(donation.campaignId!);
    if (!campaign) continue;

    let contact = contactCache.get(campaign._id);
    if (!contact) {
      contact = await resolveCampaignContact(ctx, campaign);
      contactCache.set(campaign._id, contact);
    }

    const donor = await resolveDonorDetails(ctx, donation);

    rows.push({
      donationId: donation._id,
      createdAt: donation.createdAt,
      campaignTitle: campaign.title,
      campaignSlug: campaign.slug,
      campaignContactName: contact.name,
      campaignContactEmail: contact.email,
      donationAmountGbp: donation.amount,
      grossChargedGbp: minorToGbp(donation.grossAmountMinor),
      platformFeeGbp: minorToGbp(donation.applicationFeeAmountMinor),
      refundedGbp: (donation.refundedAmountMinor ?? 0) / 100,
      netToCampaignGbp: computeNetToCampaignGbp(donation),
      paymentStatus: donation.paymentStatus,
      donationType: donation.type,
      donorName: donor.name,
      donorEmail: donor.email,
      stripePaymentIntentId: donation.stripePaymentIntentId ?? null,
      stripeChargeId: donation.stripeChargeId ?? null,
    });
  }

  return rows;
}

export const CSV_HEADERS = [
  "date_utc",
  "campaign_title",
  "campaign_slug",
  "campaign_contact_name",
  "campaign_contact_email",
  "donation_amount_gbp",
  "gross_charged_gbp",
  "platform_fee_gbp",
  "refunded_gbp",
  "net_to_campaign_gbp",
  "payment_status",
  "donation_type",
  "donor_name",
  "donor_email",
  "stripe_payment_intent_id",
  "stripe_charge_id",
  "dono_donation_id",
] as const;

export function ledgerRowToCsvCells(row: SocietyDonationLedgerRow) {
  return [
    new Date(row.createdAt).toISOString(),
    row.campaignTitle,
    row.campaignSlug,
    row.campaignContactName,
    row.campaignContactEmail,
    row.donationAmountGbp.toFixed(2),
    row.grossChargedGbp === null ? "" : row.grossChargedGbp.toFixed(2),
    row.platformFeeGbp === null ? "" : row.platformFeeGbp.toFixed(2),
    row.refundedGbp.toFixed(2),
    row.netToCampaignGbp.toFixed(2),
    row.paymentStatus,
    row.donationType,
    row.donorName,
    row.donorEmail,
    row.stripePaymentIntentId ?? "",
    row.stripeChargeId ?? "",
    row.donationId,
  ];
}
