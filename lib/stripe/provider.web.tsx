import type { ReactNode } from "react";

export function StripeAppProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
