import { convexAuth } from "@convex-dev/auth/server";
import { ResendEmailOTP } from "./auth/ResendEmailOTP";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    ResendEmailOTP,
  ],
  callbacks: {
    async redirect({ redirectTo }) {
      return redirectTo ?? "/";
    },
  },
});
