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
import type * as auth from "../auth.js";
import type * as auth_AdminEmailOTP from "../auth/AdminEmailOTP.js";
import type * as auth_ResendEmailOTP from "../auth/ResendEmailOTP.js";
import type * as auth_ResendOTP from "../auth/ResendOTP.js";
import type * as auth_ResendPasswordResetOTP from "../auth/ResendPasswordResetOTP.js";
import type * as auth_adminConfig from "../auth/adminConfig.js";
import type * as auth_otpConfig from "../auth/otpConfig.js";
import type * as auth_passwordPolicy from "../auth/passwordPolicy.js";
import type * as auth_rateLimit from "../auth/rateLimit.js";
import type * as campaigns from "../campaigns.js";
import type * as communities from "../communities.js";
import type * as donations from "../donations.js";
import type * as fixedOtpCleanup from "../fixedOtpCleanup.js";
import type * as funds from "../funds.js";
import type * as http from "../http.js";
import type * as lib_applyDonationToCampaign from "../lib/applyDonationToCampaign.js";
import type * as lib_authz from "../lib/authz.js";
import type * as lib_donationAmounts from "../lib/donationAmounts.js";
import type * as lib_mappers from "../lib/mappers.js";
import type * as lib_pagination from "../lib/pagination.js";
import type * as lib_redirect from "../lib/redirect.js";
import type * as lib_stripeOwnership from "../lib/stripeOwnership.js";
import type * as lib_webhookIdempotency from "../lib/webhookIdempotency.js";
import type * as reviewMessages from "../reviewMessages.js";
import type * as security from "../security.js";
import type * as seed from "../seed.js";
import type * as seedData from "../seedData.js";
import type * as stripe from "../stripe.js";
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
  auth: typeof auth;
  "auth/AdminEmailOTP": typeof auth_AdminEmailOTP;
  "auth/ResendEmailOTP": typeof auth_ResendEmailOTP;
  "auth/ResendOTP": typeof auth_ResendOTP;
  "auth/ResendPasswordResetOTP": typeof auth_ResendPasswordResetOTP;
  "auth/adminConfig": typeof auth_adminConfig;
  "auth/otpConfig": typeof auth_otpConfig;
  "auth/passwordPolicy": typeof auth_passwordPolicy;
  "auth/rateLimit": typeof auth_rateLimit;
  campaigns: typeof campaigns;
  communities: typeof communities;
  donations: typeof donations;
  fixedOtpCleanup: typeof fixedOtpCleanup;
  funds: typeof funds;
  http: typeof http;
  "lib/applyDonationToCampaign": typeof lib_applyDonationToCampaign;
  "lib/authz": typeof lib_authz;
  "lib/donationAmounts": typeof lib_donationAmounts;
  "lib/mappers": typeof lib_mappers;
  "lib/pagination": typeof lib_pagination;
  "lib/redirect": typeof lib_redirect;
  "lib/stripeOwnership": typeof lib_stripeOwnership;
  "lib/webhookIdempotency": typeof lib_webhookIdempotency;
  reviewMessages: typeof reviewMessages;
  security: typeof security;
  seed: typeof seed;
  seedData: typeof seedData;
  stripe: typeof stripe;
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
