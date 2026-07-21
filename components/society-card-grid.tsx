import { View, useWindowDimensions } from "react-native";
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
  const { width } = useWindowDimensions();
  const columns = width >= 1200 ? 3 : width >= 820 ? 2 : 1;

  return (
    <View className="flex-row flex-wrap gap-[22px]">
      {societies.map((society) => (
        <View
          key={society.slug}
          style={{
            flexGrow: 1,
            flexBasis: columns === 3 ? "30%" : columns === 2 ? "45%" : "100%",
            maxWidth: columns === 3 ? "32%" : columns === 2 ? "48.5%" : "100%",
          }}
        >
          <SocietyCard society={society} showConnectCta={showConnectCta} />
        </View>
      ))}
    </View>
  );
}
