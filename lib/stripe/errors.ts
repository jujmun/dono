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
  if (/RATE_LIMITED|Too many pending donations/i.test(message)) {
    return "Too many pending donations. Please finish or wait before trying again.";
  }
  if (/canceled|cancelled/i.test(message)) {
    return "Payment was canceled.";
  }
  return message;
}
