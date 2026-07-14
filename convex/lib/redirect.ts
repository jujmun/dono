/**
 * Allowlist auth redirect destinations. Reject open redirects.
 * Relative app paths are allowed; absolute URLs must match trusted hosts.
 */

function collectAllowedHosts(): Set<string> {
  const hosts = new Set<string>();
  const candidates = [
    process.env.EXPO_PUBLIC_CONVEX_SITE_URL,
    process.env.EXPO_PUBLIC_SITE_URL,
    process.env.SITE_URL,
  ];
  for (const value of candidates) {
    if (!value) continue;
    try {
      hosts.add(new URL(value).host.toLowerCase());
    } catch {
      // ignore invalid env URLs
    }
  }
  return hosts;
}

function isSafeRelativePath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("://")) return false;
  if (path.includes("\\")) return false;
  if (path.includes("@")) return false;
  return true;
}

/**
 * Returns a safe redirect path/URL, or "/" if the value is not allowlisted.
 */
export function sanitizeRedirectTo(redirectTo: string | undefined | null): string {
  const fallback = "/";
  if (redirectTo == null || redirectTo === "") {
    return fallback;
  }

  const trimmed = redirectTo.trim();
  if (isSafeRelativePath(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return fallback;
    }
    const allowed = collectAllowedHosts();
    if (allowed.has(url.host.toLowerCase())) {
      return `${url.origin}${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return fallback;
  }

  return fallback;
}
