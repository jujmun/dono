import { View, Image, type ViewProps } from "react-native";
import { LinearGradient } from "./linear-gradient-fallback";
import { cn } from "@/lib/utils";

function isPhotoImage(image: string): boolean {
  return /^(https?|file|blob|data):/.test(image);
}

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
  if (isPhotoImage(image)) {
    return (
      <View className={cn("relative overflow-hidden", className)} style={style} {...rest}>
        <Image
          source={{ uri: image }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }}
          resizeMode="cover"
          accessibilityLabel="Campaign image"
        />
        {children}
      </View>
    );
  }

  const colors = gradients[image] || ["#1d242f", "#151a22"];

  return (
    <View className={cn("relative overflow-hidden", className)} style={style} {...rest}>
      <LinearGradient colors={colors} className="absolute inset-0" />
      {children}
    </View>
  );
}
