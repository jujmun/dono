import { useState } from "react";
import { type Href, Link, usePathname, useRouter } from "expo-router";
import { View, Text, Pressable, useWindowDimensions } from "react-native";
import {
  Home,
  Compass,
  Users,
  PiggyBank,
  User,
  Plus,
  Menu,
  X,
  LogOut,
} from "lucide-react-native";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/campaigns", label: "Campaigns", icon: PiggyBank },
  { href: "/communities", label: "Communities", icon: Users },
  { href: "/account", label: "Account", icon: User },
  { href: "/dashboard", label: "You", icon: User },
] as const;

function useIsWide() {
  const { width } = useWindowDimensions();
  return width >= 768;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isWide = useIsWide();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  const handleSignOut = () => {
    setMobileOpen(false);
    void signOut().then(() => {
      router.replace("/signin");
    });
  };

  return (
    <View className="z-50 border-b border-dono-border bg-dono-bg/95">
      <View className="mx-auto h-16 w-full max-w-7xl flex-row items-center justify-between px-4">
        <Link href="/" asChild>
          <Pressable className="flex-row items-center gap-2">
            <Text className="font-display-medium text-xl text-dono-text">Dono</Text>
          </Pressable>
        </Link>

        {isWide && (
          <View className="flex-row items-center gap-1">
            {navItems.slice(1, -1).map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
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
          </View>
        )}

        <View className="flex-row items-center gap-2">
          {isWide && (
            <>
              <Link href="/create" asChild>
                <Pressable className="flex-row items-center gap-1.5 rounded-full bg-dono-accent px-4 py-2">
                  <Plus size={16} color="#fff" />
                  <Text className="font-sans-medium text-sm text-white">
                    Start a Campaign
                  </Text>
                </Pressable>
              </Link>

              <Link href="/dashboard" asChild>
                <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-dono-primary/10">
                  <Text className="font-mono-medium text-sm text-dono-primary">
                    Y
                  </Text>
                </Pressable>
              </Link>

              {!isLoading &&
                (isAuthenticated ? (
                  <Pressable
                    onPress={handleSignOut}
                    className="flex-row items-center gap-1.5 rounded-full border border-dono-border px-3 py-2"
                  >
                    <LogOut size={16} color="#5e6473" />
                    <Text className="font-sans-medium text-sm text-dono-muted">
                      Sign out
                    </Text>
                  </Pressable>
                ) : (
                  <Link href="/signin" asChild>
                    <Pressable className="rounded-full border border-dono-border px-4 py-2">
                      <Text className="font-sans-medium text-sm text-dono-muted">
                        Sign in
                      </Text>
                    </Pressable>
                  </Link>
                ))}
            </>
          )}

          {!isWide && (
            <Pressable
              onPress={() => setMobileOpen(!mobileOpen)}
              className="h-9 w-9 items-center justify-center rounded-lg"
              accessibilityLabel="Toggle menu"
            >
              {mobileOpen ? (
                <X size={20} color="#5e6473" />
              ) : (
                <Menu size={20} color="#5e6473" />
              )}
            </Pressable>
          )}
        </View>
      </View>

      {mobileOpen && !isWide && (
        <View className="border-t border-dono-border bg-dono-bg px-4 py-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
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
                    color={active ? "#1d242f" : "#5e6473"}
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
          <Link href="/create" asChild>
            <Pressable
              onPress={() => setMobileOpen(false)}
              className="mt-2 flex-row items-center justify-center gap-1.5 rounded-full bg-dono-accent px-4 py-2.5"
            >
              <Plus size={16} color="#fff" />
              <Text className="font-sans-medium text-sm text-white">
                Start a Campaign
              </Text>
            </Pressable>
          </Link>
          {!isLoading &&
            (isAuthenticated ? (
              <Pressable
                onPress={handleSignOut}
                className="mt-2 flex-row items-center justify-center gap-1.5 rounded-full border border-dono-border px-4 py-2.5"
              >
                <LogOut size={16} color="#5e6473" />
                <Text className="font-sans-medium text-sm text-dono-muted">
                  Sign out
                </Text>
              </Pressable>
            ) : (
              <Link href="/signin" asChild>
                <Pressable
                  onPress={() => setMobileOpen(false)}
                  className="mt-2 items-center rounded-full border border-dono-border px-4 py-2.5"
                >
                  <Text className="font-sans-medium text-sm text-dono-muted">
                    Sign in
                  </Text>
                </Pressable>
              </Link>
            ))}
        </View>
      )}
    </View>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const isWide = useIsWide();

  if (isWide) return null;

  return (
    <View className="absolute bottom-0 left-0 right-0 z-50 border-t border-dono-border bg-dono-bg/95">
      <View className="mx-auto w-full max-w-lg flex-row items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link key={item.href} href={item.href as Href} asChild>
              <Pressable className="items-center gap-0.5 px-3 py-2">
                <item.icon
                  size={20}
                  color={isActive ? "#1d242f" : "#5e6473"}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <Text
                  className={cn(
                    "font-sans-medium text-xs",
                    isActive ? "text-dono-primary" : "text-dono-muted",
                  )}
                >
                  {item.label}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

export function Footer() {
  const isWide = useIsWide();

  return (
    <View className="border-t border-dono-border bg-dono-surface-muted">
      <View className="mx-auto w-full max-w-7xl px-4 py-12">
        <View className={cn("gap-8", isWide ? "flex-row flex-wrap" : "")}>
          <View className={cn(isWide ? "w-[22%]" : "w-full")}>
            <View className="mb-4 flex-row items-center gap-2">
              <Text className="font-display-medium text-lg text-dono-text">Dono</Text>
            </View>
            <Text className="text-sm text-dono-muted">
              Community infrastructure for transparent university giving.
            </Text>
          </View>

          <View className={cn(isWide ? "w-[22%]" : "w-full")}>
            <Text className="mb-3 font-sans-medium text-sm text-dono-text">
              Platform
            </Text>
            {(
              [
                ["/campaigns", "Campaigns"],
                ["/communities", "Communities"],
                ["/discover", "Discover"],
              ] as const
            ).map(([href, label]) => (
              <Link key={href} href={href} asChild>
                <Pressable className="py-1">
                  <Text className="text-sm text-dono-muted">{label}</Text>
                </Pressable>
              </Link>
            ))}
          </View>

          <View className={cn(isWide ? "w-[22%]" : "w-full")}>
            <Text className="mb-3 font-sans-medium text-sm text-dono-text">
              Principles
            </Text>
            {[
              "Radical transparency",
              "Small donations, big impact",
              "Communities over campaigns",
              "Trust through visibility",
            ].map((item) => (
              <Text key={item} className="py-1 text-sm text-dono-muted">
                {item}
              </Text>
            ))}
          </View>
        </View>

        <View className="mt-8 border-t border-dono-border pt-8">
          <Text className="text-center text-xs text-dono-muted">
            © 2026 Dono. Making university giving transparent, social and
            rewarding.
          </Text>
        </View>
      </View>
    </View>
  );
}
