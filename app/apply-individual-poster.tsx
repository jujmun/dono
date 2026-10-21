import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { AppShell } from "@/components/app-shell";
import { LoginGate } from "@/components/login-gate";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import { api } from "@convex/_generated/api";

const MAX_REASON_LENGTH = 1000;

export default function ApplyIndividualPosterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const myStatus = useQuery(
    api.individualPosters.myStatus,
    isAuthenticated ? {} : "skip",
  );
  const apply = useMutation(api.individualPosters.apply);

  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await apply({ reason: reason.trim() });
      router.back();
    } catch (err) {
      setError(
        getFriendlyAuthError(err) || "Could not submit your application.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
        </View>
      </AppShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <AppShell>
        <LoginGate message="To apply as an individual poster, you need to log in." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ScrollView>
        <View className="mx-auto w-full max-w-lg px-4 py-8">
          <Text className="font-retro-display text-2xl text-dono-text">
            Apply to post individually
          </Text>
          <Text className="mt-2 text-sm text-dono-muted">
            Individual posters can create campaigns without a society behind
            them. An admin reviews every application.
          </Text>

          {myStatus === undefined ? (
            <View className="mt-8 items-center">
              <ActivityIndicator color="#17211B" />
            </View>
          ) : myStatus?.status === "pending" ? (
            <View className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <Text className="font-retro-bold text-sm text-amber-900">
                Application pending
              </Text>
              <Text className="mt-2 text-sm text-amber-800">
                An admin is reviewing your application. We'll notify you once
                there's a decision.
              </Text>
            </View>
          ) : myStatus?.status === "approved" && !myStatus.revoked ? (
            <View className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4">
              <Text className="font-retro-bold text-sm text-green-900">
                You're an approved individual poster
              </Text>
              <Text className="mt-2 text-sm text-green-800">
                You can create a campaign without a society from the campaign
                creation screen.
              </Text>
            </View>
          ) : (
            <View className="mt-6">
              {myStatus?.status === "rejected" || myStatus?.revoked ? (
                <View className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4">
                  <Text className="font-retro-bold text-sm text-rose-900">
                    Previous application not approved
                  </Text>
                  {myStatus.reviewNote ? (
                    <Text className="mt-2 text-sm text-rose-800">
                      {myStatus.reviewNote}
                    </Text>
                  ) : null}
                  <Text className="mt-2 text-sm text-rose-800">
                    You can apply again right away.
                  </Text>
                </View>
              ) : null}

              <Text className="font-retro-bold text-sm text-dono-text">
                Why do you need to post individually?
              </Text>
              <TextInput
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={5}
                placeholder="Explain your situation…"
                placeholderTextColor="#56615A"
                className="mt-3 min-h-[120px] rounded-xl border border-dono-border px-4 py-3 text-sm text-dono-text"
                textAlignVertical="top"
                maxLength={MAX_REASON_LENGTH}
              />
              <Text className="mt-1 text-right text-xs text-dono-muted">
                {reason.length}/{MAX_REASON_LENGTH}
              </Text>

              {error ? (
                <View className="mt-3 rounded-xl bg-rose-50 px-4 py-3">
                  <Text className="text-sm text-rose-700">{error}</Text>
                </View>
              ) : null}

              <Pressable
                onPress={() => void handleSubmit()}
                disabled={submitting || !reason.trim()}
                className={`retro-key mt-4 flex-row items-center justify-center gap-2 rounded-full bg-dono-primary px-4 py-3 ${
                  submitting || !reason.trim() ? "opacity-50" : ""
                }`}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="font-retro-bold text-sm text-white">
                    Submit application
                  </Text>
                )}
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </AppShell>
  );
}
