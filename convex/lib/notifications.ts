import type { MutationCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

export const MAX_ADMIN_MESSAGE_LENGTH = 2000;

export function buildCampaignPendingMessage(campaignTitle: string) {
  return `Your campaign '${campaignTitle}' is waiting for verification.`;
}

export function buildCampaignActiveMessage(campaignTitle: string) {
  return `Your campaign '${campaignTitle}' is now active.`;
}

export function buildCampaignRejectedMessage(campaignTitle: string) {
  return `Your campaign '${campaignTitle}' was not approved.`;
}

/** Shown only in the admin thread (convex/notifications.ts listThreadWithUser),
 * not in the owner's own notification bell — see createNotification's read:true. */
export function buildCampaignEditedMessage(campaignTitle: string) {
  return `Campaign '${campaignTitle}' was updated.`;
}

/** Sent to every admin (see campaignCreator.resubmit) when an owner resubmits
 * a changes-requested/rejected campaign for re-review. */
export function buildCampaignResubmittedMessage(campaignTitle: string) {
  return `Campaign '${campaignTitle}' was resubmitted and needs re-review.`;
}

// TODO: replace with real onboarding flow — this is a placeholder notification
// only, per the initial in-app notifications pass. relatedEntityId is
// intentionally omitted so the bell just shows the message with no link.
export const ONBOARDING_MESSAGE = "Click here for onboarding.";

export function validateAdminMessageBody(body: string) {
  const trimmed = body.trim();
  if (!trimmed) {
    return { valid: false as const, message: "Message cannot be empty." };
  }
  if (trimmed.length > MAX_ADMIN_MESSAGE_LENGTH) {
    return {
      valid: false as const,
      message: `Message must be at most ${MAX_ADMIN_MESSAGE_LENGTH} characters.`,
    };
  }
  return { valid: true as const, message: trimmed };
}

interface CreateNotificationArgs {
  userId: Id<"users">;
  type:
    | "campaign_pending"
    | "campaign_active"
    | "campaign_rejected"
    | "admin_message"
    | "onboarding"
    | "campaign_edited"
    | "campaign_resubmitted";
  message: string;
  relatedEntityType?: "campaign";
  relatedEntityId?: string;
  senderId?: Id<"users">;
  isEditRequest?: boolean;
  /** True for rows created by groups.sendBroadcast's fan-out loop. */
  isBroadcast?: boolean;
  /** Defaults false. campaign_edited events pass true — it's a system
   * marker for the admin thread, not something that should bump the
   * owner's own unread badge. */
  read?: boolean;
}

/** Single insert path for every notification-creating flow — campaign
 * create/approve/reject, admin messaging, and new-account onboarding all
 * call this rather than writing to the table directly. */
export async function createNotification(ctx: MutationCtx, args: CreateNotificationArgs) {
  return await ctx.db.insert("notifications", {
    userId: args.userId,
    type: args.type,
    message: args.message,
    relatedEntityType: args.relatedEntityType,
    relatedEntityId: args.relatedEntityId,
    read: args.read ?? false,
    createdAt: Date.now(),
    senderId: args.senderId,
    isEditRequest: args.isEditRequest,
    isBroadcast: args.isBroadcast,
  });
}
