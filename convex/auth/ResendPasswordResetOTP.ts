import Resend from "@auth/core/providers/resend";
import { Resend as ResendClient } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
import { ConvexError } from "convex/values";
import { internal } from "../_generated/api";
import { isAllowedAuthEmail } from "./adminConfig";
import {
  getAuthFromAddress,
  OTP_ALPHABET,
  OTP_LENGTH,
  OTP_MAX_AGE_SECONDS,
} from "./otpConfig";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function assertAllowedDomain(email: string) {
  if (!isAllowedAuthEmail(email)) {
    throw new ConvexError({
      code: "EMAIL_DOMAIN_NOT_ALLOWED",
      message: "Only Oxford email addresses (ending in ox.ac.uk) are allowed.",
    });
  }
}

function otpToken() {
  const random: RandomReader = {
    read(bytes) {
      crypto.getRandomValues(bytes);
    },
  };
  return generateRandomString(random, OTP_ALPHABET, OTP_LENGTH);
}

export const ResendPasswordResetOTP = Resend({
  id: "resend-password-reset-otp",
  maxAge: OTP_MAX_AGE_SECONDS,
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    return otpToken();
  },
  // Convex Auth passes `ctx` as a second argument (Auth.js types omit it).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async sendVerificationRequest(params: any, ctx?: any) {
    const email = normalizeEmail(String(params.identifier));
    assertAllowedDomain(email);

    if (ctx && typeof ctx.runMutation === "function") {
      await ctx.runMutation(internal.security.consumeOtpSend, { email });
    }

    const resend = new ResendClient(params.provider.apiKey);
    const from = getAuthFromAddress();

    const { error } = await resend.emails.send({
      from,
      to: [email],
      subject: "Reset your Dono password",
      text: `Your Dono password reset code is ${params.token}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`,
    });

    if (error) {
      throw new ConvexError({
        code: "OTP_SEND_FAILED",
        message: "Unable to send password reset email. Please try again.",
      });
    }
  },
});
