import { ConvexError } from "convex/values";

export function validatePasswordRequirements(password: string) {
  const errors: string[] = [];

  if (password.length < 10) {
    errors.push("Password must be at least 10 characters.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must include a lowercase letter.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must include an uppercase letter.");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must include a number.");
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must include a special character.");
  }

  if (errors.length > 0) {
    throw new ConvexError({
      code: "INVALID_PASSWORD",
      message: "Password does not meet security requirements.",
      details: errors,
    });
  }
}
