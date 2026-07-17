import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TextInput,
  Linking,
} from "react-native";
import { useAction, useMutation, useQuery } from "convex/react";
import { type Href, useRouter } from "expo-router";
import {
  ChevronRight,
  Search,
  Check,
  X,
  Globe,
  Link2,
  Paperclip,
  IdCard,
  RefreshCw,
} from "lucide-react-native";
import { api } from "@convex/_generated/api";
import { AdminShell } from "@/components/admin-shell";
import { AdminStatsNav } from "@/components/admin-stats-nav";
import {
  AdminStatusChip,
  selfieMatchChip,
  stripeStatusChip,
  type StripeVerificationStatus,
} from "@/lib/admin-labels";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { isPortalAdmin } from "@/lib/auth/is-portal-admin";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { formatCurrency } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { AdminSociety, Campaign } from "@/lib/types";

type ReviewType = "campaigns" | "societies";

const reviewTypeTabs: { id: ReviewType; label: string }[] = [
  { id: "campaigns", label: "Campaigns" },
  { id: "societies", label: "Societies" },
];

function formatSubmittedAt(ms: number) {
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminPortalPage() {
  const router = useRouter();
  const profile = useCurrentProfile();
  const adminUser = isPortalAdmin(profile);
  const [reviewType, setReviewType] = useState<ReviewType>("campaigns");
  const [search, setSearch] = useState("");
  const trimmedSearch = search.trim();

  const pendingCampaigns = useQuery(
    api.campaigns.listPendingForAdmin,
    adminUser && reviewType === "campaigns"
      ? trimmedSearch
        ? { search: trimmedSearch }
        : {}
      : "skip",
  ) as
    | (Campaign & { stripeVerificationStatus: StripeVerificationStatus })[]
    | undefined;

  const pendingSocieties = useQuery(
    api.societies.listPendingForAdmin,
    adminUser && reviewType === "societies" ? {} : "skip",
  ) as AdminSociety[] | undefined;

  const filteredSocieties = (pendingSocieties ?? []).filter((s) =>
    trimmedSearch ? s.name.toLowerCase().includes(trimmedSearch.toLowerCase()) : true,
  );

  const approveSociety = useMutation(api.societies.approve);
  const rejectSociety = useMutation(api.societies.reject);
  const refreshVerificationStatus = useAction(
    api.societyIdentity.refreshVerificationStatus,
  );
  const [societyBusy, setSocietyBusy] = useState<{
    slug: string;
    action: "approve" | "reject" | "refresh";
  } | null>(null);
  const [societyReasonSlug, setSocietyReasonSlug] = useState<string | null>(null);
  const [societyReason, setSocietyReason] = useState("");
  const [societyError, setSocietyError] = useState<string | null>(null);
  const [societyInfo, setSocietyInfo] = useState<string | null>(null);

  const handleRefreshVerification = async (slug: string) => {
    setSocietyError(null);
    setSocietyInfo(null);
    setSocietyBusy({ slug, action: "refresh" });
    try {
      await refreshVerificationStatus({ slug });
    } catch (err) {
      setSocietyError(getFriendlyAuthError(err));
    } finally {
      setSocietyBusy(null);
    }
  };

  const handleApproveSociety = async (slug: string) => {
    setSocietyError(null);
    setSocietyInfo(null);
    setSocietyBusy({ slug, action: "approve" });
    try {
      await approveSociety({ slug });
      setSocietyInfo("Society approved and now live.");
    } catch (err) {
      setSocietyError(getFriendlyAuthError(err));
    } finally {
      setSocietyBusy(null);
    }
  };

  const submitSocietyReject = async () => {
    if (!societyReasonSlug) return;
    const trimmed = societyReason.trim();
    if (!trimmed) {
      setSocietyError("A reason is required.");
      return;
    }
    setSocietyError(null);
    setSocietyInfo(null);
    setSocietyBusy({ slug: societyReasonSlug, action: "reject" });
    try {
      await rejectSociety({ slug: societyReasonSlug, reason: trimmed });
      setSocietyInfo("Society denied.");
      setSocietyReasonSlug(null);
      setSocietyReason("");
    } catch (err) {
      setSocietyError(getFriendlyAuthError(err));
    } finally {
      setSocietyBusy(null);
    }
  };

  if (profile === undefined) {
    return (
      <AdminShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
          <Text className="mt-4 text-dono-muted">Loading...</Text>
        </View>
      </AdminShell>
    );
  }

  if (!adminUser || profile === null) {
    return (
      <AdminShell>
        <View className="mx-auto w-full max-w-lg px-4 py-16">
          <Text className="font-display-medium text-2xl text-dono-text">
            Access denied
          </Text>
          <Text className="mt-2 text-dono-muted">
            This portal is only available to outreach admins.
          </Text>
        </View>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <View className="mx-auto w-full max-w-3xl px-4 py-8">
        <AdminStatsNav active="waiting" />

        <View className="mb-6 flex-row gap-2">
          {reviewTypeTabs.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setReviewType(t.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5",
                reviewType === t.id
                  ? "bg-dono-primary"
                  : "border border-dono-border bg-white",
              )}
            >
              <Text
                className={cn(
                  "font-sans-medium text-xs",
                  reviewType === t.id ? "text-white" : "text-dono-muted",
                )}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="mb-6 flex-row items-center gap-2 rounded-xl border border-dono-border bg-white px-3 py-2">
          <Search size={16} color="#56615A" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={
              reviewType === "campaigns"
                ? "Search by name or title…"
                : "Search by society name…"
            }
            placeholderTextColor="#56615A"
            className="flex-1 py-2 text-sm text-dono-text"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {reviewType === "campaigns" ? (
          pendingCampaigns === undefined ? (
            <View className="items-center py-12">
              <ActivityIndicator color="#17211B" />
              <Text className="mt-4 text-dono-muted">Loading posts...</Text>
            </View>
          ) : pendingCampaigns.length === 0 ? (
            <View className="rounded-2xl border border-dono-border bg-white px-6 py-10">
              <Text className="font-sans-medium text-base text-dono-text">
                {trimmedSearch ? "No matches" : "You’re all caught up"}
              </Text>
              <Text className="mt-2 text-sm text-dono-muted">
                {trimmedSearch
                  ? "Try a different name or title."
                  : "New student posts will show up here."}
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {pendingCampaigns.map((campaign) => (
                <Pressable
                  key={campaign.id}
                  onPress={() =>
                    router.push(
                      `/admin/${encodeURIComponent(campaign.id)}` as Href,
                    )
                  }
                  className="rounded-2xl border border-dono-border bg-white p-5"
                >
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <View className="mb-2 flex-row flex-wrap gap-2">
                        <AdminStatusChip label="Waiting" tone="waiting" />
                        <AdminStatusChip
                          label={`ID: ${stripeStatusChip(campaign.stripeVerificationStatus).label}`}
                          tone={stripeStatusChip(campaign.stripeVerificationStatus).tone}
                        />
                      </View>
                      <Text className="font-display-medium text-lg text-dono-text">
                        {campaign.title}
                      </Text>
                      <Text className="mt-1 text-sm text-dono-muted">
                        {campaign.creator.name} · {campaign.university} · Goal{" "}
                        {formatCurrency(campaign.goal)}
                      </Text>
                      {campaign.createdAt ? (
                        <Text className="mt-1 text-xs text-dono-muted">
                          Submitted {campaign.createdAt}
                        </Text>
                      ) : null}
                      <Text
                        className="mt-3 text-sm text-dono-text"
                        numberOfLines={3}
                      >
                        {campaign.description}
                      </Text>
                    </View>
                    <View className="items-center gap-0.5 pt-1">
                      <Text className="text-xs font-sans-medium text-dono-muted">
                        Open
                      </Text>
                      <ChevronRight size={18} color="#56615A" />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )
        ) : (
          <>
            {societyError ? (
              <View className="mb-4 rounded-xl bg-rose-50 px-4 py-3">
                <Text className="text-sm text-rose-700">{societyError}</Text>
              </View>
            ) : null}
            {societyInfo ? (
              <View className="mb-4 rounded-xl bg-green-50 px-4 py-3">
                <Text className="text-sm text-green-700">{societyInfo}</Text>
              </View>
            ) : null}

            {pendingSocieties === undefined ? (
              <View className="items-center py-12">
                <ActivityIndicator color="#17211B" />
                <Text className="mt-4 text-dono-muted">Loading societies...</Text>
              </View>
            ) : filteredSocieties.length === 0 ? (
              <View className="rounded-2xl border border-dono-border bg-white px-6 py-10">
                <Text className="font-sans-medium text-base text-dono-text">
                  {trimmedSearch ? "No matches" : "You’re all caught up"}
                </Text>
                <Text className="mt-2 text-sm text-dono-muted">
                  {trimmedSearch
                    ? "Try a different society name."
                    : "New society submissions will show up here."}
                </Text>
              </View>
            ) : (
              <View className="gap-4">
                {filteredSocieties.map((society) => {
                  const busyHere = societyBusy?.slug === society.slug;
                  const reasonOpen = societyReasonSlug === society.slug;
                  return (
                    <View
                      key={society.slug}
                      className="rounded-2xl border border-dono-border bg-white p-5"
                    >
                      <View className="mb-2">
                        <AdminStatusChip label="Waiting" tone="waiting" />
                      </View>
                      <Text className="font-display-medium text-lg text-dono-text">
                        {society.name}
                      </Text>
                      <Text className="mt-1 text-xs text-dono-muted">
                        Submitted {formatSubmittedAt(society.createdAt)}
                      </Text>
                      <Text className="mt-3 text-sm text-dono-text">
                        {society.description}
                      </Text>

                      <View className="mt-4 gap-2">
                        {society.websiteUrl ? (
                          <Pressable
                            onPress={() => void Linking.openURL(society.websiteUrl)}
                            className="flex-row items-center gap-2"
                          >
                            <Globe size={14} color="#56615A" />
                            <Text
                              className="flex-1 text-sm text-dono-primary"
                              numberOfLines={1}
                            >
                              {society.websiteUrl}
                            </Text>
                          </Pressable>
                        ) : null}
                        {society.secondaryLink ? (
                          <Pressable
                            onPress={() =>
                              void Linking.openURL(society.secondaryLink!)
                            }
                            className="flex-row items-center gap-2"
                          >
                            <Link2 size={14} color="#56615A" />
                            <Text
                              className="flex-1 text-sm text-dono-primary"
                              numberOfLines={1}
                            >
                              {society.secondaryLink}
                            </Text>
                          </Pressable>
                        ) : null}
                      </View>

                      <View className="mt-4 rounded-xl border border-dono-border bg-dono-surface-muted p-4">
                        <Text className="mb-2 font-sans-medium text-sm text-dono-text">
                          Verification documents
                        </Text>
                        {society.supportingDocumentUrls.length === 0 ? (
                          <Text className="text-sm text-dono-muted">
                            No supporting documents on file.
                          </Text>
                        ) : (
                          <View className="gap-1.5">
                            {society.supportingDocumentUrls.map((url, index) => (
                              <Pressable
                                key={url}
                                onPress={() => void Linking.openURL(url)}
                                className="flex-row items-center gap-2"
                              >
                                <Paperclip size={14} color="#17211B" />
                                <Text className="text-sm text-dono-primary">
                                  Supporting document {index + 1}
                                </Text>
                              </Pressable>
                            ))}
                          </View>
                        )}
                        <View className="mt-2 flex-row flex-wrap items-center justify-between gap-2 border-t border-dono-border pt-2">
                          {society.idDocumentUrl ? (
                            <Pressable
                              onPress={() =>
                                void Linking.openURL(society.idDocumentUrl!)
                              }
                              className="flex-row items-center gap-2"
                            >
                              <IdCard size={14} color="#17211B" />
                              <Text className="text-sm text-dono-primary">
                                View ID document
                              </Text>
                            </Pressable>
                          ) : (
                            <Text className="text-sm text-dono-muted">
                              ID document unavailable.
                            </Text>
                          )}
                          <View className="flex-row items-center gap-2">
                            <AdminStatusChip
                              label={stripeStatusChip(society.stripeVerificationStatus).label}
                              tone={stripeStatusChip(society.stripeVerificationStatus).tone}
                            />
                            <Pressable
                              onPress={() => void handleRefreshVerification(society.slug)}
                              disabled={societyBusy !== null}
                              accessibilityLabel="Refresh verification status from Stripe"
                              className={cn(
                                "h-6 w-6 items-center justify-center rounded-full border border-dono-border",
                                societyBusy !== null ? "opacity-50" : "",
                              )}
                            >
                              {busyHere && societyBusy?.action === "refresh" ? (
                                <ActivityIndicator size="small" color="#17211B" />
                              ) : (
                                <RefreshCw size={12} color="#56615A" />
                              )}
                            </Pressable>
                          </View>
                        </View>

                        <View className="mt-2 flex-row flex-wrap gap-2">
                          <AdminStatusChip
                            label={selfieMatchChip(society).label}
                            tone={selfieMatchChip(society).tone}
                          />
                        </View>

                        {society.verifiedName || society.verifiedDob ? (
                          <View className="mt-2 rounded-lg border border-dono-border bg-white px-3 py-2">
                            <Text className="text-xs font-sans-medium text-dono-muted">
                              Auto-extracted from ID (Stripe) — reference only, not
                              verified ground truth
                            </Text>
                            {society.verifiedName ? (
                              <Text className="mt-1 text-sm text-dono-text">
                                Name: {society.verifiedName}
                              </Text>
                            ) : null}
                            {society.verifiedDob ? (
                              <Text className="text-sm text-dono-text">
                                DOB: {society.verifiedDob}
                              </Text>
                            ) : null}
                          </View>
                        ) : null}
                      </View>

                      {reasonOpen ? (
                        <View className="mt-4 rounded-xl border border-rose-200 p-4">
                          <Text className="font-sans-medium text-sm text-dono-text">
                            Why are you denying this?
                          </Text>
                          <Text className="mt-1 text-xs text-dono-muted">
                            Required.
                          </Text>
                          <TextInput
                            value={societyReason}
                            onChangeText={setSocietyReason}
                            multiline
                            numberOfLines={3}
                            placeholder="Explain what needs to change…"
                            placeholderTextColor="#56615A"
                            className="mt-3 min-h-[80px] rounded-xl border border-dono-border px-4 py-3 text-sm text-dono-text"
                            textAlignVertical="top"
                            maxLength={1000}
                          />
                          <View className="mt-3 flex-row justify-end gap-2">
                            <Pressable
                              onPress={() => {
                                setSocietyReasonSlug(null);
                                setSocietyReason("");
                                setSocietyError(null);
                              }}
                              disabled={societyBusy !== null}
                              className="rounded-xl px-4 py-2.5"
                            >
                              <Text className="font-sans-medium text-sm text-dono-muted">
                                Cancel
                              </Text>
                            </Pressable>
                            <Pressable
                              onPress={() => void submitSocietyReject()}
                              disabled={societyBusy !== null || !societyReason.trim()}
                              className={cn(
                                "flex-row items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5",
                                societyBusy !== null || !societyReason.trim()
                                  ? "opacity-50"
                                  : "",
                              )}
                            >
                              <X size={15} color="#fff" />
                              <Text className="font-sans-medium text-sm text-white">
                                {busyHere && societyBusy?.action === "reject"
                                  ? "Working..."
                                  : "Confirm deny"}
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      ) : (
                        <View className="mt-4 flex-row gap-2">
                          <Pressable
                            onPress={() => void handleApproveSociety(society.slug)}
                            disabled={societyBusy !== null}
                            className={cn(
                              "flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-dono-primary py-3",
                              societyBusy !== null ? "opacity-50" : "",
                            )}
                          >
                            <Check size={16} color="#fff" />
                            <Text className="font-sans-medium text-sm text-white">
                              {busyHere && societyBusy?.action === "approve"
                                ? "Working..."
                                : "Approve"}
                            </Text>
                          </Pressable>
                          <Pressable
                            onPress={() => {
                              setSocietyError(null);
                              setSocietyReason("");
                              setSocietyReasonSlug(society.slug);
                            }}
                            disabled={societyBusy !== null}
                            className={cn(
                              "flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3",
                              societyBusy !== null ? "opacity-50" : "",
                            )}
                          >
                            <X size={16} color="#be123c" />
                            <Text className="font-sans-medium text-sm text-rose-700">
                              Deny
                            </Text>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}
      </View>
    </AdminShell>
  );
}
