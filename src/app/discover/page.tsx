import { AppShell } from "@/components/app-shell";
import { ActivityFeedItem } from "@/components/activity-feed";
import { CampaignCard } from "@/components/campaign-card";
import { activityFeed, campaigns } from "@/lib/data";
import { Sparkles } from "lucide-react";

export default function DiscoverPage() {
  const trending = campaigns
    .sort((a, b) => b.likes + b.donors - (a.likes + a.donors))
    .slice(0, 3);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dono-text sm:text-3xl">Discover</h1>
          <p className="mt-1 text-dono-muted">
            See what&apos;s happening across the Dono community
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-dono-text">
              <Sparkles className="h-5 w-5 text-dono-accent" />
              Trending Campaigns
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {trending.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-dono-text">
              Live Activity
            </h2>
            <div className="space-y-3">
              {activityFeed.map((item) => (
                <ActivityFeedItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
