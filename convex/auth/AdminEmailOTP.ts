import Resend from "@auth/core/providers/resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
import { ConvexError } from "convex/values";
import { internal } from "../_generated/api";
import {
  getAdminOtpRecipient,
  isAdminIdentityEmail,
} from "./adminConfig";
import { getAuthFromAddress, OTP_ALPHABET, OTP_LENGTH } from "./otpConfig";
import { sendAuthEmail } from "./authEmailTemplate";

const OTP_MAX_AGE_SECONDS = 60 * 10;

function generateOtpToken() {
  const random: RandomReader = {
    read(bytes) {
      crypto.getRandomValues(bytes);
    },
  };
  return generateRandomString(random, OTP_ALPHABET, OTP_LENGTH);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export const AdminEmailOTP = Resend({
  id: "admin-email",
  maxAge: OTP_MAX_AGE_SECONDS,
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    return generateOtpToken();
  },
  // Convex Auth passes `ctx` as a second argument (Auth.js types omit it).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async sendVerificationRequest(params: any, ctx?: any) {
    const email = normalizeEmail(String(params.identifier));

    if (!isAdminIdentityEmail(email)) {
      throw new ConvexError({
        code: "ADMIN_EMAIL_MISMATCH",
        message: "This sign-in method is only available for the admin account.",
      });
    }

    if (ctx && typeof ctx.runMutation === "function") {
      await ctx.runMutation(internal.security.consumeOtpSend, { email });
    }

    const recipient = getAdminOtpRecipient(email);
    const from = getAuthFromAddress();
    const { error } = await sendAuthEmail({
      apiKey: params.provider.apiKey,
      from,
      to: recipient,
      subject: "Dono admin sign-in code",
      heading: "Admin sign-in.",
      intro: `Sign-in code for ${email}.`,
      code: params.token,
      expiryText: "Expires in 10 minutes. Didn't request this? Ignore this email.",
      text: `Your Dono admin sign-in code for ${email} is ${params.token}. It expires in 10 minutes.`,
    });

    if (error) {
      throw new ConvexError({
        code: "OTP_SEND_FAILED",
        message: "Unable to send OTP email. Please try again.",
      });
    }
  },
});
