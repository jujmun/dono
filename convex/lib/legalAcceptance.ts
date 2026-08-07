import { ConvexError } from "convex/values";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import {
  CONTEXT_TO_EVENT,
  LEGAL_DOCUMENT_VERSIONS,
  acceptanceContentHash,
  assertRegistryDocuments,
  requiredAcceptDocsForContext,
  type LegalAcceptanceContext,
  type LegalDocumentId,
} from "./legalDocuments";

type Ctx = QueryCtx | MutationCtx;

export type AcceptanceWording = {
  id: string;
  text: string;
  accepted: boolean;
};

export async function recordLegalAcceptance(
  ctx: MutationCtx,
  args: {
    userId?: Id<"users">;
    guestKey?: string;
    documentId: LegalDocumentId;
    context: LegalAcceptanceContext;
    role?: string;
    campaignId?: Id<"campaigns">;
    donationId?: Id<"donations">;
    mechanism?: string;
    wordings?: AcceptanceWording[];
    recipientPanel?: unknown;
    feeBreakdown?: unknown;
  },
) {
  assertRegistryDocuments([args.documentId]);
  const version = LEGAL_DOCUMENT_VERSIONS[args.documentId];
  const contentHash = acceptanceContentHash(args.documentId);
  return await ctx.db.insert("legalAcceptances", {
    userId: args.userId,
    guestKey: args.guestKey,
    documentId: args.documentId,
    version,
    contentHash,
    context: args.context,
    event: CONTEXT_TO_EVENT[args.context],
    role: args.role,
    campaignId: args.campaignId,
    donationId: args.donationId,
    mechanism: args.mechanism ?? "active_tick",
    wordings: args.wordings,
    recipientPanel: args.recipientPanel,
    feeBreakdown: args.feeBreakdown,
    acceptedAt: Date.now(),
  });
}

export async function recordLegalAcceptancesForContext(
  ctx: MutationCtx,
  args: {
    userId?: Id<"users">;
    guestKey?: string;
    context: LegalAcceptanceContext;
    role?: string;
    campaignId?: Id<"campaigns">;
    donationId?: Id<"donations">;
    mechanism?: string;
    wordings?: AcceptanceWording[];
    recipientPanel?: unknown;
    feeBreakdown?: unknown;
  },
) {
  const docs = requiredAcceptDocsForContext(args.context);
  assertRegistryDocuments(docs);
  const ids: Id<"legalAcceptances">[] = [];
  for (const documentId of docs) {
    const id = await recordLegalAcceptance(ctx, {
      userId: args.userId,
      guestKey: args.guestKey,
      documentId,
      context: args.context,
      role: args.role,
      campaignId: args.campaignId,
      donationId: args.donationId,
      mechanism: args.mechanism,
      wordings: args.wordings,
      recipientPanel: args.recipientPanel,
      feeBreakdown: args.feeBreakdown,
    });
    ids.push(id);
  }
  return ids;
}

async function hasAcceptedVersion(
  ctx: Ctx,
  args: {
    userId?: Id<"users">;
    guestKey?: string;
    documentId: LegalDocumentId;
  },
) {
  const requiredVersion = LEGAL_DOCUMENT_VERSIONS[args.documentId];
  const requiredHash = acceptanceContentHash(args.documentId);
  if (args.userId) {
    const rows = await ctx.db
      .query("legalAcceptances")
      .withIndex("by_user_document", (q) =>
        q.eq("userId", args.userId!).eq("documentId", args.documentId),
      )
      .collect();
    return rows.some(
      (row) =>
        row.version === requiredVersion &&
        (row.contentHash == null || row.contentHash === requiredHash),
    );
  }
  if (args.guestKey) {
    const rows = await ctx.db
      .query("legalAcceptances")
      .withIndex("by_guest_document", (q) =>
        q.eq("guestKey", args.guestKey!).eq("documentId", args.documentId),
      )
      .collect();
    return rows.some(
      (row) =>
        row.version === requiredVersion &&
        (row.contentHash == null || row.contentHash === requiredHash),
    );
  }
  return false;
}

export async function assertLegalAcceptedForContext(
  ctx: Ctx,
  args: {
    userId?: Id<"users">;
    guestKey?: string;
    context: LegalAcceptanceContext;
  },
) {
  const docs = requiredAcceptDocsForContext(args.context);
  try {
    assertRegistryDocuments(docs);
  } catch {
    throw new ConvexError({
      code: "LEGAL_REGISTRY_UNAVAILABLE",
      message:
        "Required legal documents are not available. This action cannot proceed.",
    });
  }
  for (const documentId of docs) {
    const ok = await hasAcceptedVersion(ctx, {
      userId: args.userId,
      guestKey: args.guestKey,
      documentId,
    });
    if (!ok) {
      throw new ConvexError({
        code: "LEGAL_ACCEPTANCE_REQUIRED",
        message: `Please accept the latest ${documentId.replace(/_/g, " ")} before continuing.`,
      });
    }
  }
}

export async function hasAcceptedAllForContext(
  ctx: Ctx,
  args: {
    userId?: Id<"users">;
    guestKey?: string;
    context: LegalAcceptanceContext;
  },
) {
  const docs = requiredAcceptDocsForContext(args.context);
  try {
    assertRegistryDocuments(docs);
  } catch {
    return false;
  }
  for (const documentId of docs) {
    const ok = await hasAcceptedVersion(ctx, {
      userId: args.userId,
      guestKey: args.guestKey,
      documentId,
    });
    if (!ok) return false;
  }
  return true;
}

export function documentVersionBindings(docIds: LegalDocumentId[]) {
  assertRegistryDocuments(docIds);
  return docIds.map((documentId) => ({
    documentId,
    version: LEGAL_DOCUMENT_VERSIONS[documentId],
    contentHash: acceptanceContentHash(documentId),
  }));
}
