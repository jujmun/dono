import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import type {
  ConvexCredentialsConfig,
  GenericActionCtxWithAuthConfig,
} from "@convex-dev/auth/server";
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

// @convex-dev/auth keeps each provider's real config on a non-public
// `.options` field and re-merges `.options` back over the top-level provider
// object whenever it materializes providers for use (see
// `providerDefaults`/`merge` in
// node_modules/@convex-dev/auth/dist/server/provider_utils.js). That means a
// plain `{ ...passwordProvider, authorize: wrapped }` override is silently
// discarded at runtime — `.options.authorize` always wins. The public
// `ConvexCredentialsConfig` type doesn't declare `.options`, hence the cast.
const passwordOptions = (
  passwordProvider as unknown as { options: ConvexCredentialsConfig }
).options;
const passwordAuthorize = passwordOptions.authorize;

const authorizeWithFlowGuard = async (
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
};

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    ResendEmailOTP,
    AdminEmailOTP,
    {
      ...passwordProvider,
      authorize: authorizeWithFlowGuard,
      options: { ...passwordOptions, authorize: authorizeWithFlowGuard },
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
