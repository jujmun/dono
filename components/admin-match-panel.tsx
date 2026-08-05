import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { formatCurrency } from "@/lib/constants";

type AdminMatchPanelProps = {
  campaignSlug: string;
  enabled?: boolean;
};

export function AdminMatchPanel({
  campaignSlug,
  enabled = true,
}: AdminMatchPanelProps) {
  const windows = useQuery(
    api.campaignMatches.listForCampaignAdmin,
    enabled ? { campaignSlug } : "skip",
  );
  const createMatch = useMutation(api.campaignMatches.create);
  const endMatch = useMutation(api.campaignMatches.end);

  const [multiplier, setMultiplier] = useState("2");
  const [budget, setBudget] = useState("500");
  const [sponsorLabel, setSponsorLabel] = useState("Alumni Board");
  const [days, setDays] = useState("14");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  if (!enabled) return null;

  const live = (windows ?? []).find((w) => w.active && w.remainingPounds > 0);

  const handleCreate = async () => {
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      const mult = Number(multiplier);
      const budgetPounds = Number(budget);
      const durationDays = Number(days);
      if (!Number.isFinite(mult) || mult <= 1) {
        throw new Error("Multiplier must be greater than 1.");
      }
      if (!Number.isFinite(budgetPounds) || budgetPounds <= 0) {
        throw new Error("Budget must be a positive amount.");
      }
      if (!Number.isFinite(durationDays) || durationDays < 1) {
        throw new Error("Duration must be at least 1 day.");
      }
      const startsAt = Date.now();
      const endsAt = startsAt + durationDays * 24 * 60 * 60 * 1000;
      await createMatch({
        campaignSlug,
        multiplier: mult,
        budgetPounds,
        sponsorLabel,
        startsAt,
        endsAt,
      });
      setInfo("Match window created.");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleEnd = async (matchWindowId: Id<"campaignMatchWindows">) => {
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      await endMatch({ matchWindowId });
      setInfo("Match window ended.");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View className="mt-8 rounded-2xl border border-dono-border bg-white p-5">
      <Text className="font-retro-bold text-base text-dono-text">
        Match window
      </Text>
      <Text className="mt-1 text-sm text-dono-muted">
        Commitment tracker only — does not move Stripe funds or inflate raised.
        Ensure the sponsor has funded (or will fund) the match pool separately.
      </Text>

      {windows === undefined ? (
        <ActivityIndicator className="mt-4" color="#17211B" />
      ) : live ? (
        <View className="mt-4 rounded-xl border border-dono-border bg-dono-cream/60 p-4">
          <Text className="font-retro-bold text-sm text-dono-text">
            Active: {live.multiplier}× by {live.sponsorLabel}
          </Text>
          <Text className="mt-1 font-retro-mono text-xs text-dono-muted">
            {formatCurrency(live.remainingPounds)} of{" "}
            {formatCurrency(live.budgetPounds)} remaining
          </Text>
          <Text className="mt-1 font-retro-mono text-xs text-dono-muted">
            Ends {new Date(live.endsAt).toLocaleString("en-GB")}
          </Text>
          <Pressable
            disabled={busy}
            onPress={() => void handleEnd(live.id as Id<"campaignMatchWindows">)}
            className="mt-3 items-center rounded-full border border-rose-300 bg-rose-50 py-2.5"
          >
            <Text className="font-retro-bold text-sm text-rose-800">
              End match early
            </Text>
          </Pressable>
        </View>
      ) : (
        <View className="mt-4 gap-3">
          <View className="flex-row flex-wrap gap-3">
            <View className="min-w-[100px] flex-1">
              <Text className="mb-1 text-xs text-dono-muted">Multiplier</Text>
              <TextInput
                value={multiplier}
                onChangeText={setMultiplier}
                keyboardType="decimal-pad"
                className="rounded-lg border border-dono-border bg-white px-3 py-2 font-retro-mono text-sm text-dono-text"
              />
            </View>
            <View className="min-w-[100px] flex-1">
              <Text className="mb-1 text-xs text-dono-muted">Budget (£)</Text>
              <TextInput
                value={budget}
                onChangeText={setBudget}
                keyboardType="decimal-pad"
                className="rounded-lg border border-dono-border bg-white px-3 py-2 font-retro-mono text-sm text-dono-text"
              />
            </View>
            <View className="min-w-[100px] flex-1">
              <Text className="mb-1 text-xs text-dono-muted">Days</Text>
              <TextInput
                value={days}
                onChangeText={setDays}
                keyboardType="number-pad"
                className="rounded-lg border border-dono-border bg-white px-3 py-2 font-retro-mono text-sm text-dono-text"
              />
            </View>
          </View>
          <View>
            <Text className="mb-1 text-xs text-dono-muted">Sponsor label</Text>
            <TextInput
              value={sponsorLabel}
              onChangeText={setSponsorLabel}
              className="rounded-lg border border-dono-border bg-white px-3 py-2 font-retro-mono text-sm text-dono-text"
            />
          </View>
          <Pressable
            disabled={busy}
            onPress={() => void handleCreate()}
            className="retro-key items-center rounded-full bg-dono-primary py-3"
          >
            <Text className="font-retro-bold text-sm text-white">
              {busy ? "Saving…" : "Create match window"}
            </Text>
          </Pressable>
        </View>
      )}

      {error ? (
        <Text className="mt-3 text-sm text-rose-700">{error}</Text>
      ) : null}
      {info ? (
        <Text className="mt-3 text-sm text-dono-primary">{info}</Text>
      ) : null}

      {windows && windows.length > 0 ? (
        <View className="mt-4 gap-2 border-t border-dono-border pt-4">
          <Text className="font-retro-bold text-xs uppercase text-dono-muted">
            History
          </Text>
          {windows.slice(0, 5).map((window) => (
            <Text
              key={window.id}
              className="font-retro-mono text-xs text-dono-muted"
            >
              {window.multiplier}× · {formatCurrency(window.consumedPounds)}/
              {formatCurrency(window.budgetPounds)} ·{" "}
              {window.active ? "active" : "ended"} · {window.sponsorLabel}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}
