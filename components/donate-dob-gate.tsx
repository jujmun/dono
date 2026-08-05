import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { isAtLeastAge, parseIsoDateOnly } from "@/lib/age";
import { getFriendlyAuthError } from "@/lib/auth/errors";

const inputClassName =
  "w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text";

/**
 * For signed-in donors: require a stored adult DOB before payment can start.
 * Guests are handled via the legal checkbox attestation only.
 */
export function useDonateDobGate(isAuthenticated: boolean) {
  const profile = useQuery(api.users.me, isAuthenticated ? {} : "skip");
  const updateProfile = useMutation(api.users.updateProfile);
  const [dobInput, setDobInput] = useState("");
  const [dobError, setDobError] = useState<string | null>(null);
  const [dobSaving, setDobSaving] = useState(false);

  const profileLoading = isAuthenticated && profile === undefined;
  const hasDateOfBirth = Boolean(profile?.dateOfBirth);
  const needsDob = isAuthenticated && !profileLoading && !hasDateOfBirth;
  const dobReady = !isAuthenticated || hasDateOfBirth;

  const saveDob = async () => {
    setDobError(null);
    const trimmed = dobInput.trim();
    if (!parseIsoDateOnly(trimmed)) {
      setDobError("Enter your date of birth as YYYY-MM-DD.");
      return;
    }
    if (!isAtLeastAge(trimmed)) {
      setDobError("You must be at least 18 years old to donate.");
      return;
    }
    setDobSaving(true);
    try {
      await updateProfile({
        name: profile?.name ?? "",
        dateOfBirth: trimmed,
      });
      setDobInput("");
    } catch (err) {
      setDobError(getFriendlyAuthError(err));
    } finally {
      setDobSaving(false);
    }
  };

  return {
    profileLoading,
    needsDob,
    dobReady,
    dobInput,
    setDobInput,
    dobError,
    dobSaving,
    saveDob,
  };
}

export function DonateDobGateForm({
  dobInput,
  onDobInputChange,
  dobError,
  dobSaving,
  onSave,
}: {
  dobInput: string;
  onDobInputChange: (value: string) => void;
  dobError: string | null;
  dobSaving: boolean;
  onSave: () => void;
}) {
  return (
    <View className="mt-3 rounded-xl border border-dono-border bg-dono-surface-muted p-3">
      <Text className="mb-1.5 text-sm font-semibold text-dono-text">
        Confirm your date of birth
      </Text>
      <Text className="mb-2 text-xs text-dono-muted">
        You must be at least 18 to donate. We store this on your profile.
      </Text>
      <TextInput
        value={dobInput}
        onChangeText={onDobInputChange}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#56615A"
        autoCapitalize="none"
        className={inputClassName}
      />
      {dobError ? (
        <Text className="mt-1.5 text-xs text-rose-700">{dobError}</Text>
      ) : null}
      <Pressable
        onPress={onSave}
        disabled={dobSaving || !dobInput.trim()}
        className={`retro-key mt-2 self-start rounded-full bg-dono-primary px-4 py-2 ${
          dobSaving || !dobInput.trim() ? "opacity-50" : ""
        }`}
      >
        {dobSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-sm font-semibold text-white">Save date of birth</Text>
        )}
      </Pressable>
    </View>
  );
}
