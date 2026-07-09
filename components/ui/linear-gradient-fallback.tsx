import { View, StyleSheet, type ViewProps } from "react-native";

/** Lightweight gradient stand-in without expo-linear-gradient peer weight. */
export function LinearGradient({
  colors,
  className,
  style,
  children,
  ...rest
}: ViewProps & {
  colors: [string, string];
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <View
      className={className}
      style={[styles.base, { backgroundColor: colors[0] }, style]}
      {...rest}
    >
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: colors[1], opacity: 0.55 }]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
  },
});
