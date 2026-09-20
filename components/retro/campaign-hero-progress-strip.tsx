import { View, Text } from "react-native";
import { formatCurrency, getProgress } from "@/lib/constants";
import { cn } from "@/lib/utils";

type CampaignHeroProgressStripProps = {
  raised: number;
  goal: number;
  className?: string;
};

/** Full-bleed fundraising bar for the bottom of the campaign hero — mint fill
 *  grows over a cream track, with remaining-amount copy overlaid on top. */
export function CampaignHeroProgressStrip({
  raised,
  goal,
  className,
}: CampaignHeroProgressStripProps) {
  const progress = getProgress(raised, goal);
  const remaining = Math.max(0, goal - raised);
  const fullyFunded = remaining <= 0;

  return (
    <View
      className={cn(
        "relative h-12 overflow-hidden border-t-[3px] border-retro-ink bg-retro-cream",
        className,
      )}
    >
      {progress > 0 ? (
        <View
          className="absolute inset-y-0 left-0 bg-retro-mint"
          style={{ width: `${progress}%` }}
        />
      ) : null}
      <View className="absolute inset-0 flex-row items-center justify-between px-4">
        <Text className="font-retro-mono-bold text-sm text-retro-ink">
          {progress}%
        </Text>
        <Text className="font-retro-mono-bold text-sm text-retro-ink">
          {fullyFunded
            ? "Fully funded"
            : `${formatCurrency(remaining)} still needed`}
        </Text>
      </View>
    </View>
  );
}
