import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import {
  LEGAL_DOCUMENT_IDS,
  LEGAL_DOCUMENT_VERSIONS,
  LEGAL_REQUIRED_BY_CONTEXT,
  type LegalAcceptanceContext,
  type LegalDocumentId,
} from "./lib/legalDocuments";
import {
  hasAcceptedAllForContext,
  recordLegalAcceptancesForContext,
} from "./lib/legalAcceptance";

function listDocs() {
  return (LEGAL_DOCUMENT_IDS as readonly LegalDocumentId[]).map((id) => {
    const version = LEGAL_DOCUMENT_VERSIONS[id];
    return { id, version };
  });
}

const contextValidator = v.union(
  v.literal("signup"),
  v.literal("create_society"),
  v.literal("donate"),
  v.literal("donate_guest"),
);

const wordingValidator = v.object({
  id: v.string(),
  text: v.string(),
  accepted: v.boolean(),
});

export const getRequiredDocuments = query({
  args: { context: contextValidator },
  handler: async (_ctx, args) => {
    const context = args.context as LegalAcceptanceContext;
    return LEGAL_REQUIRED_BY_CONTEXT[context].map((id) => ({
      id,
      version: LEGAL_DOCUMENT_VERSIONS[id],
    }));
  },
});

export const hasAcceptedContext = query({
  args: {
    context: contextValidator,
    guestKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    return await hasAcceptedAllForContext(ctx, {
      userId: userId ?? undefined,
      guestKey: args.guestKey,
      context: args.context as LegalAcceptanceContext,
    });
  },
});

export const acceptDocuments = mutation({
  args: {
    context: contextValidator,
    guestKey: v.optional(v.string()),
    role: v.optional(v.string()),
    campaignId: v.optional(v.id("campaigns")),
    wordings: v.optional(v.array(wordingValidator)),
    recipientPanel: v.optional(v.any()),
    feeBreakdown: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId && !args.guestKey) {
      throw new Error("Sign in or provide a guest key to accept legal documents.");
    }
    const ids = await recordLegalAcceptancesForContext(ctx, {
      userId: userId ?? undefined,
      guestKey: args.guestKey,
      context: args.context as LegalAcceptanceContext,
      role: args.role,
      campaignId: args.campaignId,
      wordings: args.wordings,
      recipientPanel: args.recipientPanel,
      feeBreakdown: args.feeBreakdown,
      mechanism: "active_tick",
    });
    return { ok: true as const, acceptanceIds: ids };
  },
});

export const listDocumentVersions = query({
  args: {},
  handler: async () => listDocs(),
});

export const listMyAcceptances = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const rows = await ctx.db
      .query("legalAcceptances")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return rows
      .map((row) => ({
        id: row._id,
        documentId: row.documentId,
        version: row.version,
        contentHash: row.contentHash ?? null,
        event: row.event ?? null,
        context: row.context,
        acceptedAt: row.acceptedAt,
        role: row.role ?? null,
      }))
      .sort((a, b) => b.acceptedAt - a.acceptedAt);
  },
});
