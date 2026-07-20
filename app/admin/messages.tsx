import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useQuery } from "convex/react";
import { ArrowLeft, Search } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { AdminShell } from "@/components/admin-shell";
import { AdminMessageThread } from "@/components/admin-message-thread";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { isPortalAdmin } from "@/lib/auth/is-portal-admin";

interface SearchResult {
  userId: Id<"users">;
  name: string;
  email: string;
  role: "user" | "admin";
}

function formatConversationTime(ms: number) {
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminMessagesPage() {
  const profile = useCurrentProfile();
  const adminUser = isPortalAdmin(profile);

  const [search, setSearch] = useState("");
  const trimmedSearch = search.trim();
  const [selectedUserId, setSelectedUserId] = useState<Id<"users"> | null>(null);

  const results = useQuery(
    api.users.searchForAdmin,
    adminUser && !selectedUserId ? { search: trimmedSearch || undefined } : "skip",
  ) as SearchResult[] | undefined;

  const recentConversations = useQuery(
    api.notifications.listRecentConversations,
    adminUser && !selectedUserId ? {} : "skip",
  );

  if (profile === undefined) {
    return (
      <AdminShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
        </View>
      </AdminShell>
    );
  }

  if (!adminUser) {
    return (
      <AdminShell>
        <View className="mx-auto w-full max-w-lg px-4 py-16">
          <Text className="font-retro-bold text-2xl text-dono-text">
            Access denied
          </Text>
        </View>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <View className="mx-auto w-full max-w-3xl px-4 py-8">
        <Text className="font-retro-bold text-2xl text-retro-ink">Messages</Text>
        <Text className="mt-1 text-sm text-dono-muted">
          Send a message directly to any student — it arrives as a notification
          for them. The full conversation with each student is one continuous
          thread, no matter which admin sent what.
        </Text>

        {selectedUserId ? (
          <View className="mt-6 rounded-2xl border border-dono-border bg-white p-5">
            <Pressable
              onPress={() => setSelectedUserId(null)}
              className="mb-4 flex-row items-center gap-2"
            >
              <ArrowLeft size={14} color="#56615A" />
              <Text className="text-sm text-dono-muted">All conversations</Text>
            </Pressable>
            <AdminMessageThread userId={selectedUserId} />
          </View>
        ) : (
          <>
            <View className="mt-6 rounded-2xl border border-dono-border bg-white p-5">
              <Text className="mb-1.5 text-xs font-retro-bold text-dono-muted">
                FIND A STUDENT
              </Text>
              <View className="mb-2 flex-row items-center gap-2 rounded-xl border border-dono-border bg-white px-3 py-2">
                <Search size={16} color="#56615A" />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search by name or email…"
                  placeholderTextColor="#56615A"
                  className="flex-1 py-2 text-sm text-dono-text"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {results === undefined ? null : results.length === 0 ? (
                <Text className="px-1 text-xs text-dono-muted">
                  {trimmedSearch ? "No matching students." : "Type to search students."}
                </Text>
              ) : (
                <View className="gap-1.5">
                  {results.map((r) => (
                    <Pressable
                      key={r.userId}
                      onPress={() => {
                        setSelectedUserId(r.userId);
                        setSearch("");
                      }}
                      className="rounded-lg border border-dono-border px-3 py-2"
                    >
                      <Text className="font-retro-bold text-sm text-dono-text">
                        {r.name || "Unnamed student"}
                      </Text>
                      <Text className="text-xs text-dono-muted">{r.email}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View className="mt-8">
              <Text className="font-retro-bold text-base text-dono-text">
                Recent conversations
              </Text>
              <Text className="mt-1 text-sm text-dono-muted">
                {recentConversations === undefined
                  ? "Loading..."
                  : recentConversations.length === 0
                    ? "No conversations yet."
                    : `${recentConversations.length} conversation${recentConversations.length === 1 ? "" : "s"}`}
              </Text>

              {recentConversations && recentConversations.length > 0 ? (
                <View className="mt-4 gap-3">
                  {recentConversations.map((c) => (
                    <Pressable
                      key={c.userId}
                      onPress={() => setSelectedUserId(c.userId)}
                      className="rounded-xl border border-dono-border bg-white p-4"
                    >
                      <View className="flex-row items-start justify-between gap-3">
                        <Text className="font-retro-bold text-sm text-dono-text">
                          {c.recipientName}
                        </Text>
                        <Text className="font-retro-mono text-[11px] text-dono-muted">
                          {formatConversationTime(c.lastMessageAt)}
                        </Text>
                      </View>
                      <Text className="text-xs text-dono-muted">{c.recipientEmail}</Text>
                      <Text className="mt-2 text-sm text-dono-text" numberOfLines={2}>
                        {c.lastMessage}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          </>
        )}
      </View>
    </AdminShell>
  );
}
