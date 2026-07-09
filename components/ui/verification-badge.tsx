import { View, Text } from "react-native";
import {
  ShieldCheck,
  BadgeCheck,
  Building2,
  GraduationCap,
  Users,
} from "lucide-react-native";
import type { Verification, VerificationType } from "@/lib/types";
import { cn } from "@/lib/utils";

const iconMap: Record<VerificationType, React.ElementType> = {
  student: GraduationCap,
  society: Users,
  college: Building2,
  university: Building2,
  institutional: BadgeCheck,
};

const styleMap: Record<VerificationType, { container: string; text: string }> = {
  student: { container: "bg-blue-50 border-blue-200", text: "text-blue-700" },
  society: { container: "bg-purple-50 border-purple-200", text: "text-purple-700" },
  college: { container: "bg-indigo-50 border-indigo-200", text: "text-indigo-700" },
  university: { container: "bg-slate-50 border-slate-200", text: "text-slate-700" },
  institutional: {
    container: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
  },
};

interface VerificationBadgeProps {
  verification: Verification;
  size?: "sm" | "md";
}

export function VerificationBadge({
  verification,
  size = "sm",
}: VerificationBadgeProps) {
  const Icon = iconMap[verification.type] || ShieldCheck;
  const styles = styleMap[verification.type];
  const iconSize = size === "sm" ? 12 : 16;

  return (
    <View
      className={cn(
        "flex-row items-center gap-1 rounded-full border",
        styles.container,
        size === "sm" ? "px-2 py-0.5" : "px-3 py-1"
      )}
    >
      <Icon size={iconSize} color="#0d5c4b" />
      <Text
        className={cn(
          "font-medium",
          styles.text,
          size === "sm" ? "text-xs" : "text-sm"
        )}
      >
        {verification.label}
      </Text>
    </View>
  );
}

interface VerificationListProps {
  verifications: Verification[];
  size?: "sm" | "md";
}

export function VerificationList({
  verifications,
  size = "sm",
}: VerificationListProps) {
  return (
    <View className="flex-row flex-wrap gap-1.5">
      {verifications.map((v, i) => (
        <VerificationBadge key={i} verification={v} size={size} />
      ))}
    </View>
  );
}
