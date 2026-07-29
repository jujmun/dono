import { useRouter } from "expo-router";
import { Text, Pressable, ActivityIndicator } from "react-native";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { UserPlus } from "lucide-react-native";
import { usePostHog } from "posthog-react-native";
import { api } from "@convex/_generated/api";

interface SocietyFollowButtonProps {
  slug: string;
  name: string;
  university?: string;
  /** Icon-only circular button, for use alongside other compact header actions. */
  compact?: boolean;
}

export function SocietyFollowButton({
  slug,
  name,
  university,
  compact = false,
}: SocietyFollowButtonProps) {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const posthog = usePostHog();
  const followSociety = useMutation(api.engagement.followSociety);
  const unfollowSociety = useMutation(api.engagement.unfollowSociety);
  const engagement = useQuery(
    api.engagement.isFollowing,
    slug ? { societySlug: slug } : "skip",
  );
  const [followLoading, setFollowLoading] = useState(false);
  const following = engagement?.followingSociety ?? false;

  const handleToggleFollow = async () => {
    if (!slug || followLoading) return;
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }
    setFollowLoading(true);
    try {
      if (following) {
        await unfollowSociety({ societySlug: slug });
      } else {
        await followSociety({ societySlug: slug });
        posthog?.capture("society_followed", {
          society_slug: slug,
          society_name: name,
          ...(university ? { society_university: university } : {}),
        });
      }
    } finally {
      setFollowLoading(false);
    }
  };

  if (compact) {
    return (
      <Pressable
        onPress={() => void handleToggleFollow()}
        disabled={followLoading}
        accessibilityRole="button"
        accessibilityLabel={following ? "Following — tap to unfollow" : "Follow"}
        className={`h-9 w-9 items-center justify-center rounded-full border ${
          following
            ? "border-dono-primary bg-dono-primary/5"
            : "border-dono-border bg-white"
        }`}
      >
        {followLoading ? (
          <ActivityIndicator size="small" color="#17211B" />
        ) : (
          <UserPlus size={16} color={following ? "#17211B" : "#56615A"} />
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => void handleToggleFollow()}
      disabled={followLoading}
      className={`flex-row items-center justify-center gap-2 rounded-full px-5 py-2.5 ${
        following ? "border border-dono-primary bg-dono-primary/5" : "bg-dono-primary"
      }`}
    >
      {followLoading ? (
        <ActivityIndicator size="small" color={following ? "#17211B" : "#fff"} />
      ) : (
        <UserPlus size={16} color={following ? "#17211B" : "#fff"} />
      )}
      <Text
        className={`font-retro-bold text-sm ${
          following ? "text-dono-primary" : "text-white"
        }`}
      >
        {following ? "Following" : "Follow"}
      </Text>
    </Pressable>
  );
}
