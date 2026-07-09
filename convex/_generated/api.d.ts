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
import type * as auth_ResendOTP from "../auth/ResendOTP.js";
import type * as auth_ResendPasswordResetOTP from "../auth/ResendPasswordResetOTP.js";
import type * as auth_otpConfig from "../auth/otpConfig.js";
import type * as auth_passwordPolicy from "../auth/passwordPolicy.js";
import type * as auth_rateLimit from "../auth/rateLimit.js";
import type * as campaigns from "../campaigns.js";
import type * as communities from "../communities.js";
import type * as donations from "../donations.js";
import type * as funds from "../funds.js";
import type * as http from "../http.js";
import type * as lib_authz from "../lib/authz.js";
import type * as lib_mappers from "../lib/mappers.js";
import type * as security from "../security.js";
import type * as seed from "../seed.js";
import type * as seedData from "../seedData.js";
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
  "auth/ResendOTP": typeof auth_ResendOTP;
  "auth/ResendPasswordResetOTP": typeof auth_ResendPasswordResetOTP;
  "auth/otpConfig": typeof auth_otpConfig;
  "auth/passwordPolicy": typeof auth_passwordPolicy;
  "auth/rateLimit": typeof auth_rateLimit;
  campaigns: typeof campaigns;
  communities: typeof communities;
  donations: typeof donations;
  funds: typeof funds;
  http: typeof http;
  "lib/authz": typeof lib_authz;
  "lib/mappers": typeof lib_mappers;
  security: typeof security;
  seed: typeof seed;
  seedData: typeof seedData;
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
