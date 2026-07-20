import { View } from "react-native";
import type { MySociety, Society } from "@/lib/types";
import { SocietyCard } from "@/components/society-card";

interface SocietyCardGridProps {
  societies: Society[] | MySociety[];
  showConnectCta?: boolean;
}

export function SocietyCardGrid({
  societies,
  showConnectCta = false,
}: SocietyCardGridProps) {
  return (
    <View className="flex-row flex-wrap justify-between gap-6">
      {societies.map((society) => (
        <View key={society.slug} className="w-[48%]">
          <SocietyCard society={society} showConnectCta={showConnectCta} />
        </View>
      ))}
    </View>
  );
}
