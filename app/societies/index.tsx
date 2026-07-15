import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Link } from "expo-router";
import { Search, Plus } from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { SocietyCardGrid } from "@/components/society-card-grid";
import { mockSocieties } from "@/lib/mock-societies";

type SocietiesTab = "discover" | "mine";

const tabs: { id: SocietiesTab; label: string }[] = [
  { id: "discover", label: "Discover Societies" },
  { id: "mine", label: "My Societies" },
];

export default function SocietiesPage() {
  const [tab, setTab] = useState<SocietiesTab>("discover");
  const [search, setSearch] = useState("");

  const scoped =
    tab === "mine" ? mockSocieties.filter((s) => s.joined) : mockSocieties;
  const filtered = scoped.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-7xl px-4 py-8">
        <View className="mb-8 flex-row items-center justify-between gap-4">
          <Text className="font-display-medium text-2xl text-dono-text">Societies</Text>
          <Link href="/create-society" asChild>
            <Pressable className="flex-row items-center gap-1.5 rounded-full bg-dono-accent px-4 py-2">
              <Plus size={16} color="#fff" />
              <Text className="font-sans-medium text-sm text-white">Create Society</Text>
            </Pressable>
          </Link>
        </View>

        <View className="mb-6">
          <View className="relative">
            <View className="absolute left-3 top-3 z-10">
              <Search size={16} color="#56615A" />
            </View>
            <TextInput
              placeholder="Search societies..."
              placeholderTextColor="#56615A"
              value={search}
              onChangeText={setSearch}
              className="w-full rounded-xl border border-dono-border bg-white py-2.5 pl-10 pr-4 text-sm text-dono-text"
            />
          </View>
        </View>

        <View className="mb-6 flex-row gap-2">
          {tabs.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              className={`rounded-full px-3.5 py-1.5 ${
                tab === t.id
                  ? "bg-dono-primary"
                  : "border border-dono-border bg-white"
              }`}
            >
              <Text
                className={`font-sans-medium text-xs ${
                  tab === t.id ? "text-white" : "text-dono-muted"
                }`}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {filtered.length === 0 ? (
          <View className="rounded-2xl border border-dono-border bg-white p-12">
            <Text className="text-center text-dono-muted">
              No societies match your search.
            </Text>
          </View>
        ) : (
          <SocietyCardGrid societies={filtered} />
        )}
      </View>
    </AppShell>
  );
}
