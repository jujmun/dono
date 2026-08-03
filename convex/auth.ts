import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import type { GenericActionCtxWithAuthConfig } from "@convex-dev/auth/server";
import type { GenericDataModel } from "convex/server";
import type { Value } from "convex/values";
import { internal } from "./_generated/api";
import { AdminEmailOTP } from "./auth/AdminEmailOTP";
import { validatePasswordRequirements } from "./auth/passwordPolicy";
import { ResendEmailOTP } from "./auth/ResendEmailOTP";
import { ResendPasswordResetOTP } from "./auth/ResendPasswordResetOTP";
import { sanitizeRedirectTo } from "./lib/redirect";

const passwordProvider = Password({
  validatePasswordRequirements,
  profile: (params) => ({
    email: String(params.email ?? "").trim().toLowerCase(),
  }),
  verify: ResendEmailOTP,
  reset: ResendPasswordResetOTP,
});

const passwordAuthorize = passwordProvider.authorize!;

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    ResendEmailOTP,
    AdminEmailOTP,
    {
      ...passwordProvider,
      authorize: async (
        params: Record<string, Value | undefined>,
        ctx: GenericActionCtxWithAuthConfig<GenericDataModel>,
      ) => {
        const email = String(params.email ?? "").trim().toLowerCase();
        const flow = String(params.flow ?? "");
        if (email && flow) {
          const userTypeRaw = params.userType;
          const userType =
            userTypeRaw === "student" || userTypeRaw === "alumni"
              ? userTypeRaw
              : undefined;
          await ctx.runMutation(internal.security.consumeAuthFlow, {
            flow,
            email,
            ...(flow === "signUp" ? { userType } : {}),
          });
        }
        return passwordAuthorize(params, ctx);
      },
    },
  ],
  signIn: {
    maxFailedAttempsPerHour: 8,
  },
  callbacks: {
    async redirect({ redirectTo }) {
      return sanitizeRedirectTo(redirectTo);
    },
  },
});
