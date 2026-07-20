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

function toNotification(n: Doc<"notifications">, relatedEntityTitle: string | null) {
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
    ).filter((n) => n.type !== "campaign_edited");

    let start = 0;
    if (args.cursor) {
      const idx = mine.findIndex((n) => n._id === args.cursor);
      start = idx >= 0 ? idx + 1 : 0;
    }

    const page = mine.slice(start, start + limit);
    const resolveCampaignTitle = await campaignTitleResolver(ctx);
    const items = await Promise.all(
      page.map(async (n) => {
        const title =
          n.relatedEntityType === "campaign" && n.relatedEntityId
            ? await resolveCampaignTitle(n.relatedEntityId)
            : null;
        return toNotification(n, title);
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
    return unread.length;
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

/** Full chronological admin<->user conversation — every admin_message (plus
 * campaign_edited system events, so admins can see when the owner responds)
 * with this user, regardless of which admin sent it or which campaign (if
 * any) prompted it. This is "the thread", used both from the campaign
 * review screen and the general admin messages page, so there's exactly one
 * conversation model instead of per-campaign isolated comment boxes. */
export const listThreadWithUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const messages = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    const thread = messages
      .filter((n) => n.type === "admin_message" || n.type === "campaign_edited")
      .sort((a, b) => a.createdAt - b.createdAt);

    const senderCache = new Map<Id<"users">, { name: string; email: string }>();
    const recipient = await profileDisplayName(ctx, args.userId);
    const resolveCampaignTitle = await campaignTitleResolver(ctx);

    const items = await Promise.all(
      thread.map(async (n) => {
        let sender = { name: "Unknown", email: "" };
        if (n.senderId) {
          const cached = senderCache.get(n.senderId);
          sender = cached ?? (await profileDisplayName(ctx, n.senderId));
          if (!cached) senderCache.set(n.senderId, sender);
        }
        const relatedEntityTitle =
          n.relatedEntityType === "campaign" && n.relatedEntityId
            ? await resolveCampaignTitle(n.relatedEntityId)
            : null;
        return {
          id: n._id,
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

    return { recipient, items };
  },
});

/** Landing view for app/admin/messages.tsx — one row per user an admin has
 * ever messaged (or who has edited a campaign since), most-recently-active
 * first, so admins can find an existing conversation — or notice a reply —
 * without re-searching by name every time. */
export const listRecentConversations = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const all = await ctx.db.query("notifications").collect();
    const adminMessages = all.filter(
      (n) => n.type === "admin_message" || n.type === "campaign_edited",
    );

    const latestByUser = new Map<Id<"users">, Doc<"notifications">>();
    for (const n of adminMessages) {
      const existing = latestByUser.get(n.userId);
      if (!existing || n.createdAt > existing.createdAt) {
        latestByUser.set(n.userId, n);
      }
    }

    const conversations = await Promise.all(
      Array.from(latestByUser.values()).map(async (n) => {
        const recipient = await profileDisplayName(ctx, n.userId);
        return {
          userId: n.userId,
          recipientName: recipient.name,
          recipientEmail: recipient.email,
          lastMessage: n.message,
          lastMessageAt: n.createdAt,
        };
      }),
    );

    return conversations.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  },
});
