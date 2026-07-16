import { z } from "zod";

export const YEAR_IN_COLLEGE_OPTIONS = [
  "1st year",
  "2nd year",
  "3rd year",
  "4th year",
  "5th year+",
  "Graduate",
] as const;

export type YearInCollege = (typeof YEAR_IN_COLLEGE_OPTIONS)[number];

const phoneSchema = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number.")
  .max(20, "Phone number is too long.")
  .regex(/^[+\d][\d\s()-]{6,18}\d$/, "Enter a valid phone number.");

export const profileDetailsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name should be at least 2 characters.")
    .max(80, "Name should be at most 80 characters."),
  phone: phoneSchema,
  college: z
    .string()
    .trim()
    .min(2, "Enter your college.")
    .max(80, "College name is too long."),
  degree: z
    .string()
    .trim()
    .min(2, "Enter your degree.")
    .max(80, "Degree name is too long."),
  yearInCollege: z.enum(YEAR_IN_COLLEGE_OPTIONS, {
    message: "Select your year in college.",
  }),
});

export const onboardingProfileSchema = profileDetailsSchema;
