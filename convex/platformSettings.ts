import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { requireAdmin } from "./lib/authz";
import { logAdminAction } from "./adminAudit";

export type PlatformFlags = {
  disableNewCampaigns: boolean;
  disableDonations: boolean;
  disableRegistration: boolean;
  disableComments: boolean;
  updatedAt: number | null;
  updatedBy: string | null;
};

const DEFAULT_FLAGS: PlatformFlags = {
  disableNewCampaigns: false,
  disableDonations: false,
  disableRegistration: false,
  disableComments: false,
  updatedAt: null,
  updatedBy: null,
};

type PlatformFlagKey =
  | "disableNewCampaigns"
  | "disableDonations"
  | "disableRegistration"
  | "disableComments";

async function readFlags(ctx: QueryCtx | MutationCtx): Promise<PlatformFlags> {
  const row = await ctx.db
    .query("platformSettings")
    .withIndex("by_key", (q) => q.eq("key", "global"))
    .unique();
  if (!row) return DEFAULT_FLAGS;
  return {
    disableNewCampaigns: row.disableNewCampaigns,
    disableDonations: row.disableDonations,
    disableRegistration: row.disableRegistration,
    disableComments: row.disableComments,
    updatedAt: row.updatedAt,
    updatedBy: row.updatedBy ?? null,
  };
}

export async function getPlatformFlags(
  ctx: QueryCtx | MutationCtx,
): Promise<PlatformFlags> {
  return await readFlags(ctx);
}

export async function assertPlatformFlagOff(
  ctx: QueryCtx | MutationCtx,
  flag: PlatformFlagKey,
  message: string,
) {
  const flags = await readFlags(ctx);
  if (flags[flag]) {
    throw new ConvexError({
      code: "PLATFORM_DISABLED",
      message,
    });
  }
}

/** Public — UI and gates may read current kill-switch state. */
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await readFlags(ctx);
  },
});

export const setFlags = mutation({
  args: {
    disableNewCampaigns: v.optional(v.boolean()),
    disableDonations: v.optional(v.boolean()),
    disableRegistration: v.optional(v.boolean()),
    disableComments: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const existing = await ctx.db
      .query("platformSettings")
      .withIndex("by_key", (q) => q.eq("key", "global"))
      .unique();

    const next = {
      disableNewCampaigns:
        args.disableNewCampaigns ?? existing?.disableNewCampaigns ?? false,
      disableDonations:
        args.disableDonations ?? existing?.disableDonations ?? false,
      disableRegistration:
        args.disableRegistration ?? existing?.disableRegistration ?? false,
      disableComments:
        args.disableComments ?? existing?.disableComments ?? false,
      updatedAt: Date.now(),
      updatedBy: adminUserId,
    };

    if (existing) {
      await ctx.db.patch(existing._id, next);
    } else {
      await ctx.db.insert("platformSettings", {
        key: "global",
        ...next,
      });
    }

    await logAdminAction(ctx, {
      adminUserId,
      action: "platform_flags_set",
      targetType: "platformSettings",
      targetId: "global",
      metadata: JSON.stringify({
        disableNewCampaigns: next.disableNewCampaigns,
        disableDonations: next.disableDonations,
        disableRegistration: next.disableRegistration,
        disableComments: next.disableComments,
      }),
    });

    return {
      disableNewCampaigns: next.disableNewCampaigns,
      disableDonations: next.disableDonations,
      disableRegistration: next.disableRegistration,
      disableComments: next.disableComments,
      updatedAt: next.updatedAt,
      updatedBy: next.updatedBy,
    };
  },
});
