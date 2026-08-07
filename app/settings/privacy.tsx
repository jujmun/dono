import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Link, type Href } from "expo-router";
import { AppShell } from "@/components/app-shell";
import {
  COOKIE_NOTICE_VERSION,
  clearAnalyticsConsent,
  getAnalyticsConsentRecord,
  setAnalyticsConsent,
  type AnalyticsConsent,
  type AnalyticsConsentRecord,
} from "@/lib/analytics-consent";

export default function PrivacySettingsPage() {
  const [record, setRecord] = useState<AnalyticsConsentRecord | null | undefined>(
    undefined,
  );
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(() => {
    void getAnalyticsConsentRecord().then(setRecord);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const apply = async (value: AnalyticsConsent) => {
    setSaving(true);
    try {
      await setAnalyticsConsent(value);
      refresh();
      // Full reload so PostHog mounts/unmounts with the new choice.
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } finally {
      setSaving(false);
    }
  };

  const withdraw = async () => {
    setSaving(true);
    try {
      await clearAnalyticsConsent();
      await setAnalyticsConsent("denied");
      refresh();
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } finally {
      setSaving(false);
    }
  };

  const statusLabel =
    record === undefined
      ? "Loading…"
      : record === null
        ? "No decision yet"
        : record.status === "granted"
          ? "Accepted"
          : "Rejected";

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-xl px-4 py-10">
        <Text className="font-retro-bold text-2xl text-dono-text">
          Privacy and analytics settings
        </Text>
        <Text className="mt-2 text-sm leading-relaxed text-dono-muted">
          Choose whether Dono may use PostHog (EU) analytics cookies. Essential
          sign-in storage always works. Stripe may set its own cookies at
          checkout. You can change this at any time — withdrawal applies to
          future collection immediately.
        </Text>

        <View className="mt-6 rounded-2xl border border-dono-border bg-white p-5">
          <Text className="text-sm text-dono-muted">Current choice</Text>
          <Text className="mt-1 font-retro-bold text-lg text-dono-text">
            {statusLabel}
          </Text>
          {record ? (
            <Text className="mt-2 text-xs text-dono-muted">
              Decided {new Date(record.decidedAt).toLocaleString("en-GB")} ·
              Cookie Notice {record.cookieNoticeVersion}
            </Text>
          ) : (
            <Text className="mt-2 text-xs text-dono-muted">
              Cookie Notice version in force: {COOKIE_NOTICE_VERSION}
            </Text>
          )}

          <View className="mt-5 flex-row flex-wrap gap-3">
            <Pressable
              onPress={() => void apply("granted")}
              disabled={saving}
              className="retro-key min-w-[120px] items-center rounded-full bg-dono-primary px-5 py-2.5"
              accessibilityRole="button"
              accessibilityLabel="Accept analytics"
            >
              <Text className="font-retro-bold text-sm text-white">Accept</Text>
            </Pressable>
            <Pressable
              onPress={() => void apply("denied")}
              disabled={saving}
              className="retro-key min-w-[120px] items-center rounded-full border-2 border-dono-border bg-white px-5 py-2.5"
              accessibilityRole="button"
              accessibilityLabel="Reject analytics"
            >
              <Text className="font-retro-bold text-sm text-dono-text">
                Reject
              </Text>
            </Pressable>
          </View>

          {record?.status === "granted" ? (
            <Pressable
              onPress={() => void withdraw()}
              disabled={saving}
              className="mt-4 self-start"
              accessibilityRole="button"
              accessibilityLabel="Withdraw analytics consent"
            >
              <Text className="text-sm text-dono-muted underline">
                Withdraw analytics consent
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View className="mt-6 gap-2">
          <Link href={"/legal/cookie" as Href} asChild>
            <Pressable>
              <Text className="text-sm text-dono-primary underline">
                Cookie Policy
              </Text>
            </Pressable>
          </Link>
          <Link href={"/legal/privacy" as Href} asChild>
            <Pressable>
              <Text className="text-sm text-dono-primary underline">
                Privacy Policy
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </AppShell>
  );
}
