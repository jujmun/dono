import { isAdminLoginEmail } from "@/lib/auth/admin";
import { isDemoOpenAdminEnabled } from "@/lib/demo-open-admin";

type ProfileLike = {
  role?: string | null;
  email?: string | null;
} | null | undefined;

/** True for profiles.role === "admin", or the configured outreach login email. */
export function isPortalAdmin(profile: ProfileLike) {
  if (!profile) return false;
  if (profile.role === "admin") return true;
  return isAdminLoginEmail(profile.email ?? "");
}

/**
 * Portal entry for admin UI. Includes demo open-admin (Preview builds only)
 * so /admin can load without a session on demo.joindono.com.
 */
export function canAccessAdminPortal(profile: ProfileLike) {
  if (isDemoOpenAdminEnabled()) return true;
  return isPortalAdmin(profile);
}
