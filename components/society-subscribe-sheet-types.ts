export const SOCIETY_SUBSCRIBE_PRESET_AMOUNTS = [5, 10, 25, 50] as const;

export type SocietySubscribeSheetProps = {
  visible: boolean;
  communitySlug: string;
  societyName: string;
  isAuthenticated: boolean;
  legalAccepted: boolean;
  onLegalAcceptedChange: (value: boolean) => void;
  onClose: () => void;
  onSuccess: (amount: number) => void;
};
