import { ConvexError } from "convex/values";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

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
  const configured = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!configured) return false;
  return normalizeEmail(email) === configured;
}
