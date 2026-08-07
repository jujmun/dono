import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import {
  legalHref,
  type LegalDocumentId,
} from "@/lib/legal/documents";
import { LEGAL_WORDINGS, type WordingId } from "@/lib/legal/wordings";

type CheckboxRowProps = {
  accepted: boolean;
  onAcceptedChange: (value: boolean) => void;
  accessibilityLabel: string;
  children: React.ReactNode;
  className?: string;
  prominent?: boolean;
};

export function LegalCheckboxRow({
  accepted,
  onAcceptedChange,
  accessibilityLabel,
  children,
  className,
  prominent,
}: CheckboxRowProps) {
  return (
    <Pressable
      onPress={() => onAcceptedChange(!accepted)}
      className={`flex-row items-start gap-2 py-1 ${
        prominent ? "rounded-lg border-2 border-dono-primary bg-dono-surface px-3 py-3" : ""
      } ${className ?? ""}`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: accepted }}
      accessibilityLabel={accessibilityLabel}
    >
      <View
        className={`mt-0.5 h-4 w-4 shrink-0 items-center justify-center rounded border ${
          accepted
            ? "border-dono-primary bg-dono-primary"
            : "border-dono-border bg-white"
        }`}
      >
        {accepted ? (
          <Text className="text-[9px] font-bold leading-none text-white">✓</Text>
        ) : null}
      </View>
      <View className="min-w-0 flex-1">{children}</View>
    </Pressable>
  );
}

function DocLink({ id, label }: { id: LegalDocumentId; label: string }) {
  return (
    <Link href={legalHref(id)} asChild>
      <Text className="text-dono-primary underline">{label}</Text>
    </Link>
  );
}

/** Event A — W-ACCT-ACCEPT-1 */
export function AccountAcceptanceCheckbox({
  accepted,
  onAcceptedChange,
  className,
}: {
  accepted: boolean;
  onAcceptedChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <LegalCheckboxRow
      accepted={accepted}
      onAcceptedChange={onAcceptedChange}
      accessibilityLabel={LEGAL_WORDINGS["W-ACCT-ACCEPT-1"]}
      className={className}
    >
      <Text className="text-sm leading-5 text-dono-text">
        By creating an account, I accept the{" "}
        <DocLink id="terms_of_service" label="Terms of Service" /> and the{" "}
        <DocLink id="community_guidelines" label="Community Guidelines" />, and I
        have read the <DocLink id="privacy" label="Privacy Notice" />.
      </Text>
    </LegalCheckboxRow>
  );
}

/** Event A / C age — wording id selectable */
export function AgeCapacityCheckbox({
  wordingId = "W-AGE-1",
  accepted,
  onAcceptedChange,
  className,
}: {
  wordingId?: "W-AGE-1" | "W-ACCT-AGE-1";
  accepted: boolean;
  onAcceptedChange: (v: boolean) => void;
  className?: string;
}) {
  const text = LEGAL_WORDINGS[wordingId];
  return (
    <LegalCheckboxRow
      accepted={accepted}
      onAcceptedChange={onAcceptedChange}
      accessibilityLabel={text}
      className={className}
    >
      <Text className="text-sm leading-5 text-dono-text">{text}</Text>
    </LegalCheckboxRow>
  );
}

/** Event B — W-SOC-ACCEPT-1 */
export function SocietyAcceptanceCheckbox({
  accepted,
  onAcceptedChange,
  className,
}: {
  accepted: boolean;
  onAcceptedChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <LegalCheckboxRow
      accepted={accepted}
      onAcceptedChange={onAcceptedChange}
      accessibilityLabel={LEGAL_WORDINGS["W-SOC-ACCEPT-1"]}
      className={className}
    >
      <Text className="text-sm leading-5 text-dono-text">
        I accept the{" "}
        <DocLink id="society_campaign_terms" label="Society Campaign Terms" />{" "}
        and the <DocLink id="refund_dispute" label="Refund and Dispute Policy" />{" "}
        on behalf of the Society, and I confirm I am authorised to do so.
      </Text>
    </LegalCheckboxRow>
  );
}

export function SocietyDeclarationCheckbox({
  wordingId,
  accepted,
  onAcceptedChange,
  prominent,
  className,
}: {
  wordingId: Extract<
    WordingId,
    | "W-SOC-AUTH-1"
    | "W-SOC-APPROVE-1"
    | "W-SOC-RECOURSE-1"
    | "W-SOC-REFUND-1"
    | "W-SOC-OWNER-1"
  >;
  accepted: boolean;
  onAcceptedChange: (v: boolean) => void;
  prominent?: boolean;
  className?: string;
}) {
  const text = LEGAL_WORDINGS[wordingId];
  return (
    <LegalCheckboxRow
      accepted={accepted}
      onAcceptedChange={onAcceptedChange}
      accessibilityLabel={text}
      prominent={prominent}
      className={className}
    >
      <Text
        className={`text-sm leading-5 text-dono-text ${
          prominent ? "font-semibold" : ""
        }`}
      >
        {text}
      </Text>
    </LegalCheckboxRow>
  );
}

/** Event C — W-ACCEPT-1 (links include ToS for guests and account holders alike per wording). */
export function DonateAcceptanceCheckbox({
  accepted,
  onAcceptedChange,
  className,
}: {
  accepted: boolean;
  onAcceptedChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <LegalCheckboxRow
      accepted={accepted}
      onAcceptedChange={onAcceptedChange}
      accessibilityLabel={LEGAL_WORDINGS["W-ACCEPT-1"]}
      className={className}
    >
      <Text className="text-sm leading-5 text-dono-text">
        By continuing, I accept the{" "}
        <DocLink id="donor_terms" label="Donor Terms" />, the{" "}
        <DocLink id="refund_dispute" label="Refund and Dispute Policy" /> and the{" "}
        <DocLink id="terms_of_service" label="Terms of Service" />, and I have
        read the <DocLink id="privacy" label="Privacy Notice" />.
      </Text>
    </LegalCheckboxRow>
  );
}

/** @deprecated Prefer event-specific checkboxes. */
export function LegalAcceptanceCheckbox({
  context,
  accepted,
  onAcceptedChange,
  className,
  showAgeAttestation: _showAgeAttestation = true,
}: {
  context: "signup" | "create_society" | "donate" | "create_campaign";
  accepted: boolean;
  onAcceptedChange: (value: boolean) => void;
  className?: string;
  showAgeAttestation?: boolean;
}) {
  if (context === "signup") {
    return (
      <AccountAcceptanceCheckbox
        accepted={accepted}
        onAcceptedChange={onAcceptedChange}
        className={className}
      />
    );
  }
  if (context === "create_society") {
    return (
      <SocietyAcceptanceCheckbox
        accepted={accepted}
        onAcceptedChange={onAcceptedChange}
        className={className}
      />
    );
  }
  if (context === "donate") {
    return (
      <DonateAcceptanceCheckbox
        accepted={accepted}
        onAcceptedChange={onAcceptedChange}
        className={className}
      />
    );
  }
  // create_campaign: no fourth acceptance event — show society terms reminder only
  return (
    <Text className={`text-sm text-dono-muted ${className ?? ""}`}>
      Society Campaign Terms were accepted at society onboarding.
    </Text>
  );
}

/** @deprecated Use AgeCapacityCheckbox with W-AGE-1 */
export function AgeAttestationCheckbox({
  accepted,
  onAcceptedChange,
  className,
}: {
  accepted: boolean;
  onAcceptedChange: (value: boolean) => void;
  className?: string;
}) {
  return (
    <AgeCapacityCheckbox
      wordingId="W-AGE-1"
      accepted={accepted}
      onAcceptedChange={onAcceptedChange}
      className={className}
    />
  );
}
