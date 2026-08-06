# Questions for a UK solicitor — Dono legal suite v2.3

**Version date:** 6 August 2026 (revision 2)
**What changed in revision 2:** questions Q12 to Q15 added following verified engineering evidence dated 5 August 2026. **Q12 is now the most urgent question in this document, ahead of Q1.**
**Prepared for:** the UK solicitor instructed to review the Dono legal suite before launch
**Suite under review:** `dono-brain/terms_v2.3/`
**Prepared by:** Dono legal workstream

> **Please read `terms_v2.3/00_v2.3_change_log.md` first.** It sets out the eleven decisions that changed Dono's model and the resolution of all 64 findings from the pre-launch due diligence review of 31 July 2026.

**In one paragraph:** Dono is a student crowdfunding platform operated by **a sole trader**. Donations are **Stripe Connect direct charges** paid into the campaign owner's own connected account. **Dono never holds, receives or controls donation funds and holds no payment account.** Dono charges a **flat 5% + 20p** as a Stripe application fee. Campaign owners are students at one recognised UK university; donors must be 18+ and may be anywhere. Dono is **uninsured**.

---

## Q12 — A live payment path settling on Dono's own account *(most urgent)*

**The facts.** A public, unauthenticated function in the product creates a payment intent with **Dono's own platform account as merchant of record**, with no age gate, no terms acceptance and no authentication. There is no user interface for it, but a public query enumerates the identifiers needed to call it, and the payment webhook still handles that branch. Whether any charge has actually settled through it is being checked (register item U9).

**Why we are asking.** Our position throughout — and the basis of the analysis in Q1 — is that **donation funds never enter an account Dono controls.** This path is inconsistent with that. It is being removed (checklist item CF-01).

**Please advise:**

1. If **no** charge has ever settled through this path, is removal sufficient, and does the Q1 analysis stand unaffected?
2. If **any** charge has settled: what is Dono's position? Does it mean Dono has provided a payment service, or received funds requiring authorisation? What remediation, notification or reporting follows?
3. Should anything be disclosed to the Payment Provider under the platform agreement?
4. Does this change what Dono must do before accepting any further real payment?

## Q13 — The fee currently charged is not the fee in the Terms

**The facts.** The drafted position is a flat 5% + 20p platform fee, method-neutral, with the Payment Provider's processing cost borne by the connected account. **What the product does today is the opposite**: no platform fee is charged at all, and **the donor is charged the processing cost on top at a rate that varies with their card** — 1.5% + 20p on a standard UK card, rising to 5.25% + 20p on an international card with currency conversion. **Checkout displays the standard-UK figure regardless of the card used**, so a donor on any other card is charged more than they were shown.

**Please advise:**

1. Is our analysis right that the current donor-facing charge is a prohibited surcharge under reg 6A?
2. Is charging above the displayed total a separate breach, and of what?
3. **Does anything need to be done about donations already taken on this basis** — refunds of the surcharge element, notification, or anything else?
4. Does this affect whether Dono may accept any further payment before the fee model is corrected?

## Q14 — Identity verification and the data it leaves behind

**The facts.** Campaign and society creators complete a **government-document and face-scan identity check operated by the Payment Provider**, which is mandatory and cannot be bypassed. **The Payment Provider holds the document and the scan; Dono never receives either.** Dono receives and stores the outcome, a **verified name** and a **verified date of birth**. Those persist **indefinitely**, are visible to administrators, and **survive the person deleting their account**. Separately, Dono has until now also stored an uploaded government identity document of its own — **that storage is being removed** (item EL-07).

**Please advise:**

1. Is the controller analysis right — the Payment Provider as independent controller for the document and scan, Dono as controller for the outcome and the verified fields?
2. Is **legitimate interests** the right basis for Dono retaining a verified name and date of birth, and is our balancing sound?
3. What retention period would you advise? We have drafted 6 years from campaign or society closure, with deletion on account deletion where no live obligation requires them.
4. **Should the verified date of birth be used as the age gate for creators?** It is currently collected and used for nothing, which we think is the weakest position (register item U10).
5. Does removing Dono's own identity-document storage fully resolve the point, or is anything else needed for documents already held?

## Q15 — Contract evidence: what we can and cannot presently prove

**The facts.** Acceptance records are immutable and the correct documents are required for each action, enforced server-side. But: the record stores **only a version string**, not the text or a hash; the text lives in a **mutable file with no historical route**, and nothing forces a version bump when it changes, so **a silent wording change under an unchanged version string is possible and undetectable**; **a guest donor's acceptance is not linked to their donation at all**; there is **no acceptance receipt or durable copy**; and **the text the product currently serves is a draft stub, not the approved suite.**

**Please advise:**

1. What is the practical consequence for enforceability against a **guest donor**, whose acceptance cannot be tied to their payment?
2. Is a version string alone sufficient, or do you agree a hash of the accepted text is needed?
3. Does the absence of a durable copy create a problem under the consumer information requirements, and if so which?
4. **What is the position on acceptances already recorded against the draft-stub text?** Should users be re-asked once the approved suite is published, and if so how should that be framed?
5. Is our fix list (checklist items CH-11 to CH-17) sufficient?

## Q1 — The refund mandate and the payment-services perimeter

**What we have done.** Campaign owners and recipients grant Dono, in the Terms of Service (clause 13.2), advance irrevocable authority — as their agent, for the sole purpose of administering the contractual refund process — to **instruct Stripe to reverse a charge, in whole or in part, from their connected account**. Dono decides whether a refund is due, its amount and the remedy, notifies the owner and gives them an opportunity to respond (except in urgent fraud cases), and the owner may appeal after the event.

**Our analysis** is at `00_v2.3_change_log.md` section 5. In short: we do **not** rely on the commercial-agent exclusion, because PERG 15.5 Q34A says it is unavailable to online fundraising platforms. We say instead that Dono **provides no payment service at all** — funds never enter an account Dono controls, Stripe is the PSP, and Dono is a technical service provider within Schedule 1 Part 2 of the PSRs 2017. We identify a residual argument that instructing a reversal could be characterised as a payment initiation service, and we think it is weak because the mandate is a disclosed agency arrangement with Dono's own customer, relates only to reversing a charge created through the Platform, never involves possession of funds, and can only move money from the campaign owner to the donor.

**Please advise:**

1. Is our conclusion correct that Dono provides no payment service, on the executed Stripe Connect agreement and the direct-charge flow?
2. Does the refund mandate change that, and in particular is there a payment-initiation-service risk?
3. Is the mandate enforceable against a **consumer** campaign owner — an individual student — as an irrevocable advance authority, and is it fair under the Consumer Rights Act 2015 Part 2?
4. Is post-execution appeal (rather than pre-execution) adequate, given that the money has already moved?
5. Are the drafting choices we made to protect the analysis (no payment account; "instruct the Payment Provider to reverse a charge"; express limits) sufficient, and would you change the wording?
6. What must Dono never do without further advice? We have listed: holding funds even briefly; pooled accounts, wallets or escrow; delaying or holding payouts; taking security or a reserve over connected-account balances; moving money between connected accounts.

## Q2 — The 5% + 20p fee and the surcharge regulations

**What we have done.** Dono charges **a flat fee of 5% + 20p, identical for every card, payment method and country**. We removed the previous "Stripe's cost + 3.5 percentage points" formula and the hard-coded card-category table. Stripe's processing cost is borne by the connected account and is **never** charged to the donor. A donor may optionally **cover Dono's fee only**.

**Our analysis.** Regulation 6A(1) of the Consumer Rights (Payment Surcharges) Regulations 2012 (inserted by the Payment Services Regulations 2017, Sch 8, para 12) prohibits a payee from charging a payer a fee in respect of the use of a given payment instrument. A payment-method-neutral platform fee is not such a charge. Restricting fee cover to Dono's flat fee means no donor-payable amount varies with the card used.

**Please advise:**

1. Is a flat platform fee, charged by the platform rather than the payee, outside reg 6A on these facts?
2. Does it matter that the fee may be **paid by the donor** (as fee cover) rather than deducted from the campaign, given that the amount does not vary by instrument?
3. Is Dono a "payee" for these purposes at all, given that the donation is paid to the campaign owner?
4. Is showing Stripe's variable processing cost at checkout as **a deduction from the amount reaching the campaign** (never as a donor-payable line) safe, or does even displaying it create risk?
5. Does the DMCC Act 2024 price-transparency regime require anything further at checkout?

## Q3 — The society contracting model and limited recourse

**What we have done.** Society Campaign Terms clause 1: where the society is unincorporated, the **Responsible Representative is the contracting party**, contracting on the society's behalf and holding the connected account for it. **Clause 1.6 limits Dono's recourse against them personally to the funds in the connected account they control**, except for fraud, dishonesty, deliberate misuse, material misrepresentation (including lack of authority) and obligations that are inherently personal. We removed the previous clause under which the representative automatically accepted all of the society's obligations.

**Please advise:**

1. Is this the most robust and commercially appropriate approach under English law for a UK student crowdfunding platform using Stripe Connect?
2. Is the limited-recourse clause **enforceable and effective**, and does it do what we intend?
3. Is it **fair** under the Consumer Rights Act 2015, given that the representative is likely a consumer in their own right?
4. Is a separate active tick at onboarding, with the plain-English disclosure we have drafted, sufficient to **incorporate** what is an onerous term?
5. Should we go further and treat the society as a partnership or the committee as joint contracting parties?
6. Are there remaining risks or improvements you would recommend — in particular around the representative's right of indemnity out of society funds, and what happens if the society's rules do not provide one?

## Q4 — Surplus allocation fairness

Reverse-chronological automatic allocation (never pro rata — a founder decision), **plus** an independent right for any donor to claim their share of unused funds, reconciled through one ledger so nothing is refunded twice. There is **no de minimis**: every penny of unused money is refundable.

**Please advise:** does the automatic allocation rule survive s62 CRA 2015 given the independent right to claim? Would you draft it differently? Is the absence of a de minimis a problem where a refund costs more than it returns?

## Q5 — Liability caps and indemnities

Three tiers (ToS 27.3): **consumers** — no cap, no indemnity; **Societies** — indirect loss excluded, cap the greater of £2,500 or twelve months' fees; **business users** — indirect loss excluded, cap the greater of £1,000 or twelve months' fees. Indemnity narrowed to specified third-party claims with defence control, mitigation and proportionate reduction. **Dono is uninsured.**

**Please advise:** are the figures reasonable under UCTA given no insurance? Is the Society tier — deliberately not a business tier — defensible? Is the narrowed indemnity appropriate? Would a low cap risk being struck out entirely, leaving no cap?

## Q6 — Consumer status of individual student campaign owners

We treat an individual student running a campaign as a **consumer**, and an individual acting as a society Responsible Representative as a consumer in their own right. **Please confirm**, and advise whether any category of student campaign we permit could make them a trader.

## Q7 — Characterisation of a donation, and the Consumer Contracts Regulations

We describe a donation as a **conditional contribution** to the stated purpose — not a gift, purchase, investment or loan. The contract is between donor and campaign owner; Dono is the disclosed agent for formation and holds the refund mandate.

**Please advise:** is the characterisation sound? Do the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 apply, and if so what pre-contract information and cancellation rights arise, and how should the campaign owner's obligations be presented? Is the standing-offer-plus-agency formation analysis correct, and is formation on Stripe's payment confirmation the right trigger?

## Q8 — Article 14 and third-party data on receipts

We rely on the **disproportionate-effort exception** for people named incidentally on uploaded receipts, supported by mandatory redaction guidance, rejection and 30-day quarantine, minimisation, restricted access, defined retention and a specific public explanation in the Privacy Notice. The assessment is at `dono-article-14-assessment-v2.3.md`.

**Please advise:** does the exception hold for every category we list, in particular delivery recipients and co-purchasers? Are the safeguards sufficient? Should we give direct notice in more cases?

## Q9 — Institutional referrals

We have consolidated all referral rules into `dono-institutional-referral-protocol-v2.3.md`: six permitted circumstances, a seven-part seriousness and necessity test, authorised approvers, a minimum data set with an explicit never-disclose list, mandatory allegation labelling, secure transmission, notice unless prejudicial, correction and appeal, records and audit.

**Please advise:** are the lawful bases correctly identified? Is the notice-withholding test properly drawn? Does the allegation-labelling requirement give adequate defamation protection? Is anything missing that a regulator would expect?

## Q10 — Online Safety Act and CSEA readiness

Public user-generated content is launch-blocked until eight acceptance tests pass. The CSEA procedure is at `dono-csea-reporting-procedure-v2.3.md`, with a 12-item pre-launch checklist and two retention clocks (report reference 5 years; content and prescribed information 1 year).

**Please advise:** is the launch gate correctly drawn? Are the retention clocks right? Is the moderation model (pre-publication keyword filtering, immediate publication, post-moderation, report control on every item) proportionate for a service of this size under the illegal-content and children's duties? Anything missing from the CSEA checklist?

## Q11 — Publication readiness

**Please confirm, document by document, whether each may be published**, given that a number of clauses describe controls that are built to a specification but not yet live. Our approach has been: publish where the clause states a rule Dono applies by hand or a limit on Dono's own power; **do not publish** where the clause describes a system doing something automatically that it does not yet do. The per-document position is in each approval block, and the build dependencies are in `ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md`.

---

## Also worth your eye, if budget allows

- **ADR.** ToS 33.2 states that Dono does not represent that it participates in ADR where no duty applies. Is that adequate under the DMCC Act 2024?
- **Governing law and jurisdiction** (ToS 32) where a donor is outside the UK — see `dono-geographic-scope-risk-assessment-v2.3.md`.
- **The duplicate-recovery clawback** (Refund Policy 8.5) as against a consumer donor.
- **The Team and Contributor Agreement** — the scope of the IP assignment for pre-agreement work, the moral-rights waiver, and whether any contributor's relationship is in substance employment or worker status.
- **ICO registration** — whether Dono must register and pay the data-protection fee.

---

## What we are not asking you to do

Re-open decisions the founder has taken on product and commercial matters: the flat fee; 18+ donors; email-only verification; removal of recurring donations, matched funding and commercial campaigns; no public trust indicators; international donors permitted; a single support email; and remaining a sole trader for beta. **Please do tell us if any of those creates a legal problem we have not identified** — we would rather know.
