import { View, Text, TextInput } from "react-native";
import { PasswordStrengthChecklist } from "@/components/auth/password-strength-checklist";

type SetPasswordFieldsProps = {
  newPassword: string;
  confirmPassword: string;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
};

const inputClassName =
  "w-full rounded-lg border-2 border-retro-ink bg-white px-4 py-2.5 font-retro-mono text-sm text-retro-ink outline-none";

export function SetPasswordFields({
  newPassword,
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
}: SetPasswordFieldsProps) {
  return (
    <View className="gap-4">
      <View>
        <Text className="mb-2 font-retro-mono text-xs uppercase tracking-wide text-[#5c574f]">
          Password
        </Text>
        <TextInput
          value={newPassword}
          onChangeText={onNewPasswordChange}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          placeholder="Create a password"
          placeholderTextColor="#56615A"
          className={inputClassName}
          {...({ "ph-no-capture": true } as object)}
        />
      </View>
      {newPassword.length > 0 ? (
        <PasswordStrengthChecklist password={newPassword} />
      ) : null}
      <View>
        <Text className="mb-2 font-retro-mono text-xs uppercase tracking-wide text-[#5c574f]">
          Confirm password
        </Text>
        <TextInput
          value={confirmPassword}
          onChangeText={onConfirmPasswordChange}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          placeholder="Confirm password"
          placeholderTextColor="#56615A"
          className={inputClassName}
          {...({ "ph-no-capture": true } as object)}
        />
      </View>
    </View>
  );
}
