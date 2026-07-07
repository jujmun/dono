import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Heart,
  Share2,
  UserPlus,
  Gift,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CampaignImage } from "@/components/ui/campaign-image";
import { VerificationList } from "@/components/ui/verification-badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CategoryBadge } from "@/components/ui/category-badge";
import { EngagementStats } from "@/components/activity-feed";
import { CampaignCard } from "@/components/campaign-card";
import {
  getCampaign,
  campaigns,
  formatCurrency,
  getProgress,
} from "@/lib/data";

const donationAmounts = [10, 25, 50, 100];

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = getCampaign(id);

  if (!campaign) notFound();

  const progress = getProgress(campaign.raised, campaign.goal);
  const related = campaigns
    .filter((c) => c.id !== campaign.id && c.category === campaign.category)
    .slice(0, 2);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Link
          href="/campaigns"
          className="mb-4 inline-flex items-center gap-1 text-sm text-dono-muted hover:text-dono-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to campaigns
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CampaignImage image={campaign.image} className="mb-6 h-56 rounded-2xl sm:h-72">
              <div className="absolute left-4 top-4">
                <CategoryBadge category={campaign.category} />
              </div>
              {campaign.status === "funded" && (
                <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-emerald-700 backdrop-blur-sm">
                  <CheckCircle2 className="h-4 w-4" /> Fully Funded
                </div>
              )}
            </CampaignImage>

            <div className="mb-4">
              <VerificationList verifications={campaign.verifications} size="md" />
            </div>

            <h1 className="mb-3 text-2xl font-bold text-dono-text sm:text-3xl">
              {campaign.title}
            </h1>

            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-dono-muted">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {campaign.university}
                {campaign.college && ` · ${campaign.college}`}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Deadline: {new Date(campaign.deadline).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <EngagementStats
              likes={campaign.likes}
              donors={campaign.donors}
              followers={campaign.followers}
              comments={campaign.comments}
              className="mb-6"
            />

            <div className="mb-8 rounded-2xl border border-dono-border bg-white p-6">
              <h2 className="mb-3 text-lg font-semibold text-dono-text">The Story</h2>
              <p className="text-dono-muted leading-relaxed">{campaign.story}</p>
            </div>

            {campaign.impactItems && (
              <div className="mb-8 rounded-2xl border border-dono-border bg-white p-6">
                <h2 className="mb-3 text-lg font-semibold text-dono-text">
                  What your donation funds
                </h2>
                <ul className="space-y-2">
                  {campaign.impactItems.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-dono-muted">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-dono-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {campaign.updates.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-lg font-semibold text-dono-text">Updates</h2>
                <div className="space-y-4">
                  {campaign.updates.map((update) => (
                    <div
                      key={update.id}
                      className="rounded-2xl border border-dono-border bg-white p-5"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold text-dono-text">{update.title}</h3>
                        <span className="text-xs text-dono-muted">
                          {new Date(update.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-dono-muted leading-relaxed">
                        {update.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-dono-border bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dono-primary text-sm font-bold text-white">
                  {campaign.creator.avatar}
                </div>
                <div>
                  <p className="font-semibold text-dono-text">{campaign.creator.name}</p>
                  <p className="text-sm capitalize text-dono-muted">
                    {campaign.creator.type}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-dono-border bg-white p-6">
                <div className="mb-4">
                  <div className="flex items-baseline justify-between">
                    <p className="text-3xl font-bold text-dono-primary">
                      {formatCurrency(campaign.raised)}
                    </p>
                    <p className="text-sm text-dono-muted">
                      of {formatCurrency(campaign.goal)}
                    </p>
                  </div>
                  <ProgressBar value={progress} className="mt-3" showLabel />
                  <p className="mt-2 text-sm text-dono-muted">
                    {campaign.donors} donors · {campaign.followers} followers
                  </p>
                </div>

                {campaign.status !== "funded" && (
                  <>
                    <div className="mb-4 grid grid-cols-4 gap-2">
                      {donationAmounts.map((amount) => (
                        <button
                          key={amount}
                          className="rounded-xl border border-dono-border py-2.5 text-sm font-semibold text-dono-text transition-colors hover:border-dono-primary hover:bg-dono-primary/5"
                        >
                          £{amount}
                        </button>
                      ))}
                    </div>

                    <button className="mb-3 flex w-full items-center justify-center gap-2 rounded-full bg-dono-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-dono-accent-dark">
                      <Gift className="h-4 w-4" />
                      Donate Now
                    </button>
                  </>
                )}

                <div className="flex gap-2">
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-dono-border py-2.5 text-sm font-medium text-dono-muted transition-colors hover:border-dono-primary/30">
                    <Heart className="h-4 w-4" /> Like
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-dono-border py-2.5 text-sm font-medium text-dono-muted transition-colors hover:border-dono-primary/30">
                    <UserPlus className="h-4 w-4" /> Follow
                  </button>
                  <button className="flex items-center justify-center rounded-xl border border-dono-border px-3 py-2.5 text-dono-muted transition-colors hover:border-dono-primary/30">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <h3 className="mb-2 text-sm font-semibold text-emerald-800">
                  Trust & Verification
                </h3>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  This campaign has been verified by its creator&apos;s identity and
                  {campaign.verifications.some((v) => v.type === "institutional")
                    ? " institutionally endorsed."
                    : " validated by the community."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-dono-text">Related Campaigns</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {related.map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
