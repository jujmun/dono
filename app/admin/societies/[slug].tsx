import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, TextInput, Linking } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { type Href, Link, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Globe, IdCard, Link2, Paperclip, RotateCcw, Trash2 } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { AdminShell } from "@/components/admin-shell";
import { AdminHardDeleteDialog } from "@/components/admin-hard-delete-dialog";
import { AdminMessageThread } from "@/components/admin-message-thread";
import {
  AdminStatusChip,
  humanSocietyStatus,
  moderationActionLabel,
  selfieMatchChip,
  statusChipTone,
  stripeStatusChip,
} from "@/lib/admin-labels";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { isPortalAdmin } from "@/lib/auth/is-portal-admin";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import type { AdminSociety } from "@/lib/types";

type AdminSocietyDetail = {
  society: AdminSociety;
  creatorId: string;
  counts: {
    members: number;
    followers: number;
    campaigns: number;
    hasConnectAccount: boolean;
    connectHasActivity: boolean;
  };
};

function formatModeratedAt(ms: number | null) {
  if (!ms) return null;
  return new Date(ms).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminSocietyReviewPage() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const profile = useCurrentProfile();
  const adminUser = isPortalAdmin(profile);
  const detail = useQuery(
    api.societies.getForAdmin,
    adminUser && slug ? { slug } : "skip",
  ) as AdminSocietyDetail | null | undefined;
  const takeDown = useMutation(api.societies.takeDown);
  const restore = useMutation(api.societies.restore);
  const hardDelete = useMutation(api.societies.hardDelete);

  const [reason, setReason] = useState("");
  const [reasonMode, setReasonMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"takedown" | "restore" | null>(null);

  if (profile === undefined || (adminUser && detail === undefined)) {
    return (
      <AdminShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
          <Text className="mt-4 text-dono-muted">Loading review...</Text>
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
          <Pressable
            onPress={() => router.replace("/dashboard")}
            className="mt-6 items-center rounded-full bg-dono-primary py-3"
          >
            <Text className="font-retro-bold text-sm text-white">
              Back to dashboard
            </Text>
          </Pressable>
        </View>
      </AdminShell>
    );
  }

  if (!detail) {
    return (
      <AdminShell>
        <View className="mx-auto w-full max-w-lg px-4 py-16">
          <Text className="text-center text-dono-muted">Society not found.</Text>
          <Link href={"/admin" as Href} asChild>
            <Pressable className="mt-4 items-center">
              <Text className="font-retro-bold text-dono-primary">
                Back to pending
              </Text>
            </Pressable>
          </Link>
        </View>
      </AdminShell>
    );
  }

  const society = detail.society;
  const isLive = society.status === "active";
  const moderated = society.status === "rejected";

  if (society.status === "pending") {
    return (
      <AdminShell>
        <View className="mx-auto w-full max-w-lg px-4 py-16">
          <Text className="text-center text-dono-muted">
            This society is still awaiting its first review — approve or deny
            it from the Pending tab.
          </Text>
          <Link href={"/admin" as Href} asChild>
            <Pressable className="mt-4 items-center">
              <Text className="font-retro-bold text-dono-primary">
                Go to Pending
              </Text>
            </Pressable>
          </Link>
        </View>
      </AdminShell>
    );
  }

  const backHref = moderated ? ("/admin/archive" as Href) : ("/admin/discover" as Href);
  const backLabel = moderated ? "Back to removed" : "Back to live posts";
  const statusLabel = humanSocietyStatus(society);
  const actionBadge = moderated ? moderationActionLabel(society.moderationAction) : null;

  const handleTakeDown = async () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      setError("A reason is required.");
      return;
    }
    setError(null);
    setBusy("takedown");
    try {
      await takeDown({ slug: society.slug, reason: trimmed });
      router.replace("/admin/archive" as Href);
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusy(null);
      setReasonMode(false);
      setReason("");
    }
  };

  const handleRestore = async () => {
    setError(null);
    setBusy("restore");
    try {
      await restore({ slug: society.slug });
      router.replace("/admin/discover" as Href);
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusy(null);
    }
  };

  return (
    <AdminShell>
      <View className="mx-auto w-full max-w-3xl px-4 py-8">
        <Link href={backHref} asChild>
          <Pressable className="mb-6 flex-row items-center gap-2">
            <ArrowLeft size={16} color="#56615A" />
            <Text className="text-sm text-dono-muted">{backLabel}</Text>
          </Pressable>
        </Link>

        <View className="mb-6 flex-row flex-wrap items-center gap-2">
          <AdminStatusChip label={statusLabel} tone={statusChipTone(statusLabel)} />
          {actionBadge ? (
            <AdminStatusChip label={actionBadge} tone={statusChipTone(actionBadge)} />
          ) : null}
        </View>

        <Text className="font-retro-bold text-2xl text-dono-text">{society.name}</Text>
        <Text className="mt-2 text-sm text-dono-muted">{society.description}</Text>

        {moderated && society.moderationNote ? (
          <View className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <Text className="font-retro-bold text-base text-rose-800">
              Why it was removed
            </Text>
            <Text className="mt-2 text-sm text-rose-900">{society.moderationNote}</Text>
            {society.moderatedAt ? (
              <Text className="mt-2 text-xs text-rose-700/80">
                {formatModeratedAt(society.moderatedAt)}
              </Text>
            ) : null}
          </View>
        ) : null}

        <View className="mt-6 rounded-2xl border border-dono-border bg-white p-5">
          <Text className="font-retro-bold text-base text-dono-text">Overview</Text>
          <Text className="mt-2 text-sm text-dono-text">
            {detail.counts.members} member{detail.counts.members === 1 ? "" : "s"} ·{" "}
            {detail.counts.followers} follower{detail.counts.followers === 1 ? "" : "s"} ·{" "}
            {detail.counts.campaigns} campaign{detail.counts.campaigns === 1 ? "" : "s"}
          </Text>
          <View className="mt-4 gap-2">
            {society.websiteUrl ? (
              <Pressable
                onPress={() => void Linking.openURL(society.websiteUrl)}
                className="flex-row items-center gap-2"
              >
                <Globe size={14} color="#56615A" />
                <Text className="flex-1 text-sm text-dono-primary" numberOfLines={1}>
                  {society.websiteUrl}
                </Text>
              </Pressable>
            ) : null}
            {society.secondaryLink ? (
              <Pressable
                onPress={() => void Linking.openURL(society.secondaryLink!)}
                className="flex-row items-center gap-2"
              >
                <Link2 size={14} color="#56615A" />
                <Text className="flex-1 text-sm text-dono-primary" numberOfLines={1}>
                  {society.secondaryLink}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        <View className="mt-6 rounded-2xl border border-dono-border bg-white p-5">
          <Text className="mb-2 font-retro-bold text-sm text-dono-text">
            Verification documents
          </Text>
          {society.supportingDocumentUrls.length === 0 ? (
            <Text className="text-sm text-dono-muted">No supporting documents on file.</Text>
          ) : (
            <View className="gap-1.5">
              {society.supportingDocumentUrls.map((url, index) => (
                <Pressable
                  key={url}
                  onPress={() => void Linking.openURL(url)}
                  className="flex-row items-center gap-2"
                >
                  <Paperclip size={14} color="#17211B" />
                  <Text className="text-sm text-dono-primary">
                    Supporting document {index + 1}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
          <View className="mt-2 flex-row flex-wrap items-center justify-between gap-2 border-t border-dono-border pt-2">
            {society.idDocumentUrl ? (
              <Pressable
                onPress={() => void Linking.openURL(society.idDocumentUrl!)}
                className="flex-row items-center gap-2"
              >
                <IdCard size={14} color="#17211B" />
                <Text className="text-sm text-dono-primary">View ID document</Text>
              </Pressable>
            ) : (
              <Text className="text-sm text-dono-muted">ID document unavailable.</Text>
            )}
            <AdminStatusChip
              label={stripeStatusChip(society.stripeVerificationStatus).label}
              tone={stripeStatusChip(society.stripeVerificationStatus).tone}
            />
          </View>
          <View className="mt-2 flex-row flex-wrap gap-2">
            <AdminStatusChip
              label={selfieMatchChip(society).label}
              tone={selfieMatchChip(society).tone}
            />
          </View>
        </View>

        <View className="mt-6 rounded-2xl border border-dono-border bg-white p-5">
          <AdminMessageThread userId={society.creatorId as Id<"users">} />
        </View>

        {error ? (
          <View className="mt-4 rounded-xl bg-rose-50 px-4 py-3">
            <Text className="text-sm text-rose-700">{error}</Text>
          </View>
        ) : null}

        {reasonMode ? (
          <View className="mt-8 rounded-2xl border border-rose-200 bg-white p-5">
            <Text className="font-retro-bold text-base text-dono-text">
              Why are you removing this?
            </Text>
            <Text className="mt-1 text-sm text-dono-muted">
              Required. The society leader will get this by email.
            </Text>
            <TextInput
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              placeholder="Explain why this society is being taken down…"
              placeholderTextColor="#56615A"
              className="mt-4 min-h-[100px] rounded-xl border border-dono-border px-4 py-3 text-sm text-dono-text"
              textAlignVertical="top"
              maxLength={1000}
            />
            <View className="mt-4 flex-row justify-end gap-2">
              <Pressable
                onPress={() => {
                  setReasonMode(false);
                  setReason("");
                  setError(null);
                }}
                disabled={busy !== null}
                className="rounded-xl px-4 py-2.5"
              >
                <Text className="font-retro-bold text-sm text-dono-muted">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => void handleTakeDown()}
                disabled={busy !== null || !reason.trim()}
                className={`flex-row items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 ${
                  busy !== null || !reason.trim() ? "opacity-50" : ""
                }`}
              >
                <Trash2 size={15} color="#fff" />
                <Text className="font-retro-bold text-sm text-white">
                  {busy === "takedown" ? "Working..." : "Confirm remove"}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View className="mt-8 rounded-2xl border border-dono-border bg-white p-5">
            <Text className="font-retro-bold text-base text-dono-text">
              Your decision
            </Text>
            <Text className="mt-1 text-sm text-dono-muted">
              {isLive
                ? "Remove this society from the site."
                : "Put this society back live, or delete it for good."}
            </Text>

            {isLive ? (
              <Pressable
                onPress={() => {
                  setError(null);
                  setReason("");
                  setReasonMode(true);
                }}
                disabled={busy !== null}
                className={`mt-4 flex-row items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3 ${
                  busy !== null ? "opacity-50" : ""
                }`}
              >
                <Trash2 size={16} color="#be123c" />
                <Text className="font-retro-bold text-sm text-rose-700">
                  Remove from site
                </Text>
              </Pressable>
            ) : null}

            {moderated ? (
              <>
                <Pressable
                  onPress={() => void handleRestore()}
                  disabled={busy !== null}
                  className={`mt-4 flex-row items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 ${
                    busy !== null ? "opacity-50" : ""
                  }`}
                >
                  <RotateCcw size={16} color="#fff" />
                  <Text className="font-retro-bold text-sm text-white">
                    {busy === "restore" ? "Working..." : "Put back live"}
                  </Text>
                </Pressable>

                <AdminHardDeleteDialog
                  entityLabel="society"
                  entityName={society.name}
                  blockedReason={
                    detail.counts.campaigns > 0
                      ? "This society still has campaigns attached and cannot be permanently deleted. Remove or delete those first."
                      : detail.counts.connectHasActivity
                        ? "This society has an active Stripe payout account and cannot be permanently deleted."
                        : null
                  }
                  cascadeSummary={[
                    `${detail.counts.members} member${detail.counts.members === 1 ? "" : "s"}`,
                    `${detail.counts.followers} follower${detail.counts.followers === 1 ? "" : "s"}`,
                    "Its public society listing",
                    "Verification documents on file",
                    detail.counts.hasConnectAccount
                      ? "Its (inactive) Stripe Connect account record"
                      : null,
                  ].filter((line): line is string => Boolean(line))}
                  onConfirm={async () => {
                    await hardDelete({
                      slug: society.slug,
                      confirmName: society.name,
                    });
                    router.replace("/admin/archive" as Href);
                  }}
                />
              </>
            ) : null}
          </View>
        )}
      </View>
    </AdminShell>
  );
}
