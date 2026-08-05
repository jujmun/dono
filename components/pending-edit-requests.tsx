import { useState } from "react";
import { View, Text, Pressable, TextInput, ActivityIndicator } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { Check, X } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { formatCurrency } from "@/lib/constants";
import { AdminStatusChip } from "@/lib/admin-labels";

function formatSubmittedAt(ms: number) {
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function DiffRow({
  label,
  current,
  proposed,
}: {
  label: string;
  current: string;
  proposed: string;
}) {
  if (current === proposed) return null;
  return (
    <View className="gap-1 border-t border-dono-border pt-2">
      <Text className="font-retro-bold text-xs text-dono-muted">{label}</Text>
      <Text className="text-xs text-dono-muted" numberOfLines={3}>
        Current: {current || "(empty)"}
      </Text>
      <Text className="text-sm text-dono-text" numberOfLines={4}>
        Proposed: {proposed || "(empty)"}
      </Text>
    </View>
  );
}

export function PendingCampaignEditsSection({ enabled }: { enabled: boolean }) {
  const rows = useQuery(
    api.campaignEditRequests.listPendingForAdmin,
    enabled ? {} : "skip",
  );
  const review = useMutation(api.campaignEditRequests.adminReview);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handle = async (
    requestId: Id<"campaignEditRequests">,
    decision: "approve" | "reject",
  ) => {
    setError(null);
    setBusyId(requestId);
    try {
      await review({
        requestId,
        decision,
        reviewNote: decision === "reject" ? note.trim() || undefined : undefined,
      });
      setRejectId(null);
      setNote("");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusyId(null);
    }
  };

  if (!enabled) return null;
  if (rows === undefined) {
    return (
      <View className="mb-8 items-center py-6">
        <ActivityIndicator color="#17211B" />
      </View>
    );
  }
  if (rows.length === 0) return null;

  return (
    <View className="mb-8 gap-4">
      <Text className="font-retro-bold text-base text-dono-text">
        Pending edits
      </Text>
      {error ? (
        <View className="rounded-xl bg-rose-50 px-4 py-3">
          <Text className="text-sm text-rose-700">{error}</Text>
        </View>
      ) : null}
      {rows.map((row) => {
        const p = row.proposed;
        const c = row.current;
        const busy = busyId === row.id;
        return (
          <View
            key={row.id}
            className="gap-3 rounded-2xl border border-dono-border bg-white p-5"
          >
            <View className="flex-row flex-wrap gap-2">
              <AdminStatusChip label="Edit pending" tone="pending" />
            </View>
            <Text className="font-retro-bold text-lg text-dono-text">
              {row.campaignTitle}
            </Text>
            <Text className="text-xs text-dono-muted">
              Submitted {formatSubmittedAt(row.createdAt)} · /{row.campaignSlug}
            </Text>
            <View className="gap-2">
              {p.title !== undefined ? (
                <DiffRow label="Title" current={c.title} proposed={p.title} />
              ) : null}
              {p.description !== undefined ? (
                <DiffRow
                  label="Description"
                  current={c.description}
                  proposed={p.description}
                />
              ) : null}
              {p.story !== undefined ? (
                <DiffRow label="Story" current={c.story} proposed={p.story} />
              ) : null}
              {p.category !== undefined ? (
                <DiffRow
                  label="Category"
                  current={c.category}
                  proposed={p.category}
                />
              ) : null}
              {p.goal !== undefined ? (
                <DiffRow
                  label="Goal"
                  current={formatCurrency(c.goal)}
                  proposed={formatCurrency(p.goal)}
                />
              ) : null}
              {p.template !== undefined ? (
                <DiffRow
                  label="Template"
                  current={c.template ?? ""}
                  proposed={p.template}
                />
              ) : null}
              {p.additionalNotes !== undefined ? (
                <DiffRow
                  label="Additional notes"
                  current={c.additionalNotes}
                  proposed={p.additionalNotes}
                />
              ) : null}
              {p.expectedExpenditureDate !== undefined ? (
                <DiffRow
                  label="Expected expenditure"
                  current={c.expectedExpenditureDate}
                  proposed={p.expectedExpenditureDate}
                />
              ) : null}
              {p.plannedUpdateSchedule !== undefined ? (
                <DiffRow
                  label="Update schedule"
                  current={c.plannedUpdateSchedule}
                  proposed={p.plannedUpdateSchedule}
                />
              ) : null}
              {p.ownershipStatement !== undefined ? (
                <DiffRow
                  label="Ownership"
                  current={c.ownershipStatement}
                  proposed={p.ownershipStatement}
                />
              ) : null}
              {p.videoUrl !== undefined ? (
                <DiffRow
                  label="Video URL"
                  current={c.videoUrl}
                  proposed={p.videoUrl}
                />
              ) : null}
              {p.impactItems !== undefined ? (
                <DiffRow
                  label="Fund breakdown"
                  current={c.impactItems.join(" · ")}
                  proposed={p.impactItems.join(" · ")}
                />
              ) : null}
            </View>

            {rejectId === row.id ? (
              <View className="gap-2">
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Optional note to the owner…"
                  placeholderTextColor="#56615A"
                  className="rounded-xl border border-dono-border bg-white px-3 py-2 text-sm text-dono-text"
                />
                <View className="flex-row gap-2">
                  <Pressable
                    disabled={busy}
                    onPress={() =>
                      void handle(row.id as Id<"campaignEditRequests">, "reject")
                    }
                    className="flex-row items-center gap-1 rounded-full bg-rose-600 px-3.5 py-2"
                  >
                    <X size={14} color="#fff" />
                    <Text className="font-retro-bold text-xs text-white">
                      Confirm reject
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setRejectId(null);
                      setNote("");
                    }}
                    className="rounded-full border border-dono-border px-3.5 py-2"
                  >
                    <Text className="font-retro-bold text-xs text-dono-muted">
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View className="flex-row gap-2">
                <Pressable
                  disabled={busy}
                  onPress={() =>
                    void handle(row.id as Id<"campaignEditRequests">, "approve")
                  }
                  className="flex-row items-center gap-1 rounded-full bg-dono-primary px-3.5 py-2"
                >
                  <Check size={14} color="#fff" />
                  <Text className="font-retro-bold text-xs text-white">
                    Approve edits
                  </Text>
                </Pressable>
                <Pressable
                  disabled={busy}
                  onPress={() => setRejectId(row.id)}
                  className="flex-row items-center gap-1 rounded-full border border-rose-300 px-3.5 py-2"
                >
                  <X size={14} color="#be123c" />
                  <Text className="font-retro-bold text-xs text-rose-700">
                    Reject
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

export function PendingSocietyEditsSection({ enabled }: { enabled: boolean }) {
  const rows = useQuery(
    api.societyEditRequests.listPendingForAdmin,
    enabled ? {} : "skip",
  );
  const review = useMutation(api.societyEditRequests.adminReview);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handle = async (
    requestId: Id<"societyEditRequests">,
    decision: "approve" | "reject",
  ) => {
    setError(null);
    setBusyId(requestId);
    try {
      await review({
        requestId,
        decision,
        reviewNote: decision === "reject" ? note.trim() || undefined : undefined,
      });
      setRejectId(null);
      setNote("");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusyId(null);
    }
  };

  if (!enabled) return null;
  if (rows === undefined) {
    return (
      <View className="mb-8 items-center py-6">
        <ActivityIndicator color="#17211B" />
      </View>
    );
  }
  if (rows.length === 0) return null;

  return (
    <View className="mb-8 gap-4">
      <Text className="font-retro-bold text-base text-dono-text">
        Pending edits
      </Text>
      {error ? (
        <View className="rounded-xl bg-rose-50 px-4 py-3">
          <Text className="text-sm text-rose-700">{error}</Text>
        </View>
      ) : null}
      {rows.map((row) => {
        const p = row.proposed;
        const c = row.current;
        const busy = busyId === row.id;
        return (
          <View
            key={row.id}
            className="gap-3 rounded-2xl border border-dono-border bg-white p-5"
          >
            <View className="flex-row flex-wrap gap-2">
              <AdminStatusChip label="Edit pending" tone="pending" />
            </View>
            <Text className="font-retro-bold text-lg text-dono-text">
              {row.societyName}
            </Text>
            <Text className="text-xs text-dono-muted">
              Submitted {formatSubmittedAt(row.createdAt)} · /{row.societySlug}
            </Text>
            <View className="gap-2">
              {p.name !== undefined ? (
                <DiffRow label="Name" current={c.name} proposed={p.name} />
              ) : null}
              {p.description !== undefined ? (
                <DiffRow
                  label="Description"
                  current={c.description}
                  proposed={p.description}
                />
              ) : null}
              {p.story !== undefined ? (
                <DiffRow label="Story" current={c.story} proposed={p.story} />
              ) : null}
              {p.websiteUrl !== undefined ? (
                <DiffRow
                  label="Website"
                  current={c.websiteUrl}
                  proposed={p.websiteUrl}
                />
              ) : null}
              {p.secondaryLink !== undefined ? (
                <DiffRow
                  label="Secondary link"
                  current={c.secondaryLink}
                  proposed={p.secondaryLink}
                />
              ) : null}
              {p.socialUrl !== undefined ? (
                <DiffRow
                  label="Social URL"
                  current={c.socialUrl}
                  proposed={p.socialUrl}
                />
              ) : null}
              {p.coverImageStorageId !== undefined ? (
                <DiffRow
                  label="Cover image"
                  current={row.currentCoverUrl ? "Current cover" : "(none)"}
                  proposed={row.proposedCoverUrl ? "New cover uploaded" : "(none)"}
                />
              ) : null}
            </View>

            {rejectId === row.id ? (
              <View className="gap-2">
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Optional note to the owner…"
                  placeholderTextColor="#56615A"
                  className="rounded-xl border border-dono-border bg-white px-3 py-2 text-sm text-dono-text"
                />
                <View className="flex-row gap-2">
                  <Pressable
                    disabled={busy}
                    onPress={() =>
                      void handle(row.id as Id<"societyEditRequests">, "reject")
                    }
                    className="flex-row items-center gap-1 rounded-full bg-rose-600 px-3.5 py-2"
                  >
                    <X size={14} color="#fff" />
                    <Text className="font-retro-bold text-xs text-white">
                      Confirm reject
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setRejectId(null);
                      setNote("");
                    }}
                    className="rounded-full border border-dono-border px-3.5 py-2"
                  >
                    <Text className="font-retro-bold text-xs text-dono-muted">
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View className="flex-row gap-2">
                <Pressable
                  disabled={busy}
                  onPress={() =>
                    void handle(row.id as Id<"societyEditRequests">, "approve")
                  }
                  className="flex-row items-center gap-1 rounded-full bg-dono-primary px-3.5 py-2"
                >
                  <Check size={14} color="#fff" />
                  <Text className="font-retro-bold text-xs text-white">
                    Approve edits
                  </Text>
                </Pressable>
                <Pressable
                  disabled={busy}
                  onPress={() => setRejectId(row.id)}
                  className="flex-row items-center gap-1 rounded-full border border-rose-300 px-3.5 py-2"
                >
                  <X size={14} color="#be123c" />
                  <Text className="font-retro-bold text-xs text-rose-700">
                    Reject
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
