import { Modal, Pressable, Text, View } from "react-native";
import type { SocietySubscribeSheetProps } from "./society-subscribe-sheet-types";

/** Society subscriptions are web-only for now — same constraint the old
 * campaign-level monthly donation flow had on native. */
export function SocietySubscribeSheet({
  visible,
  societyName,
  onClose,
}: SocietySubscribeSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="rounded-t-3xl bg-white px-6 pb-6 pt-6">
          <Text className="font-retro-bold text-xl text-dono-text">
            Subscribe to {societyName}
          </Text>
          <Text className="mt-3 text-sm text-dono-muted">
            Society subscriptions aren't supported in this app yet — please subscribe
            from dono.com on the web.
          </Text>
          <Pressable
            onPress={onClose}
            className="mt-6 items-center rounded-full bg-dono-primary py-3"
          >
            <Text className="font-retro-bold text-sm text-white">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
