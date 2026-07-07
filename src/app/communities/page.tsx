"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CommunityCard } from "@/components/community-card";
import { communities } from "@/lib/data";

const typeFilters = [
  { id: "all", label: "All" },
  { id: "college", label: "Colleges" },
  { id: "society", label: "Societies" },
  { id: "department", label: "Departments" },
];

export default function CommunitiesPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const filtered = communities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.university.toLowerCase().includes(search.toLowerCase());
    const matchesType = type === "all" || c.type === type;
    return matchesSearch && matchesType;
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dono-text sm:text-3xl">Communities</h1>
          <p className="mt-1 text-dono-muted">
            Follow colleges, societies, and departments. Campaigns come and go — communities remain.
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dono-muted" />
            <input
              type="text"
              placeholder="Search communities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-dono-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-dono-primary focus:ring-2 focus:ring-dono-primary/20"
            />
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {typeFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setType(f.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                type === f.id
                  ? "bg-dono-primary text-white"
                  : "bg-white text-dono-muted border border-dono-border hover:border-dono-primary/30"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
