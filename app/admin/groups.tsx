import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, Search, Send, Trash2, UserPlus, X } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { AdminShell } from "@/components/admin-shell";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { isPortalAdmin } from "@/lib/auth/is-portal-admin";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { cn } from "@/lib/utils";

type GroupRef =
  | { kind: "admins" }
  | { kind: "campaign_creators" }
  | { kind: "society_leaders" }
  | { kind: "society"; slug: string }
  | { kind: "custom"; groupId: Id<"userGroups"> };

interface GroupOverviewRow {
  ref: GroupRef;
  name: string;
  memberCount: number;
  kind: "automatic" | "society" | "custom";
}

function groupRefKey(ref: GroupRef) {
  switch (ref.kind) {
    case "admins":
      return "admins";
    case "campaign_creators":
      return "campaign_creators";
    case "society_leaders":
      return "society_leaders";
    case "society":
      return `society:${ref.slug}`;
    case "custom":
      return `custom:${ref.groupId}`;
  }
}

function GroupRow({ group, onPress }: { group: GroupOverviewRow; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between gap-3 rounded-xl border border-dono-border bg-white p-4"
    >
      <View className="flex-1">
        <Text className="font-retro-bold text-sm text-dono-text">{group.name}</Text>
        <Text className="mt-0.5 text-xs text-dono-muted">
          {group.memberCount} member{group.memberCount === 1 ? "" : "s"}
        </Text>
      </View>
      <Text className="text-xs font-retro-bold text-dono-muted">View</Text>
    </Pressable>
  );
}

function GroupDetail({ group, onBack }: { group: GroupOverviewRow; onBack: () => void }) {
  const detail = useQuery(api.groups.listMembers, { groupRef: group.ref });
  const sendBroadcast = useMutation(api.groups.sendBroadcast);
  const addMember = useMutation(api.groups.addCustomGroupMember);
  const removeMember = useMutation(api.groups.removeCustomGroupMember);
  const deleteGroup = useMutation(api.groups.deleteCustomGroup);

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sentInfo, setSentInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busyUserId, setBusyUserId] = useState<Id<"users"> | null>(null);

  const isCustom = group.ref.kind === "custom";
  const trimmedSearch = search.trim();
  const searchResults = useQuery(
    api.users.searchForAdmin,
    isCustom && trimmedSearch ? { search: trimmedSearch } : "skip",
  );

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setError(null);
    setSentInfo(null);
    setSending(true);
    try {
      const result = await sendBroadcast({ groupRef: group.ref, message: trimmed });
      setMessage("");
      setSentInfo(
        `Sent to ${result.recipientCount} member${result.recipientCount === 1 ? "" : "s"}.`,
      );
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setSending(false);
    }
  };

  const handleAddMember = async (userId: Id<"users">) => {
    if (group.ref.kind !== "custom") return;
    setError(null);
    setBusyUserId(userId);
    try {
      await addMember({ groupId: group.ref.groupId, userId });
      setSearch("");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusyUserId(null);
    }
  };

  const handleRemoveMember = async (userId: Id<"users">) => {
    if (group.ref.kind !== "custom") return;
    setError(null);
    setBusyUserId(userId);
    try {
      await removeMember({ groupId: group.ref.groupId, userId });
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusyUserId(null);
    }
  };

  const handleDeleteGroup = async () => {
    if (group.ref.kind !== "custom") return;
    setError(null);
    try {
      await deleteGroup({ groupId: group.ref.groupId });
      onBack();
    } catch (err) {
      setError(getFriendlyAuthError(err));
    }
  };

  const memberIds = new Set((detail?.members ?? []).map((m) => m.userId));

  return (
    <View className="rounded-2xl border border-dono-border bg-white p-5">
      <Pressable onPress={onBack} className="mb-4 flex-row items-center gap-2">
        <ArrowLeft size={14} color="#56615A" />
        <Text className="text-sm text-dono-muted">All groups</Text>
      </Pressable>

      <View className="flex-row items-start justify-between gap-3">
        <Text className="font-retro-bold text-xl text-dono-text">
          {detail?.name ?? group.name}
        </Text>
        {isCustom ? (
          <Pressable
            onPress={() => setConfirmDelete((v) => !v)}
            accessibilityLabel="Delete group"
            className="h-8 w-8 items-center justify-center rounded-full"
          >
            <Trash2 size={15} color="#56615A" />
          </Pressable>
        ) : null}
      </View>

      {confirmDelete ? (
        <View className="mt-3 rounded-xl border border-rose-200 p-3">
          <Text className="text-sm text-dono-text">Delete this group for good?</Text>
          <View className="mt-2 flex-row justify-end gap-3">
            <Pressable onPress={() => setConfirmDelete(false)}>
              <Text className="text-xs font-retro-bold text-dono-muted">Cancel</Text>
            </Pressable>
            <Pressable onPress={() => void handleDeleteGroup()}>
              <Text className="text-xs font-retro-bold text-rose-700">Delete</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {error ? (
        <View className="mt-3 rounded-xl bg-rose-50 px-4 py-3">
          <Text className="text-sm text-rose-700">{error}</Text>
        </View>
      ) : null}
      {sentInfo ? (
        <View className="mt-3 rounded-xl bg-green-50 px-4 py-3">
          <Text className="text-sm text-green-700">{sentInfo}</Text>
        </View>
      ) : null}

      {isCustom ? (
        <View className="mt-4 rounded-xl border border-dono-border bg-dono-surface-muted p-4">
          <Text className="mb-1.5 text-xs font-retro-bold text-dono-muted">ADD MEMBER</Text>
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
          {trimmedSearch && searchResults ? (
            <View className="gap-1.5">
              {searchResults
                .filter((r) => !memberIds.has(r.userId))
                .map((r) => (
                  <Pressable
                    key={r.userId}
                    onPress={() => void handleAddMember(r.userId)}
                    disabled={busyUserId === r.userId}
                    className={cn(
                      "flex-row items-center justify-between gap-2 rounded-lg border border-dono-border px-3 py-2",
                      busyUserId === r.userId && "opacity-50",
                    )}
                  >
                    <View>
                      <Text className="font-retro-bold text-sm text-dono-text">
                        {r.name || "Unnamed user"}
                      </Text>
                      <Text className="text-xs text-dono-muted">{r.email}</Text>
                    </View>
                    <UserPlus size={15} color="#17211B" />
                  </Pressable>
                ))}
              {searchResults.filter((r) => !memberIds.has(r.userId)).length === 0 ? (
                <Text className="px-1 text-xs text-dono-muted">No matches.</Text>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : null}

      <View className="mt-4">
        <Text className="mb-2 font-retro-bold text-sm text-dono-text">
          Members {detail ? `(${detail.members.length})` : ""}
        </Text>
        {detail === undefined ? (
          <View className="items-center py-8">
            <ActivityIndicator color="#17211B" />
          </View>
        ) : detail.members.length === 0 ? (
          <Text className="text-sm text-dono-muted">No members yet.</Text>
        ) : (
          <View className="gap-1.5">
            {detail.members.map((m) => (
              <View
                key={m.userId}
                className="flex-row items-center justify-between gap-2 rounded-lg border border-dono-border px-3 py-2"
              >
                <View>
                  <Text className="font-retro-bold text-sm text-dono-text">
                    {m.name || "Unnamed user"}
                  </Text>
                  <Text className="text-xs text-dono-muted">{m.email}</Text>
                </View>
                {isCustom ? (
                  <Pressable
                    onPress={() => void handleRemoveMember(m.userId)}
                    disabled={busyUserId === m.userId}
                    accessibilityLabel="Remove member"
                  >
                    <X size={16} color="#56615A" />
                  </Pressable>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="mt-6 border-t border-dono-border pt-4">
        <Text className="mb-2 font-retro-bold text-sm text-dono-text">
          Send a broadcast to this group
        </Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          placeholder="Write a message…"
          placeholderTextColor="#56615A"
          className="min-h-[100px] rounded-xl border border-dono-border px-4 py-3 text-sm text-dono-text"
          textAlignVertical="top"
        />
        <Text className="mt-1 text-xs text-dono-muted">
          Reaches every current member — anyone who joins later won't receive it
          retroactively.
        </Text>
        <Pressable
          onPress={() => void handleSend()}
          disabled={sending || !message.trim()}
          className={cn(
            "mt-3 flex-row items-center justify-center gap-2 self-end rounded-xl border border-dono-border bg-dono-surface-muted px-4 py-2.5",
            (sending || !message.trim()) && "opacity-50",
          )}
        >
          <Send size={15} color="#17211B" />
          <Text className="font-retro-bold text-sm text-dono-text">
            {sending ? "Sending..." : "Send broadcast"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function AdminGroupsPage() {
  const profile = useCurrentProfile();
  const adminUser = isPortalAdmin(profile);

  const groups = useQuery(api.groups.listOverview, adminUser ? {} : "skip") as
    | GroupOverviewRow[]
    | undefined;
  const createGroup = useMutation(api.groups.createCustomGroup);

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [createBusy, setCreateBusy] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const selectedGroup = groups?.find((g) => groupRefKey(g.ref) === selectedKey) ?? null;

  const handleCreateGroup = async () => {
    const trimmed = newGroupName.trim();
    if (!trimmed) return;
    setCreateBusy(true);
    setCreateError(null);
    try {
      await createGroup({ name: trimmed });
      setNewGroupName("");
      setCreating(false);
    } catch (err) {
      setCreateError(getFriendlyAuthError(err));
    } finally {
      setCreateBusy(false);
    }
  };

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
          <Text className="font-retro-bold text-2xl text-dono-text">Access denied</Text>
        </View>
      </AdminShell>
    );
  }

  const automaticGroups = (groups ?? []).filter((g) => g.kind !== "custom");
  const customGroups = (groups ?? []).filter((g) => g.kind === "custom");

  return (
    <AdminShell>
      <View className="mx-auto w-full max-w-3xl px-4 py-8">
        <Text className="font-retro-bold text-2xl text-retro-ink">Groups</Text>
        <Text className="mt-1 text-sm text-dono-muted">
          Message the right set of people at once. Automatic groups stay in sync as
          societies, leaders, and campaigns change; custom groups are yours to manage.
        </Text>

        {selectedGroup ? (
          <View className="mt-6">
            <GroupDetail group={selectedGroup} onBack={() => setSelectedKey(null)} />
          </View>
        ) : groups === undefined ? (
          <View className="items-center py-12">
            <ActivityIndicator color="#17211B" />
          </View>
        ) : (
          <>
            <View className="mt-6">
              <Text className="font-retro-bold text-base text-dono-text">Automatic</Text>
              <View className="mt-3 gap-2.5">
                {automaticGroups.map((g) => (
                  <GroupRow
                    key={groupRefKey(g.ref)}
                    group={g}
                    onPress={() => setSelectedKey(groupRefKey(g.ref))}
                  />
                ))}
              </View>
            </View>

            <View className="mt-8">
              <View className="flex-row items-center justify-between">
                <Text className="font-retro-bold text-base text-dono-text">Custom</Text>
                <Pressable
                  onPress={() => setCreating((v) => !v)}
                  className="rounded-lg border border-dono-border px-3 py-1.5"
                >
                  <Text className="text-xs font-retro-bold text-dono-text">
                    {creating ? "Cancel" : "New group"}
                  </Text>
                </Pressable>
              </View>

              {creating ? (
                <View className="mt-3 rounded-xl border border-dono-border bg-white p-4">
                  {createError ? (
                    <Text className="mb-2 text-sm text-rose-700">{createError}</Text>
                  ) : null}
                  <TextInput
                    value={newGroupName}
                    onChangeText={setNewGroupName}
                    placeholder="Group name…"
                    placeholderTextColor="#56615A"
                    maxLength={120}
                    className="rounded-xl border border-dono-border px-3 py-2 text-sm text-dono-text"
                  />
                  <Pressable
                    onPress={() => void handleCreateGroup()}
                    disabled={createBusy || !newGroupName.trim()}
                    className={cn(
                      "mt-3 items-center rounded-xl bg-dono-primary py-2.5",
                      (createBusy || !newGroupName.trim()) && "opacity-50",
                    )}
                  >
                    <Text className="font-retro-bold text-sm text-white">
                      {createBusy ? "Creating..." : "Create group"}
                    </Text>
                  </Pressable>
                </View>
              ) : null}

              <View className="mt-3 gap-2.5">
                {customGroups.length === 0 && !creating ? (
                  <Text className="text-sm text-dono-muted">No custom groups yet.</Text>
                ) : (
                  customGroups.map((g) => (
                    <GroupRow
                      key={groupRefKey(g.ref)}
                      group={g}
                      onPress={() => setSelectedKey(groupRefKey(g.ref))}
                    />
                  ))
                )}
              </View>
            </View>
          </>
        )}
      </View>
    </AdminShell>
  );
}
