import Link from "next/link";
import {
  Gift,
  Heart,
  Users,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CampaignCard } from "@/components/campaign-card";
import { donorImpact, donoWrapped, campaigns } from "@/lib/data";
import { formatCurrency } from "@/lib/data";

export default function DashboardPage() {
  const followedCampaigns = campaigns.slice(0, 2);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dono-text sm:text-3xl">Your Impact</h1>
          <p className="mt-1 text-dono-muted">
            Track your generosity and see the difference you&apos;ve made
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            {
              icon: Gift,
              label: "Total Donated",
              value: formatCurrency(donorImpact.totalDonated),
            },
            {
              icon: Heart,
              label: "Campaigns Supported",
              value: donorImpact.campaignsSupported.toString(),
            },
            {
              icon: Users,
              label: "Communities",
              value: donorImpact.communitiesFollowed.toString(),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-dono-border bg-white p-4 sm:p-6"
            >
              <stat.icon className="mb-2 h-5 w-5 text-dono-primary" />
              <p className="text-xl font-bold text-dono-text sm:text-2xl">
                {stat.value}
              </p>
              <p className="text-xs text-dono-muted sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Dono Wrapped */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-dono-primary via-emerald-700 to-dono-primary-dark p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-dono-accent" />
                <span className="text-sm font-semibold uppercase tracking-wider text-emerald-200">
                  Dono Wrapped {donoWrapped.year}
                </span>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-white">
                {donoWrapped.rank}
              </h2>
              <p className="max-w-md text-emerald-100 leading-relaxed">
                {donoWrapped.impactStatement}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
            <div>
              <p className="text-lg font-bold text-white sm:text-xl">
                {formatCurrency(donoWrapped.totalDonated)}
              </p>
              <p className="text-xs text-emerald-200">donated</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white sm:text-xl">
                {donoWrapped.campaignsSupported}
              </p>
              <p className="text-xs text-emerald-200">campaigns</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white sm:text-xl truncate">
                {donoWrapped.topCommunity}
              </p>
              <p className="text-xs text-emerald-200">top community</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Impact Highlights */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-dono-text">
              <TrendingUp className="h-5 w-5 text-dono-primary" />
              Your Impact
            </h2>
            <div className="space-y-3">
              {donorImpact.impactHighlights.map((highlight, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-dono-border bg-white p-4"
                >
                  <p className="text-sm text-dono-text leading-relaxed">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Donations */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-dono-text">
              <Calendar className="h-5 w-5 text-dono-primary" />
              Recent Donations
            </h2>
            <div className="space-y-3">
              {donorImpact.recentDonations.map((donation, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-dono-border bg-white p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-dono-text">
                      {donation.campaign}
                    </p>
                    <p className="text-xs text-dono-muted">
                      {new Date(donation.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-dono-primary">
                    {formatCurrency(donation.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Followed Campaigns */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dono-text">
              Campaigns You Follow
            </h2>
            <Link
              href="/campaigns"
              className="flex items-center gap-1 text-sm font-semibold text-dono-primary hover:underline"
            >
              Browse more <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {followedCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} variant="compact" />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
