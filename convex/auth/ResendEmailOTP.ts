import Resend from "@auth/core/providers/resend";
import { Resend as ResendClient } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
import { ConvexError } from "convex/values";

const OTP_ALPHABET = "0123456789";
const OTP_LENGTH = 6;
const OTP_MAX_AGE_SECONDS = 60 * 10;

/** Dev-only fixed OTP when AUTH_ADMIN_OTP_BYPASS=true. Never enable in production. */
export const ADMIN_BYPASS_OTP = "000000";
export const ADMIN_BYPASS_EMAIL = "admin@ox.ac.uk";

export function isAdminOtpBypassEnabled() {
  return process.env.AUTH_ADMIN_OTP_BYPASS === "true";
}

export function isBypassAdminEmail(email: string) {
  return normalizeEmail(email) === ADMIN_BYPASS_EMAIL;
}

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

// Only University of Oxford addresses (ox.ac.uk and its subdomains) may sign in.
function assertAllowedDomain(email: string) {
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
    // With bypass enabled on a private dev deployment, all OTPs are fixed so the
    // client can auto-submit for admin@ox.ac.uk. Do not set this in production.
    if (isAdminOtpBypassEnabled()) {
      return ADMIN_BYPASS_OTP;
    }
    return generateOtpToken();
  },
  async sendVerificationRequest({ identifier, provider, token }) {
    const email = normalizeEmail(identifier);
    assertAllowedDomain(email);

    if (isAdminOtpBypassEnabled() && isBypassAdminEmail(email)) {
      // Skip Resend entirely for the temporary admin shortcut.
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
