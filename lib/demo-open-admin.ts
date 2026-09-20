/**
 * Demo-only: allow the admin portal UI without a signed-in session.
 *
 * Enabled when:
 * - EXPO_PUBLIC_DEMO_OPEN_ADMIN=true (Vercel Preview builds), or
 * - the page is served from demo.joindono.com (web hostname fallback)
 *
 * Never enable the env flag on Production. Server mutations still require
 * DEMO_OPEN_ADMIN on a non-prod Convex deployment.
 */
export function isDemoOpenAdminEnabled() {
  if (process.env.EXPO_PUBLIC_DEMO_OPEN_ADMIN === "true") {
    return true;
  }
  try {
    const host =
      typeof globalThis !== "undefined" &&
      "location" in globalThis &&
      (globalThis as { location?: { hostname?: string } }).location?.hostname;
    return host === "demo.joindono.com";
  } catch {
    return false;
  }
}
