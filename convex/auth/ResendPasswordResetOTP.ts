import Resend from "@auth/core/providers/resend";
import { Resend as ResendClient } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
import {
  getAuthFromAddress,
  OTP_ALPHABET,
  OTP_EXPIRY_NOTE,
  OTP_LENGTH,
} from "./otpConfig";

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
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    return otpToken();
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendClient(provider.apiKey);
    const from = getAuthFromAddress();

    const { error } = await resend.emails.send({
      from,
      to: [email],
      subject: "Reset your Dono password",
      text: `Your Dono password reset code is ${token}. ${OTP_EXPIRY_NOTE} If you didn't request this, you can ignore this email.`,
    });

    if (error) {
      throw new Error("Failed to send password reset code.");
    }
  },
});
