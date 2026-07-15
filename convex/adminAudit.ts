import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export const record = internalMutation({
  args: {
    adminUserId: v.id("users"),
    action: v.string(),
    targetType: v.string(),
    targetId: v.string(),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("adminAuditLog", {
      adminUserId: args.adminUserId,
      action: args.action,
      targetType: args.targetType,
      targetId: args.targetId,
      metadata: args.metadata,
      createdAt: Date.now(),
    });
  },
});

export async function logAdminAction(
  ctx: MutationCtx,
  args: {
    adminUserId: Id<"users">;
    action: string;
    targetType: string;
    targetId: string;
    metadata?: string;
  },
) {
  await ctx.db.insert("adminAuditLog", {
    adminUserId: args.adminUserId,
    action: args.action,
    targetType: args.targetType,
    targetId: args.targetId,
    metadata: args.metadata,
    createdAt: Date.now(),
  });
}
