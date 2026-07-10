import { z } from "zod";

function isOxfordEmail(email: string) {
  const domain = email.split("@")[1] ?? "";
  return domain === "ox.ac.uk" || domain.endsWith(".ox.ac.uk");
}

export const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email.")
  .transform((value) => value.toLowerCase())
  .refine(isOxfordEmail, "Use your Oxford email address (ending in ox.ac.uk).");

export const requestOtpSchema = z.object({
  email: emailSchema,
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code from your email."),
});

export const verifyEmailSchema = z.object({
  email: emailSchema,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code from your email."),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name should be at least 2 characters.")
    .max(80, "Name should be at most 80 characters."),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});
