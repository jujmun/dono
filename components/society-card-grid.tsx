import { View } from "react-native";
import type { MockSociety } from "@/lib/mock-societies";
import { SocietyCard } from "@/components/society-card";

interface SocietyCardGridProps {
  societies: MockSociety[];
}

export function SocietyCardGrid({ societies }: SocietyCardGridProps) {
  return (
    <View className="flex-row flex-wrap justify-between gap-6">
      {societies.map((society) => (
        <View key={society.id} className="w-[48%]">
          <SocietyCard society={society} />
        </View>
      ))}
    </View>
  );
}
