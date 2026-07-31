# Dono — Terms engineering questionnaire (B–J)

**Date:** 31 Jul 2026  
**Source chat:** [Terms honesty pack / Identity / questionnaire](87035976-a5ac-4aa9-a8cf-f44c26961add)  
**Scope:** Live Expo + Convex codebase, including age gates, auth rate limits, analytics consent, audited student-card access, campaign/society student-card + Stripe Identity (always required for creators), and softened legal stubs.

> **Publication caution:** Full `dono-brain/terms/*` still carry `[TO BE CONFIRMED]` markers. In-app stubs are drafts. Do not publish counsel-uncleared claims.

| Headline | Status |
|---|---|
| Identity KYC (creators) | Yes |
| Analytics consent gate | Yes |
| Legal acceptance records | Partial |
| Campaign donation snapshots | No |

---

## B. Accounts & authentication (ToS §5, §6; Verification §4.3)

### B1. Passwords / credentials

Handled by **Convex Auth Password provider** (`@convex-dev/auth`). Passwords are hashed server-side with **Lucia Scrypt** (library default — Dono does not override `crypto`). Email OTP (Resend) and Admin Email OTP are separate credential paths. Password policy validated in `convex/auth/passwordPolicy.ts`.

### B2. MFA, sessions, lockout, tokens

| Item | Answer |
|---|---|
| **MFA** | Not built (no TOTP/WebAuthn). |
| **Session** | Convex Auth JWT ~1 hour + refresh ~30 days. Web: `sessionStorage` (fallback `localStorage`); native: SecureStore. First-party app storage — not classic HTTP cookies for our auth tokens. |
| **Lockout** | Built — `maxFailedAttempsPerHour: 8`; `FLOW_LIMITS` via `consumeAuthFlow` (sign-in/up/reset/OTP) with window + lockout (e.g. 8 / 10 min then 15 min lockout). Rate-limit, not fraud-AI. |
| **Also stored** | `dono:analyticsConsent` (localStorage/SecureStore); welcome-tour / donate guest-key prefs; society wizard slug in sessionStorage. |

### B3. Stripe age / DOB signal

- **Connect onboarding:** Does **not** return a reliable age/DOB signal used as our age gate.
- **Stripe Identity (creators):** Always required for campaign + society create. `verifiedName` / `verifiedDob` stored when Stripe returns `verified_outputs` — **not guaranteed** for every document/path. **Not used for age enforcement.**
- **Age check instead:** User-declared `profiles.dateOfBirth`, enforced with `isAtLeastAge` (18+) on create-campaign, create-society, donate (`assertDonateGates` / `DonateDobGate`), and onboarding profile.

### B4. Multiple accounts

One account per email (Convex Auth uniqueness). Oxford domain restriction (`ox.ac.uk`). **No** device fingerprinting, government-ID multi-account detection, or cross-email linking. Same person can create multiple accounts with different eligible emails.

---

## C. Payment-data handling (ToS §15.6; Privacy §5)

### C1. Checkout integration

- **Web:** Stripe Payment Element + `stripe.confirmPayment`.
- **Native:** Payment Sheet (`initPaymentSheet` / `presentPaymentSheet`).
- Server creates PaymentIntents / Subscriptions with `application_fee_amount` / `application_fee_percent` on Connect (**direct charges** via `stripeAccount`).
- Full PAN/CVC never touch Convex — only `client_secret` + Stripe IDs.
- **Not** Checkout Sessions.

### C2. Fields we store

`donations` table (and related) — **not** card PAN/CVC/expiry/brand/last4:

| Stored field | Purpose |
|---|---|
| `amount`, `currency`, `type` | Gift size / one-time vs recurring |
| `paymentStatus` | pending / succeeded / failed / refunded / partial |
| `stripePaymentIntentId`, `stripeChargeId`, `stripeInvoiceId` | Stripe refs |
| `stripeConnectedAccountId` | Merchant Connected Account |
| `grossAmountMinor`, `applicationFeeAmountMinor`, `applicationFeeRefundedMinor`, `refundedAmountMinor`, `intendedCampaignAmountMinor`, `estimatedStripeFeeMinor`, `coverFees` | Fee envelope accounting |
| `disputeStatus` | open / won / lost |
| `donorEmail`, `userId`, `isAnonymous` | Donor identity / display |
| `ageAttested`, `legalAcceptedAt`, `emailUpdatesOptIn*` | Gates / marketing opt-in |
| `matchedAmountPounds`, `matchWindowId` | Match windows |
| `societySubscription*` ids | Society recurring fan-out |

Stripe Identity stores verification session id, status, `verifiedName`, `verifiedDob`, last error codes — not card data.

### C3. Card data in logs?

No path sends PAN/CVC to our backend. PostHog captures product events (e.g. `donation_completed` with amount/campaign metadata), not card fields. No dedicated error-monitoring product (Sentry etc.) in-repo. Stripe Dashboard holds card details under Stripe’s PCI scope.

---

## D. Acceptance records & versioning (ToS §2.2, §1.5)

### D1. Acceptance record today

`legalAcceptances` stores: `userId` or `guestKey`, `documentId`, **version string**, `context` (signup / create_campaign / create_society / donate), `acceptedAt`.

**Not stored:** role, campaign id, full wording shown, IP, or UI screenshot. Versions live in `LEGAL_DOCUMENT_VERSIONS` code constants.

### D2. Immutable historical document archive

**NOT BUILT.** Only current stub/body in `lib/legal/content.ts` + version id. Acceptance points at version string; old bodies are not archived immutably when versions bump.

### D3. Durable copy email/download

**NOT BUILT.** Users can open current stubs in-app; no email/PDF of the exact accepted text at acceptance time.

---

## E. Campaign, evidence & closure (ToS §10; Refund §11)

### E1. Versioned snapshot at donation

**NOT BUILT.** Donations link to `campaignId` only. Later edits overwrite live campaign fields. Tracked as TODO in `dono-brain`.

### E2. Receipts / evidence access

- Backend: Convex `_storage` + `campaignEvidence` (`convex/evidence.ts`) — creator / responsible individual / society leader.
- Student cards: admin via `getIdDocumentUrlForAdmin` (**audited**).
- **No** admin in-product redact/crop of uploaded files; evidence APIs have little/no frontend wiring.

### E3. Redaction check on upload

**None automatic** — uploader responsibility / manual admin review only.

### E4. Closure Statement

**NOT BUILT** as structured form with deadlines / 30-day deemed-acceptance. Material-change `evidenceNote` is free text. Evidence `dueAt` = expenditure + 14 days exists in backend only. Closure/evidence rules still `[TO BE CONFIRMED]` in student campaign terms.

---

## F. Refunds, disputes & payouts (Refund §6–9; ToS §15)

### F1. Admin vs owner refunds — **code ≠ “owner-only” Terms**

Code lets Dono admin approve a `refundRequest`, then `processApprovedRefund` calls `stripe.refunds.create` with `stripeAccount` = Connected Account. That is **platform-initiated refund on the owner’s Connected Account** — not “owner only in their Stripe Dashboard.” Soften Terms or change code before publication. (Little/no admin refund UI under `app/` — backend exists.)

### F2. Application fee refund

**BUILT (webhook-driven):** On `charge.refunded` / dispute lost, `refundApplicationFeeDelta` uses `stripe.applicationFees.createRefund` for the proportional fee delta. Tracks `applicationFeeRefundedMinor` on donations.

### F3. Withhold payout

**NOT BUILT.** No per-recipient payout hold / transfer freeze product control.

### F4. Chargeback / dispute webhooks

`charge.dispute.created` → `markDonationDisputeOpened`; `charge.dispute.closed` → won/lost + fee refund if lost. **No** automated notify-owner/admin within card-scheme deadline workflow; status is stored for ops to notice.

---

## G. Data retention & deletion (Privacy §6, §7)

### G1. Student-card auto-delete

**NOT BUILT.** Cards persist on society/campaign until manually removed. No 30-day failed/abandoned cleanup cron. Privacy draft table is aspirational here.

### G2. Deletion → backups

Account deletion = profile anonymisation only (`requestAccountDeletion`). Backup cycle / propagation to Convex backups **not documented or product-controlled** (`PRIVACY IMPLEMENTATION REQUIRED`).

### G3. Legal hold

**NOT BUILT.**

### G4. Retention table enforceability

| Privacy table row | Status |
|---|---|
| Student card image (6 months post-check) | Aspirational — no job |
| Extracted card details / account data | Aspirational |
| Campaign snapshots (6 years) | Aspirational — snapshots missing |
| Receipts / evidence (6 years) | PARTIAL — files may remain; no schedule |
| Refund/dispute/investigation (6 years) | PARTIAL — rows kept; no purge job |
| Acceptance records (6 years) | PARTIAL — rows kept; no purge job |
| Moderation logs | PARTIAL — `adminAuditLog` / notes kept |
| Consent records (6 years) | PARTIAL — local consent flag only |
| Backups | Unknown / not product-owned |

---

## H. Cookies, analytics & consent (Cookie Notice §4–5)

> **H1 note:** From code (not a live clean-browser capture). Exact third-party cookie names/expiries from Stripe/PostHog vary by environment. Re-run a clean-browser audit before Cookie Notice publication.

| Name / item | Set by | Purpose | Party | Persistence |
|---|---|---|---|---|
| Convex Auth JWT + refresh | Convex Auth client | Session | 1st | sessionStorage / SecureStore; JWT ~1h, refresh ~30d |
| `dono:analyticsConsent` | Dono | Analytics grant/deny | 1st | localStorage / SecureStore |
| Welcome / guest donate keys | Dono | UX prefs / guest donate | 1st | local/session storage |
| Society wizard slug | Dono | Resume create-society | 1st | sessionStorage (web) |
| PostHog cookies/storage | PostHog EU | Product analytics | 3rd | Only if consent granted |
| Stripe checkout / Identity | Stripe | Payments + KYC | 3rd | During/after checkout & Identity |

### H2. Consent management

Built in-house (not OneTrust/Cookiebot): `AnalyticsConsentBanner` before PostHog mount. Essential auth/storage always on.

### H3. Turn off analytics

**Yes for reject-at-banner:** SDK not mounted when denied. No persistent in-settings “turn off” toggle after grant without clearing storage / reinstall; grant persists until cleared.

### H4. Mobile on-device

Same Expo app: SecureStore for auth + consent; Stripe RN SDK; PostHog RN only if consent granted (`enableSessionReplay: false`; touch autocapture limited). Image picker temp URIs for uploads.

---

## I. Security & incident response (Privacy §14)

| Control | True today? |
|---|---|
| Encryption in transit (HTTPS/WSS to Convex/Stripe/Vercel) | Yes |
| Encryption at rest | Provider-dependent (Convex/Stripe); we don’t manage keys |
| Role-based access (admin / leader / verified user checks server-side) | Yes |
| Admin-access logging on identity/student-card data | Yes — `campaign.viewIdDocument` / society equivalent via `logAdminAction` |

### I2. Incident-response procedure

**No** written, tested IR runbook or named duty person in-repo.

### I3. Breach detect / 72h assess

No dedicated breach-detection product. Would rely on provider notices (Convex/Stripe/Vercel/Resend), admin observation, user reports. 72h assessment process not operationalised in product.

---

## J. What is actually built vs planned

### J1. Operational readiness

| Capability | Status | Note |
|---|---|---|
| Reporting tools | PARTIAL | In-app contentReports for campaigns/comments; admin resolve APIs with little UI. No full abuse suite. |
| Moderation queue + audit log | PARTIAL | Admin pending queues for campaigns/societies/communities/material changes. `adminAuditLog` for key actions incl. ID-doc views. Not a full SIEM / no audit viewer UI. |
| Appeals routing | NOT BUILT | Refund appeal deadlines in policy copy only; no dedicated appeals workflow UI. |
| Reminder emails | PARTIAL | Campaign update emails to opted-in donors; auth OTP/reset via Resend. No evidence/closure deadline reminder cron. |
| Evidence-status display | PARTIAL / NOT BUILT in UI | Backend `dueAt` + updates; no structured evidence ledger UI. |
| Institution contact channel | NOT BUILT | Email contact only (`dono.outreach@gmail.com`). No institution portal. |
| Consent banner | BUILT | `AnalyticsConsentBanner`; PostHog mounts only when consent === granted. |
| DSAR / complaints handling | NOT BUILT | Manual email only. No in-product DSAR intake or export. |
| Account closure / offboarding | PARTIAL | `requestAccountDeletion` anonymises profile fields; does not wipe donations/acceptances/investigations. |

### J2. What Terms can / cannot deliver

**Can deliver today**

- Oxford email auth + password/OTP
- 18+ DOB gate on create/donate
- Creator student-card + Stripe Identity + admin ID audit
- Connect donations via Payment Element/Sheet
- Platform fee envelope + Connect application fees
- Admin-driven refund pipeline + proportional fee refund on webhook
- Legal accept version stamps (not full archive)
- Analytics consent-gated PostHog
- Moderation queues for campaigns/societies

**Soften / remove before publication**

- Owner-only refunds (admin API refunds exist)
- Campaign wording snapshots at donation
- Immutable legal archives + durable accepted copy
- Student-card auto-delete / retention schedules
- Legal hold; DSAR tooling; IR playbook
- Payout holds; dispute deadline notifications
- Closure statement + deemed-acceptance
- Evidence auto-redaction; appeals routing
- “Identity always returns DOB” / Connect as age proof
- Any remaining `[TO BE CONFIRMED]` markers in `dono-brain`

---

## Sources

- Repo: `convex/`, `app/`, `lib/legal/`, `components/`, `docs/stripe-setup.md`, `dono-brain/terms/*`
- Audits in chat: auth/payments/legal + refunds/retention/ops subagents
- Canvas: `terms-engineering-questionnaire.canvas.tsx`

*Not legal advice.*
