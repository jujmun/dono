export type DonationFrequency = "one_time" | "monthly";

export type DonateSheetProps = {
  visible: boolean;
  campaignId: string;
  campaignTitle: string;
  selectedAmount: number;
  frequency: DonationFrequency;
  onClose: () => void;
  onSuccess: (amount: number) => void;
};

export const PRESET_DONATION_AMOUNTS = [10, 25, 50, 100] as const;
