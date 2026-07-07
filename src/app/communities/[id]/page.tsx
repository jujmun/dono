import Link from "next/link";
import { notFound } from "next/navigation";
import { UserPlus, ArrowLeft, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CampaignImage } from "@/components/ui/campaign-image";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { CampaignCard } from "@/components/campaign-card";
import { getCommunity, getCampaignsByCommunity, formatCurrency } from "@/lib/data";

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const community = getCommunity(id);

  if (!community) notFound();

  const communityCampaigns = getCampaignsByCommunity(id);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Link
          href="/communities"
          className="mb-4 inline-flex items-center gap-1 text-sm text-dono-muted hover:text-dono-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to communities
        </Link>

        <CampaignImage image={community.coverImage} className="mb-6 h-48 rounded-2xl sm:h-56">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </CampaignImage>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-dono-primary text-xl font-bold text-white shadow-lg">
              {community.avatar}
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <h1 className="text-2xl font-bold text-dono-text">{community.name}</h1>
                {community.verified && community.verificationType && (
                  <VerificationBadge
                    verification={{
                      type: community.verificationType,
                      label: "Verified",
                    }}
                  />
                )}
              </div>
              <p className="text-sm text-dono-muted">{community.university}</p>
              <p className="mt-2 max-w-xl text-dono-muted leading-relaxed">
                {community.description}
              </p>
            </div>
          </div>

          <button className="inline-flex shrink-0 items-center gap-2 rounded-full bg-dono-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dono-primary-dark">
            <UserPlus className="h-4 w-4" />
            Follow
          </button>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: "Followers", value: community.followers.toLocaleString() },
            { label: "Campaigns", value: community.campaigns.toString() },
            { label: "Total Raised", value: formatCurrency(community.totalRaised) },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-dono-border bg-white p-4 text-center"
            >
              <p className="text-xl font-bold text-dono-primary">{stat.value}</p>
              <p className="text-xs text-dono-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-6 flex items-center gap-2">
            <Target className="h-5 w-5 text-dono-primary" />
            <h2 className="text-xl font-bold text-dono-text">Campaigns</h2>
          </div>

          {communityCampaigns.length === 0 ? (
            <div className="rounded-2xl border border-dono-border bg-white p-12 text-center">
              <p className="text-dono-muted">No active campaigns yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {communityCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
