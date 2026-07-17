import { View, Text, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

export type RetroBarAccent = "coral" | "marigold" | "sky" | "mint" | "pink";

const barClasses: Record<RetroBarAccent, string> = {
  coral: "bg-retro-coral",
  marigold: "bg-retro-marigold",
  sky: "bg-retro-sky",
  mint: "bg-retro-mint",
  pink: "bg-retro-pink",
};

const barTitleClasses: Record<RetroBarAccent, string> = {
  coral: "text-retro-paper",
  marigold: "text-retro-ink",
  sky: "text-retro-paper",
  mint: "text-retro-paper",
  pink: "text-retro-ink",
};

interface RetroWindowProps extends ViewProps {
  title: string;
  accent: RetroBarAccent;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function RetroWindow({
  title,
  accent,
  children,
  className,
  bodyClassName,
  ...rest
}: RetroWindowProps) {
  return (
    <View
      className={cn(
        "overflow-hidden rounded-[14px] border-[3px] border-retro-ink bg-retro-paper shadow-[5px_5px_0_#211E1A]",
        className,
      )}
      {...rest}
    >
      <View
        className={cn(
          "flex-row items-center gap-2.5 border-b-[3px] border-retro-ink px-3 py-2.5",
          barClasses[accent],
        )}
      >
        <View className="mr-1 flex-row gap-1.5">
          <View className="h-[11px] w-[11px] rounded-full border-2 border-retro-ink bg-white" />
          <View className="h-[11px] w-[11px] rounded-full border-2 border-retro-ink bg-retro-marigold" />
          <View className="h-[11px] w-[11px] rounded-full border-2 border-retro-ink bg-retro-ink" />
        </View>
        <Text
          className={cn(
            "font-retro-bold text-[13.5px] uppercase tracking-wide",
            barTitleClasses[accent],
          )}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
      <View className={cn("px-4 pb-[18px] pt-4", bodyClassName)}>{children}</View>
    </View>
  );
}
