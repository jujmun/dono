import { ConvexError } from "convex/values";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./auth/ResendOTP";
import { ResendPasswordResetOTP } from "./auth/ResendPasswordResetOTP";
import { validatePasswordRequirements } from "./auth/passwordPolicy";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      verify: ResendOTP,
      reset: ResendPasswordResetOTP,
      profile: (params) => {
        const email = String(params.email ?? "").trim().toLowerCase();
        if (!email || !email.includes("@")) {
          throw new ConvexError({
            code: "INVALID_EMAIL",
            message: "Please provide a valid email address.",
          });
        }
        return { email };
      },
      validatePasswordRequirements,
    }),
  ],
});
