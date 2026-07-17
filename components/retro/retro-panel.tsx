import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

export type RetroPanelAccent = "coral" | "marigold" | "sky" | "mint" | "pink" | "indigo";

const barClasses: Record<RetroPanelAccent, string> = {
  coral: "bg-retro-coral",
  marigold: "bg-retro-marigold",
  sky: "bg-retro-sky",
  mint: "bg-retro-mint",
  pink: "bg-retro-pink",
  indigo: "bg-retro-indigo",
};

const barTitleClasses: Record<RetroPanelAccent, string> = {
  coral: "text-retro-paper",
  marigold: "text-retro-ink",
  sky: "text-retro-paper",
  mint: "text-retro-paper",
  pink: "text-retro-ink",
  indigo: "text-retro-paper",
};

interface RetroPanelProps {
  title: string;
  accent?: RetroPanelAccent;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function RetroPanel({
  title,
  accent = "marigold",
  children,
  className,
  bodyClassName,
}: RetroPanelProps) {
  return (
    <View
      className={cn(
        "mb-5 overflow-hidden rounded-[14px] border-[3px] border-retro-ink bg-retro-paper shadow-[5px_5px_0_#211E1A]",
        className,
      )}
    >
      <View
        className={cn(
          "flex-row items-center gap-2.5 border-b-[3px] border-retro-ink px-3.5 py-2.5",
          barClasses[accent],
        )}
      >
        <View className="flex-row gap-1.5">
          <View className="h-2.5 w-2.5 rounded-full border-2 border-retro-ink bg-white" />
          <View className="h-2.5 w-2.5 rounded-full border-2 border-retro-ink bg-white" />
        </View>
        <Text
          className={cn(
            "font-retro-bold text-[13.5px] uppercase",
            barTitleClasses[accent],
          )}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
      <View className={cn("px-[18px] py-4", bodyClassName)}>{children}</View>
    </View>
  );
}
