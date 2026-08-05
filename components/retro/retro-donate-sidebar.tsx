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
import {
  ActiveMatchSummary,
  DETAIL_DONATION_PRESETS,
  RECOMMENDED_DONATION_AMOUNT,
  computeMatchedTotal,
  isNearGoal,
  nearGoalRemaining,
  nextRoundUpAmount,
  outcomeCopyForAmount,
} from "@/lib/donation-psychology";

export { DETAIL_DONATION_PRESETS, RECOMMENDED_DONATION_AMOUNT };

interface RetroDonateSidebarProps {
  campaign: Campaign;
  selectedAmount: number;
  customAmount: string;
  activeMatch?: ActiveMatchSummary | null;
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
  activeMatch = null,
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
  const resolvedAmount = customAmount ? Number(customAmount) : selectedAmount;
  const amountValid = Number.isFinite(resolvedAmount) && resolvedAmount > 0;
  const outcome =
    amountValid ? outcomeCopyForAmount(campaign, resolvedAmount) : null;
  const nearGoal = isNearGoal(campaign);
  const remaining = nearGoalRemaining(campaign);
  const roundUp = amountValid ? nextRoundUpAmount(resolvedAmount) : null;
  const matchedTotal =
    amountValid && activeMatch
      ? computeMatchedTotal(resolvedAmount, activeMatch)
      : null;

  return (
    <View className="rounded-[14px] border-[3px] border-retro-ink bg-retro-paper p-4">
      <View className="mb-2 overflow-hidden rounded-md border-2 border-retro-ink bg-white">
        <View className="h-3 flex-row">
          <View
            className="h-full bg-retro-mint"
            style={{ width: `${progress}%` }}
          />
          <View className="flex-1 bg-retro-cream" />
        </View>
      </View>
      <View className="mb-2 flex-row items-baseline justify-between">
        <Text className="font-retro-mono-bold text-sm text-retro-ink">
          {progress}%
        </Text>
        <Text className="font-retro-mono text-[12px] text-[#5c574f]">
          {formatCurrency(campaign.raised)} / {formatCurrency(campaign.goal)}
        </Text>
      </View>

      {nearGoal && !isFunded ? (
        <View className="mb-3 rounded-lg border-2 border-retro-ink bg-retro-marigold/40 px-2.5 py-2">
          <Text className="font-retro-mono-bold text-[11px] text-retro-ink">
            Only {formatCurrency(remaining)} to go
          </Text>
        </View>
      ) : null}

      {activeMatch && !isFunded ? (
        <View className="mb-3 rounded-lg border-2 border-retro-ink bg-retro-mint/20 px-2.5 py-2">
          <Text className="font-retro-mono-bold text-[11px] text-retro-ink">
            Matched {activeMatch.multiplier}× by {activeMatch.sponsorLabel}
          </Text>
          <Text className="mt-0.5 font-retro-mono text-[10px] text-[#5c574f]">
            {formatCurrency(activeMatch.remainingPounds)} match budget left
          </Text>
        </View>
      ) : null}

      {!isFunded ? (
        <>
          <View className="mb-3 flex-row gap-2">
            {DETAIL_DONATION_PRESETS.map((amount) => {
              const on = !customAmount && selectedAmount === amount;
              const isRecommended = amount === RECOMMENDED_DONATION_AMOUNT;
              return (
                <Pressable
                  key={amount}
                  onPress={() => onSelectPreset(amount)}
                  className={cn("retro-key", 
                    "relative flex-1 items-center rounded-lg border-2 border-retro-ink py-2.5",
                    on
                      ? "bg-retro-sky"
                      : "bg-retro-cream",
                  )}
                >
                  {isRecommended ? (
                    <View className="absolute -top-2 rounded border border-retro-ink bg-retro-marigold px-1">
                      <Text className="font-retro-mono-bold text-[8px] text-retro-ink">
                        Popular
                      </Text>
                    </View>
                  ) : null}
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
            className="mb-2 rounded-lg border-2 border-retro-ink bg-white px-3 py-2.5 font-retro-mono text-[12.5px] text-retro-ink outline-none"
          />

          {outcome ? (
            <Text className="mb-2 font-retro-mono text-[11px] leading-4 text-[#5c574f]">
              {outcome}
            </Text>
          ) : null}

          {matchedTotal != null && matchedTotal > resolvedAmount ? (
            <Text className="mb-2 font-retro-mono-bold text-[12px] text-retro-ink">
              With match: {formatCurrency(matchedTotal)}
            </Text>
          ) : null}

          {roundUp != null ? (
            <Pressable
              onPress={() => {
                onCustomAmountChange(String(roundUp));
              }}
              className="mb-3 self-start rounded border border-dashed border-retro-ink px-2 py-1"
            >
              <Text className="font-retro-mono text-[11px] text-retro-ink">
                Round up to {formatCurrency(roundUp)}
              </Text>
            </Pressable>
          ) : (
            <View className="mb-3" />
          )}

          <Pressable
            onPress={onDonate}
            disabled={donationsDisabled}
            className={`retro-key mb-3 flex-row items-center justify-center gap-2 rounded-[10px] border-2 border-retro-ink py-3.5 ${
              donationsDisabled ? "bg-retro-cream opacity-60" : "bg-retro-marigold"
            }`}
          >
            <Gift size={18} color="#211E1A" />
            <Text className="font-retro-bold text-[15px] text-retro-ink">Donate</Text>
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
          className={cn("retro-key", "flex-1 items-center rounded-lg border-2 border-retro-ink py-2",
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
          className={cn("retro-key", "flex-1 items-center rounded-lg border-2 border-retro-ink py-2",
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
          accessibilityLabel="Share campaign"
          className="retro-key items-center justify-center rounded-lg border-2 border-retro-ink bg-retro-paper px-3 py-2"
        >
          <Share2 size={14} color="#211E1A" />
        </Pressable>
      </View>
    </View>
  );
}
