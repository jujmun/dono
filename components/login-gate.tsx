import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";

export function LoginGate({ message }: { message: string }) {
  return (
    <View className="mx-auto w-full max-w-7xl px-4 py-8">
      <View className="items-center rounded-2xl border border-dono-border bg-white p-10">
        <Text className="text-center font-display-medium text-xl text-dono-text">
          Sign in required
        </Text>
        <Text className="mt-2 text-center text-sm text-dono-muted">{message}</Text>
        <Link href="/signin" asChild>
          <Pressable className="mt-6 items-center rounded-full bg-dono-primary px-6 py-3">
            <Text className="font-sans-medium text-sm text-white">Sign in to continue</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
