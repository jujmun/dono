import { z } from "zod";

export const emailSchema = z.string().trim().email("Enter a valid email.");

export const passwordSchema = z
  .string()
  .min(10, "Use at least 10 characters.")
  .regex(/[a-z]/, "Add a lowercase letter.")
  .regex(/[A-Z]/, "Add an uppercase letter.")
  .regex(/\d/, "Add a number.")
  .regex(/[^A-Za-z0-9]/, "Add a special character.");

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
  flow: z.enum(["signIn", "signUp"]),
});

export const resetRequestSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
  code: z.string().min(4, "Enter the code from your email."),
  newPassword: passwordSchema,
});

export const verifyEmailSchema = z.object({
  email: emailSchema,
  code: z.string().min(4, "Enter the code from your email."),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name should be at least 2 characters.")
    .max(80, "Name should be at most 80 characters."),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export const changePasswordSchema = z.object({
  email: emailSchema,
  currentPassword: z.string().min(1, "Enter your current password."),
  newPassword: passwordSchema,
});
