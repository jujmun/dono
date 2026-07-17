import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { ShieldCheck } from "lucide-react-native";

/** Pulsing (bigger/smaller) shield icon — reads as "still working on it". */
export function VerifyingIndicator({ size, color }: { size: number; color: string }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.25,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <ShieldCheck size={size} color={color} />
    </Animated.View>
  );
}
