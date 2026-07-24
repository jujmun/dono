import { ConvexError } from "convex/values";
import { isAtLeastAge, MINIMUM_AGE_YEARS } from "./age";

export function assertAdultOrThrow(
  dobIso: string | undefined | null,
  message = `You must be at least ${MINIMUM_AGE_YEARS} years old.`,
) {
  if (!dobIso || !isAtLeastAge(dobIso)) {
    throw new ConvexError({
      code: "AGE_RESTRICTED",
      message,
    });
  }
}
