import { ConvexError, v } from "convex/values";
import { Resend as ResendClient } from "resend";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { requireAdmin, requireVerifiedUser } from "./lib/authz";
import { getAuthFromAddress } from "./auth/otpConfig";

const MAX_COMMENT_LENGTH = 2000;

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireVerifiedUser(ctx);
    const messages = await ctx.db
      .query("campaignReviewMessages")
      .withIndex("by_student", (q) => q.eq("studentUserId", userId))
      .collect();

    const enriched = await Promise.all(
      messages
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(async (m) => {
          const campaign = await ctx.db.get(m.campaignId);
          return {
            id: m._id,
            body: m.body,
            createdAt: m.createdAt,
            campaignSlug: m.campaignSlug,
            campaignTitle: campaign?.title ?? m.campaignSlug,
          };
        }),
    );
    return enriched;
  },
});

export const send = mutation({
  args: {
    slug: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const body = args.body.trim();
    if (!body || body.length > MAX_COMMENT_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Comment must be between 1 and 2000 characters.",
      });
    }

    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!campaign) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Campaign not found.",
      });
    }
    if (!campaign.createdBy) {
      throw new ConvexError({
        code: "NO_CREATOR",
        message: "This campaign has no linked student account.",
      });
    }

    const studentUserId = campaign.createdBy;
    const studentProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", studentUserId))
      .unique();
    if (!studentProfile?.email) {
      throw new ConvexError({
        code: "NO_STUDENT_EMAIL",
        message: "Student email is not available.",
      });
    }

    const messageId = await ctx.db.insert("campaignReviewMessages", {
      campaignId: campaign._id,
      campaignSlug: campaign.slug,
      studentUserId,
      adminUserId,
      body,
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.reviewMessages.emailStudent, {
      messageId,
      studentEmail: studentProfile.email,
      studentName: studentProfile.name ?? "there",
      campaignTitle: campaign.title,
      body,
    });

    return { messageId };
  },
});

export const markEmailSent = internalMutation({
  args: { messageId: v.id("campaignReviewMessages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, { emailSentAt: Date.now() });
  },
});

export const emailStudent = internalAction({
  args: {
    messageId: v.id("campaignReviewMessages"),
    studentEmail: v.string(),
    studentName: v.string(),
    campaignTitle: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.AUTH_RESEND_KEY;
    if (!apiKey) {
      console.error("AUTH_RESEND_KEY missing; review comment email not sent.");
      return;
    }

    const resend = new ResendClient(apiKey);
    const from = getAuthFromAddress();
    const { error } = await resend.emails.send({
      from,
      to: [args.studentEmail],
      subject: `Dono review feedback: ${args.campaignTitle}`,
      text: [
        `Hi ${args.studentName},`,
        "",
        `The Dono review team left feedback on your campaign "${args.campaignTitle}":`,
        "",
        args.body,
        "",
        "Sign in to Dono to continue updating your campaign.",
      ].join("\n"),
    });

    if (error) {
      console.error("Failed to send review comment email:", error);
      return;
    }

    await ctx.runMutation(internal.reviewMessages.markEmailSent, {
      messageId: args.messageId as Id<"campaignReviewMessages">,
    });
  },
});
