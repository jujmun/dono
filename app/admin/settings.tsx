import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Switch } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { AdminShell } from "@/components/admin-shell";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { canAccessAdminPortal } from "@/lib/auth/is-portal-admin";
import { getFriendlyAuthError } from "@/lib/auth/errors";

type FlagKey =
  | "disableNewCampaigns"
  | "disableDonations"
  | "disableRegistration"
  | "disableComments";

const FLAG_ROWS: { key: FlagKey; label: string; hint: string }[] = [
  {
    key: "disableNewCampaigns",
    label: "Disable new campaigns",
    hint: "Blocks campaign.create on the server.",
  },
  {
    key: "disableDonations",
    label: "Disable donations",
    hint: "Blocks createPaymentIntent / donate gates.",
  },
  {
    key: "disableRegistration",
    label: "Disable registration",
    hint: "Blocks sign-up and new profile creation.",
  },
  {
    key: "disableComments",
    label: "Disable comments",
    hint: "Blocks engagement.addComment.",
  },
];

export default function AdminPlatformSettingsPage() {
  const profile = useCurrentProfile();
  const adminUser = canAccessAdminPortal(profile);
  const flags = useQuery(api.platformSettings.get, adminUser ? {} : "skip");
  const setFlags = useMutation(api.platformSettings.setFlags);
  const [busyKey, setBusyKey] = useState<FlagKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggle = async (key: FlagKey, next: boolean) => {
    setError(null);
    setBusyKey(key);
    try {
      await setFlags({ [key]: next });
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusyKey(null);
    }
  };

  if (profile === undefined || (adminUser && flags === undefined)) {
    return (
      <AdminShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
          <Text className="mt-4 text-dono-muted">Loading settings...</Text>
        </View>
      </AdminShell>
    );
  }

  if (!adminUser) {
    return (
      <AdminShell>
        <View className="mx-auto w-full max-w-lg px-4 py-16">
          <Text className="font-retro-bold text-2xl text-dono-text">
            Access denied
          </Text>
        </View>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <View className="mx-auto w-full max-w-2xl px-4 py-8">
        <Text className="font-retro-bold text-2xl text-dono-text">
          Platform kill switches
        </Text>
        <Text className="mt-2 text-sm text-dono-muted">
          Independent emergency switches. Each is enforced server-side. Missing
          document = all switches off.
        </Text>

        {error ? (
          <Text className="mt-4 text-sm text-rose-700">{error}</Text>
        ) : null}

        <View className="mt-6 gap-3">
          {FLAG_ROWS.map((row) => {
            const value = flags?.[row.key] ?? false;
            return (
              <View
                key={row.key}
                className="flex-row items-center justify-between gap-4 rounded-2xl border border-dono-border bg-white px-4 py-4"
              >
                <View className="flex-1">
                  <Text className="font-retro-bold text-base text-dono-text">
                    {row.label}
                  </Text>
                  <Text className="mt-1 text-sm text-dono-muted">{row.hint}</Text>
                </View>
                {busyKey === row.key ? (
                  <ActivityIndicator color="#17211B" />
                ) : (
                  <Switch
                    value={value}
                    onValueChange={(next) => void toggle(row.key, next)}
                    trackColor={{ false: "#d4d0c8", true: "#17211B" }}
                    thumbColor="#ffffff"
                  />
                )}
              </View>
            );
          })}
        </View>

        {flags?.updatedAt ? (
          <Text className="mt-6 text-xs text-dono-muted">
            Last updated {new Date(flags.updatedAt).toLocaleString("en-GB")}
          </Text>
        ) : null}
      </View>
    </AdminShell>
  );
}
