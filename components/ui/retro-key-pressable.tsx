import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { cn } from "@/lib/utils";
import { retroKeyClass, retroKeyMintClass } from "@/lib/retro-key";

type RetroKeyPressableProps = PressableProps & {
  className?: string;
  style?: StyleProp<ViewStyle>;
  /** Mint hard-shadow variant (owned / accent). Default ink. */
  mint?: boolean;
};

/** Pressable with the shared retro keyboard-key hover/press motion. */
export function RetroKeyPressable({
  className,
  mint = false,
  disabled,
  ...props
}: RetroKeyPressableProps) {
  return (
    <Pressable
      disabled={disabled}
      className={cn(mint ? retroKeyMintClass : retroKeyClass, className)}
      {...props}
    />
  );
}
