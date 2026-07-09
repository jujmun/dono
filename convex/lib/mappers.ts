import type { Doc } from "../_generated/dataModel";

type CampaignDoc = Doc<"campaigns">;
type CommunityDoc = Doc<"communities">;
type FundDoc = Doc<"communityFunds">;
type ActivityDoc = Doc<"activityItems">;

export function toCampaign(campaign: CampaignDoc) {
  return {
    id: campaign.slug,
    title: campaign.title,
    description: campaign.description,
    story: campaign.story,
    category: campaign.category,
    goal: campaign.goal,
    raised: campaign.raised,
    donors: campaign.donors,
    likes: campaign.likes,
    followers: campaign.followers,
    comments: campaign.comments,
    creator: campaign.creator,
    verifications: campaign.verifications,
    university: campaign.university,
    college: campaign.college,
    image: campaign.image,
    createdAt: campaign.createdAt,
    deadline: campaign.deadline,
    status: campaign.status,
    updates: campaign.updates,
    impactItems: campaign.impactItems,
  };
}

export function toCommunity(community: CommunityDoc) {
  return {
    id: community.slug,
    name: community.name,
    type: community.type,
    description: community.description,
    avatar: community.avatar,
    coverImage: community.coverImage,
    university: community.university,
    followers: community.followers,
    campaigns: community.campaigns,
    totalRaised: community.totalRaised,
    verified: community.verified,
    verificationType: community.verificationType,
  };
}

export function toFund(fund: FundDoc) {
  return {
    id: fund.slug,
    name: fund.name,
    description: fund.description,
    category: fund.category,
    totalRaised: fund.totalRaised,
    donors: fund.donors,
    campaignsSupported: fund.campaignsSupported,
    image: fund.image,
    university: fund.university,
  };
}

export function toActivityItem(item: ActivityDoc) {
  return {
    id: item.slug,
    type: item.type,
    user: item.user,
    avatar: item.avatar,
    action: item.action,
    target: item.target,
    amount: item.amount,
    timestamp: item.timestamp,
  };
}
