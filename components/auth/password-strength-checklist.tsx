import { View, Text } from "react-native";
import { Check, X } from "lucide-react-native";

type PasswordStrengthChecklistProps = {
  password: string;
};

type Requirement = {
  label: string;
  met: boolean;
};

function getRequirements(password: string): Requirement[] {
  return [
    { label: "At least 10 characters", met: password.length >= 10 },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];
}

export function PasswordStrengthChecklist({
  password,
}: PasswordStrengthChecklistProps) {
  const requirements = getRequirements(password);

  return (
    <View className="gap-1.5">
      {requirements.map((requirement) => (
        <View key={requirement.label} className="flex-row items-center gap-2">
          {requirement.met ? (
            <Check size={14} color="#166534" />
          ) : (
            <X size={14} color="#9CA3AF" />
          )}
          <Text
            className={`text-xs ${
              requirement.met ? "text-green-700" : "text-dono-muted"
            }`}
          >
            {requirement.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
