import type { RecipientPanelData } from "@/components/donate-recipient-panel";

export type DonateSheetProps = {
  visible: boolean;
  campaignId: string;
  campaignTitle: string;
  selectedAmount: number;
  isAuthenticated: boolean;
  donorEmail: string;
  onDonorEmailChange: (email: string) => void;
  isAnonymous: boolean;
  onAnonymousChange: (value: boolean) => void;
  legalAccepted: boolean;
  onLegalAcceptedChange: (value: boolean) => void;
  ageAttested: boolean;
  onAgeAttestedChange: (value: boolean) => void;
  coverFees: boolean;
  onCoverFeesChange: (value: boolean) => void;
  marketingOptIn: boolean;
  onMarketingOptInChange: (value: boolean) => void;
  showSupportPublicly: boolean;
  onShowSupportPubliclyChange: (value: boolean) => void;
  /** Optional overrides — sheet loads disclosures itself when omitted. */
  recipientPanel?: RecipientPanelData | null;
  panelComplete?: boolean;
  mayExceedTarget?: boolean;
  onClose: () => void;
  onSuccess: (
    amount: number,
    options?: {
      pendingConfirmation?: boolean;
      paymentIntentId?: string;
      donationId?: string;
      legalVersions?: { documentId: string; version: string }[];
      feeBreakdown?: unknown;
      recipientPanel?: RecipientPanelData | null;
    },
  ) => void;
};

export const PRESET_DONATION_AMOUNTS = [10, 25, 50, 100] as const;

export function getOrCreateDonateGuestKey(): string {
  const keyName = "dono_donate_guest_key";
  try {
    if (typeof localStorage !== "undefined") {
      const existing = localStorage.getItem(keyName);
      if (existing) return existing;
      const created = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(keyName, created);
      return created;
    }
  } catch {
    // ignore
  }
  return `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}
