import { View, type ViewProps } from "react-native";
import { LinearGradient } from "./linear-gradient-fallback";
import { cn } from "@/lib/utils";

const gradients: Record<string, [string, string]> = {
  anatomy: ["#059669", "#115e59"],
  orchestra: ["#7c3aed", "#6b21a8"],
  conference: ["#2563eb", "#3730a3"],
  welfare: ["#f43f5e", "#be185d"],
  rowing: ["#0284c7", "#1e40af"],
  theatre: ["#d97706", "#c2410c"],
  medical: ["#10b981", "#15803d"],
  college: ["#475569", "#1e293b"],
  computing: ["#0891b2", "#1d4ed8"],
  textbooks: ["#3b82f6", "#4338ca"],
  hardship: ["#f43f5e", "#b91c1c"],
  music: ["#a855f7", "#6d28d9"],
  sports: ["#22c55e", "#047857"],
  internship: ["#f59e0b", "#c2410c"],
};

interface CampaignImageProps extends ViewProps {
  image: string;
  className?: string;
  children?: React.ReactNode;
}

export function CampaignImage({ image, className, children, style, ...rest }: CampaignImageProps) {
  const colors = gradients[image] || ["#0d5c4b", "#094539"];

  return (
    <View className={cn("relative overflow-hidden", className)} style={style} {...rest}>
      <LinearGradient colors={colors} className="absolute inset-0" />
      {children}
    </View>
  );
}
