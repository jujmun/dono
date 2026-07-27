import { useState } from "react";
import { View, TextInput, Pressable, type TextInputProps } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<TextInputProps, "secureTextEntry"> & {
  className?: string;
};

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View className="relative">
      <TextInput
        {...props}
        secureTextEntry={!visible}
        className={cn(className, "pr-11")}
      />
      <Pressable
        onPress={() => setVisible((current) => !current)}
        accessibilityRole="button"
        accessibilityLabel={visible ? "Hide password" : "Show password"}
        className="absolute bottom-0 right-3 top-0 items-center justify-center"
      >
        {visible ? (
          <EyeOff size={18} color="#56615A" />
        ) : (
          <Eye size={18} color="#56615A" />
        )}
      </Pressable>
    </View>
  );
}
