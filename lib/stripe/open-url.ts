import { Linking, Platform } from "react-native";

/**
 * Open a Stripe (or other external) URL without losing the user gesture on web.
 *
 * react-native-web's Linking.openURL defaults to window.open(..., "_blank"),
 * which browsers block after an await (e.g. Convex action). Same-tab assign
 * keeps Connect / Dashboard redirects reliable in production.
 */
export async function openStripeUrl(url: string): Promise<void> {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.location.assign(url);
    return;
  }
  await Linking.openURL(url);
}
