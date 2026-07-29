import { v } from "convex/values";
import { action, internalQuery, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { requireCanManageSociety, canManageSociety } from "./lib/authz";
import { buildCsv } from "./lib/csv";
import {
  CSV_HEADERS,
  ledgerRowToCsvCells,
  loadSocietyDonationLedger,
  type SocietyDonationLedgerRow,
} from "./lib/societyDonationLedger";

const paymentStatusValidator = v.union(
  v.literal("pending"),
  v.literal("succeeded"),
  v.literal("failed"),
  v.literal("refunded"),
  v.literal("partially_refunded"),
);

export const listForSocietyLeader = query({
  args: {
    communitySlug: v.string(),
    campaignSlug: v.optional(v.string()),
    statuses: v.optional(v.array(paymentStatusValidator)),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCanManageSociety(ctx, args.communitySlug);

    const rows = await loadSocietyDonationLedger(ctx, {
      communitySlug: args.communitySlug,
      campaignSlug: args.campaignSlug,
      statuses: args.statuses,
      limit: args.limit ?? 50,
    });

    const totalSucceededAmount = rows
      .filter((row) => row.paymentStatus === "succeeded" || row.paymentStatus === "partially_refunded")
      .reduce((sum, row) => sum + row.netToCampaignGbp, 0);

    return {
      rows,
      summary: {
        donationCount: rows.length,
        totalNetToCampaignGbp: totalSucceededAmount,
      },
    };
  },
});

export const assertCanManageSocietyAccess = internalQuery({
  args: {
    userId: v.id("users"),
    communitySlug: v.string(),
  },
  handler: async (ctx, args) => {
    return await canManageSociety(ctx, args.userId, args.communitySlug);
  },
});

export const exportDonationsCsv = action({
  args: {
    communitySlug: v.string(),
    campaignSlug: v.optional(v.string()),
    from: v.optional(v.number()),
    to: v.optional(v.number()),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ csv: string; filename: string; rowCount: number }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to perform this action.",
      });
    }

    const allowed = await ctx.runQuery(
      internal.societyDonations.assertCanManageSocietyAccess,
      { userId, communitySlug: args.communitySlug },
    );
    if (!allowed) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You do not have permission for this action.",
      });
    }

    const rows: SocietyDonationLedgerRow[] = await ctx.runQuery(
      internal.societyDonations.loadLedgerForExport,
      {
        communitySlug: args.communitySlug,
        campaignSlug: args.campaignSlug,
        from: args.from,
        to: args.to,
      },
    );

    const csv = buildCsv(
      [...CSV_HEADERS],
      rows.map((row) => ledgerRowToCsvCells(row)),
    );

    const slugPart = args.campaignSlug ?? "all-campaigns";
    const datePart = new Date().toISOString().slice(0, 10);
    return {
      csv,
      filename: `dono-donations-${args.communitySlug}-${slugPart}-${datePart}.csv`,
      rowCount: rows.length,
    };
  },
});

export const loadLedgerForExport = internalQuery({
  args: {
    communitySlug: v.string(),
    campaignSlug: v.optional(v.string()),
    from: v.optional(v.number()),
    to: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<SocietyDonationLedgerRow[]> => {
    return await loadSocietyDonationLedger(ctx, args);
  },
});
