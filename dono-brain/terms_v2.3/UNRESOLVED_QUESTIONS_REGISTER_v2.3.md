# Dono v2.3 — Unresolved questions and decision register

**Version:** 2.3.1
**Version date:** 6 August 2026
**Revision note:** 2.3.1 closes U3 on the engineering evidence of 5 August 2026, and adds U9 to U12.
**Owner:** Amrit Kaur Rooprai

> **This register contains only matters that genuinely cannot be resolved from the repository or by reasonable legal judgement.** Everything capable of being decided has been decided and recorded in `00_v2.3_change_log.md`. Ordinary drafting choices, formatting and minor ambiguities are not here.
>
> **Three decisions raised during the v2.3 work were answered by the founder on 6 August 2026 and are now closed:** the society contracting model (limited recourse); surplus allocation (reverse chronological plus an individual right to claim); and fee cover (Dono's fee only). They appear in the change log, not here.

---

## U1 — Fairness of reverse-chronological surplus allocation

| | |
|---|---|
| **Decision required** | Whether to retain reverse-chronological automatic surplus allocation, given the residual fairness risk, or move to a claim-only model |
| **Why it cannot be resolved here** | It turns on how a court or the CMA would view an allocation rule that distributes a consumer's refund entitlement by donation timing. There is no directly applicable authority, and the position depends on Dono's risk appetite |
| **Affected** | ToS 14.5; Refund Policy 10.3; Student Campaign Terms 6; Donor Terms 10.1 |
| **Options** | **(a)** Keep as drafted — automatic reverse-chronological allocation **plus** an independent donor right to claim. **(b)** Claim-only: no automatic allocation; every donor is notified of surplus and refunded on request. **(c)** Pro rata — excluded by founder decision |
| **Consequences** | **(a)** Economic and simple; the individual right removes the substance of the unfairness, so the residual risk is that a term operating by timing alone is still challengeable under s62 CRA 2015 even though no donor is left without a remedy. **(b)** Cleanest fairness position; higher operational load and more sub-£1 refunds, each costing the Campaign Owner Stripe's fixed 20p |
| **Legally unavailable?** | No option is unavailable |
| **Recommendation** | **Keep (a).** The independent right to claim is the answer to the fairness objection. Ask counsel to pressure-test it (`QUESTIONS_FOR_LAWYER.md` Q4) |
| **Interim position** | (a), as drafted, with prominent checkout disclosure |
| **Blocks?** | Neither publication nor launch. A drafting refinement if counsel advises |

## U2 — Liability cap figures

| | |
|---|---|
| **Decision required** | Whether £2,500 (Society) and £1,000 (business user) are the right caps |
| **Why it cannot be resolved here** | The repository contains no basis for any figure. v2.2's £500 was expressly unapproved. The right number depends on Dono's risk appetite, its (nil) insurance and what a court would find reasonable under UCTA |
| **Affected** | ToS 27.3(b)–(c); Society Campaign Terms 1.9, 8.1 |
| **Options** | **(a)** As drafted. **(b)** Higher caps, improving UCTA reasonableness but increasing uninsured exposure. **(c)** No cap for Societies either, mirroring the consumer position |
| **Consequences** | A cap that is too low is more likely to be struck out entirely, leaving Dono with no cap at all. A cap set with no insurance behind it protects nothing in an insolvency. Beta exposure is low: commercial campaigns are prohibited, so genuine business users should be rare or absent |
| **Legally unavailable?** | No, but **a cap materially below the greater of £500 or twelve months' fees carries a real risk of being found unreasonable** |
| **Recommendation** | Keep as drafted for beta and ask counsel to confirm (`QUESTIONS_FOR_LAWYER.md` Q5). **Revisit the moment insurance is obtained** |
| **Interim position** | £2,500 / £1,000 as drafted |
| **Blocks?** | Neither. A solicitor sign-off item |

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
| **Consequences** | (a) leaves all regulatory, contractual and personal liability with one individual, uninsured. The suite is drafted so that (c) works: the Team Agreement assigns IP and permits onward assignment without further consent |
| **Legally unavailable?** | No |
| **Recommendation** | **(a) for beta, as instructed.** The drafting does not obstruct incorporation later. Resolve the immigration question separately — it is the more urgent one |
| **Interim position** | Sole trader throughout |
| **Blocks?** | Neither |

## U6 — What "physically studying in the UK" means for a student abroad

| | |
|---|---|
| **Decision required** | Whether a student on a year abroad, a placement or a field trip remains eligible |
| **Why it cannot be resolved here** | v2.2 said visiting students and students on placement are eligible if they meet the other requirements, while also requiring the Campaign Owner to be physically studying in the UK. **The two are not reconcilable for a student spending a year in another country** |
| **Affected** | ToS 4.5(c); Student Campaign Terms 2.1(c), 2.2 |
| **Options** | **(a)** Enrolment at a Recognised Institution is what matters; physical location does not. **(b)** Physical presence in the UK is required throughout, so a year abroad ends eligibility. **(c)** Enrolment plus a UK-resident Stripe account, which is the real constraint |
| **Consequences** | (b) excludes a meaningful group of legitimate students and is hard to verify. (c) reflects the actual limiting factor — Stripe requires a UK-established account — and is verifiable |
| **Legally unavailable?** | No |
| **Recommendation** | **(c).** It states the genuine constraint and is checkable |
| **Interim position** | Drafted as v2.2 had it, pending the decision. **This is a live internal inconsistency and should be closed before publication** |
| **Blocks?** | Publication of the Terms of Service and Student Campaign Terms — it is a two-line fix once decided |

## U7 — What happens to a Society's Connected Account balance when a representative leaves and will not cooperate

| | |
|---|---|
| **Decision required** | Whether Dono needs a stated position beyond "cooperate", where an outgoing representative refuses to hand over or return funds |
| **Why it cannot be resolved here** | Stripe cannot move a balance between connected accounts. Dono cannot compel it. The Society's remedy is against the individual, under the association's own rules and the general law — but the drafting does not currently say so plainly to the Society |
| **Affected** | Society Campaign Terms 6.3, 6.6 |
| **Options** | **(a)** As drafted: cooperation duty, Dono may block new campaigns, no promise of recovery. **(b)** Add an express statement that funds not returned are recoverable by the Society from the individual, and that Dono will provide records to support that claim. **(c)** Require societies to use an institutional or incorporated account, eliminating the problem |
| **Consequences** | (a) leaves a foreseeable dispute unaddressed in the contract. (b) costs two sentences and tells societies the truth. (c) is the structurally correct answer but depends on U3 |
| **Legally unavailable?** | No |
| **Recommendation** | **(b) now, (c) as the medium-term aim.** Add on the next revision unless counsel objects |
| **Interim position** | (a) |
| **Blocks?** | Neither |

## U8 — Whether a campaign funding an activity with public benefit is caught by the third-party prohibition

| | |
|---|---|
| **Decision required** | Where exactly the line falls between "the Society's own activity, which happens to benefit others" and "public-benefit fundraising", for borderline cases |
| **Why it cannot be resolved here** | ToS 8.4 draws the line by asking who the money and the funded assets are for, with worked examples and a carve-out for charitable *subject matter*. That resolves most cases. **The residual difficulty is a campaign whose entire output is given away** — for example a society funding a survey whose results are published, or building something it then donates |
| **Affected** | ToS 8.4; Student Campaign Terms 4.2; Society Campaign Terms 2.5; the reviewer checklist |
| **Options** | **(a)** As drafted, with reviewer discretion. **(b)** Add a bright line: if the funded asset will not belong to the Campaign Owner or Society at the end, it is prohibited. **(c)** Refuse every borderline case in beta |
| **Consequences** | (b) is easier to apply consistently and aligns with the Ownership Statement, which already asks who will own the output; it would exclude some genuine society activity. (c) is safest but arbitrary |
| **Legally unavailable?** | No |
| **Recommendation** | **(b), tied to the Ownership Statement**, with (c) applied where the reviewer remains unsure. This is a moderation-guidance decision rather than a redraft |
| **Interim position** | (a), with reviewers instructed to refuse if unsure |
| **Blocks?** | Neither. Affects reviewer guidance |

---

## U9 — Whether a community-fund charge has already been taken

| | |
|---|---|
| **Decision required** | Whether any charge has settled on Dono's own platform account through `createFundPaymentIntent`, and what follows if one has |
| **Why it cannot be resolved here** | It is a question about the live database, which the legal workstream cannot query. Seed data inserts funds, so rows may exist |
| **Affected** | ToS 4.2; change log §5 (the whole payment-services analysis); `TRUTH.md` no-pooled-funds decision |
| **Options** | **(a)** Query, find nothing, remove the path, record the result. **(b)** Query, find charges, take payments advice before beta |
| **Consequences** | Under (b) Dono has received donation funds into an account it controls, which is a live regulatory question rather than a design gap, and the perimeter analysis has to be redone on the facts |
| **Legally unavailable?** | Leaving the path live is not an option on any view |
| **Recommendation** | **Run the query today.** It is a few minutes' work and it determines whether this is a cleanup or an escalation |
| **Interim position** | Documents state that Dono holds no payment account. That is the target state and, once CF-01 is done, the actual state |
| **Blocks?** | **Blocks beta.** |

## U10 — Whether the identity check's verified date of birth should become the creator age gate

| | |
|---|---|
| **Decision required** | Whether to gate campaign and society creation on the **verified** date of birth rather than the self-declared one |
| **Why it cannot be resolved here** | It is a product decision with a trade-off: it is materially stronger, but it will exclude a creator whose document reads differently from their profile, and it needs a route for that person |
| **Affected** | Verification Notice 4.5; Student Campaign Terms 3.4; Children's Risk Assessment |
| **Options** | **(a)** Use the verified date of birth as the gate, with an appeal route where the two disagree. **(b)** Keep the declared date of birth as the gate and retain the verified one only as an administrative cross-check, as today |
| **Consequences** | (a) converts creator age from self-declaration to verification at no additional data cost — the data is **already collected and stored, and currently used for nothing**, which is the weakest possible position: the privacy cost has been incurred without the safety benefit. (b) leaves that anomaly in place |
| **Legally unavailable?** | No. Note that (a) does **not** make Dono's service age-assured for online-safety purposes — it applies to creators only, not to browsing |
| **Recommendation** | **(a).** Holding verified age data and not using it is difficult to justify under data minimisation |
| **Interim position** | Documents describe the declared gate and note that the verified date of birth is returned |
| **Blocks?** | Neither. Item AG-05 |

## U11 — Whether the beta may proceed on the stated timetable

| | |
|---|---|
| **Decision required** | Whether a real-user beta can run in the week following 5 August 2026, as the engineering evidence assumes |
| **Why it cannot be resolved here** | It is a founder's risk decision, not a legal one. But the legal position needs stating plainly so the decision is informed |
| **Affected** | Every document's approval block |
| **The position** | Live payment keys are enabled. Of the P0 items in the implementation checklist, **none is complete**. The specific items that make currently-live behaviour unlawful or untrue are CF-01, PF-12 and PF-13. Beyond those: no reporting system, no age gate on account creation or commenting, an attestation field that is a constant, no retention or deletion of any kind, no acceptance evidence linking a guest to their donation, and the served legal text is a draft stub rather than the approved suite |
| **Options** | **(a)** Delay the real-user beta until at least the CF, PF, AG and CH-15 items are done. **(b)** Run a closed demonstration with synthetic data, test-mode payments and no external sign-ups — which the legal review already said may proceed. **(c)** Proceed as planned |
| **Consequences** | (c) means taking real money on a fee model that risks being an unlawful surcharge, charging some donors more than they were shown, and doing so under legal text nobody has approved. **This is materially higher risk than any other option and I do not recommend it** |
| **Recommendation** | **(b) now, (a) for the real-user beta.** The demonstration route unblocks the commercial timetable without the exposure |
| **Blocks?** | This *is* the launch decision |

## U12 — Analytics retention: 12 months as stated, or a deliberate choice

| | |
|---|---|
| **Decision required** | Whether 12 months is the intended analytics retention, now that the documents have been aligned to the live setting |
| **Why it cannot be resolved here** | The 26-month figure in the previous documents appears to have been chosen deliberately at some point; the live setting has always been 12. One of them was an assumption and it is not clear which |
| **Affected** | Cookie Notice 3.5; Privacy Notice 7.1 |
| **Options** | **(a)** Keep 12 months, as now drafted and as the system does. **(b)** Set the project to 26 months and revert the documents |
| **Consequences** | (a) is more privacy-protective and requires no change beyond enabling enforcement. (b) requires a configuration change and a documented justification for the longer period |
| **Recommendation** | **(a).** Shorter is easier to justify and already true |
| **Blocks?** | Neither. Item CK-08 |

## Closed during the v2.3 work

| Ref | Question | Resolution | Date |
|---|---|---|---|
| C1 | Society contracting party and personal liability | Representative is the contracting party with express limited recourse | 6 Aug 2026, founder |
| C2 | Surplus allocation method | Reverse chronological plus an independent right to claim | 6 Aug 2026, founder |
| C3 | Fee cover scope | Dono's fee only; never the processing cost | 6 Aug 2026, founder |
| C4 | The under-spend de minimis threshold (v2.2 open item) | **No de minimis at all** — the question disappears | 6 Aug 2026, founder |
| C5 | Whether processor DPAs need wet signatures | No, where validly incorporated into the provider's online terms; recording acceptance is what matters | Lawyer wording already in the repository |
| C6 | Insurance position | No insurance documents exist and no policy is in force; documents state this plainly | 6 Aug 2026, repository review |
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
| Version | 2.3 |
| Version date | 6 August 2026 |
| Accountable owner | Amrit Kaur Rooprai |
| Review cadence | At each suite revision, and whenever an item is answered |
