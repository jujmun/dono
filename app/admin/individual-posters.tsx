import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useMutation, useQuery } from "convex/react";
import { Check, X } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { AdminShell } from "@/components/admin-shell";
import { AdminStatusChip } from "@/lib/admin-labels";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { canAccessAdminPortal } from "@/lib/auth/is-portal-admin";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { cn } from "@/lib/utils";

function formatSubmittedAt(ms: number) {
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminIndividualPostersPage() {
  const profile = useCurrentProfile();
  const adminUser = canAccessAdminPortal(profile);

  const pending = useQuery(
    api.individualPosters.listPending,
    adminUser ? {} : "skip",
  );
  const approve = useMutation(api.individualPosters.approve);
  const reject = useMutation(api.individualPosters.reject);

  const [busy, setBusy] = useState<{
    id: Id<"individualPosters">;
    action: "approve" | "reject";
  } | null>(null);
  const [reasonOpenId, setReasonOpenId] =
    useState<Id<"individualPosters"> | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleApprove = async (id: Id<"individualPosters">) => {
    setError(null);
    setInfo(null);
    setBusy({ id, action: "approve" });
    try {
      await approve({ applicationId: id });
      setInfo("Applicant approved as an individual poster.");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusy(null);
    }
  };

  const submitReject = async () => {
    if (!reasonOpenId) return;
    const trimmed = reason.trim();
    if (!trimmed) {
      setError("A reason is required.");
      return;
    }
    setError(null);
    setInfo(null);
    setBusy({ id: reasonOpenId, action: "reject" });
    try {
      await reject({ applicationId: reasonOpenId, reviewNote: trimmed });
      setInfo("Application denied.");
      setReasonOpenId(null);
      setReason("");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    } finally {
      setBusy(null);
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

  if (!adminUser) {
    return (
      <AdminShell>
        <View className="mx-auto w-full max-w-lg px-4 py-16">
          <Text className="font-retro-display text-2xl text-dono-text">
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
        <Text className="font-retro-display text-2xl text-dono-text">
          Individual poster applications
        </Text>
        <Text className="mt-2 text-sm text-dono-muted">
          Approve students to post campaigns without a society behind them.
        </Text>

        {error ? (
          <View className="mb-4 mt-6 rounded-xl bg-rose-50 px-4 py-3">
            <Text className="text-sm text-rose-700">{error}</Text>
          </View>
        ) : null}
        {info ? (
          <View className="mb-4 mt-6 rounded-xl bg-green-50 px-4 py-3">
            <Text className="text-sm text-green-700">{info}</Text>
          </View>
        ) : null}

        <View className={cn("gap-4", !error && !info ? "mt-6" : "")}>
          {pending === undefined ? (
            <View className="items-center py-12">
              <ActivityIndicator color="#17211B" />
              <Text className="mt-4 text-dono-muted">
                Loading applications...
              </Text>
            </View>
          ) : pending.length === 0 ? (
            <View className="rounded-2xl border border-dono-border bg-white px-6 py-10">
              <Text className="font-retro-bold text-base text-dono-text">
                No pending applications
              </Text>
              <Text className="mt-2 text-sm text-dono-muted">
                New individual poster applications will show up here.
              </Text>
            </View>
          ) : (
            pending.map((application) => {
              const busyHere = busy?.id === application.id;
              const reasonOpen = reasonOpenId === application.id;
              return (
                <View
                  key={application.id}
                  className="rounded-2xl border border-dono-border bg-white p-5"
                >
                  <View className="mb-2">
                    <AdminStatusChip label="Pending" tone="pending" />
                  </View>
                  <Text className="font-retro-display text-lg text-dono-text">
                    {application.name}
                  </Text>
                  <Text className="mt-1 text-xs text-dono-muted">
                    {application.email} · Applied{" "}
                    {formatSubmittedAt(application.createdAt)}
                  </Text>
                  <Text className="mt-3 text-sm text-dono-text">
                    {application.reason}
                  </Text>

                  {reasonOpen ? (
                    <View className="mt-4 rounded-xl border border-rose-200 p-4">
                      <Text className="font-retro-bold text-sm text-dono-text">
                        Why are you denying this?
                      </Text>
                      <Text className="mt-1 text-xs text-dono-muted">
                        Required.
                      </Text>
                      <TextInput
                        value={reason}
                        onChangeText={setReason}
                        multiline
                        numberOfLines={3}
                        placeholder="Explain what's missing…"
                        placeholderTextColor="#56615A"
                        className="mt-3 min-h-[80px] rounded-xl border border-dono-border px-4 py-3 text-sm text-dono-text"
                        textAlignVertical="top"
                        maxLength={1000}
                      />
                      <View className="mt-3 flex-row justify-end gap-2">
                        <Pressable
                          onPress={() => {
                            setReasonOpenId(null);
                            setReason("");
                            setError(null);
                          }}
                          disabled={busy !== null}
                          className="rounded-xl px-4 py-2.5"
                        >
                          <Text className="font-retro-bold text-sm text-dono-muted">
                            Cancel
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() => void submitReject()}
                          disabled={busy !== null || !reason.trim()}
                          className={cn(
                            "flex-row items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5",
                            busy !== null || !reason.trim() ? "opacity-50" : "",
                          )}
                        >
                          <X size={15} color="#fff" />
                          <Text className="font-retro-bold text-sm text-white">
                            {busyHere && busy?.action === "reject"
                              ? "Working..."
                              : "Confirm deny"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : (
                    <View className="mt-4 flex-row gap-2">
                      <Pressable
                        onPress={() => void handleApprove(application.id)}
                        disabled={busy !== null}
                        className={cn(
                          "flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-dono-primary py-3",
                          busy !== null ? "opacity-50" : "",
                        )}
                      >
                        <Check size={16} color="#fff" />
                        <Text className="font-retro-bold text-sm text-white">
                          {busyHere && busy?.action === "approve"
                            ? "Working..."
                            : "Approve"}
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          setError(null);
                          setReason("");
                          setReasonOpenId(application.id);
                        }}
                        disabled={busy !== null}
                        className={cn(
                          "flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3",
                          busy !== null ? "opacity-50" : "",
                        )}
                      >
                        <X size={16} color="#be123c" />
                        <Text className="font-retro-bold text-sm text-rose-700">
                          Deny
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </View>
    </AdminShell>
  );
}
