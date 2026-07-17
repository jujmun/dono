import { View, Text, Pressable, ActivityIndicator } from "react-native";
import {
  Heart,
  Users,
  MessageCircle,
  Gift,
  UserPlus,
  RefreshCw,
  Sparkles,
} from "lucide-react-native";
import type { ActivityItem } from "@/lib/types";
import { formatCurrency } from "@/lib/constants";
import { cn } from "@/lib/utils";

const typeIcons: Record<ActivityItem["type"], React.ElementType> = {
  donation: Gift,
  campaign: RefreshCw,
  follow: UserPlus,
  update: RefreshCw,
  match: Sparkles,
};

const typeColors: Record<ActivityItem["type"], { bg: string; text: string }> = {
  donation: { bg: "bg-green-100", text: "text-green-700" },
  campaign: { bg: "bg-blue-100", text: "text-blue-600" },
  follow: { bg: "bg-purple-100", text: "text-purple-600" },
  update: { bg: "bg-amber-100", text: "text-amber-600" },
  match: { bg: "bg-rose-100", text: "text-rose-600" },
};

interface ActivityFeedItemProps {
  item: ActivityItem;
}

export function ActivityFeedItem({ item }: ActivityFeedItemProps) {
  const Icon = typeIcons[item.type];
  const colors = typeColors[item.type];

  return (
    <View className="flex-row gap-3 rounded-xl border border-dono-border bg-white p-3">
      <View
        className={cn(
          "h-9 w-9 shrink-0 items-center justify-center rounded-full",
          colors.bg
        )}
      >
        <Text className={cn("text-xs font-bold", colors.text)}>{item.avatar}</Text>
      </View>

      <View className="min-w-0 flex-1">
        <Text className="text-sm text-dono-text">
          <Text className="font-retro-bold">{item.user}</Text>{" "}
          <Text className="text-dono-muted">{item.action}</Text>{" "}
          <Text className="font-medium">{item.target}</Text>
          {item.amount != null && (
            <Text className="font-retro-bold text-dono-primary">
              {" "}
              {formatCurrency(item.amount)}
            </Text>
          )}
        </Text>
        <View className="mt-1 flex-row items-center gap-2">
          <Icon size={12} color="#56615A" />
          <Text className="text-xs text-dono-muted">{item.timestamp}</Text>
        </View>
      </View>
    </View>
  );
}

interface EngagementStatsProps {
  likes: number;
  donors: number;
  followers: number;
  comments: number;
  className?: string;
  liked?: boolean;
  likeLoading?: boolean;
  onLikePress?: () => void;
  onCommentPress?: () => void;
}

type StatConfig = {
  icon: typeof Heart;
  value: number;
  label: string;
  interactive?: boolean;
  active?: boolean;
  loading?: boolean;
  onPress?: () => void;
  iconColor?: string;
  iconFill?: string;
};

function EngagementStatChip({
  icon: Icon,
  value,
  label,
  interactive,
  active,
  loading,
  onPress,
  iconColor = "#56615A",
  iconFill = "transparent",
}: StatConfig) {
  const content = (
    <>
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <Icon size={16} color={iconColor} fill={iconFill} />
      )}
      <Text
        className={cn(
          "font-retro-bold text-sm",
          active ? "text-red-700" : "text-dono-text",
        )}
      >
        {value}
      </Text>
      <Text className={cn("text-sm", active ? "text-red-600" : "text-dono-muted")}>
        {label}
      </Text>
    </>
  );

  if (interactive && onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={loading}
        className={cn(
          "flex-row items-center gap-1.5 rounded-full border px-3 py-1.5",
          active ? "border-red-200 bg-red-50" : "border-transparent",
        )}
      >
        {content}
      </Pressable>
    );
  }

  return <View className="flex-row items-center gap-1.5">{content}</View>;
}

export function EngagementStats({
  likes,
  donors,
  followers,
  comments,
  className,
  liked = false,
  likeLoading = false,
  onLikePress,
  onCommentPress,
}: EngagementStatsProps) {
  const stats: StatConfig[] = [
    {
      icon: Heart,
      value: likes,
      label: "likes",
      interactive: Boolean(onLikePress),
      active: liked,
      loading: likeLoading,
      onPress: onLikePress,
      iconColor: liked ? "#C62828" : "#56615A",
      iconFill: liked ? "#C62828" : "transparent",
    },
    { icon: Gift, value: donors, label: "donors" },
    { icon: Users, value: followers, label: "followers" },
    {
      icon: MessageCircle,
      value: comments,
      label: "comments",
      interactive: Boolean(onCommentPress),
      onPress: onCommentPress,
    },
  ];

  return (
    <View className={cn("flex-row flex-wrap items-center gap-4", className)}>
      {stats.map((stat) => (
        <EngagementStatChip key={stat.label} {...stat} />
      ))}
    </View>
  );
}
