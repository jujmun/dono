import { View } from "react-native";
import type { Society } from "@/lib/types";
import { SocietyCard } from "@/components/society-card";

interface SocietyCardGridProps {
  societies: Society[];
}

export function SocietyCardGrid({ societies }: SocietyCardGridProps) {
  return (
    <View className="flex-row flex-wrap justify-between gap-6">
      {societies.map((society) => (
        <View key={society.slug} className="w-[48%]">
          <SocietyCard society={society} />
        </View>
      ))}
    </View>
  );
}
