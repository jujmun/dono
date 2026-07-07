import type {
  ActivityItem,
  Campaign,
  Community,
  CommunityFund,
  DonoWrapped,
  DonorImpact,
} from "./types";

export const campaigns: Campaign[] = [
  {
    id: "anatomy-models",
    title: "Anatomy Models for Medical Students",
    description:
      "Help us purchase 12 high-quality anatomical models for the dissection lab.",
    story:
      "Our medical society has identified a critical gap in lab resources. Current models are over 15 years old and missing key structures. With your support, we can provide first-year students with the tools they need to excel in anatomy.",
    category: "equipment",
    goal: 3500,
    raised: 2847,
    donors: 142,
    likes: 89,
    followers: 234,
    comments: 23,
    creator: {
      name: "MedSoc Cambridge",
      type: "society",
      avatar: "MS",
      communityId: "medsoc-cambridge",
    },
    verifications: [
      { type: "society", label: "Verified Society" },
      { type: "institutional", label: "Endorsed by Faculty of Medicine", endorsedBy: "University of Cambridge" },
    ],
    university: "University of Cambridge",
    college: "Trinity College",
    image: "anatomy",
    createdAt: "2026-02-15",
    deadline: "2026-04-30",
    status: "active",
    updates: [
      {
        id: "u1",
        date: "2026-03-01",
        title: "Halfway there!",
        content: "We've reached 80% of our goal thanks to 142 generous donors. The faculty has confirmed lab space for the new models.",
      },
    ],
    impactItems: ["12 anatomical models", "500+ students per year", "Updated dissection curriculum"],
  },
  {
    id: "orchestra-instruments",
    title: "New Instruments for University Orchestra",
    description:
      "Fund new violins and cellos so more students can join our growing orchestra.",
    story:
      "The University Orchestra has doubled in size over the past two years, but our instrument inventory hasn't kept pace. Many talented students are turned away because we simply don't have enough instruments to lend.",
    category: "equipment",
    goal: 5200,
    raised: 1890,
    donors: 67,
    likes: 124,
    followers: 312,
    comments: 18,
    creator: {
      name: "University Orchestra",
      type: "society",
      avatar: "UO",
      communityId: "uni-orchestra",
    },
    verifications: [
      { type: "society", label: "Verified Society" },
      { type: "college", label: "Verified College Society" },
    ],
    university: "University of Oxford",
    image: "orchestra",
    createdAt: "2026-03-01",
    deadline: "2026-05-15",
    status: "active",
    updates: [],
    impactItems: ["4 violins", "2 cellos", "30 new orchestra members"],
  },
  {
    id: "conference-travel",
    title: "Send 5 Students to AI Ethics Conference",
    description:
      "Support computer science students attending the European AI Ethics Summit in Berlin.",
    story:
      "Five of our brightest CS students have had papers accepted at the European AI Ethics Summit. Conference fees and travel costs are beyond their means — help them represent our department on the international stage.",
    category: "travel",
    goal: 2400,
    raised: 2400,
    donors: 98,
    likes: 156,
    followers: 189,
    comments: 31,
    creator: {
      name: "CS Department",
      type: "department",
      avatar: "CS",
      communityId: "cs-dept",
    },
    verifications: [
      { type: "university", label: "Verified Department" },
      { type: "institutional", label: "Endorsed by Head of Department", endorsedBy: "Imperial College London" },
    ],
    university: "Imperial College London",
    image: "conference",
    createdAt: "2026-01-10",
    deadline: "2026-03-01",
    status: "funded",
    updates: [
      {
        id: "u2",
        date: "2026-03-05",
        title: "Fully funded!",
        content: "All five students are booked and ready to present in Berlin. Thank you to every donor who made this possible.",
      },
    ],
    impactItems: ["5 students at conference", "3 paper presentations", "Department visibility"],
  },
  {
    id: "welfare-kits",
    title: "Exam Welfare Kits for Freshers",
    description:
      "Provide stress-relief kits and hot drinks during exam season for 200 first-year students.",
    story:
      "Exam season is tough, especially for freshers far from home. Our welfare team wants to provide care packages with tea, snacks, stress balls, and revision guides to every first-year during finals week.",
    category: "welfare",
    goal: 800,
    raised: 645,
    donors: 89,
    likes: 201,
    followers: 445,
    comments: 42,
    creator: {
      name: "St Anne's JCR",
      type: "college",
      avatar: "SA",
      communityId: "st-annes",
    },
    verifications: [
      { type: "college", label: "Verified College" },
    ],
    university: "University of Oxford",
    college: "St Anne's College",
    image: "welfare",
    createdAt: "2026-02-20",
    deadline: "2026-04-15",
    status: "active",
    updates: [],
    impactItems: ["200 welfare kits", "Hot drinks station", "Peer support sessions"],
  },
  {
    id: "sports-equipment",
    title: "Rowing Club Boat Repairs",
    description:
      "Essential repairs to keep our club's racing boats seaworthy for the summer regatta season.",
    story:
      "Our club's two racing eights need hull repairs and new rigging before the summer regatta season. Without these repairs, we'll have to withdraw from three major competitions.",
    category: "sports",
    goal: 4200,
    raised: 1100,
    donors: 34,
    likes: 67,
    followers: 156,
    comments: 12,
    creator: {
      name: "Boat Club",
      type: "society",
      avatar: "BC",
      communityId: "boat-club",
    },
    verifications: [
      { type: "society", label: "Verified Society" },
    ],
    university: "University of Cambridge",
    college: "Jesus College",
    image: "rowing",
    createdAt: "2026-03-05",
    deadline: "2026-04-20",
    status: "active",
    updates: [],
    impactItems: ["2 racing eights repaired", "3 regattas", "40 club members"],
  },
  {
    id: "accessibility-ramp",
    title: "Accessibility Ramp for Drama Society",
    description:
      "Install a portable ramp so our theatre productions are accessible to all audience members.",
    story:
      "Our drama society performs in historic venues that lack modern accessibility features. A portable ramp will ensure wheelchair users and those with mobility needs can enjoy every production.",
    category: "accessibility",
    goal: 1200,
    raised: 890,
    donors: 56,
    likes: 178,
    followers: 267,
    comments: 28,
    creator: {
      name: "Drama Society",
      type: "society",
      avatar: "DS",
      communityId: "drama-soc",
    },
    verifications: [
      { type: "society", label: "Verified Society" },
      { type: "institutional", label: "Endorsed by Accessibility Office", endorsedBy: "University of Edinburgh" },
    ],
    university: "University of Edinburgh",
    image: "theatre",
    createdAt: "2026-02-28",
    deadline: "2026-04-10",
    status: "active",
    updates: [],
    impactItems: ["Portable ramp", "All venues accessible", "Inclusive performances"],
  },
];

export const communities: Community[] = [
  {
    id: "medsoc-cambridge",
    name: "MedSoc Cambridge",
    type: "society",
    description: "The Medical Society at the University of Cambridge, supporting medical students since 1828.",
    avatar: "MS",
    coverImage: "medical",
    university: "University of Cambridge",
    followers: 1240,
    campaigns: 8,
    totalRaised: 28400,
    verified: true,
    verificationType: "society",
  },
  {
    id: "st-annes",
    name: "St Anne's College",
    type: "college",
    description: "A warm and welcoming college community at the University of Oxford.",
    avatar: "SA",
    coverImage: "college",
    university: "University of Oxford",
    followers: 2340,
    campaigns: 12,
    totalRaised: 45600,
    verified: true,
    verificationType: "college",
  },
  {
    id: "cs-dept",
    name: "Computer Science Department",
    type: "department",
    description: "Imperial College London's world-leading Department of Computing.",
    avatar: "CS",
    coverImage: "computing",
    university: "Imperial College London",
    followers: 890,
    campaigns: 5,
    totalRaised: 18900,
    verified: true,
    verificationType: "university",
  },
  {
    id: "uni-orchestra",
    name: "University Orchestra",
    type: "society",
    description: "Oxford's premier student orchestra, performing classical and contemporary works.",
    avatar: "UO",
    coverImage: "orchestra",
    university: "University of Oxford",
    followers: 567,
    campaigns: 3,
    totalRaised: 12300,
    verified: true,
    verificationType: "society",
  },
  {
    id: "boat-club",
    name: "Jesus College Boat Club",
    type: "society",
    description: "One of Cambridge's oldest and most competitive rowing clubs.",
    avatar: "BC",
    coverImage: "rowing",
    university: "University of Cambridge",
    followers: 423,
    campaigns: 4,
    totalRaised: 8900,
    verified: true,
    verificationType: "society",
  },
  {
    id: "drama-soc",
    name: "Edinburgh University Drama Society",
    type: "society",
    description: "Creating inclusive, ambitious theatre for the Edinburgh student community.",
    avatar: "DS",
    coverImage: "theatre",
    university: "University of Edinburgh",
    followers: 678,
    campaigns: 6,
    totalRaised: 15600,
    verified: true,
    verificationType: "society",
  },
];

export const communityFunds: CommunityFund[] = [
  {
    id: "medical-textbooks",
    name: "Medical Textbooks Fund",
    description: "Support medical students across all universities with essential textbook costs.",
    category: "textbooks",
    totalRaised: 45600,
    donors: 890,
    campaignsSupported: 23,
    image: "textbooks",
    university: "All Universities",
  },
  {
    id: "student-hardship",
    name: "Student Hardship Fund",
    description: "Emergency support for students facing unexpected financial difficulty.",
    category: "welfare",
    totalRaised: 78900,
    donors: 1456,
    campaignsSupported: 67,
    image: "hardship",
    university: "All Universities",
  },
  {
    id: "music-equipment",
    name: "Music Equipment Fund",
    description: "Help music societies and ensembles access the instruments they need.",
    category: "equipment",
    totalRaised: 23400,
    donors: 456,
    campaignsSupported: 15,
    image: "music",
    university: "All Universities",
  },
  {
    id: "sports-equipment-fund",
    name: "Sports Equipment Fund",
    description: "Keep university sports clubs equipped and competitive.",
    category: "sports",
    totalRaised: 34500,
    donors: 678,
    campaignsSupported: 28,
    image: "sports",
    university: "All Universities",
  },
  {
    id: "work-experience",
    name: "Work Experience Fund",
    description: "Fund internships and work placements for students from lower-income backgrounds.",
    category: "travel",
    totalRaised: 56700,
    donors: 923,
    campaignsSupported: 34,
    image: "internship",
    university: "All Universities",
  },
];

export const activityFeed: ActivityItem[] = [
  {
    id: "a1",
    type: "donation",
    user: "Sarah M.",
    avatar: "SM",
    action: "donated",
    target: "Anatomy Models for Medical Students",
    amount: 25,
    timestamp: "2 min ago",
  },
  {
    id: "a2",
    type: "match",
    user: "James K.",
    avatar: "JK",
    action: "matched your donation to",
    target: "Exam Welfare Kits",
    amount: 10,
    timestamp: "15 min ago",
  },
  {
    id: "a3",
    type: "campaign",
    user: "MedSoc Cambridge",
    avatar: "MS",
    action: "posted an update on",
    target: "Anatomy Models for Medical Students",
    timestamp: "1 hour ago",
  },
  {
    id: "a4",
    type: "donation",
    user: "Emma L.",
    avatar: "EL",
    action: "donated",
    target: "Rowing Club Boat Repairs",
    amount: 50,
    timestamp: "2 hours ago",
  },
  {
    id: "a5",
    type: "follow",
    user: "Tom R.",
    avatar: "TR",
    action: "started following",
    target: "St Anne's College",
    timestamp: "3 hours ago",
  },
  {
    id: "a6",
    type: "donation",
    user: "Priya S.",
    avatar: "PS",
    action: "donated to",
    target: "Medical Textbooks Fund",
    amount: 15,
    timestamp: "4 hours ago",
  },
];

export const donorImpact: DonorImpact = {
  totalDonated: 340,
  campaignsSupported: 8,
  communitiesFollowed: 5,
  impactHighlights: [
    "Helped fund 12 anatomical models for 500+ medical students",
    "Supported 5 students attending the AI Ethics Summit",
    "Contributed to 200 exam welfare kits for freshers",
  ],
  recentDonations: [
    { campaign: "Anatomy Models for Medical Students", amount: 25, date: "2026-03-28" },
    { campaign: "Exam Welfare Kits for Freshers", amount: 10, date: "2026-03-25" },
    { campaign: "Medical Textbooks Fund", amount: 15, date: "2026-03-20" },
    { campaign: "Send 5 Students to AI Ethics Conference", amount: 50, date: "2026-02-15" },
  ],
};

export const donoWrapped: DonoWrapped = {
  year: 2025,
  totalDonated: 340,
  campaignsSupported: 8,
  topCommunity: "MedSoc Cambridge",
  rank: "Top 15% of donors",
  impactStatement: "Your generosity helped 500+ students access better learning resources.",
};

export function getCampaign(id: string): Campaign | undefined {
  return campaigns.find((c) => c.id === id);
}

export function getCommunity(id: string): Community | undefined {
  return communities.find((c) => c.id === id);
}

export function getCampaignsByCommunity(communityId: string): Campaign[] {
  return campaigns.filter((c) => c.creator.communityId === communityId);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getProgress(raised: number, goal: number): number {
  return Math.min(Math.round((raised / goal) * 100), 100);
}

export const categoryLabels: Record<string, string> = {
  textbooks: "Textbooks",
  equipment: "Equipment",
  travel: "Travel & Conferences",
  welfare: "Welfare",
  events: "Events",
  accessibility: "Accessibility",
  sports: "Sports",
  memorial: "Memorial",
  outreach: "Community Outreach",
};

export const categoryColors: Record<string, string> = {
  textbooks: "bg-blue-100 text-blue-700",
  equipment: "bg-purple-100 text-purple-700",
  travel: "bg-amber-100 text-amber-700",
  welfare: "bg-rose-100 text-rose-700",
  events: "bg-pink-100 text-pink-700",
  accessibility: "bg-teal-100 text-teal-700",
  sports: "bg-green-100 text-green-700",
  memorial: "bg-gray-100 text-gray-700",
  outreach: "bg-indigo-100 text-indigo-700",
};
