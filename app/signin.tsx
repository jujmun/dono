import { Text, Pressable } from "react-native";
import { type Href, Link } from "expo-router";
import { PasswordAuthForm } from "@/components/auth/password-auth-form";

export default function SignInPage() {
  return (
    <PasswordAuthForm
      mode="signIn"
      title="Welcome back"
      subtitle="Sign in with your email and password"
      submitLabel="Sign in"
      footer={
        <>
          <Link href={"/signup" as Href} asChild>
            <Pressable className="mt-4 items-center">
              <Text className="text-sm text-dono-muted">
                Need an account? Sign up
              </Text>
            </Pressable>
          </Link>

          <Link href={"/forgot-password" as Href} asChild>
            <Pressable className="mt-3 items-center">
              <Text className="text-sm text-dono-primary">Forgot password?</Text>
            </Pressable>
          </Link>
        </>
      }
    />
  );
}
