export function getFriendlyAuthError(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Something went wrong. Please retry.";

  if (/rate|too many/i.test(message)) {
    return "Too many attempts. Please wait a little and try again.";
  }
  if (/invalid email/i.test(message)) {
    return "Please use a valid email address.";
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
  return message;
}
