import { Resend as ResendClient } from "resend";
import Resend from "@auth/core/providers/resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
import { ConvexError } from "convex/values";
import { internal } from "../_generated/api";

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
    // Always random. Admin-only fixed OTP is applied later in
    // sendVerificationRequest (where the email is known) by rewriting
    // the just-stored code for admin@ox.ac.uk only.
    return generateOtpToken();
  },
  // Convex Auth passes `ctx` as a second argument (Auth.js types omit it).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async sendVerificationRequest(params: any, ctx?: any) {
    const email = normalizeEmail(String(params.identifier));
    assertAllowedDomain(email);

    if (isAdminOtpBypassEnabled() && isBypassAdminEmail(email)) {
      // Token generation cannot see the email, so a random code was stored.
      // Rewrite only this admin account's row to the fixed bypass OTP.
      if (ctx && typeof ctx.runMutation === "function") {
        await ctx.runMutation(
          internal.fixedOtpCleanup.setFixedBypassCodeForEmail,
          { email },
        );
      }
      return;
    }

    const resend = new ResendClient(params.provider.apiKey);
    const from = process.env.AUTH_EMAIL_FROM ?? "Dono <auth@dono.app>";
    const { error } = await resend.emails.send({
      from,
      to: [email],
      subject: "Your Dono sign-in code",
      text: `Your Dono code is ${params.token}. It expires in 10 minutes.`,
    });

    if (error) {
      throw new ConvexError({
        code: "OTP_SEND_FAILED",
        message: "Unable to send OTP email. Please try again.",
      });
    }
  },
});
