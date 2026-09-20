import { ConvexError } from "convex/values";

/**
 * Throw for product surfaces that legal-launch requires removed at the API
 * boundary (not merely hidden in the UI).
 */
export function throwFeatureRemoved(feature: string, message?: string): never {
  throw new ConvexError({
    code: "FEATURE_REMOVED",
    message:
      message ??
      `${feature} is not available. This feature has been removed for the Society-only beta.`,
  });
}
