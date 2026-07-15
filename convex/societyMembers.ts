import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import {
  requireSocietyLeader,
  requireVerifiedUser,
} from "./lib/authz";
import { toSocietyMembership } from "./lib/mappers";

export const requestJoin = mutation({
  args: { communitySlug: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const community = await ctx.db
      .query("communities")
      .withIndex("by_slug", (q) => q.eq("slug", args.communitySlug))
      .unique();

    const verified =
      community &&
      community.type === "society" &&
      (community.verificationStatus === "verified" ||
        (community.verificationStatus === undefined && community.verified));

    if (!verified) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Society not found.",
      });
    }

    const existing = await ctx.db
      .query("societyMembers")
      .withIndex("by_community_user", (q) =>
        q.eq("communitySlug", args.communitySlug).eq("userId", userId),
      )
      .unique();

    if (existing) {
      if (existing.status === "approved") {
        throw new ConvexError({
          code: "INVALID_INPUT",
          message: "You are already a member of this society.",
        });
      }
      if (existing.status === "pending") {
        throw new ConvexError({
          code: "INVALID_INPUT",
          message: "Your join request is already pending.",
        });
      }
      await ctx.db.patch(existing._id, {
        role: "member",
        status: "pending",
        createdAt: Date.now(),
        reviewedAt: undefined,
        reviewedBy: undefined,
      });
      return { membershipId: existing._id };
    }

    const membershipId = await ctx.db.insert("societyMembers", {
      communitySlug: args.communitySlug,
      userId,
      role: "member",
      status: "pending",
      createdAt: Date.now(),
    });

    const leaders = await ctx.db
      .query("societyMembers")
      .withIndex("by_community_status", (q) =>
        q.eq("communitySlug", args.communitySlug).eq("status", "approved"),
      )
      .collect();
    const requesterProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    for (const leader of leaders.filter((m) => m.role === "leader")) {
      const leaderProfile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", leader.userId))
        .unique();
      if (leaderProfile?.email) {
        await ctx.scheduler.runAfter(0, internal.emails.sendSocietyJoinRequest, {
          leaderEmail: leaderProfile.email,
          societyName: community!.name,
          studentName: requesterProfile?.name ?? "A student",
          studentEmail: requesterProfile?.email ?? "",
        });
      }
    }

    return { membershipId };
  },
});

export const listPendingForLeader = query({
  args: { communitySlug: v.string() },
  handler: async (ctx, args) => {
    await requireSocietyLeader(ctx, args.communitySlug);
    const pending = await ctx.db
      .query("societyMembers")
      .withIndex("by_community_status", (q) =>
        q.eq("communitySlug", args.communitySlug).eq("status", "pending"),
      )
      .collect();

    const results = [];
    for (const member of pending) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", member.userId))
        .unique();
      const user = await ctx.db.get(member.userId);
      results.push({
        ...toSocietyMembership(member),
        name: profile?.name ?? user?.name ?? "Student",
        email: profile?.email ?? user?.email ?? "",
      });
    }
    return results.sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const listBySociety = query({
  args: { communitySlug: v.string() },
  handler: async (ctx, args) => {
    await requireSocietyLeader(ctx, args.communitySlug);
    const members = await ctx.db
      .query("societyMembers")
      .withIndex("by_community_status", (q) =>
        q.eq("communitySlug", args.communitySlug).eq("status", "approved"),
      )
      .collect();

    const results = [];
    for (const member of members) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", member.userId))
        .unique();
      const user = await ctx.db.get(member.userId);
      results.push({
        ...toSocietyMembership(member),
        name: profile?.name ?? user?.name ?? "Student",
        email: profile?.email ?? user?.email ?? "",
      });
    }
    return results.sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const approve = mutation({
  args: { membershipId: v.id("societyMembers") },
  handler: async (ctx, args) => {
    const membership = await ctx.db.get(args.membershipId);
    if (!membership || membership.status !== "pending") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending join request not found.",
      });
    }
    const { userId: leaderUserId } = await requireSocietyLeader(
      ctx,
      membership.communitySlug,
    );
    await ctx.db.patch(membership._id, {
      status: "approved",
      role: "member",
      reviewedAt: Date.now(),
      reviewedBy: leaderUserId,
    });

    const community = await ctx.db
      .query("communities")
      .withIndex("by_slug", (q) => q.eq("slug", membership.communitySlug))
      .unique();
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", membership.userId))
      .unique();
    if (profile?.email && community) {
      await ctx.scheduler.runAfter(0, internal.emails.sendSocietyJoinApproved, {
        email: profile.email,
        name: profile.name ?? "there",
        societyName: community.name,
      });
    }

    return null;
  },
});

export const reject = mutation({
  args: { membershipId: v.id("societyMembers") },
  handler: async (ctx, args) => {
    const membership = await ctx.db.get(args.membershipId);
    if (!membership || membership.status !== "pending") {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Pending join request not found.",
      });
    }
    const { userId: leaderUserId } = await requireSocietyLeader(
      ctx,
      membership.communitySlug,
    );
    await ctx.db.patch(membership._id, {
      status: "rejected",
      reviewedAt: Date.now(),
      reviewedBy: leaderUserId,
    });
    return null;
  },
});

export const listMyLeaderSocieties = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireVerifiedUser(ctx);
    const memberships = await ctx.db
      .query("societyMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const results = [];
    for (const membership of memberships.filter(
      (m) => m.status === "approved" && m.role === "leader",
    )) {
      const community = await ctx.db
        .query("communities")
        .withIndex("by_slug", (q) => q.eq("slug", membership.communitySlug))
        .unique();
      if (community) {
        results.push({
          ...toSocietyMembership(membership),
          societyName: community.name,
        });
      }
    }
    return results;
  },
});

export const promoteToLeader = mutation({
  args: { membershipId: v.id("societyMembers") },
  handler: async (ctx, args) => {
    const membership = await ctx.db.get(args.membershipId);
    if (!membership || membership.status !== "approved") {
      throw new ConvexError({ code: "NOT_FOUND", message: "Member not found." });
    }
    await requireSocietyLeader(ctx, membership.communitySlug);
    await ctx.db.patch(membership._id, { role: "leader" });
    return null;
  },
});

export const demoteToMember = mutation({
  args: { membershipId: v.id("societyMembers") },
  handler: async (ctx, args) => {
    const membership = await ctx.db.get(args.membershipId);
    if (!membership || membership.status !== "approved") {
      throw new ConvexError({ code: "NOT_FOUND", message: "Member not found." });
    }
    await requireSocietyLeader(ctx, membership.communitySlug);
    await ctx.db.patch(membership._id, { role: "member" });
    return null;
  },
});

export const removeMember = mutation({
  args: { membershipId: v.id("societyMembers") },
  handler: async (ctx, args) => {
    const membership = await ctx.db.get(args.membershipId);
    if (!membership) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Member not found." });
    }
    await requireSocietyLeader(ctx, membership.communitySlug);
    await ctx.db.delete(membership._id);
    return null;
  },
});

export const leaveSociety = mutation({
  args: { communitySlug: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await requireVerifiedUser(ctx);
    const membership = await ctx.db
      .query("societyMembers")
      .withIndex("by_community_user", (q) =>
        q.eq("communitySlug", args.communitySlug).eq("userId", userId),
      )
      .unique();
    if (!membership) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Membership not found." });
    }
    if (membership.role === "leader") {
      const leaders = await ctx.db
        .query("societyMembers")
        .withIndex("by_community_status", (q) =>
          q.eq("communitySlug", args.communitySlug).eq("status", "approved"),
        )
        .collect();
      const leaderCount = leaders.filter((m) => m.role === "leader").length;
      if (leaderCount <= 1) {
        throw new ConvexError({
          code: "INVALID_STATE",
          message: "Transfer leadership before leaving.",
        });
      }
    }
    await ctx.db.delete(membership._id);
    return null;
  },
});

export const transferLeadership = mutation({
  args: {
    communitySlug: v.string(),
    targetMembershipId: v.id("societyMembers"),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireSocietyLeader(ctx, args.communitySlug);
    const target = await ctx.db.get(args.targetMembershipId);
    if (
      !target ||
      target.communitySlug !== args.communitySlug ||
      target.status !== "approved"
    ) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Target member not found." });
    }

    const myMembership = await ctx.db
      .query("societyMembers")
      .withIndex("by_community_user", (q) =>
        q.eq("communitySlug", args.communitySlug).eq("userId", userId),
      )
      .unique();

    await ctx.db.patch(target._id, { role: "leader" });
    if (myMembership) {
      await ctx.db.patch(myMembership._id, { role: "member" });
    }
    return null;
  },
});
