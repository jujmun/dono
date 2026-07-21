import { v } from "convex/values";

export const verificationValidator = v.object({
  type: v.string(),
  label: v.string(),
  endorsedBy: v.optional(v.string()),
});

export const campaignUpdateValidator = v.object({
  id: v.string(),
  date: v.string(),
  title: v.string(),
  content: v.string(),
  image: v.optional(v.string()),
});

export const creatorValidator = v.object({
  name: v.string(),
  type: v.string(),
  avatar: v.string(),
  communityId: v.string(),
});

export const campaignFields = {
  slug: v.string(),
  title: v.string(),
  description: v.string(),
  story: v.string(),
  category: v.string(),
  goal: v.number(),
  raised: v.number(),
  donors: v.number(),
  likes: v.number(),
  followers: v.number(),
  comments: v.number(),
  creator: creatorValidator,
  verifications: v.array(verificationValidator),
  university: v.string(),
  college: v.optional(v.string()),
  image: v.string(),
  imageStorageId: v.optional(v.id("_storage")),
  images: v.optional(v.array(v.string())),
  imageStorageIds: v.optional(v.array(v.id("_storage"))),
  /** YouTube or Vimeo watch URL for the campaign media hero. */
  videoUrl: v.optional(v.string()),
  createdAt: v.string(),
  deadline: v.string(),
  status: v.union(
    v.literal("pending"),
    v.literal("rejected"),
    v.literal("active"),
    v.literal("funded"),
    v.literal("completed"),
    /** Admin requested edits during review — see convex/notifications.ts
     * sendFromAdmin's isEditRequest handling. Not public (campaignVisibility.ts). */
    v.literal("changes_requested"),
  ),
  updates: v.array(campaignUpdateValidator),
  impactItems: v.optional(v.array(v.string())),
  createdBy: v.optional(v.id("users")),
  moderationNote: v.optional(v.string()),
  moderatedAt: v.optional(v.number()),
  moderatedBy: v.optional(v.id("users")),
  moderationAction: v.optional(
    v.union(v.literal("rejected"), v.literal("taken_down")),
  ),
  restoredAt: v.optional(v.number()),
  societyApprovalStatus: v.optional(
    v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
    ),
  ),
  societyApprovedAt: v.optional(v.number()),
  societyApprovedBy: v.optional(v.id("users")),
  societyRejectionNote: v.optional(v.string()),
  /** Stripe Identity — mirrors the society fields of the same names. */
  stripeVerificationSessionId: v.optional(v.string()),
  stripeVerificationStatus: v.optional(
    v.union(
      v.literal("created"),
      v.literal("requires_input"),
      v.literal("processing"),
      v.literal("verified"),
      v.literal("canceled"),
    ),
  ),
  verifiedName: v.optional(v.string()),
  verifiedDob: v.optional(v.string()),
  /** Populated from Stripe's last_error on requires_input; cleared otherwise. */
  stripeVerificationLastErrorCode: v.optional(v.string()),
  stripeVerificationLastErrorReason: v.optional(v.string()),
  /** Campaign page template id — see lib/campaign-templates.ts. Optional so
   * existing rows fall back to the default at read time (convex/lib/mappers.ts). */
  template: v.optional(v.string()),
  /** Freeform supplementary text set from the Review step, shown on the public page if present. */
  additionalNotes: v.optional(v.string()),
  /** Legacy field from an earlier design-editor experiment — no current code
   * reads or writes this, but at least one existing campaign document has it
   * set, and Convex schema validation requires every field present in real
   * data to be declared. Kept only so the schema matches existing data. */
  design: v.optional(v.string()),
};

export const verificationStatusValidator = v.union(
  v.literal("pending"),
  v.literal("verified"),
  v.literal("rejected"),
);

export const communityFields = {
  slug: v.string(),
  name: v.string(),
  type: v.string(),
  description: v.string(),
  avatar: v.string(),
  coverImage: v.string(),
  university: v.string(),
  followers: v.number(),
  campaigns: v.number(),
  totalRaised: v.number(),
  verified: v.boolean(),
  verificationType: v.optional(v.string()),
  verificationStatus: v.optional(verificationStatusValidator),
  createdBy: v.optional(v.id("users")),
  moderationNote: v.optional(v.string()),
  moderatedAt: v.optional(v.number()),
  moderatedBy: v.optional(v.id("users")),
};

export const societyMemberFields = {
  communitySlug: v.string(),
  userId: v.id("users"),
  role: v.union(v.literal("leader"), v.literal("member")),
  status: v.union(
    v.literal("pending"),
    v.literal("approved"),
    v.literal("rejected"),
  ),
  createdAt: v.number(),
  reviewedAt: v.optional(v.number()),
  reviewedBy: v.optional(v.id("users")),
};

export const societyFields = {
  slug: v.string(),
  name: v.string(),
  description: v.string(),
  story: v.string(),
  coverImageStorageId: v.optional(v.id("_storage")),
  websiteUrl: v.string(),
  secondaryLink: v.optional(v.string()),
  supportingDocumentStorageIds: v.array(v.id("_storage")),
  idDocumentStorageId: v.id("_storage"),
  creatorId: v.id("users"),
  status: v.union(
    v.literal("pending"),
    v.literal("active"),
    v.literal("rejected"),
  ),
  createdAt: v.number(),
  moderationNote: v.optional(v.string()),
  moderatedAt: v.optional(v.number()),
  moderatedBy: v.optional(v.id("users")),
  /** Mirrors campaignFields.moderationAction — "rejected" for a pre-approval
   * denial, "taken_down" for pulling a previously-active society. */
  moderationAction: v.optional(
    v.union(v.literal("rejected"), v.literal("taken_down")),
  ),
  restoredAt: v.optional(v.number()),
  /** Stripe Identity — additive alongside the manual idDocumentStorageId above. */
  stripeVerificationSessionId: v.optional(v.string()),
  stripeVerificationStatus: v.optional(
    v.union(
      // "created" is Stripe's actual initial status (verified against current
      // Stripe Identity docs) — included so the first status write after
      // session creation doesn't fail schema validation.
      v.literal("created"),
      v.literal("requires_input"),
      v.literal("processing"),
      v.literal("verified"),
      v.literal("canceled"),
    ),
  ),
  verifiedName: v.optional(v.string()),
  verifiedDob: v.optional(v.string()),
  /** Populated from Stripe's last_error on requires_input; cleared otherwise. */
  stripeVerificationLastErrorCode: v.optional(v.string()),
  stripeVerificationLastErrorReason: v.optional(v.string()),
};

export const fundFields = {
  slug: v.string(),
  name: v.string(),
  description: v.string(),
  category: v.string(),
  totalRaised: v.number(),
  donors: v.number(),
  campaignsSupported: v.number(),
  image: v.string(),
  university: v.string(),
};

export const activityFields = {
  slug: v.string(),
  type: v.union(
    v.literal("donation"),
    v.literal("campaign"),
    v.literal("follow"),
    v.literal("update"),
    v.literal("match"),
  ),
  user: v.string(),
  avatar: v.string(),
  action: v.string(),
  target: v.string(),
  amount: v.optional(v.number()),
  timestamp: v.string(),
};

export const notificationFields = {
  /** Recipient. */
  userId: v.id("users"),
  type: v.union(
    v.literal("campaign_pending"),
    v.literal("campaign_active"),
    v.literal("campaign_rejected"),
    v.literal("admin_message"),
    v.literal("onboarding"),
    /** System event, not a real notification — the owner edited a campaign
     * via the edit flow. Created read:true (never bumps the recipient's own
     * unread badge); surfaced only in the admin thread. */
    v.literal("campaign_edited"),
    /** Sent to every admin when an owner resubmits a changes-requested/
     * rejected campaign for re-review — see campaignCreator.resubmit. */
    v.literal("campaign_resubmitted"),
  ),
  message: v.string(),
  /** Optional link target — only "campaign" today, but a union so more
   * entity types can be added without a schema migration. */
  relatedEntityType: v.optional(v.union(v.literal("campaign"))),
  /** Campaign slug when relatedEntityType is "campaign". */
  relatedEntityId: v.optional(v.string()),
  read: v.boolean(),
  createdAt: v.number(),
  /** Set only for admin-sent messages (type "admin_message"). */
  senderId: v.optional(v.id("users")),
  /** Admin flagged this message as an edit request (type "admin_message" +
   * relatedEntityType "campaign" only) — surfaces an "Edit Campaign" button. */
  isEditRequest: v.optional(v.boolean()),
  /** Soft delete — admins can remove a message from the chat (their own or
   * anyone else's) without losing the audit trail. Filtered out of every
   * read path; the row itself is kept. */
  deletedAt: v.optional(v.number()),
  deletedBy: v.optional(v.id("users")),
};
