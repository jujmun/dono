import Resend from "@auth/core/providers/resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
import {
  getAuthFromAddress,
  OTP_ALPHABET,
  OTP_EXPIRY_NOTE,
  OTP_LENGTH,
} from "./otpConfig";
import { sendAuthEmail } from "./authEmailTemplate";

function otpToken() {
  const random: RandomReader = {
    read(bytes) {
      crypto.getRandomValues(bytes);
    },
  };
  return generateRandomString(random, OTP_ALPHABET, OTP_LENGTH);
}

export const ResendOTP = Resend({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    return otpToken();
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const from = getAuthFromAddress();

    const { error } = await sendAuthEmail({
      apiKey: provider.apiKey,
      from,
      to: email,
      subject: "Verify your Dono email",
      heading: "Verify your email.",
      code: token,
      expiryText: OTP_EXPIRY_NOTE,
      text: `Your Dono verification code is ${token}. ${OTP_EXPIRY_NOTE}`,
    });

    if (error) {
      throw new Error("Failed to send verification code.");
    }
  },
});
