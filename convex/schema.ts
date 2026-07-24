import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import {
  activityFields,
  campaignFields,
  communityFields,
  fundFields,
  notificationFields,
  societyFields,
  societyMemberFields,
} from "./validators";

export default defineSchema({
  ...authTables,
  profiles: defineTable({
    userId: v.id("users"),
    email: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    college: v.optional(v.string()),
    degree: v.optional(v.string()),
    yearInCollege: v.optional(v.string()),
    /** ISO date YYYY-MM-DD — required for 18+ eligibility under the T&Cs. */
    dateOfBirth: v.optional(v.string()),
    ageAttestedAt: v.optional(v.number()),
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
  legalAcceptances: defineTable({
    userId: v.optional(v.id("users")),
    guestKey: v.optional(v.string()),
    documentId: v.string(),
    version: v.string(),
    context: v.union(
      v.literal("signup"),
      v.literal("create_campaign"),
      v.literal("create_society"),
      v.literal("donate"),
    ),
    acceptedAt: v.number(),
  })
    .index("by_user_document", ["userId", "documentId"])
    .index("by_guest_document", ["guestKey", "documentId"])
    .index("by_user", ["userId"]),
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
    .index("by_createdBy", ["createdBy"])
    .index("by_stripeVerificationSessionId", ["stripeVerificationSessionId"]),
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
    editedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    /** Hidden from public display by campaign owner; body retained for audit. */
    hiddenByOwnerAt: v.optional(v.number()),
    hiddenByOwnerUserId: v.optional(v.id("users")),
    restoredByAdminAt: v.optional(v.number()),
  })
    .index("by_campaign", ["campaignSlug"])
    .index("by_user", ["userId"]),
  contentReports: defineTable({
    reporterUserId: v.id("users"),
    targetType: v.union(v.literal("comment"), v.literal("campaign")),
    campaignSlug: v.optional(v.string()),
    commentId: v.optional(v.id("campaignComments")),
    reason: v.string(),
    status: v.union(
      v.literal("open"),
      v.literal("resolved"),
      v.literal("dismissed"),
    ),
    createdAt: v.number(),
    resolvedAt: v.optional(v.number()),
    resolvedBy: v.optional(v.id("users")),
    resolutionNote: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_reporter", ["reporterUserId"])
    .index("by_campaign", ["campaignSlug"]),
  refundRequests: defineTable({
    donationId: v.id("donations"),
    requesterUserId: v.optional(v.id("users")),
    requesterEmail: v.optional(v.string()),
    campaignId: v.id("campaigns"),
    grounds: v.string(),
    details: v.string(),
    status: v.union(
      v.literal("pending_owner"),
      v.literal("pending_admin"),
      v.literal("approved"),
      v.literal("denied"),
      v.literal("appealed"),
      v.literal("refunded"),
      v.literal("failed"),
    ),
    isFraudClaim: v.boolean(),
    ownerResponse: v.optional(v.string()),
    ownerRespondedAt: v.optional(v.number()),
    adminDecisionNote: v.optional(v.string()),
    adminDecidedAt: v.optional(v.number()),
    adminDecidedBy: v.optional(v.id("users")),
    appealNote: v.optional(v.string()),
    appealedAt: v.optional(v.number()),
    stripeRefundId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_donation", ["donationId"])
    .index("by_campaign", ["campaignId"])
    .index("by_status", ["status"])
    .index("by_requester", ["requesterUserId"]),
  campaignEvidence: defineTable({
    campaignId: v.id("campaigns"),
    uploadedBy: v.id("users"),
    storageId: v.id("_storage"),
    description: v.string(),
    expenditureDate: v.string(),
    dueAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_campaign", ["campaignId"])
    .index("by_uploader", ["uploadedBy"]),
  materialChangeRequests: defineTable({
    campaignId: v.id("campaigns"),
    requestedBy: v.id("users"),
    explanation: v.string(),
    evidenceNote: v.optional(v.string()),
    proposedOwnershipStatement: v.optional(v.string()),
    proposedUpdateSchedule: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
    ),
    createdAt: v.number(),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.id("users")),
    reviewNote: v.optional(v.string()),
  })
    .index("by_campaign", ["campaignId"])
    .index("by_status", ["status"]),
  communityFunds: defineTable(fundFields).index("by_slug", ["slug"]),
  activityItems: defineTable(activityFields)
    .index("by_slug", ["slug"])
    .index("by_createdAt", ["timestamp"]),
  notifications: defineTable(notificationFields)
    .index("by_user", ["userId"])
    .index("by_user_read", ["userId", "read"]),
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
    .index("by_subscription", ["stripeSubscriptionId"])
    .index("by_campaign", ["campaignId"]),
  donations: defineTable({
    userId: v.optional(v.id("users")),
    donorEmail: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
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
      v.literal("partially_refunded"),
    ),
    stripePaymentIntentId: v.optional(v.string()),
    stripeConnectedAccountId: v.optional(v.string()),
    stripeChargeId: v.optional(v.string()),
    grossAmountMinor: v.optional(v.number()),
    applicationFeeAmountMinor: v.optional(v.number()),
    applicationFeeRefundedMinor: v.optional(v.number()),
    refundedAmountMinor: v.optional(v.number()),
    disputeStatus: v.optional(
      v.union(
        v.literal("open"),
        v.literal("won"),
        v.literal("lost"),
      ),
    ),
    stripeInvoiceId: v.optional(v.string()),
    recurringDonationId: v.optional(v.id("recurringDonations")),
    coverFees: v.optional(v.boolean()),
    intendedCampaignAmountMinor: v.optional(v.number()),
    estimatedStripeFeeMinor: v.optional(v.number()),
    ageAttested: v.optional(v.boolean()),
    legalAcceptedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_paymentIntent", ["stripePaymentIntentId"])
    .index("by_invoice", ["stripeInvoiceId"])
    .index("by_donorEmail", ["donorEmail"])
    .index("by_fund", ["fundId"])
    .index("by_campaign", ["campaignId"]),
  fundAllocations: defineTable({
    fundId: v.id("communityFunds"),
    donationId: v.id("donations"),
    campaignId: v.id("campaigns"),
    amount: v.number(),
    createdAt: v.number(),
  })
    .index("by_donation", ["donationId"])
    .index("by_fund", ["fundId"])
    .index("by_campaign", ["campaignId"]),
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
    /** Soft delete — same pattern as notifications.deletedAt. Filtered out
     * of the student's own "Review feedback" list and the merged admin
     * thread; the row itself is kept for the audit trail. */
    deletedAt: v.optional(v.number()),
    deletedBy: v.optional(v.id("users")),
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
    accountVersion: v.optional(v.union(v.literal("v1"), v.literal("v2"))),
    onboardingComplete: v.boolean(),
    /** Legacy v1 field; mirrors cardPaymentsActive for older rows. */
    chargesEnabled: v.boolean(),
    cardPaymentsActive: v.optional(v.boolean()),
    cardPaymentsStatus: v.optional(v.string()),
    payoutsEnabled: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_stripeAccountId", ["stripeAccountId"])
    .index("by_community", ["communitySlug"]),
  /** Admin-managed custom messaging group — see convex/groups.ts. The four
   * "automatic" groups (admins, society leaders, campaign creators, one per
   * active society) have no table of their own — their membership is derived
   * live from profiles/societyMembers/campaigns/societies. */
  userGroups: defineTable({
    name: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_createdBy", ["createdBy"]),
  userGroupMembers: defineTable({
    groupId: v.id("userGroups"),
    userId: v.id("users"),
    addedAt: v.number(),
    addedBy: v.id("users"),
  })
    .index("by_group", ["groupId"])
    .index("by_group_user", ["groupId", "userId"])
    .index("by_user", ["userId"]),
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
