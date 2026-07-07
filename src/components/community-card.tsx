import Link from "next/link";
import { Users, Target } from "lucide-react";
import type { Community } from "@/lib/types";
import { formatCurrency } from "@/lib/data";
import { CampaignImage } from "./ui/campaign-image";
import { VerificationBadge } from "./ui/verification-badge";

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Link
      href={`/communities/${community.id}`}
      className="group overflow-hidden rounded-2xl border border-dono-border bg-white transition-shadow hover:shadow-lg"
    >
      <CampaignImage image={community.coverImage} className="h-28">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
      </CampaignImage>

      <div className="relative px-4 pb-4">
        <div className="absolute -top-8 left-4 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-white bg-dono-primary text-lg font-bold text-white shadow-md">
          {community.avatar}
        </div>

        <div className="pt-9">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-dono-text group-hover:text-dono-primary">
              {community.name}
            </h3>
            {community.verified && community.verificationType && (
              <VerificationBadge
                verification={{
                  type: community.verificationType,
                  label: "Verified",
                }}
              />
            )}
          </div>

          <p className="mb-3 text-xs text-dono-muted">{community.university}</p>

          <p className="mb-3 line-clamp-2 text-sm text-dono-muted">
            {community.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-dono-muted">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {community.followers.toLocaleString()} followers
            </span>
            <span className="flex items-center gap-1">
              <Target className="h-3.5 w-3.5" />
              {community.campaigns} campaigns
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold text-dono-primary">
            {formatCurrency(community.totalRaised)} raised
          </p>
        </div>
      </div>
    </Link>
  );
}
