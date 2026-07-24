export type AuthProviderId = "resend" | "admin-email";

/** Non-Oxford addresses allowed to sign up / sign in (Oxford domain bypass). */
export const OUTREACH_ADMIN_EMAILS = [
  "dono.outreach@gmail.com",
  "juyeon27312@gmail.com",
] as const;

/** Primary outreach admin email (public contact / docs + admin-email OTP). */
export const OUTREACH_ADMIN_EMAIL = OUTREACH_ADMIN_EMAILS[0];

const OUTREACH_ADMIN_EMAIL_SET = new Set<string>(OUTREACH_ADMIN_EMAILS);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getPublicAdminEmail() {
  return OUTREACH_ADMIN_EMAIL;
}

/** True for allowlisted non-Oxford emails (domain bypass + portal admin). */
export function isAdminLoginEmail(email: string) {
  return OUTREACH_ADMIN_EMAIL_SET.has(normalizeEmail(email));
}

/**
 * Emails that must use the `admin-email` OTP provider instead of password /
 * resend signup. Additional allowlisted admins use normal password auth.
 */
export function isAdminOtpLoginEmail(email: string) {
  return normalizeEmail(email) === OUTREACH_ADMIN_EMAIL;
}

export function getAuthProviderId(email: string): AuthProviderId {
  return isAdminOtpLoginEmail(email) ? "admin-email" : "resend";
}
