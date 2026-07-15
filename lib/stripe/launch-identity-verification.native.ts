import { Linking } from "react-native";
import type {
  LaunchIdentityVerificationArgs,
  LaunchIdentityVerificationResult,
} from "./launch-identity-verification-types";

/**
 * Native: @stripe/stripe-react-native has no Identity verification sheet API
 * (checked directly against the installed package — only payment sheet /
 * Connect onboarding / onramp exist). Opens Stripe's hosted verification page
 * in the external system browser instead, since no in-app browser/WebView
 * library (e.g. expo-web-browser) is installed. This is a real UX limitation
 * versus an embedded flow — flagged rather than silently adding a new package.
 */
export async function launchIdentityVerification({
  url,
}: LaunchIdentityVerificationArgs): Promise<LaunchIdentityVerificationResult> {
  if (!url) {
    return { error: "Verification is not available in this environment." };
  }

  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    return { error: "Unable to open the verification page." };
  }

  await Linking.openURL(url);
  return {};
}
