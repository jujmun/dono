import { useState } from "react";
import { type Href, Link, usePathname, useRouter } from "expo-router";
import { View, Text, Pressable, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Archive,
  ClipboardCheck,
  Compass,
  LogOut,
  Menu,
  X,
} from "lucide-react-native";
import { useAuthActions } from "@convex-dev/auth/react";
import { cn } from "@/lib/utils";

const adminNavItems = [
  {
    href: "/admin",
    label: "Needs review",
    shortLabel: "Needs review",
    icon: ClipboardCheck,
    exact: true,
  },
  {
    href: "/admin/discover",
    label: "Live posts",
    shortLabel: "Live",
    icon: Compass,
    exact: false,
  },
  {
    href: "/admin/archive",
    label: "Removed",
    shortLabel: "Removed",
    icon: Archive,
    exact: false,
  },
] as const;

function useIsWide() {
  const { width } = useWindowDimensions();
  return width >= 768;
}

function isNavActive(pathname: string, href: string, exact: boolean) {
  if (exact) {
    return pathname === href || pathname === `${href}/`;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const isWide = useIsWide();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut } = useAuthActions();

  const handleSignOut = () => {
    setMobileOpen(false);
    void signOut().then(() => {
      router.replace("/signin");
    });
  };

  return (
    <View className="z-50 border-b border-dono-border bg-dono-bg">
      <View className="mx-auto h-16 w-full max-w-5xl flex-row items-center justify-between px-4">
        <Link href={"/admin" as Href} asChild>
          <Pressable>
            <Text className="font-display-medium text-xl text-dono-text">
              Dono Admin
            </Text>
          </Pressable>
        </Link>

        {isWide ? (
          <View className="flex-row items-center gap-1">
            {adminNavItems.map((item) => {
              const active = isNavActive(pathname, item.href, item.exact);
              return (
                <Link key={item.href} href={item.href as Href} asChild>
                  <Pressable
                    className={cn(
                      "rounded-lg px-3 py-2",
                      active ? "bg-dono-primary/10" : "",
                    )}
                  >
                    <Text
                      className={cn(
                        "font-sans-medium text-sm",
                        active ? "text-dono-primary" : "text-dono-muted",
                      )}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                </Link>
              );
            })}
            <Pressable
              onPress={handleSignOut}
              className="ml-2 flex-row items-center gap-1.5 rounded-full border border-dono-border px-3 py-2"
            >
              <LogOut size={16} color="#56615A" />
              <Text className="font-sans-medium text-sm text-dono-muted">
                Sign out
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => setMobileOpen(!mobileOpen)}
            className="h-9 w-9 items-center justify-center rounded-lg"
            accessibilityLabel="Toggle menu"
          >
            {mobileOpen ? (
              <X size={20} color="#56615A" />
            ) : (
              <Menu size={20} color="#56615A" />
            )}
          </Pressable>
        )}
      </View>

      {mobileOpen && !isWide ? (
        <View className="border-t border-dono-border bg-dono-bg px-4 py-3">
          {adminNavItems.map((item) => {
            const active = isNavActive(pathname, item.href, item.exact);
            return (
              <Link key={item.href} href={item.href as Href} asChild>
                <Pressable
                  onPress={() => setMobileOpen(false)}
                  className={cn(
                    "flex-row items-center gap-3 rounded-lg px-3 py-2.5",
                    active ? "bg-dono-primary/10" : "",
                  )}
                >
                  <item.icon
                    size={16}
                    color={active ? "#17211B" : "#56615A"}
                  />
                  <Text
                    className={cn(
                      "font-sans-medium text-sm",
                      active ? "text-dono-primary" : "text-dono-muted",
                    )}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              </Link>
            );
          })}
          <Pressable
            onPress={handleSignOut}
            className="mt-2 flex-row items-center justify-center gap-1.5 rounded-full border border-dono-border px-4 py-2.5"
          >
            <LogOut size={16} color="#56615A" />
            <Text className="font-sans-medium text-sm text-dono-muted">
              Sign out
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function AdminMobileNav() {
  const pathname = usePathname();
  const isWide = useIsWide();

  if (isWide) return null;

  return (
    <View className="absolute bottom-0 left-0 right-0 z-50 border-t border-dono-border bg-dono-bg">
      <View className="mx-auto w-full max-w-lg flex-row items-center justify-around px-2 py-1">
        {adminNavItems.map((item) => {
          const isActive = isNavActive(pathname, item.href, item.exact);
          return (
            <Link key={item.href} href={item.href as Href} asChild>
              <Pressable className="items-center gap-0.5 px-3 py-2">
                <item.icon
                  size={20}
                  color={isActive ? "#17211B" : "#56615A"}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <Text
                  className={cn(
                    "font-sans-medium text-xs",
                    isActive ? "text-dono-primary" : "text-dono-muted",
                  )}
                >
                  {item.shortLabel}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView className="flex-1 bg-dono-bg" edges={["top"]}>
      <View className="flex-1">
        <AdminHeader />
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-24 md:pb-8"
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
        <AdminMobileNav />
      </View>
    </SafeAreaView>
  );
}
