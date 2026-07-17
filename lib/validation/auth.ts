import { z } from "zod";
import { isAdminLoginEmail } from "@/lib/auth/admin";

function isOxfordEmail(email: string) {
  const domain = email.split("@")[1] ?? "";
  return domain === "ox.ac.uk" || domain.endsWith(".ox.ac.uk");
}

function isAllowedSignInEmail(email: string) {
  return isOxfordEmail(email) || isAdminLoginEmail(email);
}

export const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email.")
  .transform((value) => value.toLowerCase())
  .refine(
    isAllowedSignInEmail,
    "Use your Oxford email address (ending in ox.ac.uk).",
  );

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
});

export const passwordSchema = z
  .string()
  .min(10, "Use at least 10 characters.")
  .regex(/[a-z]/, "Add a lowercase letter.")
  .regex(/[A-Z]/, "Add an uppercase letter.")
  .regex(/\d/, "Add a number.")
  .regex(/[^A-Za-z0-9]/, "Add a special character.");

export const signInWithPasswordSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
});

export const signUpWithPasswordSchema = z
  .object({
    email: emailSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const setPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });
