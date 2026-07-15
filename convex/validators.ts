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
  createdAt: v.string(),
  deadline: v.string(),
  status: v.union(
    v.literal("pending"),
    v.literal("rejected"),
    v.literal("active"),
    v.literal("funded"),
    v.literal("completed"),
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
