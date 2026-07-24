import { forwardRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { Flag, Pencil, Trash2 } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { cn } from "@/lib/utils";

const MAX_COMMENT_LENGTH = 2000;

type CampaignCommentsSectionProps = {
  campaignSlug: string;
  isAuthenticated: boolean;
  className?: string;
  /** When true, omit outer card chrome and section heading (e.g. inside RetroPanel). */
  embedded?: boolean;
};

function formatCommentTime(timestamp: number) {
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const CampaignCommentsSection = forwardRef<View, CampaignCommentsSectionProps>(
  function CampaignCommentsSection(
    { campaignSlug, isAuthenticated, className, embedded = false },
    ref,
  ) {
    const profile = useCurrentProfile();
    const comments = useQuery(api.engagement.listComments, { campaignSlug });
    const addComment = useMutation(api.engagement.addComment);
    const deleteComment = useMutation(api.engagement.deleteComment);
    const editComment = useMutation(api.engagement.editComment);
    const hideCommentByOwner = useMutation(api.engagement.hideCommentByOwner);
    const createReport = useMutation(api.reports.createReport);

    const [body, setBody] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [posting, setPosting] = useState(false);
    const [deletingId, setDeletingId] = useState<Id<"campaignComments"> | null>(
      null,
    );
    const [editingId, setEditingId] = useState<Id<"campaignComments"> | null>(null);
    const [editBody, setEditBody] = useState("");
    const [busyId, setBusyId] = useState<Id<"campaignComments"> | null>(null);

    const handlePost = async () => {
      const trimmed = body.trim();
      if (!trimmed) {
        setError("Write a comment before posting.");
        return;
      }
      if (trimmed.length > MAX_COMMENT_LENGTH) {
        setError("Comment must be 2000 characters or fewer.");
        return;
      }

      setPosting(true);
      setError(null);
      try {
        await addComment({ campaignSlug, body: trimmed });
        setBody("");
      } catch (err) {
        setError(getFriendlyAuthError(err));
      } finally {
        setPosting(false);
      }
    };

    const handleDelete = async (commentId: Id<"campaignComments">) => {
      setDeletingId(commentId);
      setError(null);
      try {
        await deleteComment({ commentId });
      } catch (err) {
        setError(getFriendlyAuthError(err));
      } finally {
        setDeletingId(null);
      }
    };

    const handleSaveEdit = async (commentId: Id<"campaignComments">) => {
      setBusyId(commentId);
      setError(null);
      try {
        await editComment({ commentId, body: editBody });
        setEditingId(null);
        setEditBody("");
      } catch (err) {
        setError(getFriendlyAuthError(err));
      } finally {
        setBusyId(null);
      }
    };

    const handleReport = async (commentId: Id<"campaignComments">) => {
      setBusyId(commentId);
      setError(null);
      try {
        await createReport({
          targetType: "comment",
          commentId,
          campaignSlug,
          reason: "Reported via campaign comments",
        });
      } catch (err) {
        setError(getFriendlyAuthError(err));
      } finally {
        setBusyId(null);
      }
    };

    const handleHide = async (commentId: Id<"campaignComments">) => {
      setBusyId(commentId);
      setError(null);
      try {
        await hideCommentByOwner({ commentId });
      } catch (err) {
        setError(getFriendlyAuthError(err));
      } finally {
        setBusyId(null);
      }
    };

    return (
      <View
        ref={ref}
        nativeID="campaign-comments"
        className={cn(
          embedded
            ? "mb-0"
            : "mb-8 rounded-2xl border border-dono-border bg-white p-6",
          className,
        )}
      >
        {!embedded ? (
          <Text className="mb-4 text-lg font-retro-bold text-dono-text">
            Comments
          </Text>
        ) : null}

        {isAuthenticated ? (
          <View className="mb-6">
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="Share your support or ask a question..."
              placeholderTextColor="#56615A"
              multiline
              maxLength={MAX_COMMENT_LENGTH}
              className={cn(
                "min-h-[88px] px-4 py-3 text-sm text-dono-text",
                embedded
                  ? "rounded-lg border-2 border-retro-ink bg-white"
                  : "rounded-xl border border-dono-border",
              )}
              textAlignVertical="top"
            />
            <View className="mt-3 flex-row items-center justify-between">
              <Text
                className={cn(
                  "text-xs",
                  embedded ? "text-[#5c574f]" : "text-dono-muted",
                )}
              >
                {body.length}/{MAX_COMMENT_LENGTH}
              </Text>
              <Pressable
                onPress={() => void handlePost()}
                disabled={posting || !body.trim()}
                className={cn(
                  "px-4 py-2",
                  embedded
                    ? "rounded-lg border-2 border-retro-ink bg-retro-mint shadow-[2px_2px_0_#211E1A]"
                    : "rounded-full bg-dono-primary",
                  posting || !body.trim() ? "opacity-50" : "",
                )}
              >
                {posting ? (
                  <ActivityIndicator
                    size="small"
                    color={embedded ? "#211E1A" : "#fff"}
                  />
                ) : (
                  <Text
                    className={cn(
                      "font-retro-bold text-sm",
                      embedded ? "font-retro-bold text-retro-paper" : "text-white",
                    )}
                  >
                    Post
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        ) : (
          <View
            className={cn(
              "mb-6 px-4 py-4",
              embedded
                ? "rounded-[10px] border-2 border-dashed border-retro-ink bg-retro-cream"
                : "rounded-xl border border-dashed border-dono-border bg-dono-surface-muted/60",
            )}
          >
            <Text
              className={cn(
                "text-sm",
                embedded ? "text-[13.5px] text-retro-ink" : "text-dono-muted",
              )}
            >
              Sign in to join the conversation.
            </Text>
            <Link href="/signin" asChild>
              <Pressable
                className={cn(
                  "mt-3 self-start px-4 py-2",
                  embedded
                    ? "rounded-lg border-2 border-retro-ink bg-retro-mint shadow-[3px_3px_0_#211E1A]"
                    : "rounded-full bg-dono-primary",
                )}
              >
                <Text
                  className={cn(
                    "font-retro-bold text-sm",
                    embedded ? "font-retro-bold text-retro-paper" : "text-white",
                  )}
                >
                  Sign in
                </Text>
              </Pressable>
            </Link>
          </View>
        )}

        {error ? (
          <Text className="mb-4 text-sm text-rose-700">{error}</Text>
        ) : null}

        {comments === undefined ? (
          <ActivityIndicator color="#17211B" />
        ) : comments.length === 0 ? (
          <Text
            className={cn(
              "text-sm",
              embedded
                ? "text-[12.5px] italic text-[#5c574f]"
                : "text-dono-muted",
            )}
          >
            Be the first to show your support.
          </Text>
        ) : (
          <View className="gap-4">
            {comments.map((comment, index) => {
              const isOwn =
                isAuthenticated &&
                profile?.id != null &&
                comment.authorUserId === profile.id;
              const isAdmin = profile?.role === "admin";

              return (
                <View
                  key={comment.id}
                  className={cn(
                    "flex-row gap-3",
                    index > 0 ? "border-t border-dono-border pt-4" : "",
                  )}
                >
                  <View className="h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dono-primary/10">
                    <Text className="text-xs font-bold text-dono-primary">
                      {comment.authorAvatar}
                    </Text>
                  </View>
                  <View className="min-w-0 flex-1">
                    <View className="flex-row items-start justify-between gap-2">
                      <View className="min-w-0 flex-1">
                        <Text className="font-retro-bold text-sm text-dono-text">
                          {comment.authorName}
                        </Text>
                        <Text className="text-xs text-dono-muted">
                          {formatCommentTime(comment.createdAt)}
                          {comment.edited ? " · Edited" : ""}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        {isOwn ? (
                          <Pressable
                            onPress={() => {
                              setEditingId(comment.id);
                              setEditBody(comment.body);
                            }}
                            className="p-1"
                            accessibilityLabel="Edit comment"
                          >
                            <Pencil size={14} color="#56615A" />
                          </Pressable>
                        ) : null}
                        {isAuthenticated && !isOwn ? (
                          <Pressable
                            onPress={() => void handleReport(comment.id)}
                            disabled={busyId === comment.id}
                            className="p-1"
                            accessibilityLabel="Report comment"
                          >
                            <Flag size={14} color="#56615A" />
                          </Pressable>
                        ) : null}
                        {isAuthenticated ? (
                          <Pressable
                            onPress={() => void handleHide(comment.id)}
                            disabled={busyId === comment.id}
                            className="p-1"
                            accessibilityLabel="Hide comment"
                          >
                            <Text className="text-[10px] text-dono-muted">Hide</Text>
                          </Pressable>
                        ) : null}
                        {isOwn || isAdmin ? (
                          <Pressable
                            onPress={() => void handleDelete(comment.id)}
                            disabled={deletingId === comment.id}
                            className="p-1"
                            accessibilityLabel="Delete comment"
                          >
                            {deletingId === comment.id ? (
                              <ActivityIndicator size="small" color="#56615A" />
                            ) : (
                              <Trash2 size={14} color="#56615A" />
                            )}
                          </Pressable>
                        ) : null}
                      </View>
                    </View>
                    {editingId === comment.id ? (
                      <View className="mt-2 gap-2">
                        <TextInput
                          value={editBody}
                          onChangeText={setEditBody}
                          multiline
                          className="min-h-[72px] rounded-xl border border-dono-border px-3 py-2 text-sm text-dono-text"
                        />
                        <View className="flex-row gap-2">
                          <Pressable
                            onPress={() => void handleSaveEdit(comment.id)}
                            disabled={busyId === comment.id}
                            className="rounded-full bg-dono-primary px-3 py-1.5"
                          >
                            <Text className="text-xs font-retro-bold text-white">
                              Save
                            </Text>
                          </Pressable>
                          <Pressable
                            onPress={() => {
                              setEditingId(null);
                              setEditBody("");
                            }}
                            className="rounded-full border border-dono-border px-3 py-1.5"
                          >
                            <Text className="text-xs text-dono-muted">Cancel</Text>
                          </Pressable>
                        </View>
                      </View>
                    ) : (
                      <Text className="mt-2 text-sm leading-relaxed text-dono-muted">
                        {comment.body}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  },
);
