"use node";

import { ConvexError, v } from "convex/values";
import Stripe from "stripe";
import { action, type ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import {
  buildV2MerchantAccountCreateParams,
  buildV2MerchantOnboardingLinkParams,
  parseV2ConnectAccountStatus,
} from "./lib/stripeConnectMerchant";

type ConnectAccountRecord = {
  _id: Id<"stripeConnectAccounts">;
  stripeAccountId: string;
  accountVersion?: "v1" | "v2";
};

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new ConvexError({
      code: "STRIPE_NOT_CONFIGURED",
      message: "Stripe is not configured on this deployment.",
    });
  }
  return new Stripe(secretKey);
}

async function assertSocietyConnectAccess(
  ctx: ActionCtx,
  userId: Id<"users">,
  communitySlug?: string,
) {
  if (!communitySlug) return;
  const access = await ctx.runQuery(
    internal.stripeConnectInternal.assertCanManageSocietyConnect,
    { userId, communitySlug },
  );
  if (!access.allowed) {
    throw new ConvexError({
      code: "FORBIDDEN",
      message: "You do not have permission for this action.",
    });
  }
}

async function getSocietyDisplayName(ctx: ActionCtx, communitySlug: string) {
  const society = await ctx.runQuery(internal.societies.getBySlug, {
    slug: communitySlug,
  });
  return society?.name ?? communitySlug;
}

async function refreshV2AccountStatus(
  ctx: ActionCtx,
  stripe: Stripe,
  stripeAccountId: string,
) {
  const account = await stripe.v2.core.accounts.retrieve(stripeAccountId, {
    include: ["configuration.merchant", "requirements"],
  });
  const parsed = parseV2ConnectAccountStatus(account);
  await ctx.runMutation(internal.stripeConnectInternal.updateAccountStatus, {
    stripeAccountId,
    onboardingComplete: parsed.onboardingComplete,
    cardPaymentsActive: parsed.cardPaymentsActive,
    cardPaymentsStatus: parsed.cardPaymentsStatus,
    chargesEnabled: parsed.cardPaymentsActive,
    payoutsEnabled: parsed.payoutsEnabled,
  });
  return parsed;
}

export const createConnectOnboardingLink = action({
  args: {
    communitySlug: v.optional(v.string()),
    returnUrl: v.string(),
    refreshUrl: v.string(),
  },
  handler: async (ctx, args): Promise<{ url: string; stripeAccountId: string }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to perform this action.",
      });
    }

    await assertSocietyConnectAccess(ctx, userId, args.communitySlug);

    const stripe = getStripeClient();
    // Society Connect accounts are community-scoped so any authorized leader
    // can resume the same merchant account.
    let existing = (args.communitySlug
      ? await ctx.runQuery(internal.stripeConnectInternal.getByCommunitySlug, {
          communitySlug: args.communitySlug,
        })
      : await ctx.runQuery(internal.stripeConnectInternal.getByUserId, {
          userId,
          communitySlug: args.communitySlug,
        })) as ConnectAccountRecord | null;

    if (existing && existing.accountVersion !== "v2") {
      await ctx.runMutation(internal.stripeConnectInternal.deleteAccount, {
        connectAccountId: existing._id,
      });
      existing = null;
    }

    let stripeAccountId: string;
    if (existing) {
      stripeAccountId = existing.stripeAccountId;
    } else {
      const displayName = args.communitySlug
        ? await getSocietyDisplayName(ctx, args.communitySlug)
        : "Dono society";
      const account = await stripe.v2.core.accounts.create(
        buildV2MerchantAccountCreateParams({
          displayName,
          userId,
          communitySlug: args.communitySlug,
        }),
      );
      stripeAccountId = account.id;
      await ctx.runMutation(internal.stripeConnectInternal.saveAccount, {
        userId,
        communitySlug: args.communitySlug,
        stripeAccountId,
        accountVersion: "v2",
        onboardingComplete: false,
        cardPaymentsActive: false,
        cardPaymentsStatus: "unrequested",
        chargesEnabled: false,
        payoutsEnabled: false,
      });
    }

    const link = await stripe.v2.core.accountLinks.create(
      buildV2MerchantOnboardingLinkParams({
        stripeAccountId,
        returnUrl: args.returnUrl,
        refreshUrl: args.refreshUrl,
      }),
    );

    return { url: link.url, stripeAccountId };
  },
});

export const refreshConnectAccountStatus = action({
  args: { communitySlug: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to perform this action.",
      });
    }

    await assertSocietyConnectAccess(ctx, userId, args.communitySlug);

    const record = args.communitySlug
      ? await ctx.runQuery(internal.stripeConnectInternal.getByCommunitySlug, {
          communitySlug: args.communitySlug,
        })
      : await ctx.runQuery(internal.stripeConnectInternal.getByUserId, {
          userId,
          communitySlug: args.communitySlug,
        });
    if (!record) {
      return {
        exists: false as const,
        onboardingComplete: false,
        chargesEnabled: false,
        cardPaymentsActive: false,
        cardPaymentsStatus: "unrequested" as const,
        payoutsEnabled: false,
        accountVersion: null,
        requiresMerchantReonboarding: false,
      };
    }

    if (record.accountVersion !== "v2") {
      return {
        exists: true as const,
        onboardingComplete: false,
        chargesEnabled: false,
        cardPaymentsActive: false,
        cardPaymentsStatus: "unrequested" as const,
        payoutsEnabled: false,
        accountVersion: "v1" as const,
        requiresMerchantReonboarding: true,
      };
    }

    const stripe = getStripeClient();
    const parsed = await refreshV2AccountStatus(ctx, stripe, record.stripeAccountId);

    return {
      exists: true as const,
      onboardingComplete: parsed.onboardingComplete,
      chargesEnabled: parsed.cardPaymentsActive,
      cardPaymentsActive: parsed.cardPaymentsActive,
      cardPaymentsStatus: parsed.cardPaymentsStatus,
      payoutsEnabled: parsed.payoutsEnabled,
      accountVersion: "v2" as const,
      requiresMerchantReonboarding: false,
    };
  },
});

export const createConnectDashboardLink = action({
  args: { communitySlug: v.string() },
  handler: async (
    ctx,
    args,
  ): Promise<{ url: string; loginEmail: string | null }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "You must be signed in to perform this action.",
      });
    }

    await assertSocietyConnectAccess(ctx, userId, args.communitySlug);

    const record = await ctx.runQuery(
      internal.stripeConnectInternal.getByCommunitySlug,
      { communitySlug: args.communitySlug },
    );
    if (!record) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Connect account not found.",
      });
    }
    if (record.accountVersion !== "v2" || !record.cardPaymentsActive) {
      throw new ConvexError({
        code: "CONNECT_NOT_READY",
        message: "This society must complete the new Stripe payment setup.",
      });
    }

    // Full-Dashboard Accounts v2 cannot use Express createLoginLink.
    // Society leaders sign into the standard Stripe Dashboard with the email
    // used during Connect onboarding.
    const FULL_DASHBOARD_LOGIN_URL = "https://dashboard.stripe.com/login";

    let loginEmail: string | null = null;
    try {
      const stripe = getStripeClient();
      const account = await stripe.v2.core.accounts.retrieve(
        record.stripeAccountId,
        { include: ["configuration.merchant", "identity"] },
      );
      const identity = account.identity as
        | { email?: string | null }
        | undefined;
      const email = identity?.email?.trim();
      if (email) loginEmail = email;
    } catch {
      // Best-effort only — still return the login URL.
    }

    return { url: FULL_DASHBOARD_LOGIN_URL, loginEmail };
  },
});
