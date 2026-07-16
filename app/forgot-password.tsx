import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { type Href, Link, useRouter } from "expo-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useAction } from "convex/react";
import { AppShell } from "@/components/app-shell";
import { SetPasswordFields } from "@/components/auth/set-password-fields";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import {
  buildPasswordFlowFormData,
  isInvalidAccountIdError,
} from "@/lib/auth/password-flow";
import {
  requestOtpSchema,
  setPasswordSchema,
  verifyEmailSchema,
} from "@/lib/validation/auth";
import { api } from "@convex/_generated/api";

const inputClassName =
  "w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text";

type PasswordSetupMode = "reset" | "setup";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const setPassword = useAction(api.users.setPassword);
  const [step, setStep] = useState<"request" | "complete">("request");
  const [mode, setMode] = useState<PasswordSetupMode>("reset");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();

  const requestReset = () => {
    const parsed = requestOtpSchema.safeParse({ email: normalizedEmail });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email.");
      return;
    }

    setLoading(true);
    setError(null);
    setInfo(null);

    void (async () => {
      try {
        await signIn(
          "password",
          buildPasswordFlowFormData({
            flow: "reset",
            email: parsed.data.email,
          }),
        );
        setMode("reset");
        setStep("complete");
        setInfo("A password reset code has been sent to your email.");
      } catch (err) {
        if (isInvalidAccountIdError(err)) {
          try {
            await signIn(
              "resend",
              buildPasswordFlowFormData({
                provider: "resend",
                email: parsed.data.email,
              }),
            );
            setMode("setup");
            setStep("complete");
            setInfo(
              "No password is set yet. We sent a sign-in code so you can create one.",
            );
            return;
          } catch (setupErr) {
            setError(getFriendlyAuthError(setupErr));
            return;
          }
        }
        setError(getFriendlyAuthError(err));
      } finally {
        setLoading(false);
      }
    })();
  };

  const completeReset = () => {
    const parsedCode = verifyEmailSchema.safeParse({
      email: normalizedEmail,
      code,
    });
    if (!parsedCode.success) {
      setError(parsedCode.error.issues[0]?.message ?? "Invalid code.");
      return;
    }

    const parsedPassword = setPasswordSchema.safeParse({
      newPassword,
      confirmPassword,
    });
    if (!parsedPassword.success) {
      setError(parsedPassword.error.issues[0]?.message ?? "Check your password.");
      return;
    }

    setLoading(true);
    setError(null);
    setInfo(null);

    void (async () => {
      try {
        if (mode === "reset") {
          const result = await signIn(
            "password",
            buildPasswordFlowFormData({
              flow: "reset-verification",
              email: parsedCode.data.email,
              code: parsedCode.data.code,
              newPassword: parsedPassword.data.newPassword,
            }),
          );
          if (!result.signingIn) {
            setError(
              "That code is invalid or expired. Request a new one and try again.",
            );
            return;
          }
          router.replace("/dashboard");
          return;
        }

        const verifyResult = await signIn(
          "resend",
          buildPasswordFlowFormData({
            provider: "resend",
            email: parsedCode.data.email,
            code: parsedCode.data.code,
          }),
        );
        if (!verifyResult.signingIn) {
          setError(
            "That code is invalid or expired. Request a new one and try again.",
          );
          return;
        }

        await setPassword({ newPassword: parsedPassword.data.newPassword });
        router.replace("/dashboard");
      } catch (err) {
        setError(getFriendlyAuthError(err));
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-md px-4 py-12">
        <View className="rounded-2xl border border-dono-border bg-white p-8">
          <Text className="font-display-medium text-2xl text-dono-text">
            {mode === "reset" ? "Reset your password" : "Set your password"}
          </Text>
          <Text className="mt-1 text-sm text-dono-muted">
            {step === "request"
              ? "We'll email you a code to choose a new password."
              : mode === "reset"
                ? "Enter the reset code from your email and choose a new password."
                : "Enter the sign-in code from your email and choose a password."}
          </Text>

          <View className="mt-6 gap-4">
            {step === "request" ? (
              <>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  placeholder="you@st-annes.ox.ac.uk"
                  placeholderTextColor="#56615A"
                  className={inputClassName}
                />

                {error ? (
                  <View className="rounded-xl bg-rose-50 px-4 py-3">
                    <Text className="text-sm text-rose-700">{error}</Text>
                  </View>
                ) : null}

                <Pressable
                  onPress={requestReset}
                  disabled={loading || normalizedEmail.length === 0}
                  className={`items-center rounded-full bg-dono-primary py-3 ${
                    loading || normalizedEmail.length === 0 ? "opacity-50" : ""
                  }`}
                >
                  <Text className="font-sans-medium text-sm text-white">
                    {loading ? "Sending..." : "Send code"}
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text className="text-sm text-dono-muted">
                  {mode === "reset" ? "Resetting password for" : "Setting password for"}{" "}
                  {normalizedEmail}
                </Text>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoComplete="one-time-code"
                  placeholder="6-digit code"
                  placeholderTextColor="#56615A"
                  className={inputClassName}
                />
                <SetPasswordFields
                  newPassword={newPassword}
                  confirmPassword={confirmPassword}
                  onNewPasswordChange={setNewPassword}
                  onConfirmPasswordChange={setConfirmPassword}
                />

                {error ? (
                  <View className="rounded-xl bg-rose-50 px-4 py-3">
                    <Text className="text-sm text-rose-700">{error}</Text>
                  </View>
                ) : null}

                {info ? (
                  <View className="rounded-xl bg-green-50 px-4 py-3">
                    <Text className="text-sm text-green-700">{info}</Text>
                  </View>
                ) : null}

                <Pressable
                  onPress={completeReset}
                  disabled={loading}
                  className={`items-center rounded-full bg-dono-primary py-3 ${
                    loading ? "opacity-50" : ""
                  }`}
                >
                  <Text className="font-sans-medium text-sm text-white">
                    {loading
                      ? "Updating..."
                      : mode === "reset"
                        ? "Update password"
                        : "Create password"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setStep("request");
                    setCode("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError(null);
                    setInfo(null);
                  }}
                  className="items-center"
                >
                  <Text className="text-sm text-dono-primary">Request a new code</Text>
                </Pressable>
              </>
            )}

            <Link href={"/signin" as Href} asChild>
              <Pressable className="items-center">
                <Text className="text-sm text-dono-muted">Back to sign in</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </AppShell>
  );
}
