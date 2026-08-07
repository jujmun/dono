# Dono Geographic Scope and International Donations Risk Assessment

**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval (see approval block)
**Document type:** Internal risk assessment
**Owner:** Amrit Kaur Rooprai
**Resolves review finding:** F62
**Decision recorded:** International donors remain permitted during beta. Dono does **not** restrict donations to UK-issued cards or UK donors. Student eligibility follows current enrolment rather than physical presence in the UK; a Connected Account holder must have a valid UK address and satisfy the Payment Provider's UK onboarding requirements.

---

## 1. Current geographic scope

| Role | Scope | Enforced by |
|---|---|---|
| **Campaign Owner** | Currently enrolled students of a Recognised Institution, whether in or outside the UK. At launch, the University of Oxford only. A creator account requires the applicable University address; the Connected Account holder must provide a valid UK address and satisfy the Payment Provider's UK onboarding requirements | University-email verification; Stripe Connect onboarding; campaign review |
| **Responsible Representative** | As above | As above |
| **Recipient / Connected Account** | UK-established Stripe connected accounts | Stripe onboarding |
| **Donor** | Anywhere Stripe supports the payment and sanctions and other legal restrictions permit | Stripe; Dono's Unsupported Countries List |
| **Currency** | GBP only, charged and settled | Product configuration |
| **Browsing** | Open, worldwide | — |

1.1 **How this must be described publicly.** "Campaign creators must be currently enrolled at a recognised UK institution and must satisfy the Payment Provider's UK address and onboarding requirements; they need not be physically present in the UK. Donors may be located internationally where Stripe supports the payment and applicable sanctions and legal restrictions permit." **No document may imply that Dono has assessed, supports or targets any particular overseas jurisdiction.**

## 2. Risks and assessment

| # | Risk | Analysis | Rating | Mitigation |
|---|---|---|---|---|
| G1 | **Sanctions** — a donation from a designated person or a sanctioned jurisdiction | UK sanctions bind Dono directly. Stripe screens payments, but Dono's obligation is its own | **Medium** | Unsupported Countries List; payments from listed countries declined; screening triggers in the Financial Crime and Sanctions Policy; OFSI reporting route |
| G2 | **Foreign consumer law** — an overseas donor asserting local consumer or distance-selling rights | Dono does not direct activity at any foreign market: no local-language pages, no local currency, no local marketing, no local domain. Under retained Rome I / Brussels-recast style analysis, mandatory local consumer protection can still apply to a consumer domiciled abroad where the trader directs activity there. Dono's exposure is low but not nil, and it rises if Dono ever markets abroad | **Low–Medium** | Terms state English law and preserve mandatory local consumer rights; no overseas marketing; scope wording in clause 1.1; review before any active expansion |
| G3 | **Foreign data-protection law** | Dono processes UK-based; an overseas donor's data is processed under UK GDPR. EU GDPR could apply extraterritorially if Dono targeted the EU — it does not | **Low** | No targeting; monitor if marketing changes |
| G4 | **Payment cost and FX** | Non-UK cards cost the Connected Account more, and the donor's issuer may add a conversion charge | **Low** | Dono's fee is flat and card-neutral, so no surcharge risk; Stripe's cost is borne by the Connected Account and disclosed; issuer charges are disclosed as outside Dono's control |
| G5 | **Fraud and card testing from overseas** | Cross-border card fraud is more common | **Medium** | Stripe Radar; chargeback economics sit with the Connected Account; screening triggers; suspension workflow |
| G6 | **Chargeback exposure** | Overseas issuers may apply different windows and standards | **Low–Medium** | The Connected Account owns the dispute; Dono provides evidence and deadline alerts |
| G7 | **Support and language** | Dono operates in English, in UK hours, through one inbox | **Low** | Stated plainly; no promise of local-language or out-of-hours support |
| G8 | **Tax** | Overseas donations do not change Dono's position: it is not VAT registered, and a freely given contribution for which nothing is received is generally outside the scope of VAT | **Low** | Monitored against the rolling turnover threshold; place-of-supply work deferred until registration is in view |

## 3. Why international donations remain proportionate for beta

3.1 **The use case requires it.** Student campaigns are shared with family, friends and alumni, a meaningful proportion of whom are abroad. Blocking non-UK cards would defeat a core reason students use the Platform.

3.2 **The structural risk is low.** Values are small; the currency is single; targets are capped; Dono holds no funds; Stripe is the regulated payment provider and performs screening and fraud control; and the Connected Account, not Dono, bears chargeback loss.

3.3 **The residual exposure is manageable and documented.** The material risks (G1, G5) are addressed by the Financial Crime and Sanctions Policy, which is proportionate rather than enterprise-scale.

3.4 **The alternative is disproportionate.** Geoblocking or a country allowlist would require ongoing maintenance, would produce false negatives for UK residents travelling, and would deliver little additional risk reduction beyond what Stripe already provides.

## 4. Mitigations currently in place, and those required

| Mitigation | Status |
|---|---|
| Stripe sanctions and fraud screening on every payment | In place (Stripe) |
| GBP-only pricing and settlement | In place |
| Campaign Owners restricted to currently enrolled students at one recognised UK institution; Connected Account holders require a UK address and UK onboarding eligibility | Required operating rule |
| Accurate public wording on geographic scope | **Required — v2.3 documents** |
| Internal Unsupported Countries List, reviewed quarterly | **Required before launch** |
| Automatic decline of payments from listed countries | **Required before launch** |
| Screening triggers configured | **Required before launch** |
| No overseas marketing, and no local-language or local-currency pages | Policy — must be maintained |
| Logging of declined attempts by country | **Required before launch** |

## 4A. Verified position as at 5 August 2026 — and a risk to the core analysis

4A.1 **No geographic enforcement exists.** Engineering confirmed there is no geoblock, no unsupported-countries list and no decline logic, and that access and donation were tested successfully from the Netherlands over a virtual private network. Every mitigation in clause 4 marked "required" is genuinely absent, not partially built.

4A.2 **The enabled payment methods are a live risk to the conclusion in clause 3.** The account currently has active, in addition to cards and Link: Bancontact (Belgium), BLIK (Poland), EPS (Austria), Kakao Pay, Naver Pay and PAYCO (Korea), MB Way (Portugal), Pix (Brazil), Revolut Pay, Samsung Pay, Satispay (Italy) and bank transfers.

**Why this matters.** The whole assessment rests on Dono accepting international donations **passively** while directing its activity at no market other than the UK. **Offering a payment method that exists only to serve a particular country is capable of being read as directing activity at that country** — it is a deliberate configuration choice, not an incidental consequence of accepting cards. It sits uncomfortably close to the trigger in clause 5.1(e), and it was not a decision anyone took consciously; it is the payment provider's default.

**Action: item PF-15 restricts the enabled methods to card, Link and mainstream wallets for beta.** If any local method is deliberately retained later, the jurisdiction-specific review in clause 5.1 should be completed for that country first.

4A.3 **Nothing else in this assessment changes.** The structural reasons why international donations remain proportionate — small values, single currency, no funds held by Dono, the payment provider bearing screening and fraud control, and the connected account bearing chargeback loss — are all confirmed by the evidence.

## 5. When further legal review is required

5.1 **A jurisdiction-specific legal and commercial review must be completed before Dono:**

(a) markets, advertises or promotes the Platform in any country other than the UK;
(b) publishes any page in a language other than English, or prices in a currency other than GBP;
(c) accepts Campaign Owners outside the UK;
(d) registers a country-specific domain or app-store listing;
(e) accepts a payment method with country-specific consumer or regulatory rules; or
(f) donation volume from any single non-UK country exceeds a material share of total volume, indicating de facto targeting.

5.2 Until then, international donation acceptance is **passive**: Dono accepts what reaches it, and directs its activity at no market other than the UK. **This distinction is the foundation of the whole assessment and must be protected by marketing decisions as well as legal ones.**

---

## Approval block — SIGNATURE REQUIRED

> **This block is unsigned. This document is prepared for approval and is not approved.**

**I confirm that I have reviewed this document in its consolidated v3.0 form, that it states the current position only, and that I approve it.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Controller, sole trader and accountable owner |
| Document version approved | 3.0 |
| Approved for use | ☐ Yes, on ____________ · ☑ **No** |
| Signature | ______________________ |
| Date of approval | ______________________ |

**Reviewed by:** Sashank (deputy) — Signature ______________________  Date ______________

---

## Version control

| Field | Entry |
|---|---|
| Version | 3.0 |
| Version date | 7 August 2026 |
| Effective from | On publication approval |
| Accountable owner | Amrit Kaur Rooprai, sole trader trading as Dono |
| Prepared by | Legal consolidation, 7 August 2026 |
| Reviewed by | *(signature required — approval block above)* |
| Approved by | *(signature required — approval block above)* |
| Status | **Not approved.** Clean consolidated document prepared for signature |
| Supersedes | v2.3 (6 August 2026) and all earlier versions, retained unaltered in the version archive |
| Next scheduled review | 7 February 2027, or on any material change to the Platform, the law, or Dono's payment configuration |
| Archive rule | Published versions are never overwritten or deleted. The version in force at the time of acceptance governs the relevant transaction |
