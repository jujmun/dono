import { View, Text, Pressable } from "react-native";
import { type Href, Link } from "expo-router";
import { OtpRequestForm } from "@/components/auth/otp-request-form";

export default function SignInPage() {
  return (
    <OtpRequestForm
      flow="signIn"
      title="Welcome back"
      subtitle="Get a one-time code to sign in securely"
      submitLabel="Send sign-in code"
      footer={
        <>
          <Link href={"/signup" as Href} asChild>
            <Pressable className="mt-4 items-center">
              <Text className="text-sm text-dono-muted">
                Need an account? Sign up
              </Text>
            </Pressable>
          </Link>

          <View className="mt-3 flex-row items-center justify-between">
            <Link href={"/forgot-password" as Href} asChild>
              <Pressable>
                <Text className="text-sm text-dono-primary">
                  Need a new code?
                </Text>
              </Pressable>
            </Link>
            <Link href={"/verify-email" as Href} asChild>
              <Pressable>
                <Text className="text-sm text-dono-primary">
                  Already have a code? Verify
                </Text>
              </Pressable>
            </Link>
          </View>
        </>
      }
    />
  );
}
