import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const CONSENT_KEY = "dono:analyticsConsent";

export type AnalyticsConsent = "granted" | "denied";

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

export async function getAnalyticsConsent(): Promise<AnalyticsConsent | null> {
  const value = await storage.getItem(CONSENT_KEY);
  if (value === "granted" || value === "denied") return value;
  return null;
}

export async function setAnalyticsConsent(value: AnalyticsConsent) {
  await storage.setItem(CONSENT_KEY, value);
}
