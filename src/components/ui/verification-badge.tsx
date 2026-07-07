import { ShieldCheck, BadgeCheck, Building2, GraduationCap, Users } from "lucide-react";
import type { Verification, VerificationType } from "@/lib/types";
import { cn } from "@/lib/utils";

const iconMap: Record<VerificationType, React.ElementType> = {
  student: GraduationCap,
  society: Users,
  college: Building2,
  university: Building2,
  institutional: BadgeCheck,
};

const styleMap: Record<VerificationType, string> = {
  student: "bg-blue-50 text-blue-700 border-blue-200",
  society: "bg-purple-50 text-purple-700 border-purple-200",
  college: "bg-indigo-50 text-indigo-700 border-indigo-200",
  university: "bg-slate-50 text-slate-700 border-slate-200",
  institutional: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

interface VerificationBadgeProps {
  verification: Verification;
  size?: "sm" | "md";
}

export function VerificationBadge({ verification, size = "sm" }: VerificationBadgeProps) {
  const Icon = iconMap[verification.type] || ShieldCheck;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        styleMap[verification.type],
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
      title={verification.endorsedBy ? `Endorsed by ${verification.endorsedBy}` : verification.label}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      {verification.label}
    </span>
  );
}

interface VerificationListProps {
  verifications: Verification[];
  size?: "sm" | "md";
}

export function VerificationList({ verifications, size = "sm" }: VerificationListProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {verifications.map((v, i) => (
        <VerificationBadge key={i} verification={v} size={size} />
      ))}
    </div>
  );
}
