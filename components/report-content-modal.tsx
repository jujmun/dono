import { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Flag } from "lucide-react-native";
import { getFriendlyAuthError } from "@/lib/auth/errors";

const MAX_REASON_LENGTH = 2000;

interface ReportContentModalProps {
  visible: boolean;
  /** e.g. "comment", "campaign", "society" — used in copy only. */
  label: string;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
}

/** Reason-input dialog shared by comment/campaign/society report buttons.
 * Caller owns the trigger button and `visible` state; this only collects the
 * reason and calls onSubmit, mirroring admin-hard-delete-dialog's modal shape. */
export function ReportContentModal({
  visible,
  label,
  onClose,
  onSubmit,
}: ReportContentModalProps) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = reason.trim();
  const valid = trimmed.length > 0 && trimmed.length <= MAX_REASON_LENGTH;

  const close = () => {
    if (busy) return;
    setReason("");
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setError(null);
    try {
      await onSubmit(trimmed);
      setReason("");
      onClose();
    } catch (err) {
      setError(getFriendlyAuthError(err) || "Failed to submit report.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 px-4"
        onPress={close}
      >
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className="w-full max-w-md rounded-2xl border-2 border-rose-300 bg-white p-6"
        >
          <View className="mb-3 flex-row items-center gap-2">
            <Flag size={18} color="#be123c" />
            <Text className="flex-1 font-retro-bold text-lg text-dono-text">
              Report this {label}
            </Text>
          </View>
          <Text className="text-sm text-dono-muted">
            Tell us what&apos;s wrong. Our admins will review it.
          </Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="Why are you reporting this?"
            placeholderTextColor="#56615A"
            multiline
            maxLength={MAX_REASON_LENGTH}
            className="mt-3 min-h-[96px] rounded-lg border border-dono-border px-3 py-2.5 text-sm text-dono-text"
            textAlignVertical="top"
          />
          <Text className="mt-1 text-right text-xs text-dono-muted">
            {reason.length}/{MAX_REASON_LENGTH}
          </Text>

          {error ? (
            <Text className="mt-2 text-xs text-rose-700">{error}</Text>
          ) : null}

          <View className="mt-4 flex-row justify-end gap-2">
            <Pressable onPress={close} disabled={busy} className="rounded-xl px-4 py-2.5">
              <Text className="font-retro-bold text-sm text-dono-muted">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => void handleSubmit()}
              disabled={!valid || busy}
              className={`flex-row items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 ${
                !valid || busy ? "opacity-50" : ""
              }`}
            >
              {busy ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Flag size={14} color="#fff" />
              )}
              <Text className="font-retro-bold text-sm text-white">
                {busy ? "Submitting..." : "Submit report"}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
