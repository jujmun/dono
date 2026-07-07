import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Heart,
  Users,
  Eye,
  Sparkles,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CampaignCard } from "@/components/campaign-card";
import { CommunityCard } from "@/components/community-card";
import { FundCard } from "@/components/fund-card";
import { campaigns, communities, communityFunds } from "@/lib/data";

const principles = [
  {
    icon: Eye,
    title: "Radical transparency",
    description: "See exactly where every pound goes. No opaque institutional funds.",
  },
  {
    icon: Heart,
    title: "Small donations, big impact",
    description: "Thousands of meaningful £10–£50 donations create enormous collective change.",
  },
  {
    icon: Users,
    title: "Communities over campaigns",
    description: "Campaigns come and go. Communities of supporters remain.",
  },
  {
    icon: Shield,
    title: "Trust through visibility",
    description: "Verified identities, institutional endorsements, and community validation.",
  },
];

const engagementLoop = [
  "Donate",
  "Receive updates",
  "See impact",
  "Friends donate",
  "Match donations",
  "Dono Wrapped",
  "Donate again",
];

export default function HomePage() {
  const featuredCampaigns = campaigns.slice(0, 3);
  const featuredCommunities = communities.slice(0, 3);
  const featuredFunds = communityFunds.slice(0, 3);

  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dono-primary via-dono-primary to-dono-primary-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(232,114,74,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="max-w-2xl animate-fade-up">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-emerald-200">
              Community infrastructure for university giving
            </p>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Where did my money{" "}
              <span className="text-dono-accent">actually go?</span>
            </h1>
            <p className="mb-8 text-lg text-emerald-100/90 leading-relaxed">
              Dono enables young alumni to collectively fund tangible improvements
              to student life. Support specific campaigns, follow communities, and
              see the real impact of every contribution.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/campaigns"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-dono-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dono-accent-dark"
              >
                Explore Campaigns
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Start a Campaign
              </Link>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 animate-fade-up-delay-2">
            {[
              { value: "£2.4M+", label: "Raised" },
              { value: "12K+", label: "Donors" },
              { value: "340+", label: "Campaigns" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="text-sm text-emerald-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Insight */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-dono-border bg-white p-8 sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <Sparkles className="mx-auto mb-4 h-8 w-8 text-dono-accent" />
            <h2 className="mb-4 text-2xl font-bold text-dono-text sm:text-3xl">
              People don&apos;t dislike giving
            </h2>
            <p className="text-lg text-dono-muted leading-relaxed">
              They dislike giving without knowing what difference they made.
              Dono is built around visible, specific, low-opacity giving — so
              every donor knows exactly where their money went.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-dono-text">Active Campaigns</h2>
            <p className="mt-1 text-dono-muted">
              Tangible projects with clear, specific outcomes
            </p>
          </div>
          <Link
            href="/campaigns"
            className="hidden items-center gap-1 text-sm font-semibold text-dono-primary hover:underline sm:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="bg-dono-surface-muted">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-dono-text">Built on trust</h2>
            <p className="mt-2 text-dono-muted">
              Every product decision reinforces transparency and community
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-dono-border bg-white p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-dono-primary/10">
                  <p.icon className="h-5 w-5 text-dono-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-dono-text">{p.title}</h3>
                <p className="text-sm text-dono-muted leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Loop */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-dono-text">
            Making generosity habitual
          </h2>
          <p className="mt-2 text-dono-muted">
            The donor journey is continuous, not one-off
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {engagementLoop.map((step, i) => (
            <div key={step} className="flex items-center gap-2 sm:gap-3">
              <span className="rounded-full bg-dono-primary/10 px-4 py-2 text-sm font-medium text-dono-primary">
                {step}
              </span>
              {i < engagementLoop.length - 1 && (
                <span className="text-dono-muted">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Communities */}
      <section className="bg-dono-surface-muted">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-dono-text">Communities</h2>
              <p className="mt-1 text-dono-muted">
                Follow colleges, societies, and departments you care about
              </p>
            </div>
            <Link
              href="/communities"
              className="hidden items-center gap-1 text-sm font-semibold text-dono-primary hover:underline sm:flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        </div>
      </section>

      {/* Community Funds */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-dono-text">Community Funds</h2>
            <p className="mt-1 text-dono-muted">
              Donate across related projects without choosing a single campaign
            </p>
          </div>
          <Link
            href="/funds"
            className="hidden items-center gap-1 text-sm font-semibold text-dono-primary hover:underline sm:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredFunds.map((fund) => (
            <FundCard key={fund.id} fund={fund} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="rounded-2xl bg-gradient-to-br from-dono-primary to-dono-primary-dark p-8 text-center sm:p-12">
          <TrendingUp className="mx-auto mb-4 h-8 w-8 text-dono-accent" />
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
            Ready to make a difference?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-emerald-100">
            Join thousands of young alumni building lifelong communities of
            generosity. Every donation deserves a visible outcome.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 rounded-full bg-dono-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dono-accent-dark"
            >
              Find a Campaign
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Create a Campaign
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-emerald-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Free for students
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Secure payments
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Full transparency
            </span>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
