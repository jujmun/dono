# Dono TODO

A single, living list of open tasks across the company. `TRUTH.md` holds what is
**settled**; this file holds what is **pending**. Together they are the skeleton
that organises everything else in `dono-brain/`.

**Last reviewed: 6 August 2026** (revision 4: demo fee settled; zero payments confirmed; succession, creator age, analytics, eligibility and Society-purpose rules closed).

> ### Do these first
>
> Three items are reachable payment paths that would produce unlawful or contractually false behaviour if used. **Dono has processed no payments**, so there is no historic customer population; they must still be removed before the first live payment.
>
> 1. **Remove the public payment path that settles on Dono's own platform account** (`createFundPaymentIntent`) at the API boundary. Checklist items CF-01 to CF-03. **Zero previous payments confirmed; no historic remediation audit remains.**
> 2. **Remove the donor-facing processing-fee add-on**, which varies with the donor's card and is the surcharge prohibited by reg 6A. Item PF-12.
> 3. **Stop checkout displaying one figure and charging another** — it shows the standard-UK rate whatever card is used. Item PF-13.
>
> Live payment keys are already enabled, so removal remains a pre-first-payment gate.

> **The authoritative pre-launch list is `engineering/legal-launch/ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md`.**
> It carries every technical and operational item required to make the v2.3 legal
> suite true, with priority, dependencies, acceptance criteria and evidence. This
> file summarises the gates and holds everything that sits outside it.

---

## The five gates before launch

Nothing goes live with real users, real money or real personal data until all five are closed.

| # | Gate | Owner | Where it is tracked |
|---|---|---|---|
| **0** | **The three items above** — the platform-account payment path and the two fee corrections | Engineering | Checklist items CF-01 to CF-03, PF-12, PF-13 |
| **1** | **Engineering P0 items complete**, with evidence — payments and fees, Society-only beta gate, refund mandate and dispute coordination, checkout identity panel and acceptance evidence, age gates, identity-storage removal, retention enforcement, cookie consent, account suspension, alerting, and the code-review gate on legally-effective files | Engineering | `engineering/legal-launch/ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md` bands P0 and P0-PUB |
| **2** | **Online Safety Act acceptance tests 1–8 passed**, each with dated evidence and a named approver, plus the CSEA pre-launch checklist C1–C12 | Amrit (OSA lead) | `dono-online-safety-procedures-v2.3.md`; `dono-csea-reporting-procedure-v2.3.md` |
| **3** | **Compliance records completed and approved** — engineering evidence delivered under the central privacy narrative; DPIA re-performed and signed; illegal-content and children's risk assessments re-performed on current controls; Children's Code assessment completed; processor roles/DPAs and provider-specific transfers verified | Amrit (DP lead) | `engineering/legal-launch/PRIVACY_DPIA_ENGINEERING_NARRATIVE.md`; the reconciled DPIA/ROPA/APD/provider records |
| **4** | **Governance in place** — Team and Contributor Agreements accepted by everyone with access; two incident tabletop exercises run and documented; Release Control Matrix populated; financial-crime training delivered | Amrit | `dono-team-and-contributor-agreement-v2.3.md`; `dono-incident-response-plan-v2.3.md`; `TRUTH.md` |

---

## Legal — outstanding

- [ ] **Instruct a UK solicitor** on the 15 questions in [`QUESTIONS_FOR_LAWYER.md`](QUESTIONS_FOR_LAWYER.md). Q12/Q13 cover the existing payment-path and fee facts; Q1/Q2 seek confirmation of the intended direct-charge/refund and flat-fee model. The founders expect the intended payments/FCA model to be confirmatory rather than a major blocker, but no one should state that as a legal conclusion before advice
- [x] **Demo fee settled:** **2% + 20p**, identical for every card/method/country, charged to the Campaign Owner unless the Donor actively covers it, and labelled **“Payment processing fee (Dono)”**. It is Dono revenue, not Stripe's actual processing charge. Production remains **5% + 20p**
- [ ] **Re-perform the illegal-content risk assessment** on current controls, scoring likelihood and impact separately and mapping Ofcom Code measures — `terms_v2.3/dono-illegal-content-risk-assessment-v2.3.md`
- [ ] **Re-perform the children's risk assessment**, adding age bands (under 13 / 13–15 / 16–17 / adults), child user journeys, harms, likelihood, severity, the reasoning for each score, the control that reduces each risk, and the test evidence that the control works
- [ ] **Complete the ICO Children's Code (Age Appropriate Design Code) assessment** — a separate statutory assessment, not satisfied by the OSA work
- [ ] **Sign and date the DPIA** once the risk register is re-scored and mitigations are evidenced. Do not backdate
- [ ] **Reconcile the Privacy Notice, Cookie Notice, DPIA, ROPA, APD, Article 14 assessment, provider register and transfer records to the single narrative in** [`engineering/legal-launch/PRIVACY_DPIA_ENGINEERING_NARRATIVE.md`](engineering/legal-launch/PRIVACY_DPIA_ENGINEERING_NARRATIVE.md). Remove stale amendment-overridden text; retain each record only for its distinct legal purpose
- [ ] **Close the remaining open items in** [`terms_v2.3/UNRESOLVED_QUESTIONS_REGISTER_v2.3.md`](terms_v2.3/UNRESOLVED_QUESTIONS_REGISTER_v2.3.md). U6–U10 and U12 are now closed; U11 remains the launch-readiness decision, while U4 and the immigration component of U5 require external confirmation
- [x] ~~Test Stripe Connect onboarding with a real unincorporated society~~ — **done. Confirmed working: the treasurer or principal officer onboards as a sole trader in their own name.** Society Terms clause 1.4A now states this and its consequences
- [ ] **Decide whether a real-user beta may proceed on the current timetable** — register item U11. The legal position is set out there; the decision is a founder's
- [ ] **Answer counsel questions Q12 to Q15** — removal of the unused platform-account/variable-fee paths on confirmed zero-payment facts; fee-label presentation; identity-data retention and creator age use; and what can presently be proved about acceptance
- [x] **Creator age gate decided:** use the Payment Provider's verified date of birth, fail-closed for missing, inconsistent or under-18 results, with a documented correction/review route
- [ ] **Complete the ICO registration self-assessment** and record the outcome (register item U4)
- [ ] **CSEA/NCA registration:** application/sign-up is in progress and Dono is waiting for communication from the National Crime Agency. Record the response, confirm which named users are eligible, complete training and test the reporting route before marking the CSEA checklist complete
- [ ] Trademark clearance search and UK filing once the brand is finalised
- [ ] Review the Stripe Connected Account Agreement and Platform Agreement; do not opt into any setting that shifts liability toward Dono

### What still needs a decision, rather than simply completing work

| Decider | Decision needed | Recommended default | What it unblocks |
|---|---|---|---|
| **Founders** | Adopt U11 as a hard release rule: no first real-user Donation until the P0 Release Control Matrix is signed | **Adopt it.** Use synthetic/test-mode demonstrations until then | Final go/no-go authority; no calendar date needs to be chosen now |
| **UK solicitor** | Confirm the direct-charge/refund-mandate FCA perimeter, the fee label/optional cover, Society limited recourse and succession, official-initiative charity/fundraising boundary, consumer contract model and publication wording | Preserve the settled product model unless counsel identifies a legal defect | Clean consolidated public terms and legal approval |
| **Data protection lead** | After implementation, decide whether any DPIA risk remains high and therefore requires prior ICO consultation | Sign off if all residual risks are low/medium and evidenced; consult only if a high risk remains | DPIA approval and privacy publication |
| **Founders with immigration adviser** | Decide who may perform technical/founder work while subject to Student-visa restrictions | Do not infer permission from informal founder status | Lawful contributor roles and access |
| **Founders after broker response** | Decide whether to buy separate public-liability or cyber business-interruption cover | Treat this as risk appetite, not a substitute for the launch controls | Insurance-risk acceptance; it does not otherwise block the legal model |

Everything else in the five gates is an implementation, evidence or external-confirmation task, not an unanswered product choice. The fee, payer, Society scope, succession, eligibility, creator age gate, analytics period, liability structure, surplus rule and sole-trader beta model are not to be reopened unless professional advice identifies a legal defect.

## Finance / Corporate — outstanding

- [ ] **Immigration advice**: can UK Student-visa-holding founders contribute technically, hold founder options and accrue vesting without breaching visa conditions? **Still the single biggest unresolved issue**, and it interacts with the sole-trader decision (register item U5)
- [ ] Ask an accountant once about the reverse-charge treatment of Stripe's Irish invoices
- [ ] Start the monthly rolling-total spreadsheet of sole-trader taxable revenue
- [ ] Tax advice: sole-trader tax and NI exposure, VAT treatment of the Dono fee, refund tax treatment, pre-incorporation expenses
- [ ] **Insurance follow-up:** policy is in force from 4 August 2026 with technology PI, cyber/data, cyber-crime, legal-protection and crisis cover. Ask the broker/insurer to confirm that the exact crowdfunding, Stripe Connect, refund-mandate and fee activity is accurately disclosed. Record the important exclusions (including chargebacks, FCA-regulated activity, tax, government enforcement and most fines) and decide separately whether public-liability or cyber business-interruption cover is needed
- [ ] Confirm founder roles, intended ownership and vesting internally
- [ ] Incorporation, founder agreements, option agreements and a shareholders' agreement — deferred; the v2.3 suite is drafted so incorporation later needs no redraft

## Design / Product — outstanding

- [ ] **Remove every verification badge and trust indicator from the designs.** The badge set (Verified Student / Student Status Checked / Society Approved / Institutionally Endorsed) is **cancelled** — see `TRUTH.md`. Replace with neutral lifecycle states rendered without approving styling
- [ ] **Design the checkout legal identity panel** ("You're donating to") with all six mandatory fields, and the blocked state when a field is missing
- [ ] **Design the fee-cover checkout** showing Campaign contribution / **Payment processing fee (Dono)** for demo (or Dono fee for production) / **Stripe processing cost (paid by the campaign)** / expected amount reaching the campaign. Campaign Owner pays by default; Donor cover is optional and unticked
- [ ] Design the 18+ confirmation at checkout
- [ ] Design the reviewer dashboard and the moderation dashboard
- [ ] Design the report control, the logged-out reporting route and the appeals flow
- [ ] Design the cookie banner with **equally prominent** Accept and Reject, and the footer "Privacy and analytics settings" link
- [ ] Design the evidence-upload flow with mandatory pre-upload redaction guidance
- [ ] Design the society onboarding flow including the **separate, active limited-recourse acknowledgement**
- [ ] **Make the beta Society-only in product and legal presentation.** Individual campaigns remain the next release: keep their work behind a feature/release gate and do not present Student Campaign Terms as operative beta terms
- [ ] Review all campaign and trust copy against the no-verification-language rule

## Research / Operations — outstanding

- [ ] Demo with the India Society for its Ram-Leela play; speak with Cathy before launching the demo. **Any demo before the gates close must use synthetic or staff-authored content with payments, comments and uploads disabled**
- [ ] Address Step's concerns about the proposed Somerville demo
- [ ] Secure a demo case college to unlock follow-on colleges
- [ ] Continue college development-office interviews
- [ ] Prepare the two-page proposal with screenshots for development offices and close alumni
- [ ] Meet Damian (treasury) on disbursement and audit trail for item-level wish-list donations
- [ ] Decide product and timing to avoid competing with the October/November giving day
- [ ] When pitching to colleges, lead with their concerns — content control, competition with college funds, donor data access

---

## Closed by the v2.3 legal revision (6 August 2026)

Recorded so nobody reopens them.

| Was | Now |
|---|---|
| Decide the final fee structure | **Demo: 2% + 20p. Production: 5% + 20p. Both payment-method-neutral, Campaign Owner-borne unless the Donor actively covers the applicable fee** |
| Decide the exact platform fee percentage and fixed component | Same as above; the demo line is **“Payment processing fee (Dono)”** |
| Decide final permitted campaign categories | **Society-only beta.** The primary purpose must advance the Society's activities, members or legitimate objectives. Incidental third-party benefit is allowed; primarily external benefit requires an official Society initiative directly furthering its charitable, educational, sporting, cultural or community mission. Commercial and pass-through fundraising remain prohibited |
| Set the under-spend de minimis threshold | **No de minimis** — the question disappears |
| Decide surplus allocation | **Reverse chronological, never pro rata, plus each donor's independent claim right; one ledger prevents duplicate refunds** |
| Decide liability and indemnity structure | **Settled commercially in `TRUTH.md`: no consumer cap/indemnity; Society and business caps; narrow third-party indemnities. Counsel confirms enforceability without reopening the commercial choice** |
| Donor anonymity visibility rules | Settled and disclosed honestly, including what Dono cannot control |
| Evidence visibility and redaction rules; evidence and moderation retention | Settled; retention is risk-based in Privacy Notice clause 7.1 |
| Society officer evidence requirements and number of approvers | One approver; the society's own rules govern; £2,500/£10,000 bands removed |
| General information-request and refund-decision deadlines | 10 Working Days / 21 days with one 21-day extension |
| Creator age verification — whether the Payment Provider's DOB can be the final 18+ gate | **Yes.** Verified DOB is the fail-closed final gate for Campaign and Society creators. Donor age remains self-certified |
| Historic-payment review | **Closed: no payment has ever been processed, so there is no historic transaction or customer-remediation population. Remove and test the unused unsafe routes before the first payment** |
| Student location during enrolment | **Physical UK presence is not required. Current enrolment controls eligibility; the Connected Account holder must have a valid UK address and satisfy the Payment Provider's UK onboarding requirements** |
| Society succession | **Pause new Donations; successor completes fresh onboarding and opens a new Connected Account; historic funds and responsibility remain with the outgoing holder; Dono does not transfer funds or guarantee recovery** |
| Analytics retention | **12 months** |
| Verification badge system | **Cancelled** — no public trust indicators of any kind |
| Recurring donations | **Removed from the Platform.** Future feature |
| Match windows / matched fundraising | **Removed from the Platform.** Future feature |
| Community Funds | Remains prohibited; no pooled funds of any kind |
| Stripe negative-balance and dispute-fee allocation | Recorded; verification of the live configuration is engineering item PF-07 |
| UK geographical business address for legal notices | 37 St Giles', Oxford OX1 3LD |
| Whether processor DPAs need wet signatures | **No**, where validly incorporated into the provider's online terms |
| IP assignment agreements from founders and contributors | Drafted — `terms_v2.3/dono-team-and-contributor-agreement-v2.3.md`. **Execution is outstanding** |
| Gift Aid capture | Not applicable — Dono claims no Gift Aid and issues no charitable tax receipts |
| Development-office data-sharing consent language | Not applicable — no institutional data-sharing feature exists or will be offered without a named institution, an executed agreement and its privacy notice |
| FCA / payment-services conclusion | Analysed in `terms_v2.3/00_v2.3_change_log.md` §5. Counsel confirmation sought as Q1 |
| Charity and fundraising law | Founder scope is settled under the Society primary-purpose/official-initiative rule. Counsel must confirm the charity/fundraising-law consequences without reopening that product choice |
| Consumer law characterisation | Settled: conditional contribution, consumer status by facts, three-tier liability. Counsel confirmation sought as Q6 and Q7 |
| Data protection specialist review | Addressed across the v2.3 suite; residual questions are Q8 and Q9 |
| Online Safety Act scope | Settled: in-scope user-to-user service; all public UGC launch-blocked pending the acceptance tests |
| Sole-trader risk review | Structure confirmed for beta; insurance obtained and limitations recorded; incorporation path preserved |
