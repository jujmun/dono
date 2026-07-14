import { convexAuth } from "@convex-dev/auth/server";
import { AdminEmailOTP } from "./auth/AdminEmailOTP";
import { ResendEmailOTP } from "./auth/ResendEmailOTP";
import { sanitizeRedirectTo } from "./lib/redirect";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [ResendEmailOTP, AdminEmailOTP],
  callbacks: {
    async redirect({ redirectTo }) {
      return sanitizeRedirectTo(redirectTo);
    },
  },
});
