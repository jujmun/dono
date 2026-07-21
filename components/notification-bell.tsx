import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { Bell, Megaphone, Pencil, Trash2 } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { RetroPanel } from "@/components/retro";
import { cn } from "@/lib/utils";
import type { Notification } from "@/lib/types";

const PAGE_SIZE = 15;

function formatNotificationDate(ms: number) {
  return new Date(ms).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NotificationRow({
  notification,
  onPress,
  onEditCampaign,
  onDelete,
}: {
  notification: Notification;
  onPress: (notification: Notification) => void;
  onEditCampaign: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(notification)}
      className={cn(
        "flex-row items-start gap-2.5 border-b border-retro-ink/10 px-3.5 py-3",
        !notification.read && "bg-retro-mint/10",
      )}
    >
      <View
        className={cn(
          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
          notification.read ? "bg-transparent" : "bg-retro-mint",
        )}
      />
      <View className="min-w-0 flex-1">
        {notification.senderRole || notification.relatedEntityTitle ? (
          <View className="mb-1 flex-row flex-wrap items-center gap-1.5">
            {notification.senderRole ? (
              <View className="flex-row items-center gap-1 self-start rounded-md bg-retro-sky/15 px-1.5 py-0.5">
                {notification.isBroadcast ? (
                  <Megaphone size={10} color="#2E97D6" />
                ) : null}
                <Text className="text-[10px] font-retro-bold uppercase text-retro-sky">
                  {notification.senderRole === "admin" ? "Admin" : notification.senderRole}
                </Text>
              </View>
            ) : null}
            {notification.relatedEntityTitle ? (
              <View className="flex-row items-center self-start rounded-md bg-retro-mint/15 px-1.5 py-0.5">
                <Text
                  className="text-[10px] font-retro-bold uppercase text-retro-mint"
                  numberOfLines={1}
                >
                  {notification.relatedEntityTitle}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
        <Text
          className={cn(
            "text-sm text-retro-ink",
            !notification.read && "font-retro-bold",
          )}
        >
          {notification.message}
        </Text>
        <Text className="mt-1 font-retro-mono text-[11px] text-[#5c574f]">
          {formatNotificationDate(notification.createdAt)}
        </Text>
        {notification.isEditRequest ? (
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onEditCampaign(notification);
            }}
            className="mt-2 flex-row items-center gap-1.5 self-start rounded-full border-2 border-retro-ink bg-retro-marigold px-3 py-1.5"
          >
            <Pencil size={12} color="#211E1A" />
            <Text className="font-retro-bold text-xs text-retro-ink">
              Edit Campaign
            </Text>
          </Pressable>
        ) : null}
      </View>
      {notification.deletable ? (
        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            onDelete(notification);
          }}
          accessibilityLabel="Delete notification"
          className="mt-0.5 h-6 w-6 shrink-0 items-center justify-center rounded-full"
        >
          <Trash2 size={13} color="#5c574f" />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Live via Convex's reactive useQuery subscriptions — no polling needed.
  // A future push-based improvement (e.g. platform push notifications for
  // native) would layer on top of this, not replace it.
  const unreadCount = useQuery(api.notifications.getUnreadCount);
  const page = useQuery(
    api.notifications.list,
    open ? { limit: visibleCount } : "skip",
  );
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const deleteMine = useMutation(api.notifications.deleteMine);

  const items = (page?.items ?? []) as Notification[];
  const hasMore = Boolean(page?.nextCursor);
  const badgeLabel =
    unreadCount === undefined
      ? null
      : unreadCount > 9
        ? "9+"
        : unreadCount > 0
          ? String(unreadCount)
          : null;

  const handlePressNotification = (notification: Notification) => {
    if (!notification.read) {
      void markRead({ notificationId: notification.id as Id<"notifications"> });
    }
    if (!notification.relatedEntityId || notification.relatedEntityType !== "campaign") {
      return;
    }
    // A campaign_resubmitted notification goes to admins, about a campaign
    // that's back to "pending" — not public, so it needs the admin review
    // page rather than the public campaign page.
    if (notification.type === "campaign_resubmitted") {
      setOpen(false);
      router.push(`/admin/${notification.relatedEntityId}`);
      return;
    }
    // Edit-request campaigns are "changes_requested" — not public, so the
    // normal campaign page 404s. The Edit Campaign button (below) is the
    // real destination for those; a plain row tap just marks it read.
    if (!notification.isEditRequest) {
      setOpen(false);
      router.push(`/campaigns/${notification.relatedEntityId}`);
    }
  };

  const handleEditCampaign = (notification: Notification) => {
    if (!notification.read) {
      void markRead({ notificationId: notification.id as Id<"notifications"> });
    }
    if (notification.relatedEntityId) {
      setOpen(false);
      router.push(`/create?editSlug=${encodeURIComponent(notification.relatedEntityId)}`);
    }
  };

  const handleDeleteNotification = (notification: Notification) => {
    void deleteMine({ notificationId: notification.id as Id<"notifications"> });
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityLabel="Notifications"
        className="relative h-9 w-9 items-center justify-center rounded-full border-2 border-retro-ink bg-retro-cream"
      >
        <Bell size={16} color="#211E1A" />
        {badgeLabel ? (
          <View className="absolute -right-1.5 -top-1.5 h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-retro-paper bg-retro-coral px-1">
            <Text className="font-retro-bold text-[9px] leading-none text-white">
              {badgeLabel}
            </Text>
          </View>
        ) : null}
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/40" onPress={() => setOpen(false)}>
          <View className="flex-1 items-end px-4 pb-4 pt-16" pointerEvents="box-none">
            <Pressable
              onPress={(event) => event.stopPropagation()}
              className="w-full max-w-sm"
            >
              <RetroPanel title="Notifications" accent="mint" bodyClassName="p-0">
                <View className="flex-row items-center justify-between border-b border-retro-ink/10 px-3.5 py-2.5">
                  <Text className="font-retro-mono text-[11px] text-[#5c574f]">
                    {unreadCount ? `${unreadCount} unread` : "You're all caught up"}
                  </Text>
                  {unreadCount ? (
                    <Pressable onPress={() => void markAllRead({})}>
                      <Text className="font-retro-bold text-[11px] text-retro-mint">
                        Mark all read
                      </Text>
                    </Pressable>
                  ) : null}
                </View>

                <ScrollView style={{ maxHeight: 360 }}>
                  {items.length === 0 ? (
                    <Text className="px-3.5 py-6 text-center text-sm text-[#5c574f]">
                      No notifications yet.
                    </Text>
                  ) : (
                    items.map((notification) => (
                      <NotificationRow
                        key={notification.id}
                        notification={notification}
                        onPress={handlePressNotification}
                        onEditCampaign={handleEditCampaign}
                        onDelete={handleDeleteNotification}
                      />
                    ))
                  )}
                </ScrollView>

                {hasMore ? (
                  <Pressable
                    onPress={() => setVisibleCount((count) => count + PAGE_SIZE)}
                    className="items-center border-t border-retro-ink/10 px-3.5 py-2.5"
                  >
                    <Text className="font-retro-bold text-xs text-retro-ink">
                      Load more
                    </Text>
                  </Pressable>
                ) : null}
              </RetroPanel>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
