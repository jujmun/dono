import type { ReactElement } from "react";
import { StripeProvider } from "@stripe/stripe-react-native";

const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

export function StripeAppProvider({ children }: { children: ReactElement }) {
  if (!publishableKey) {
    return children;
  }

  return (
    <StripeProvider publishableKey={publishableKey} merchantIdentifier="merchant.com.dono.app">
      {children}
    </StripeProvider>
  );
}
