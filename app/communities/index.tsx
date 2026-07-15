import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useConvexAuth, useQuery } from "convex/react";
import { Search } from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { CommunityCard } from "@/components/community-card";
import { LoginGate } from "@/components/login-gate";
import { api } from "@convex/_generated/api";
import type { Community } from "@/lib/types";

const typeFilters = [
  { id: "all", label: "All" },
  { id: "college", label: "Colleges" },
  { id: "society", label: "Societies" },
  { id: "department", label: "Departments" },
];

export default function CommunitiesPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const communities = (useQuery(api.communities.list) ?? undefined) as
    | Community[]
    | undefined;
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const filtered = (communities ?? []).filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.university.toLowerCase().includes(search.toLowerCase());
    const matchesType = type === "all" || c.type === type;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <AppShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
        </View>
      </AppShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <AppShell>
        <LoginGate message="To access your communities, you need to log in." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-7xl px-4 py-8">
        <View className="mb-8">
          <Text className="font-display-medium text-2xl text-dono-text">Communities</Text>
          <Text className="mt-1 text-dono-muted">
            Follow colleges, societies, and departments. Campaigns come and go —
            communities remain.
          </Text>
        </View>

        <View className="mb-6">
          <View className="relative">
            <View className="absolute left-3 top-3 z-10">
              <Search size={16} color="#56615A" />
            </View>
            <TextInput
              placeholder="Search communities..."
              placeholderTextColor="#56615A"
              value={search}
              onChangeText={setSearch}
              className="w-full rounded-xl border border-dono-border bg-white py-2.5 pl-10 pr-4 text-sm text-dono-text"
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerClassName="gap-2"
        >
          {typeFilters.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => setType(f.id)}
              className={`rounded-full px-3.5 py-1.5 ${
                type === f.id
                  ? "bg-dono-primary"
                  : "border border-dono-border bg-white"
              }`}
            >
              <Text
                className={`font-sans-medium text-xs ${
                  type === f.id ? "text-white" : "text-dono-muted"
                }`}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {communities === undefined ? (
          <ActivityIndicator color="#17211B" />
        ) : filtered.length === 0 ? (
          <View className="rounded-2xl border border-dono-border bg-white p-12">
            <Text className="text-center text-dono-muted">
              No communities found yet.
            </Text>
          </View>
        ) : (
          <View className="gap-6">
            {filtered.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </View>
        )}
      </View>
    </AppShell>
  );
}
