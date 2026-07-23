# Dono TODO

A single, living list of open tasks across the company. Unlike the rest of
`dono-brain` (which holds settled context and handoffs), this file is meant to
change constantly — check items off, add new ones, and re-file them as work
gets picked up. See the [README](README.md#keeping-todomd-current) for the
maintenance rule.

Tasks are grouped by the team most responsible. A task that spans teams is
listed under each team it involves rather than being duplicated with different
wording.

---

## Engineering / Software

Source: [engineering/product-legal-alignment-roadmap.md](engineering/product-legal-alignment-roadmap.md), [engineering/payments-architecture.md](engineering/payments-architecture.md)

**P0 — before demo**
- [ ] Society approval workflow: draft → submitted → committee review → approved/rejected → published; no campaign auto-publishes
- [ ] Committee approval dashboard: pending queue, approve, reject, optional rejection reason
- [ ] Campaign-creator visibility into pending/rejected status + approval notifications
- [ ] Verification badge system: Verified Student, Student Status Checked by Dono, Stripe Onboarding Completed, Society Approved, Institutionally Endorsed — reusable component, auto-grant Verified Student on approval
- [ ] New campaign fields: purchase links (multiple), expected expenditure date, planned update schedule (internal only)
- [ ] Fee-cover checkout: optional "cover fees" checkbox; itemised breakdown (donation, Dono fee, Stripe fee, total, amount reaching campaign) as the default donation experience
- [ ] Society infrastructure: committee roles, approval permissions, campaign moderation, society ownership, future committee succession

**P1 — immediately after demo**
- [ ] Refund request product workflow (submit → owner notified → evidence → decision → appeal (future) → Stripe refund), covering duplicate donations, fraud, accidental payment, cancellation, non-delivery
- [ ] Evidence system: receipts/invoices/proof of purchase attached to expenditure
- [ ] Outcome updates: scheduled reminders, completion updates, images/documents/progress reports; long-term automatic reminder engine
- [ ] Reporting infrastructure: report campaigns/comments/users/updates with evidence + admin moderation queue
- [ ] Comment moderation: edit, edited indicator, report, owner removal, admin removal, audit history
- [ ] Legal document product routes (ToS, Privacy, Cookies, Donor Terms, Student Campaign Terms, Community Guidelines) with footer links — initially just render legal docs
- [ ] Acceptance tracking: versioned accept events for terms/privacy/cookies (version + timestamp), reacceptance support

**P2 — future infrastructure**
- [ ] Student Campaigns (verification → student connected account → campaign creation) without baking in a societies-only assumption
- [ ] Responsible Individual + successor + transfer process, integrated with committee management
- [ ] Campaign funding disclosure (society account vs named student) on campaign page
- [ ] Monthly donations: recurring payments, subscription management, failed payment recovery, cancellation, financial reporting
- [ ] Community Funds — architecture should stay compatible, no build yet

**Payments/risk architecture (ongoing discipline, not one-off tasks)**
- [ ] Keep all payments on Stripe Connect **Standard** + direct charges + `application_fee_amount` — no destination charges, no pooled funds, no payout delays, no reserve funds (any proposed change here requires legal review first)
- [ ] Build refund/dispute case tooling that can assemble evidence in either direction (student defence vs donor-support) and supports an "escalated to university" case state
- [ ] Campaign snapshot/versioning so donor-facing wording at time of donation is immutably retrievable for evidence
- [ ] Data protection basics: encryption at rest/in transit, role-based access, deletion schedules, processor agreements, breach-response procedure

**Cross-team**
- [ ] Age verification: investigate whether Stripe Identity/KYC verified DOB can be the authoritative 18+ check; if not reliable for every flow, propose an alternative before building — *(engineering + legal)*

---

## Legal

Source: [legal/legal-terms-context-handoff.md](legal/legal-terms-context-handoff.md), [legal/ip-branding-and-data-notes.md](legal/ip-branding-and-data-notes.md), [engineering/product-legal-alignment-roadmap.md](engineering/product-legal-alignment-roadmap.md)

**Drafting sequence (recommended order, §36 of legal handoff)**
- [ ] Finalise payment/Stripe configuration details needed for drafting (fee splits, negative-balance allocation)
- [ ] Decide final fee structure (Dono %, fixed component, GBP-only vs multi-currency)
- [ ] Decide final permitted campaign categories (tuition/rent/living costs/medical/charity fundraising still undecided)
- [ ] Decide technology + data-retention model (needed before Cookie Policy can be drafted)
- [ ] Draft Verification Policy
- [ ] Draft Student Campaign Terms
- [ ] Draft Society Campaign Terms
- [ ] Draft Donor Terms
- [ ] Draft Refund and Dispute Policy
- [ ] Draft Community Guidelines
- [ ] Draft main Terms of Service
- [ ] Draft Privacy Policy
- [ ] Draft Cookie Policy (after stack is known)
- [ ] Full suite review by a UK solicitor
- [ ] Age verification: same investigation as above — confirm whether Stripe-verified DOB is legally sufficient as the 18+ gate, or whether an alternative is required — *(engineering + legal)*

**Specialist review needed (§32)**
- [ ] FCA/payment-services conclusion: confirm Dono stays outside FCA authorisation with the current direct-charge/Standard-account/Dono-fee/Dono-initiated-refund model, and how pooled funds/wallets/delayed payouts would change that
- [ ] Charity & fundraising law: professional fundraiser / commercial participator status, Fundraising Regulator registration, Code of Fundraising Practice, Gift Aid, use of the word "donation"
- [ ] Consumer law: whether donors are "consumers," gift vs conditional gift vs consumer payment characterisation, fairness of refund/disclaimer wording, fee transparency
- [ ] Data protection: controller roles, student-card lawful basis, retention periods, minimisation, institution referrals, PECR, international transfers, ICO registration/fee, DPIA need
- [ ] Online Safety Act: whether Dono is an in-scope user-to-user service given public comments; illegal-content risk assessment, safety duties, complaints/record-keeping, children's-access analysis
- [ ] Review Stripe Connected Account Agreement, Platform Agreement, and negative-balance provisions before launch — do not opt into any setting that shifts liability toward Dono
- [ ] Sole-trader risk review: personal liability exposure, ownership of software/brand/Stripe account, insurance, incorporation timing

**Outstanding launch blockers needing a decision (§35, non-exhaustive)**
- [ ] UK geographical business address for legal notices
- [ ] Exact Dono platform fee % and any fixed component
- [ ] Stripe negative-balance / dispute-fee allocation, refund & application-fee mechanics
- [ ] General information-request response deadline; Dono refund-decision deadline
- [ ] Evidence visibility/redaction rules; evidence & moderation-log retention periods
- [ ] Donor anonymity: exact visibility rules vs campaign owner
- [ ] Development-office data-sharing consent language and fields
- [ ] Society officer evidence requirements / number of required approvers
- [ ] Treatment of suspended and interrupted students
- [ ] Final campaign-category list (esp. tuition, rent, medical, charity fundraising)
- [ ] IP: trademark clearance search + UK/EU filing once brand is finalised (~2–3 months, ~£200–400 for EU mark)
- [ ] IP assignment agreements from all founders/contributors covering code, infra, designs, databases, trademarks — flagged as urgent since backend development is already underway

---

## Finance / Corporate

Source: [corporate/founder-context-handoff.md](corporate/founder-context-handoff.md), [legal/legal-terms-context-handoff.md](legal/legal-terms-context-handoff.md) §32.6–32.7, [legal/ip-branding-and-data-notes.md](legal/ip-branding-and-data-notes.md)

- [ ] Immigration advice: can UK Student-visa-holding founders contribute technically, hold founder options, and accrue vesting without breaching visa conditions? (single biggest unresolved issue — consult Oxford Student Immigration Team + a startup solicitor with immigration experience)
- [ ] Confirm founder roles, intended ownership, vesting terms, and initial directors internally (Phase 1)
- [ ] Incorporate as a UK Ltd (England & Wales) with a founder reserve pool and domestic-only directors initially (Phase 3)
- [ ] Draft and execute: Founder Heads of Terms, IP Assignment Agreements, Founder Agreements, Founder Option Agreements (Phase 4)
- [ ] Founder option mechanics: precise drafting, tax treatment, exercise triggers (visa change / permanent departure), good-leaver/bad-leaver terms — needs corporate lawyer input
- [ ] Tax advice: sole-trader tax/NI exposure pre-incorporation, VAT treatment of the Dono fee, whether prices are VAT-inclusive, refund tax treatment, pre-incorporation expenses, future founder share/option tax treatment
- [ ] Prepare fundraising-readiness basics: clean cap table, resolved IP ownership, investor-ready documentation (Phase 5)
- [ ] Shareholders' Agreement, once institutional investment is in view

---

## Design / Product

Source: [engineering/product-legal-alignment-roadmap.md](engineering/product-legal-alignment-roadmap.md), [design/design-psychology-and-community-guide.md](design/design-psychology-and-community-guide.md)

- [ ] Design the verification badge set (Verified Student / Student Status Checked / Stripe Onboarding Completed / Society Approved / Institutionally Endorsed) so meanings are visually distinct and match legal wording — never implies a guarantee of outcome
- [ ] Design the fee-cover donation flow (checkbox + itemised breakdown) as the new default checkout, per the [payments architecture](engineering/payments-architecture.md) "no guarantee language" rule
- [ ] Design committee approval dashboard (pending queue, approve/reject with reason) for society admins
- [ ] Design refund-request flow for donors and the evidence-submission flow for campaign owners
- [ ] Design legal-document routes (ToS, Privacy, Cookies, Donor Terms, Student Campaign Terms, Community Guidelines) and footer placement
- [ ] Review all campaign/trust copy against the "statements to avoid" list in [legal/legal-terms-context-handoff.md](legal/legal-terms-context-handoff.md) §33 (no "verified," "guaranteed," "affiliated," etc. without qualification)

---

## Research / Operations

Source: [research/](research/)

- [ ] Continue college development-office interviews to ground the society-approval and institution-endorsement model against real precedent
- [ ] Talk to a college development-office contact about how they handle alumni data under GDPR, as a working precedent for the Dono data model (per [legal/ip-branding-and-data-notes.md](legal/ip-branding-and-data-notes.md))

---

*Last reviewed: 23 July 2026, from the [engineering/product-legal-alignment-roadmap.md](engineering/product-legal-alignment-roadmap.md) brief.*
