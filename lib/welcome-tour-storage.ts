import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

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

function completeKey(userId: string) {
  return `${COMPLETE_KEY_PREFIX}${userId}`;
}

function pendingKey(userId: string) {
  return `${PENDING_KEY_PREFIX}${userId}`;
}

export async function getWelcomeTourComplete(userId: string) {
  const value = await storage.getItem(completeKey(userId));
  return value === "1";
}

export async function getWelcomeTourPending(userId: string) {
  const value = await storage.getItem(pendingKey(userId));
  return value === "1";
}

export async function setWelcomeTourPending(userId: string) {
  await storage.setItem(pendingKey(userId), "1");
}

export async function setWelcomeTourComplete(userId: string) {
  await storage.setItem(completeKey(userId), "1");
  await storage.removeItem(pendingKey(userId));
}
