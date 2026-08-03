import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { type Href, useRouter } from "expo-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { usePostHog } from "posthog-react-native";
import { GraduationCap, Users } from "lucide-react-native";
import { api } from "@convex/_generated/api";
import { AppShell } from "@/components/app-shell";
import { RetroPanel } from "@/components/retro";
import { SetPasswordFields } from "@/components/auth/set-password-fields";
import { PasswordInput } from "@/components/auth/password-input";
import { LegalAcceptanceCheckbox } from "@/components/legal-acceptance-checkbox";
import {
  getAuthProviderId,
  isAdminOtpLoginEmail,
  type AuthProviderId,
} from "@/lib/auth/admin";
import { getFriendlyAuthError } from "@/lib/auth/errors";
import {
  buildPasswordFlowFormData,
  isAccountAlreadyExistsError,
} from "@/lib/auth/password-flow";
import {
  signInWithPasswordSchema,
  signUpWithPasswordSchema,
  verifyEmailSchema,
} from "@/lib/validation/auth";
import type { UserType } from "@/lib/validation/profile";

const hasPostHog = Boolean(process.env.EXPO_PUBLIC_POSTHOG_API_KEY);
const inputClassName =
  "w-full rounded-lg border-2 border-retro-ink bg-white px-4 py-2.5 font-retro-mono text-sm text-retro-ink outline-none";
const emailInputClassName =
  "w-full rounded-lg border-2 border-retro-ink bg-white px-4 py-2.5 font-retro text-sm text-retro-ink outline-none";

export type PasswordAuthMode = "signUp" | "signIn";

type PasswordAuthFormProps = {
  mode: PasswordAuthMode;
  title: string;
  subtitle: string;
  submitLabel: string;
  footer?: React.ReactNode;
};

function verifyHref(email: string, provider: AuthProviderId): Href {
  const params = new URLSearchParams({ email });
  if (provider === "admin-email") {
    params.set("provider", provider);
  }
  return `/verify-email?${params.toString()}` as Href;
}

function PasswordAuthFormInner({
  mode,
  title,
  subtitle,
  submitLabel,
  footer,
}: PasswordAuthFormProps) {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const posthog = usePostHog();
  const acceptDocuments = useMutation(api.legal.acceptDocuments);
  const setUserType = useMutation(api.users.setUserType);
  const [step, setStep] = useState<"role" | "credentials" | "verify">(
    mode === "signUp" ? "role" : "credentials",
  );
  const [userType, setUserTypeChoice] = useState<UserType | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();

  const handleAdminOtpSignIn = async (emailValue: string) => {
    const provider = getAuthProviderId(emailValue);
    const formData = new FormData();
    formData.append("email", emailValue);
    await signIn(provider, formData);
    router.push(verifyHref(emailValue, provider));
  };

  const persistSignupUserType = async () => {
    if (mode !== "signUp" || !userType) return;
    await setUserType({ userType });
  };

  const redirectAfterAuth = () => {
    if (mode === "signUp") {
      router.replace("/onboarding");
      return;
    }
    router.replace("/dashboard");
  };

  const finishSignUpAuth = async () => {
    posthog?.capture("user_signed_up");
    if (acceptedLegal) {
      try {
        await acceptDocuments({ context: "signup" });
      } catch {
        // Acceptance can be re-completed from gated flows if this fails.
      }
    }
    try {
      await persistSignupUserType();
    } catch (err) {
      setError(getFriendlyAuthError(err));
      return;
    }
    redirectAfterAuth();
  };

  const handleCredentialsSubmit = () => {
    // Primary outreach admin uses OTP-only; other allowlisted emails use password.
    if (isAdminOtpLoginEmail(normalizedEmail)) {
      setLoading(true);
      setError(null);
      void handleAdminOtpSignIn(normalizedEmail)
        .catch((err) => setError(getFriendlyAuthError(err)))
        .finally(() => setLoading(false));
      return;
    }

    if (mode === "signUp") {
      if (!userType) {
        setError("Please choose Student or Alumni first.");
        setStep("role");
        return;
      }
      const parsed = signUpWithPasswordSchema.safeParse({
        email: normalizedEmail,
        userType,
        newPassword,
        confirmPassword,
      });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Please check your input.");
        return;
      }
      if (!acceptedLegal) {
        setError("Please accept the Terms, Privacy Policy and Community Guidelines.");
        return;
      }
    } else {
      const parsed = signInWithPasswordSchema.safeParse({
        email: normalizedEmail,
        password,
      });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Please check your input.");
        return;
      }
    }

    setLoading(true);
    setError(null);
    setInfo(null);

    void (async () => {
      try {
        const result = await signIn(
          "password",
          buildPasswordFlowFormData(
            mode === "signUp"
              ? {
                  flow: "signUp",
                  email: normalizedEmail,
                  password: newPassword,
                  userType: userType!,
                }
              : {
                  flow: "signIn",
                  email: normalizedEmail,
                  password,
                },
          ),
        );
        if (result.signingIn) {
          if (mode === "signUp") {
            await finishSignUpAuth();
            return;
          }
          posthog?.capture("user_signed_in");
          redirectAfterAuth();
          return;
        }
        setStep("verify");
        setInfo("Enter the 6-digit code we sent to your email.");
      } catch (err) {
        // #region agent log
        {
          const raw =
            err instanceof Error
              ? { name: err.name, message: err.message.slice(0, 400) }
              : { message: String(err).slice(0, 400) };
          fetch("http://127.0.0.1:7751/ingest/5beb672d-420c-42f5-80af-728dc75ed71f", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Debug-Session-Id": "e2a54c",
            },
            body: JSON.stringify({
              sessionId: "e2a54c",
              runId: "signin-debug",
              hypothesisId: "A",
              location: "password-auth-form.tsx:credentials-catch",
              message: "password auth credentials failed",
              data: {
                mode,
                emailDomain: normalizedEmail.split("@")[1] ?? null,
                passwordLen: mode === "signUp" ? newPassword.length : password.length,
                raw,
                friendly: getFriendlyAuthError(err),
              },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
        }
        // #endregion
        if (mode === "signUp" && isAccountAlreadyExistsError(err)) {
          setError(
            "An account with this email already exists. Sign in or use Forgot password.",
          );
          return;
        }
        setError(getFriendlyAuthError(err));
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleVerifySubmit = () => {
    const parsed = verifyEmailSchema.safeParse({ email: normalizedEmail, code });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid code.");
      return;
    }

    setLoading(true);
    setError(null);
    setInfo(null);

    void (async () => {
      try {
        const result = await signIn(
          "password",
          buildPasswordFlowFormData({
            flow: "email-verification",
            email: parsed.data.email,
            code: parsed.data.code,
          }),
        );
        if (!result.signingIn) {
          setError("That code is invalid or expired. Request a new one and try again.");
          return;
        }
        if (mode === "signUp") {
          await finishSignUpAuth();
          return;
        }
        posthog?.capture("user_signed_in");
        redirectAfterAuth();
      } catch (err) {
        setError(getFriendlyAuthError(err));
      } finally {
        setLoading(false);
      }
    })();
  };

  const roleChoiceClass = (selected: boolean) =>
    `flex-1 items-center gap-2 rounded-2xl border-2 border-retro-ink p-4 shadow-[3px_3px_0_#211E1A] ${
      selected ? "bg-retro-mint" : "bg-white"
    }`;

  return (
    <AppShell>
      <View className="mx-auto w-full max-w-md">
        <RetroPanel title={mode === "signUp" ? "SIGN_UP.exe" : "SIGN_IN.exe"} accent="mint">
          <View className="mb-6 items-center">
            <Text className="font-retro-bold text-2xl text-retro-ink">{title}</Text>
            <Text className="mt-1 text-center text-sm text-dono-muted">
              {step === "role"
                ? "Are you a current student or an alumni?"
                : subtitle}
            </Text>
          </View>

          {step === "role" ? (
            <View className="gap-4">
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => {
                    setUserTypeChoice("student");
                    setError(null);
                    setStep("credentials");
                  }}
                  className={roleChoiceClass(userType === "student")}
                >
                  <Users size={28} color="#211E1A" />
                  <Text className="font-retro-bold text-base text-retro-ink">
                    Student
                  </Text>
                  <Text className="text-center text-xs text-dono-muted">
                    Currently studying at Oxford
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setUserTypeChoice("alumni");
                    setError(null);
                    setStep("credentials");
                  }}
                  className={roleChoiceClass(userType === "alumni")}
                >
                  <GraduationCap size={28} color="#211E1A" />
                  <Text className="font-retro-bold text-base text-retro-ink">
                    Alumni
                  </Text>
                  <Text className="text-center text-xs text-dono-muted">
                    Graduated from Oxford
                  </Text>
                </Pressable>
              </View>

              {error ? (
                <View className="rounded-xl bg-rose-50 px-4 py-3">
                  <Text className="text-sm text-rose-700">{error}</Text>
                </View>
              ) : null}
            </View>
          ) : step === "credentials" ? (
            <View className="gap-4">
              {mode === "signUp" && userType ? (
                <Pressable
                  onPress={() => {
                    setStep("role");
                    setError(null);
                  }}
                  className="self-start"
                >
                  <Text className="text-sm text-dono-primary">
                    ← {userType === "alumni" ? "Alumni" : "Student"}
                  </Text>
                </Pressable>
              ) : null}

              <View>
                <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
                  Email
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  placeholder={
                    mode === "signUp" && userType === "alumni"
                      ? "you@email.com"
                      : "you@st-annes.ox.ac.uk"
                  }
                  placeholderTextColor="#56615A"
                  className={emailInputClassName}
                  {...({ "ph-no-capture": true } as object)}
                />
                <Text className="mt-1 text-xs text-dono-muted">
                  {mode === "signUp" && userType === "alumni"
                    ? "Use your personal email address (Gmail, etc.)."
                    : mode === "signUp"
                      ? "Use your Oxford email address (ending in ox.ac.uk)."
                      : "Use the email on your Dono account."}
                </Text>
              </View>

              {mode === "signUp" ? (
                <SetPasswordFields
                  newPassword={newPassword}
                  confirmPassword={confirmPassword}
                  onNewPasswordChange={setNewPassword}
                  onConfirmPasswordChange={setConfirmPassword}
                />
              ) : (
                <View>
                  <Text className="mb-1.5 font-retro-bold text-sm text-retro-ink">
                    Password
                  </Text>
                  <PasswordInput
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    autoComplete="current-password"
                    placeholder="Your password"
                    placeholderTextColor="#56615A"
                    className={inputClassName}
                    {...({ "ph-no-capture": true } as object)}
                  />
                </View>
              )}

              {mode === "signUp" ? (
                <LegalAcceptanceCheckbox
                  context="signup"
                  accepted={acceptedLegal}
                  onAcceptedChange={setAcceptedLegal}
                />
              ) : null}

              {error ? (
                <View className="rounded-xl bg-rose-50 px-4 py-3">
                  <Text className="text-sm text-rose-700">{error}</Text>
                </View>
              ) : null}

              <Pressable
                onPress={handleCredentialsSubmit}
                disabled={
                  loading ||
                  normalizedEmail.length === 0 ||
                  (mode === "signUp" && !acceptedLegal)
                }
                className={`items-center rounded-full border-2 border-retro-ink bg-retro-mint py-3 shadow-[3px_3px_0_#211E1A] ${
                  loading ||
                  normalizedEmail.length === 0 ||
                  (mode === "signUp" && !acceptedLegal)
                    ? "opacity-50"
                    : ""
                }`}
              >
                <Text className="font-retro-bold text-sm text-retro-paper">
                  {loading ? "Please wait..." : submitLabel}
                </Text>
              </Pressable>

              {mode === "signUp" ? (
                <Text className="text-center text-xs text-dono-muted">
                  We&apos;ll send a one-time code to verify your email.
                </Text>
              ) : null}
            </View>
          ) : (
            <View className="gap-4">
              <Text className="text-sm text-dono-muted">
                We sent a code to {normalizedEmail}.
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
                {...({ "ph-no-capture": true } as object)}
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
                onPress={handleVerifySubmit}
                disabled={loading}
                className={`items-center rounded-full border-2 border-retro-ink bg-retro-mint py-3 shadow-[3px_3px_0_#211E1A] ${
                  loading ? "opacity-50" : ""
                }`}
              >
                <Text className="font-retro-bold text-sm text-retro-paper">
                  {loading ? "Verifying..." : "Verify email"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setStep("credentials");
                  setCode("");
                  setError(null);
                  setInfo(null);
                }}
                className="items-center"
              >
                <Text className="text-sm text-dono-primary">Back</Text>
              </Pressable>
            </View>
          )}

          {footer}
        </RetroPanel>
      </View>
    </AppShell>
  );
}

function PasswordAuthFormWithPostHog(props: PasswordAuthFormProps) {
  return <PasswordAuthFormInner {...props} />;
}

export function PasswordAuthForm(props: PasswordAuthFormProps) {
  if (hasPostHog) {
    return <PasswordAuthFormWithPostHog {...props} />;
  }
  return <PasswordAuthFormInner {...props} />;
}
