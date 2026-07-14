const DEFAULT_MAX_LIMIT = 50;

/**
 * Clamp a client-supplied pagination limit to a safe server-side range.
 */
export function clampLimit(
  limit: number | undefined,
  defaultLimit: number,
  maxLimit: number = DEFAULT_MAX_LIMIT,
): number {
  const fallback =
    Number.isFinite(defaultLimit) && defaultLimit > 0
      ? Math.min(Math.floor(defaultLimit), maxLimit)
      : 1;
  if (limit === undefined || !Number.isFinite(limit)) {
    return fallback;
  }
  const n = Math.floor(limit);
  if (n < 1) return fallback;
  return Math.min(n, maxLimit);
}
