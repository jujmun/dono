import { cn } from "@/lib/utils";

const gradients: Record<string, string> = {
  anatomy: "from-emerald-600 to-teal-800",
  orchestra: "from-violet-600 to-purple-800",
  conference: "from-blue-600 to-indigo-800",
  welfare: "from-rose-500 to-pink-700",
  rowing: "from-sky-600 to-blue-800",
  theatre: "from-amber-600 to-orange-800",
  medical: "from-emerald-500 to-green-700",
  college: "from-slate-600 to-slate-800",
  computing: "from-cyan-600 to-blue-800",
  textbooks: "from-blue-500 to-indigo-700",
  hardship: "from-rose-500 to-red-700",
  music: "from-purple-500 to-violet-700",
  sports: "from-green-500 to-emerald-700",
  internship: "from-amber-500 to-orange-700",
};

interface CampaignImageProps {
  image: string;
  className?: string;
  children?: React.ReactNode;
}

export function CampaignImage({ image, className, children }: CampaignImageProps) {
  const gradient = gradients[image] || "from-dono-primary to-dono-primary-dark";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        gradient,
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
      {children}
    </div>
  );
}
