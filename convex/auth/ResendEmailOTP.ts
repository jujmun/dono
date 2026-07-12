import Resend from "@auth/core/providers/resend";
import { Resend as ResendClient } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
import { ConvexError } from "convex/values";

const OTP_ALPHABET = "0123456789";
const OTP_LENGTH = 6;
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

// Dev-only bypass: set TEST_MODE_EMAIL via `npx convex env set` on your local
// deployment only. Never set this on a preview or production deployment —
// it exempts exactly this one address from the Oxford-domain check below.
function isTestModeEmail(email: string) {
  const testEmail = process.env.TEST_MODE_EMAIL?.trim().toLowerCase();
  return Boolean(testEmail) && email === testEmail;
}

// Only University of Oxford addresses (ox.ac.uk and its subdomains) may sign in.
function assertAllowedDomain(email: string) {
  if (isTestModeEmail(email)) {
    return;
  }

  const domain = email.split("@")[1]?.toLowerCase();
  const isOxford =
    domain === "ox.ac.uk" || Boolean(domain?.endsWith(".ox.ac.uk"));

  if (!isOxford) {
    throw new ConvexError({
      code: "EMAIL_DOMAIN_NOT_ALLOWED",
      message: "Only Oxford email addresses (ending in ox.ac.uk) are allowed.",
    });
  }
}

export const ResendEmailOTP = Resend({
  id: "resend",
  maxAge: OTP_MAX_AGE_SECONDS,
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    return generateOtpToken();
  },
  async sendVerificationRequest({ identifier, provider, token }) {
    const email = normalizeEmail(identifier);
    assertAllowedDomain(email);

    if (isTestModeEmail(email)) {
      console.log(
        `[TEST MODE] Dono sign-in code for ${email}: ${token} (expires in 10 min)`,
      );
      return;
    }

    const resend = new ResendClient(provider.apiKey);
    const from = process.env.AUTH_EMAIL_FROM ?? "Dono <auth@dono.app>";
    const { error } = await resend.emails.send({
      from,
      to: [email],
      subject: "Your Dono sign-in code",
      text: `Your Dono code is ${token}. It expires in 10 minutes.`,
    });

    if (error) {
      throw new ConvexError({
        code: "OTP_SEND_FAILED",
        message: "Unable to send OTP email. Please try again.",
      });
    }
  },
});
