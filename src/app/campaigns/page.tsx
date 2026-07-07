"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CampaignCard } from "@/components/campaign-card";
import { campaigns, categoryLabels } from "@/lib/data";

const categories = ["all", ...Object.keys(categoryLabels)];

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = campaigns.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.university.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || c.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dono-text sm:text-3xl">Campaigns</h1>
          <p className="mt-1 text-dono-muted">
            Support specific, tangible projects at universities across the UK
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dono-muted" />
            <input
              type="text"
              placeholder="Search campaigns, universities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-dono-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-dono-primary focus:ring-2 focus:ring-dono-primary/20"
            />
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-dono-muted" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                category === cat
                  ? "bg-dono-primary text-white"
                  : "bg-white text-dono-muted border border-dono-border hover:border-dono-primary/30"
              }`}
            >
              {cat === "all" ? "All" : categoryLabels[cat]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dono-border bg-white p-12 text-center">
            <p className="text-dono-muted">No campaigns match your search.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
