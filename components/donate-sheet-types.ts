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
  donateAnonymously: boolean;
  onDonateAnonymouslyChange: (value: boolean) => void;
  onClose: () => void;
  onSuccess: (amount: number, options?: { pendingConfirmation?: boolean }) => void;
};

export const PRESET_DONATION_AMOUNTS = [10, 25, 50, 100] as const;
