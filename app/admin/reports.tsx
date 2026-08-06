import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, TextInput } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { type Href, Link } from "expo-router";
import { Check, ChevronRight, Trash2, X } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { AdminShell } from "@/components/admin-shell";
import { AdminStatusChip } from "@/lib/admin-labels";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { canAccessAdminPortal } from "@/lib/auth/is-portal-admin";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { cn } from "@/lib/utils";

function formatReportedAt(ms: number) {
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function targetTypeLabel(targetType: "comment" | "campaign" | "society") {
  if (targetType === "comment") return "Comment";
  if (targetType === "campaign") return "Campaign";
  return "Society";
}

/**
 * Campaign/society reports deep-link straight into their existing admin
 * moderation pages (approve/reject/take down/restore already live there).
 * Comments have no admin moderation page, so they link to the public
 * campaign thread for context — deletion itself happens inline below.
 */
function targetHref(report: {
  targetType: "comment" | "campaign" | "society";
  campaignSlug?: string | null;
  societySlug?: string | null;
}): { href: Href; label: string } | null {
  if (report.targetType === "campaign" && report.campaignSlug) {
    return {
      href: `/admin/${encodeURIComponent(report.campaignSlug)}` as Href,
      label: "Moderate campaign",
    };
  }
  if (report.targetType === "comment" && report.campaignSlug) {
    return {
      href: `/campaigns/${encodeURIComponent(report.campaignSlug)}` as Href,
      label: "View on campaign",
    };
  }
  if (report.targetType === "society" && report.societySlug) {
    return {
      href: `/admin/societies/${encodeURIComponent(report.societySlug)}` as Href,
      label: "Moderate society",
    };
  }
  return null;
}

export default function AdminReportsPage() {
  const profile = useCurrentProfile();
  const adminUser = canAccessAdminPortal(profile);

  const reports = useQuery(
    api.reports.listOpenForAdmin,
    adminUser ? {} : "skip",
  );
  const resolveReport = useMutation(api.reports.resolveReport);
  const deleteComment = useMutation(api.engagement.deleteComment);

  const [noteOpenId, setNoteOpenId] = useState<Id<"contentReports"> | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<{
    id: Id<"contentReports">;
    resolution: "resolved" | "dismissed";
  } | null>(null);
  const [deletingCommentId, setDeletingCommentId] =
    useState<Id<"campaignComments"> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResolve = async (
    id: Id<"contentReports">,
    resolution: "resolved" | "dismissed",
  ) => {
    setError(null);
    setBusy({ id, resolution });
    try {
      await resolveReport({
        reportId: id,
        resolution,
        note: note.trim() || undefined,
      });
      if (noteOpenId === id) {
        setNoteOpenId(null);
        setNote("");
      }
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusy(null);
    }
  };

  const handleDeleteComment = async (commentId: Id<"campaignComments">) => {
    setError(null);
    setDeletingCommentId(commentId);
    try {
      await deleteComment({ commentId });
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setDeletingCommentId(null);
    }
  };

  if (profile === undefined) {
    return (
      <AdminShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
          <Text className="mt-4 text-dono-muted">Loading...</Text>
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
          <Text className="mt-2 text-dono-muted">
            This portal is only available to outreach admins.
          </Text>
        </View>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <View className="mx-auto w-full max-w-3xl px-4 py-8">
        <Text className="mb-1 font-retro-bold text-2xl text-dono-text">
          Reports
        </Text>
        <Text className="mb-6 text-sm text-dono-muted">
          Content reported by users, awaiting review.
        </Text>

        {error ? (
          <View className="mb-4 rounded-xl bg-rose-50 px-4 py-3">
            <Text className="text-sm text-rose-700">{error}</Text>
          </View>
        ) : null}

        {reports === undefined ? (
          <View className="items-center py-12">
            <ActivityIndicator color="#17211B" />
            <Text className="mt-4 text-dono-muted">Loading reports...</Text>
          </View>
        ) : reports.length === 0 ? (
          <View className="rounded-2xl border border-dono-border bg-white px-6 py-10">
            <Text className="font-retro-bold text-base text-dono-text">
              No open reports
            </Text>
            <Text className="mt-2 text-sm text-dono-muted">
              Reported comments, campaigns, and societies will show up here.
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {reports.map((report) => {
              const busyHere = busy?.id === report.id;
              const noteOpen = noteOpenId === report.id;
              const target = targetHref(report);
              const deletingThisComment =
                report.commentId != null && deletingCommentId === report.commentId;

              return (
                <View
                  key={report.id}
                  className="rounded-2xl border border-dono-border bg-white p-5"
                >
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="min-w-0 flex-1">
                      <View className="mb-2 flex-row flex-wrap items-center gap-2">
                        <AdminStatusChip
                          label={targetTypeLabel(report.targetType)}
                          tone="neutral"
                        />
                        <Text className="text-xs text-dono-muted">
                          Reported {formatReportedAt(report.createdAt)}
                        </Text>
                      </View>
                      <Text className="font-retro-bold text-base text-dono-text">
                        {report.targetTitle ?? "Content no longer available"}
                      </Text>
                      <Text className="mt-0.5 text-xs text-dono-muted">
                        Reported by{" "}
                        {report.reporterName ?? report.reporterEmail ?? "Unknown user"}
                      </Text>
                    </View>
                  </View>

                  {target ? (
                    <Link href={target.href} asChild>
                      <Pressable
                        accessibilityLabel={target.label}
                        className="mt-3 flex-row items-center gap-1 self-start rounded-full border border-dono-border bg-white px-3 py-1.5"
                      >
                        <Text className="font-retro-bold text-xs text-dono-text">
                          {target.label}
                        </Text>
                        <ChevronRight size={13} color="#56615A" />
                      </Pressable>
                    </Link>
                  ) : null}

                  {report.commentSnippet ? (
                    <View className="mt-3 rounded-xl border border-dono-border bg-dono-surface-muted px-4 py-3">
                      <Text className="text-sm italic text-dono-text">
                        &quot;{report.commentSnippet}&quot;
                      </Text>
                    </View>
                  ) : null}

                  <View className="mt-3 rounded-xl bg-rose-50 px-4 py-3">
                    <Text className="text-xs font-retro-bold text-rose-700">
                      Reason
                    </Text>
                    <Text className="mt-1 text-sm text-rose-900">{report.reason}</Text>
                  </View>

                  {noteOpen ? (
                    <View className="mt-3">
                      <TextInput
                        value={note}
                        onChangeText={setNote}
                        multiline
                        placeholder="Optional note for the record…"
                        placeholderTextColor="#56615A"
                        maxLength={2000}
                        className="min-h-[64px] rounded-xl border border-dono-border px-3 py-2.5 text-sm text-dono-text"
                        textAlignVertical="top"
                      />
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => {
                        setNoteOpenId(report.id);
                        setNote("");
                      }}
                      className="mt-3 self-start"
                    >
                      <Text className="text-xs font-retro-bold text-dono-primary">
                        Add note
                      </Text>
                    </Pressable>
                  )}

                  {report.targetType === "comment" && report.commentId ? (
                    <Pressable
                      onPress={() => void handleDeleteComment(report.commentId!)}
                      disabled={deletingCommentId !== null}
                      className={cn(
                        "mt-3 flex-row items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50 py-3",
                        deletingCommentId !== null ? "opacity-50" : "",
                      )}
                    >
                      {deletingThisComment ? (
                        <ActivityIndicator size="small" color="#be123c" />
                      ) : (
                        <Trash2 size={16} color="#be123c" />
                      )}
                      <Text className="font-retro-bold text-sm text-rose-700">
                        {deletingThisComment ? "Deleting..." : "Delete comment"}
                      </Text>
                    </Pressable>
                  ) : null}

                  <View className="mt-4 flex-row gap-2">
                    <Pressable
                      onPress={() => void handleResolve(report.id, "resolved")}
                      disabled={busy !== null}
                      className={cn(
                        "flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-dono-primary py-3",
                        busy !== null ? "opacity-50" : "",
                      )}
                    >
                      {busyHere && busy?.resolution === "resolved" ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Check size={16} color="#fff" />
                      )}
                      <Text className="font-retro-bold text-sm text-white">
                        Resolve
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => void handleResolve(report.id, "dismissed")}
                      disabled={busy !== null}
                      className={cn(
                        "flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-dono-border bg-white py-3",
                        busy !== null ? "opacity-50" : "",
                      )}
                    >
                      {busyHere && busy?.resolution === "dismissed" ? (
                        <ActivityIndicator size="small" color="#17211B" />
                      ) : (
                        <X size={16} color="#56615A" />
                      )}
                      <Text className="font-retro-bold text-sm text-dono-text">
                        Dismiss
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </AdminShell>
  );
}
