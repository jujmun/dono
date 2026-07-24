import { ConvexError } from "convex/values";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/**
 * Extra admin portal identities beyond `ADMIN_EMAIL` (Convex env).
 * Keep in sync with `OUTREACH_ADMIN_EMAILS` in `lib/auth/admin.ts`.
 */
const ADDITIONAL_ADMIN_EMAILS = new Set([
  "juyeon27312@gmail.com",
]);

export function getAdminEmail() {
  const value = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!value) {
    throw new ConvexError({
      code: "ADMIN_EMAIL_NOT_CONFIGURED",
      message: "ADMIN_EMAIL is not set on the Convex deployment.",
    });
  }
  return value;
}

export function getAdminCodeRecipient() {
  const value = process.env.ADMIN_CODE_RECIPIENT?.trim().toLowerCase();
  if (!value) {
    throw new ConvexError({
      code: "ADMIN_CODE_RECIPIENT_NOT_CONFIGURED",
      message: "ADMIN_CODE_RECIPIENT is not set on the Convex deployment.",
    });
  }
  return value;
}

export function isAdminIdentityEmail(email: string) {
  const normalized = normalizeEmail(email);
  const configured = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (configured && normalized === configured) return true;
  return ADDITIONAL_ADMIN_EMAILS.has(normalized);
}

export function isOxfordEmail(email: string) {
  const domain = normalizeEmail(email).split("@")[1] ?? "";
  return domain === "ox.ac.uk" || domain.endsWith(".ox.ac.uk");
}

/** Oxford addresses, or allowlisted non-Oxford admin portal identities. */
export function isAllowedAuthEmail(email: string) {
  return isOxfordEmail(email) || isAdminIdentityEmail(email);
}

/** Where to deliver the admin OTP for a given login identity. */
export function getAdminOtpRecipient(loginEmail: string) {
  const normalized = normalizeEmail(loginEmail);
  const configured = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (configured && normalized === configured) {
    return getAdminCodeRecipient();
  }
  return normalized;
}
