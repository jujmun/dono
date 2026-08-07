import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { LEGAL_DOCUMENT_VERSIONS } from "@/lib/legal/documents";

const CONSENT_KEY = "dono:analyticsConsent";

export type AnalyticsConsent = "granted" | "denied";

/** Cookie Notice version recorded with each consent decision (CK-05). */
export const COOKIE_NOTICE_VERSION = LEGAL_DOCUMENT_VERSIONS.cookie;

export type AnalyticsConsentRecord = {
  status: AnalyticsConsent;
  decidedAt: number;
  cookieNoticeVersion: string;
};

type Storage = {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
  removeItem: (key: string) => Promise<void> | void;
};

const secureStoreStorage: Storage = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

const webStorage: Storage = {
  getItem: (key) => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key, value) => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};

const storage = Platform.OS === "web" ? webStorage : secureStoreStorage;

function parseConsentRecord(raw: string | null): AnalyticsConsentRecord | null {
  if (!raw) return null;

  // Legacy plain status string — treat as decided now with current notice.
  if (raw === "granted" || raw === "denied") {
    return {
      status: raw,
      decidedAt: Date.now(),
      cookieNoticeVersion: COOKIE_NOTICE_VERSION,
    };
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "status" in parsed &&
      "decidedAt" in parsed &&
      "cookieNoticeVersion" in parsed
    ) {
      const record = parsed as Record<string, unknown>;
      if (
        (record.status === "granted" || record.status === "denied") &&
        typeof record.decidedAt === "number" &&
        typeof record.cookieNoticeVersion === "string"
      ) {
        return {
          status: record.status,
          decidedAt: record.decidedAt,
          cookieNoticeVersion: record.cookieNoticeVersion,
        };
      }
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Returns the stored consent decision, or null when missing / notice-version
 * stale (so the banner / settings page can re-prompt).
 */
export async function getAnalyticsConsentRecord(): Promise<AnalyticsConsentRecord | null> {
  const value = await storage.getItem(CONSENT_KEY);
  const record = parseConsentRecord(value);
  if (!record) return null;
  if (record.cookieNoticeVersion !== COOKIE_NOTICE_VERSION) return null;
  return record;
}

/** @deprecated Prefer getAnalyticsConsentRecord — kept for call sites that only need status. */
export async function getAnalyticsConsent(): Promise<AnalyticsConsent | null> {
  const record = await getAnalyticsConsentRecord();
  return record?.status ?? null;
}

export async function setAnalyticsConsent(value: AnalyticsConsent) {
  const record: AnalyticsConsentRecord = {
    status: value,
    decidedAt: Date.now(),
    cookieNoticeVersion: COOKIE_NOTICE_VERSION,
  };
  await storage.setItem(CONSENT_KEY, JSON.stringify(record));
}

/** Clears the decision so the banner / settings flow re-prompts (CK-04). */
export async function clearAnalyticsConsent() {
  await storage.removeItem(CONSENT_KEY);
}
