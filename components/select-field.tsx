import { useState } from "react";
import { View, Text, Pressable, Modal, FlatList } from "react-native";
import { ChevronDown, X } from "lucide-react-native";

export type SelectOption = { label: string; value: string };

type SelectFieldProps = {
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  title?: string;
  disabled?: boolean;
  className?: string;
  /** Replaces the default trigger box styling. */
  triggerClassName?: string;
  /** Replaces the default trigger label styling. */
  textClassName?: string;
};

export function SelectField({
  value,
  options,
  onChange,
  placeholder = "Select",
  title = "Select an option",
  disabled,
  className = "",
  triggerClassName = "rounded-xl border border-dono-border px-4 py-2.5",
  textClassName,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  const close = () => setOpen(false);

  return (
    <>
      <Pressable
        onPress={() => {
          if (!disabled) setOpen(true);
        }}
        disabled={disabled}
        className={`flex-row items-center justify-between ${triggerClassName} ${
          disabled ? "opacity-50" : ""
        } ${className}`}
      >
        <Text
          className={
            textClassName ??
            `text-sm ${selected ? "text-dono-text" : "text-dono-muted"}`
          }
          numberOfLines={1}
        >
          {selected?.label ?? placeholder}
        </Text>
        <ChevronDown size={14} color="#56615A" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/50 px-6"
          onPress={close}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="w-full max-w-xs"
          >
            <View className="max-h-[70vh] rounded-2xl border border-dono-border bg-white p-4">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="font-retro-bold text-base text-dono-text">
                  {title}
                </Text>
                <Pressable onPress={close} hitSlop={8}>
                  <X size={18} color="#211E1A" />
                </Pressable>
              </View>

              <FlatList
                data={options as SelectOption[]}
                keyExtractor={(item) => item.value}
                keyboardShouldPersistTaps="handled"
                style={{ maxHeight: 320 }}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      onChange(item.value);
                      close();
                    }}
                    className={`rounded-lg px-3 py-2.5 ${
                      item.value === value ? "bg-dono-primary/10" : ""
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        item.value === value
                          ? "font-retro-bold text-dono-primary"
                          : "text-dono-text"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
