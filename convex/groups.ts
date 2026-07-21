import { ConvexError, v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getProfileByUserId, requireAdmin } from "./lib/authz";
import { logAdminAction } from "./adminAudit";
import { createNotification, validateAdminMessageBody } from "./lib/notifications";

const MAX_GROUP_NAME_LENGTH = 120;

/** The four "automatic" groups have no table of their own — membership is
 * derived live from profiles/societyMembers/campaigns/societies below, so
 * they stay in sync as societies/leaders/campaigns/admins change. Only
 * "custom" groups are backed by real rows (userGroups/userGroupMembers). */
const groupRefValidator = v.union(
  v.object({ kind: v.literal("admins") }),
  v.object({ kind: v.literal("campaign_creators") }),
  v.object({ kind: v.literal("society_leaders") }),
  v.object({ kind: v.literal("society"), slug: v.string() }),
  v.object({ kind: v.literal("custom"), groupId: v.id("userGroups") }),
);

type GroupRef =
  | { kind: "admins" }
  | { kind: "campaign_creators" }
  | { kind: "society_leaders" }
  | { kind: "society"; slug: string }
  | { kind: "custom"; groupId: Id<"userGroups"> };

function groupRefKey(ref: GroupRef): string {
  switch (ref.kind) {
    case "admins":
      return "admins";
    case "campaign_creators":
      return "campaign_creators";
    case "society_leaders":
      return "society_leaders";
    case "society":
      return `society:${ref.slug}`;
    case "custom":
      return `custom:${ref.groupId}`;
  }
}

/** Null means the group doesn't exist (deleted custom group, unknown/
 * inactive society slug) — callers turn that into a NOT_FOUND. */
async function resolveGroupName(ctx: QueryCtx, ref: GroupRef): Promise<string | null> {
  switch (ref.kind) {
    case "admins":
      return "Admins";
    case "campaign_creators":
      return "Campaign creators";
    case "society_leaders":
      return "Society leaders";
    case "society": {
      const society = await ctx.db
        .query("societies")
        .withIndex("by_slug", (q) => q.eq("slug", ref.slug))
        .unique();
      if (!society || society.status !== "active") return null;
      return society.name;
    }
    case "custom": {
      const group = await ctx.db.get(ref.groupId);
      return group ? group.name : null;
    }
  }
}

/** Live membership for a group — this is what keeps the automatic groups in
 * sync without a duplicated/maintained list: it re-derives from the same
 * tables the rest of the app already treats as the source of truth
 * (societies.status, societyMembers.status/role, campaigns.createdBy,
 * profiles.role). */
async function resolveMemberIds(ctx: QueryCtx, ref: GroupRef): Promise<Id<"users">[]> {
  switch (ref.kind) {
    case "admins": {
      const admins = await ctx.db
        .query("profiles")
        .withIndex("by_role", (q) => q.eq("role", "admin"))
        .collect();
      return admins.map((p) => p.userId);
    }
    case "campaign_creators": {
      const campaigns = await ctx.db.query("campaigns").collect();
      const ids = new Set<Id<"users">>();
      for (const campaign of campaigns) {
        if (campaign.createdBy) ids.add(campaign.createdBy);
      }
      return Array.from(ids);
    }
    case "society_leaders": {
      const activeSocieties = await ctx.db
        .query("societies")
        .withIndex("by_status", (q) => q.eq("status", "active"))
        .collect();
      const ids = new Set<Id<"users">>();
      for (const society of activeSocieties) {
        const members = await ctx.db
          .query("societyMembers")
          .withIndex("by_community_status", (q) =>
            q.eq("communitySlug", society.slug).eq("status", "approved"),
          )
          .collect();
        for (const member of members) {
          if (member.role === "leader") ids.add(member.userId);
        }
      }
      return Array.from(ids);
    }
    case "society": {
      const society = await ctx.db
        .query("societies")
        .withIndex("by_slug", (q) => q.eq("slug", ref.slug))
        .unique();
      if (!society || society.status !== "active") return [];
      const members = await ctx.db
        .query("societyMembers")
        .withIndex("by_community_status", (q) =>
          q.eq("communitySlug", ref.slug).eq("status", "approved"),
        )
        .collect();
      return members.map((m) => m.userId);
    }
    case "custom": {
      const members = await ctx.db
        .query("userGroupMembers")
        .withIndex("by_group", (q) => q.eq("groupId", ref.groupId))
        .collect();
      return members.map((m) => m.userId);
    }
  }
}

async function memberViews(ctx: QueryCtx, userIds: Id<"users">[]) {
  const unique = Array.from(new Set(userIds));
  const views = await Promise.all(
    unique.map(async (userId) => {
      const profile = await getProfileByUserId(ctx, userId);
      return {
        userId,
        name: profile?.name ?? profile?.email ?? "Unknown",
        email: profile?.email ?? "",
      };
    }),
  );
  return views.sort((a, b) => a.name.localeCompare(b.name));
}

/** Overview for the Groups landing page — every automatic group (admins,
 * society leaders, campaign creators, one per active society) plus every
 * custom group, each with a live member count. */
export const listOverview = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const groups: {
      ref: GroupRef;
      name: string;
      memberCount: number;
      kind: "automatic" | "society" | "custom";
    }[] = [];

    for (const ref of [
      { kind: "admins" as const },
      { kind: "society_leaders" as const },
      { kind: "campaign_creators" as const },
    ]) {
      const memberIds = await resolveMemberIds(ctx, ref);
      const name = await resolveGroupName(ctx, ref);
      groups.push({ ref, name: name!, memberCount: memberIds.length, kind: "automatic" });
    }

    const activeSocieties = await ctx.db
      .query("societies")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
    for (const society of activeSocieties) {
      const ref: GroupRef = { kind: "society", slug: society.slug };
      const memberIds = await resolveMemberIds(ctx, ref);
      groups.push({ ref, name: society.name, memberCount: memberIds.length, kind: "society" });
    }

    const customGroups = await ctx.db.query("userGroups").collect();
    for (const group of customGroups) {
      const ref: GroupRef = { kind: "custom", groupId: group._id };
      const memberIds = await resolveMemberIds(ctx, ref);
      groups.push({ ref, name: group.name, memberCount: memberIds.length, kind: "custom" });
    }

    return groups;
  },
});

export const listMembers = query({
  args: { groupRef: groupRefValidator },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const name = await resolveGroupName(ctx, args.groupRef);
    if (name === null) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Group not found." });
    }
    const userIds = await resolveMemberIds(ctx, args.groupRef);
    const members = await memberViews(ctx, userIds);
    return { name, members };
  },
});

export const createCustomGroup = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const name = args.name.trim();
    if (!name || name.length > MAX_GROUP_NAME_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: `Group name is required and must be at most ${MAX_GROUP_NAME_LENGTH} characters.`,
      });
    }

    const groupId = await ctx.db.insert("userGroups", {
      name,
      createdBy: adminUserId,
      createdAt: Date.now(),
    });

    await logAdminAction(ctx, {
      adminUserId,
      action: "group.create",
      targetType: "userGroup",
      targetId: groupId,
    });

    return { groupId };
  },
});

export const deleteCustomGroup = mutation({
  args: { groupId: v.id("userGroups") },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Group not found." });
    }

    const members = await ctx.db
      .query("userGroupMembers")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();
    for (const member of members) {
      await ctx.db.delete(member._id);
    }
    await ctx.db.delete(args.groupId);

    await logAdminAction(ctx, {
      adminUserId,
      action: "group.delete",
      targetType: "userGroup",
      targetId: args.groupId,
      metadata: JSON.stringify({ name: group.name, memberCount: members.length }),
    });

    return null;
  },
});

export const addCustomGroupMember = mutation({
  args: { groupId: v.id("userGroups"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Group not found." });
    }
    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new ConvexError({ code: "NOT_FOUND", message: "User not found." });
    }

    const existing = await ctx.db
      .query("userGroupMembers")
      .withIndex("by_group_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", args.userId),
      )
      .unique();
    if (existing) return null;

    await ctx.db.insert("userGroupMembers", {
      groupId: args.groupId,
      userId: args.userId,
      addedAt: Date.now(),
      addedBy: adminUserId,
    });
    return null;
  },
});

export const removeCustomGroupMember = mutation({
  args: { groupId: v.id("userGroups"), userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("userGroupMembers")
      .withIndex("by_group_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", args.userId),
      )
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
    return null;
  },
});

/** Sends to every current member of the group at time of sending — resolved
 * server-side from the same live derivation as listMembers, never from a
 * client-supplied recipient list. Reuses the existing admin_message
 * notification path (convex/lib/notifications.ts createNotification) so
 * recipients see it in their normal bell/thread, one notification row per
 * recipient, no new delivery mechanism. */
export const sendBroadcast = mutation({
  args: { groupRef: groupRefValidator, message: v.string() },
  handler: async (ctx, args) => {
    const { userId: adminUserId } = await requireAdmin(ctx);
    const validated = validateAdminMessageBody(args.message);
    if (!validated.valid) {
      throw new ConvexError({ code: "INVALID_INPUT", message: validated.message });
    }

    const name = await resolveGroupName(ctx, args.groupRef);
    if (name === null) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Group not found." });
    }

    const userIds = Array.from(new Set(await resolveMemberIds(ctx, args.groupRef)));
    for (const userId of userIds) {
      await createNotification(ctx, {
        userId,
        type: "admin_message",
        message: validated.message,
        senderId: adminUserId,
        isBroadcast: true,
      });
    }

    await logAdminAction(ctx, {
      adminUserId,
      action: "group.broadcast",
      targetType: "userGroup",
      targetId: groupRefKey(args.groupRef),
      metadata: JSON.stringify({ groupName: name, recipientCount: userIds.length }),
    });

    return { recipientCount: userIds.length };
  },
});
