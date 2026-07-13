export type AuthProviderId = "resend" | "admin-email";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getPublicAdminEmail() {
  return process.env.EXPO_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}

export function isAdminLoginEmail(email: string) {
  const adminEmail = getPublicAdminEmail();
  if (!adminEmail) return false;
  return normalizeEmail(email) === adminEmail;
}

export function getAuthProviderId(email: string): AuthProviderId {
  return isAdminLoginEmail(email) ? "admin-email" : "resend";
}
