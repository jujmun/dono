import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { useConvexAuth, useQuery } from "convex/react";
import { Search, Plus } from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { LoginGate } from "@/components/login-gate";
import { SocietyCardGrid } from "@/components/society-card-grid";
import { api } from "@convex/_generated/api";
import type { MySociety, Society } from "@/lib/types";
import { cn } from "@/lib/utils";

type SocietiesTab = "discover" | "mine";

const tabs: { id: SocietiesTab; label: string }[] = [
  { id: "discover", label: "Discover Societies" },
  { id: "mine", label: "My Societies" },
];

export default function SocietiesPage() {
  const [tab, setTab] = useState<SocietiesTab>("discover");
  const [search, setSearch] = useState("");
  const { isAuthenticated } = useConvexAuth();

  const activeSocieties = (useQuery(api.societies.listActive) ?? undefined) as
    | Society[]
    | undefined;
  const mySocieties = (useQuery(
    api.societies.listMine,
    isAuthenticated ? {} : "skip",
  ) ?? undefined) as MySociety[] | undefined;

  const scoped = tab === "mine" ? mySocieties : activeSocieties;
  const filtered = (scoped ?? []).filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const showMineLoginGate = tab === "mine" && !isAuthenticated;

  return (
    <AppShell>
      <View className="mb-6 flex-row flex-wrap items-center justify-between gap-4">
        <Text className="font-retro-bold text-[32px] text-retro-ink">
          Societies
        </Text>
        <Link href="/create-society" asChild>
          <Pressable className="flex-row items-center gap-1.5 rounded-full border-2 border-retro-ink bg-retro-mint px-4 py-2 shadow-[3px_3px_0_#211E1A]">
            <Plus size={16} color="#FFF9EF" />
            <Text className="font-retro-bold text-sm text-retro-paper">
              Create Society
            </Text>
          </Pressable>
        </Link>
      </View>

      <View className="mb-4 flex-row items-center gap-2.5 rounded-[10px] border-[3px] border-retro-ink bg-retro-paper px-4 py-2.5 shadow-[3px_3px_0_#211E1A]">
        <Search size={16} color="#8a8478" />
        <TextInput
          placeholder="Search societies…"
          placeholderTextColor="#8a8478"
          value={search}
          onChangeText={setSearch}
          className="min-w-0 flex-1 font-retro-mono text-[13px] text-retro-ink outline-none"
        />
      </View>

      <View className="mb-6 flex-row flex-wrap gap-2">
        {tabs.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => setTab(t.id)}
            className={cn(
              "rounded-full border-2 border-retro-ink px-3.5 py-1.5",
              tab === t.id
                ? "bg-retro-mint shadow-[3px_3px_0_#211E1A]"
                : "bg-retro-paper",
            )}
          >
            <Text
              className={cn(
                "font-retro-bold text-[12.5px]",
                tab === t.id ? "text-retro-paper" : "text-retro-ink",
              )}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {showMineLoginGate ? null : scoped === undefined ? (
        <View className="items-center py-16">
          <ActivityIndicator color="#211E1A" />
        </View>
      ) : filtered.length === 0 ? (
        <View className="rounded-[14px] border-[3px] border-retro-ink bg-retro-cream p-12 shadow-[5px_5px_0_#211E1A]">
          <Text className="text-center font-retro-mono text-sm text-[#5c574f]">
            No societies match your search.
          </Text>
        </View>
      ) : (
        <SocietyCardGrid societies={filtered} />
      )}

      {showMineLoginGate ? (
        <LoginGate message="Sign in to see the societies you've created." />
      ) : null}
    </AppShell>
  );
}
