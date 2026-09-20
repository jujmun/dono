# Record of Processing Activities (ROPA) — Dono

Controller: Dono (UK Ltd, incorporation pending)
Owner: Amrit (data protection lead)
Last updated: 30 July 2026

Per UK GDPR Article 30. This record should be kept current as processing changes — treat it as a living document, not a one-off filing.

| # | Processing activity | Purpose | Data subjects | Personal data | Lawful basis | Recipients / processors | International transfer | Retention | Security measures |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Account creation & profiles | Provide the platform | All users | Name, email, profile photo (optional) | Contract (T&Cs) | Convex (hosting/DB), Resend (email) | Yes — see transfer assessment | Duration of account + anonymised on closure unless legal hold | Access controls, encryption at rest/in transit |
| 2 | Identity verification | Confirm campaign creators are 18+ and affiliated with claimed university | Campaign creators | University ID / government ID (transient), verification date/method/outcome, Stripe reference | Legal obligation (KYC) / contract | Stripe (processor for KYC) | Yes — Stripe | ID document: 30 days. Verification record: account lifetime + 6 years | Deletion job on document; Stripe DPA governs their retention |
| 3 | Donations & payments | Process donations, payouts, refunds | Donors, beneficiaries | Payment details (held by Stripe, not Dono), transaction records | Contract | Stripe | Yes — Stripe | 6 years from transaction (accounting/audit) | Stripe handles card data (PCI scope); Dono holds transaction metadata only |
| 4 | Campaign content & receipts | Let creators evidence use of funds | Campaign creators; incidentally, third parties named on receipts | Receipt/invoice content, which may include third-party names | Legitimate interests (platform integrity, donor trust) | Convex (hosting) | Yes | 6 years from campaign closure (audit/fraud); routine content may be deleted/anonymised earlier | Access limited to moderation role |
| 5 | Moderation | Manual review of every campaign before publication | Campaign creators; incidentally, third parties on receipts | Campaign text, images, receipts | Legitimate interests (fraud/safeguarding) | Internal only | N/A (internal) | Aligned with campaign record retention | Restricted to moderator accounts |
| 6 | Comments | Platform engagement | Any user commenting | Comment content, name/profile link | Contract / legitimate interests | Convex (hosting) | Yes | Duration of account, or earlier deletion by user | Standard access controls |
| 7 | Fraud prevention | Detect fake campaigns, stolen cards, fake beneficiaries | Any user | Account activity, verification outcome, transaction patterns | Legitimate interests (see LIA) | Stripe (fraud signals) | Yes | 6 years | Access limited to founders/ops |
| 8 | Dispute resolution | Handle donor disputes over use of funds | Donors, campaign creators | Correspondence, campaign/transaction records | Legitimate interests (see LIA) | Internal only | N/A | Until matter resolved, then per transaction retention | Restricted access |
| 9 | Analytics | Understand platform usage, improve product | All users (typically aggregated/pseudonymised) | Usage events, device/browser data | Legitimate interests (see LIA) | PostHog | Yes — confirm instance region | Per PostHog data retention settings, reviewed by founders | Pseudonymisation where feasible |
| 10 | Backups | Business continuity / disaster recovery | All users | Copy of all platform data | Legitimate interests (see LIA) | Convex, Vercel | Yes | Rolling backup window (to be fixed, e.g. 30–90 days) | Same access controls as live data |
| 11 | Institutional sharing | Confirm affiliation / engage universities | Campaign creators (affiliation data only, unless otherwise agreed) | Name, university affiliation, campaign-level data | To be confirmed per institution — likely consent or legitimate interests | Named institution (per agreement) | Depends on institution | Per institutional agreement, once in place | Data-sharing agreement required before any transfer |
| 12 | Data protection / OSA complaints | Handle complaints | Complainant | Complaint content, contact details | Legal obligation / legitimate interests | Internal (joindono.team inbox) | N/A | Until resolved + reasonable audit period | Restricted inbox access |

Note: rows 4 and 11 are the two areas flagged in the DPIA as needing mitigation before launch (third-party data on receipts; no institutional data-sharing agreement yet).
