import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import type { WelcomeTourVariant } from "@/components/welcome-tour";

const COMPLETE_KEY_PREFIX = "dono:welcomeTourComplete:";
const PENDING_KEY_PREFIX = "dono:pendingWelcomeTour:";

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

// Student keeps the original unnamespaced key so existing "tour complete"
// flags aren't invalidated. Alumni gets its own distinct key per userId so
// the two flags can never collide, even though userType is locked per user.
function variantSegment(variant: WelcomeTourVariant) {
  return variant === "alumni" ? "alumni:" : "";
}

function completeKey(userId: string, variant: WelcomeTourVariant) {
  return `${COMPLETE_KEY_PREFIX}${variantSegment(variant)}${userId}`;
}

function pendingKey(userId: string, variant: WelcomeTourVariant) {
  return `${PENDING_KEY_PREFIX}${variantSegment(variant)}${userId}`;
}

export async function getWelcomeTourComplete(
  userId: string,
  variant: WelcomeTourVariant = "student",
) {
  const value = await storage.getItem(completeKey(userId, variant));
  return value === "1";
}

export async function getWelcomeTourPending(
  userId: string,
  variant: WelcomeTourVariant = "student",
) {
  const value = await storage.getItem(pendingKey(userId, variant));
  return value === "1";
}

export async function setWelcomeTourPending(
  userId: string,
  variant: WelcomeTourVariant = "student",
) {
  await storage.setItem(pendingKey(userId, variant), "1");
}

export async function setWelcomeTourComplete(
  userId: string,
  variant: WelcomeTourVariant = "student",
) {
  await storage.setItem(completeKey(userId, variant), "1");
  await storage.removeItem(pendingKey(userId, variant));
}
