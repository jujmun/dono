# Dono — Developer configuration form (Stripe, cookies, analytics, processors)

> **HISTORICAL EVIDENCE SNAPSHOT — NOT A BUILD LIST.** Current requirements are consolidated in [`legal-launch/`](legal-launch/README.md). Where this 31 July snapshot differs from `TRUTH.md` or the central checklist—including fee allocation or card-dependent estimates—the newer sources govern.

**Date:** 31 Jul 2026  
**Source:** Live Expo + Convex codebase, Stripe docs, [stripe.com/gb/pricing](https://stripe.com/gb/pricing) (fetched 31 Jul 2026).  
**Related:** [terms-engineering-questionnaire-answers.md](./terms-engineering-questionnaire-answers.md)

> **Publication caution:** Answers below are engineering facts for counsel. Items marked **DECISION NEEDED** are not safe to publish as settled Terms claims. Cookie table is from **code inventory**, not a live clean-browser capture. DPAs / transfer safeguards are not evidenced in-repo.

**Fee model (locked):** Dono takes a fixed **5% + 20p fee envelope** on donations (`calculateFeeEnvelopeMinor`). Estimated Stripe UK standard card fee (**1.5% + 20p**) is allocated from that envelope first; Dono’s Connect `application_fee_amount` is the **residual**. This is **not** “Stripe’s applicable fee + 3.5 percentage points” for every card type.

---

## Section 1 — Stripe Connect core allocation (unblocks Terms §15, Refund §8–9)

| # | Question | Answer |
|---|---|---|
| 1.1 | Charge type: **direct charges** on **Standard** connected accounts? Confirm or correct. | **Confirmed (with nuance).** Campaign one-time and monthly donations use **direct charges** on connected merchant accounts (`stripeAccount` on PaymentIntent create). Accounts are created via Accounts v2 with `dashboard: "full"` (Standard-equivalent full Dashboard), not Express/Custom. **Exception:** community-fund gifts are charged on the **platform** account (platform is MoR for that path). |
| 1.2 | Who is the **losses collector** (who bears unrecoverable negative balances) — the connected account or the platform? | **Stripe** (`losses_collector: "stripe"` in `convex/lib/stripeConnectMerchant.ts`). The connected account is still debited for refunds/disputes first; Stripe (not Dono) absorbs **unrecoverable** negatives after recovery attempts. |
| 1.3 | Who is the **fees collector** / who pays **Stripe dispute fees** (currently ~£20 per dispute)? | **Connected account.** `fees_collector: "stripe"` means Stripe bills the connected account for processing and dispute fees. UK published dispute received / countered fee: **£20**. |
| 1.4 | Who **owns the dispute** (submits evidence) — connected account or platform? | **Connected account owns the Stripe dispute** (full Dashboard). Product intent is that Dono may **assist** with evidence. Code today only records `charge.dispute.created` / `charge.dispute.closed` — **no** dispute-evidence submission API. **DECISION NEEDED (ops/legal):** who is contractually obliged to submit evidence, and by when. |
| 1.5 | Is `application_fee_amount` used for Dono's fee? Confirm the exact fee expression in code. | **Yes.** One-time: `application_fee_amount = max(0, feeEnvelope − min(estimateStripeUK, envelope))` where `feeEnvelope = round(amountMinor × 0.05) + 20` and `estimateStripeUK = round(amountMinor × 0.015) + 20`. See `convex/lib/platformFee.ts`. Monthly subscriptions currently set `application_fee_percent: PLATFORM_FEE_RATE * 100` (raw **5%**) — residual split is **not** applied on that path (**inconsistency to flag**). |
| 1.6 | On a **charge refund**, is the **application fee** reversed automatically, or must we call `refund_application_fee` separately? | **Must reverse separately.** `stripe.refunds.create` does **not** set `refund_application_fee`. On `charge.refunded` / dispute lost, webhook calls `stripe.applicationFees.createRefund` for the proportional delta (`convex/stripeWebhook.ts`). |
| 1.7 | Can the platform **refund the application fee** independently and **proportionally** (partial refunds)? | **Yes.** `calculateApplicationFeeRefundMinor` scales by refunded gross / original gross; `applicationFees.createRefund({ amount })` applies the delta. |
| 1.8 | Negative-balance **recovery** mechanism on Standard accounts — how does Stripe recover, and over what period? | Stripe first offsets negatives by collecting from the connected account’s **external bank account**. With `losses_collector: "stripe"`, Stripe covers what remains unrecoverable. Platform **cannot** pause payouts under this liability model. Exact recovery cadence is Stripe’s process (not coded). |
| 1.9 | Can the platform **hold/withhold a payout** that hasn't been released for a specific connected account? Yes/No + how. | **No.** Not implemented; payments architecture forbids payout holds (FCA perimeter). With Stripe as losses collector, the platform **cannot** pause connected-account payouts via Connect controls. |
| 1.10 | Which **dashboard/API permissions** does the platform have over connected accounts (refunds, payouts, metadata)? | Platform can: create PaymentIntents/subscriptions on connected accounts; set `application_fee_*` and metadata; refund via API with `stripeAccount`; refund application fees; refresh Connect status / create onboarding links. Connected accounts use the **full Stripe Dashboard** (society leaders sign in with the onboarding email). Platform **cannot** hold payouts or directly debit connected balances under current responsibilities. |

**Sources:** `convex/lib/stripeConnectMerchant.ts`, `convex/lib/platformFee.ts`, `convex/stripe.ts`, `convex/stripeWebhook.ts`, `docs/stripe-setup.md`, [Stripe Connect risk management](https://docs.stripe.com/connect/risk-management).

---

## Section 2 — Stripe pricing (unblocks Terms §16, Donor §6)

Confirm the **current** UK pricing so the fee table is accurate.  
**Dono’s model = fixed 5% + 20p fee envelope** (Stripe share estimated first; Dono residual via application fee).

| Card / scenario | Current Stripe rate ([stripe.com/gb/pricing](https://stripe.com/gb/pricing), Jul 2026) | What code charges / shows |
|---|---|---|
| Standard UK card | **1.5% + 20p** | Envelope **5% + 20p**; estimate = 1.5% + 20p; Dono residual ≈ **3.5%** (fixed 20p cancels) |
| Premium UK card (commercial/corporate/rewards) | **2.8% + 20p** | Still envelope **5% + 20p**; estimate still 1.5% + 20p — **under-covers** vs actual Stripe premium fee |
| EEA card | **2.5% + 20p** | Same — estimate unchanged |
| International card (outside UK & EEA) | **3.15% + 20p** | Same |
| Currency conversion (FX) | **+2%** when Stripe converts | **Not modelled** in fee math |

| # | Question | Answer |
|---|---|---|
| 2.1 | Does Stripe apply the **+2% only when it performs the currency conversion** (not merely because the card is non-UK)? | **Yes** — published as “+2% if currency conversion is required.” |
| 2.2 | At checkout, is the **card category known before the final charge** so we can show the exact total? If not, what's the fallback (method + max)? | **No.** Fallback: always estimate **UK standard 1.5% + 20p**. Donor total / cover-fees add-on is the **5% + 20p envelope**, not a true max-by-card-type. Actual Stripe fees settle later on the connected account. |
| 2.3 | Do we settle **only in GBP**? | **Yes** — `currency: "gbp"` on campaign PaymentIntents. |

**Disclosure note for Terms:** Checkout shows an **estimate** based on UK standard cards. Premium, EEA, international, and FX fees may be higher than the estimate; those costs fall on the Connected Account under `fees_collector: "stripe"`, and may reduce Dono’s residual within the fixed envelope (they are not added on top for the donor unless cover-fees / envelope rules change).

---

## Section 3 — Merchant of Record / recipient reality

| # | Question | Answer |
|---|---|---|
| 3.1 | For the demo/first launch, are society campaign funds going to: society-held Connected Account / college/university account / named student's personal Connected Account / registered charity? | **Society-held Connected Account** — community-scoped `stripeConnectAccounts` keyed by `communitySlug`; society leaders share one merchant account. Campaign donations go to that account as MoR. Not college/university or charity by default. **Exception:** community-fund path settles on the **platform** account (platform MoR). |
| 3.2 | Can an **unincorporated society** actually open the required Stripe/bank account in practice? Evidence from the demo societies? | **DECISION NEEDED / unproven in repo.** Terms already flag that many unincorporated societies cannot open a business bank account / Connected Account. No demo-society onboarding success evidence in code. **Owner:** founder + demo society leads. |
| 3.3 | On a change of representative, can a **remaining balance be migrated** between connected accounts, or does it require a payout + external transfer? | **No in-product balance migration.** Change of representative = Stripe Dashboard succession on the **same** connected account where Stripe allows it; otherwise **payout + external transfer**. Creating a new Connect account does not auto-move balances. |

---

## Section 4 — Cookies & storage (unblocks Cookie Notice §4)

List from **code inventory** (not a live browser inspection). Exact third-party cookie names/expiries from Stripe/PostHog vary by environment — re-run a clean-browser audit before Cookie Notice publication.

| Name | Set by (1st/3rd party) | Category | Purpose | Lifespan |
|---|---|---|---|---|
| Convex Auth JWT + refresh tokens | 1st (Convex Auth) | Necessary | Session | Web: `sessionStorage` (fallback `localStorage`); native: SecureStore. ~1h JWT / ~30d refresh (Convex Auth defaults; not overridden in repo) |
| `dono:analyticsConsent` | 1st (Dono) | Necessary (consent record) / gates analytics | Accept or reject analytics | `localStorage` / SecureStore — until cleared |
| `dono:welcomeTourComplete:*` / `dono:pendingWelcomeTour:*` | 1st (Dono) | Necessary (UX preference) | Welcome tour state | `localStorage` / SecureStore |
| `dono_donate_guest_key` | 1st (Dono) | Necessary (guest donate linkage) | Guest legal acceptance / donate | `localStorage` |
| `dono:create-society:slug` | 1st (Dono) | Necessary (wizard resume) | Create-society flow | `sessionStorage` (web) |
| PostHog cookies / SDK storage | 3rd (PostHog EU) | Statistical analytics | Product analytics | **Only if consent granted**; SDK not mounted if rejected |
| Stripe.js / Payment Element / Identity | 3rd (Stripe) | Necessary (payment / KYC) | Checkout + Identity verification | During/after payment & verification (Stripe-controlled) |

| # | Question | Answer |
|---|---|---|
| 4.1 | Consent management tool in use (or planned before launch) | **In-house** `AnalyticsConsentBanner` — not OneTrust/Cookiebot. Active when `EXPO_PUBLIC_POSTHOG_API_KEY` is set. |
| 4.2 | What does the **authentication** provider set (session vs persistent tokens)? | Convex Auth: short-lived JWT + longer refresh. Web prefers **sessionStorage** (tab-scoped); native SecureStore. First-party app storage — not classic HTTP cookies for our auth tokens. |
| 4.3 | What does **Stripe checkout** set during payment? | Stripe Payment Element / Payment Sheet / Identity may set Stripe cookies or SDK storage; necessary for donations and KYC. Integration uses Payment Element / Payment Sheet, **not** Checkout Sessions. |

---

## Section 5 — Analytics (unblocks Cookie Notice §3.2, Privacy §4)

| # | Question | Answer |
|---|---|---|
| 5.1 | Is any analytics live today? | **Yes if API key configured** — **PostHog EU** (`EXPO_PUBLIC_POSTHOG_HOST` defaults to `https://eu.i.posthog.com`). Mounted only after consent is granted. |
| 5.2 | If yes, does it do only **aggregate statistical** measurement, or does it profile/track individuals / use session replay / cross-site tracking / advertising pixels? | Product analytics + **touch autocapture** (limited props: `testID` only). **`enableSessionReplay: false`**. No advertising pixels in-repo. Not purely aggregate — events can be user-linked when identified. |
| 5.3 | Which of the approved analytics fields do we actually collect? | When consented: pages/screens (`posthog.screen`); campaign_viewed / liked / followed / shared; donation funnel (started, amount_selected, completed); society follow / subscription; auth signed_in / signed_up; campaign-creation funnel captures; button/touch autocapture. Device / browser / approx geo are PostHog defaults unless disabled in the PostHog project — **DECISION NEEDED: confirm PostHog project settings**. |
| 5.4 | Can the analytics provider reuse the data for its **own** purposes? (Must be contractually prevented.) | **DECISION NEEDED (owner: founder/legal).** Confirm PostHog DPA / customer agreement. Not verifiable from code. |
| 5.5 | Individual-level analytics retention before aggregation/deletion | **DECISION NEEDED.** Not set in code; configure in PostHog (target ≤14 months). |

---

## Section 6 — Processors & transfers (unblocks Privacy §8)

| Function | Provider | Country of storage | DPA signed? | Transfer safeguard (adequacy / IDTA / UK Addendum / n/a) |
|---|---|---|---|---|
| Payment processing | Stripe (independent controller for payment data) | Stripe Ireland / US (Stripe’s infra) | **DECISION NEEDED** | **DECISION NEEDED** (Stripe SCCs / UK Addendum) |
| Cloud hosting (web) | Vercel (`joindono.com`) | **DECISION NEEDED** (Vercel project region) | **DECISION NEEDED** | **DECISION NEEDED** |
| Database / backend | Convex | **eu-west-1** (dev: `*.eu-west-1.convex.site`) | **DECISION NEEDED** | **DECISION NEEDED** |
| File storage (card images, campaign media, evidence) | Convex `_storage` | Same Convex deployment region | with Convex DPA | same |
| Authentication | Convex Auth + Resend (OTP / password emails) | Convex + Resend | **DECISION NEEDED** each | **DECISION NEEDED** |
| Transactional email | Resend | Resend (typically US — confirm) | **DECISION NEEDED** | **DECISION NEEDED** |
| Analytics | PostHog Cloud EU | EU (`eu.i.posthog.com`) | **DECISION NEEDED** | n/a if EU processing confirmed |
| Error monitoring | None in-repo (no Sentry etc.) | — | n/a | n/a |
| Cookie consent management | In-house (no CMP vendor) | Client device only | n/a | n/a |

---

## Section 7 — Sign-off

| # | Question | Answer |
|---|---|---|
| 7.1 | Fee model, pricing table and exact-total behaviour verified against a live test charge? | ☐ **No** in this review — fee envelope confirmed in code; not verified against a live Dashboard fee line. Date/ref: ________ |
| 7.2 | Refund + dispute + partial-refund + fee-refund flows tested end-to-end in Stripe test mode? | ☐ **No** — paths exist in code; end-to-end test-mode proof not evidenced here. Date/ref: ________ |
| 7.3 | Cookie table produced from a live inspection (not assumptions)? | ☐ **No** — from code inventory only. Date: ________ |
| 7.4 | All processors have signed DPAs and a mapped transfer safeguard? | ☐ **No** — not evidenced in repo. |
| 7.5 | Completed by | Engineering code audit · **31 Jul 2026** · **Not legal sign-off** |

---

## Owners for DECISION NEEDED items

| Topic | Owner |
|---|---|
| Terms fee table wording (must match 5% + 20p envelope + estimate disclosure) | Product / founder |
| Dispute evidence duty & deadlines | Founder + counsel |
| Unincorporated society bank / Stripe feasibility | Founder + demo societies |
| Live cookie audit | Engineering |
| PostHog DPA, retention, field allowlist | Founder / legal |
| All processor DPAs + transfer map | Founder / legal |
| Live charge + refund / dispute test refs | Engineering |

---

## Key source files

- `convex/lib/stripeConnectMerchant.ts` — Connect responsibilities
- `convex/lib/platformFee.ts` / `lib/platform-fee.ts` — 5% + 20p envelope
- `convex/stripe.ts` — PaymentIntents, refunds, subscriptions
- `convex/stripeWebhook.ts` — refund / dispute / application-fee refund
- `docs/stripe-setup.md` — architecture overview
- `app/_layout.tsx` — PostHog consent gate
- `lib/analytics-consent.ts`, `lib/auth-storage.ts`, `lib/welcome-tour-storage.ts`
- `lib/legal/content.ts` — cookie stub (draft)

*Not legal advice.*
