import { mutation } from "./_generated/server";
import { ADMIN_BYPASS_OTP, isAdminOtpBypassEnabled } from "./auth/ResendEmailOTP";

async function sha256Hex(input: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Deletes every stored hash of the fixed bypass OTP so the next request can
 * insert exactly one. Needed because convex-auth verifies with .unique() on code.
 * No-ops unless AUTH_ADMIN_OTP_BYPASS=true.
 */
export const clearFixedOtpCodes = mutation({
  args: {},
  handler: async (ctx) => {
    if (!isAdminOtpBypassEnabled()) {
      return { deleted: 0 };
    }
    const bypassHash = await sha256Hex(ADMIN_BYPASS_OTP);
    const matches = (await ctx.db.query("authVerificationCodes").collect()).filter(
      (row) => row.code === bypassHash,
    );
    for (const row of matches) {
      await ctx.db.delete(row._id);
    }
    return { deleted: matches.length };
  },
});

/**
 * If multiple fixed-OTP rows exist, keep the newest so verify's .unique() works.
 * No-ops unless AUTH_ADMIN_OTP_BYPASS=true.
 */
export const keepNewestFixedOtpCode = mutation({
  args: {},
  handler: async (ctx) => {
    if (!isAdminOtpBypassEnabled()) {
      return { deleted: 0, kept: 0 };
    }
    const bypassHash = await sha256Hex(ADMIN_BYPASS_OTP);
    const matches = (await ctx.db.query("authVerificationCodes").collect())
      .filter((row) => row.code === bypassHash)
      .sort((a, b) => b._creationTime - a._creationTime);
    let deleted = 0;
    for (const row of matches.slice(1)) {
      await ctx.db.delete(row._id);
      deleted++;
    }
    return {
      deleted,
      kept: matches.length > 0 ? 1 : 0,
    };
  },
});
