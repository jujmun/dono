import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
} from "react-native";
import { Gift, Heart, Trophy } from "lucide-react-native";
import type { Campaign } from "@/lib/types";
import { formatCurrency } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  ActiveMatchSummary,
  DETAIL_DONATION_PRESETS,
  RECOMMENDED_DONATION_AMOUNT,
  computeMatchedTotal,
  donorStandingForAmount,
  isNearGoal,
  nearGoalRemaining,
} from "@/lib/donation-psychology";

export { DETAIL_DONATION_PRESETS, RECOMMENDED_DONATION_AMOUNT };

interface RetroDonateSidebarProps {
  campaign: Campaign;
  selectedAmount: number;
  customAmount: string;
  activeMatch?: ActiveMatchSummary | null;
  donationsDisabled?: boolean;
  donationsDisabledReason?: string;
  /** Omit outer border when nested in a shared donate+updates card. */
  embedded?: boolean;
  onSelectPreset: (amount: number) => void;
  onCustomAmountChange: (value: string) => void;
  onDonate: () => void;
}

export function RetroDonateSidebar({
  campaign,
  selectedAmount,
  customAmount,
  activeMatch = null,
  donationsDisabled = false,
  donationsDisabledReason,
  embedded = false,
  onSelectPreset,
  onCustomAmountChange,
  onDonate,
}: RetroDonateSidebarProps) {
  const [amountFocused, setAmountFocused] = useState(false);
  const isFunded = campaign.status === "funded";
  const resolvedAmount = customAmount ? Number(customAmount) : selectedAmount;
  const amountValid = Number.isFinite(resolvedAmount) && resolvedAmount > 0;
  const displayAmount = amountValid ? resolvedAmount : selectedAmount;
  const amountFieldValue =
    customAmount !== "" ? customAmount : String(selectedAmount);
  const standing = amountValid ? donorStandingForAmount(resolvedAmount) : null;
  const nearGoal = isNearGoal(campaign);
  const nearGoalRemainingAmount = nearGoalRemaining(campaign);
  const matchedTotal =
    amountValid && activeMatch
      ? computeMatchedTotal(resolvedAmount, activeMatch)
      : null;
  const activePreset =
    customAmount === ""
      ? selectedAmount
      : DETAIL_DONATION_PRESETS.find((p) => p === Number(customAmount));

  return (
    <View
      className={cn(
        "bg-retro-paper p-4",
        !embedded && "rounded-[14px] border-[3px] border-retro-ink",
      )}
    >
      {!isFunded ? (
        <>
          {nearGoal ? (
            <View className="mb-3 rounded-lg border-2 border-retro-ink bg-retro-marigold/40 px-2.5 py-2">
              <Text className="font-retro-mono-bold text-[11px] text-retro-ink">
                Almost there — only {formatCurrency(nearGoalRemainingAmount)} left
              </Text>
            </View>
          ) : null}

          {activeMatch ? (
            <View className="mb-3 rounded-lg border-2 border-retro-ink bg-retro-mint/20 px-2.5 py-2">
              <Text className="font-retro-mono-bold text-[11px] text-retro-ink">
                Matched {activeMatch.multiplier}× by {activeMatch.sponsorLabel}
              </Text>
              <Text className="mt-0.5 font-retro-mono text-[10px] text-[#5c574f]">
                {formatCurrency(activeMatch.remainingPounds)} match budget left
              </Text>
            </View>
          ) : null}

          <View className="mb-3 flex-row flex-wrap gap-2 pt-2">
            {DETAIL_DONATION_PRESETS.map((amount) => {
              const on = activePreset === amount;
              const isRecommended = amount === RECOMMENDED_DONATION_AMOUNT;
              return (
                <Pressable
                  key={amount}
                  onPress={() => onSelectPreset(amount)}
                  className={cn(
                    "retro-key relative mb-1 w-[30%] min-w-[72px] flex-grow items-center rounded-xl border-2 border-retro-ink py-2.5",
                    on ? "bg-retro-sky" : "bg-white",
                  )}
                >
                  {isRecommended ? (
                    <View className="absolute -top-2.5 z-10 flex-row items-center gap-1 rounded-full border-2 border-retro-ink bg-retro-marigold px-1.5 py-0.5">
                      <Heart size={9} color="#211E1A" fill="#211E1A" />
                      <Text className="font-retro-mono-bold text-[8px] uppercase tracking-wide text-retro-ink">
                        Suggested
                      </Text>
                    </View>
                  ) : null}
                  <Text
                    className={cn(
                      "font-retro-bold text-[15px]",
                      on ? "text-retro-paper" : "text-retro-ink",
                    )}
                  >
                    £{amount}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Hero amount field — £ / GBP left, large value right */}
          <View
            className={cn(
              "mb-2 flex-row items-center rounded-2xl border-[3px] bg-white px-4 py-3",
              amountFocused ? "border-retro-sky" : "border-retro-ink",
            )}
          >
            <View className="mr-3 items-center pr-3 border-r border-retro-ink/20">
              <Text className="font-retro-bold text-2xl leading-none text-retro-ink">
                £
              </Text>
              <Text className="mt-0.5 font-retro-mono-bold text-[10px] uppercase tracking-wide text-[#5c574f]">
                GBP
              </Text>
            </View>
            <TextInput
              value={amountFieldValue}
              onChangeText={(value) => {
                const cleaned = value.replace(/[^0-9.]/g, "");
                onCustomAmountChange(cleaned);
              }}
              onFocus={() => setAmountFocused(true)}
              onBlur={() => setAmountFocused(false)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#5c574f"
              className="min-w-0 flex-1 text-right font-retro-mono-bold text-[32px] leading-9 text-retro-ink outline-none"
            />
          </View>

          {/* Motivational standing banner */}
          {standing ? (
            <View className="mb-4">
              <View className="ml-8 h-2.5 w-2.5 rotate-45 border-l-2 border-t-2 border-retro-ink bg-[#FFF0C2]" />
              <View className="-mt-1.5 flex-row items-center gap-3 rounded-2xl border-2 border-retro-ink bg-[#FFF0C2] px-3.5 py-3">
                <Text className="min-w-0 flex-1 text-[13px] leading-5 text-retro-ink">
                  {standing.before}
                  <Text className="font-retro-bold">{standing.emphasis}</Text>
                  {standing.after}
                </Text>
                <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-retro-ink bg-retro-marigold">
                  <Trophy size={18} color="#211E1A" />
                </View>
              </View>
            </View>
          ) : null}

          {matchedTotal != null && matchedTotal > resolvedAmount ? (
            <Text className="mb-3 font-retro-mono-bold text-[12px] text-retro-mint">
              With match → {formatCurrency(matchedTotal)} total impact
            </Text>
          ) : null}

          <Pressable
            onPress={onDonate}
            disabled={donationsDisabled || !amountValid}
            className={cn(
              "retro-key flex-row items-center justify-center gap-2 rounded-[10px] border-2 border-retro-ink py-3.5",
              donationsDisabled || !amountValid
                ? "bg-retro-cream opacity-60"
                : "bg-retro-mint",
            )}
          >
            <Gift size={18} color="#FFFFFF" />
            <Text className="font-retro-bold text-[15px] text-white">
              Donate {formatCurrency(displayAmount)}
            </Text>
          </Pressable>

          {donationsDisabled && donationsDisabledReason ? (
            <Text className="mt-3 text-center text-xs leading-relaxed text-[#5c574f]">
              {donationsDisabledReason}
            </Text>
          ) : null}
        </>
      ) : (
        <View className="rounded-lg border-2 border-dashed border-retro-ink bg-retro-cream px-3 py-3">
          <Text className="text-center font-retro-mono text-xs text-[#5c574f]">
            This campaign is fully funded.
          </Text>
        </View>
      )}
    </View>
  );
}
