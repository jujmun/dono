import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import {
  BIRTH_YEAR_OPTIONS,
  DAY_OF_MONTH_OPTIONS,
  MONTH_OPTIONS,
} from "@/lib/validation/profile";
import { SelectField } from "@/components/select-field";

/** Trigger/label styling for the retro-themed create wizards. */
export const RETRO_SELECT_TRIGGER_CLASS =
  "rounded-lg border-2 border-retro-ink bg-white px-4 py-2.5";
export const RETRO_SELECT_TEXT_CLASS = "font-retro-mono text-sm text-retro-ink";

type DobParts = { day: string; month: string; year: string };

const EMPTY_PARTS: DobParts = { day: "", month: "", year: "" };

/** Split YYYY-MM-DD into unpadded day/month/year matching the option values. */
function splitIso(iso: string): DobParts {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return EMPTY_PARTS;
  return {
    year: match[1],
    month: String(Number(match[2])),
    day: String(Number(match[3])),
  };
}

/** Compose YYYY-MM-DD, or "" until all three parts are picked. */
function joinIso({ day, month, year }: DobParts): string {
  if (!day || !month || !year) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function daysInMonth(month: string, year: string): number {
  const m = Number(month);
  if (!m) return 31;
  const y = Number(year);
  // Without a year, allow 29 Feb — the year picker narrows it afterwards.
  if (!y) return m === 2 ? 29 : [4, 6, 9, 11].includes(m) ? 30 : 31;
  return new Date(y, m, 0).getDate();
}

type DobSelectProps = {
  /** Date of birth as YYYY-MM-DD, or "" when incomplete. */
  value: string;
  onChange: (isoDate: string) => void;
  disabled?: boolean;
  /** Wrapper row. */
  className?: string;
  /** Replaces the default select trigger styling (for retro-themed forms). */
  triggerClassName?: string;
  /** Replaces the default select trigger label styling. */
  textClassName?: string;
};

/**
 * Day / month / year dropdowns for a date of birth. Years cover ages 18–100.
 */
export function DobSelect({
  value,
  onChange,
  disabled,
  className = "",
  triggerClassName,
  textClassName,
}: DobSelectProps) {
  const [parts, setParts] = useState<DobParts>(() => splitIso(value));

  // Adopt values set from outside (e.g. a profile that loads after mount).
  useEffect(() => {
    if (value !== joinIso(parts)) setParts(splitIso(value));
  }, [value, parts]);

  const dayOptions = useMemo(
    () => DAY_OF_MONTH_OPTIONS.slice(0, daysInMonth(parts.month, parts.year)),
    [parts.month, parts.year],
  );

  // A stored birth year outside the 18–100 range still needs to be selectable.
  const yearOptions = useMemo(() => {
    if (!parts.year || BIRTH_YEAR_OPTIONS.some((o) => o.value === parts.year)) {
      return BIRTH_YEAR_OPTIONS;
    }
    return [{ label: parts.year, value: parts.year }, ...BIRTH_YEAR_OPTIONS];
  }, [parts.year]);

  const update = (next: DobParts) => {
    const max = daysInMonth(next.month, next.year);
    const clamped =
      next.day && Number(next.day) > max ? { ...next, day: String(max) } : next;
    setParts(clamped);
    onChange(joinIso(clamped));
  };

  return (
    <View className={`flex-row gap-2 ${className}`}>
      <SelectField
        value={parts.day}
        onChange={(day) => update({ ...parts, day })}
        options={dayOptions}
        placeholder="Day"
        title="Day"
        disabled={disabled}
        className="flex-1"
        triggerClassName={triggerClassName}
        textClassName={textClassName}
      />
      <SelectField
        value={parts.month}
        onChange={(month) => update({ ...parts, month })}
        options={MONTH_OPTIONS}
        placeholder="Month"
        title="Month"
        disabled={disabled}
        className="flex-[1.6]"
        triggerClassName={triggerClassName}
        textClassName={textClassName}
      />
      <SelectField
        value={parts.year}
        onChange={(year) => update({ ...parts, year })}
        options={yearOptions}
        placeholder="Year"
        title="Year"
        disabled={disabled}
        className="flex-1"
        triggerClassName={triggerClassName}
        textClassName={textClassName}
      />
    </View>
  );
}
