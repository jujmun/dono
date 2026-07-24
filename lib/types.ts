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
  | "events"
  | "accessibility"
  | "sports"
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
  images?: string[];
  /** Campaign page template id — see lib/campaign-templates.ts. */
  template: string;
  /** Freeform supplementary text set from the Review step. */
  additionalNotes?: string;
  /** YouTube or Vimeo watch URL for the campaign media hero. */
  videoUrl?: string;
  createdAt: string;
  deadline: string;
  status: "pending" | "rejected" | "active" | "funded" | "completed" | "changes_requested";
  updates: CampaignUpdate[];
  impactItems?: string[];
  /** Admin moderation fields (optional; present on admin payloads). */
  moderationNote?: string;
  moderatedAt?: number;
  moderationAction?: "rejected" | "taken_down";
  restoredAt?: number;
  /** Society-approval gate for society-created campaigns; irrelevant for other creator types. */
  societyApprovalStatus?: "pending" | "approved" | "rejected";
  societyApprovedAt?: number;
  societyRejectionNote?: string;
  /** ISO date — when purchases/expenditure are expected. */
  expectedExpenditureDate?: string;
  /** Freeform planned update schedule shown to donors. */
  plannedUpdateSchedule?: string;
  /** Who will own funded property/output. */
  ownershipStatement?: string;
  /** Named Responsible Individual user id (Convex). */
  responsibleIndividualUserId?: string;
  /** Admin/institution endorsement flag. */
  institutionallyEndorsed?: boolean;
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

export interface Society {
  slug: string;
  name: string;
  description: string;
  story: string;
  coverImageUrl: string | null;
  websiteUrl: string;
  secondaryLink: string | null;
  status: "pending" | "active" | "rejected";
  createdAt: number;
}

export interface MySociety extends Society {
  moderationNote: string | null;
  moderatedAt: number | null;
  supportingDocumentCount: number;
  hasIdDocument: boolean;
  connectOnboardingComplete: boolean;
  connectPayoutsEnabled: boolean;
  connectCardPaymentsActive: boolean;
  connectCardPaymentsStatus: string;
}

/** Admin-only shape — the one place real file URLs for verification docs appear. */
export interface AdminSociety {
  slug: string;
  name: string;
  description: string;
  story: string;
  coverImageUrl: string | null;
  websiteUrl: string;
  secondaryLink: string | null;
  status: "pending" | "active" | "rejected";
  createdAt: number;
  creatorId: string;
  moderationNote: string | null;
  moderatedAt: number | null;
  moderationAction: "rejected" | "taken_down" | null;
  restoredAt: number | null;
  supportingDocumentUrls: string[];
  idDocumentUrl: string | null;
  stripeVerificationStatus:
    | "created"
    | "requires_input"
    | "processing"
    | "verified"
    | "canceled"
    | null;
  stripeVerificationLastErrorCode: string | null;
  verifiedName: string | null;
  verifiedDob: string | null;
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

export type NotificationType =
  | "campaign_pending"
  | "campaign_active"
  | "campaign_rejected"
  | "admin_message"
  | "onboarding"
  | "campaign_resubmitted";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  relatedEntityType?: "campaign";
  relatedEntityId?: string;
  relatedEntityTitle?: string | null;
  read: boolean;
  createdAt: number;
  senderId?: string;
  /** Sender's role, resolved server-side — null for system-generated notifications. */
  senderRole?: "admin" | null;
  isEditRequest?: boolean;
  /** True when sent via the admin "Groups" broadcast feature rather than 1:1. */
  isBroadcast?: boolean;
  deletable: boolean;
}
