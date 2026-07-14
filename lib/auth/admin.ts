export type AuthProviderId = "resend" | "admin-email";

/** Sole non-Oxford address allowed for outreach admin portal login. */
export const OUTREACH_ADMIN_EMAIL = "dono.outreach@gmail.com";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getPublicAdminEmail() {
  return OUTREACH_ADMIN_EMAIL;
}

export function isAdminLoginEmail(email: string) {
  return normalizeEmail(email) === OUTREACH_ADMIN_EMAIL;
}

export function getAuthProviderId(email: string): AuthProviderId {
  return isAdminLoginEmail(email) ? "admin-email" : "resend";
}
