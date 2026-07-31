type ConvexErrorPayload = {
  code?: string;
  message?: string;
  details?: string[];
};

export function getFriendlyAuthError(error: unknown) {
  const rawMessage =
    error instanceof Error ? error.message : "Something went wrong. Please retry.";

  const convexPayload = getConvexErrorPayload(error);
  if (convexPayload) {
    if (convexPayload.code === "PASSWORD_ALREADY_SET") {
      return "You already have a password. Use change password below.";
    }
    if (convexPayload.code === "CURRENT_PASSWORD_INCORRECT") {
      return "Current password is incorrect.";
    }
    if (convexPayload.code === "PASSWORD_NOT_SET") {
      return "Set a password first before changing it.";
    }
    if (convexPayload.code === "INVALID_PASSWORD") {
      const details = convexPayload.details;
      if (Array.isArray(details) && details.length > 0) {
        return details.join(" ");
      }
      return convexPayload.message ?? "Password does not meet security requirements.";
    }
    if (convexPayload.code === "RATE_LIMITED") {
      return (
        convexPayload.message ??
        "Too many attempts. Please wait a little and try again."
      );
    }
  }

  const message = rawMessage;

  if (/STRIPE_IDENTITY_DISABLED/i.test(message)) {
    return "Identity verification is temporarily unavailable.";
  }
  if (/InvalidAccountId/i.test(message)) {
    return "No password is set for this email yet. We'll send a sign-in code so you can create one.";
  }
  if (/TooManyFailedAttempts/i.test(message)) {
    return "Too many attempts. Please wait a little and try again.";
  }
  if (/InvalidSecret/i.test(message)) {
    return "Email or password is incorrect.";
  }
  if (/invalid credentials/i.test(message)) {
    return "Email or password is incorrect.";
  }
  if (/rate|too many/i.test(message)) {
    return "Too many attempts. Please wait a little and try again.";
  }
  if (/invalid email/i.test(message)) {
    return "Please use a valid email address.";
  }
  if (/domain.*allowed|EMAIL_DOMAIN_NOT_ALLOWED/i.test(message)) {
    return "This email domain is not allowed for sign-in.";
  }
  if (/ADMIN_EMAIL_MISMATCH|only available for the admin account/i.test(message)) {
    return "This sign-in method is only available for the admin account.";
  }
  if (
    /ADMIN_EMAIL_NOT_CONFIGURED|ADMIN_CODE_RECIPIENT_NOT_CONFIGURED/i.test(
      message,
    )
  ) {
    return "Admin sign-in is not configured yet. Please try again later.";
  }
  // OTP *send* failures must be checked before invalid/expired code patterns.
  if (
    /OTP_SEND_FAILED|EMAIL_SEND_FAILED|RESEND_API_KEY_MISSING|unable to send (otp )?email|password reset email/i.test(
      message,
    )
  ) {
    return "We couldn't send a sign-in code right now. Please try again shortly.";
  }
  if (
    /invalid (or expired )?code|expired.*(code|otp)|verification token|invalid token|wrong code|^Invalid code$/i.test(
      message,
    )
  ) {
    return "That code is invalid or expired. Request a new one and try again.";
  }
  if (/PASSWORD_ALREADY_SET/i.test(message)) {
    return "You already have a password. Use change password below.";
  }
  if (/CURRENT_PASSWORD_INCORRECT/i.test(message)) {
    return "Current password is incorrect.";
  }
  if (/already exists|account already/i.test(message)) {
    return "An account with this email already exists. Sign in or use Forgot password.";
  }
  if (/not authenticated|unauthenticated/i.test(message)) {
    return "Please sign in to continue.";
  }
  if (/forbidden|permission/i.test(message)) {
    return "You do not have permission to do that.";
  }
  // Not one of the known auth patterns above — this mapper is reused for
  // non-auth mutations too (e.g. campaign creation), so prefer the server's
  // own message over the generic fallback below when we have one.
  if (convexPayload?.message) {
    return convexPayload.message;
  }
  // Client-thrown Error("…") and many Convex ArgumentValidationError strings
  // are already human-readable — don't swallow them into the generic banner.
  if (
    error instanceof Error &&
    message.trim().length > 0 &&
    !/^\[CONVEX[^\]]*\]\s*Server Error$/i.test(message.trim()) &&
    !/^Server Error$/i.test(message.trim())
  ) {
    return message;
  }
  return "Something went wrong. Please try again.";
}

/**
 * Convex client errors carry structured `data` even when production redacts
 * `message` to a generic "Server Error". Prefer `.data`, then parse JSON out
 * of the message string for locally constructed ConvexErrors.
 */
function getConvexErrorPayload(error: unknown): ConvexErrorPayload | null {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data: unknown }).data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      return data as ConvexErrorPayload;
    }
    if (typeof data === "string") {
      return parseConvexErrorPayload(data);
    }
  }

  if (error instanceof Error) {
    return parseConvexErrorPayload(error.message);
  }

  return null;
}

function parseConvexErrorPayload(message: string): ConvexErrorPayload | null {
  const jsonMatch = message.match(/\{.*\}/s);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[0]) as ConvexErrorPayload;
  } catch {
    return null;
  }
}
