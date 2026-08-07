# Dono v2.3 — Unresolved questions and decision register

**Version:** 2.3.3
**Version date:** 6 August 2026
**Revision note:** 2.3.3 closes U6–U10 and U12 on founder decisions and confirms zero previous payments. U4, U5 and U11 remain, although U4 and U5 primarily require external advice/action rather than product design.
**Owner:** Amrit Kaur Rooprai

> **This register contains only matters that genuinely cannot be resolved from the repository or by reasonable legal judgement.** Everything capable of being decided has been decided and recorded in `00_v2.3_change_log.md`. Ordinary drafting choices, formatting and minor ambiguities are not here.
>
> **The commercial decisions raised during the v2.3 work are now closed:** the society contracting model (limited recourse); surplus allocation (reverse chronological plus an individual right to claim); the liability-cap and indemnity structure; and fee cover (Dono's fee only). Counsel is being asked to confirm legal enforceability, not to make those commercial choices.

---

## U1 — CLOSED on 6 August 2026

**Surplus allocation is a final commercial decision:** automatic reverse-chronological allocation, never pro rata, plus every donor's independent right to claim their share, reconciled through one ledger so nothing is refunded twice. Counsel Q4 asks only whether the drafting and disclosure preserve that rule under the Consumer Rights Act 2015. It is not an open founder decision.

## U2 — CLOSED on 6 August 2026

**The liability and indemnity structure is a final commercial decision:** no consumer cap or indemnity; a Society cap of the greater of £2,500 or twelve months' fees; a business-user cap of the greater of £1,000 or twelve months' fees; and only the narrow specified third-party indemnities already drafted. Dono now holds the limited insurance recorded in `TRUTH.md`, but it does not determine whether a term is fair or enforceable. Counsel Q5 asks for that legal confirmation without reopening the figures or structure.

## U3 — CLOSED on 6 August 2026

**Whether an unincorporated Society can complete payment onboarding.** **Answered by the engineering evidence: yes.** The treasurer or principal officer onboards as a **sole trader in their own name** and holds the account for the society. That is option (a) as drafted, and Society Campaign Terms clause 1.4A now states it expressly, together with its consequences — the account is legally theirs, the provider's terms bind them personally, they may have their own HMRC obligations, and clause 1.6 limits Dono's recourse against them precisely because of this.

**One residual point, referred to counsel rather than left open here:** whether Dono should warn a student officer more strongly about registering as a sole trader, and whether that changes the fairness analysis on clause 1.6. See `QUESTIONS_FOR_LAWYER.md` Q3.

## U4 — ICO registration and the data-protection fee

| | |
|---|---|
| **Decision required** | Whether Dono must register with the ICO and pay the fee, and what tier |
| **Why it cannot be resolved here** | The Privacy Notice says the position has been assessed, but no self-assessment output is recorded in the repository |
| **Affected** | Privacy Notice 1.3 |
| **Options** | **(a)** Complete the ICO self-assessment and register if required. **(b)** Complete it and record the exemption relied on |
| **Consequences** | Failure to register when required is a civil offence attracting a fixed penalty. The cost is small; the risk of getting it wrong is asymmetric |
| **Legally unavailable?** | Not applicable |
| **Recommendation** | **Complete the self-assessment before launch and record the outcome**, whichever way it goes |
| **Interim position** | Clause 1.3 states the position neutrally and can stand |
| **Blocks?** | Launch, in practice — the cost of doing it is trivial |

## U5 — Sole trader versus incorporation

| | |
|---|---|
| **Decision required** | Whether to remain a sole trader |
| **Why it cannot be resolved here** | The founder has instructed that the structure stays a sole trader and that incorporation is not required. But `TODO.md` records an unresolved immigration question about student-visa founders, and an intention to incorporate in a later phase. **Those two positions are not consistent with each other over any horizon longer than beta** |
| **Affected** | ToS 1.1; every document naming the contracting party and the controller; the Team and Contributor Agreement clause 2.7 |
| **Options** | **(a)** Sole trader for beta, as instructed and as drafted. **(b)** Incorporate before launch. **(c)** Sole trader for beta with a planned assignment |
| **Consequences** | (a) leaves all regulatory, contractual and personal liability with one individual. Dono has limited insurance, subject to its terms and exclusions, but the sole trader remains personally exposed outside or above cover. The suite is drafted so that (c) works: the Team Agreement assigns IP and permits onward assignment without further consent |
| **Legally unavailable?** | No |
| **Recommendation** | **(a) for beta, as instructed.** The drafting does not obstruct incorporation later. Resolve the immigration question separately — it is the more urgent one |
| **Interim position** | Sole trader throughout |
| **Blocks?** | Neither |

## U6 — CLOSED on 6 August 2026

**Eligibility follows current enrolment, not physical location.** A student remains eligible while enrolled at a Recognised Institution even during a year abroad, placement, field trip or other temporary period outside the UK. A person who will hold a Connected Account must provide a valid UK address and satisfy the Payment Provider's UK onboarding requirements in their own name.

## U7 — CLOSED on 6 August 2026

**Replacement-account succession applies.** New Donations are suspended during a verified change or authority dispute. The successor completes fresh Dono/Payment Provider onboarding and opens a new Connected Account; future Donations use it. Existing funds and transactions remain with the outgoing account. The outgoing representative must account to the Society and lawfully apply, refund or transfer the funds. If they refuse, the Society enforces its rights against them. Dono preserves and provides records where lawful, may restrict or ban the outgoing representative and may make a proportionate referral, but does not move money, reimburse the Society or guarantee recovery.

## U8 — CLOSED on 6 August 2026

**A Society Campaign's primary purpose must advance the activities, members or legitimate objectives of the Society.** Incidental third-party benefit does not make it ineligible. A primarily external-benefit Campaign is permitted only where it is an official Society initiative that directly furthers the Society's charitable, educational, sporting, cultural or community mission and is approved, controlled and delivered by the Society rather than functioning as a pass-through.

---

## U9 — CLOSED on 6 August 2026

**The founder confirms that Dono has processed no payments.** No community-fund, platform-account, card-dependent or other payment has settled. The unsafe routes must still be removed before the first live payment, but there is no historic transaction population and no retrospective customer-remediation audit.

## U10 — CLOSED on 6 August 2026

**The Payment Provider's verified date of birth is the final age gate for Campaign and Society creators.** Missing, inconsistent and under-18 results fail closed. An apparent error has a documented review route, but Dono does not manually override an under-18 result without corrected Payment Provider data. This does not age-gate browsing or replace the separate Donor confirmation.

## U11 — Whether the beta may proceed on the stated timetable

| | |
|---|---|
| **Decision required** | Whether to authorise the first real-user Donation before or only after the P0 release evidence is complete |
| **Why it cannot be resolved here** | It is a founder's risk decision, not a legal one. But the legal position needs stating plainly so the decision is informed |
| **Affected** | Every document's approval block |
| **The position** | The founder confirms that **no payment has ever been processed**, so there is no historic customer population to audit or remediate. Everything specified to engineering is assumed to be built, but a promise to build it is not release evidence. Before the first real Donation the unused platform-account and variable-fee paths must be unreachable; the settled fee, age, checkout, acceptance, privacy, moderation and legal-publication gates must pass their stated tests |
| **Options** | **(a)** Make completion and sign-off of the P0 Release Control Matrix an absolute precondition to the first real-user Donation. **(b)** Run only a closed demonstration with synthetic data and test-mode payments until that sign-off. **(c)** Authorise real payments before the evidence exists |
| **Consequences** | (c) accepts avoidable consumer, payments, privacy, online-safety and contract-evidence risk on the assumption that promised systems work. Zero historic payments removes retrospective exposure but does not make the first unsafe payment acceptable |
| **Recommendation** | Adopt **(a)** as the release rule; use **(b)** in the meantime. If adopted, U11 can be closed without choosing a calendar date |
| **Blocks?** | This *is* the launch decision |

## U12 — CLOSED on 6 August 2026

**Analytics retention is 12 months.** Engineering must enable enforcement of that period and preserve the consent, withdrawal and deletion evidence required by the privacy narrative.

## Closed during the v2.3 work

| Ref | Question | Resolution | Date |
|---|---|---|---|
| C1 | Society contracting party and personal liability | Representative is the contracting party with express limited recourse | 6 Aug 2026, founder |
| C2 | Surplus allocation method | Reverse chronological plus an independent right to claim | 6 Aug 2026, founder |
| C3 | Fee cover scope | Dono's fee only; never the processing cost | 6 Aug 2026, founder |
| C4 | The under-spend de minimis threshold (v2.2 open item) | **No de minimis at all** — the question disappears | 6 Aug 2026, founder |
| C5 | Whether processor DPAs need wet signatures | No, where validly incorporated into the provider's online terms; recording acceptance is what matters | Lawyer wording already in the repository |
| C6 | Insurance position | Policy in force 4 Aug 2026–3 Aug 2027 with technology PI, cyber/data, cyber-crime, legal-protection and crisis-containment cover, subject to limits, excesses and exclusions; no separate public-liability or cyber business-interruption cover is shown | 6 Aug 2026, policy review |
| C7 | Whether the refund mandate creates an FCA perimeter problem | Analysed; no payment service provided; residual PIS characterisation risk is low. Counsel confirmation sought | 6 Aug 2026 |
| C8 | Whether an unincorporated society can complete payment onboarding (U3) | **Yes** — the representative onboards as a sole trader. Society Terms clause 1.4A | 6 Aug 2026, engineering evidence |
| C9 | Whether Dono can technically execute a refund on a connected account | **Yes** — confirmed, and already used for one internal path. The refund mandate is implementable | 6 Aug 2026, engineering evidence |
| C10 | The verification model | Payment Provider's identity check retained; Dono's own identity-document storage removed; student status by email | 6 Aug 2026, founder |
| C11 | Society-level recurring subscriptions | Removed, as originally instructed, despite being live | 6 Aug 2026, founder |
| C12 | Whether individual campaigns exist at beta | No — society-only for beta, individual campaigns within weeks. Legal infrastructure retained and kept sound | 6 Aug 2026, founder |

---

## Approval and version control

| Field | Entry |
|---|---|
| Document | Unresolved questions and decision register |
| Version | 2.3.3 |
| Version date | 6 August 2026 |
| Accountable owner | Amrit Kaur Rooprai |
| Review cadence | At each suite revision, and whenever an item is answered |
