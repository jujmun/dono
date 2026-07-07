import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, className, showLabel = false }: ProgressBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-dono-surface-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-dono-primary to-dono-accent transition-all duration-500"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-right text-xs font-medium text-dono-muted">
          {value}% funded
        </p>
      )}
    </div>
  );
}
