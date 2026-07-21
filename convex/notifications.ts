import { ConvexError, v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { requireAdmin, requireCurrentUser } from "./lib/authz";
import { clampLimit } from "./lib/pagination";
import { logAdminAction } from "./adminAudit";
import {
  createNotification,
  validateAdminMessageBody,
} from "./lib/notifications";

/** Shared shape for the merged admin<->student thread — either a real
 * notifications-table row (admin_message/campaign_edited) or a read-only
 * campaignReviewMessages row (system-generated reject/take-down reason). */
interface ThreadItem {
  id: string;
  kind: "message" | "review_note";
  type: string;
  message: string;
  createdAt: number;
  read: boolean;
  senderId: Id<"users"> | undefined;
  senderName: string;
  relatedEntityType: "campaign" | undefined;
  relatedEntityId: string | undefined;
  relatedEntityTitle: string | null;
  isEditRequest: boolean;
}

function toNotification(
  n: Doc<"notifications">,
  relatedEntityTitle: string | null,
  deletable: boolean,
) {
  return {
    id: n._id,
    type: n.type,
    message: n.message,
    relatedEntityType: n.relatedEntityType,
    relatedEntityId: n.relatedEntityId,
    relatedEntityTitle,
    read: n.read,
    createdAt: n.createdAt,
    senderId: n.senderId,
    isEditRequest: n.isEditRequest ?? false,
    deletable,
  };
}

async function profileDisplayName(ctx: QueryCtx, userId: Id<"users">) {
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
  return {
    name: profile?.name ?? profile?.email ?? "Unknown",
    email: profile?.email ?? "",
  };
}

/** Cached per-query — a page/thread commonly repeats the same campaign
 * across several notifications. */
async function campaignTitleResolver(ctx: QueryCtx) {
  const cache = new Map<string, string | null>();
  return async (slug: string): Promise<string | null> => {
    const cached = cache.get(slug);
    if (cached !== undefined) return cached;
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    const title = campaign?.title ?? null;
    cache.set(slug, title);
    return title;
  };
}

/** Cached per-query lookup of a campaign's current status by slug — used
 * only to decide whether an isEditRequest admin_message is still an active,
 * unresolved change request (see isDeletableByRecipient below). */
function campaignStatusResolver(ctx: QueryCtx) {
  const cache = new Map<string, string | null>();
  return async (slug: string): Promise<string | null> => {
    const cached = cache.get(slug);
    if (cached !== undefined) return cached;
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    const status = campaign?.status ?? null;
    cache.set(slug, status);
    return status;
  };
}

/** PROTECTED (not deletable by the recipient): an unresolved change-request
 * from an admin — isEditRequest admin_message whose campaign is still
 * "changes_requested". Both ways out of that status move it off this list:
 * the owner resubmitting (campaignCreator.resubmit -> "pending") or an admin
 * closing it out directly (campaigns.approve/reject, which operate on any
 * isUnderReview campaign, not just "pending"). Every other notification —
 * including a resolved isEditRequest message — is plain informational and
 * always deletable from the recipient's own view. */
async function isDeletableByRecipient(
  n: Doc<"notifications">,
  resolveCampaignStatus: (slug: string) => Promise<string | null>,
): Promise<boolean> {
  if (n.type !== "admin_message" || !n.isEditRequest) return true;
  if (n.relatedEntityType !== "campaign" || !n.relatedEntityId) return true;
  const status = await resolveCampaignStatus(n.relatedEntityId);
  return status !== "changes_requested";
}

/** Cursor-paginated, newest first — mirrors campaigns.listPaginated's
 * {cursor, limit} -> {items, nextCursor} shape.
 *
 * No polling here or in getUnreadCount below: useQuery is already a live
 * Convex subscription, so the bell/panel update in real time for free. */
export const list = query({
  args: {
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireCurrentUser(ctx);
    const limit = clampLimit(args.limit, 20, 50);

    // campaign_edited is a system marker for the admin thread (see
    // listThreadWithUser) — created read:true so it can't inflate this
    // user's own badge, but it shouldn't appear in their own bell at all.
    const mine = (
      await ctx.db
        .query("notifications")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .collect()
    ).filter((n) => n.type !== "campaign_edited" && !n.deletedAt);

    let start = 0;
    if (args.cursor) {
      const idx = mine.findIndex((n) => n._id === args.cursor);
      start = idx >= 0 ? idx + 1 : 0;
    }

    const page = mine.slice(start, start + limit);
    const resolveCampaignTitle = await campaignTitleResolver(ctx);
    const resolveCampaignStatus = campaignStatusResolver(ctx);
    const items = await Promise.all(
      page.map(async (n) => {
        const title =
          n.relatedEntityType === "campaign" && n.relatedEntityId
            ? await resolveCampaignTitle(n.relatedEntityId)
            : null;
        const deletable = await isDeletableByRecipient(n, resolveCampaignStatus);
        return toNotification(n, title, deletable);
      }),
    );

    return {
      items,
      nextCursor:
        start + limit < mine.length ? page[page.length - 1]?._id : null,
    };
  },
});

export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireCurrentUser(ctx);
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_read", (q) => q.eq("userId", userId).eq("read", false))
      .collect();
    return unread.filter((n) => !n.deletedAt).length;
  },
});

export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const { userId } = await requireCurrentUser(ctx);
    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== userId) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Notification not found." });
    }
    if (!notification.read) {
      await ctx.db.patch(args.notificationId, { read: true });
    }
    return null;
  },
});

export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireCurrentUser(ctx);
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_read", (q) => q.eq("userId", userId).eq("read", false))
      .collect();
    await Promise.all(unread.map((n) => ctx.db.patch(n._id, { read: true })));
    return null;
  },
});

/** Recipient-only soft delete — hides a notification from the owner's own
 * bell/list (same deletedAt/deletedBy fields and every-read-path exclusion
 * as the admin's deleteMessage below), while leaving the row intact for the
 * admin thread/audit trail. Blocked on an unresolved change-request — see
 * isDeletableByRecipient — so a user can't dismiss a "please fix this"
 * message before actually dealing with it. */
export const deleteMine = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const { userId } = await requireCurrentUser(ctx);
    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== userId) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Notification not found." });
    }
    if (notification.deletedAt) {
      return null;
    }

    const resolveCampaignStatus = campaignStatusResolver(ctx);
    const deletable = await isDeletableByRecipient(notification, resolveCampaignStatus);
    if (!deletable) {
      throw new ConvexError({
        code: "INVALID_STATE",
        message: "This can be dismissed once it's resolved.",
      });
    }

    await ctx.db.patch(args.notificationId, {
      deletedAt: Date.now(),
      deletedBy: userId,
    });
    return null;
  },
});

/** Feature 2 (+ campaign-review extension): admin -> single user. Broadcast/
 * segment sending is out of scope for this pass — a future version could add
 * a "recipients: Id<"users">[]" variant, but that's a bigger UX/rate-limit
 * decision left for later.
 *
 * relatedEntityType/Id/isEditRequest are only meaningful together, sent from
 * the campaign review screen — a plain admin_message (e.g. from
 * app/admin/messages.tsx) omits all three. Flagging isEditRequest on a
 * campaign still under review (status "pending") also moves it to
 * "changes_requested"; flagging one on any other status (e.g. an already-
 * active campaign) still sends the message and shows the Edit Campaign
 * button, it just doesn't touch status — un-publishing a live campaign as a
 * side effect of a chat message would be surprising. */
export const sendFromAdmin = mutation({
  args: {
    recipientUserId: v.id("users"),
    message: v.string(),
    relatedEntityType: v.optional(v.literal("campaign")),
    relatedEntityId: v.optional(v.string()),
    isEditRequest: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const validated = validateAdminMessageBody(args.message);
    if (!validated.valid) {
      throw new ConvexError({ code: "INVALID_INPUT", message: validated.message });
    }

    const recipient = await ctx.db.get(args.recipientUserId);
    if (!recipient) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Recipient not found." });
    }

    if (args.isEditRequest && args.relatedEntityType === "campaign" && args.relatedEntityId) {
      const campaign = await ctx.db
        .query("campaigns")
        .withIndex("by_slug", (q) => q.eq("slug", args.relatedEntityId!))
        .unique();
      if (campaign && campaign.status === "pending") {
        await ctx.db.patch(campaign._id, { status: "changes_requested" });
      }
    }

    const notificationId = await createNotification(ctx, {
      userId: args.recipientUserId,
      type: "admin_message",
      message: validated.message,
      senderId: adminUserId,
      relatedEntityType: args.relatedEntityType,
      relatedEntityId: args.relatedEntityId,
      isEditRequest: args.isEditRequest,
    });

    await logAdminAction(ctx, {
      adminUserId,
      action: "notification.sendFromAdmin",
      targetType: "user",
      targetId: args.recipientUserId,
    });

    return { notificationId };
  },
});

/** Merges the notifications-table thread (admin_message/campaign_edited,
 * soft-deleted rows excluded) with campaignReviewMessages — the separate,
 * system-generated record of reject/take-down reasons, which previously
 * never surfaced in this thread at all. Shared by listThreadWithUser and
 * listRecentConversations so both see the same complete history. */
async function resolveThreadItemsForUser(
  ctx: QueryCtx,
  userId: Id<"users">,
): Promise<ThreadItem[]> {
  const notifs = await ctx.db
    .query("notifications")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();
  const reviewNotes = (
    await ctx.db
      .query("campaignReviewMessages")
      .withIndex("by_student", (q) => q.eq("studentUserId", userId))
      .collect()
  ).filter((m) => !m.deletedAt);

  const senderCache = new Map<Id<"users">, { name: string; email: string }>();
  const resolveSender = async (senderId: Id<"users"> | undefined) => {
    if (!senderId) return { name: "Unknown", email: "" };
    const cached = senderCache.get(senderId);
    if (cached) return cached;
    const sender = await profileDisplayName(ctx, senderId);
    senderCache.set(senderId, sender);
    return sender;
  };
  const resolveCampaignTitle = await campaignTitleResolver(ctx);

  const messageItems: ThreadItem[] = await Promise.all(
    notifs
      .filter(
        (n) =>
          (n.type === "admin_message" || n.type === "campaign_edited") &&
          !n.deletedAt,
      )
      .map(async (n) => {
        const sender = await resolveSender(n.senderId);
        const relatedEntityTitle =
          n.relatedEntityType === "campaign" && n.relatedEntityId
            ? await resolveCampaignTitle(n.relatedEntityId)
            : null;
        return {
          id: n._id,
          kind: "message" as const,
          type: n.type,
          message: n.message,
          createdAt: n.createdAt,
          read: n.read,
          senderId: n.senderId,
          senderName: sender.name,
          relatedEntityType: n.relatedEntityType,
          relatedEntityId: n.relatedEntityId,
          relatedEntityTitle,
          isEditRequest: n.isEditRequest ?? false,
        };
      }),
  );

  const reviewItems: ThreadItem[] = await Promise.all(
    reviewNotes.map(async (m) => {
      const sender = await resolveSender(m.adminUserId);
      const relatedEntityTitle = await resolveCampaignTitle(m.campaignSlug);
      return {
        id: m._id,
        kind: "review_note" as const,
        type: "review_note",
        message: m.body,
        createdAt: m.createdAt,
        read: true,
        senderId: m.adminUserId,
        senderName: sender.name,
        relatedEntityType: "campaign" as const,
        relatedEntityId: m.campaignSlug,
        relatedEntityTitle,
        isEditRequest: false,
      };
    }),
  );

  return [...messageItems, ...reviewItems].sort(
    (a, b) => a.createdAt - b.createdAt,
  );
}

/** Full chronological admin<->user conversation — every admin_message (plus
 * campaign_edited system events so admins see when the owner responds, and
 * campaignReviewMessages moderation notes so the reject/take-down reason
 * shows up alongside everything else) with this user, regardless of which
 * admin sent it or which campaign (if any) prompted it. This is "the
 * thread", used both from the campaign review screen and the general admin
 * messages page, so there's exactly one conversation model instead of
 * per-campaign isolated comment boxes. */
export const listThreadWithUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const recipient = await profileDisplayName(ctx, args.userId);
    const items = await resolveThreadItemsForUser(ctx, args.userId);
    return { recipient, items };
  },
});

/** Landing view for app/admin/messages.tsx — one row per user an admin has
 * ever messaged (or who has edited a campaign / gotten a moderation note
 * since), most-recently-active first, so admins can find an existing
 * conversation — or notice a reply — without re-searching by name every
 * time. */
export const listRecentConversations = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const all = await ctx.db.query("notifications").collect();
    const reviewNotes = await ctx.db.query("campaignReviewMessages").collect();

    const latestByUser = new Map<
      Id<"users">,
      { message: string; createdAt: number; relatedEntityTitle: string | null }
    >();
    const resolveCampaignTitle = await campaignTitleResolver(ctx);

    for (const n of all) {
      if (
        (n.type !== "admin_message" && n.type !== "campaign_edited") ||
        n.deletedAt
      ) {
        continue;
      }
      const existing = latestByUser.get(n.userId);
      if (!existing || n.createdAt > existing.createdAt) {
        const relatedEntityTitle =
          n.relatedEntityType === "campaign" && n.relatedEntityId
            ? await resolveCampaignTitle(n.relatedEntityId)
            : null;
        latestByUser.set(n.userId, {
          message: n.message,
          createdAt: n.createdAt,
          relatedEntityTitle,
        });
      }
    }
    for (const m of reviewNotes) {
      if (m.deletedAt) continue;
      const existing = latestByUser.get(m.studentUserId);
      if (!existing || m.createdAt > existing.createdAt) {
        const relatedEntityTitle = await resolveCampaignTitle(m.campaignSlug);
        latestByUser.set(m.studentUserId, {
          message: m.body,
          createdAt: m.createdAt,
          relatedEntityTitle,
        });
      }
    }

    const conversations = await Promise.all(
      Array.from(latestByUser.entries()).map(async ([userId, last]) => {
        const recipient = await profileDisplayName(ctx, userId);
        return {
          userId,
          recipientName: recipient.name,
          recipientEmail: recipient.email,
          lastMessage: last.message,
          lastMessageAt: last.createdAt,
          lastMessageContext: last.relatedEntityTitle,
        };
      }),
    );

    return conversations.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  },
});

/** Admin-only soft delete — hides a chat message from every read path
 * (bell, thread, recent-conversations) while keeping the row itself for the
 * audit trail. Works on any admin_message regardless of who sent it, so it
 * covers both "sent by another admin" and "sent by the student" if/when a
 * student-reply path exists — today only admins can create admin_message
 * rows (see sendFromAdmin), but the mutation doesn't assume that. Does not
 * apply to campaignReviewMessages (the official moderation record), which
 * is intentionally not deletable from here. */
export const deleteMessage = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.type !== "admin_message") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Message not found.",
      });
    }
    if (notification.deletedAt) {
      return null;
    }

    await ctx.db.patch(args.notificationId, {
      deletedAt: Date.now(),
      deletedBy: adminUserId,
    });

    await logAdminAction(ctx, {
      adminUserId,
      action: "notification.deleteMessage",
      targetType: "notification",
      targetId: args.notificationId,
      metadata: JSON.stringify({
        recipientUserId: notification.userId,
        senderId: notification.senderId ?? null,
        message: notification.message.slice(0, 500),
      }),
    });

    return null;
  },
});
