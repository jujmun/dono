import { describe, expect, it } from "vitest";
import { splitAmountMinorAcrossCampaigns } from "./societySubscriptionSplit";

describe("splitAmountMinorAcrossCampaigns", () => {
  it("returns nothing when there are no active campaigns", () => {
    expect(splitAmountMinorAcrossCampaigns(1000, [])).toEqual([]);
  });

  it("gives a single campaign the entire amount", () => {
    expect(splitAmountMinorAcrossCampaigns(1000, ["a"])).toEqual([
      { campaignId: "a", amountMinor: 1000 },
    ]);
  });

  it("splits evenly when the amount divides cleanly", () => {
    expect(splitAmountMinorAcrossCampaigns(900, ["a", "b", "c"])).toEqual([
      { campaignId: "a", amountMinor: 300 },
      { campaignId: "b", amountMinor: 300 },
      { campaignId: "c", amountMinor: 300 },
    ]);
  });

  it("distributes the odd pence to the first campaigns, one each", () => {
    const shares = splitAmountMinorAcrossCampaigns(1000, ["a", "b", "c"]);
    expect(shares).toEqual([
      { campaignId: "a", amountMinor: 334 },
      { campaignId: "b", amountMinor: 333 },
      { campaignId: "c", amountMinor: 333 },
    ]);
  });

  it("always sums back to the original total", () => {
    const totals = [1, 7, 99, 1000, 100_000];
    const campaignCounts = [1, 2, 3, 5, 11];
    for (const totalMinor of totals) {
      for (const count of campaignCounts) {
        const campaignIds = Array.from({ length: count }, (_, i) => `c${i}`);
        const shares = splitAmountMinorAcrossCampaigns(totalMinor, campaignIds);
        const sum = shares.reduce((acc, s) => acc + s.amountMinor, 0);
        expect(sum).toBe(totalMinor);
      }
    }
  });

  it("gives zero to campaigns beyond the number of pence available", () => {
    const shares = splitAmountMinorAcrossCampaigns(2, ["a", "b", "c"]);
    expect(shares).toEqual([
      { campaignId: "a", amountMinor: 1 },
      { campaignId: "b", amountMinor: 1 },
      { campaignId: "c", amountMinor: 0 },
    ]);
  });
});
