export type VerificationType =
  | "student"
  | "society"
  | "college"
  | "university"
  | "institutional";

export type CommunityType =
  | "college"
  | "society"
  | "department"
  | "student"
  | "category";

export type CampaignCategory =
  | "textbooks"
  | "equipment"
  | "travel"
  | "welfare"
  | "events"
  | "accessibility"
  | "sports"
  | "memorial"
  | "outreach";

export interface Verification {
  type: VerificationType;
  label: string;
  endorsedBy?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  story: string;
  category: CampaignCategory;
  goal: number;
  raised: number;
  donors: number;
  likes: number;
  followers: number;
  comments: number;
  creator: {
    name: string;
    type: CommunityType;
    avatar: string;
    communityId: string;
  };
  verifications: Verification[];
  university: string;
  college?: string;
  image: string;
  createdAt: string;
  deadline: string;
  status: "active" | "funded" | "completed";
  updates: CampaignUpdate[];
  impactItems?: string[];
}

export interface CampaignUpdate {
  id: string;
  date: string;
  title: string;
  content: string;
  image?: string;
}

export interface Community {
  id: string;
  name: string;
  type: CommunityType;
  description: string;
  avatar: string;
  coverImage: string;
  university: string;
  followers: number;
  campaigns: number;
  totalRaised: number;
  verified: boolean;
  verificationType?: VerificationType;
}

export interface CommunityFund {
  id: string;
  name: string;
  description: string;
  category: CampaignCategory;
  totalRaised: number;
  donors: number;
  campaignsSupported: number;
  image: string;
  university: string;
}

export interface ActivityItem {
  id: string;
  type: "donation" | "campaign" | "follow" | "update" | "match";
  user: string;
  avatar: string;
  action: string;
  target: string;
  amount?: number;
  timestamp: string;
}

export interface DonorImpact {
  totalDonated: number;
  campaignsSupported: number;
  communitiesFollowed: number;
  impactHighlights: string[];
  recentDonations: {
    campaign: string;
    amount: number;
    date: string;
  }[];
}

export interface DonoWrapped {
  year: number;
  totalDonated: number;
  campaignsSupported: number;
  topCommunity: string;
  rank: string;
  impactStatement: string;
}
