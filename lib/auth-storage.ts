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
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(key);
  },
  setItem: (key, value) => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(key, value);
  },
  removeItem: (key) => {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(key);
  },
};

export const authStorage =
  Platform.OS === "web" ? webStorage : secureStoreStorage;
