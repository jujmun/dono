import { z } from "zod";
import { isAtLeastAge, parseIsoDateOnly } from "@/lib/age";

export const YEAR_IN_COLLEGE_OPTIONS = [
  "1st year",
  "2nd year",
  "3rd year",
  "4th year",
  "5th year+",
  "Graduate",
] as const;

export type YearInCollege = (typeof YEAR_IN_COLLEGE_OPTIONS)[number];

export type UserType = "student" | "alumni";

const CURRENT_YEAR = new Date().getFullYear();

export const DAY_OF_MONTH_OPTIONS = Array.from({ length: 31 }, (_, i) => {
  const value = String(i + 1);
  return { label: value, value };
});

export const MONTH_OPTIONS = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
] as const;

/** Birth years covering ages 18–100, most recent (18yo) first. */
export const BIRTH_YEAR_OPTIONS = Array.from(
  { length: 100 - 18 + 1 },
  (_, i) => {
    const value = String(CURRENT_YEAR - 18 - i);
    return { label: value, value };
  },
);

const phoneSchema = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number.")
  .max(20, "Phone number is too long.")
  .regex(/^[+\d][\d\s()-]{6,18}\d$/, "Enter a valid phone number.");

const dateOfBirthSchema = z
  .string()
  .trim()
  .refine((value) => parseIsoDateOnly(value) !== null, "Enter your date of birth as YYYY-MM-DD.")
  .refine((value) => isAtLeastAge(value), "You must be at least 18 years old.");

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
  dateOfBirth: dateOfBirthSchema,
});

export const onboardingProfileSchema = profileDetailsSchema;

export const alumniOnboardingDetailsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name should be at least 2 characters.")
    .max(80, "Name should be at most 80 characters."),
  college: z
    .string()
    .trim()
    .min(2, "Enter your college.")
    .max(80, "College name is too long."),
  matriculationYear: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Select your matriculation or graduation year.")
    .refine((value) => {
      const year = Number(value);
      return year >= 1950 && year <= CURRENT_YEAR;
    }, `Year must be between 1950 and ${CURRENT_YEAR}.`),
  dateOfBirth: dateOfBirthSchema,
  interestedSocietySlugs: z.array(z.string().trim().min(1).max(80)).max(40),
});
