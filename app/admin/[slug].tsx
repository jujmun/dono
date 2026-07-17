import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import { useAction, useMutation, useQuery } from "convex/react";
import { type Href, Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  RefreshCw,
  RotateCcw,
  Send,
  Trash2,
  X,
} from "lucide-react-native";
import { api } from "@convex/_generated/api";
import { AdminShell } from "@/components/admin-shell";
import { CategoryBadge } from "@/components/ui/category-badge";
import {
  AdminStatusChip,
  humanCampaignStatus,
  moderationActionLabel,
  selfieMatchChip,
  statusChipTone,
  stripeStatusChip,
  type StripeVerificationStatus,
} from "@/lib/admin-labels";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { isPortalAdmin } from "@/lib/auth/is-portal-admin";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { formatCurrency } from "@/lib/constants";
import type { Campaign, CampaignCategory } from "@/lib/types";

type AdminReviewPayload = {
  campaign: Campaign;
  student: {
    userId: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  } | null;
  identity: {
    stripeVerificationStatus: StripeVerificationStatus;
    stripeVerificationLastErrorCode: string | null;
    stripeVerificationLastErrorReason: string | null;
    verifiedName: string | null;
    verifiedDob: string | null;
  };
  messages: {
    id: string;
    body: string;
    createdAt: number;
    emailSentAt: number | null;
  }[];
};

function formatMessageTime(ms: number) {
  return new Date(ms).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminCampaignReviewPage() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const profile = useCurrentProfile();
  const adminUser = isPortalAdmin(profile);
  const detail = useQuery(
    api.campaigns.getForAdmin,
    adminUser && slug ? { slug } : "skip",
  ) as AdminReviewPayload | null | undefined;
  const approve = useMutation(api.campaigns.approve);
  const reject = useMutation(api.campaigns.reject);
  const takeDown = useMutation(api.campaigns.takeDown);
  const restore = useMutation(api.campaigns.restore);
  const sendComment = useMutation(api.reviewMessages.send);
  const refreshIdentity = useAction(
    api.campaignIdentity.refreshVerificationStatus,
  );
  const [comment, setComment] = useState("");
  const [reason, setReason] = useState("");
  const [reasonMode, setReasonMode] = useState<"reject" | "takedown" | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState<
    "approve" | "reject" | "comment" | "takedown" | "restore" | "refresh" | null
  >(null);

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
          <Text className="font-display-medium text-2xl text-dono-text">
            Access denied
          </Text>
          <Pressable
            onPress={() => router.replace("/dashboard")}
            className="mt-6 items-center rounded-full bg-dono-primary py-3"
          >
            <Text className="font-sans-medium text-sm text-white">
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
          <Text className="text-center text-dono-muted">Campaign not found.</Text>
          <Link href={"/admin" as Href} asChild>
            <Pressable className="mt-4 items-center">
              <Text className="font-sans-medium text-dono-primary">
                Back to waiting posts
              </Text>
            </Pressable>
          </Link>
        </View>
      </AdminShell>
    );
  }

  const campaign = detail.campaign;
  const student = detail.student;
  const identity = detail.identity;
  const messages = detail.messages;
  const pending = campaign.status === "pending";
  const moderated = campaign.status === "rejected";
  const isLive =
    campaign.status === "active" ||
    campaign.status === "funded" ||
    campaign.status === "completed";

  const backHref = pending
    ? ("/admin" as Href)
    : moderated
      ? ("/admin/archive" as Href)
      : ("/admin/discover" as Href);
  const backLabel = pending
    ? "Back to waiting posts"
    : moderated
      ? "Back to removed"
      : "Back to live posts";

  const handleApprove = async () => {
    setError(null);
    setInfo(null);
    setBusy("approve");
    try {
      await approve({ slug: campaign.id });
      setInfo("Post approved and now live.");
      router.replace("/admin");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusy(null);
    }
  };

  const submitReason = async () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      setError("A reason is required.");
      return;
    }
    if (!reasonMode) return;
    setError(null);
    setInfo(null);
    setBusy(reasonMode === "reject" ? "reject" : "takedown");
    try {
      if (reasonMode === "reject") {
        await reject({ slug: campaign.id, reason: trimmed });
        router.replace("/admin");
      } else {
        await takeDown({ slug: campaign.id, reason: trimmed });
        router.replace("/admin/archive" as Href);
      }
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusy(null);
      setReasonMode(null);
      setReason("");
    }
  };

  const handleSendComment = async () => {
    const body = comment.trim();
    if (!body) {
      setError("Write a comment before sending.");
      return;
    }
    setError(null);
    setInfo(null);
    setBusy("comment");
    try {
      await sendComment({ slug: campaign.id, body });
      setComment("");
      setInfo("Comment sent to the student by email.");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusy(null);
    }
  };

  const handleRestore = async () => {
    setError(null);
    setInfo(null);
    setBusy("restore");
    try {
      await restore({ slug: campaign.id });
      router.replace("/admin/discover" as Href);
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusy(null);
    }
  };

  const handleRefreshIdentity = async () => {
    setError(null);
    setInfo(null);
    setBusy("refresh");
    try {
      await refreshIdentity({ slug: campaign.id });
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusy(null);
    }
  };

  const statusLabel = humanCampaignStatus(campaign);
  const actionBadge = moderated
    ? moderationActionLabel(campaign.moderationAction)
    : null;

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
          <CategoryBadge category={campaign.category as CampaignCategory} />
          <AdminStatusChip
            label={statusLabel}
            tone={statusChipTone(statusLabel)}
          />
          {actionBadge ? (
            <AdminStatusChip
              label={actionBadge}
              tone={statusChipTone(actionBadge)}
            />
          ) : null}
        </View>

        <Text className="font-display-medium text-2xl text-dono-text">
          {campaign.title}
        </Text>
        <Text className="mt-2 text-sm text-dono-muted">
          Goal {formatCurrency(campaign.goal)} · Submitted {campaign.createdAt} ·{" "}
          {campaign.university}
        </Text>

        {moderated && campaign.moderationNote ? (
          <View className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <Text className="font-sans-medium text-base text-rose-800">
              Why it was removed
            </Text>
            <Text className="mt-2 text-sm text-rose-900">
              {campaign.moderationNote}
            </Text>
            {campaign.moderatedAt ? (
              <Text className="mt-2 text-xs text-rose-700/80">
                {formatMessageTime(campaign.moderatedAt)}
              </Text>
            ) : null}
          </View>
        ) : null}

        <View className="mt-8 rounded-2xl border border-dono-border bg-white p-5">
          <Text className="font-sans-medium text-base text-dono-text">
            Student
          </Text>
          {student ? (
            <Pressable
              onPress={() =>
                router.push(
                  `/admin/students/${encodeURIComponent(student.userId)}` as Href,
                )
              }
              className="mt-4 flex-row items-center gap-4"
              accessibilityRole="button"
              accessibilityLabel={`View student ${student.name || student.email}`}
            >
              {student.avatarUrl ? (
                <Image
                  source={{ uri: student.avatarUrl }}
                  className="h-14 w-14 rounded-full"
                />
              ) : (
                <View className="h-14 w-14 items-center justify-center rounded-full bg-dono-primary/10">
                  <Text className="font-mono-medium text-dono-primary">
                    {(student.name || student.email || "?")
                      .slice(0, 2)
                      .toUpperCase()}
                  </Text>
                </View>
              )}
              <View className="flex-1">
                <Text className="font-sans-medium text-dono-text">
                  {student.name || "Unnamed student"}
                </Text>
                <Text className="mt-1 text-sm text-dono-muted">
                  {student.email}
                </Text>
                <Text className="mt-1 text-xs text-dono-muted">
                  View student
                </Text>
              </View>
              <ChevronRight size={20} color="#56615A" />
            </Pressable>
          ) : (
            <Text className="mt-3 text-sm text-dono-muted">
              No linked student account. Shown as {campaign.creator.name}.
            </Text>
          )}
        </View>

        <View className="mt-6 rounded-2xl border border-dono-border bg-white p-5">
          <View className="flex-row flex-wrap items-center justify-between gap-2">
            <Text className="font-sans-medium text-base text-dono-text">
              Identity check
            </Text>
            <View className="flex-row items-center gap-2">
              <AdminStatusChip
                label={stripeStatusChip(identity.stripeVerificationStatus).label}
                tone={stripeStatusChip(identity.stripeVerificationStatus).tone}
              />
              <Pressable
                onPress={() => void handleRefreshIdentity()}
                disabled={busy !== null || !identity.stripeVerificationStatus}
                accessibilityLabel="Refresh verification status from Stripe"
                className={`h-6 w-6 items-center justify-center rounded-full border border-dono-border ${
                  busy !== null || !identity.stripeVerificationStatus
                    ? "opacity-50"
                    : ""
                }`}
              >
                {busy === "refresh" ? (
                  <ActivityIndicator size="small" color="#17211B" />
                ) : (
                  <RefreshCw size={12} color="#56615A" />
                )}
              </Pressable>
            </View>
          </View>
          <Text className="mt-1 text-sm text-dono-muted">
            Stripe Identity result for the student who created this campaign —
            photo ID plus a matching selfie.
          </Text>

          <View className="mt-3 flex-row flex-wrap gap-2">
            <AdminStatusChip
              label={selfieMatchChip(identity).label}
              tone={selfieMatchChip(identity).tone}
            />
          </View>

          {identity.verifiedName || identity.verifiedDob ? (
            <View className="mt-3 rounded-lg border border-dono-border bg-dono-surface-muted px-3 py-2">
              <Text className="text-xs font-sans-medium text-dono-muted">
                Auto-extracted from ID (Stripe) — reference only, not verified
                ground truth
              </Text>
              {identity.verifiedName ? (
                <Text className="mt-1 text-sm text-dono-text">
                  Name: {identity.verifiedName}
                </Text>
              ) : null}
              {identity.verifiedDob ? (
                <Text className="text-sm text-dono-text">
                  DOB: {identity.verifiedDob}
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>

        <View className="mt-6 rounded-2xl border border-dono-border bg-white p-5">
          <Text className="font-sans-medium text-base text-dono-text">
            Short description
          </Text>
          <Text className="mt-3 text-sm text-dono-text">{campaign.description}</Text>
          <Text className="mt-6 font-sans-medium text-base text-dono-text">
            Full story
          </Text>
          <Text className="mt-3 text-sm leading-6 text-dono-text">
            {campaign.story}
          </Text>
        </View>

        <View className="mt-6 rounded-2xl border border-dono-border bg-white p-5">
          <Text className="font-sans-medium text-base text-dono-text">
            Comments to student
          </Text>
          <Text className="mt-1 text-sm text-dono-muted">
            Feedback is emailed to the student and kept on this review thread.
          </Text>

          {messages.length === 0 ? (
            <Text className="mt-4 text-sm text-dono-muted">
              No comments yet.
            </Text>
          ) : (
            <View className="mt-4 gap-3">
              {messages.map((message) => (
                <View
                  key={message.id}
                  className="rounded-xl bg-dono-surface-muted px-4 py-3"
                >
                  <Text className="text-sm text-dono-text">{message.body}</Text>
                  <Text className="mt-2 text-xs text-dono-muted">
                    {formatMessageTime(message.createdAt)}
                    {message.emailSentAt ? " · emailed" : ""}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <TextInput
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            placeholder="Ask for changes, clarify requirements, or share next steps..."
            placeholderTextColor="#56615A"
            className="mt-4 min-h-[100px] rounded-xl border border-dono-border px-4 py-3 text-sm text-dono-text"
            textAlignVertical="top"
          />
          <View className="mt-3 flex-row items-center justify-between gap-3">
            {!student ? (
              <Text className="flex-1 text-xs text-dono-muted">
                Comments need a linked student account with an email address.
              </Text>
            ) : (
              <View className="flex-1" />
            )}
            <Pressable
              onPress={() => {
                void handleSendComment();
              }}
              disabled={busy !== null || !student || !comment.trim()}
              className={`flex-row items-center gap-2 rounded-xl border border-dono-border bg-dono-surface-muted px-4 py-2.5 ${
                busy !== null || !student || !comment.trim() ? "opacity-50" : ""
              }`}
            >
              <Send size={15} color="#17211B" />
              <Text className="font-sans-medium text-sm text-dono-text">
                {busy === "comment" ? "Sending..." : "Send"}
              </Text>
            </Pressable>
          </View>
        </View>

        {error ? (
          <View className="mt-4 rounded-xl bg-rose-50 px-4 py-3">
            <Text className="text-sm text-rose-700">{error}</Text>
          </View>
        ) : null}
        {info ? (
          <View className="mt-4 rounded-xl bg-green-50 px-4 py-3">
            <Text className="text-sm text-green-700">{info}</Text>
          </View>
        ) : null}

        {reasonMode ? (
          <View className="mt-8 rounded-2xl border border-rose-200 bg-white p-5">
            <Text className="font-sans-medium text-base text-dono-text">
              {reasonMode === "reject"
                ? "Why are you denying this?"
                : "Why are you removing this?"}
            </Text>
            <Text className="mt-1 text-sm text-dono-muted">
              Required. The student will get this by email.
            </Text>
            <TextInput
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              placeholder="Explain what needs to change or why this was removed…"
              placeholderTextColor="#56615A"
              className="mt-4 min-h-[100px] rounded-xl border border-dono-border px-4 py-3 text-sm text-dono-text"
              textAlignVertical="top"
              maxLength={1000}
            />
            <View className="mt-4 flex-row justify-end gap-2">
              <Pressable
                onPress={() => {
                  setReasonMode(null);
                  setReason("");
                  setError(null);
                }}
                disabled={busy !== null}
                className="rounded-xl px-4 py-2.5"
              >
                <Text className="font-sans-medium text-sm text-dono-muted">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  void submitReason();
                }}
                disabled={busy !== null || !reason.trim()}
                className={`flex-row items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 ${
                  busy !== null || !reason.trim() ? "opacity-50" : ""
                }`}
              >
                {reasonMode === "reject" ? (
                  <X size={15} color="#fff" />
                ) : (
                  <Trash2 size={15} color="#fff" />
                )}
                <Text className="font-sans-medium text-sm text-white">
                  {busy === "reject" || busy === "takedown"
                    ? "Working..."
                    : reasonMode === "reject"
                      ? "Confirm deny"
                      : "Confirm remove"}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {(pending || isLive || moderated) && !reasonMode ? (
          <View className="mt-8 rounded-2xl border border-dono-border bg-white p-5">
            <Text className="font-sans-medium text-base text-dono-text">
              Your decision
            </Text>
            <Text className="mt-1 text-sm text-dono-muted">
              {pending
                ? "Approve to publish, or deny with a reason."
                : moderated
                  ? "Put this post back on the site."
                  : "Remove this post from the site."}
            </Text>

            {pending ? (
              <View className="mt-4 flex-row gap-2">
                <Pressable
                  onPress={() => {
                    void handleApprove();
                  }}
                  disabled={busy !== null}
                  className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-dono-primary py-3 ${
                    busy !== null ? "opacity-50" : ""
                  }`}
                >
                  <Check size={16} color="#fff" />
                  <Text className="font-sans-medium text-sm text-white">
                    {busy === "approve" ? "Working..." : "Approve"}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setError(null);
                    setReason("");
                    setReasonMode("reject");
                  }}
                  disabled={busy !== null}
                  className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3 ${
                    busy !== null ? "opacity-50" : ""
                  }`}
                >
                  <X size={16} color="#be123c" />
                  <Text className="font-sans-medium text-sm text-rose-700">
                    Deny
                  </Text>
                </Pressable>
              </View>
            ) : null}

            {isLive ? (
              <Pressable
                onPress={() => {
                  setError(null);
                  setReason("");
                  setReasonMode("takedown");
                }}
                disabled={busy !== null}
                className={`mt-4 flex-row items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3 ${
                  busy !== null ? "opacity-50" : ""
                }`}
              >
                <Trash2 size={16} color="#be123c" />
                <Text className="font-sans-medium text-sm text-rose-700">
                  Remove from site
                </Text>
              </Pressable>
            ) : null}

            {moderated ? (
              <Pressable
                onPress={() => {
                  void handleRestore();
                }}
                disabled={busy !== null}
                className={`mt-4 flex-row items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 ${
                  busy !== null ? "opacity-50" : ""
                }`}
              >
                <RotateCcw size={16} color="#fff" />
                <Text className="font-sans-medium text-sm text-white">
                  {busy === "restore" ? "Working..." : "Put back live"}
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>
    </AdminShell>
  );
}
