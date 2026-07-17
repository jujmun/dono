import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { AdminEmailOTP } from "./auth/AdminEmailOTP";
import { validatePasswordRequirements } from "./auth/passwordPolicy";
import { ResendEmailOTP } from "./auth/ResendEmailOTP";
import { ResendPasswordResetOTP } from "./auth/ResendPasswordResetOTP";
import { sanitizeRedirectTo } from "./lib/redirect";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    ResendEmailOTP,
    AdminEmailOTP,
    Password({
      validatePasswordRequirements,
      profile: (params) => ({
        email: String(params.email ?? "").trim().toLowerCase(),
      }),
      verify: ResendEmailOTP,
      reset: ResendPasswordResetOTP,
    }),
  ],
  callbacks: {
    async redirect({ redirectTo }) {
      return sanitizeRedirectTo(redirectTo);
    },
  },
});
