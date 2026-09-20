import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import {
  formatDisplayDate,
  isoToLocalDate,
  localDateToIso,
  type DateInputProps,
} from "@/components/date-input-shared";

/**
 * Native calendar field — opens the system date picker.
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
  const [open, setOpen] = useState(false);
  const selected = isoToLocalDate(value) ?? new Date();
  const minimumDate = min ? isoToLocalDate(min) ?? undefined : undefined;
  const maximumDate = max ? isoToLocalDate(max) ?? undefined : undefined;

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setOpen(false);
    }
    if (event.type === "dismissed") {
      setOpen(false);
      return;
    }
    if (date) {
      onChange(localDateToIso(date));
    }
  };

  return (
    <View className={className}>
      <Pressable
        onPress={() => {
          if (!disabled) setOpen(true);
        }}
        disabled={disabled}
        className={`w-full flex-row items-center gap-3 rounded-lg border-2 border-retro-ink bg-white px-4 py-2.5 ${
          disabled ? "opacity-50" : ""
        }`}
      >
        <Calendar size={16} color="#56615A" />
        <Text
          className={`font-retro-mono text-sm ${
            value ? "text-retro-ink" : "text-[#56615A]"
          }`}
        >
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
      </Pressable>

      {open ? (
        <DateTimePicker
          value={selected}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      ) : null}

      {open && Platform.OS === "ios" ? (
        <Pressable
          onPress={() => setOpen(false)}
          className="retro-key mt-2 self-end rounded-full border-2 border-retro-ink bg-retro-paper px-4 py-1.5"
        >
          <Text className="font-retro-bold text-xs text-retro-ink">Done</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
