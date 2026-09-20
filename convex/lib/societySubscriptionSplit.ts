export type CampaignSplitShare = {
  campaignId: string;
  amountMinor: number;
};

/**
 * Splits a society subscription invoice as evenly as possible across its
 * currently-active campaigns, in minor currency units (pence). Any
 * indivisible remainder (e.g. £10.00 / 3 campaigns) is handed out one penny
 * at a time to the first campaigns in `campaignIds`, so the shares always
 * sum back to exactly `totalMinor` — callers should pass a deterministically
 * ordered list (e.g. sorted by campaign id) so the same invoice always
 * splits the same way.
 */
export function splitAmountMinorAcrossCampaigns(
  totalMinor: number,
  campaignIds: string[],
): CampaignSplitShare[] {
  if (campaignIds.length === 0) return [];

  const baseShare = Math.floor(totalMinor / campaignIds.length);
  const remainder = totalMinor - baseShare * campaignIds.length;

  return campaignIds.map((campaignId, index) => ({
    campaignId,
    amountMinor: baseShare + (index < remainder ? 1 : 0),
  }));
}
