import { parseIsoDateOnly } from "@/lib/age";

export type DateInputProps = {
  value: string;
  onChange: (isoDate: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Minimum selectable date as YYYY-MM-DD. */
  min?: string;
  /** Maximum selectable date as YYYY-MM-DD. */
  max?: string;
};

/** Local calendar Date from YYYY-MM-DD (avoids UTC day-shift in pickers). */
export function isoToLocalDate(iso: string): Date | null {
  const parsed = parseIsoDateOnly(iso);
  if (!parsed) return null;
  return new Date(
    parsed.getUTCFullYear(),
    parsed.getUTCMonth(),
    parsed.getUTCDate(),
  );
}

export function localDateToIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDisplayDate(iso: string): string {
  const date = isoToLocalDate(iso);
  if (!date) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
