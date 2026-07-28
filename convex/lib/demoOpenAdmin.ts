/**
 * Demo-only open admin access (no signed-in session).
 * Requires DEMO_OPEN_ADMIN=true and a non-production Convex deployment.
 * Never enable on prod: — ignored even if the env var is set.
 */
export function isDemoOpenAdminEnabled() {
  if (process.env.DEMO_OPEN_ADMIN !== "true") {
    return false;
  }
  const deployment = process.env.CONVEX_DEPLOYMENT ?? "";
  if (deployment.startsWith("prod:")) {
    return false;
  }
  return true;
}
