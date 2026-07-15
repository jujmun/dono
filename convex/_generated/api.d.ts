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
import type * as campaigns from "../campaigns.js";
import type * as communities from "../communities.js";
import type * as crons from "../crons.js";
import type * as donations from "../donations.js";
import type * as emails from "../emails.js";
import type * as engagement from "../engagement.js";
import type * as fixedOtpCleanup from "../fixedOtpCleanup.js";
import type * as funds from "../funds.js";
import type * as http from "../http.js";
import type * as lib_aggregates from "../lib/aggregates.js";
import type * as lib_applyDonationToCampaign from "../lib/applyDonationToCampaign.js";
import type * as lib_authz from "../lib/authz.js";
import type * as lib_campaignVisibility from "../lib/campaignVisibility.js";
import type * as lib_donationAmounts from "../lib/donationAmounts.js";
import type * as lib_emails from "../lib/emails.js";
import type * as lib_mappers from "../lib/mappers.js";
import type * as lib_pagination from "../lib/pagination.js";
import type * as lib_redirect from "../lib/redirect.js";
import type * as lib_stripeIdentityOutputs from "../lib/stripeIdentityOutputs.js";
import type * as lib_stripeOwnership from "../lib/stripeOwnership.js";
import type * as lib_webhookIdempotency from "../lib/webhookIdempotency.js";
import type * as maintenance from "../maintenance.js";
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
  campaigns: typeof campaigns;
  communities: typeof communities;
  crons: typeof crons;
  donations: typeof donations;
  emails: typeof emails;
  engagement: typeof engagement;
  fixedOtpCleanup: typeof fixedOtpCleanup;
  funds: typeof funds;
  http: typeof http;
  "lib/aggregates": typeof lib_aggregates;
  "lib/applyDonationToCampaign": typeof lib_applyDonationToCampaign;
  "lib/authz": typeof lib_authz;
  "lib/campaignVisibility": typeof lib_campaignVisibility;
  "lib/donationAmounts": typeof lib_donationAmounts;
  "lib/emails": typeof lib_emails;
  "lib/mappers": typeof lib_mappers;
  "lib/pagination": typeof lib_pagination;
  "lib/redirect": typeof lib_redirect;
  "lib/stripeIdentityOutputs": typeof lib_stripeIdentityOutputs;
  "lib/stripeOwnership": typeof lib_stripeOwnership;
  "lib/webhookIdempotency": typeof lib_webhookIdempotency;
  maintenance: typeof maintenance;
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
