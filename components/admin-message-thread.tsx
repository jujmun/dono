import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { Send } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { cn } from "@/lib/utils";

const GENERAL_GROUP_KEY = "__general__";

function formatMessageTime(ms: number) {
  return new Date(ms).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface GroupableItem {
  relatedEntityId?: string;
  relatedEntityTitle: string | null;
}

/** Groups thread items by campaign (first-occurrence order), chronological
 * within each group — this is the "subdivided by campaign" view, so a
 * multi-campaign student's history doesn't read as one undifferentiated feed. */
function groupThreadItems<T extends GroupableItem>(items: T[]) {
  const groups: { key: string; title: string; items: T[] }[] = [];
  const indexByKey = new Map<string, number>();
  for (const item of items) {
    const key = item.relatedEntityId ?? GENERAL_GROUP_KEY;
    let idx = indexByKey.get(key);
    if (idx === undefined) {
      idx = groups.length;
      indexByKey.set(key, idx);
      groups.push({
        key,
        title: key === GENERAL_GROUP_KEY ? "General" : (item.relatedEntityTitle ?? "Campaign"),
        items: [],
      });
    }
    groups[idx].items.push(item);
  }
  return groups;
}

interface AdminMessageThreadProps {
  userId: Id<"users">;
  /** Present only when opened from a campaign's review screen — shows the
   * "Request changes" toggle and tags the message to that campaign. Absent
   * for the general admin messages page, where there's no campaign context. */
  campaignContext?: { slug: string; title: string };
  className?: string;
}

/** The one conversation model for admin<->user messaging — every
 * admin_message with this user, chronological, regardless of which admin
 * sent it or which campaign (if any) prompted it. Used from both the
 * campaign review screen and the general admin messages page so there's a
 * single thread UI, not per-campaign isolated comment boxes. */
export function AdminMessageThread({
  userId,
  campaignContext,
  className,
}: AdminMessageThreadProps) {
  const thread = useQuery(api.notifications.listThreadWithUser, { userId });
  const sendFromAdmin = useMutation(api.notifications.sendFromAdmin);

  const [body, setBody] = useState("");
  const [requestChanges, setRequestChanges] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    setError(null);
    setSending(true);
    try {
      await sendFromAdmin({
        recipientUserId: userId,
        message: trimmed,
        ...(campaignContext
          ? {
              relatedEntityType: "campaign" as const,
              relatedEntityId: campaignContext.slug,
              isEditRequest: requestChanges,
            }
          : {}),
      });
      setBody("");
      setRequestChanges(false);
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <View className={className}>
      <Text className="font-retro-bold text-base text-dono-text">
        {thread ? thread.recipient.name || thread.recipient.email : "Conversation"}
      </Text>
      {thread?.recipient.email ? (
        <Text className="text-xs text-dono-muted">{thread.recipient.email}</Text>
      ) : null}

      <View className="mt-3 gap-4">
        {thread === undefined ? (
          <View className="items-center py-8">
            <ActivityIndicator color="#17211B" />
          </View>
        ) : thread.items.length === 0 ? (
          <Text className="text-sm text-dono-muted">No messages yet.</Text>
        ) : (
          groupThreadItems(thread.items).map((group) => (
            <View key={group.key}>
              <Text className="mb-2 text-[11px] font-retro-bold uppercase tracking-wide text-dono-muted">
                {group.title}
              </Text>
              <View className="gap-3">
                {group.items.map((message) =>
                  message.type === "campaign_edited" ? (
                    <View key={message.id} className="flex-row items-center gap-2 py-0.5">
                      <View className="h-1.5 w-1.5 rounded-full bg-dono-primary/50" />
                      <Text className="text-xs italic text-dono-muted">
                        {message.message} · {formatMessageTime(message.createdAt)}
                      </Text>
                    </View>
                  ) : (
                    <View
                      key={message.id}
                      className="rounded-xl bg-dono-surface-muted px-4 py-3"
                    >
                      <View className="flex-row flex-wrap items-center gap-2">
                        <Text className="font-retro-bold text-xs text-dono-text">
                          {message.senderName}
                        </Text>
                        <Text className="text-xs text-dono-muted">
                          {formatMessageTime(message.createdAt)}
                        </Text>
                        {message.isEditRequest ? (
                          <View className="rounded-md bg-amber-100 px-1.5 py-0.5">
                            <Text className="text-[10px] font-retro-bold text-amber-800">
                              Edit request
                            </Text>
                          </View>
                        ) : null}
                      </View>
                      <Text className="mt-1.5 text-sm text-dono-text">
                        {message.message}
                      </Text>
                    </View>
                  ),
                )}
              </View>
            </View>
          ))
        )}
      </View>

      <TextInput
        value={body}
        onChangeText={setBody}
        multiline
        numberOfLines={4}
        placeholder={
          campaignContext
            ? "Ask for changes, clarify requirements, or share next steps..."
            : "Write a message..."
        }
        placeholderTextColor="#56615A"
        className="mt-4 min-h-[100px] rounded-xl border border-dono-border px-4 py-3 text-sm text-dono-text"
        textAlignVertical="top"
      />

      <View className="mt-3 flex-row flex-wrap items-center justify-between gap-3">
        {campaignContext ? (
          <Pressable
            onPress={() => setRequestChanges((v) => !v)}
            className="flex-row items-center gap-2"
            accessibilityRole="checkbox"
            accessibilityState={{ checked: requestChanges }}
          >
            <View
              className={cn(
                "h-5 w-5 items-center justify-center rounded border-2 border-retro-ink",
                requestChanges && "bg-retro-mint",
              )}
            >
              {requestChanges ? (
                <Text className="text-xs font-bold text-white">✓</Text>
              ) : null}
            </View>
            <Text className="text-xs font-retro-bold text-dono-text">
              Request changes
            </Text>
          </Pressable>
        ) : (
          <View />
        )}

        <Pressable
          onPress={() => void handleSend()}
          disabled={sending || !body.trim()}
          className={cn(
            "flex-row items-center gap-2 rounded-xl border border-dono-border bg-dono-surface-muted px-4 py-2.5",
            (sending || !body.trim()) && "opacity-50",
          )}
        >
          <Send size={15} color="#17211B" />
          <Text className="font-retro-bold text-sm text-dono-text">
            {sending ? "Sending..." : "Send"}
          </Text>
        </Pressable>
      </View>

      {requestChanges && campaignContext ? (
        <Text className="mt-2 text-[11px] text-amber-800">
          This will mark "{campaignContext.title}" as changes requested and show an
          Edit Campaign button to the owner.
        </Text>
      ) : null}

      {error ? (
        <View className="mt-3 rounded-xl bg-rose-50 px-4 py-3">
          <Text className="text-sm text-rose-700">{error}</Text>
        </View>
      ) : null}
    </View>
  );
}
