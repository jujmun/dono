import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import {
  activityFields,
  campaignFields,
  communityFields,
  fundFields,
  societyFields,
  societyMemberFields,
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
  communities: defineTable(communityFields)
    .index("by_slug", ["slug"])
    .index("by_verificationStatus", ["verificationStatus"])
    .index("by_type", ["type"])
    .index("by_createdBy", ["createdBy"]),
  societyMembers: defineTable(societyMemberFields)
    .index("by_community", ["communitySlug"])
    .index("by_user", ["userId"])
    .index("by_community_user", ["communitySlug", "userId"])
    .index("by_community_status", ["communitySlug", "status"]),
  /** New user-facing "Create Society" submissions — distinct from the legacy
   * `communities` catalog (which also has a type: "society" entry) and from
   * `societyMembers` (leadership/membership on those catalog entries). */
  societies: defineTable(societyFields)
    .index("by_slug", ["slug"])
    .index("by_creatorId", ["creatorId"])
    .index("by_status", ["status"])
    .index("by_stripeVerificationSessionId", ["stripeVerificationSessionId"]),
  campaigns: defineTable(campaignFields)
    .index("by_slug", ["slug"])
    .index("by_community", ["creator.communityId"])
    .index("by_society_approval", ["societyApprovalStatus"])
    .index("by_status", ["status"])
    .index("by_createdBy", ["createdBy"]),
  campaignFollows: defineTable({
    userId: v.id("users"),
    campaignSlug: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_campaign_user", ["campaignSlug", "userId"]),
  campaignLikes: defineTable({
    userId: v.id("users"),
    campaignSlug: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_campaign_user", ["campaignSlug", "userId"]),
  communityFollows: defineTable({
    userId: v.id("users"),
    communitySlug: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_community_user", ["communitySlug", "userId"]),
  campaignComments: defineTable({
    campaignSlug: v.string(),
    userId: v.id("users"),
    body: v.string(),
    createdAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_campaign", ["campaignSlug"])
    .index("by_user", ["userId"]),
  communityFunds: defineTable(fundFields).index("by_slug", ["slug"]),
  activityItems: defineTable(activityFields)
    .index("by_slug", ["slug"])
    .index("by_createdAt", ["timestamp"]),
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
    campaignId: v.optional(v.id("campaigns")),
    fundId: v.optional(v.id("communityFunds")),
    amount: v.number(),
    currency: v.string(),
    type: v.union(v.literal("one_time"), v.literal("recurring")),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("succeeded"),
      v.literal("failed"),
      v.literal("refunded"),
    ),
    stripePaymentIntentId: v.optional(v.string()),
    stripeInvoiceId: v.optional(v.string()),
    recurringDonationId: v.optional(v.id("recurringDonations")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_paymentIntent", ["stripePaymentIntentId"])
    .index("by_invoice", ["stripeInvoiceId"])
    .index("by_donorEmail", ["donorEmail"])
    .index("by_fund", ["fundId"]),
  fundAllocations: defineTable({
    fundId: v.id("communityFunds"),
    donationId: v.id("donations"),
    campaignId: v.id("campaigns"),
    amount: v.number(),
    createdAt: v.number(),
  })
    .index("by_donation", ["donationId"])
    .index("by_fund", ["fundId"]),
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
  adminAuditLog: defineTable({
    adminUserId: v.id("users"),
    action: v.string(),
    targetType: v.string(),
    targetId: v.string(),
    metadata: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_admin", ["adminUserId"]),
  stripeConnectAccounts: defineTable({
    userId: v.id("users"),
    communitySlug: v.optional(v.string()),
    stripeAccountId: v.string(),
    onboardingComplete: v.boolean(),
    chargesEnabled: v.boolean(),
    payoutsEnabled: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_stripeAccountId", ["stripeAccountId"])
    .index("by_community", ["communitySlug"]),
  campaignPayouts: defineTable({
    campaignId: v.id("campaigns"),
    stripeConnectAccountId: v.id("stripeConnectAccounts"),
    amount: v.number(),
    currency: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("transferred"),
      v.literal("failed"),
    ),
    stripeTransferId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_campaign", ["campaignId"]),
});
