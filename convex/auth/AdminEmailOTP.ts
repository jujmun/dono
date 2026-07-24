import Resend from "@auth/core/providers/resend";
import { Resend as ResendClient } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
import { ConvexError } from "convex/values";
import {
  getAdminOtpRecipient,
  isAdminIdentityEmail,
} from "./adminConfig";
import { getAuthFromAddress, OTP_ALPHABET, OTP_LENGTH } from "./otpConfig";

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
  async sendVerificationRequest({ identifier, provider, token }) {
    const email = normalizeEmail(identifier);

    if (!isAdminIdentityEmail(email)) {
      throw new ConvexError({
        code: "ADMIN_EMAIL_MISMATCH",
        message: "This sign-in method is only available for the admin account.",
      });
    }

    const recipient = getAdminOtpRecipient(email);
    const resend = new ResendClient(provider.apiKey);
    const from = getAuthFromAddress();
    const { error } = await resend.emails.send({
      from,
      to: [recipient],
      subject: "Dono admin sign-in code",
      text: `Your Dono admin sign-in code for ${email} is ${token}. It expires in 10 minutes.`,
    });

    if (error) {
      throw new ConvexError({
        code: "OTP_SEND_FAILED",
        message: "Unable to send OTP email. Please try again.",
      });
    }
  },
});
