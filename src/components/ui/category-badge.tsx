import { categoryColors, categoryLabels } from "@/lib/data";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        categoryColors[category] || "bg-gray-100 text-gray-700",
        className
      )}
    >
      {categoryLabels[category] || category}
    </span>
  );
}
