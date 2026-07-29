import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Platform,
  Linking,
  Share,
} from "react-native";
import { useAction, useConvexAuth, useQuery } from "convex/react";
import { Download, ExternalLink, Receipt } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import { formatCurrency } from "@/lib/constants";
import { downloadTextFile } from "@/lib/download-blob";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { getFriendlyConnectError } from "@/lib/stripe/errors";
import type { Campaign } from "@/lib/types";

interface LeaderDonationLedgerProps {
  slug: string;
}

function formatLedgerDate(createdAt: number) {
  return new Date(createdAt).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncateStripeId(id: string | null) {
  if (!id) return "—";
  if (id.length <= 14) return id;
  return `${id.slice(0, 10)}…${id.slice(-4)}`;
}

export function LeaderDonationLedger({ slug }: LeaderDonationLedgerProps) {
  const { isAuthenticated } = useConvexAuth();
  const [campaignSlug, setCampaignSlug] = useState<string | undefined>(undefined);
  const [exporting, setExporting] = useState(false);
  const [openingDashboard, setOpeningDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardLoginEmail, setDashboardLoginEmail] = useState<string | null>(null);

  const communityCampaigns = useQuery(
    api.campaigns.listByCommunity,
    slug ? { communityId: slug } : "skip",
  ) as Campaign[] | undefined;

  const ledger = useQuery(
    api.societyDonations.listForSocietyLeader,
    isAuthenticated && slug
      ? {
          communitySlug: slug,
          campaignSlug,
          limit: 50,
        }
      : "skip",
  );

  const exportDonationsCsv = useAction(api.societyDonations.exportDonationsCsv);
  const createConnectDashboardLink = useAction(api.stripeConnect.createConnectDashboardLink);

  const handleExport = async () => {
    setExporting(true);
    setError(null);
    try {
      const result = await exportDonationsCsv({
        communitySlug: slug,
        campaignSlug,
      });

      if (Platform.OS === "web") {
        downloadTextFile(result.csv, result.filename, "text/csv;charset=utf-8");
        return;
      }

      await Share.share({
        message: result.csv,
        title: result.filename,
      });
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setExporting(false);
    }
  };

  const handleOpenDashboard = async () => {
    setOpeningDashboard(true);
    setError(null);
    try {
      const { url, loginEmail } = await createConnectDashboardLink({
        communitySlug: slug,
      });
      if (loginEmail) setDashboardLoginEmail(loginEmail);
      await Linking.openURL(url);
    } catch (err) {
      setError(getFriendlyConnectError(err));
    } finally {
      setOpeningDashboard(false);
    }
  };

  if (ledger === undefined) {
    return (
      <View className="items-center rounded-2xl border border-dono-border bg-white py-8">
        <ActivityIndicator color="#17211B" />
      </View>
    );
  }

  return (
    <View className="rounded-2xl border border-dono-border bg-white p-5">
      <View className="mb-3 flex-row items-start gap-2">
        <Receipt size={20} color="#17211B" />
        <View className="flex-1">
          <Text className="font-retro-bold text-lg text-dono-text">Donation ledger</Text>
          <Text className="mt-1 text-xs leading-relaxed text-dono-muted">
            See which campaign each payment belongs to so you can delegate funds to the
            right campaign lead. Anonymous donors are never identified by name or email.
          </Text>
        </View>
      </View>

      <View className="mb-4 flex-row flex-wrap gap-3">
        <View className="rounded-xl border border-dono-border bg-dono-surface px-4 py-3">
          <Text className="text-xs text-dono-muted">Net to campaigns</Text>
          <Text className="font-retro-bold text-lg text-dono-text">
            {formatCurrency(ledger.summary.totalNetToCampaignGbp)}
          </Text>
        </View>
        <View className="rounded-xl border border-dono-border bg-dono-surface px-4 py-3">
          <Text className="text-xs text-dono-muted">Payments shown</Text>
          <Text className="font-retro-bold text-lg text-dono-text">
            {ledger.summary.donationCount}
          </Text>
        </View>
      </View>

      <Text className="mb-2 text-xs leading-relaxed text-dono-muted">
        In Stripe Dashboard, payments appear as{" "}
        <Text className="font-retro-bold text-dono-text">Dono: {"{Campaign title}"}</Text>.
        Open a payment to view metadata for{" "}
        <Text className="font-retro-bold text-dono-text">campaignSlug</Text> and{" "}
        <Text className="font-retro-bold text-dono-text">donationId</Text>.
        {dashboardLoginEmail
          ? ` Sign in with ${dashboardLoginEmail}.`
          : " Sign in with the email used during Stripe payout setup."}
      </Text>

      {communityCampaigns && communityCampaigns.length > 1 ? (
        <View className="mb-4 flex-row flex-wrap gap-2">
          <Pressable
            onPress={() => setCampaignSlug(undefined)}
            className={`rounded-full px-3 py-1.5 ${
              campaignSlug === undefined ? "bg-dono-primary" : "border border-dono-border"
            }`}
          >
            <Text
              className={`font-retro-bold text-xs ${
                campaignSlug === undefined ? "text-white" : "text-dono-text"
              }`}
            >
              All campaigns
            </Text>
          </Pressable>
          {communityCampaigns.map((campaign) => (
            <Pressable
              key={campaign.id}
              onPress={() => setCampaignSlug(campaign.id)}
              className={`rounded-full px-3 py-1.5 ${
                campaignSlug === campaign.id
                  ? "bg-dono-primary"
                  : "border border-dono-border"
              }`}
            >
              <Text
                className={`font-retro-bold text-xs ${
                  campaignSlug === campaign.id ? "text-white" : "text-dono-text"
                }`}
              >
                {campaign.title}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View className="mb-4 flex-row flex-wrap gap-2">
        <Pressable
          onPress={() => void handleExport()}
          disabled={exporting}
          className="flex-row items-center gap-2 rounded-full bg-dono-primary px-4 py-2"
        >
          {exporting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Download size={16} color="#fff" />
          )}
          <Text className="font-retro-bold text-sm text-white">
            {Platform.OS === "web" ? "Download CSV" : "Export CSV"}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => void handleOpenDashboard()}
          disabled={openingDashboard}
          className="flex-row items-center gap-2 rounded-full border border-dono-border px-4 py-2"
        >
          {openingDashboard ? (
            <ActivityIndicator size="small" color="#17211B" />
          ) : (
            <ExternalLink size={16} color="#17211B" />
          )}
          <Text className="font-retro-bold text-sm text-dono-text">Open Stripe Dashboard</Text>
        </Pressable>
      </View>

      {error ? <Text className="mb-3 text-xs text-rose-700">{error}</Text> : null}

      {ledger.rows.length === 0 ? (
        <Text className="text-sm text-dono-muted">No donations recorded yet.</Text>
      ) : (
        <View className="gap-0 overflow-hidden rounded-xl border border-dono-border">
          <View className="flex-row border-b border-dono-border bg-dono-surface px-3 py-2">
            <Text className="w-[88px] shrink-0 text-xs font-retro-bold text-dono-muted">
              Date
            </Text>
            <Text className="min-w-[120px] flex-1 text-xs font-retro-bold text-dono-muted">
              Campaign
            </Text>
            <Text className="w-[72px] shrink-0 text-right text-xs font-retro-bold text-dono-muted">
              Amount
            </Text>
            <Text className="hidden w-[100px] shrink-0 text-xs font-retro-bold text-dono-muted md:flex">
              Donor
            </Text>
            <Text className="hidden w-[88px] shrink-0 text-xs font-retro-bold text-dono-muted lg:flex">
              Stripe PI
            </Text>
          </View>
          {ledger.rows.map((row) => (
            <View
              key={row.donationId}
              className="flex-row border-b border-dono-border px-3 py-2 last:border-b-0"
            >
              <Text className="w-[88px] shrink-0 text-xs text-dono-muted">
                {formatLedgerDate(row.createdAt)}
              </Text>
              <View className="min-w-[120px] flex-1 pr-2">
                <Text className="text-xs font-retro-bold text-dono-text" numberOfLines={2}>
                  {row.campaignTitle}
                </Text>
                <Text className="text-[10px] text-dono-muted">{row.campaignContactName}</Text>
              </View>
              <Text className="w-[72px] shrink-0 text-right text-xs text-dono-text">
                {formatCurrency(row.netToCampaignGbp)}
              </Text>
              <Text
                className="hidden w-[100px] shrink-0 text-xs text-dono-muted md:flex"
                numberOfLines={1}
              >
                {row.donorName || "—"}
              </Text>
              <Text className="hidden w-[88px] shrink-0 font-retro-mono text-[10px] text-dono-muted lg:flex">
                {truncateStripeId(row.stripePaymentIntentId)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
