import { type Href, Link, usePathname } from "expo-router";
import { View, Text, Pressable, useWindowDimensions } from "react-native";
import { cn } from "@/lib/utils";
import { RetroClock } from "./retro-clock";

const navItems = [
  { href: "/", label: "File" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/societies", label: "Societies" },
  { href: "/dashboard", label: "Impact" },
] as const;

export function RetroMenubar() {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const showNav = width >= 640;

  return (
    <View className="z-50 flex-row items-center justify-between border-b-[3px] border-retro-ink bg-retro-paper px-4 py-2.5 md:px-[22px]">
      <Link href="/" asChild>
        <Pressable className="flex-row items-center gap-2">
          <View className="h-4 w-4 rounded-full border-2 border-retro-ink bg-retro-coral" />
          <Text className="font-retro-bold text-[19px] text-retro-ink">DONO</Text>
        </Pressable>
      </Link>

      {showNav ? (
        <View className="flex-row items-center gap-5">
          {navItems.map((item) => {
            const active =
              item.href === "/campaigns"
                ? pathname === "/campaigns" || pathname.startsWith("/campaigns/")
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.label} href={item.href as Href} asChild>
                <Pressable>
                  <Text
                    className={cn(
                      "font-sans-medium text-sm text-retro-ink",
                      active ? "opacity-100" : "opacity-85",
                    )}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              </Link>
            );
          })}
        </View>
      ) : null}

      <RetroClock variant="menubar" />
    </View>
  );
}
