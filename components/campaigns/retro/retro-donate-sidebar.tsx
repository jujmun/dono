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
import { PRESET_DONATION_AMOUNTS } from "@/components/donate-sheet-types";
import { cn } from "@/lib/utils";
import { RetroPanel } from "./retro-panel";

const donationAmounts = [...PRESET_DONATION_AMOUNTS];

interface RetroDonateSidebarProps {
  campaign: Campaign;
  selectedAmount: number;
  customAmount: string;
  donateAnonymously: boolean;
  liked: boolean;
  following: boolean;
  likeLoading: boolean;
  followLoading: boolean;
  onSelectPreset: (amount: number) => void;
  onCustomAmountChange: (value: string) => void;
  onAnonymousChange: (value: boolean) => void;
  onDonate: () => void;
  onToggleLike: () => void;
  onToggleFollow: () => void;
  onShare: () => void;
}

export function RetroDonateSidebar({
  campaign,
  selectedAmount,
  customAmount,
  donateAnonymously,
  liked,
  following,
  likeLoading,
  followLoading,
  onSelectPreset,
  onCustomAmountChange,
  onAnonymousChange,
  onDonate,
  onToggleLike,
  onToggleFollow,
  onShare,
}: RetroDonateSidebarProps) {
  const progress = getProgress(campaign.raised, campaign.goal);
  const isFunded = campaign.status === "funded";

  return (
    <RetroPanel title="DONATE.exe" accent="coral" className="mb-0">
      <View className="mb-2 flex-row items-baseline justify-between">
        <Text className="font-retro-bold text-[32px] text-retro-mint">
          {formatCurrency(campaign.raised)}
        </Text>
        <Text className="font-retro-mono text-[12.5px] text-[#5c574f]">
          of {formatCurrency(campaign.goal)}
        </Text>
      </View>

      <View className="mb-1.5 h-[11px] overflow-hidden rounded-md border-2 border-retro-ink bg-white">
        <View
          className="h-full bg-retro-mint"
          style={{ width: `${progress}%` }}
        />
      </View>
      <Text className="mb-1.5 text-right font-retro-mono text-[11.5px] text-retro-ink">
        {progress}% FUNDED
      </Text>
      <Text className="mb-4 font-retro-mono text-[11.5px] text-[#5c574f]">
        {campaign.likes} like{campaign.likes === 1 ? "" : "s"} ·{" "}
        {campaign.donors} donor{campaign.donors === 1 ? "" : "s"} ·{" "}
        {campaign.followers} follower
        {campaign.followers === 1 ? "" : "s"}
      </Text>

      {!isFunded ? (
        <>
          <View className="mb-3 flex-row gap-2">
            {donationAmounts.map((amount) => {
              const on = !customAmount && selectedAmount === amount;
              return (
                <Pressable
                  key={amount}
                  onPress={() => onSelectPreset(amount)}
                  className={cn(
                    "flex-1 items-center rounded-lg border-2 border-retro-ink py-2.5",
                    on
                      ? "bg-retro-sky shadow-[3px_3px_0_#211E1A]"
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
            placeholder="Custom amount (£)"
            placeholderTextColor="#5c574f"
            className="mb-3.5 rounded-lg border-2 border-retro-ink bg-white px-3 py-2.5 font-retro-mono text-[12.5px] text-retro-ink"
          />

          <Pressable
            onPress={() => onAnonymousChange(!donateAnonymously)}
            className="mb-4 flex-row gap-2.5 rounded-[10px] border-2 border-retro-ink bg-retro-cream px-3 py-2.5"
          >
            <View
              className={cn(
                "mt-0.5 h-[17px] w-[17px] shrink-0 items-center justify-center rounded border-2 border-retro-ink",
                donateAnonymously ? "bg-retro-mint" : "bg-white",
              )}
            >
              {donateAnonymously ? (
                <Text className="text-[10px] font-bold text-white">✓</Text>
              ) : null}
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-[12.5px] font-sans-medium text-retro-ink">
                Donate anonymously
              </Text>
              <Text className="mt-1 text-[11px] leading-4 text-[#5c574f]">
                Your name won&apos;t appear on public activity feeds. You can
                still receive a receipt by email.
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={onDonate}
            className="mb-3 flex-row items-center justify-center gap-2 rounded-[10px] border-2 border-retro-ink bg-retro-marigold py-3.5 shadow-[3px_3px_0_#211E1A]"
          >
            <Gift size={16} color="#211E1A" />
            <Text className="font-retro-bold text-[15px] text-retro-ink">
              DONATE NOW
            </Text>
          </Pressable>
        </>
      ) : (
        <View className="mb-3 rounded-lg border-2 border-dashed border-retro-ink bg-retro-cream px-3 py-3">
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
              <Text className="font-retro-mono-bold text-[11.5px] text-retro-ink">
                {liked ? "Liked" : "Like"} · {campaign.likes}
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
              <Text className="font-retro-mono-bold text-[11.5px] text-retro-ink">
                {following ? "Following" : "+ Follow"}
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
    </RetroPanel>
  );
}
