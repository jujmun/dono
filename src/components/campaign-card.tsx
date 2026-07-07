import Link from "next/link";
import { Heart, Users, MessageCircle } from "lucide-react";
import type { Campaign } from "@/lib/types";
import { formatCurrency, getProgress } from "@/lib/data";
import { CampaignImage } from "./ui/campaign-image";
import { VerificationList } from "./ui/verification-badge";
import { ProgressBar } from "./ui/progress-bar";
import { CategoryBadge } from "./ui/category-badge";

interface CampaignCardProps {
  campaign: Campaign;
  variant?: "default" | "compact";
}

export function CampaignCard({ campaign, variant = "default" }: CampaignCardProps) {
  const progress = getProgress(campaign.raised, campaign.goal);

  if (variant === "compact") {
    return (
      <Link
        href={`/campaigns/${campaign.id}`}
        className="group flex gap-3 rounded-xl border border-dono-border bg-white p-3 transition-shadow hover:shadow-md"
      >
        <CampaignImage
          image={campaign.image}
          className="h-16 w-16 shrink-0 rounded-lg"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-dono-text group-hover:text-dono-primary">
            {campaign.title}
          </h3>
          <p className="text-xs text-dono-muted">{campaign.university}</p>
          <div className="mt-1.5">
            <ProgressBar value={progress} />
          </div>
          <p className="mt-1 text-xs font-medium text-dono-primary">
            {formatCurrency(campaign.raised)} of {formatCurrency(campaign.goal)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-dono-border bg-white transition-shadow hover:shadow-lg"
    >
      <CampaignImage image={campaign.image} className="h-44">
        <div className="absolute left-3 top-3">
          <CategoryBadge category={campaign.category} />
        </div>
        {campaign.status === "funded" && (
          <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 backdrop-blur-sm">
            Fully Funded
          </div>
        )}
      </CampaignImage>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2">
          <VerificationList verifications={campaign.verifications.slice(0, 1)} />
        </div>

        <h3 className="mb-1 line-clamp-2 text-base font-semibold text-dono-text group-hover:text-dono-primary">
          {campaign.title}
        </h3>

        <p className="mb-3 line-clamp-2 text-sm text-dono-muted">
          {campaign.description}
        </p>

        <div className="mt-auto">
          <ProgressBar value={progress} className="mb-2" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-dono-primary">
                {formatCurrency(campaign.raised)}
              </p>
              <p className="text-xs text-dono-muted">
                of {formatCurrency(campaign.goal)} goal
              </p>
            </div>
            <div className="flex items-center gap-3 text-dono-muted">
              <span className="flex items-center gap-1 text-xs">
                <Users className="h-3.5 w-3.5" />
                {campaign.donors}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Heart className="h-3.5 w-3.5" />
                {campaign.likes}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <MessageCircle className="h-3.5 w-3.5" />
                {campaign.comments}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
