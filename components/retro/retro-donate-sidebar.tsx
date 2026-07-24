import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Gift, Heart, Share2, UserPlus } from "lucide-react-native";
import type { Campaign } from "@/lib/types";
import { formatCurrency, getProgress } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Wireframe presets for campaign detail donate column */
export const DETAIL_DONATION_PRESETS = [10, 15, 25, 100] as const;

interface RetroDonateSidebarProps {
  campaign: Campaign;
  selectedAmount: number;
  customAmount: string;
  liked: boolean;
  following: boolean;
  likeLoading: boolean;
  followLoading: boolean;
  donationsDisabled?: boolean;
  donationsDisabledReason?: string;
  onSelectPreset: (amount: number) => void;
  onCustomAmountChange: (value: string) => void;
  onDonate: () => void;
  onToggleLike: () => void;
  onToggleFollow: () => void;
  onShare: () => void;
}

export function RetroDonateSidebar({
  campaign,
  selectedAmount,
  customAmount,
  liked,
  following,
  likeLoading,
  followLoading,
  donationsDisabled = false,
  donationsDisabledReason,
  onSelectPreset,
  onCustomAmountChange,
  onDonate,
  onToggleLike,
  onToggleFollow,
  onShare,
}: RetroDonateSidebarProps) {
  const progress = getProgress(campaign.raised, campaign.goal);
  const isFunded = campaign.status === "funded";

  return (
    <View className="rounded-[14px] border-[3px] border-retro-ink bg-retro-paper p-4 shadow-[5px_5px_0_#211E1A]">
      <View className="mb-2 overflow-hidden rounded-md border-2 border-retro-ink bg-white">
        <View className="h-3 flex-row">
          <View
            className="h-full bg-retro-mint"
            style={{ width: `${progress}%` }}
          />
          <View className="flex-1 bg-retro-cream" />
        </View>
      </View>
      <View className="mb-4 flex-row items-baseline justify-between">
        <Text className="font-retro-mono-bold text-sm text-retro-ink">
          {progress}%
        </Text>
        <Text className="font-retro-mono text-[12px] text-[#5c574f]">
          {formatCurrency(campaign.raised)} / {formatCurrency(campaign.goal)}
        </Text>
      </View>

      {!isFunded ? (
        <>
          <View className="mb-3 flex-row gap-2">
            {DETAIL_DONATION_PRESETS.map((amount) => {
              const on = !customAmount && selectedAmount === amount;
              return (
                <Pressable
                  key={amount}
                  onPress={() => onSelectPreset(amount)}
                  className={cn(
                    "flex-1 items-center rounded-lg border-2 border-retro-ink py-2.5",
                    on
                      ? "bg-retro-sky shadow-[2px_2px_0_#211E1A]"
                      : "bg-retro-cream",
                  )}
                >
                  <Text
                    className={cn(
                      "font-retro-mono-bold text-[13px]",
                      on ? "text-retro-paper" : "text-retro-ink",
                    )}
                  >
                    £{amount}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            value={customAmount}
            onChangeText={onCustomAmountChange}
            keyboardType="numeric"
            placeholder="custom amt"
            placeholderTextColor="#5c574f"
            className="mb-3 rounded-lg border-2 border-retro-ink bg-white px-3 py-2.5 font-retro-mono text-[12.5px] text-retro-ink outline-none"
          />

          <Pressable
            onPress={onDonate}
            disabled={donationsDisabled}
            className={`mb-3 flex-row items-center justify-center gap-2 rounded-[10px] border-2 border-retro-ink py-3.5 shadow-[3px_3px_0_#211E1A] ${
              donationsDisabled ? "bg-retro-cream opacity-60" : "bg-retro-marigold"
            }`}
          >
            <Gift size={18} color="#211E1A" />
            <Text className="font-retro-bold text-[15px] text-retro-ink">
              Donate
            </Text>
          </Pressable>

          {donationsDisabled && donationsDisabledReason ? (
            <Text className="mb-4 text-center text-xs leading-relaxed text-[#5c574f]">
              {donationsDisabledReason}
            </Text>
          ) : null}
        </>
      ) : (
        <View className="mb-4 rounded-lg border-2 border-dashed border-retro-ink bg-retro-cream px-3 py-3">
          <Text className="text-center font-retro-mono text-xs text-[#5c574f]">
            This campaign is fully funded.
          </Text>
        </View>
      )}

      <View className="flex-row gap-2">
        <Pressable
          onPress={onToggleLike}
          disabled={likeLoading}
          className={cn(
            "flex-1 items-center rounded-lg border-2 border-retro-ink py-2",
            liked ? "bg-retro-cream" : "bg-retro-paper",
          )}
        >
          {likeLoading ? (
            <ActivityIndicator size="small" color="#211E1A" />
          ) : (
            <View className="flex-row items-center gap-1">
              <Heart
                size={12}
                color="#211E1A"
                fill={liked ? "#F2542D" : "transparent"}
              />
              <Text className="font-retro-mono-bold text-[11px] text-retro-ink">
                {liked ? "Liked" : "Like"}
              </Text>
            </View>
          )}
        </Pressable>
        <Pressable
          onPress={onToggleFollow}
          disabled={followLoading}
          className={cn(
            "flex-1 items-center rounded-lg border-2 border-retro-ink py-2",
            following ? "bg-retro-cream" : "bg-retro-paper",
          )}
        >
          {followLoading ? (
            <ActivityIndicator size="small" color="#211E1A" />
          ) : (
            <View className="flex-row items-center gap-1">
              <UserPlus size={12} color="#211E1A" />
              <Text className="font-retro-mono-bold text-[11px] text-retro-ink">
                {following ? "Following" : "Follow"}
              </Text>
            </View>
          )}
        </Pressable>
        <Pressable
          onPress={onShare}
          className="items-center justify-center rounded-lg border-2 border-retro-ink bg-retro-paper px-3 py-2"
        >
          <Share2 size={14} color="#211E1A" />
        </Pressable>
      </View>
    </View>
  );
}
