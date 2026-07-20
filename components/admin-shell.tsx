import { useState } from "react";
import { type Href, Link, usePathname, useRouter } from "expo-router";
import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useAuthActions } from "@convex-dev/auth/react";
import { Menu, X, LogOut } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { RetroBrowserFooter } from "@/components/retro/retro-browser-footer";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const adminNavItems = [
  { href: "/admin", label: "Review", match: (p: string) => p === "/admin" },
  {
    href: "/admin/discover",
    label: "Discover",
    match: (p: string) => p.startsWith("/admin/discover"),
  },
  {
    href: "/admin/archive",
    label: "Archive",
    match: (p: string) => p.startsWith("/admin/archive"),
  },
  {
    href: "/admin/messages",
    label: "Messages",
    match: (p: string) => p.startsWith("/admin/messages"),
  },
] as const;

function AdminSitehead() {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const showNav = width >= 700;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut } = useAuthActions();

  const handleSignOut = () => {
    void signOut().then(() => {
      router.replace("/signin");
    });
  };

  return (
    <View className="border-b-[3px] border-retro-ink bg-retro-paper">
      <View className="flex-row flex-wrap items-center justify-between gap-3 px-4 py-3.5 md:px-[26px]">
        <View className="flex-row items-center gap-2">
          <View className="h-3.5 w-3.5 rounded-full border-2 border-retro-ink bg-retro-coral" />
          <Text className="font-retro-bold text-xl text-retro-ink">Dono</Text>
          <View className="rounded-full border-2 border-retro-ink bg-retro-coral px-2.5 py-0.5">
            <Text className="font-retro-bold text-[11px] text-retro-paper">
              ADMIN
            </Text>
          </View>
        </View>

        {showNav ? (
          <View className="flex-row items-center gap-2">
            {adminNavItems.map((item) => {
              const active = item.match(pathname);
              return (
                <Link key={item.href} href={item.href as Href} asChild>
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

        <Pressable
          onPress={handleSignOut}
          className="flex-row items-center gap-1.5 rounded-full border-2 border-retro-ink bg-retro-paper px-3 py-2 shadow-[3px_3px_0_#211E1A]"
          accessibilityLabel="Sign out"
        >
          <LogOut size={14} color="#211E1A" />
          <Text className="font-retro-bold text-[13px] text-retro-ink">
            Sign out
          </Text>
        </Pressable>
      </View>

      {mobileOpen && !showNav ? (
        <View className="gap-1 border-t-2 border-retro-ink px-4 py-2">
          {adminNavItems.map((item) => (
            <Link key={item.href} href={item.href as Href} asChild>
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

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView className="flex-1 bg-retro-paper" edges={["top", "bottom"]}>
      <View className="flex-1 bg-retro-paper">
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="min-h-full w-full flex-1 overflow-hidden border-b-[3px] border-retro-ink bg-retro-paper">
            <AdminSitehead />
            <View className="w-full px-5 py-5 md:px-10 md:pb-10 md:pt-6 lg:px-14">
              {children}
            </View>
            <RetroBrowserFooter />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
