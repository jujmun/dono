import { Calendar } from "lucide-react-native";
import { View } from "react-native";
import {
  formatDisplayDate,
  type DateInputProps,
} from "@/components/date-input-shared";

/**
 * Web calendar field — native `<input type="date">` styled to match form inputs.
 */
export function DateInput({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  className = "",
  min,
  max,
}: DateInputProps) {
  return (
    <View
      className={`relative w-full overflow-hidden rounded-lg border-2 border-retro-ink bg-white ${
        disabled ? "opacity-50" : ""
      } ${className}`}
    >
      <View
        pointerEvents="none"
        className="pointer-events-none absolute bottom-0 left-3 top-0 z-10 justify-center"
      >
        <Calendar size={16} color="#56615A" />
      </View>
      {/* RN Web accepts DOM input; calendar UI comes from the browser. */}
      <input
        type="date"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        aria-label={placeholder}
        title={value ? formatDisplayDate(value) : placeholder}
        style={{
          width: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          paddingLeft: 40,
          paddingRight: 16,
          paddingTop: 10,
          paddingBottom: 10,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontSize: 14,
          color: value ? "#17211B" : "#56615A",
          colorScheme: "light",
        }}
      />
    </View>
  );
}
