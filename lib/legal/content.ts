import type { LegalDocumentId } from "./documents";
import { LEGAL_DOCUMENT_TITLES, LEGAL_DOCUMENT_VERSIONS } from "./documents";

const DRAFT_BANNER =
  "Working draft — not for publication until counsel clears unresolved markers. Contact dono.outreach@gmail.com with questions.";

const CONTENT: Record<LegalDocumentId, string> = {
  terms_of_service: `${DRAFT_BANNER}

Dono Terms of Service (society-only product)

1. Who we are. Dono is a trading name operated by Amrit Kaur Rooprai, a sole trader. Contact: dono.outreach@gmail.com.

2. Acceptance. By creating an account, browsing or using the Platform, creating a Campaign or making a Donation, you agree to these Terms and the incorporated policies that apply to you.

3. Age. You must be at least 18 years old to create an account, create a Campaign or make a Donation.

4. Platform role. Dono is a technology and crowdfunding platform for students at Recognised Institutions. Dono is not a bank, escrow provider, payment processor, charity, or guarantor of Campaigns. Donations are processed by Stripe and paid to the Connected Account of the Campaign Owner (Merchant of Record). Dono takes a platform fee.

5. Eligibility. The Platform initially operates in the United Kingdom. Only eligible students of Recognised Institutions may create Campaigns. Campaigns on Dono are Society Campaigns only.

6. Incorporated policies. Student Campaign Terms, Society Campaign Terms, Donor Terms, Refund and Dispute Policy, Community Guidelines, Verification Policy, Privacy Policy and Cookie Policy form part of your agreement where they apply.

7. Campaigns. Campaign Owners must provide accurate information, use funds only for the stated purpose, provide evidence and updates, notify Material Changes, and cooperate with refunds. Prohibited categories include alcohol-related expenditure, political campaigning, investments, loans, fundraising for another individual, and pass-through donations.

8. Donations. Donations are charged immediately and are collected even if the funding target is not met. Gift Aid is not claimed. Public anonymity hides the donor name from public display only.

9. Refunds. Dono operates an internal refund process. Refunds are recovered from the Connected Account. Dono never pays refunds from its own funds.

10. Fees. At checkout you may cover Dono's fee and estimated Payment Provider fees so the intended amount reaches the Campaign, or decline so fees are deducted from the amount received.

11. Community. No private messaging. Users may report content. There is no blocking feature.

12. Governing law. England and Wales.

Full draft source: dono-brain/terms/01_dono_terms_of_service.md`,

  society_campaign_terms: `${DRAFT_BANNER}

Society Campaign Terms

Society Campaigns must be approved through the society page. A named Responsible Individual must have authority to act for the Society.

Donations are paid to a Connected Account held for the Society (preferred) or, where none exists, to a named student's Connected Account. The Connected Account holder is the Merchant of Record. Where a student's account is used, the campaign page must disclose the legal recipient; funded property still belongs to the Society.

The Society and Responsible Individual must comply with permitted use of funds, reallocation, Material Changes, Surplus Funds, evidence and updates. Succession requires appointing a replacement Responsible Individual before departure.

Full draft: dono-brain/terms/03_dono_society_campaign_terms.md`,

  student_campaign_terms: `${DRAFT_BANNER}

Student Campaign Terms (individuals involved in Society Campaigns)

Individuals who create or operate a Society Campaign must be at least 18, currently enrolled at a Recognised Institution, physically studying in the UK, hold a valid university email, complete Stripe Connected Account onboarding where they are the Merchant of Record, and remain eligible while the Campaign is active.

Campaign funds may be used only for the stated purpose. Evidence of expenditure must be uploaded within 14 days. Material Changes require Dono review. Surplus must be refunded in reverse chronological order of donation.

Full draft: dono-brain/terms/02_dono_student_campaign_terms.md`,

  donor_terms: `${DRAFT_BANNER}

Donor Terms

You must be at least 18. A Donation is a gratuitous contribution to the stated campaign purpose — not an investment, loan, equity, or purchase. Donations are not necessarily tax-deductible; Gift Aid is not claimed.

Your Donation is processed by Stripe and paid to the Campaign Owner's Connected Account. Dono receives only its platform fee. At checkout you may cover fees or decline. Checkout shows intended gift, Dono fee, estimated Stripe fee, total charged, and amount reaching the Campaign.

You may donate publicly anonymously (name hidden; amount still shown). You will receive an email confirmation.

Refunds: request through Dono on defined grounds within 60 days after Campaign End Date (or 60 days after awareness), or up to 12 months for fraud / deliberate material misrepresentation. Appeals within ten working days. Dono never pays refunds from its own funds.

Full draft: dono-brain/terms/04_dono_donor_terms.md`,

  community_guidelines: `${DRAFT_BANNER}

Community Guidelines

Be honest, respectful, lawful and safe. Prohibited: illegal activity, fraud, misleading fundraising, harassment, discrimination, impersonation, spam, sexual content, copyright/trademark infringement, unauthorised institutional branding, false affiliation, ban evasion, malicious reporting.

No private messaging. Comments are public. You may edit or delete your own comments (edited indicator shown). Campaign owners may remove a comment from public display on their campaign but may not edit another user's wording. Report content in-app or via dono.outreach@gmail.com. There is no blocking feature.

Full draft: dono-brain/terms/05_dono_community_guidelines.md`,

  privacy: `${DRAFT_BANNER}

Privacy Policy (stub)

Data controller: Amrit Kaur Rooprai trading as Dono. Contact: dono.outreach@gmail.com.

We collect account data (email, name, optional profile fields, date of birth for age eligibility), student-card images for society verification, Stripe Identity outputs (name/DOB), donation and transaction metadata (not full card numbers), campaign content, comments, reports, and legal acceptance records.

We use data to operate the Platform, verify students, process donations via Stripe, moderate content, handle refunds, and meet legal obligations. Stripe processes payment data under its own privacy policy.

You may request account closure. Closure does not extinguish obligations relating to refunds, chargebacks, evidence and investigations. Donation and payment records may be retained as required for financial and fraud purposes.

This stub will be replaced after counsel review.`,

  cookie: `${DRAFT_BANNER}

Cookie Policy (stub)

We use essential cookies and similar technologies required to sign you in, secure the Platform, and remember preferences. Analytics (e.g. PostHog) may use non-essential technologies; where required we will seek consent. You can control non-essential cookies through your browser or in-product controls when available.

This stub will be replaced after counsel review.`,

  refund_dispute: `${DRAFT_BANNER}

Refund and Dispute Policy (stub)

Grounds include: duplicate or unauthorised payment, campaign cancellation, material misrepresentation, fraud, misuse of funds, failure to provide required evidence, material unauthorised change, inability to use funds meaningfully for the stated purpose, or verification failure. Mere dissatisfaction with outcome is insufficient.

Ordinary requests: within 60 days after Campaign End Date, or within 60 days after you became aware of the alleged breach, whichever is later. Fraud / deliberate material misrepresentation: up to 12 months after the Donation.

Process: submit evidence; Campaign Owner has five working days to respond; Dono may award no, partial or full refund. Appeal within ten working days.

Surplus funds are refunded in reverse chronological order of donation. Refunds are recovered from the Connected Account. Dono never pays refunds from its own funds and does not guarantee recovery.

Chargebacks remain available via your card issuer and are separate from this process.`,

  verification: `${DRAFT_BANNER}

Verification Policy (stub)

Labels have limited meanings:

• "Student status checked by Dono" — limited manual review of university email, student-card image and current student status.
• "Stripe onboarding completed" — Payment Provider identity/KYC for the Connected Account.
• "Society approved" — society page approved the Campaign as a society campaign (not institutional endorsement).
• "Institutionally endorsed" — only where the Recognised Institution has expressly endorsed the Campaign.

Dono does not use a generic "Verified" badge without explanation. Checks do not verify every campaign statement, cost accuracy, viability or successful completion.`,
};

export function getLegalDocumentBody(docId: LegalDocumentId): string {
  return CONTENT[docId];
}

export function getLegalDocumentMeta(docId: LegalDocumentId) {
  return {
    id: docId,
    title: LEGAL_DOCUMENT_TITLES[docId],
    version: LEGAL_DOCUMENT_VERSIONS[docId],
    body: CONTENT[docId],
  };
}
