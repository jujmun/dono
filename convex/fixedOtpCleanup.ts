import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import {
  ADMIN_BYPASS_EMAIL,
  ADMIN_BYPASS_OTP,
  isAdminOtpBypassEnabled,
  isBypassAdminEmail,
} from "./auth/ResendEmailOTP";

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
 * Internal-only — never callable by clients.
 */
export const clearFixedOtpCodes = internalMutation({
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
 * Internal-only — never callable by clients.
 */
export const keepNewestFixedOtpCode = internalMutation({
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

/**
 * After a random OTP is stored for admin@ox.ac.uk, rewrite that account's
 * verification code to the fixed bypass OTP. No-ops unless bypass is enabled
 * and email is exactly admin@ox.ac.uk.
 */
export const setFixedBypassCodeForEmail = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    if (!isAdminOtpBypassEnabled() || !isBypassAdminEmail(args.email)) {
      return { updated: false };
    }

    const email = args.email.trim().toLowerCase();
    const bypassHash = await sha256Hex(ADMIN_BYPASS_OTP);

    // Drop any leftover fixed-OTP rows first so .unique() lookup stays clean.
    const fixedRows = (
      await ctx.db.query("authVerificationCodes").collect()
    ).filter((row) => row.code === bypassHash);
    for (const row of fixedRows) {
      await ctx.db.delete(row._id);
    }

    const rows = (await ctx.db.query("authVerificationCodes").collect()).filter(
      (row) =>
        (row.emailVerified ?? "").trim().toLowerCase() === email ||
        (row.emailVerified ?? "").trim().toLowerCase() === ADMIN_BYPASS_EMAIL,
    );

    if (rows.length === 0) {
      return { updated: false };
    }

    const [newest, ...older] = rows.sort(
      (a, b) => b._creationTime - a._creationTime,
    );
    for (const row of older) {
      await ctx.db.delete(row._id);
    }
    await ctx.db.patch(newest._id, { code: bypassHash });
    return { updated: true };
  },
});
