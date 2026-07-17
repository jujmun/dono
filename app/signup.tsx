import { Text, Pressable } from "react-native";
import { type Href, Link } from "expo-router";
import { PasswordAuthForm } from "@/components/auth/password-auth-form";

export default function SignUpPage() {
  return (
    <PasswordAuthForm
      mode="signUp"
      title="Create your account"
      subtitle="Create your account with email and password. We'll send a one-time code to verify your email."
      submitLabel="Create account"
      footer={
        <Link href={"/signin" as Href} asChild>
          <Pressable className="mt-4 items-center">
            <Text className="text-sm text-dono-muted">
              Already have an account? Sign in
            </Text>
          </Pressable>
        </Link>
      }
    />
  );
}
