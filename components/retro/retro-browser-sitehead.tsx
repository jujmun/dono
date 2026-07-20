import { useState } from "react";
import { type Href, Link, usePathname } from "expo-router";
import {
  View,
  Text,
  Pressable,
  Image,
  useWindowDimensions,
} from "react-native";
import { useConvexAuth } from "convex/react";
import { Menu, X } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { useCurrentProfile } from "@/lib/auth/hooks";
import { NotificationBell } from "@/components/notification-bell";

const baseNavItems = [
  { href: "/campaigns", label: "Campaigns" },
  { href: "/societies", label: "Societies" },
  { href: "/dashboard", label: "Impact" },
] as const;

export function RetroBrowserSitehead() {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const showNav = width >= 700;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isLoading } = useConvexAuth();
  const profile = useCurrentProfile();
  const initials = (profile?.name || profile?.email || "D")
    .trim()
    .charAt(0)
    .toUpperCase();

  const navItems: { href: Href; label: string }[] = [
    ...baseNavItems,
    ...(isAuthenticated
      ? [{ href: "/account" as Href, label: "You" }]
      : []),
  ];

  return (
    <View className="border-b-[3px] border-retro-ink bg-retro-paper">
      <View className="flex-row flex-wrap items-center justify-between gap-3 px-4 py-3.5 md:px-[26px]">
        <Link href="/" asChild>
          <Pressable className="flex-row items-center gap-2">
            <View className="h-3.5 w-3.5 rounded-full border-2 border-retro-ink bg-retro-coral" />
            <Text className="font-retro-bold text-xl text-retro-ink">Dono</Text>
          </Pressable>
        </Link>

        {showNav ? (
          <View className="flex-row items-center gap-2">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.label} href={item.href} asChild>
                  <Pressable
                    className={cn(
                      "rounded-lg border-2 px-3 py-1.5",
                      active
                        ? "border-retro-ink bg-retro-cream shadow-[2px_2px_0_#211E1A]"
                        : "border-transparent",
                    )}
                  >
                    <Text className="font-retro-bold text-[13.5px] text-retro-ink">
                      {item.label}
                    </Text>
                  </Pressable>
                </Link>
              );
            })}
          </View>
        ) : (
          <Pressable
            onPress={() => setMobileOpen((o) => !o)}
            accessibilityLabel="Toggle menu"
          >
            {mobileOpen ? (
              <X size={20} color="#211E1A" />
            ) : (
              <Menu size={20} color="#211E1A" />
            )}
          </Pressable>
        )}

        <View className="flex-row items-center gap-2.5">
          <Link href="/create" asChild>
            <Pressable className="rounded-full border-2 border-retro-ink bg-retro-mint px-4 py-2 shadow-[3px_3px_0_#211E1A]">
              <Text className="font-retro-bold text-[13px] text-retro-paper">
                + Start a Campaign
              </Text>
            </Pressable>
          </Link>
          {!isLoading && isAuthenticated ? <NotificationBell /> : null}
          {!isLoading && isAuthenticated ? (
            <Link href="/account" asChild>
              <Pressable className="h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-retro-ink bg-retro-cream">
                {profile?.avatarUrl ? (
                  <Image
                    source={{ uri: profile.avatarUrl }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                    accessibilityLabel="Your profile picture"
                  />
                ) : (
                  <Text className="font-retro-mono-bold text-sm text-retro-ink">
                    {initials}
                  </Text>
                )}
              </Pressable>
            </Link>
          ) : !isLoading ? (
            <Link href="/signin" asChild>
              <Pressable className="rounded-full border-2 border-retro-ink bg-retro-paper px-4 py-2 shadow-[3px_3px_0_#211E1A]">
                <Text className="font-retro-bold text-[13px] text-retro-ink">
                  Sign in
                </Text>
              </Pressable>
            </Link>
          ) : null}
        </View>
      </View>

      {mobileOpen && !showNav ? (
        <View className="gap-1 border-t-2 border-retro-ink px-4 py-2">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} asChild>
              <Pressable
                onPress={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5"
              >
                <Text className="font-retro-bold text-sm text-retro-ink">
                  {item.label}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      ) : null}
    </View>
  );
}
