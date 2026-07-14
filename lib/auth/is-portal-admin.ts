import { isAdminLoginEmail } from "@/lib/auth/admin";

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
