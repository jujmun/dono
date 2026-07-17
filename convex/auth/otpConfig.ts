export const OTP_LENGTH = 6;
export const OTP_ALPHABET = "0123456789";
export const OTP_MAX_AGE_SECONDS = 60 * 10;
export const OTP_EXPIRY_NOTE = "This code expires shortly.";

export function getAuthFromAddress() {
  return process.env.AUTH_EMAIL_FROM ?? "Dono <auth@dono.app>";
}
