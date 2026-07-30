import { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useConvexAuth } from "convex/react";
import { AppShell } from "@/components/app-shell";
import { WelcomeTour } from "@/components/welcome-tour";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { useWelcomeTourStatus } from "@/lib/hooks/use-welcome-tour";

export default function WelcomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const profile = useCurrentProfile();
  const { markComplete } = useWelcomeTourStatus(profile?.id);
  const [finishing, setFinishing] = useState(false);

  const finishTour = () => {
    if (!profile?.id) return;
    setFinishing(true);
    void markComplete()
      .then(() => router.replace("/dashboard"))
      .finally(() => setFinishing(false));
  };

  if (authLoading || profile === undefined) {
    return (
      <AppShell>
        <View className="items-center py-16">
          <ActivityIndicator color="#17211B" />
        </View>
      </AppShell>
    );
  }

  if (!isAuthenticated || !profile?.name) {
    return (
      <AppShell>
        <View className="mx-auto w-full max-w-lg px-4 py-12">
          <Text className="text-center text-dono-muted">Loading...</Text>
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-lg px-4 py-12">
        <WelcomeTour onComplete={finishTour} loading={finishing} />
      </View>
    </AppShell>
  );
}
