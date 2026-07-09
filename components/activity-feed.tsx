import { View, Text } from "react-native";
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
  donation: { bg: "bg-emerald-100", text: "text-emerald-600" },
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
          <Text className="font-semibold">{item.user}</Text>{" "}
          <Text className="text-dono-muted">{item.action}</Text>{" "}
          <Text className="font-medium">{item.target}</Text>
          {item.amount != null && (
            <Text className="font-semibold text-dono-primary">
              {" "}
              {formatCurrency(item.amount)}
            </Text>
          )}
        </Text>
        <View className="mt-1 flex-row items-center gap-2">
          <Icon size={12} color="#6b7c7a" />
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
}

export function EngagementStats({
  likes,
  donors,
  followers,
  comments,
  className,
}: EngagementStatsProps) {
  const stats = [
    { icon: Heart, value: likes, label: "likes" },
    { icon: Gift, value: donors, label: "donors" },
    { icon: Users, value: followers, label: "followers" },
    { icon: MessageCircle, value: comments, label: "comments" },
  ];

  return (
    <View className={cn("flex-row flex-wrap items-center gap-4", className)}>
      {stats.map(({ icon: Icon, value, label }) => (
        <View key={label} className="flex-row items-center gap-1.5">
          <Icon size={16} color="#6b7c7a" />
          <Text className="text-sm font-medium text-dono-text">{value}</Text>
          <Text className="text-sm text-dono-muted">{label}</Text>
        </View>
      ))}
    </View>
  );
}
