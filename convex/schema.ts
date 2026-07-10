import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import {
  activityFields,
  campaignFields,
  communityFields,
  fundFields,
} from "./validators";

export default defineSchema({
  ...authTables,
  profiles: defineTable({
    userId: v.id("users"),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("admin")),
    emailVerifiedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),
  appRateLimits: defineTable({
    key: v.string(),
    attempts: v.number(),
    windowStart: v.number(),
    lockUntil: v.union(v.number(), v.null()),
  }).index("by_key", ["key"]),
  communities: defineTable(communityFields).index("by_slug", ["slug"]),
  campaigns: defineTable(campaignFields)
    .index("by_slug", ["slug"])
    .index("by_community", ["creator.communityId"]),
  communityFunds: defineTable(fundFields).index("by_slug", ["slug"]),
  activityItems: defineTable(activityFields).index("by_slug", ["slug"]),
  donations: defineTable({
    userId: v.id("users"),
    campaignId: v.id("campaigns"),
    amount: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
