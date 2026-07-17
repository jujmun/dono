import { View, Text, TextInput, Pressable } from "react-native";
import type { Campaign } from "@/lib/types";
import { formatCurrency } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { RetroWindow } from "./retro-window";

export const RETRO_PRESET_AMOUNTS = [5, 15, 25, 50] as const;

interface DonateWindowProps {
  campaign: Campaign | null;
  selectedAmount: number;
  customAmount: string;
  donateAnonymously: boolean;
  onSelectPreset: (amount: number) => void;
  onCustomAmountChange: (value: string) => void;
  onAnonymousChange: (value: boolean) => void;
  onGive: () => void;
  onCancel: () => void;
}

export function DonateWindow({
  campaign,
  selectedAmount,
  customAmount,
  donateAnonymously,
  onSelectPreset,
  onCustomAmountChange,
  onAnonymousChange,
  onGive,
  onCancel,
}: DonateWindowProps) {
  const resolved =
    customAmount !== "" && !Number.isNaN(Number(customAmount))
      ? Number(customAmount)
      : selectedAmount;

  return (
    <RetroWindow title="DONATE.exe" accent="mint" className="flex-1">
      {!campaign ? (
        <Text className="font-retro-mono text-xs text-[#5c574f]">
          Select a campaign to give.
        </Text>
      ) : (
        <>
          <Text className="mb-3 font-retro-mono text-[11px] text-[#5c574f]">
            Giving to {campaign.title}
          </Text>
          <View className="mb-3 flex-row flex-wrap gap-2">
            {RETRO_PRESET_AMOUNTS.map((amount) => {
              const on = !customAmount && selectedAmount === amount;
              return (
                <Pressable
                  key={amount}
                  onPress={() => onSelectPreset(amount)}
                  className={cn(
                    "rounded-lg border-2 border-retro-ink px-3.5 py-2 shadow-[2px_2px_0_#211E1A]",
                    on ? "bg-retro-sky" : "bg-retro-cream",
                  )}
                >
                  <Text
                    className={cn(
                      "font-retro-mono-bold text-[13px]",
                      on ? "text-retro-paper" : "text-retro-ink",
                    )}
                  >
                    {formatCurrency(amount)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            placeholder="£  custom amount…"
            placeholderTextColor="#5c574f"
            keyboardType="numeric"
            value={customAmount}
            onChangeText={onCustomAmountChange}
            className="mb-3 rounded-lg border-2 border-retro-ink bg-white px-3 py-2.5 font-retro-mono text-[13px] text-retro-ink"
          />

          <Pressable
            onPress={() => onAnonymousChange(!donateAnonymously)}
            className="mb-3.5 flex-row items-center gap-2"
          >
            <View
              className={cn(
                "h-4 w-4 items-center justify-center rounded border-2 border-retro-ink",
                donateAnonymously ? "bg-retro-mint" : "bg-white",
              )}
            >
              {donateAnonymously ? (
                <Text className="text-[10px] font-bold text-white">✓</Text>
              ) : null}
            </View>
            <Text className="text-[12.5px] text-retro-ink">Give anonymously</Text>
          </Pressable>

          <View className="flex-row gap-2.5">
            <Pressable
              onPress={onGive}
              disabled={resolved <= 0}
              className="flex-1 items-center rounded-lg border-2 border-retro-ink bg-retro-coral py-2.5 shadow-[3px_3px_0_#211E1A]"
              style={{ opacity: resolved <= 0 ? 0.5 : 1 }}
            >
              <Text className="font-retro-bold text-sm text-retro-paper">
                GIVE {formatCurrency(resolved)}
              </Text>
            </Pressable>
            <Pressable
              onPress={onCancel}
              className="flex-1 items-center rounded-lg border-2 border-retro-ink bg-retro-paper py-2.5 shadow-[3px_3px_0_#211E1A]"
            >
              <Text className="font-retro-bold text-sm text-retro-ink">CANCEL</Text>
            </Pressable>
          </View>
        </>
      )}
    </RetroWindow>
  );
}
