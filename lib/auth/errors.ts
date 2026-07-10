export function getFriendlyAuthError(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Something went wrong. Please retry.";

  if (/rate|too many/i.test(message)) {
    return "Too many attempts. Please wait a little and try again.";
  }
  if (/invalid email/i.test(message)) {
    return "Please use a valid email address.";
  }
  if (/code|otp|verification token|invalid token/i.test(message)) {
    return "That code is invalid or expired. Request a new one and try again.";
  }
  if (/domain.*allowed/i.test(message)) {
    return "This email domain is not allowed for sign-in.";
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
