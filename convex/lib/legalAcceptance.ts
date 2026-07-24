import { ConvexError } from "convex/values";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import {
  LEGAL_DOCUMENT_VERSIONS,
  LEGAL_REQUIRED_BY_CONTEXT,
  type LegalAcceptanceContext,
  type LegalDocumentId,
} from "./legalDocuments";

type Ctx = QueryCtx | MutationCtx;

export async function recordLegalAcceptance(
  ctx: MutationCtx,
  args: {
    userId?: Id<"users">;
    guestKey?: string;
    documentId: LegalDocumentId;
    context: LegalAcceptanceContext;
  },
) {
  const version = LEGAL_DOCUMENT_VERSIONS[args.documentId];
  await ctx.db.insert("legalAcceptances", {
    userId: args.userId,
    guestKey: args.guestKey,
    documentId: args.documentId,
    version,
    context: args.context,
    acceptedAt: Date.now(),
  });
}

export async function recordLegalAcceptancesForContext(
  ctx: MutationCtx,
  args: {
    userId?: Id<"users">;
    guestKey?: string;
    context: LegalAcceptanceContext;
  },
) {
  const docs = LEGAL_REQUIRED_BY_CONTEXT[args.context];
  for (const documentId of docs) {
    await recordLegalAcceptance(ctx, {
      userId: args.userId,
      guestKey: args.guestKey,
      documentId,
      context: args.context,
    });
  }
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
  if (args.userId) {
    const rows = await ctx.db
      .query("legalAcceptances")
      .withIndex("by_user_document", (q) =>
        q.eq("userId", args.userId!).eq("documentId", args.documentId),
      )
      .collect();
    return rows.some((row) => row.version === requiredVersion);
  }
  if (args.guestKey) {
    const rows = await ctx.db
      .query("legalAcceptances")
      .withIndex("by_guest_document", (q) =>
        q.eq("guestKey", args.guestKey!).eq("documentId", args.documentId),
      )
      .collect();
    return rows.some((row) => row.version === requiredVersion);
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
  const docs = LEGAL_REQUIRED_BY_CONTEXT[args.context];
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
  const docs = LEGAL_REQUIRED_BY_CONTEXT[args.context];
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
