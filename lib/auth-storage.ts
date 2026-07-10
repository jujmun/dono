import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

type TokenStorage = {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
  removeItem: (key: string) => Promise<void> | void;
};

const secureStoreStorage: TokenStorage = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

const webStorage: TokenStorage = {
  getItem: (key) => {
    if (typeof sessionStorage !== "undefined") {
      return sessionStorage.getItem(key);
    }
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key, value) => {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(key, value);
      return;
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem(key);
    }
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};

export const authStorage =
  Platform.OS === "web" ? webStorage : secureStoreStorage;
