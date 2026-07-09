import "../global.css";
import { Stack, useRouter, useSegments, usePathname, useGlobalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient, useConvexAuth, useMutation } from "convex/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PostHogProvider, usePostHog } from "posthog-react-native";
import { authStorage } from "@/lib/auth-storage";
import { useCurrentProfile } from "@/lib/auth/hooks";
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
    const inProtected =
      root === "dashboard" || root === "create" || root === "account";
    const inSignIn = root === "signin";
    const inAuthPublic =
      root === "signin" ||
      root === "forgot-password" ||
      root === "reset-password" ||
      root === "verify-email";
    const inAdmin = root === "admin";

    if (inProtected && !isAuthenticated) {
      router.replace("/signin");
      return;
    }

    if (inAuthPublic && isAuthenticated && profile) {
      router.replace("/dashboard");
      return;
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
  const tree = (
    <ConvexAuthProvider client={convex} storage={authStorage}>
      <AppTree />
    </ConvexAuthProvider>
  );

  return (
    <SafeAreaProvider>
      {posthogApiKey ? (
        <PostHogProvider
          apiKey={posthogApiKey}
          options={{
            host: posthogHost,
            enableSessionReplay: false,
          }}
          autocapture
        >
          {tree}
        </PostHogProvider>
      ) : (
        tree
      )}
    </SafeAreaProvider>
  );
}
