/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activity from "../activity.js";
import type * as adminAudit from "../adminAudit.js";
import type * as auth from "../auth.js";
import type * as auth_AdminEmailOTP from "../auth/AdminEmailOTP.js";
import type * as auth_ResendEmailOTP from "../auth/ResendEmailOTP.js";
import type * as auth_ResendOTP from "../auth/ResendOTP.js";
import type * as auth_ResendPasswordResetOTP from "../auth/ResendPasswordResetOTP.js";
import type * as auth_adminConfig from "../auth/adminConfig.js";
import type * as auth_otpConfig from "../auth/otpConfig.js";
import type * as auth_passwordPolicy from "../auth/passwordPolicy.js";
import type * as auth_rateLimit from "../auth/rateLimit.js";
import type * as campaignCreator from "../campaignCreator.js";
import type * as campaignIdentity from "../campaignIdentity.js";
import type * as campaignUpdateEmails from "../campaignUpdateEmails.js";
import type * as campaignUpdateEmailsInternal from "../campaignUpdateEmailsInternal.js";
import type * as campaignUpdateUnsubscribe from "../campaignUpdateUnsubscribe.js";
import type * as campaignUpdates from "../campaignUpdates.js";
import type * as campaigns from "../campaigns.js";
import type * as communities from "../communities.js";
import type * as crons from "../crons.js";
import type * as donations from "../donations.js";
import type * as emails from "../emails.js";
import type * as engagement from "../engagement.js";
import type * as evidence from "../evidence.js";
import type * as fixedOtpCleanup from "../fixedOtpCleanup.js";
import type * as funds from "../funds.js";
import type * as groups from "../groups.js";
import type * as http from "../http.js";
import type * as legal from "../legal.js";
import type * as legalInternal from "../legalInternal.js";
import type * as lib_age from "../lib/age.js";
import type * as lib_ageGate from "../lib/ageGate.js";
import type * as lib_aggregates from "../lib/aggregates.js";
import type * as lib_applyDonationToCampaign from "../lib/applyDonationToCampaign.js";
import type * as lib_authz from "../lib/authz.js";
import type * as lib_campaignCategories from "../lib/campaignCategories.js";
import type * as lib_campaignTemplates from "../lib/campaignTemplates.js";
import type * as lib_campaignVisibility from "../lib/campaignVisibility.js";
import type * as lib_donationAmounts from "../lib/donationAmounts.js";
import type * as lib_emails from "../lib/emails.js";
import type * as lib_legalAcceptance from "../lib/legalAcceptance.js";
import type * as lib_legalDocuments from "../lib/legalDocuments.js";
import type * as lib_mappers from "../lib/mappers.js";
import type * as lib_notifications from "../lib/notifications.js";
import type * as lib_pagination from "../lib/pagination.js";
import type * as lib_platformFee from "../lib/platformFee.js";
import type * as lib_redirect from "../lib/redirect.js";
import type * as lib_stripeConnectMerchant from "../lib/stripeConnectMerchant.js";
import type * as lib_stripeIdentityOutputs from "../lib/stripeIdentityOutputs.js";
import type * as lib_stripeOwnership from "../lib/stripeOwnership.js";
import type * as lib_unsubscribeToken from "../lib/unsubscribeToken.js";
import type * as lib_verificationBadges from "../lib/verificationBadges.js";
import type * as lib_videoUrl from "../lib/videoUrl.js";
import type * as lib_webhookIdempotency from "../lib/webhookIdempotency.js";
import type * as maintenance from "../maintenance.js";
import type * as materialChanges from "../materialChanges.js";
import type * as notifications from "../notifications.js";
import type * as refunds from "../refunds.js";
import type * as reports from "../reports.js";
import type * as reviewMessages from "../reviewMessages.js";
import type * as security from "../security.js";
import type * as seed from "../seed.js";
import type * as seedData from "../seedData.js";
import type * as societies from "../societies.js";
import type * as societyIdentity from "../societyIdentity.js";
import type * as societyIdentityWebhook from "../societyIdentityWebhook.js";
import type * as societyMembers from "../societyMembers.js";
import type * as stripe from "../stripe.js";
import type * as stripeConnect from "../stripeConnect.js";
import type * as stripeConnectInternal from "../stripeConnectInternal.js";
import type * as stripeFunds from "../stripeFunds.js";
import type * as stripeInternal from "../stripeInternal.js";
import type * as stripeWebhook from "../stripeWebhook.js";
import type * as users from "../users.js";
import type * as validators from "../validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  activity: typeof activity;
  adminAudit: typeof adminAudit;
  auth: typeof auth;
  "auth/AdminEmailOTP": typeof auth_AdminEmailOTP;
  "auth/ResendEmailOTP": typeof auth_ResendEmailOTP;
  "auth/ResendOTP": typeof auth_ResendOTP;
  "auth/ResendPasswordResetOTP": typeof auth_ResendPasswordResetOTP;
  "auth/adminConfig": typeof auth_adminConfig;
  "auth/otpConfig": typeof auth_otpConfig;
  "auth/passwordPolicy": typeof auth_passwordPolicy;
  "auth/rateLimit": typeof auth_rateLimit;
  campaignCreator: typeof campaignCreator;
  campaignIdentity: typeof campaignIdentity;
  campaignUpdateEmails: typeof campaignUpdateEmails;
  campaignUpdateEmailsInternal: typeof campaignUpdateEmailsInternal;
  campaignUpdateUnsubscribe: typeof campaignUpdateUnsubscribe;
  campaignUpdates: typeof campaignUpdates;
  campaigns: typeof campaigns;
  communities: typeof communities;
  crons: typeof crons;
  donations: typeof donations;
  emails: typeof emails;
  engagement: typeof engagement;
  evidence: typeof evidence;
  fixedOtpCleanup: typeof fixedOtpCleanup;
  funds: typeof funds;
  groups: typeof groups;
  http: typeof http;
  legal: typeof legal;
  legalInternal: typeof legalInternal;
  "lib/age": typeof lib_age;
  "lib/ageGate": typeof lib_ageGate;
  "lib/aggregates": typeof lib_aggregates;
  "lib/applyDonationToCampaign": typeof lib_applyDonationToCampaign;
  "lib/authz": typeof lib_authz;
  "lib/campaignCategories": typeof lib_campaignCategories;
  "lib/campaignTemplates": typeof lib_campaignTemplates;
  "lib/campaignVisibility": typeof lib_campaignVisibility;
  "lib/donationAmounts": typeof lib_donationAmounts;
  "lib/emails": typeof lib_emails;
  "lib/legalAcceptance": typeof lib_legalAcceptance;
  "lib/legalDocuments": typeof lib_legalDocuments;
  "lib/mappers": typeof lib_mappers;
  "lib/notifications": typeof lib_notifications;
  "lib/pagination": typeof lib_pagination;
  "lib/platformFee": typeof lib_platformFee;
  "lib/redirect": typeof lib_redirect;
  "lib/stripeConnectMerchant": typeof lib_stripeConnectMerchant;
  "lib/stripeIdentityOutputs": typeof lib_stripeIdentityOutputs;
  "lib/stripeOwnership": typeof lib_stripeOwnership;
  "lib/unsubscribeToken": typeof lib_unsubscribeToken;
  "lib/verificationBadges": typeof lib_verificationBadges;
  "lib/videoUrl": typeof lib_videoUrl;
  "lib/webhookIdempotency": typeof lib_webhookIdempotency;
  maintenance: typeof maintenance;
  materialChanges: typeof materialChanges;
  notifications: typeof notifications;
  refunds: typeof refunds;
  reports: typeof reports;
  reviewMessages: typeof reviewMessages;
  security: typeof security;
  seed: typeof seed;
  seedData: typeof seedData;
  societies: typeof societies;
  societyIdentity: typeof societyIdentity;
  societyIdentityWebhook: typeof societyIdentityWebhook;
  societyMembers: typeof societyMembers;
  stripe: typeof stripe;
  stripeConnect: typeof stripeConnect;
  stripeConnectInternal: typeof stripeConnectInternal;
  stripeFunds: typeof stripeFunds;
  stripeInternal: typeof stripeInternal;
  stripeWebhook: typeof stripeWebhook;
  users: typeof users;
  validators: typeof validators;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
