import { useState } from "react";
import { Modal, View, Text, Pressable, TextInput, ActivityIndicator } from "react-native";
import { AlertTriangle, Trash2 } from "lucide-react-native";
import { getFriendlyAuthError } from "@/lib/auth/errors";

interface AdminHardDeleteDialogProps {
  /** e.g. "campaign" or "society" — used in copy only. */
  entityLabel: string;
  /** Exact title/name the admin must retype to enable the confirm button. */
  entityName: string;
  /** Bullet lines describing what else gets permanently deleted along with it. */
  cascadeSummary: string[];
  /** When set, deletion is blocked entirely and this explains why (e.g. real
   * donation/payout records exist, or dependent records still reference it). */
  blockedReason?: string | null;
  onConfirm: () => Promise<void>;
}

/** Two-step delete confirmation: open a modal, then retype the exact name
 * before the confirm button enables — deliberately more friction than a
 * single click, since this is only ever reachable from an already-archived
 * record and is irreversible. */
export function AdminHardDeleteDialog({
  entityLabel,
  entityName,
  cascadeSummary,
  blockedReason,
  onConfirm,
}: AdminHardDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matches = typed.trim().length > 0 && typed.trim() === entityName;

  const close = () => {
    if (busy) return;
    setOpen(false);
    setTyped("");
    setError(null);
  };

  const handleConfirm = async () => {
    if (!matches || busy) return;
    setBusy(true);
    setError(null);
    try {
      await onConfirm();
      setOpen(false);
      setTyped("");
    } catch (err) {
      setError(getFriendlyAuthError(err) || "Failed to delete.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Pressable
        onPress={() => {
          setOpen(true);
          setTyped("");
          setError(null);
        }}
        className="mt-4 flex-row items-center justify-center gap-2 rounded-xl border border-rose-300 bg-white py-3"
      >
        <Trash2 size={16} color="#be123c" />
        <Text className="font-retro-bold text-sm text-rose-700">
          Delete permanently
        </Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/50 px-4"
          onPress={close}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl border-2 border-rose-300 bg-white p-6"
          >
            <View className="mb-3 flex-row items-center gap-2">
              <AlertTriangle size={18} color="#be123c" />
              <Text className="flex-1 font-retro-bold text-lg text-dono-text">
                Permanently delete this {entityLabel}?
              </Text>
            </View>

            {blockedReason ? (
              <>
                <View className="rounded-xl bg-rose-50 px-4 py-3">
                  <Text className="text-sm text-rose-700">{blockedReason}</Text>
                </View>
                <Pressable onPress={close} className="mt-4 items-end">
                  <Text className="font-retro-bold text-sm text-dono-muted">
                    Close
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text className="text-sm text-dono-muted">
                  This cannot be undone. This will also permanently delete:
                </Text>
                <View className="mt-2 gap-1">
                  {cascadeSummary.map((line) => (
                    <Text key={line} className="text-sm text-dono-text">
                      • {line}
                    </Text>
                  ))}
                </View>

                <Text className="mt-4 text-xs font-retro-bold text-dono-muted">
                  Type &quot;{entityName}&quot; to confirm
                </Text>
                <TextInput
                  value={typed}
                  onChangeText={setTyped}
                  placeholder={entityName}
                  placeholderTextColor="#56615A"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="mt-1.5 rounded-lg border border-dono-border px-3 py-2.5 text-sm text-dono-text"
                />

                {error ? (
                  <Text className="mt-2 text-xs text-rose-700">{error}</Text>
                ) : null}

                <View className="mt-4 flex-row justify-end gap-2">
                  <Pressable
                    onPress={close}
                    disabled={busy}
                    className="rounded-xl px-4 py-2.5"
                  >
                    <Text className="font-retro-bold text-sm text-dono-muted">
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => void handleConfirm()}
                    disabled={!matches || busy}
                    className={`flex-row items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 ${
                      !matches || busy ? "opacity-50" : ""
                    }`}
                  >
                    {busy ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Trash2 size={14} color="#fff" />
                    )}
                    <Text className="font-retro-bold text-sm text-white">
                      {busy ? "Deleting..." : "Delete permanently"}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
