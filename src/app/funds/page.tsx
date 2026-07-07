import { Gift, Info } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { FundCard } from "@/components/fund-card";
import { communityFunds } from "@/lib/data";

export default function FundsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dono-text sm:text-3xl">
            Community Funds
          </h1>
          <p className="mt-1 text-dono-muted">
            Donate across related projects without choosing a single campaign
          </p>
        </div>

        <div className="mb-8 flex gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <div>
            <h3 className="text-sm font-semibold text-blue-800">
              How Community Funds work
            </h3>
            <p className="mt-1 text-sm text-blue-700 leading-relaxed">
              Not every donor wants to choose a single campaign. Community Funds
              distribute your donation across related projects — from medical
              textbooks to sports equipment — ensuring your generosity reaches
              where it&apos;s needed most.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {communityFunds.map((fund) => (
            <div key={fund.id} id={fund.id}>
              <FundCard fund={fund} />
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-br from-dono-primary to-dono-primary-dark p-8 text-center">
          <Gift className="mx-auto mb-4 h-8 w-8 text-dono-accent" />
          <h2 className="mb-2 text-xl font-bold text-white">
            Can&apos;t decide? Let the community guide you.
          </h2>
          <p className="mx-auto max-w-md text-sm text-emerald-100">
            Your donation will be distributed to active campaigns within the
            fund&apos;s category, maximising collective impact.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
