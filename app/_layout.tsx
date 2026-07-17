import "../global.css";
import { Stack, useRouter, useSegments, usePathname, useGlobalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import {
  useFonts,
  Fredoka_500Medium,
  Fredoka_700Bold,
} from "@expo-google-fonts/fredoka";
import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} from "@expo-google-fonts/space-mono";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient, useConvexAuth, useMutation } from "convex/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PostHogProvider, usePostHog } from "posthog-react-native";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { useWelcomeTourStatus } from "@/lib/hooks/use-welcome-tour";
import { isPortalAdmin } from "@/lib/auth/is-portal-admin";
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
  const { complete: welcomeTourComplete, pending: welcomeTourPending, loading: welcomeTourLoading } =
    useWelcomeTourStatus(profile?.id);
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
    const inWelcome = root === "welcome";
    const inProtected = root === "funds";
    const inAuthPublic =
      root === "signin" ||
      root === "signup" ||
      root === "forgot-password" ||
      root === "verify-email";
    const inAdmin = root === "admin";
    const adminUser = isPortalAdmin(profile);
    const needsOnboarding =
      isAuthenticated &&
      profile !== undefined &&
      !profile?.name &&
      !adminUser;
    const needsWelcomeTour =
      isAuthenticated &&
      profile !== undefined &&
      Boolean(profile?.name) &&
      !adminUser &&
      !welcomeTourLoading &&
      welcomeTourComplete === false &&
      welcomeTourPending === true;

    if ((inProtected || inOnboarding || inWelcome || inAdmin) && !isAuthenticated) {
      router.replace("/signin");
      return;
    }

    if (isAuthenticated && needsOnboarding && !inOnboarding) {
      router.replace("/onboarding");
      return;
    }

    if (isAuthenticated && needsWelcomeTour && !inWelcome && !inOnboarding) {
      router.replace("/welcome");
      return;
    }

    if (inAuthPublic && isAuthenticated && profile && !needsOnboarding && !needsWelcomeTour) {
      router.replace(adminUser ? "/admin" : "/dashboard");
      return;
    }

    if (inOnboarding && isAuthenticated && profile?.name) {
      router.replace("/welcome");
      return;
    }

    if (inWelcome && isAuthenticated && welcomeTourComplete === true) {
      router.replace(adminUser ? "/admin" : "/dashboard");
      return;
    }

    if (inAdmin && isAuthenticated && profile !== undefined && !adminUser) {
      router.replace("/dashboard");
      return;
    }

    // Outreach admins stay entirely inside /admin — never the student app.
    if (
      adminUser &&
      isAuthenticated &&
      profile !== undefined &&
      !inAdmin &&
      !inAuthPublic
    ) {
      router.replace("/admin");
    }
  }, [isAuthenticated, isLoading, segments, router, profile, welcomeTourComplete, welcomeTourPending, welcomeTourLoading]);

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
    Fredoka_500Medium,
    Fredoka_700Bold,
    SpaceMono_400Regular,
    SpaceMono_700Bold,
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
