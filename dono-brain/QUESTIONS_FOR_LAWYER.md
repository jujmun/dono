# Questions for a UK solicitor — Dono legal suite v2.3

**Version date:** 6 August 2026 (revision 4)
**What changed in revision 4:** the demo fee, payer and label are settled; zero previous payments are confirmed; creator DOB, student eligibility, Society campaign scope and the succession rule are closed founder decisions. Counsel is asked to confirm legal drafting and presentation rather than choose the commercial model.
**Prepared for:** the UK solicitor instructed to review the Dono legal suite before launch
**Suite under review:** `dono-brain/terms_v2.3/`
**Prepared by:** Dono legal workstream

> **Please read `terms_v2.3/00_v2.3_change_log.md` and `TRUTH.md` first.** Together they record the decisions that changed Dono's model and the verified product position.

**In one paragraph:** Dono is a student crowdfunding platform operated by **a sole trader**. Beta is **Society campaigns only**; individual campaigns are the next planned release. Donations are **Stripe Connect direct charges** paid into the campaign owner's own connected account. **Dono does not hold, receive or control donation funds and holds no payment account. Dono has processed no payments to date.** Production pricing is a payment-method-neutral **5% + 20p** fee. Demo pricing is **2% + 20p**, borne by the Campaign Owner unless the Donor actively covers it and displayed as **“Payment processing fee (Dono)”**. Donors must be 18+ and may be anywhere. Dono now holds limited insurance, subject to the policy terms and exclusions.

---

## Q12 — Removal of an unused platform-account payment path

**The facts.** A public, unauthenticated function in the product can create a payment intent with **Dono's own platform account as merchant of record**, with no age gate, terms acceptance or authentication. There is no user interface for it, but it remains callable. **The founders confirm that Dono has never processed any payment, through this route or otherwise.** The route is being removed before the first live payment.

**Why we are asking.** Our position throughout — and the basis of the analysis in Q1 — is that **donation funds never enter an account Dono controls.** This path is inconsistent with that. It is being removed (checklist item CF-01).

**Our expected risk position.** Because the path has never been used and will be removed at the API boundary before beta, the founders expect this to be a contained configuration correction rather than a regulatory event.

**Please advise:**

1. On the confirmed zero-payment facts, is removal and a retained test/audit record sufficient?
2. Is any disclosure to the Payment Provider required merely because the unused route existed?
3. Does the route's removal preserve the Q1 direct-charge/FCA analysis without retrospective remediation?

## Q13 — Unused fee path and settled production/demo pricing

**The current facts.** No payment has ever been processed. The unlaunched code nevertheless contains a donor-facing processing-cost add-on that could vary by card while displaying the standard-UK figure. That path is being removed before the first payment.

**The settled production decision.** Dono will not vary its price by card, method or country. Production will use **5% + 20p per donation** as a Stripe application fee, separately recorded from the donation and Stripe's processing cost. Stripe's cost is borne by the connected account and is never added to the donor's total.

**The settled demo decision.** Demo Campaigns use a fixed **2% + 20p per Donation**, borne by the Campaign Owner unless the Donor actively chooses to cover it. Checkout describes it as **“Payment processing fee (Dono)”**. It is Dono revenue for enabling and administering the payment flow, not a pass-through or estimate of Stripe's actual processing charge, and never varies by card, method or country.

**Please advise:**

1. Is removal sufficient where the variable donor-facing path was never used?
2. Is **“Payment processing fee (Dono)”** acceptable if the Terms and checkout state prominently that it is Dono's fixed fee and not Stripe's actual processing charge?
3. Does deduction from Campaign proceeds, with unticked optional Donor cover, avoid the payment-surcharge concern where the amount never varies by instrument?
4. May Dono apply 2% + 20p to demo Campaigns and 5% + 20p to production Campaigns if the applicable schedule is locked, shown before payment and stored with the transaction?
5. What VAT/tax wording, if any, is required while Dono is not VAT registered?

## Q14 — Identity verification and the data it leaves behind

**The facts.** Campaign and society creators complete a **government-document and face-scan identity check operated by the Payment Provider**, which is mandatory and cannot be bypassed. **The Payment Provider holds the document and the scan; Dono never receives either.** Dono receives and stores the outcome, a **verified name** and a **verified date of birth**. Those persist **indefinitely**, are visible to administrators, and **survive the person deleting their account**. Separately, Dono has until now also stored an uploaded government identity document of its own — **that storage is being removed** (item EL-07).

**Please advise:**

1. Is the controller analysis right — the Payment Provider as independent controller for the document and scan, Dono as controller for the outcome and the verified fields?
2. Is **legitimate interests** the right basis for Dono retaining a verified name and date of birth, and is our balancing sound?
3. What retention period would you advise? We have drafted 6 years from campaign or society closure, with deletion on account deletion where no live obligation requires them.
4. The founders have decided to use the verified date of birth as the creator age gate, fail-closed with a correction/review route. Is that basis and workflow appropriate?
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

**Commercial risk position.** The founders expect this restricted direct-charge/refund model to be confirmatory rather than a major blocker, given that the platform-account path is unused and will be removed before the first payment. Please correct that expectation if the executed Stripe arrangement or the refund authority produces a material authorisation risk.

**Please advise:**

1. Is our conclusion correct that Dono provides no payment service, on the executed Stripe Connect agreement and the direct-charge flow?
2. Does the refund mandate change that, and in particular is there a payment-initiation-service risk?
3. Is the mandate enforceable against a **consumer** campaign owner — an individual student — as an irrevocable advance authority, and is it fair under the Consumer Rights Act 2015 Part 2?
4. Is post-execution appeal (rather than pre-execution) adequate, given that the money has already moved?
5. Are the drafting choices we made to protect the analysis (no payment account; "instruct the Payment Provider to reverse a charge"; express limits) sufficient, and would you change the wording?
6. What must Dono never do without further advice? We have listed: holding funds even briefly; pooled accounts, wallets or escrow; delaying or holding payouts; taking security or a reserve over connected-account balances; moving money between connected accounts.

## Q2 — Fixed production/demo fees and the surcharge regulations

**What we have done.** Dono charges **a flat fee of 5% + 20p, identical for every card, payment method and country**. We removed the previous "Stripe's cost + 3.5 percentage points" formula and the hard-coded card-category table. Stripe's processing cost is borne by the connected account and is **never** charged to the donor. A donor may optionally **cover Dono's fee only**.

For the limited demo, Dono uses a separately versioned fee of **2% + 20p**, borne by the Campaign Owner unless the Donor actively covers it, again identical for every card, method and country and displayed as **“Payment processing fee (Dono)”**.

**Our analysis.** Regulation 6A(1) of the Consumer Rights (Payment Surcharges) Regulations 2012 (inserted by the Payment Services Regulations 2017, Sch 8, para 12) prohibits a payee from charging a payer a fee in respect of the use of a given payment instrument. A payment-method-neutral platform fee is not such a charge. Restricting fee cover to Dono's flat fee means no donor-payable amount varies with the card used.

**Please advise:**

1. Is a flat platform fee, charged by the platform rather than the payee, outside reg 6A on these facts?
2. Does it matter that the fee may be **paid by the donor** (as fee cover) rather than deducted from the campaign, given that the amount does not vary by instrument?
3. Is Dono a "payee" for these purposes at all, given that the donation is paid to the campaign owner?
4. Is showing Stripe's variable processing cost at checkout as **a deduction from the amount reaching the campaign** (never as a donor-payable line) safe, or does even displaying it create risk?
5. Does the DMCC Act 2024 price-transparency regime require anything further at checkout?
6. Does applying a lower promotional/demo formula change any of the answers, provided it is a Dono fee, fixed for the campaign, fully disclosed and not tied to actual card-processing cost?

## Q3 — The society contracting model and limited recourse

**What we have done.** Society Campaign Terms clause 1: where the society is unincorporated, the **Responsible Representative is the contracting party**, contracting on the society's behalf and holding the connected account for it. **Clause 1.6 limits Dono's recourse against them personally to the funds in the connected account they control**, except for fraud, dishonesty, deliberate misuse, material misrepresentation (including lack of authority) and obligations that are inherently personal. We removed the previous clause under which the representative automatically accepted all of the society's obligations.

**Succession is also settled.** New Donations pause during a representative change; the successor completes fresh onboarding and opens a new Connected Account; future Donations use it; existing transactions and funds remain with the outgoing account. The outgoing representative must account to the Society. If they refuse, the Society enforces its rights, while Dono preserves/provides records where lawful and may restrict or refer the person, but never moves money or guarantees recovery.

**Please advise:**

1. Is this the most robust and commercially appropriate approach under English law for a UK student crowdfunding platform using Stripe Connect?
2. Is the limited-recourse clause **enforceable and effective**, and does it do what we intend?
3. Is it **fair** under the Consumer Rights Act 2015, given that the representative is likely a consumer in their own right?
4. Is a separate active tick at onboarding, with the plain-English disclosure we have drafted, sufficient to **incorporate** what is an onerous term?
5. Should we go further and treat the society as a partnership or the committee as joint contracting parties?
6. Are there remaining risks or improvements you would recommend — in particular around the representative's right of indemnity out of society funds, and what happens if the society's rules do not provide one?
7. Does the replacement-account succession wording accurately preserve historic refund/dispute responsibility without implying Dono can transfer a Stripe account or balance?
8. Does the Society primary-purpose/official-initiative rule create any charity-law, charitable-fundraising, public-collection or trustee/accounting issue that needs additional drafting, while preserving the founder's settled scope?

## Q4 — Surplus allocation fairness

**Commercial decision is final:** reverse-chronological automatic allocation (never pro rata), **plus** an independent right for any donor to claim their share of unused funds, reconciled through one ledger so nothing is refunded twice. There is **no de minimis**: every penny of unused money is refundable.

**Please advise on legal enforceability and drafting only:** does the automatic allocation rule survive s62 CRA 2015 given the independent right to claim? What disclosure or wording is needed to preserve the settled rule? Is the absence of a de minimis legally problematic where a refund costs more than it returns?

## Q5 — Liability caps and indemnities

**Commercial decision is final:** three tiers (ToS 27.3): **consumers** — no cap, no indemnity; **Societies** — indirect loss excluded, cap the greater of £2,500 or twelve months' fees; **business users** — indirect loss excluded, cap the greater of £1,000 or twelve months' fees. Indemnity is narrowed to specified third-party claims with defence control, mitigation and proportionate reduction.

**Insurance now held.** The current schedule records technology professional indemnity of **£1,000,000 aggregate**, cyber/data of **£100,000 aggregate**, cyber-crime loss of **£50,000**, legal protection of **£100,000** and crisis containment of **£25,000**. The schedule does not show separate public-liability or cyber business-interruption cover. The wording expressly excludes chargebacks, FCA-regulated activity, tax breaches, governmental enforcement and most fines/penalties. The policy therefore does not itself settle the liability/indemnity drafting or the payments perimeter.

**Please advise on enforceability and policy interaction, without reopening the commercial structure:** are the figures reasonable under UCTA/CRA given the actual cover? Is the Society tier — deliberately not a business tier — defensible? Is the narrowed indemnity appropriate? Would either cap risk being struck out entirely? Should the insurer/broker be asked to endorse or confirm any aspect of the crowdfunding, Stripe Connect or refund-mandate activity?

## Q6 — Consumer status of individual student campaign owners

We treat an individual acting as a Society Responsible Representative as a consumer in their own right. Individual Campaigns are deferred until after beta, but their future terms likewise treat an individual student Campaign Owner as a consumer. **Please confirm**, and advise whether any permitted category could make them a trader.

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

**Current NCA status:** Dono has started the NCA sign-up/registration process and is waiting for communication from the NCA. Portal registration, named-user eligibility, training and an end-to-end test are not yet being claimed as complete.

**Please advise:** is the launch gate correctly drawn? Are the retention clocks right? Is the **comment** moderation model (pre-publication keyword filtering, immediate publication of comments that pass, post-moderation, and a report control on every comment) proportionate for a service of this size under the illegal-content and children's duties, alongside human review of campaigns and media before publication? Anything missing from the CSEA checklist?

## Q11 — Publication readiness

**Please confirm, document by document, whether each may be published**, given that a number of clauses describe controls that are built to a specification but not yet live. Our approach has been: publish where the clause states a rule Dono applies by hand or a limit on Dono's own power; **do not publish** where the clause describes a system doing something automatically that it does not yet do. The per-document position is in each approval block, and the build dependencies are now centralised in `engineering/legal-launch/`. For the Society-only beta, the Student Campaign Terms are retained as future drafting but must not be presented or accepted as operative terms.

---

## Also worth your eye, if budget allows

- **ADR.** ToS 33.2 states that Dono does not represent that it participates in ADR where no duty applies. Is that adequate under the DMCC Act 2024?
- **Governing law and jurisdiction** (ToS 32) where a donor is outside the UK — see `dono-geographic-scope-risk-assessment-v2.3.md`.
- **The duplicate-recovery clawback** (Refund Policy 8.5) as against a consumer donor.
- **The Team and Contributor Agreement** — the scope of the IP assignment for pre-agreement work, the moral-rights waiver, and whether any contributor's relationship is in substance employment or worker status.
- **ICO registration** — whether Dono must register and pay the data-protection fee.

---

## What we are not asking you to do

Re-open decisions the founder has taken on product and commercial matters: production fee **5% + 20p**; demo fee **2% + 20p**, Campaign Owner-borne unless actively covered by the Donor and labelled “Payment processing fee (Dono)”; no card/method/country variation; Society-only beta followed by individual campaigns; enrolment-based student eligibility with UK Connected Account address requirements; the Society-purpose test; replacement-account succession; verified-DOB creator gating; 12-month analytics retention; the surplus rule; the three-tier liability and narrow-indemnity structure; 18+ donors; removal of recurring donations, matched funding and commercial campaigns; no public trust indicators; international donors permitted; a single support email; and remaining a sole trader for beta. **Please do tell us if a settled decision creates a legal problem we have not identified** — we would rather know.
