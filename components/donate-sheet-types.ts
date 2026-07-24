export type DonationFrequency = "one_time" | "monthly";

export type DonateSheetProps = {
  visible: boolean;
  campaignId: string;
  campaignTitle: string;
  selectedAmount: number;
  frequency: DonationFrequency;
  isAuthenticated: boolean;
  donorEmail: string;
  onDonorEmailChange: (email: string) => void;
  coverFees: boolean;
  onCoverFeesChange: (value: boolean) => void;
  legalAccepted: boolean;
  onLegalAcceptedChange: (value: boolean) => void;
  onClose: () => void;
  onSuccess: (amount: number, options?: { pendingConfirmation?: boolean }) => void;
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
