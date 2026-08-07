/**
 * Shared moderation reason codes and thresholds (OS-03–OS-10).
 * Configurable lists — edit here rather than scattering magic strings.
 */

export const REPORT_REASON_CODES = [
  "illegal_content",
  "child_safety",
  "csea",
  "threats_violence",
  "hate_speech",
  "harassment",
  "suicide_self_harm",
  "spam_scam",
  "impersonation",
  "other",
] as const;

export type ReportReasonCode = (typeof REPORT_REASON_CODES)[number];

export const URGENT_REASON_CODES: ReadonlySet<string> = new Set([
  "child_safety",
  "csea",
  "threats_violence",
  "suicide_self_harm",
  "illegal_content",
]);

export const MODERATION_ACTIONS = [
  "hide_content",
  "remove_content",
  "pause_campaign",
  "restrict_commenting",
  "suspend_account",
  "keep",
  "restore",
] as const;

export type ModerationAction = (typeof MODERATION_ACTIONS)[number];

export function isReportReasonCode(value: string): value is ReportReasonCode {
  return (REPORT_REASON_CODES as readonly string[]).includes(value);
}

export function isUrgentReasonCode(code: string): boolean {
  return URGENT_REASON_CODES.has(code);
}

/** Guest / authenticated report intake (OS-02). */
export const REPORT_RATE_LIMIT = {
  maxAttempts: 5,
  windowMs: 60 * 60 * 1000,
  lockoutMs: 60 * 60 * 1000,
} as const;

/** Comment posting (OS-10) — stricter than generic upload limits. */
export const COMMENT_RATE_LIMIT = {
  maxAttempts: 8,
  windowMs: 10 * 60 * 1000,
  lockoutMs: 30 * 60 * 1000,
} as const;

/** Auto temporary commenting restriction after repeated rate-limit hits. */
export const COMMENT_REPEAT_OFFENDER = {
  /** Rate-limit lockouts within this window trigger restriction. */
  hitsThreshold: 3,
  hitWindowMs: 24 * 60 * 60 * 1000,
  restrictionMs: 24 * 60 * 60 * 1000,
} as const;

export const MAX_CONTENT_SNAPSHOT = 8000;
export const MAX_EVIDENCE_NOTE = 2000;
export const MAX_REASON = 2000;
