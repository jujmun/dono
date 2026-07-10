import { Text, Pressable } from "react-native";
import { type Href, Link } from "expo-router";
import { OtpRequestForm } from "@/components/auth/otp-request-form";

export default function SignUpPage() {
  return (
    <OtpRequestForm
      flow="signUp"
      title="Create your account"
      subtitle="We'll email you a one-time code, then you'll finish onboarding"
      submitLabel="Send sign-up code"
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
