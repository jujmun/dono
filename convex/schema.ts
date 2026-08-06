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
    /**
     * Audience chosen at signup — orthogonal to admin `role`.
     * Server-enforced; never trust client-only for permissions.
     */
    userType: v.optional(v.union(v.literal("student"), v.literal("alumni"))),
    /** Alumni matriculation / graduation year (e.g. "2019"). */
    matriculationYear: v.optional(v.string()),
    /** Society slugs the alumni marked interest in during onboarding. */
    interestedSocietySlugs: v.optional(v.array(v.string())),
    /** ISO date YYYY-MM-DD — required for 18+ eligibility under the T&Cs. */
    dateOfBirth: v.optional(v.string()),
    ageAttestedAt: v.optional(v.number()),
    /** Set when the user explicitly skips profile setup — bypasses the
     * forced /onboarding redirect in app/_layout.tsx until they revisit it. */
    onboardingSkippedAt: v.optional(v.number()),
    avatarUrl: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
    role: v.union(v.literal("user"), v.literal("admin")),
    emailVerifiedAt: v.optional(v.number()),
    /** Set by users.requestAccountDeletion. The row is kept as a tombstone so
     * historical donations/comments still resolve to "Deleted User" — never
     * patch a tombstoned profile back to a live one. */
    deletedAt: v.optional(v.number()),
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
  /** One row per posted update. One-to-many by design (a campaign can only
   * post one today — no timeline UI yet) so recurring updates later don't
   * need a schema migration. */
  campaignUpdates: defineTable({
    campaignId: v.id("campaigns"),
    mediaUrls: v.array(v.string()),
    headline: v.string(),
    body: v.string(),
    amountSpent: v.number(),
    /** Snapshot of campaigns.raised at posting time — donations may keep
     * coming in after this, so the live campaign total isn't read later. */
    amountRaised: v.number(),
    /** Required only when amountSpent < amountRaised at posting time. */
    reconciliationNote: v.optional(v.string()),
    postedByUserId: v.id("users"),
    postedByRole: v.literal("leader"),
    createdAt: v.number(),
  }).index("by_campaign", ["campaignId"]),
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
  /** Post-approval campaign content edits — live row stays unchanged until admin approves. */
  campaignEditRequests: defineTable({
    campaignId: v.id("campaigns"),
    requestedBy: v.id("users"),
    proposed: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      story: v.optional(v.string()),
      category: v.optional(v.string()),
      goal: v.optional(v.number()),
      template: v.optional(v.string()),
      additionalNotes: v.optional(v.string()),
      expectedExpenditureDate: v.optional(v.string()),
      plannedUpdateSchedule: v.optional(v.string()),
      ownershipStatement: v.optional(v.string()),
      videoUrl: v.optional(v.string()),
      impactItems: v.optional(v.array(v.string())),
    }),
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
  /** Post-approval society/college profile edits — live + communities stay until approved. */
  societyEditRequests: defineTable({
    societyId: v.id("societies"),
    requestedBy: v.id("users"),
    proposed: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      story: v.optional(v.string()),
      websiteUrl: v.optional(v.string()),
      secondaryLink: v.optional(v.string()),
      socialUrl: v.optional(v.string()),
      coverImageStorageId: v.optional(v.id("_storage")),
    }),
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
    .index("by_society", ["societyId"])
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
  /** Legacy campaign-level recurring donations — creation removed, kept for
   * historical reporting and so the cancellation migration/webhooks still
   * resolve existing rows. See convex/societySubscriptions.ts for the
   * society-level replacement. */
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
  /** Society-level recurring subscriptions. Each successful invoice is split
   * across the society's currently-active campaigns at charge time — see
   * societySubscriptionPayments for the per-invoice split record. */
  societySubscriptions: defineTable({
    userId: v.id("users"),
    communitySlug: v.string(),
    amount: v.number(),
    currency: v.string(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("past_due"),
      v.literal("canceled"),
    ),
    /** Set when Dono canceled this on the donor's behalf rather than the
     * donor requesting it themselves — surfaced in the cancellation email. */
    canceledReason: v.optional(
      v.union(v.literal("user_requested"), v.literal("no_active_campaigns")),
    ),
    createdAt: v.number(),
    canceledAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_subscription", ["stripeSubscriptionId"])
    .index("by_community", ["communitySlug"]),
  /** One row per successfully split invoice — doubles as the idempotency
   * guard for webhook retries and the audit record of how a society
   * subscription payment was divided across campaigns (or refunded, if the
   * society had no active campaigns at charge time). */
  societySubscriptionPayments: defineTable({
    societySubscriptionId: v.id("societySubscriptions"),
    stripeInvoiceId: v.string(),
    totalAmountMinor: v.number(),
    campaignCount: v.number(),
    refunded: v.optional(v.boolean()),
    stripeRefundId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_invoice", ["stripeInvoiceId"])
    .index("by_societySubscription", ["societySubscriptionId"]),
  /** Admin-configured match windows. Match credit is a commitment tracker —
   * it does not inflate campaigns.raised or move Stripe funds. */
  campaignMatchWindows: defineTable({
    campaignId: v.id("campaigns"),
    multiplier: v.number(),
    budgetPounds: v.number(),
    consumedPounds: v.number(),
    sponsorLabel: v.string(),
    startsAt: v.number(),
    endsAt: v.number(),
    active: v.boolean(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_campaign", ["campaignId"])
    .index("by_active", ["active"]),
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
    /** Set on rows created by the society-subscription fan-out — the
     * campaign's share of one invoice.paid split. */
    societySubscriptionId: v.optional(v.id("societySubscriptions")),
    societySubscriptionPaymentId: v.optional(v.id("societySubscriptionPayments")),
    coverFees: v.optional(v.boolean()),
    intendedCampaignAmountMinor: v.optional(v.number()),
    estimatedStripeFeeMinor: v.optional(v.number()),
    matchedAmountPounds: v.optional(v.number()),
    matchWindowId: v.optional(v.id("campaignMatchWindows")),
    ageAttested: v.optional(v.boolean()),
    ageAttestedAt: v.optional(v.number()),
    legalAcceptedAt: v.optional(v.number()),
    emailUpdatesOptIn: v.optional(v.boolean()),
    emailUpdatesOptInAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_paymentIntent", ["stripePaymentIntentId"])
    .index("by_invoice", ["stripeInvoiceId"])
    .index("by_donorEmail", ["donorEmail"])
    .index("by_fund", ["fundId"])
    .index("by_campaign", ["campaignId"]),
  /** Per-campaign email-update subscriptions captured from the donation
   * thank-you step. Only opted-in rows are stored — a donor's decision not
   * to opt in lives solely on the donation row (see `donations.emailUpdatesOptIn`). */
  campaignUpdateOptIns: defineTable({
    campaignId: v.id("campaigns"),
    donationId: v.id("donations"),
    userId: v.optional(v.id("users")),
    donorEmail: v.optional(v.string()),
    createdAt: v.number(),
    unsubscribedAt: v.optional(v.number()),
  })
    .index("by_campaign", ["campaignId"])
    .index("by_user", ["userId"])
    .index("by_user_campaign", ["userId", "campaignId"])
    .index("by_donorEmail_campaign", ["donorEmail", "campaignId"]),
  /** One row per send attempt — doubles as an idempotency guard (skip
   * optIns already logged "sent" for a given update) and a transparency
   * record ("this update notified N donors"). */
  campaignUpdateEmailLog: defineTable({
    updateId: v.id("campaignUpdates"),
    optInId: v.id("campaignUpdateOptIns"),
    recipientEmail: v.string(),
    status: v.union(v.literal("sent"), v.literal("failed"), v.literal("skipped")),
    error: v.optional(v.string()),
    sentAt: v.number(),
  })
    .index("by_update", ["updateId"])
    .index("by_update_optIn", ["updateId", "optInId"]),
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
