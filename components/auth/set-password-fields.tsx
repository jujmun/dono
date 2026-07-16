import { View, Text, TextInput } from "react-native";
import { PasswordStrengthChecklist } from "@/components/auth/password-strength-checklist";

type SetPasswordFieldsProps = {
  newPassword: string;
  confirmPassword: string;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
};

const inputClassName =
  "w-full rounded-xl border border-dono-border px-4 py-2.5 text-sm text-dono-text";

export function SetPasswordFields({
  newPassword,
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
}: SetPasswordFieldsProps) {
  return (
    <View className="gap-4">
      <View>
        <Text className="mb-2 text-xs uppercase tracking-wide text-dono-muted">
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
        />
      </View>
      {newPassword.length > 0 ? (
        <PasswordStrengthChecklist password={newPassword} />
      ) : null}
      <View>
        <Text className="mb-2 text-xs uppercase tracking-wide text-dono-muted">
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
        />
      </View>
    </View>
  );
}
