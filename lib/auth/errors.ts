export function getFriendlyAuthError(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Something went wrong. Please retry.";

  if (/rate|too many/i.test(message)) {
    return "Too many attempts. Please wait a little and try again.";
  }
  if (/invalid email/i.test(message)) {
    return "Please use a valid email address.";
  }
  if (/domain.*allowed|EMAIL_DOMAIN_NOT_ALLOWED|ox\.ac\.uk/i.test(message)) {
    return "This email domain is not allowed for sign-in.";
  }
  // OTP *send* failures must be checked before invalid/expired code patterns.
  if (
    /OTP_SEND_FAILED|EMAIL_SEND_FAILED|RESEND_API_KEY_MISSING|unable to send (otp )?email/i.test(
      message,
    )
  ) {
    return "We couldn't send a sign-in code right now. Please try again shortly.";
  }
  if (
    /invalid (or expired )?code|expired.*(code|otp)|verification token|invalid token|wrong code/i.test(
      message,
    )
  ) {
    return "That code is invalid or expired. Request a new one and try again.";
  }
  if (/password/i.test(message) && /invalid|incorrect|failed/i.test(message)) {
    return "Your password details are incorrect. Please try again.";
  }
  if (/not authenticated|unauthenticated/i.test(message)) {
    return "Please sign in to continue.";
  }
  if (/forbidden|permission/i.test(message)) {
    return "You do not have permission to do that.";
  }
  return "Something went wrong. Please try again.";
}
