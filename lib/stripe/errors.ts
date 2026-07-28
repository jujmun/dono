export function getFriendlyConnectError(error: unknown) {
  const convexPayload = getConvexErrorPayload(error);
  if (convexPayload?.message) {
    return convexPayload.message;
  }

  const message =
    error instanceof Error ? error.message : "Something went wrong. Please retry.";

  if (/STRIPE_NOT_CONFIGURED/i.test(message)) {
    return "Payments are not configured for this environment.";
  }
  if (/STRIPE_CONNECT_V2_DISABLED|accounts v2 is not enabled/i.test(message)) {
    return "Stripe Accounts v2 is not enabled on the Dono platform account. Contact support.";
  }
  if (/STRIPE_CONNECT_INVALID_URL|return_url|refresh_url/i.test(message)) {
    return "Stripe could not use the return URL. Open Dono at https://joindono.com and try again.";
  }
  if (/FORBIDDEN|permission/i.test(message)) {
    return "You do not have permission to manage payout setup for this society.";
  }
  if (/UNAUTHENTICATED|sign in/i.test(message)) {
    return "Please sign in to continue.";
  }
  return message;
}

type ConvexErrorPayload = {
  code?: string;
  message?: string;
};

function getConvexErrorPayload(error: unknown): ConvexErrorPayload | null {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data: unknown }).data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      return data as ConvexErrorPayload;
    }
    if (typeof data === "string") {
      try {
        return JSON.parse(data) as ConvexErrorPayload;
      } catch {
        return null;
      }
    }
  }

  if (error instanceof Error) {
    const jsonMatch = error.message.match(/\{.*\}/s);
    if (!jsonMatch) return null;
    try {
      return JSON.parse(jsonMatch[0]) as ConvexErrorPayload;
    } catch {
      return null;
    }
  }

  return null;
}

export function getFriendlyPaymentError(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Something went wrong. Please retry.";

  if (/ADMIN_CANNOT_DONATE|admin accounts cannot donate/i.test(message)) {
    return "Admin accounts cannot donate to campaigns.";
  }
  if (/EMAIL_NOT_VERIFIED|verify your email/i.test(message)) {
    return "Please verify your email before donating.";
  }
  if (/UNAUTHENTICATED|sign in/i.test(message)) {
    return "Please sign in to continue. Monthly donations require an account.";
  }
  if (/CAMPAIGN_NOT_FOUND/i.test(message)) {
    return "This campaign could not be found.";
  }
  if (/CAMPAIGN_NOT_ACTIVE|not accepting donations/i.test(message)) {
    return "This campaign is not accepting donations right now.";
  }
  if (/INVALID_INPUT|amount must be between/i.test(message)) {
    return "Please choose a donation amount between £1 and £100,000.";
  }
  if (/STRIPE_NOT_CONFIGURED/i.test(message)) {
    return "Payments are not configured for this environment.";
  }
  if (/CONNECT_NOT_READY|CHARGES_DISABLED|payment setup/i.test(message)) {
    return "This society is not ready to accept donations yet. Please try again later.";
  }
  if (/RATE_LIMITED|Too many pending donations/i.test(message)) {
    return "Too many pending donations. Please finish or wait before trying again.";
  }
  if (/canceled|cancelled/i.test(message)) {
    return "Payment was canceled.";
  }
  return message;
}
