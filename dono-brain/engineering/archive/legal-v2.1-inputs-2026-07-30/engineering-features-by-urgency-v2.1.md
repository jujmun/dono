# Dono — Engineering features required by the Terms (v2.1)

> **HISTORICAL v2.1 INPUT — SUPERSEDED. DO NOT BUILD FROM THIS FILE.** It contains old fee, refund, verification, campaign and sequencing positions. Current work is in [`../../legal-launch/ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md`](../../legal-launch/ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md), governed by [`../../../TRUTH.md`](../../../TRUTH.md).

**For:** the Dono engineering team
**From:** legal/product, following the pre-launch counsel review and the v2.1 document revisions
**Date:** 30 July 2026

**Historical context.** At v2.1, each item was treated as a feature the revised Terms promised. The priorities and product assumptions below have since been superseded; they explain the old reasoning but do not define today's demo or launch requirements.

Priorities: **P0** = blocks taking real money / legal-critical; **P1** = required for a clean public launch; **P2** = needed soon after, or as volume grows.

---

## P0 — Must exist before real donations

### 1. Clickwrap acceptance + immutable acceptance records
- Replace "by browsing you agree" with an explicit, **unticked** acceptance step at each role transition (account creation, donation checkout, campaign submission, society approval, becoming a Responsible Individual, linking a personal Connected Account for a society).
- Store per acceptance: user ID, role, campaign ID (where relevant), document names **and version numbers**, timestamp, and the exact acceptance wording shown.
- Deliver a **durable copy** (email and/or account download) of the transaction-specific terms accepted, and keep an **immutable archived copy** of each document version keyed to the acceptance event.
- No pre-ticked boxes; no single "I agree to all policies" catch-all. (ToS 1.5, 2.2; role map.)

### 2. Fee calculator = Stripe applicable cost + 3.5 percentage points
- Total processing charge = the Payment Provider's applicable fee for that transaction (variable % by card type + 20p fixed + 2% only if the Payment Provider actually performs currency conversion) **plus 3.5 percentage points, which is Dono's platform application fee**.
- Worked targets (verify against live Stripe pricing): standard UK 5%+20p; premium UK 5.4%+20p; EEA 6%+20p; international 6.75%+20p; +2% only on actual FX.
- The 2% must **not** be added merely because a card is non-UK — only when conversion occurs. (ToS 16; Donor 6.)

### 3. Fee-cover toggle — optional, unticked, exact total
- Checkout offers "cover the fees" vs "deduct fees from my donation"; **unticked by default**; charged only if actively selected.
- Before the final button, show the **exact total** to be charged (computed from card category once known), the amount intended for the campaign, Dono's fee, the processing cost, and the expected net to the campaign. Never charge more than the confirmed total. (ToS 16.4–16.5; Donor 6.3–6.4.)

### 4. Stripe Connect allocation, refund and dispute runbooks (tested)
- Confirm and lock the charge type, losses collector, fees collector, dispute owner, dashboard/API permissions and negative-balance recovery on Standard connected accounts.
- Implement and **test end-to-end**: a donation, a full refund, a partial refund, a chargeback/dispute, and reconciliation. Mirror the confirmed behaviour exactly in the Terms. (ToS 15.5; Refund 8–9.) **Historically blocked on answers in `stripe-cookies-configuration-form-v2.1.md`.**

### 5. Two-step refund with automatic Dono-fee refund
- Refund flow: (a) the Campaign Owner refunds the charge from their dashboard; (b) **Dono separately refunds its own application fee** within a defined period after the charge refund succeeds, where the refund is due and the donor was not at fault.
- Handle partial refunds (proportional fee refund) and failure states (charge refund fails / insufficient balance). Do **not** rely on the charge refund to reverse the application fee automatically. (Refund 9; Donor 11.7.)
- **No** platform-initiated ("reserve") refund power — the API-authorised refund path is removed from v1. (Refund 6.1.)

### 6. De minimis surplus rule + reverse-chronological surplus refunds
- Surplus refunds run **most-recent-donor-first** until exhausted (not pro rata).
- Implement a configurable **de minimis threshold** below which a residual need not be refunded (e.g. £1 left over on a £1,000 campaign that raised £1,001). Surface the figure at checkout and closure. **Threshold value to be set by the Dono team.** (ToS 14.5; Refund 10.)

### 7. Card image deletion; keep the card number
- After a **successful** student-status check, **delete the student-card image immediately** (or within 30 days if manual review is pending). Delete failed/abandoned verification uploads within 30 days.
- **Retain the student-card number** and extracted fields (name, institution, college, course, expiry). Ensure extraction **discards** unneeded fields (barcodes, library IDs) rather than storing the whole record. Log every access to card data. (Privacy 6, 7.)

---

## P1 — Required for a clean public launch

### 8. Recipient model at campaign setup
- Campaign setup asks **"Who will receive the funds?"** → Society account / College–University account / registered charity / authorised representative. Whoever connects the Stripe account is the **Recipient**.
- Capture the Recipient's confirmations: authorised to receive funds, authorised to run the campaign, responsible for refunds/chargebacks. Record **who legally owns the funded asset**. (ToS 15; Society 3.)

### 9. Managed change-of-representative (succession) flow
- Support changing the authorised representative on a Society Campaign: verify the incoming representative, capture committee confirmation, connect the new Stripe account, and route **future** donations to the new account; old representative stays responsible for **pre-transfer** transactions only.
- Require every Society Campaign to record a **primary and a secondary** representative at setup.
- Handle the balance-migration constraint per Stripe's capabilities (payout + external transfer if Connect won't migrate). (Society 6.) **Depends on Stripe answers.**

### 10. Material-change workflow (3 tiers) with spend freeze
- Classify a change as minor / material-but-equivalent / fundamental.
- Material-but-equivalent → notify donors + open a **14-day refund window**; fundamental → auto-cancel + refund unless donors opt in.
- **Freeze affected expenditure/payouts until the refund window closes.** (ToS 14.3–14.4.)

### 11. Closure Statement lifecycle with deemed acceptance
- Enforce a 30-day submission window after funds are dealt with; structured minimum fields (summary, expenditure breakdown, receipts where required, variance explanation, surplus confirmation).
- Dono review target 30 days; limited rejection reasons; **one cure cycle**; **deemed acceptance** if no response within 30 days of a complete statement (with an override for fraud/investigation holds). (ToS 10.3.)

### 12. Consent management: institution data-sharing + marketing (separate)
- Two independent, unticked consents: (a) share {name, email, donations to that institution's campaigns, dates, fee-cover} with a **named** institution to thank/invite to events; (b) receive that institution's marketing.
- Show the institution's privacy notice before consent; store wording, version, timestamp, institution, campaign, user. Support withdrawal and propagate it to the institution. (Privacy 9.)

### 13. Cookie/analytics consent + statistical-analytics objection
- Build a consent management tool. For privacy-preserving statistical analytics, provide a **simple, free "Turn off analytics"** control that actually stops collection, plus a persistent "Privacy and analytics settings" link.
- For any tracking/profiling/session-replay/advertising, an **equal-choice** banner (Accept / Reject equally prominent) that loads nothing optional before acceptance.
- Produce the **live cookie/SDK inventory** (name, provider, purpose, lifespan) for the Cookie Notice table, refreshed each release. (Cookie Notice 4–5.)

### 14. "Hide my name" (not "anonymous")
- Single control hiding the donor's name from the public page **and** the campaign owner; amount still shown; show the re-identification-risk explanation at point of selection; comments always display a name. (Donor 8; Privacy 10.)

### 15. Evidence status wording + private receipt handling
- Public status strings: **"Documents received; line-item amounts matched to budget; documents not authenticated"**, "evidence outstanding", "evidence overdue". No "Verified" badge anywhere.
- Receipts stored privately (never shown to donors); redaction reminders on upload; ability for admins to **redact/remove** unnecessary personal data; quarantine of unredacted uploads. (Refund 11; Privacy 11; Verification 7.)

### 16. Reporting + notice-and-action + appeals
- Structured reporting for content/conduct with categories (illegal content, IP, impersonation, privacy, safety); acknowledgement; triage with an **urgent route**; counter-notice; repeat-infringer handling; record retention; and an appeal path within 10 working days, routable to a **different team member** (recusal). (Community 7–8; ToS 20, 23.)

### 17. Data-subject rights + data-protection complaints workflow
- Tooling to action access/rectification/erasure/restriction/objection/portability/withdraw-consent, with the one-month clock and legal-hold exceptions.
- A **complaints route/form** that acknowledges within **30 days**, tracks investigation and records the outcome (new statutory duty). (Privacy 13.)

### 18. Suspension/removal with reasons, notice and appeal
- Separate **emergency** suspension from ordinary breach; record grounds; send notice + reasons unless prohibited; allow cure where remediable; scheduled review; appeal. Record what happens to campaigns, payouts and donor comms. (ToS 22–23.)

---

## P2 — Soon after launch / as volume grows

### 19. Exact-total edge cases & reconciliation
- Where the card category isn't known pre-auth, show method + maximum and reconcile without overcharging. Automated reconciliation reports for campaign net amounts vs charged totals. (ToS 16.5.)

### 20. Withhold-future-payouts enforcement
- Where the payment flow allows, hold not-yet-released payouts for a Recipient who refuses a required refund. **Depends on Stripe capability.** (Refund 7.1.)

### 21. Versioned campaign-page snapshots
- Snapshot the campaign page as shown at each donation, tied to the acceptance record, for dispute evidence. (Refund 5.2.)

### 22. Promotional-use opt-in flag
- Separate opt-in for using a user's campaign content in Dono marketing, withdrawable for future use. (ToS 19.2.)

### 23. Age-assurance signal
- Confirm whether Stripe reliably returns an age/DOB signal; if not, implement an alternative age-assurance step (ties to the Online Safety children's-access assessment). (Verification 4.3.)

---

## Cross-cutting note
At v2.1, several items above were blocked on the Stripe Connect configuration and decisions in `stripe-cookies-configuration-form-v2.1.md`. This dependency note is retained as history, not a current instruction.
