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
    avatarStorageId: v.optional(v.id("_storage")),
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
  stripeCustomers: defineTable({
    userId: v.id("users"),
    stripeCustomerId: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_stripeCustomerId", ["stripeCustomerId"]),
  stripeWebhookEvents: defineTable({
    stripeEventId: v.string(),
    type: v.string(),
    processedAt: v.number(),
  }).index("by_stripeEventId", ["stripeEventId"]),
  recurringDonations: defineTable({
    userId: v.id("users"),
    campaignId: v.id("campaigns"),
    amount: v.number(),
    currency: v.string(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("past_due"),
      v.literal("canceled"),
    ),
    createdAt: v.number(),
    canceledAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_subscription", ["stripeSubscriptionId"]),
  donations: defineTable({
    userId: v.optional(v.id("users")),
    donorEmail: v.optional(v.string()),
    campaignId: v.id("campaigns"),
    amount: v.number(),
    currency: v.string(),
    type: v.union(v.literal("one_time"), v.literal("recurring")),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("succeeded"),
      v.literal("failed"),
    ),
    stripePaymentIntentId: v.optional(v.string()),
    stripeInvoiceId: v.optional(v.string()),
    recurringDonationId: v.optional(v.id("recurringDonations")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_paymentIntent", ["stripePaymentIntentId"])
    .index("by_invoice", ["stripeInvoiceId"]),
  /** Binds uploaded Convex files to the user who attached them. */
  storageOwners: defineTable({
    userId: v.id("users"),
    storageId: v.id("_storage"),
    createdAt: v.number(),
  })
    .index("by_storageId", ["storageId"])
    .index("by_user", ["userId"]),
  /** Admin review comments sent to campaign creators. */
  campaignReviewMessages: defineTable({
    campaignId: v.id("campaigns"),
    campaignSlug: v.string(),
    studentUserId: v.id("users"),
    adminUserId: v.id("users"),
    body: v.string(),
    createdAt: v.number(),
    emailSentAt: v.optional(v.number()),
  })
    .index("by_campaign", ["campaignId"])
    .index("by_student", ["studentUserId"])
    .index("by_slug", ["campaignSlug"]),
});
