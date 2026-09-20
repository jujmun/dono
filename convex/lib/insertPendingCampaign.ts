import { ConvexError } from "convex/values";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import {
  requireSocietyMember,
  requireStudentCreator,
} from "./authz";
import { assertExistingFunding } from "./existingFunding";
import { isValidCampaignTemplateId } from "./campaignTemplates";
import { isAllowedCampaignCategory } from "./campaignCategories";
import { assertLegalAcceptedForContext } from "./legalAcceptance";
import { assertAdultOrThrow } from "./ageGate";
import { buildCampaignVerifications } from "./verificationBadges";
import {
  buildCampaignPendingMessage,
  createNotification,
} from "./notifications";

const MAX_TITLE_LENGTH = 120;
const MAX_CATEGORY_LENGTH = 60;
const MAX_UNIVERSITY_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_STORY_LENGTH = 5000;
const MIN_GOAL = 1;
const MAX_GOAL = 1_000_000;

export type PendingCampaignInput = {
  title: string;
  category: string;
  communitySlug: string;
  description: string;
  story: string;
  goal: number;
  existingFunding?: number;
  template: string;
  expectedExpenditureDate?: string;
  plannedUpdateSchedule?: string;
  ownershipStatement?: string;
  additionalNotes?: string;
  responsibleIndividualUserId?: Id<"users">;
};

export const UNTITLED_CAMPAIGN_TITLE = "Untitled campaign";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function assertGoalAndFunding(
  goal: number,
  existingFunding: number,
  incomplete: boolean,
) {
  if (incomplete) {
    if (!Number.isFinite(goal) || goal < 0 || goal > MAX_GOAL) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Goal must be between 0 and 1,000,000.",
      });
    }
    if (goal < MIN_GOAL) {
      if (existingFunding !== 0) {
        throw new ConvexError({
          code: "INVALID_INPUT",
          message: "Already received requires a funding goal.",
        });
      }
      return;
    }
    assertExistingFunding(existingFunding, goal);
    return;
  }
  if (!Number.isFinite(goal) || goal < MIN_GOAL || goal > MAX_GOAL) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: "Goal must be between 1 and 1,000,000.",
    });
  }
  assertExistingFunding(existingFunding, goal);
}

const DEFAULT_UNIVERSITY = "University of Oxford";

function creatorInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Inserts a pending, unsubmitted campaign. Identity uses strict fields;
 * Save draft may pass incomplete: true for mid-form progress. */
export async function insertPendingCampaign(
  ctx: MutationCtx,
  args: PendingCampaignInput,
  options: { notifyOwner: boolean; incomplete?: boolean },
): Promise<{ slug: string; campaignId: Id<"campaigns"> }> {
  const incomplete = options.incomplete === true;
  const communitySlug = args.communitySlug.trim();
  const { profile, userId } = await requireStudentCreator(ctx);

  const membership = communitySlug
    ? await requireSocietyMember(ctx, communitySlug)
    : null;
  if (!incomplete) {
    if (!membership) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Choose a society to create a campaign.",
      });
    }
    await assertLegalAcceptedForContext(ctx, {
      userId,
      context: "create_society",
    });
    assertAdultOrThrow(
      profile?.dateOfBirth,
      "You must be at least 18 years old to create a campaign.",
    );
  }

  const community = membership?.community;
  let title = args.title.trim();
  const category = args.category.trim();
  const description = args.description.trim();
  const story = args.story.trim();
  const university = (community?.university ?? DEFAULT_UNIVERSITY).trim();

  if (!isValidCampaignTemplateId(args.template)) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: "Invalid template selection.",
    });
  }

  if (!title) {
    if (!incomplete) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Title is required and must be at most 120 characters.",
      });
    }
    title = UNTITLED_CAMPAIGN_TITLE;
  }
  if (title.length > MAX_TITLE_LENGTH) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: "Title is required and must be at most 120 characters.",
    });
  }
  if (incomplete) {
    if (category) {
      if (category.length > MAX_CATEGORY_LENGTH) {
        throw new ConvexError({
          code: "INVALID_INPUT",
          message: "Category is required and must be at most 60 characters.",
        });
      }
      if (!isAllowedCampaignCategory(category)) {
        throw new ConvexError({
          code: "PROHIBITED_CATEGORY",
          message: "This campaign category is not permitted under the Terms.",
        });
      }
    }
  } else {
    if (!category || category.length > MAX_CATEGORY_LENGTH) {
      throw new ConvexError({
        code: "INVALID_INPUT",
        message: "Category is required and must be at most 60 characters.",
      });
    }
    if (!isAllowedCampaignCategory(category)) {
      throw new ConvexError({
        code: "PROHIBITED_CATEGORY",
        message: "This campaign category is not permitted under the Terms.",
      });
    }
  }
  if (!university || university.length > MAX_UNIVERSITY_LENGTH) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: "University is required and must be at most 120 characters.",
    });
  }
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: "Description is required and must be at most 500 characters.",
    });
  }
  if (!incomplete && !description) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: "Description is required and must be at most 500 characters.",
    });
  }
  if (story.length > MAX_STORY_LENGTH) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: "Story is required and must be at most 5000 characters.",
    });
  }
  if (!incomplete && !story) {
    throw new ConvexError({
      code: "INVALID_INPUT",
      message: "Story is required and must be at most 5000 characters.",
    });
  }

  const existingFunding = args.existingFunding ?? 0;
  assertGoalAndFunding(args.goal, existingFunding, incomplete);

  const society = communitySlug
    ? await ctx.db
        .query("societies")
        .withIndex("by_slug", (q) => q.eq("slug", communitySlug))
        .unique()
    : null;
  const responsibleIndividualUserId =
    args.responsibleIndividualUserId ??
    society?.responsibleIndividualUserId ??
    society?.creatorId ??
    userId;
  if (!responsibleIndividualUserId) {
    throw new ConvexError({
      code: "RESPONSIBLE_INDIVIDUAL_REQUIRED",
      message: "A named Responsible Individual is required.",
    });
  }

  const creatorName =
    community?.name ?? (profile?.name?.trim() || "Draft");
  const initials = creatorInitials(creatorName) || "DR";

  let baseSlug = slugify(title) || "untitled-campaign";
  let slug = baseSlug;
  let suffix = 1;
  while (
    await ctx.db
      .query("campaigns")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique()
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const today = new Date();
  const deadline = new Date(today);
  deadline.setMonth(deadline.getMonth() + 2);
  const maxDeadline = new Date(today);
  maxDeadline.setFullYear(maxDeadline.getFullYear() + 1);
  if (deadline > maxDeadline) {
    deadline.setTime(maxDeadline.getTime());
  }

  const expectedExpenditureDate = args.expectedExpenditureDate?.trim();
  const plannedUpdateSchedule = args.plannedUpdateSchedule?.trim();
  const ownershipStatement = args.ownershipStatement?.trim();
  const additionalNotes = args.additionalNotes?.trim();

  const initialVerifications = buildCampaignVerifications({
    stripeVerificationStatus: undefined,
    societyApprovalStatus: undefined,
    verifications: [],
    institutionallyEndorsed: false,
  });

  const campaignId = await ctx.db.insert("campaigns", {
    slug,
    title,
    description,
    story,
    category,
    goal: args.goal,
    raised: 0,
    existingFunding,
    donors: 0,
    likes: 0,
    followers: 0,
    comments: 0,
    creator: {
      name: creatorName,
      type: "society",
      avatar: initials || "SO",
      communityId: communitySlug,
    },
    verifications: initialVerifications,
    university,
    image: "default",
    template: args.template,
    createdAt: today.toISOString().slice(0, 10),
    deadline: deadline.toISOString().slice(0, 10),
    status: "pending",
    updates: [],
    impactItems: [],
    createdBy: userId,
    responsibleIndividualUserId,
    ...(expectedExpenditureDate ? { expectedExpenditureDate } : {}),
    ...(plannedUpdateSchedule ? { plannedUpdateSchedule } : {}),
    ...(ownershipStatement ? { ownershipStatement } : {}),
    ...(additionalNotes ? { additionalNotes } : {}),
  });

  if (options.notifyOwner) {
    // No relatedEntityId: a pending campaign isn't public, and getBySlug
    // returns null even to its creator, so there's nowhere for a link to land.
    await createNotification(ctx, {
      userId,
      type: "campaign_pending",
      message: buildCampaignPendingMessage(title),
    });
  }

  return { slug, campaignId };
}
