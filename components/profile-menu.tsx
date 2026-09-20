import { useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { type Href, useRouter } from "expo-router";
import { PiggyBank, Sparkles, User, Users } from "lucide-react-native";
import { cn } from "@/lib/utils";

type ProfileMenuProps = {
  initials: string;
  avatarUrl?: string | null;
};

const menuItems: {
  href: Href;
  label: string;
  icon: typeof Users;
}[] = [
  { href: "/societies?tab=mine" as Href, label: "View my societies", icon: Users },
  { href: "/campaigns?tab=mine" as Href, label: "View my campaigns", icon: PiggyBank },
  { href: "/dashboard", label: "View my impact", icon: Sparkles },
];

export function ProfileMenu({ initials, avatarUrl }: ProfileMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const go = (href: Href) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Open account menu"
        accessibilityState={{ expanded: open }}
        className="retro-key h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-retro-ink bg-retro-cream"
      >
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
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

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable className="flex-1 bg-black/40" onPress={() => setOpen(false)}>
          <View className="flex-1 items-end px-4 pb-4 pt-16" pointerEvents="box-none">
            <Pressable
              onPress={(event) => event.stopPropagation()}
              className="w-56 overflow-hidden rounded-[14px] border-[3px] border-retro-ink bg-retro-paper"
              accessibilityRole="menu"
              accessibilityLabel="Account menu"
            >
              {menuItems.map((item, index) => (
                <Pressable
                  key={item.label}
                  onPress={() => go(item.href)}
                  accessibilityRole="menuitem"
                  className={cn(
                    "flex-row items-center gap-2.5 px-3.5 py-3 hover:bg-retro-cream",
                    index < menuItems.length - 1
                      ? "border-b border-retro-ink/10"
                      : "",
                  )}
                >
                  <item.icon size={15} color="#211E1A" />
                  <Text className="font-retro-bold text-[13px] text-retro-ink">
                    {item.label}
                  </Text>
                </Pressable>
              ))}
              <View className="border-t-[3px] border-retro-ink" />
              <Pressable
                onPress={() => go("/account")}
                accessibilityRole="menuitem"
                className="flex-row items-center gap-2.5 px-3.5 py-3 hover:bg-retro-cream"
              >
                <User size={15} color="#211E1A" />
                <Text className="font-retro-bold text-[13px] text-retro-ink">
                  Profile
                </Text>
              </Pressable>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
