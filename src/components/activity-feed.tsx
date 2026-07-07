import {
  Heart,
  Users,
  MessageCircle,
  Gift,
  UserPlus,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import type { ActivityItem } from "@/lib/types";
import { formatCurrency } from "@/lib/data";
import { cn } from "@/lib/utils";

const typeIcons: Record<ActivityItem["type"], React.ElementType> = {
  donation: Gift,
  campaign: RefreshCw,
  follow: UserPlus,
  update: RefreshCw,
  match: Sparkles,
};

const typeColors: Record<ActivityItem["type"], string> = {
  donation: "bg-emerald-100 text-emerald-600",
  campaign: "bg-blue-100 text-blue-600",
  follow: "bg-purple-100 text-purple-600",
  update: "bg-amber-100 text-amber-600",
  match: "bg-rose-100 text-rose-600",
};

interface ActivityFeedItemProps {
  item: ActivityItem;
}

export function ActivityFeedItem({ item }: ActivityFeedItemProps) {
  const Icon = typeIcons[item.type];

  return (
    <div className="flex gap-3 rounded-xl border border-dono-border bg-white p-3">
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          typeColors[item.type]
        )}
      >
        {item.avatar}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-dono-text">
          <span className="font-semibold">{item.user}</span>{" "}
          <span className="text-dono-muted">{item.action}</span>{" "}
          <span className="font-medium">{item.target}</span>
          {item.amount && (
            <span className="ml-1 font-semibold text-dono-primary">
              {formatCurrency(item.amount)}
            </span>
          )}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <Icon className="h-3 w-3 text-dono-muted" />
          <span className="text-xs text-dono-muted">{item.timestamp}</span>
        </div>
      </div>
    </div>
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
    <div className={cn("flex items-center gap-4", className)}>
      {stats.map(({ icon: Icon, value, label }) => (
        <div key={label} className="flex items-center gap-1.5 text-sm text-dono-muted">
          <Icon className="h-4 w-4" />
          <span className="font-medium text-dono-text">{value}</span>
          <span className="hidden sm:inline">{label}</span>
        </div>
      ))}
    </div>
  );
}
