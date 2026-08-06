# Dono fee and processing-cost reference (internal working note)

**Version:** 2.3
**Version date:** 6 August 2026
**Document type:** **Internal working note — NOT CONTRACTUAL, NOT FOR PUBLICATION**
**Owner:** Amrit Kaur Rooprai

> **Why this document exists.** The hard-coded processing-cost table has been **removed from the Terms of Service, the Donor Terms and every other public document**, because third-party pricing changes and a stale table in a contract makes the contract false. This note keeps a dated working copy for internal modelling only. **Nothing here is a contractual term, and nothing here may be copied into a public document.**

---

## 1. Dono's fee — the only contractual figure

**Dono charges a fee of 5% + 20p.**

- Flat. **The same regardless of card, payment method or country.** Payment-method-neutral by design, so it is not a surcharge within reg 6A of the Consumer Rights (Payment Surcharges) Regulations 2012.
- Collected as a Stripe `application_fee_amount` on a direct charge. It is Dono's revenue.
- The Campaign Owner is Dono's customer in every case.
- A Donor may optionally cover **this fee and only this fee** ("fee cover"). Fee cover never includes Stripe's processing cost.
- Dono is not VAT registered. **No figure anywhere includes or is described as VAT.**
- Changeable prospectively only: future Campaigns and future Donations. Live Campaigns are grandfathered.

## 2. Stripe's processing cost — indicative only, borne by the Connected Account

> **Indicative rates as understood on 6 August 2026. Not verified against Stripe's live pricing page on that date. Not contractual. Re-check before relying on any figure. Owner to review quarterly.**

| Payment method | Indicative Stripe cost | Who pays it |
|---|---|---|
| UK standard debit and credit cards | ~1.5% + 20p | Connected Account |
| UK premium / commercial cards | ~1.9%–2.8% + 20p — **materially uncertain; the legal review dated 31 July 2026 put the current published figure at 1.9% + 20p, against 2.8% previously assumed** | Connected Account |
| EEA cards | ~2.5% + 20p (+ ~2% if currency conversion) | Connected Account |
| International (non-UK, non-EEA) cards | ~3.15%–3.25% + 20p (+ ~2% if currency conversion) — **the review put the current published figure at 3.25% + 20p** | Connected Account |
| Link / saved-details checkout | Same as the underlying card | Connected Account |
| Klarna / BNPL — **not enabled** | from ~4.99% + 35p | n/a |
| Dispute fee | ~£20 per dispute (UK) | Connected Account |

2.1 **Because Dono takes a flat application fee on a direct charge, Stripe's cost variability does not affect Dono's margin at all.** It affects the amount reaching the campaign. **There is therefore no cross-subsidy question**: domestic donations do not subsidise international ones, because Dono is not absorbing the processing cost in either case.

2.2 **Superseded pricing models — recorded so nobody reinstates them:**

| Model | Status | Why abandoned |
|---|---|---|
| "Stripe's applicable fee + 3.5 percentage points" | **Superseded 6 August 2026** | Card-dependent, so it risked being a prohibited surcharge (reg 6A); the total could not be shown exactly before confirmation; and the implemented code charged 5% + 20p anyway, so the contract and the product disagreed |
| Per-method fee table (5.0% / 6.3% / 6.0% / 6.65% / +3.5% / 8.49%) | **Never adopted** | Same surcharge problem, worse transparency |
| BNPL / Klarna at 8.49% + 35p | **Not enabled** | Not offered on the Platform |

## 3. Worked examples — internal modelling only

Assuming a £20 donation, UK standard card, fee cover **not** selected:

| Element | Amount |
|---|---|
| Donor pays | £20.00 |
| Dono fee (5% + 20p) | £1.20 |
| Stripe cost (~1.5% + 20p on £20.00) | ~£0.50 |
| **Reaches the campaign** | **~£18.30** |

Same donation with **fee cover** selected:

| Element | Amount |
|---|---|
| Donor pays (£20.00 + £1.20) | £21.20 |
| Dono fee | £1.20 |
| Stripe cost (~1.5% + 20p on £21.20) | ~£0.52 |
| **Reaches the campaign** | **~£19.48** |

3.1 **Note carefully.** Even with fee cover selected, **the full £20 does not reach the campaign**, because Stripe's cost still falls on the Connected Account. **Public wording must therefore never say that fee cover makes "the full amount" or "your intended amount" reach the campaign.** The v2.3 documents say only that fee cover offsets Dono's fee. Any marketing copy that says otherwise is wrong and must be corrected.

## 4. Rules that must survive any future change

1. Dono's fee must remain **payment-method-neutral**, or the surcharge analysis has to be redone.
2. No processing-cost table may be reintroduced into a contractual document.
3. Checkout must show an exact total, and the Donor must never be charged more than the total confirmed.
4. Nothing may be described as VAT while Dono is unregistered.
5. Fee changes are prospective only.
6. Dono's application fee must be recorded **separately** from campaign money and from Stripe's processing costs, in the product and in the accounts.

---

## Approval and version control

| Field | Entry |
|---|---|
| Document | Dono fee and processing-cost reference |
| Version | 2.3 |
| Version date | 6 August 2026 |
| Status | **Internal working note. Not contractual. Not for publication** |
| Accountable owner | Amrit Kaur Rooprai |
| Next scheduled review | Quarterly — 6 November 2026 — and before any fee change |
| Supersedes | The hard-coded fee tables previously in `terms_v2.2` ToS 16 and Donor Terms 6 |
