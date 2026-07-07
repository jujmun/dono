import Link from "next/link";
import { Users, Target } from "lucide-react";
import type { CommunityFund } from "@/lib/types";
import { formatCurrency } from "@/lib/data";
import { CampaignImage } from "./ui/campaign-image";
import { CategoryBadge } from "./ui/category-badge";

interface FundCardProps {
  fund: CommunityFund;
}

export function FundCard({ fund }: FundCardProps) {
  return (
    <Link
      href={`/funds#${fund.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-dono-border bg-white transition-shadow hover:shadow-lg"
    >
      <CampaignImage image={fund.image} className="h-36">
        <div className="absolute left-3 top-3">
          <CategoryBadge category={fund.category} />
        </div>
      </CampaignImage>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 font-semibold text-dono-text group-hover:text-dono-primary">
          {fund.name}
        </h3>
        <p className="mb-3 line-clamp-2 flex-1 text-sm text-dono-muted">
          {fund.description}
        </p>

        <p className="mb-3 text-xl font-bold text-dono-primary">
          {formatCurrency(fund.totalRaised)}
        </p>

        <div className="flex items-center gap-4 text-xs text-dono-muted">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {fund.donors.toLocaleString()} donors
          </span>
          <span className="flex items-center gap-1">
            <Target className="h-3.5 w-3.5" />
            {fund.campaignsSupported} campaigns
          </span>
        </div>
      </div>
    </Link>
  );
}
