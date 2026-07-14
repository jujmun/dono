import "../global.css";
import { Stack, useRouter, useSegments, usePathname, useGlobalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import {
  useFonts,
  Fraunces_400Regular,
  Fraunces_500Medium,
} from "@expo-google-fonts/fraunces";
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
} from "@expo-google-fonts/jetbrains-mono";
import {
  Inter_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient, useConvexAuth, useMutation } from "convex/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PostHogProvider, usePostHog } from "posthog-react-native";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { authStorage } from "@/lib/auth-storage";
import { StripeAppProvider } from "@/lib/stripe/provider";
import { api } from "@convex/_generated/api";

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL as string,
  { unsavedChangesWarning: false }
);

const posthogApiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
const posthogHost =
  process.env.EXPO_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const profile = useCurrentProfile();
  const ensureMyProfile = useMutation(api.users.ensureMyProfile);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      void ensureMyProfile({});
    }
  }, [isAuthenticated, isLoading, ensureMyProfile]);

  useEffect(() => {
    if (isLoading) return;

    const root = String(segments[0] ?? "");
    const inOnboarding = root === "onboarding";
    const inProtected =
      root === "dashboard" ||
      root === "create" ||
      root === "account" ||
      root === "discover" ||
      root === "communities" ||
      root === "funds";
    const inAuthPublic =
      root === "signin" ||
      root === "signup" ||
      root === "forgot-password" ||
      root === "verify-email";
    const inAdmin = root === "admin";
    const needsOnboarding = isAuthenticated && profile !== undefined && !profile?.name;

    if ((inProtected || inOnboarding) && !isAuthenticated) {
      router.replace("/signin");
      return;
    }

    if (isAuthenticated && needsOnboarding && !inOnboarding) {
      router.replace("/onboarding");
      return;
    }

    if (inAuthPublic && isAuthenticated && profile && !needsOnboarding) {
      router.replace("/dashboard");
      return;
    }

    if (inOnboarding && isAuthenticated && profile?.name) {
      router.replace("/dashboard");
    }

    if (inAdmin && isAuthenticated && profile?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, segments, router, profile]);

  return <>{children}</>;
}

function AppTree() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const posthog = usePostHog();
  const previousPathname = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (posthog && previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params, posthog]);

  return (
    <AuthGuard>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </AuthGuard>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_400Regular,
    Fraunces_500Medium,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    Inter_400Regular,
    Inter_500Medium,
  });

  const tree = (
    <ConvexAuthProvider client={convex} storage={authStorage}>
      <StripeAppProvider>
        <AppTree />
      </StripeAppProvider>
    </ConvexAuthProvider>
  );

  if (!fontsLoaded) {
    return null;
  }

  // Autocapture is off so auth inputs (email/OTP) are never captured as PII.
  // Capture intentional product events only via posthog.capture(...).
  return (
    <SafeAreaProvider>
      {posthogApiKey ? (
        <PostHogProvider
          apiKey={posthogApiKey}
          options={{
            host: posthogHost,
            enableSessionReplay: false,
          }}
          autocapture={false}
        >
          {tree}
        </PostHogProvider>
      ) : (
        tree
      )}
    </SafeAreaProvider>
  );
}
