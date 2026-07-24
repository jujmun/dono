/** Age eligibility helpers for T&C 18+ requirements (Convex-safe copy). */

export const MINIMUM_AGE_YEARS = 18;

export function parseIsoDateOnly(value: string): Date | null {
  const trimmed = value.trim();
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isFinite(year) || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

export function ageInYearsOn(dob: Date, on: Date = new Date()): number {
  let age = on.getUTCFullYear() - dob.getUTCFullYear();
  const monthDiff = on.getUTCMonth() - dob.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && on.getUTCDate() < dob.getUTCDate())) {
    age -= 1;
  }
  return age;
}

export function isAtLeastAge(
  dobIso: string,
  minimumAge: number = MINIMUM_AGE_YEARS,
  on: Date = new Date(),
): boolean {
  const dob = parseIsoDateOnly(dobIso);
  if (!dob) return false;
  return ageInYearsOn(dob, on) >= minimumAge;
}
