# Dono TODO

A single, living list of open tasks across the company. `TRUTH.md` holds what is
**settled**; this file holds what is **pending**. Together they are the skeleton
that organises everything else in `dono-brain/`.

**Last reviewed: 6 August 2026** (revision 2, after the engineering evidence of 5 August 2026).

> ### Do these first
>
> Three items describe **live behaviour that is unlawful or untrue**, rather than work that has not been done. They come before everything else in this file.
>
> 1. **Remove the public payment path that settles on Dono's own platform account** (`createFundPaymentIntent`), at the API boundary — and **check the live database for any charge already taken through it.** Checklist items CF-01 to CF-03. If a charge has been taken, stop and take payments advice.
> 2. **Remove the donor-facing processing-fee add-on**, which varies with the donor's card and is the surcharge prohibited by reg 6A. Item PF-12.
> 3. **Stop checkout displaying one figure and charging another** — it shows the standard-UK rate whatever card is used. Item PF-13.
>
> Live payment keys are already enabled, so these are not theoretical.

> **The authoritative pre-launch list is `terms_v2.3/ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md`.**
> It carries every technical and operational item required to make the v2.3 legal
> suite true, with priority, dependencies, acceptance criteria and evidence. This
> file summarises the gates and holds everything that sits outside it.

---

## The four gates before launch

Nothing goes live with real users, real money or real personal data until all four are closed.

| # | Gate | Owner | Where it is tracked |
|---|---|---|---|
| **0** | **The three items above** — the platform-account payment path and the two fee corrections | Engineering | Checklist items CF-01 to CF-03, PF-12, PF-13 |
| **1** | **Engineering P0 items complete**, with evidence — payments and fees, refund mandate and dispute coordination, checkout identity panel and acceptance evidence, age gates, identity-storage removal, retention enforcement, cookie consent, account suspension, alerting, and the code-review gate on legally-effective files | Engineering | `ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md` bands P0 and P0-PUB, including the 43 items in section J |
| **2** | **Online Safety Act acceptance tests 1–8 passed**, each with dated evidence and a named approver, plus the CSEA pre-launch checklist C1–C12 | Amrit (OSA lead) | `dono-online-safety-procedures-v2.3.md`; `dono-csea-reporting-procedure-v2.3.md` |
| **3** | **Compliance records completed and approved** — DPIA signed; illegal-content and children's risk assessments re-performed on current controls; Children's Code assessment completed; three processor DPAs recorded; Vercel and Resend transfer risk assessments written | Amrit (DP lead) | `dono-dpia-v2.3.md` and the amendment blocks |
| **4** | **Governance in place** — Team and Contributor Agreements accepted by everyone with access; two incident tabletop exercises run and documented; Release Control Matrix populated; financial-crime training delivered | Amrit | `dono-team-and-contributor-agreement-v2.3.md`; `dono-incident-response-plan-v2.3.md`; `TRUTH.md` |

---

## Legal — outstanding

- [ ] **Instruct a UK solicitor** on the eleven questions in [`QUESTIONS_FOR_LAWYER.md`](QUESTIONS_FOR_LAWYER.md) — highest priority is Q1 (the refund mandate and the payment-services perimeter)
- [ ] **Re-perform the illegal-content risk assessment** on current controls, scoring likelihood and impact separately and mapping Ofcom Code measures — `terms_v2.3/dono-illegal-content-risk-assessment-v2.3.md`
- [ ] **Re-perform the children's risk assessment**, adding age bands (under 13 / 13–15 / 16–17 / adults), child user journeys, harms, likelihood, severity, the reasoning for each score, the control that reduces each risk, and the test evidence that the control works
- [ ] **Complete the ICO Children's Code (Age Appropriate Design Code) assessment** — a separate statutory assessment, not satisfied by the OSA work
- [ ] **Sign and date the DPIA** once the risk register is re-scored and mitigations are evidenced. Do not backdate
- [ ] **Close the eight items in** [`terms_v2.3/UNRESOLVED_QUESTIONS_REGISTER_v2.3.md`](terms_v2.3/UNRESOLVED_QUESTIONS_REGISTER_v2.3.md). **U6 (what "physically studying in the UK" means) is a live internal inconsistency and should be closed before publication**
- [x] ~~Test Stripe Connect onboarding with a real unincorporated society~~ — **done. Confirmed working: the treasurer or principal officer onboards as a sole trader in their own name.** Society Terms clause 1.4A now states this and its consequences
- [ ] **Decide whether a real-user beta may proceed on the current timetable** — register item U11. The legal position is set out there; the decision is a founder's
- [ ] **Answer the four new questions for counsel** (Q12 to Q15) added after the engineering evidence — the platform-account path, the fee already charged, identity data retention, and what can presently be proved about acceptance
- [ ] **Decide whether the verified date of birth becomes the creator age gate** — register item U10; it is collected today and used for nothing
- [ ] **Complete the ICO registration self-assessment** and record the outcome (register item U4)
- [ ] Trademark clearance search and UK filing once the brand is finalised
- [ ] Review the Stripe Connected Account Agreement and Platform Agreement; do not opt into any setting that shifts liability toward Dono

## Finance / Corporate — outstanding

- [ ] **Immigration advice**: can UK Student-visa-holding founders contribute technically, hold founder options and accrue vesting without breaching visa conditions? **Still the single biggest unresolved issue**, and it interacts with the sole-trader decision (register item U5)
- [ ] Ask an accountant once about the reverse-charge treatment of Stripe's Irish invoices
- [ ] Start the monthly rolling-total spreadsheet of sole-trader taxable revenue
- [ ] Tax advice: sole-trader tax and NI exposure, VAT treatment of the Dono fee, refund tax treatment, pre-incorporation expenses
- [ ] Obtain insurance quotations — cyber and data, technology errors and omissions, media and IP, public liability. **Dono is currently uninsured and every document says so.** If cover is obtained, revisit ToS 27.3 and Privacy 14.2
- [ ] Confirm founder roles, intended ownership and vesting internally
- [ ] Incorporation, founder agreements, option agreements and a shareholders' agreement — deferred; the v2.3 suite is drafted so incorporation later needs no redraft

## Design / Product — outstanding

- [ ] **Remove every verification badge and trust indicator from the designs.** The badge set (Verified Student / Student Status Checked / Society Approved / Institutionally Endorsed) is **cancelled** — see `TRUTH.md`. Replace with neutral lifecycle states rendered without approving styling
- [ ] **Design the checkout legal identity panel** ("You're donating to") with all six mandatory fields, and the blocked state when a field is missing
- [ ] **Design the fee-cover checkout** showing Campaign contribution / Dono fee / Payment processing (paid by the campaign) / expected amount reaching the campaign — and copy that never says fee cover makes the full amount arrive
- [ ] Design the 18+ confirmation at checkout
- [ ] Design the reviewer dashboard and the moderation dashboard
- [ ] Design the report control, the logged-out reporting route and the appeals flow
- [ ] Design the cookie banner with **equally prominent** Accept and Reject, and the footer "Privacy and analytics settings" link
- [ ] Design the evidence-upload flow with mandatory pre-upload redaction guidance
- [ ] Design the society onboarding flow including the **separate, active limited-recourse acknowledgement**
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
| Decide the final fee structure | **5% + 20p flat** |
| Decide the exact platform fee percentage and fixed component | Same as above |
| Decide final permitted campaign categories | Personal, community, educational and student-society purposes only. Commercial, charitable, third-party and public-benefit fundraising prohibited |
| Set the under-spend de minimis threshold | **No de minimis** — the question disappears |
| Donor anonymity visibility rules | Settled and disclosed honestly, including what Dono cannot control |
| Evidence visibility and redaction rules; evidence and moderation retention | Settled; retention is risk-based in Privacy Notice clause 7.1 |
| Society officer evidence requirements and number of approvers | One approver; the society's own rules govern; £2,500/£10,000 bands removed |
| General information-request and refund-decision deadlines | 10 Working Days / 21 days with one 21-day extension |
| Age verification — whether Stripe DOB can be the 18+ gate | **No.** Self-certification at checkout; 18+ for donors and account holders |
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
| Charity and fundraising law | Resolved by prohibiting charitable and third-party fundraising |
| Consumer law characterisation | Settled: conditional contribution, consumer status by facts, three-tier liability. Counsel confirmation sought as Q6 and Q7 |
| Data protection specialist review | Addressed across the v2.3 suite; residual questions are Q8 and Q9 |
| Online Safety Act scope | Settled: in-scope user-to-user service; all public UGC launch-blocked pending the acceptance tests |
| Sole-trader risk review | Structure confirmed for beta; insurance gap recorded; incorporation path preserved |
