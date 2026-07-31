# Dono — Developer configuration form (Stripe, cookies, analytics, processors)

**Fill this in to unblock the final Terms.** These are the specific third-party configuration facts the T&C must mirror exactly. Wrong statements here are the highest-risk part of the suite (a false Stripe fee or negative-balance claim = misrepresentation; a false cookie table = a checkable PECR breach). Answer with the **actual configured value**, not the default or the intention. Where a setting isn't decided, mark **DECISION NEEDED** and flag the owner.

---

## Section 1 — Stripe Connect core allocation (unblocks Terms §15, Refund §8–9)

| # | Question | Answer |
|---|---|---|
| 1.1 | Charge type: **direct charges** on **Standard** connected accounts? Confirm or correct. | |
| 1.2 | Who is the **losses collector** (who bears unrecoverable negative balances) — the connected account or the platform? | |
| 1.3 | Who is the **fees collector** / who pays **Stripe dispute fees** (currently ~£20 per dispute)? | |
| 1.4 | Who **owns the dispute** (submits evidence) — connected account or platform? | |
| 1.5 | Is `application_fee_amount` used for Dono's fee? Confirm the exact fee expression in code. | |
| 1.6 | On a **charge refund**, is the **application fee** reversed automatically, or must we call `refund_application_fee` separately? | |
| 1.7 | Can the platform **refund the application fee** independently and **proportionally** (partial refunds)? | |
| 1.8 | Negative-balance **recovery** mechanism on Standard accounts — how does Stripe recover, and over what period? | |
| 1.9 | Can the platform **hold/withhold a payout** that hasn't been released for a specific connected account? Yes/No + how. | |
| 1.10 | Which **dashboard/API permissions** does the platform have over connected accounts (refunds, payouts, metadata)? | |

## Section 2 — Stripe pricing (unblocks Terms §16, Donor §6)

Confirm the **current** UK pricing so the fee table is accurate. Dono's model = Stripe's applicable fee **+ 3.5 percentage points**.

| Card / scenario | Current Stripe rate | Total charged (incl. +3.5pts) — confirm |
|---|---|---|
| Standard UK card | ____% + __p | |
| Premium UK card (commercial/corporate/rewards) | ____% + __p | |
| EEA card | ____% + __p | |
| International card (outside UK & EEA) | ____% + __p | |
| Currency conversion (FX) | +__% | |

2.1 Does Stripe apply the **+2% only when it performs the currency conversion** (not merely because the card is non-UK)? Confirm. ________
2.2 At checkout, is the **card category known before the final charge** so we can show the exact total? If not, what's the fallback (method + max)? ________
2.3 Do we settle **only in GBP**? Confirm. ________

## Section 3 — Merchant of Record / recipient reality

3.1 For the demo/first launch, are society campaign funds going to (tick): ☐ society-held Connected Account ☐ college/university account ☐ named student's personal Connected Account ☐ registered charity. ________
3.2 Can an **unincorporated society** actually open the required Stripe/bank account in practice? Evidence from the demo societies? ________
3.3 On a change of representative, can a **remaining balance be migrated** between connected accounts, or does it require a payout + external transfer? ________

## Section 4 — Cookies & storage (unblocks Cookie Notice §4)

List **every** cookie / local-storage / session-storage / pixel / SDK actually set (from a live browser inspection).

| Name | Set by (1st/3rd party) | Category (necessary / statistical analytics / other) | Purpose | Lifespan |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |

4.1 Consent management tool in use (or planned before launch): ________
4.2 What does the **authentication** provider set (session vs persistent tokens)? ________
4.3 What does **Stripe checkout** set during payment? ________

## Section 5 — Analytics (unblocks Cookie Notice §3.2, Privacy §4)

5.1 Is any analytics live today? ☐ None yet ☐ Yes → tool: ________
5.2 If yes, does it do only **aggregate statistical** measurement, or does it profile/track individuals / use session replay / cross-site tracking / advertising pixels? ________
5.3 Which of the approved analytics fields do we actually collect? (pages visited; referral source; campaign-creation funnel; donation-funnel completion; button clicks; session duration; device type; browser; approx country/region; anonymised journeys) ________
5.4 Can the analytics provider reuse the data for its **own** purposes? (Must be contractually prevented.) ________
5.5 Individual-level analytics retention before aggregation/deletion: ________ (target: ≤14 months)

## Section 6 — Processors & transfers (unblocks Privacy §8)

| Function | Provider | Country of storage | DPA signed? | Transfer safeguard (adequacy / IDTA / UK Addendum / n/a) |
|---|---|---|---|---|
| Payment processing | Stripe | Ireland / US | | |
| Cloud hosting | | | | |
| Database / backend | | | | |
| File storage (card images pre-deletion, receipts) | | | | |
| Authentication | | | | |
| Transactional email | | | | |
| Analytics | | | | |
| Error monitoring | | | | |
| Cookie consent management | | | | |

## Section 7 — Sign-off

7.1 Fee model, pricing table and exact-total behaviour verified against a live test charge? ☐ Yes — date/ref: ________
7.2 Refund + dispute + partial-refund + fee-refund flows tested end-to-end in Stripe test mode? ☐ Yes — date/ref: ________
7.3 Cookie table produced from a live inspection (not assumptions)? ☐ Yes — date: ________
7.4 All processors have signed DPAs and a mapped transfer safeguard? ☐ Yes
7.5 Completed by: ________  Date: ________
