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

const contextValidator = v.union(
  v.literal("signup"),
  v.literal("create_campaign"),
  v.literal("create_society"),
  v.literal("donate"),
);

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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId && !args.guestKey) {
      throw new Error("Sign in or provide a guest key to accept legal documents.");
    }
    await recordLegalAcceptancesForContext(ctx, {
      userId: userId ?? undefined,
      guestKey: args.guestKey,
      context: args.context as LegalAcceptanceContext,
    });
    return { ok: true as const };
  },
});

export const listDocumentVersions = query({
  args: {},
  handler: async () => {
    return (LEGAL_DOCUMENT_IDS as readonly LegalDocumentId[]).map((id) => ({
      id,
      version: LEGAL_DOCUMENT_VERSIONS[id],
    }));
  },
});
