import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import { useMutation, useQuery } from "convex/react";
import { type Href, Link, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Check, Send, X } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import { AppShell } from "@/components/app-shell";
import { CategoryBadge } from "@/components/ui/category-badge";
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
  const sendComment = useMutation(api.reviewMessages.send);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState<"approve" | "reject" | "comment" | null>(
    null,
  );

  if (profile === undefined || (adminUser && detail === undefined)) {
    return (
      <AppShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#1d242f" />
          <Text className="mt-4 text-dono-muted">Loading review...</Text>
        </View>
      </AppShell>
    );
  }

  if (!adminUser) {
    return (
      <AppShell>
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
      </AppShell>
    );
  }

  if (!detail) {
    return (
      <AppShell>
        <View className="mx-auto w-full max-w-lg px-4 py-16">
          <Text className="text-center text-dono-muted">Campaign not found.</Text>
          <Link href={"/admin" as Href} asChild>
            <Pressable className="mt-4 items-center">
              <Text className="font-sans-medium text-dono-primary">
                Back to review queue
              </Text>
            </Pressable>
          </Link>
        </View>
      </AppShell>
    );
  }

  const campaign = detail.campaign;
  const student = detail.student;
  const messages = detail.messages;
  const pending = campaign.status === "pending";

  const handleDecision = async (decision: "approve" | "reject") => {
    setError(null);
    setInfo(null);
    setBusy(decision);
    try {
      if (decision === "approve") {
        await approve({ slug: campaign.id });
        setInfo("Campaign accepted and now public.");
      } else {
        await reject({ slug: campaign.id });
        setInfo("Campaign denied.");
      }
      router.replace("/admin");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusy(null);
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

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-3xl px-4 py-8">
        <Link href={"/admin" as Href} asChild>
          <Pressable className="mb-6 flex-row items-center gap-2">
            <ArrowLeft size={16} color="#5e6473" />
            <Text className="text-sm text-dono-muted">Back to queue</Text>
          </Pressable>
        </Link>

        <View className="mb-6 flex-row flex-wrap items-center gap-2">
          <CategoryBadge category={campaign.category as CampaignCategory} />
          <Text className="text-xs uppercase text-dono-muted">
            {campaign.status}
          </Text>
        </View>

        <Text className="font-display-medium text-2xl text-dono-text">
          {campaign.title}
        </Text>
        <Text className="mt-2 text-sm text-dono-muted">
          Goal {formatCurrency(campaign.goal)} · Submitted {campaign.createdAt} ·{" "}
          {campaign.university}
        </Text>

        <View className="mt-8 rounded-2xl border border-dono-border bg-white p-5">
          <Text className="font-sans-medium text-base text-dono-text">
            Student profile
          </Text>
          {student ? (
            <View className="mt-4 flex-row items-center gap-4">
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
                  Listed as {campaign.creator.name} ({campaign.creator.type})
                </Text>
              </View>
            </View>
          ) : (
            <Text className="mt-3 text-sm text-dono-muted">
              No linked student profile for this campaign. Creator shown as{" "}
              {campaign.creator.name}.
            </Text>
          )}
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
            placeholderTextColor="#5e6473"
            className="mt-4 min-h-[100px] rounded-xl border border-dono-border px-4 py-3 text-sm text-dono-text"
            textAlignVertical="top"
          />
          <Pressable
            onPress={() => {
              void handleSendComment();
            }}
            disabled={busy !== null || !student}
            className={`mt-3 flex-row items-center justify-center gap-2 rounded-full bg-dono-primary py-3 ${
              busy !== null || !student ? "opacity-50" : ""
            }`}
          >
            <Send size={16} color="#fff" />
            <Text className="font-sans-medium text-sm text-white">
              {busy === "comment" ? "Sending..." : "Send comment"}
            </Text>
          </Pressable>
          {!student ? (
            <Text className="mt-2 text-xs text-dono-muted">
              Comments need a linked student account with an email address.
            </Text>
          ) : null}
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

        {pending ? (
          <View className="mt-6 flex-row gap-3">
            <Pressable
              onPress={() => {
                void handleDecision("approve");
              }}
              disabled={busy !== null}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-full bg-dono-primary py-3 ${
                busy !== null ? "opacity-50" : ""
              }`}
            >
              <Check size={16} color="#fff" />
              <Text className="font-sans-medium text-sm text-white">
                {busy === "approve" ? "Working..." : "Accept"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                void handleDecision("reject");
              }}
              disabled={busy !== null}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 py-3 ${
                busy !== null ? "opacity-50" : ""
              }`}
            >
              <X size={16} color="#be123c" />
              <Text className="font-sans-medium text-sm text-rose-700">
                {busy === "reject" ? "Working..." : "Deny"}
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </AppShell>
  );
}
