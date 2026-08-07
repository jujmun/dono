/** Convex copy of acceptance wordings — keep in sync with lib/legal/wordings.ts */
export type WordingId =
  | "W-ROLE-1"
  | "W-DEADLINE-1"
  | "W-SURPLUS-1"
  | "W-AGE-1"
  | "W-ACCEPT-1"
  | "W-COVER-1"
  | "W-HIDE-1"
  | "W-HIDE-DISCLOSURE-1"
  | "W-MKT-1"
  | "W-DISPLAY-1"
  | "W-ACCT-AGE-1"
  | "W-ACCT-ACCEPT-1"
  | "W-SOC-ACCEPT-1"
  | "W-SOC-AUTH-1"
  | "W-SOC-APPROVE-1"
  | "W-SOC-RECOURSE-1"
  | "W-SOC-REFUND-1"
  | "W-SOC-OWNER-1";

export const LEGAL_WORDINGS: Record<WordingId, string> = {
  "W-ROLE-1":
    "Dono operates this platform. Dono does not receive your donation, does not hold it, and is not responsible for how it is spent. Your payment goes directly to the account shown above. Dono charges the campaign a fee for using the platform.",
  "W-DEADLINE-1":
    "If something goes wrong with your donation, deadlines set by your card provider and by law run independently of Dono's process. Contacting us does not pause them.",
  "W-SURPLUS-1":
    "If this campaign raises more than its target, surplus is refunded starting with the most recent donations and working backwards, until the surplus runs out. Surplus is not shared out proportionately, and there is no guarantee you will receive an automatic share. You can also ask for a refund of surplus yourself.",
  "W-AGE-1":
    "I confirm that I am 18 years of age or older and have the legal capacity to enter into this agreement.",
  "W-ACCEPT-1":
    "By continuing, I accept the Donor Terms, the Refund and Dispute Policy and the Terms of Service, and I have read the Privacy Notice.",
  "W-COVER-1": "Cover Dono's fee",
  "W-HIDE-1": "Hide my name",
  "W-HIDE-DISCLOSURE-1":
    "This hides your name on Dono's public pages. Your donation amount is still shown. It does not hide information Stripe gives to the person or society receiving the money — because your payment goes straight to their own Stripe account, they may be able to see your name there. Dono will not tell them who you are, and our Terms prohibit them from using payment information to identify or contact you.",
  "W-MKT-1": "Email me occasionally about Dono and campaigns I might like.",
  "W-DISPLAY-1": "Show my support publicly",
  "W-ACCT-AGE-1": "I confirm that I am 18 years of age or older.",
  "W-ACCT-ACCEPT-1":
    "By creating an account, I accept the Terms of Service and the Community Guidelines, and I have read the Privacy Notice.",
  "W-SOC-ACCEPT-1":
    "I accept the Society Campaign Terms and the Refund and Dispute Policy on behalf of the Society, and I confirm I am authorised to do so.",
  "W-SOC-AUTH-1":
    "I confirm I am authorised under the Society's constitution, or equivalent governing document, to create and operate Campaigns on the Society's behalf, to authorise the receipt of Donations, and to accept the Society Campaign Terms and the Refund and Dispute Policy for and on behalf of the Society.",
  "W-SOC-APPROVE-1":
    "I confirm that every approval required by the Society's constitution or governing rules, its bank mandate, and any Students' Union or institutional requirement has been obtained for this Campaign.",
  "W-SOC-RECOURSE-1":
    "Because your society is not a separate legal entity, you are the person contracting with Dono on its behalf. Dono limits what it can claim from you personally to the money in the Stripe account you control for the society — unless you act dishonestly, deliberately misuse funds, or say you have authority when you do not.",
  "W-SOC-REFUND-1":
    "I understand that the holder of the Connected Account is responsible for refunds and chargebacks associated with that account. I understand that Dono may instruct the Payment Provider to reverse a charge on that account under the refund mandate in clause 13.2 of the Terms of Service, after notice and an opportunity to respond except in urgent cases, and that I may appeal. I understand Dono cannot hold or delay a payout.",
  "W-SOC-OWNER-1":
    "I warrant that the Ownership Statement I have given is accurate and that I have authority to make it.",
};
