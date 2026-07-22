import type Stripe from "stripe";

export type MerchantCapabilityStatus =
  | "active"
  | "pending"
  | "inactive"
  | "restricted"
  | "unrequested"
  | "unknown";

export type ParsedConnectAccountStatus = {
  accountVersion: "v2";
  cardPaymentsStatus: MerchantCapabilityStatus;
  cardPaymentsActive: boolean;
  onboardingComplete: boolean;
  payoutsEnabled: boolean;
};

export function getV2CardPaymentsStatus(
  account: Stripe.V2.Core.Account,
): MerchantCapabilityStatus {
  const status =
    account.configuration?.merchant?.capabilities?.card_payments?.status;
  if (status === "active" || status === "pending" || status === "restricted") {
    return status;
  }
  if (status === "unsupported") {
    return "inactive";
  }
  return status ? "unknown" : "unrequested";
}

export function parseV2ConnectAccountStatus(
  account: Stripe.V2.Core.Account,
): ParsedConnectAccountStatus {
  const cardPaymentsStatus = getV2CardPaymentsStatus(account);
  const cardPaymentsActive = cardPaymentsStatus === "active";
  const awaitingUserAction = Boolean(
    account.requirements?.entries?.some(
      (entry) => entry.awaiting_action_from === "user",
    ),
  );

  return {
    accountVersion: "v2",
    cardPaymentsStatus,
    cardPaymentsActive,
    onboardingComplete: cardPaymentsActive || !awaitingUserAction,
    payoutsEnabled: cardPaymentsActive,
  };
}

export function buildV2MerchantAccountCreateParams(args: {
  displayName: string;
  userId: string;
  communitySlug?: string;
}): Stripe.V2.Core.AccountCreateParams {
  return {
    display_name: args.displayName,
    dashboard: "full",
    defaults: {
      currency: "gbp",
      responsibilities: {
        fees_collector: "stripe",
        losses_collector: "stripe",
      },
    },
    configuration: {
      merchant: {
        capabilities: {
          card_payments: { requested: true },
        },
      },
    },
    identity: {
      country: "GB",
    },
    metadata: {
      userId: args.userId,
      ...(args.communitySlug ? { communitySlug: args.communitySlug } : {}),
    },
    include: ["configuration.merchant", "requirements"],
  };
}

export function buildV2MerchantOnboardingLinkParams(args: {
  stripeAccountId: string;
  returnUrl: string;
  refreshUrl: string;
}): Stripe.V2.Core.AccountLinkCreateParams {
  return {
    account: args.stripeAccountId,
    use_case: {
      type: "account_onboarding",
      account_onboarding: {
        configurations: ["merchant"],
        return_url: args.returnUrl,
        refresh_url: args.refreshUrl,
      },
    },
  };
}

export function toPublicConnectStatus(
  account:
    | {
        exists: true;
        onboardingComplete: boolean;
        cardPaymentsActive: boolean;
        cardPaymentsStatus: MerchantCapabilityStatus;
        payoutsEnabled: boolean;
        accountVersion: "v1" | "v2";
        requiresMerchantReonboarding: boolean;
      }
    | {
        exists: false;
        onboardingComplete: false;
        cardPaymentsActive: false;
        cardPaymentsStatus: "unrequested";
        payoutsEnabled: false;
        accountVersion: null;
        requiresMerchantReonboarding: false;
      },
) {
  return {
    exists: account.exists,
    onboardingComplete: account.onboardingComplete,
    chargesEnabled: account.cardPaymentsActive,
    cardPaymentsActive: account.cardPaymentsActive,
    cardPaymentsStatus: account.cardPaymentsStatus,
    payoutsEnabled: account.payoutsEnabled,
    accountVersion: account.accountVersion,
    requiresMerchantReonboarding: account.requiresMerchantReonboarding,
  };
}
