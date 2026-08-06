import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import {
  LEGAL_REQUIRED_BY_CONTEXT,
  LEGAL_DOCUMENT_TITLES,
  type LegalAcceptanceContext,
} from "@/lib/legal/documents";

type LegalAcceptanceCheckboxProps = {
  context: LegalAcceptanceContext;
  accepted: boolean;
  onAcceptedChange: (value: boolean) => void;
  className?: string;
  /** Set false to drop the bundled 18+ claim from the label — used where a
   * separate AgeAttestationCheckbox captures that claim independently.
   * Defaults to true so existing call sites keep today's combined copy. */
  showAgeAttestation?: boolean;
};

export function LegalAcceptanceCheckbox({
  context,
  accepted,
  onAcceptedChange,
  className,
  showAgeAttestation = true,
}: LegalAcceptanceCheckboxProps) {
  const docs = LEGAL_REQUIRED_BY_CONTEXT[context];

  return (
    <Pressable
      onPress={() => onAcceptedChange(!accepted)}
      className={`flex-row items-start gap-2 py-1 ${className ?? ""}`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: accepted }}
      accessibilityLabel="Accept legal terms"
    >
      <View
        className={`mt-0.5 h-4 w-4 shrink-0 items-center justify-center rounded border ${
          accepted ? "border-dono-primary bg-dono-primary" : "border-dono-border bg-white"
        }`}
      >
        {accepted ? (
          <Text className="text-[9px] font-bold leading-none text-white">✓</Text>
        ) : null}
      </View>
      <Text className="min-w-0 flex-1 text-sm leading-5 text-dono-text">
        {showAgeAttestation ? "I am at least 18 and I agree to the " : "I agree to the "}
        {docs.map((id, index) => (
          <Text key={id}>
            {index > 0 ? (index === docs.length - 1 ? " and " : ", ") : null}
            <Link href={`/legal/${id}`} asChild>
              <Text className="text-dono-primary underline">{LEGAL_DOCUMENT_TITLES[id]}</Text>
            </Link>
          </Text>
        ))}
        .
      </Text>
    </Pressable>
  );
}

type AgeAttestationCheckboxProps = {
  accepted: boolean;
  onAcceptedChange: (value: boolean) => void;
  className?: string;
};

export function AgeAttestationCheckbox({
  accepted,
  onAcceptedChange,
  className,
}: AgeAttestationCheckboxProps) {
  return (
    <Pressable
      onPress={() => onAcceptedChange(!accepted)}
      className={`flex-row items-start gap-2 py-1 ${className ?? ""}`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: accepted }}
      accessibilityLabel="Confirm you are at least 18 years old"
    >
      <View
        className={`mt-0.5 h-4 w-4 shrink-0 items-center justify-center rounded border ${
          accepted ? "border-dono-primary bg-dono-primary" : "border-dono-border bg-white"
        }`}
      >
        {accepted ? (
          <Text className="text-[9px] font-bold leading-none text-white">✓</Text>
        ) : null}
      </View>
      <Text className="min-w-0 flex-1 text-sm leading-5 text-dono-text">
        I confirm I am at least 18 years old.
      </Text>
    </Pressable>
  );
}
