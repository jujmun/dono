import { View, Text, ActivityIndicator } from "react-native";
import { useQuery } from "convex/react";
import { Gift, Info } from "lucide-react-native";
import { AppShell } from "@/components/app-shell";
import { FundCard } from "@/components/fund-card";
import { api } from "@convex/_generated/api";
import type { CommunityFund } from "@/lib/types";

export default function FundsPage() {
  const communityFunds = (useQuery(api.funds.list) ?? undefined) as
    | CommunityFund[]
    | undefined;

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-7xl px-4 py-8">
        <View className="mb-8">
          <Text className="text-2xl font-bold text-dono-text">Community Funds</Text>
          <Text className="mt-1 text-dono-muted">
            Donate across related projects without choosing a single campaign
          </Text>
        </View>

        <View className="mb-8 flex-row gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <Info size={20} color="#2563eb" />
          <View className="flex-1">
            <Text className="text-sm font-semibold text-blue-800">
              How Community Funds work
            </Text>
            <Text className="mt-1 text-sm leading-relaxed text-blue-700">
              Not every donor wants to choose a single campaign. Community Funds
              distribute your donation across related projects — from medical textbooks
              to sports equipment — ensuring your generosity reaches where it&apos;s
              needed most.
            </Text>
          </View>
        </View>

        {communityFunds === undefined ? (
          <ActivityIndicator color="#0d5c4b" />
        ) : communityFunds.length === 0 ? (
          <View className="rounded-2xl border border-dono-border bg-white p-12">
            <Text className="text-center text-dono-muted">
              No community funds available yet.
            </Text>
          </View>
        ) : (
          <View className="gap-6">
            {communityFunds.map((fund) => (
              <FundCard key={fund.id} fund={fund} />
            ))}
          </View>
        )}

        <View className="mt-12 rounded-2xl bg-dono-primary p-8">
          <View className="items-center">
            <Gift size={32} color="#e8724a" />
            <Text className="mb-2 mt-4 text-center text-xl font-bold text-white">
              Can&apos;t decide? Let the community guide you.
            </Text>
            <Text className="max-w-md text-center text-sm text-emerald-100">
              Your donation will be distributed to active campaigns within the
              fund&apos;s category, maximising collective impact.
            </Text>
          </View>
        </View>
      </View>
    </AppShell>
  );
}
