import { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, Modal, FlatList } from "react-native";
import { ChevronDown, Search, X } from "lucide-react-native";
import { COUNTRIES, flagEmoji, type Country } from "@/lib/countries";

type CountryCodePickerProps = {
  value: Country;
  onChange: (country: Country) => void;
  disabled?: boolean;
};

export function CountryCodePicker({ value, onChange, disabled }: CountryCodePickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return COUNTRIES;
    return COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.dialCode.includes(query) ||
        country.iso2.toLowerCase() === query,
    );
  }, [search]);

  const close = () => {
    setOpen(false);
    setSearch("");
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        disabled={disabled}
        className={`flex-row items-center gap-1.5 rounded-xl border border-dono-border px-3 py-2.5 ${
          disabled ? "opacity-50" : ""
        }`}
      >
        <Text className="text-base">{flagEmoji(value.iso2)}</Text>
        <Text className="text-sm text-dono-text">+{value.dialCode}</Text>
        <ChevronDown size={14} color="#56615A" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <Pressable className="flex-1 items-center justify-center bg-black/50 px-6" onPress={close}>
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="w-full max-w-sm"
          >
            <View className="max-h-[70vh] rounded-2xl border border-dono-border bg-white p-4">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="font-retro-bold text-base text-dono-text">
                  Select country
                </Text>
                <Pressable onPress={close} hitSlop={8}>
                  <X size={18} color="#211E1A" />
                </Pressable>
              </View>

              <View className="mb-2 flex-row items-center gap-2 rounded-xl border border-dono-border px-3 py-2">
                <Search size={16} color="#56615A" />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search country or code…"
                  placeholderTextColor="#56615A"
                  className="flex-1 py-1 text-sm text-dono-text"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <FlatList
                data={results}
                keyExtractor={(item) => item.iso2}
                keyboardShouldPersistTaps="handled"
                style={{ maxHeight: 320 }}
                ListEmptyComponent={
                  <Text className="px-1 py-3 text-xs text-dono-muted">
                    No countries match "{search}".
                  </Text>
                }
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      onChange(item);
                      close();
                    }}
                    className={`flex-row items-center justify-between gap-2 rounded-lg px-2 py-2.5 ${
                      item.iso2 === value.iso2 ? "bg-dono-primary/10" : ""
                    }`}
                  >
                    <View className="flex-1 flex-row items-center gap-2">
                      <Text className="text-base">{flagEmoji(item.iso2)}</Text>
                      <Text
                        className="flex-1 text-sm text-dono-text"
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                    </View>
                    <Text className="text-xs text-dono-muted">+{item.dialCode}</Text>
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
