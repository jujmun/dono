import { Platform } from "react-native";
import * as ExpoLinking from "expo-linking";

/**
 * Build a Stripe Connect return/refresh URL that stays HTTPS in live mode.
 * Prefer EXPO_PUBLIC_SITE_URL (https://joindono.com) over Expo deep links,
 * which fail assertHttpsConnectReturnUrls when STRIPE_SECRET_KEY is sk_live_.
 */
export function buildConnectReturnUrl(
  path: string,
  query?: Record<string, string>,
): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const search = query
    ? `?${new URLSearchParams(query).toString()}`
    : "";
  const pathWithQuery = `${normalizedPath}${search}`;

  const siteUrl = process.env.EXPO_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (siteUrl && /^https:\/\//i.test(siteUrl)) {
    return `${siteUrl}${pathWithQuery}`;
  }

  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `${window.location.origin}${pathWithQuery}`;
  }

  return ExpoLinking.createURL(normalizedPath.replace(/^\//, ""), {
    queryParams: query,
  });
}
