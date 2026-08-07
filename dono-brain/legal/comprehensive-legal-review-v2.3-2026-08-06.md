# Dono legal suite v2.3 — comprehensive pre-launch review

**Review date:** 6 August 2026  
**Product evidence cut-off:** `TRUTH.md` as reviewed on 6 August 2026  
**Jurisdictional focus:** England and Wales / United Kingdom  
**Status:** Pre-launch review with authoritative revision 4 addendum; not a substitute for advice from Dono's instructed UK solicitor

## 0. Revision 4 addendum — final founder decisions and build-assumed rating

**This section is authoritative where it conflicts with the historical baseline findings below.** The detailed issue register is preserved because it explains why each engineering and legal gate exists. The current judgement applies the founder's instruction to assume that every requirement communicated to engineering will be built and pass its stated acceptance test before the first real-user Donation.

### Revised judgement and rating

On that assumption, the position changes from **not launch-ready** to **a legally plausible, conditionally launchable Society beta**. The main defect is no longer an incoherent commercial model or missing product specification. It is completion evidence, clean consolidation of the legal text and targeted professional sign-off.

**Rating: 78/100.** This is a rating of the proposed stack after the engineering pack is implemented, not of today's unverified deployment.

| Area | Score | Current judgement |
|---|---:|---|
| Core product and economic model | 18/20 | Society-only beta, direct charges, payer allocation, succession, eligibility and campaign-purpose rules are now settled |
| Payments and consumer pricing | 15/20 | Method-neutral 2% + 20p demo / 5% + 20p production model is coherent; counsel must confirm the FCA perimeter and the “Payment processing fee (Dono)” presentation |
| Contract model and drafting | 15/20 | Core allocation is workable, but counsel confirmation and clean consolidated instruments remain necessary |
| Privacy and data governance | 13/15 | One engineering narrative, 12-month analytics retention and the creator-DOB flow are coherent; DPIA/provider evidence and approval remain |
| Online safety and CSEA | 10/15 | The build specification and launch gate are strong; current risk-assessment sign-off and NCA access/testing remain external dependencies |
| Governance and release control | 7/10 | The evidence model is specified; contributor execution, ICO outcome and release sign-off remain |

### Decisions now closed

- **Payments history:** Dono has processed no payment. “Historic payment audit” meant checking whether the unused unsafe routes had created any past charge requiring refunds, disclosure or remediation. The founder's authoritative zero-payment confirmation closes that exercise. Only removal and negative testing before the first payment remain.
- **Demo fee:** 2% + 20p, locked to the Campaign, borne by the Campaign Owner unless the Donor actively covers it, displayed as **“Payment processing fee (Dono)”**, and distinguished from Stripe's actual processing cost. Production remains 5% + 20p.
- **Society succession:** new Donations pause; the successor completes fresh onboarding and opens a new Connected Account; future Donations use it; historic funds, transactions, refunds and disputes remain with the outgoing holder. Dono never transfers an account or balance and does not guarantee recovery.
- **Creator age:** the Payment Provider's verified date of birth is the fail-closed final creator gate. Donor age remains active self-certification.
- **Eligibility:** current enrolment controls eligibility even while the student is outside the UK; a Connected Account holder needs a valid UK address and must satisfy the Payment Provider's UK onboarding.
- **Society purpose:** incidental third-party benefit is permitted. Primarily external benefit requires an approved, controlled official Society initiative that directly furthers the Society's charitable, educational, sporting, cultural or community mission. Pass-through fundraising remains prohibited.
- **Analytics:** 12-month retention.
- **Launch scope:** Society Campaigns only during beta; individual Campaigns are a later release.

### Remaining launch blockers under the build assumption

1. **Clean legal consolidation — drafting blocker.** Carried-forward amendment blocks and stale historical bodies must be replaced by clean, immutable public instruments and an approved version manifest. Users must never be asked to work out which overlay prevails.
2. **Targeted solicitor confirmation — high-risk confirmation, not a product redesign.** Confirm the direct-charge/refund-mandate FCA perimeter; fee label/optional cover; Society contracting, limited recourse and succession; the official-initiative charity/fundraising boundary; consumer contract formation; liability drafting; Article 14/APD conditions; and publication readiness.
3. **Privacy evidence and approval — operational/legal blocker.** Complete provider DPAs/role mapping/transfer assessments, verify the implemented data flow and retention, re-score and sign the DPIA, and complete the ICO fee self-assessment. Consult the ICO only if a high residual risk remains after mitigation.
4. **Online Safety/CSEA evidence — operational blocker.** Re-perform and approve the risk assessments against the completed system. Complete NCA registration/user confirmation, training and an end-to-end test before claiming the CSEA route is ready.
5. **Release governance — operational blocker.** Execute contributor/IP/confidentiality agreements, appoint the release owner, populate the Release Control Matrix and require the recorded legal/technical approvals before live mode.

### Only remaining founder decision

Adopt the proposed U11 release rule: **no first real-user Donation until every P0 item has passed its acceptance test and the Release Control Matrix is signed.** Until then, demonstrations use synthetic data and test-mode payments. The remaining matters above are professional confirmations or completion evidence, not unresolved product design choices.

## 1. Executive conclusion

The v2.3 legal suite is **not ready to publish and does not yet accurately describe the product**. The central problem is not a shortage of legal drafting. The suite describes a mature compliance and operational system—contract version capture, fee disclosure, age gates, evidence workflows, refund execution, moderation, reporting, CSEA escalation, retention automation, incident response, and wind-down controls—that `TRUTH.md` says does not exist.

There are also live or historically live implementation facts that require urgent legal resolution rather than drafting alone:

1. an unauthenticated payment path can create charges on Dono's own Stripe platform account;
2. the fee actually charged is a card-dependent Stripe amount, not the contractual 5% + 20p fee;
3. Dono's own identity-document upload remains in the product despite public statements that Dono never receives identity documents;
4. the launch model is Society-only, but the public suite offers both Student and Society campaigns;
5. the Society contracting and connected-account model has not been legally settled;
6. public user-generated content cannot safely be offered because the Online Safety Act controls and risk records are not implemented;
7. the DPIA records residual high risks, is stale and unsigned, while the public privacy materials claim compliance; and
8. the contributor/IP and release-control arrangements are unexecuted or absent.

On the present evidence, Dono should not open a real-user, real-money beta until the Critical items in section 3 are closed and evidenced in the Release Control Matrix. The commercially pragmatic route is a deliberately narrow beta: Society campaigns only, adults only, UK campaign owners, Stripe Standard direct charges only, no recurring donations, no match windows, no Dono ID upload, and no public UGC other than the minimum campaign content that is manually approved before publication. The documents should describe only that product.

## 2. Scope, method and legal-source limitation

This review read and cross-referenced all 39 items in `terms_v2.3/`, including the APD activity-mapping workbook, together with `TRUTH.md`, `TODO.md` and `QUESTIONS_FOR_LAWYER.md`. Those materials were treated as a single evidence set, with `TRUTH.md` controlling where product facts conflict.

The review traced the visitor → account → Society campaign → donation → evidence → complaint/refund → termination journey and compared:

- public promises;
- internal policies and risk assessments;
- engineering and operational requirements;
- stated current implementation;
- open founder and solicitor questions; and
- current primary UK regulatory guidance.

The Midpage surface available in this workspace is a US case-law research tool. It is not an appropriate authority for UK statutory and regulatory questions, so it was not used to manufacture inapplicable US citations. Current-law checks below use official UK legislation, regulator and government sources, plus Stripe's primary product documentation. A UK solicitor must determine the contested perimeter and contract-characterisation questions identified here.

## 3. Launch blockers

| ID | Blocker | Minimum close condition |
|---|---|---|
| L-01 | No reliable contract formation, version capture or durable-copy system; the served legal page is a stub | Publish clean approved documents; bind immutable version IDs; record acceptance; deliver/retrieve a durable copy for account holders and guest donors |
| L-02 | Live Dono platform-account charge path and unresolved payment-services perimeter | Disable the path; audit all historical charges; obtain solicitor advice on Q12/Q1; document remediation |
| L-03 | Actual mandatory charge conflicts with every fee promise and may be an unlawful payment surcharge | Stop the card-dependent pass-through or obtain advice and rebuild compliant pricing; remediate past transactions; show the total price before payment |
| L-04 | Society-only product conflicts with both campaign products being offered in public terms | Remove/suspend Student Campaign Terms and all individual-campaign references for beta |
| L-05 | Society representative is treated as sole trader/payee without a settled authority, liability, tax or Stripe-account model | Solicitor-approved Society structure and onboarding; authority evidence; connected-account classification; succession process |
| L-06 | Public UGC is legally documented but the required reporting, moderation and risk-control system is absent | Disable public comments and unreviewed public content; complete current OSA assessments and implement a minimal report/remove/complain path before any UGC is enabled |
| L-07 | CSEA reporting procedure is not operational and named portal users may not meet the portal's employee requirement | Confirm registration and user eligibility with NCA; appoint eligible users; train/test the route; keep evidence |
| L-08 | DPIA is stale, unsigned, internally records high residual risks, and is contradicted by actual processing | Replace with a factual DPIA; implement mitigations; obtain approval; consult the ICO before processing if high residual risks remain |
| L-09 | Dono ID-document upload remains live while public documents deny it | Remove and delete/quarantine existing ID data under a documented plan, or redesign the notices and processing lawfully before use |
| L-10 | Evidence, immutable donation snapshot, closure, refund and dispute state do not exist | Either build the minimum end-to-end workflow or simplify the legal promise and operate a documented manual process with records before real donations |
| L-11 | Special-category and criminal-offence data mapping relies on conditions that do not apply before publication | Prevent collection at draft stage or establish a valid Article 9/Schedule 1 condition and rewrite the APD/ROPA/DPIA |
| L-12 | Team/IP agreements are unexecuted; there is no code review or release owner | Execute legally effective IP/confidentiality/access arrangements; identify release owner; require reviewed deployments |
| L-13 | The document set contains unreconciled amendment blocks and contrary operative text | Produce clean consolidated v2.4 instruments; no reader should have to decide whether an amendment block or the body controls |

## 4. Detailed issue register

### L-01 — Contract formation, legal-page delivery and version evidence are not implemented

- **Reference:** Terms of Service clauses 1.6–1.9, 2, 11.5 and 30; Donor Terms clauses 1, 5 and 7; Society Terms clause 8; Engineering Checklist section C; Society Onboarding Forms section 8.3; `TRUTH.md` “Contract evidence and versioning”; `QUESTIONS_FOR_LAWYER.md` Q15; `TODO.md` legal gate.
- **Severity:** Critical
- **Category:** Contract / Consumer / Operational
- **Issue:** The suite promises document-specific acceptance records, version IDs, timestamps, durable copies, guest-donor term links and donation-time disclosure. `TRUTH.md` says there is a mutable version string, no guest acceptance link, no durable-copy delivery, no acceptance view, and a served legal stub.
- **Why it matters:** Dono may be unable to prove which terms were incorporated for an account, campaign or donation. Material refund, fee, liability and data terms may therefore be unenforceable. Online traders must provide prescribed pre-contract information and confirmation on a durable medium where the Consumer Contracts Regulations apply; official guidance describes those duties for online selling. [GOV.UK online and distance selling guidance](https://www.gov.uk/online-and-distance-selling-for-businesses)
- **Recommended solution:** Before taking real donations, publish one clean public set, assign immutable version IDs and hashes, capture the exact documents/versions accepted at account creation, Society onboarding and checkout, store timestamp/user/donation identifiers, and make the accepted copy downloadable or email it. Preserve the exact campaign representation shown at donation time. Ask counsel Q15/Q7 which interactions form consumer contracts and tailor the evidence accordingly.
- **Fix requires:** Legal drafting, engineering changes, operational changes and clarification from the founders.

### L-02 — The suite systematically promises controls that do not exist

- **Reference:** Terms of Service clauses 6, 10, 13–15, 17–25 and 31; Donor Terms clauses 9–12; Community Guidelines clauses 7–8; Verification Notice; Refund Policy; Privacy Notice; all operational policies; Engineering Checklist; `TRUTH.md` throughout.
- **Severity:** Critical
- **Category:** Consumer / Drafting / Operational / Commercial
- **Issue:** The public suite states current facts using “we do” language for alerts, dashboards, reports, evidence review, refunds, suspension, notices, settings, archives, exports and monitoring that are only target features or internal specifications.
- **Why it matters:** These are actionable consumer representations, not harmless aspirations. The current unfair-commercial-practices regime prohibits misleading actions and omissions, and complaint or performance arrangements that differ from published practice are material. [CMA unfair commercial practices guidance](https://www.gov.uk/government/publications/unfair-commercial-practices-cma207/unfair-commercial-practices)
- **Recommended solution:** Apply a strict drafting rule: public documents may state only Current facts in `TRUTH.md`; Target items stay in an implementation backlog. For beta, remove most workflow detail and say what narrow manual route actually exists, including realistic response times and no promise of a particular outcome. Build only the controls separately identified as legal launch conditions.
- **Fix requires:** Legal drafting, engineering changes and operational changes.

### L-03 — Campaign scope is internally contradictory

- **Reference:** Terms of Service clauses 3 and 4.8; all Student Campaign Terms; Society Terms; Privacy Notice; Geographic Scope Assessment; `TRUTH.md` “Who is who”; `TODO.md`; Unresolved Register U11.
- **Severity:** Critical
- **Category:** Contract / Consumer / Commercial
- **Issue:** The public suite presents Student Campaigns and Society Campaigns as available products. `TRUTH.md` says beta is Society-only and individual campaigns are a future feature.
- **Why it matters:** A user cannot determine eligibility, contracting party, beneficial owner, liability or data flow. The individual product also drives many stale assumptions about student cards, personal ownership, graduation and consumer status.
- **Recommended solution:** For beta, withdraw `02_dono_student_campaign_terms_v2.3.md` from the public hierarchy and delete/suspend every individual-campaign reference. Mark the file explicitly “future—not operative” internally. Reintroduce only after product, consumer-status, verification and payment design are reviewed.
- **Fix requires:** Legal drafting and engineering changes.

### L-04 — Adult-only policy has no reliable age gate

- **Reference:** Terms of Service clauses 4–6 and 11; Donor Terms clause 2; Verification Notice; Children's Risk Assessment; DPIA sections 2.4 and 6; Online Safety Traceability OS-036; Engineering Checklist EL-02; `TRUTH.md` “Age”; `TODO.md` closed age item; Unresolved Register U10.
- **Severity:** High
- **Category:** Consumer / Children / Operational / GDPR
- **Issue:** The documents say account holders and donors are 18+, but `ageAttested` is hard-coded true and no account, checkout or comment gate exists. Internal documents alternatively refer to under-18 donations, parental permission, adult-only access, and verified DOB.
- **Why it matters:** The contractual eligibility rule is ineffective, minors may transact, and child-access/data assessments use the wrong journeys. Browsing remains open to children, so the ICO Children's Code cannot be dismissed merely because adults are the target audience. [ICO Children's Code introduction](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/introduction-to-the-childrens-code)
- **Recommended solution:** Implement a real 18+ self-attestation at account creation and every guest checkout; use Stripe-verified DOB only for creator eligibility if counsel and privacy design approve it. Remove all parental-permission and child-donor drafting. Complete separate child-access assessments for browsing/public content. Do not claim age verification stronger than self-attestation.
- **Fix requires:** Legal drafting, engineering changes and operational changes.

### L-05 — A live platform-account payment path creates an unresolved regulatory and liability perimeter

- **Reference:** Terms of Service clauses 4.9, 15 and 16; Donor Terms clauses 4–6; Change Log sections 5 and 8; Fee Note; Financial Crime Policy; `TRUTH.md` “Money”; `QUESTIONS_FOR_LAWYER.md` Q12 and Q1; `TODO.md` top legal item.
- **Severity:** Critical
- **Category:** Payments / FCA / Financial Crime
- **Issue:** An unauthenticated route can create payment intents on Dono's own Stripe platform account rather than a Society's connected account. The public suite says all funds go directly to the Recipient and Dono never holds or controls donations.
- **Why it matters:** The factual premise of the suite's FCA analysis is false for that route. FCA guidance warns that an online fundraising platform that accepts and transmits donations generally cannot assume the commercial-agent or non-profit exclusions; donation crowdfunding may also involve regulated payment services. [FCA PERG 15.5](https://handbook.fca.org.uk/handbook/perg15/perg15s5), [FCA crowdfunding guidance](https://www.fca.org.uk/investsmart/understanding-crowdfunding)
- **Recommended solution:** Disable the path immediately and assert server-side that every beta donation is a Standard connected-account direct charge. Audit Stripe and the database for every historical platform-account charge, amount, fee, refund, dispute and destination; do not silently reallocate money. Give the evidence to counsel under Q12/Q1 and follow the advised remediation and communications.
- **Fix requires:** Engineering changes, operational changes, legal drafting and clarification from the founders/solicitor.

### L-06 — The fee model is factually false and creates surcharge and price-transparency risk

- **Reference:** Terms of Service clause 16; Donor Terms clause 6; Society Terms; checkout forms; Fee Note sections 1–4; Change Log sections 7–8; Geographic Scope Assessment; `TRUTH.md` “Money”; `QUESTIONS_FOR_LAWYER.md` Q13/Q2; `TODO.md`.
- **Severity:** Critical
- **Category:** Payments / Consumer / Commercial
- **Issue:** The documents say Dono charges 5% + 20p, while `TRUTH.md` says the live charge is a card-dependent Stripe processing amount, with no cap, and the intended platform fee is not implemented. The Change Log and internal fee note themselves disagree over which statement is the correction.
- **Why it matters:** A mandatory card-dependent add-on may be a prohibited payment surcharge and is not the promised price. Current CMA guidance requires the total upfront price, or a prominent method of calculation where genuinely variable; enforcement exposure under the DMCC regime is substantial. Regulation 6A prohibits certain payment-instrument fees. [Consumer Rights (Payment Surcharges) amendment inserting regulation 6A](https://www.legislation.gov.uk/uksi/2017/752/pdfs/uksi_20170752_en.pdf), [CMA price-transparency guidance](https://www.gov.uk/government/publications/price-transparency-cma209/providing-clear-and-accurate-information-about-prices-summary)
- **Recommended solution:** The safest beta design is to remove the donor-side card-cost pass-through, use a disclosed fixed Dono service price agreed with counsel, and let the connected account bear Stripe processing costs. If founders want another model, obtain written Q2/Q13 advice before use. Show one total payable amount and who receives each component before the payment button. Audit and obtain advice on refunds/communications for past donations.
- **Fix requires:** Engineering changes, legal drafting, operational changes and clarification from the founders/solicitor.

### L-07 — Stripe payment mechanics, refunds and Dono's “mandate” are not aligned

- **Reference:** Terms of Service clauses 13 and 15; Donor Terms clauses 10–12; Refund Policy sections 4–9; Refund Decision Checklist; Society Terms clauses 4 and 7; `TRUTH.md` refund/dispute facts; `QUESTIONS_FOR_LAWYER.md` Q1.
- **Severity:** Critical
- **Category:** Payments / FCA / Operational
- **Issue:** The suite establishes a broad contractual refund mandate but the workflow, refund execution, application-fee reversal, pending-balance handling and dispute state are absent. Some documents say Dono cannot execute refunds, while Stripe's direct-charge API permits the platform to create a refund on the connected account; application fees are not automatically returned.
- **Why it matters:** Donors may receive inconsistent remedies, a connected account may lack balance, and the contractual control Dono reserves must be assessed in the FCA perimeter. Stripe states that direct charges live on the connected account and that application-fee refunds require separate action. [Stripe direct charges](https://docs.stripe.com/connect/direct-charges), [Stripe Connect charge types and balances](https://docs.stripe.com/connect/charges?locale=en-GB)
- **Recommended solution:** After Q1 advice, define a narrow refund decision right and implement one tested execution path: conflict check, decision record, connected-account refund, platform-fee/application-fee handling, insufficient-balance state, donor/representative notice and appeal. Remove statements that Dono is technically unable to refund. Add dispute/chargeback webhooks and state.
- **Fix requires:** Legal drafting, engineering changes, operational changes and solicitor clarification.

### L-08 — Donation characterisation and consumer-law treatment remain unresolved

- **Reference:** Terms of Service clauses 11–13 and 27; Donor Terms clauses 3, 9–10 and 14; Refund Policy; `QUESTIONS_FOR_LAWYER.md` Q6/Q7; Unresolved Register U2.
- **Severity:** High
- **Category:** Consumer / Contract / Commercial
- **Issue:** The suite calls the payment a conditional gift to the Recipient, but also creates detailed platform services, evidence promises and refund rights. It does not settle who contracts with whom, what service Dono supplies to a donor, whether and when the Consumer Contracts Regulations apply, or which statutory rights cannot be excluded.
- **Why it matters:** Labelling does not determine legal substance. The answer affects pre-contract disclosure, cancellation, performance, remedies, liability caps, governing law and ADR.
- **Recommended solution:** Obtain Q6/Q7 advice on the exact three-party model. Then use one consistent formulation across checkout and all terms: donor–Recipient donation terms, Dono–donor platform terms, formation moment, absence/presence of reward, statutory-right savings and any cancellation exception. Do not state a legal conclusion more strongly than counsel supports.
- **Fix requires:** Legal drafting and clarification from the solicitor/founders.

### L-09 — Donation-time campaign evidence and the promised evidence/refund lifecycle do not exist

- **Reference:** Terms of Service clauses 9–14; Donor Terms clauses 9–12; Student Terms clauses 7–11; Society Terms clause 4; Refund Policy sections 3–12; Evidence Review and Closure Procedure; Refund Checklist; `TRUTH.md` “Money” and “Safety and process”.
- **Severity:** Critical
- **Category:** Contract / Consumer / Operational
- **Issue:** Dono does not preserve the campaign representation on which each donation was made. Evidence status, deadlines, reminders, closure, immutable records, refund intake, appeal and dispute state are target features only.
- **Why it matters:** A later campaign edit can change the apparent basis of an earlier donation. Dono cannot fairly decide breach, misrepresentation or refund entitlement without contemporaneous evidence, and cannot substantiate the detailed public process.
- **Recommended solution:** Minimum beta: immutable donation snapshot; campaign version/hash; manual evidence upload restricted to needed fields; reviewer and conflict record; decision log; donor/representative notices; refund execution state; retention rule. If any part is not built, remove the corresponding public promise and cap beta activity to what a manual process can support.
- **Fix requires:** Engineering changes, operational changes and legal drafting.

### L-10 — Surplus, partial funding, matching, recurring and overfunding rules contradict the product

- **Reference:** Terms of Service clauses 8.6 and 14; Student Terms clauses 5–6; Society Terms clauses 4–5; Donor Terms clauses 9–10; Refund Policy section 10; Refund Checklist; `TRUTH.md` “Money”; `QUESTIONS_FOR_LAWYER.md` Q4; Unresolved Register U1.
- **Severity:** High
- **Category:** Consumer / Payments / Commercial
- **Issue:** The suite says no recurring donations or match windows and, in places, no overfunding. `TRUTH.md` says recurring donations and match windows are live, overfunding has no cap, and surplus uses an unresolved reverse-chronological rule.
- **Why it matters:** These are material payment and remedy terms. Reverse-chronological refunds can treat otherwise identical donors differently and may be unfair if not prominently agreed and objectively justified.
- **Recommended solution:** Disable recurring and matching for beta as already intended. Implement a hard target cap or obtain Q4 advice and choose a simple pro-rata surplus rule. State partial-funding and failed-campaign consequences once, consistently, at checkout. Preserve a record of any legacy recurring/match commitments.
- **Fix requires:** Engineering changes, legal drafting and founder/solicitor clarification.

### L-11 — Liability caps and indemnities are inconsistent and may be unfair

- **Reference:** Terms of Service clauses 27–28; Student Terms clause 11; Society Terms clauses 1, 4 and 7; Donor Terms clause 14; Unresolved Register U2; `QUESTIONS_FOR_LAWYER.md` Q3/Q5.
- **Severity:** High
- **Category:** Consumer / Contract / Commercial
- **Issue:** Caps vary by user and claim without a completed fairness analysis; the Society representative is described as having limited personal exposure but is also subject to broad authority/refund indemnities. The main Terms say consumer representatives are not asked to indemnify Dono, while Society Terms do so.
- **Why it matters:** Consumer terms must be transparent and fair, and liability exclusions cannot remove mandatory rights. A headline of “limited recourse” may be misleading where third parties, Stripe or association members can pursue the representative. The CMA's unfair-terms guidance is current as of July 2026. [CMA unfair contract terms guidance](https://www.gov.uk/government/publications/unfair-contract-terms-cma37)
- **Recommended solution:** Counsel should set one cap architecture after classifying each party as consumer/business. Delete consumer indemnities unless narrowly justified; preserve non-excludable liability and statutory rights. Explain third-party exposure separately from Dono's own recourse.
- **Fix requires:** Legal drafting and solicitor clarification.

### L-12 — Society contracting party, authority and connected-account ownership are unsettled

- **Reference:** Society Terms clauses 1–8; Society Onboarding/Succession Forms sections 8.1–8.3; Terms of Service clauses 3, 7 and 15; `TRUTH.md` “Who is who”; `QUESTIONS_FOR_LAWYER.md` Q3; Unresolved Register U7.
- **Severity:** Critical
- **Category:** Contract / Payments / Commercial / Tax
- **Issue:** The suite treats one representative as the sole contracting party for an unincorporated Society and proposes opening the Stripe connected account in that person's name as a sole trader. Authority, beneficial ownership, member liability, tax treatment, succession and control of the balance are not settled. The intended “representative contracting” flow is not implemented.
- **Why it matters:** An unincorporated association has no separate legal personality; members or officers may be personally responsible for contracts and debts. A document cannot safely declare all other members non-liable without analysing who authorised and entered each obligation. [GOV.UK unincorporated associations guidance](https://www.gov.uk/unincorporated-associations)
- **Recommended solution:** Obtain Q3 advice before onboarding. Define the authorised contracting persons, evidence of committee mandate, recipient/beneficial owner, Stripe account type, tax reporting, access, succession and deadlock. If Stripe cannot support the intended structure, use only incorporated Societies or another legally supportable recipient class for beta.
- **Fix requires:** Legal drafting, operational changes, engineering changes and solicitor/founder clarification.

### L-13 — VAT and tax statements are too categorical

- **Reference:** Society Terms clauses 1 and 8; Fee Note; Geographic Scope Assessment; Financial Crime Policy; `TRUTH.md` entity/money facts; `QUESTIONS_FOR_LAWYER.md` “Also worth your eye”.
- **Severity:** High
- **Category:** Tax / Commercial / Payments
- **Issue:** The suite implies donations and Dono's fee are outside VAT or that VAT consequences are straightforward. The economic character of conditional donations, benefits/rewards, platform fees and a representative's sole-trader account has not been established.
- **Why it matters:** HMRC treats a freely given donation with nothing supplied in return differently from consideration for a supply; crowdfunding VAT is fact-specific. The current VAT registration threshold is £90,000, but registration and liability questions are distinct. [HMRC crowdfunding VAT manual](https://www.gov.uk/hmrc-internal-manuals/vat-finance-manual/vatfin5550), [HMRC donations manual](https://www.gov.uk/hmrc-internal-manuals/vat-charities-manual/vchar9200), [GOV.UK VAT thresholds](https://www.gov.uk/how-vat-works/vat-thresholds)
- **Recommended solution:** Replace legal conclusions with a neutral statement that users remain responsible for their tax position. Obtain accountant/solicitor advice on Dono's fee and the Society account model before launch; prevent rewards/benefits in beta unless separately reviewed.
- **Fix requires:** Legal drafting, operational changes and professional clarification.

### L-14 — Dono's own identity-document upload contradicts the public notices

- **Reference:** Terms of Service clause 6.3; Verification Notice clauses 2–4; Privacy Notice clauses 3, 5 and 7; DPIA section 2.1; ROPA; DPA Register; `TRUTH.md` “Verification” and “Data protection”; `QUESTIONS_FOR_LAWYER.md` Q14.
- **Severity:** Critical
- **Category:** GDPR / Identity / Consumer
- **Issue:** The public suite says identity checking occurs only at Stripe and Dono does not receive ID documents. `TRUTH.md` says Dono's own ID upload remains and must be removed. `TRUTH.md` is itself contradictory because one “Current” statement says Dono never receives ID while earlier current facts describe the upload.
- **Why it matters:** Identity documents are high-risk data. The processing lacks an accurate notice, necessity assessment, retention/deletion path, access model and processor/transfer mapping. Publishing the current notice would be misleading.
- **Recommended solution:** Remove the Dono upload before beta, block new files, inventory existing copies and backups, restrict access, document deletion/quarantine and notify affected users if counsel considers it necessary. Correct `TRUTH.md` so the historical/current/target position is unambiguous. Ask Q14 what Stripe verification outputs Dono retains and map only those fields.
- **Fix requires:** Engineering changes, operational changes, legal drafting and solicitor clarification.

### L-15 — University-email verification is described as current but is not built

- **Reference:** Terms of Service clause 6.2; Student Terms clauses 2–3; Verification Notice clause 3; Engineering Checklist EL-03; Change Log F41; `TRUTH.md` “Verification”.
- **Severity:** High
- **Category:** Consumer / Operational / Drafting
- **Issue:** Public and internal documents alternate between university email as the sole eligibility test and a two-check university-email plus Stripe-identity model. `TRUTH.md` says university-email verification is not implemented. The product is Society-only, making much of the student verification flow irrelevant for beta.
- **Why it matters:** A verification badge or approval statement would misrepresent what was checked and create reliance by donors.
- **Recommended solution:** Remove Student campaign verification from beta documents. For Society campaigns, describe only the actual human Society approval and Stripe's own connected-account onboarding; state the limits of each. Do not display a verified label without a precise, recorded meaning.
- **Fix requires:** Legal drafting and engineering changes.

### L-16 — Retention, deletion, archive and data-subject-rights promises are not operational

- **Reference:** Terms of Service clauses 21 and 31; Privacy Notice clauses 7, 13–14; Cookie Notice clauses 4–5; ROPA; DPIA; Evidence Procedure; `TRUTH.md` “Data protection”; Engineering Checklist H.
- **Severity:** Critical
- **Category:** GDPR / Operational
- **Issue:** The suite gives detailed retention periods, deletion outcomes, consent withdrawal, archive/export and rights workflows. `TRUTH.md` says there are no retention jobs, deletion only anonymises part of the account, backups are unknown, redaction/quarantine is absent, analytics withdrawal metadata is incomplete and the campaign archive is not built.
- **Why it matters:** A retention schedule is not compliant merely because it is written. False deletion and security assurances create regulatory and consumer risk, and minimisation/erasure decisions cannot be evidenced.
- **Recommended solution:** Build a data inventory and executable retention schedule for the narrow beta. Define deletion by data class, backup treatment, legal holds and DSAR search/export. Use a short manual deletion runbook initially if volumes permit, with owner, log and recurring review. Rewrite the notice to the implemented state.
- **Fix requires:** Engineering changes, operational changes and legal drafting.

### L-17 — The DPIA cannot support launch

- **Reference:** DPIA sections 2–8 and its amendment block; Children's Risk Assessment; Illegal-Content Risk Assessment; ROPA; APD; Privacy Notice; `TRUTH.md`; `TODO.md` privacy gate.
- **Severity:** Critical
- **Category:** GDPR / Governance
- **Issue:** The DPIA retains stale journeys (child donors, student cards, Dono ID handling, 26-month analytics and MFA), is not coherently re-scored after its amendment, is unsigned, and records high residual risks/no-launch conditions while the public notice and change log imply compliance.
- **Why it matters:** A DPIA must assess the real processing before it starts, implement its mitigations, and be approved. If high residual risks cannot be reduced, Dono must consult the ICO and cannot begin that processing first. [ICO DPIA guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/guide-to-accountability-and-governance/data-protection-impact-assessments/)
- **Recommended solution:** Replace rather than patch it. Use the beta data flow, actual providers/regions, real age/content paths and implemented controls; re-score every risk; link mitigations to evidence; sign it. If any residual high risk remains, obtain advice and make the required prior consultation.
- **Fix requires:** Legal drafting, engineering changes, operational changes and possible ICO/solicitor clarification.

### L-18 — Special-category and criminal-offence data conditions are legally defective

- **Reference:** Privacy Notice clause 12; APD; APD Activity Mapping workbook; ROPA; DPIA; Community Guidelines clauses 3–4; Online Safety/Referral documents.
- **Severity:** Critical
- **Category:** GDPR / Special Category / Criminal Data
- **Issue:** The mapping permits medical, bereavement and similar narratives that beta policy otherwise prohibits; it treats private draft special-category data as ordinary data or relies on Article 9(2)(e) before the data subject has made it manifestly public. Receipt minimisation does not eliminate processing if the data is received. Criminal-allegation handling lacks a consistently mapped Schedule 1 condition.
- **Why it matters:** The ICO says “manifestly public” requires a deliberate public act by the data subject. A private submission to Dono does not meet that test. Criminal-offence data needs both an Article 6 basis and an applicable Schedule 1 condition or official authority. [ICO special-category conditions](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/special-category-data/what-are-the-conditions-for-processing/), [ICO criminal-offence data conditions](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/criminal-offence-data/what-are-the-conditions-for-processing/)
- **Recommended solution:** For beta, prevent campaign and receipt fields from soliciting special-category/criminal data, warn and redact before persistence/publication, and create a quarantine route for unavoidable reports. Counsel must select valid conditions for the limited moderation/referral processing that remains. Rewrite the APD, mapping workbook, ROPA, DPIA and privacy notice together.
- **Fix requires:** Legal drafting, engineering changes, operational changes and solicitor clarification.

### L-19 — Article 14 treatment of third-party receipt data is too broad and depends on missing controls

- **Reference:** Privacy Notice clause 11; Article 14 Assessment; Evidence Procedure; ROPA; LIA 4; `QUESTIONS_FOR_LAWYER.md` Q8; `TRUTH.md` data-protection facts.
- **Severity:** High
- **Category:** GDPR / Transparency
- **Issue:** The assessment reaches a broad disproportionate-effort conclusion for people named on receipts, but redaction, minimisation, public notice placement, case assessment and processing records are not implemented. It also risks using legitimate interests and Article 14 exceptions as blanket answers.
- **Why it matters:** The exception is fact-specific and requires safeguards; it is not a substitute for preventing unnecessary third-party data collection. The result could expose employees, suppliers or beneficiaries without notice.
- **Recommended solution:** Redact at upload where possible; discourage third-party identifiers; notify directly when practical; document any exception by class and circumstance; publish the Article 14 information prominently. Obtain Q8 advice on the remaining narrow category.
- **Fix requires:** Legal drafting, engineering changes, operational changes and solicitor clarification.

### L-20 — Controller/processor roles, DPAs and provider register are incomplete or wrong

- **Reference:** Privacy Notice clauses 5, 8 and 14; DPA Register; ROPA; International Transfer Assessment; DPIA; `TRUTH.md` processor/DPA facts; `QUESTIONS_FOR_LAWYER.md` Q14.
- **Severity:** High
- **Category:** GDPR / Vendors / Payments
- **Issue:** Google/shared Gmail is missing as an operative processor, its DPA is unresolved, “sufficient guarantees” fields are blank, and Stripe is treated inconsistently as processor, independent controller or both. The suite claims written agreements and completed diligence that do not exist.
- **Why it matters:** Article 28 contracting and controller transparency depend on actual role and product. A Stripe Connect role cannot be determined from a generic label; identity, connected-account and payment products may allocate responsibilities differently.
- **Recommended solution:** Build a provider-by-purpose register from actual configuration: service, data, purpose, role, contract/DPA link, subprocessors, region, retention, transfer mechanism, owner and review date. Obtain Q14 advice for each Stripe data flow. Complete Google's processor terms or change the support system.
- **Fix requires:** Operational changes, legal drafting and solicitor/vendor clarification.

### L-21 — International-transfer assessment contains inaccurate legal conclusions and unverified facts

- **Reference:** Privacy Notice clause 8; DPA Register; International Transfer Assessment register/actions; ROPA; DPIA; `TRUTH.md` transfers; `TODO.md`.
- **Severity:** High
- **Category:** GDPR / International Transfers
- **Issue:** The assessment says there is no UK adequacy route for US transfers, applies SCCs plus the UK Addendum universally, and treats EEA/US flows without provider-specific analysis. It includes unverified provider locations such as a Vercel region and incomplete TRAs.
- **Why it matters:** The UK Extension to the EU–US Data Privacy Framework has operated since 12 October 2023 for appropriately certified US recipients. Other transfers may use adequacy, the IDTA/Addendum or another safeguard; the correct route depends on the recipient and flow. [ICO UK Extension explanation](https://ico.org.uk/make-a-complaint/uk-extension-to-the-eu-us-data-privacy-framework-complaints-tool/what-to-expect-from-the-ico/), [ICO international-transfers hub](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/)
- **Recommended solution:** Verify each provider's current legal entity, hosting/subprocessor locations and certification. Record the actual transfer route and data-protection test/TRA only where required. Do not claim a universal contractual mechanism. Complete this for any existing personal data, not merely “before launch”.
- **Fix requires:** Legal drafting, operational changes and provider/solicitor clarification.

### L-22 — Analytics and cookie statements contradict each other and current operation

- **Reference:** Privacy Notice clauses 4.2 and 14.3; Cookie Notice clauses 3–5; DPIA section 2.5; ROPA; LIA; `TRUTH.md` consent/analytics facts; Unresolved Register U12.
- **Severity:** High
- **Category:** PECR / GDPR / Analytics
- **Issue:** The Privacy Notice says analytics can be linked to a signed-in user, while the Cookie Notice says analytics are not linked to identity. Retention is variously 12 or 26 months. Consent timestamp, notice version and withdrawal evidence are absent.
- **Why it matters:** Consent must be demonstrable and withdrawal effective. Current ICO guidance permits a narrow statistical-purpose exception only where processing is solely statistical for service improvement, gives a simple free objection, uses aggregate information and does not track individuals; Dono's user-linked PostHog design does not fit that narrow route. [ICO storage/access exceptions](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/)
- **Recommended solution:** Keep opt-in consent for beta; do not initialise analytics before consent; record consent timestamp/notice version; implement withdrawal/deletion or de-identification; choose one justified retention period; accurately disclose whether user IDs are sent. Consider the statistical exception only after redesign and documented eligibility.
- **Fix requires:** Engineering changes, operational changes and legal drafting.

### L-23 — The statutory data-protection complaint process is not operational

- **Reference:** Privacy Notice clause 13; Data Protection Complaints Workflow; Complaints Policy; `TRUTH.md` complaint-operation facts; Engineering Checklist H/OS.
- **Severity:** High
- **Category:** GDPR / Complaints / Operational
- **Issue:** Internal documents assert automatic acknowledgements, labels, a register and daily checks that are absent or unverified. Retention is inconsistent at three and six years.
- **Why it matters:** Since 19 June 2026, organisations have a statutory duty to facilitate data-protection complaints and acknowledge them within 30 days. [ICO announcement and guidance](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/06/new-data-protection-complaints-law-now-in-force/)
- **Recommended solution:** Create one monitored route, 30-day acknowledgement control, complaint register, owner/deputy, identity and scope triage, decision/response log and escalation to the ICO. Choose and justify a consistent retention period. Test the mailbox before launch.
- **Fix requires:** Operational changes, engineering changes if automated, and legal drafting.

### L-24 — ICO fee/registration remains unresolved despite contrary compliance language

- **Reference:** Privacy Notice clauses 1 and 13; ROPA; Unresolved Register U4; `TODO.md` legal/privacy items; `TRUTH.md` entity facts.
- **Severity:** High
- **Category:** GDPR / Corporate / Operational
- **Issue:** The suite implies the registration question has been assessed, while U4/TODO say it remains incomplete.
- **Why it matters:** Controllers, including sole traders, generally must pay the data-protection fee unless exempt, and the public register requires a contact address. [ICO registration service](https://ico.org.uk/for-organisations/data-protection-fee/register/), [ICO fee FAQs](https://ico.org.uk/for-organisations/data-protection-fee/faqs-data-protection-fee-payment-and-online-registration/)
- **Recommended solution:** Complete the ICO self-assessment now, register/pay if required, select an appropriate service address, record the number and renewal owner, and update the Privacy Notice only after completion.
- **Fix requires:** Operational changes and legal drafting.

### L-25 — Online Safety Act assessments and controls are not current or implemented

- **Reference:** Terms of Service clauses 17–19 and 22–25; Community Guidelines; Illegal-Content Risk Assessment; Children's Risk Assessment; Online Safety Procedures; Traceability Matrix; Moderation Requirements; `TRUTH.md` “Safety and process”; `QUESTIONS_FOR_LAWYER.md` Q10.
- **Severity:** Critical
- **Category:** Online Safety / Children / Operational
- **Issue:** Public UGC exists in the legal model, but reports, suspension, appeals, scanning and monitoring are absent. Risk-assessment bodies describe stale child-donor/comment journeys and “active” controls, while amendment blocks suspend their ratings. The Traceability Matrix says there are no gaps.
- **Why it matters:** In-scope user-to-user services were required to complete illegal-content and child-access assessments on statutory timetables; a highly effective age-assurance conclusion is needed to rule out likely child access. Existing service controls must be reflected honestly. [Ofcom child-access duties](https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/childrens-access-assessment-duties-under-the-online-safety-act), [Ofcom illegal-content duties](https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/illegal-content-duties-under-the-online-safety-act), [Ofcom enforcement programme](https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/enforcement-programme-to-monitor-if-services-meet-their-illegal-content-risk-assessment-and-record-keeping-duties-under-the-online-safety-act-2023)
- **Recommended solution:** Confirm whether any public UGC is already accessible; if so, get immediate Q10 advice. For beta, disable comments and unreviewed uploads, manually approve campaign content before publication, provide one report route and rapid remove/restrict capability, and complete fresh assessments on that narrow service. Do not publish “complete/no gaps” assertions without evidence.
- **Fix requires:** Engineering changes, operational changes, legal drafting and solicitor clarification.

### L-26 — CSEA procedure is not an operable compliance route

- **Reference:** CSEA Reporting Procedure; Online Safety Procedures section 3.4; Illegal-Content Risk Assessment; Incident Plan; Team Agreement; Moderation Requirements; `TRUTH.md`; `QUESTIONS_FOR_LAWYER.md` Q10.
- **Severity:** Critical
- **Category:** Online Safety / CSEA / Criminal
- **Issue:** The documents name portal users, registrations, training, testing and retention controls that are not evidenced. The NCA individual-user guide says registered individual users must be employees, while the Team Agreement expressly says the named contributors are not employees.
- **Why it matters:** From 7 April 2026, providers have a duty to report detected and previously unreported CSEA content through the statutory route. An ineligible or untested portal account is not a contingency. [Ofcom CSEA reporting duty](https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/duty-to-report-child-sexual-exploitation-and-abuse-csea-content-know-the-rules-and-how-to-comply), [NCA CSEA portal](https://www.nationalcrimeagency.gov.uk/what-we-do/crime-threats/child-sexual-abuse-and-exploitation/the-child-sexual-exploitation-abuse-industry-reporting-portal), [NCA individual-user registration guide](https://www.nationalcrimeagency.gov.uk/who-we-are/publications/804-how-to-register-individual-users-to-use-the-csea-irp/file)
- **Recommended solution:** Ask NCA/counsel whether a sole trader's non-employee contributors can be users; nominate eligible primary/deputy users; complete organisation registration, training and a documented test; align statutory timeframes and one-/five-year retention with the 2026 regulations; maintain a 999 route for imminent danger. Minimise exposure by disabling UGC, but do not treat that as eliminating the duty if content is detected.
- **Fix requires:** Operational changes, legal drafting and regulator/solicitor/founder clarification.

### L-27 — Defamation notice procedure does not preserve the statutory website-operator defence

- **Reference:** Terms of Service clause 20; Community Guidelines; Notice-and-Action Procedure sections 1, 5 and 9; Online Safety Procedures.
- **Severity:** High
- **Category:** Defamation / UGC / Operational
- **Issue:** The generic legal-notice intake omits required details for a Defamation Act section 5 notice. Its 10-day counter-notice timetable differs from the statutory process, which uses 48-hour operator steps and five full days for the poster.
- **Why it matters:** Following the statutory process is not mandatory, but failure can mean Dono cannot rely on the section 5 defence. [GOV.UK section 5 guidance](https://www.gov.uk/government/publications/defamation-act-2013-guidance-and-faqs-on-section-5-regulations), [official section 5 FAQ](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/269139/defamation-faqs.pdf)
- **Recommended solution:** Add a separate defamation-notice form and statutory clock, preserve the generic route for other complaints, and train the owner/deputy. For beta, disabling comments materially reduces exposure but campaign statements still need the route.
- **Fix requires:** Legal drafting and operational changes, with engineering changes for intake/timers if automated.

### L-28 — User-content licences, IP notices and contributor ownership are incomplete

- **Reference:** Terms of Service clauses 19–20; Community Guidelines; Notice-and-Action Procedure; Team Agreement clause 2; `TRUTH.md` entity/people facts.
- **Severity:** High
- **Category:** IP / Contract / Operational
- **Issue:** Public content licences and takedown process assume functioning notice/records. Internally, the IP assignment intended to cover existing and future work is unexecuted, and the agreement's execution/consideration mechanics have not been professionally checked.
- **Why it matters:** Copyright assignments must be in writing and signed; title to code/design may remain with contributors. [GOV.UK copyright licensing and assignment guidance](https://www.gov.uk/copyright/license-and-sell-your-copyright)
- **Recommended solution:** Execute solicitor-reviewed contributor agreements before release, including present assignment of existing rights, future-rights mechanics, moral-rights treatment, confidentiality, open-source compliance and exit delivery. Use a narrow, necessary user-content licence and a real copyright notice/takedown log.
- **Fix requires:** Legal drafting, operational changes and solicitor clarification.

### L-29 — Financial-crime and sanctions policy overstates legal conclusions and describes absent controls

- **Reference:** Terms of Service clause 24; Financial Crime and Sanctions Policy sections 2–8; Geographic Scope Assessment; Engineering Checklist; `TRUTH.md` operational/payment facts.
- **Severity:** High
- **Category:** Sanctions / Financial Crime / Operational
- **Issue:** The policy relies on geo restrictions, caps, suspension and screening that are absent; refers to the old OFSI Consolidated List; and states categorically that Dono has no SAR obligation and that sanctions reports must always be withheld as “tipping off”.
- **Why it matters:** OFSI closed the Consolidated List on 28 January 2026 and directs users to the UK Sanctions List. UK sanctions obligations apply to UK persons, while mandatory reporting status and SAR duties depend on role, sector and facts; terrorism-financing obligations should not be dismissed categorically. [OFSI list transition](https://www.gov.uk/government/publications/financial-sanctions-consolidated-list-of-targets/consolidated-list-of-targets), [OFSI enforcement guidance](https://www.gov.uk/government/publications/financial-sanctions-enforcement-and-monetary-penalties-guidance/financial-sanctions-enforcement-and-monetary-penalties-guidance), [NCA SAR FAQs](https://www.nationalcrimeagency.gov.uk/who-we-are/publications/462-sars-faq-july-2020)
- **Recommended solution:** Rewrite as a risk-based escalation policy, not legal conclusions. Use the current UK Sanctions List, define when to pause/seek advice/report, identify decision owner, preserve evidence and avoid blanket statements about SARs or tipping off. Either implement supported-country/payment-method controls or narrow beta configuration accordingly.
- **Fix requires:** Legal drafting, operational changes, engineering changes and solicitor clarification.

### L-30 — Geographic and payment-method scope is materially wider than the documents assume

- **Reference:** Terms of Service clauses 4.7 and 11; Donor Terms clause 2; Geographic Scope Assessment; Financial Crime Policy; `TRUTH.md` “Money”; Engineering Checklist J.
- **Severity:** High
- **Category:** Payments / Sanctions / Consumer / Operational
- **Issue:** Campaigns are intended to be UK-only but donors can use many Stripe local payment methods aimed at other markets; the unsupported-country list, caps and controls described in the risk assessment do not exist.
- **Why it matters:** Different payment methods have different confirmation, refund and dispute behaviour; international donors also increase sanctions, fraud, pricing and consumer-law complexity.
- **Recommended solution:** For beta, allow only card methods whose payment, refund and dispute behaviour has been tested; restrict connected accounts and campaigns to the approved UK scope; disclose GBP/FX treatment. Add other methods only through a documented change review.
- **Fix requires:** Engineering changes, operational changes and legal drafting.

### L-31 — Security and incident-response assurances exceed actual controls

- **Reference:** Terms of Service clauses 21, 29 and 31; Privacy Notice clause 14; Incident Response Plan; DPIA; ROPA; Team Agreement clauses 4–5 and 8; Wind-Down Plan; `TRUTH.md` “Security”.
- **Severity:** High
- **Category:** Security / GDPR / Operational
- **Issue:** The suite describes role-based access, written commitments, monitored alerts, vendor contacts, out-of-band communications, kill switches, tested restoration, tabletop exercises and offboarding that are absent or unverified. It inconsistently makes MFA a hard launch control even though `TRUTH.md` says custom MFA is not a launch requirement.
- **Why it matters:** False security statements undermine transparency and the DPIA; absent detection means a response plan will not trigger. Provider-console accounts handling production/payment/personal data are a material credential risk.
- **Recommended solution:** Define a minimal beta control baseline: unique accounts, least privilege, provider MFA for admins, secrets rotation, code review, production logging/alerts, vendor contacts, incident register, breach assessment, tested account disablement and one tabletop. No custom user MFA is necessary solely to make the drafting true. Revise documents to evidenced controls.
- **Fix requires:** Engineering changes, operational changes and legal drafting.

### L-32 — Review independence and appeal rules conflict

- **Reference:** Community Guidelines clause 8; Complaints Policy; Refund Checklist steps 1 and Appeals; Online Safety Procedures; Moderation Requirements; Society Terms; `TRUTH.md` team size.
- **Severity:** Medium
- **Category:** Complaints / Operational / Fairness
- **Issue:** Amendment blocks require no self-review, but operative bodies allow the same person to decide and review where necessary. Some documents promise separation the two-person beta team cannot always deliver.
- **Why it matters:** Inconsistent process invites unequal decisions and false expectations, but a small beta does not need a large tribunal structure.
- **Recommended solution:** Use a pragmatic conflict rule: no one reviews their own decision where the other authorised person is available and unconflicted; otherwise use an external adviser or disclose that no internal appeal is available and preserve court/regulator rights. Record reviewer/conflict status.
- **Fix requires:** Legal drafting and operational changes.

### L-33 — General complaints/ADR wording needs current-law reconciliation

- **Reference:** Terms of Service clause 33; Community Guidelines clause 8; Complaints Policy; Refund Policy section 12; DP Complaints Workflow.
- **Severity:** Medium
- **Category:** Consumer / Complaints / Drafting
- **Issue:** The complaints materials mix consumer, online-safety, data-protection and donation disputes; response targets differ; ADR references are not mapped to whether Dono is required by law or contract to participate.
- **Why it matters:** The DMCC Act 2024 now governs trader notification of ADR arrangements where the trader is required to participate, and the 2026 framework replaced the former voluntary accreditation regime. [DMCC Act explanatory notes, section 308](https://www.legislation.gov.uk/ukpga/2024/13/notes/division/9/index.htm), [DBT 2026 ADR framework](https://www.gov.uk/government/publications/the-digital-markets-competition-and-consumers-act-2024-alternative-dispute-regulations-2026)
- **Recommended solution:** Create one intake with labelled routes and applicable clocks, but separate decision standards. State truthfully whether Dono is obliged or willing to use a named accredited ADR provider; do not promise one until selected. Preserve Citizens Advice, court, ICO and Ofcom routes where relevant.
- **Fix requires:** Legal drafting, operational changes and solicitor clarification.

### L-34 — Team status, authority and whistleblowing protections require professional review

- **Reference:** Team Agreement clauses 1, 4–8 and Execution; Wind-Down Plan clauses 3 and 8; `TRUTH.md` “Entity and people”; `TODO.md` finance/corporate.
- **Severity:** High
- **Category:** Employment / Corporate / Governance
- **Issue:** The unsigned agreement declares contributors are not employees or workers, allocates operational duties, and requires permission for some actions. Actual status depends on the working relationship, not the label. The permission/confidentiality drafting also needs mandatory-rights and protected-disclosure savings.
- **Why it matters:** Misclassification can create employment, tax and safety consequences. A confidentiality/authority clause must not prevent protected disclosures or reports to regulators/law enforcement. [GOV.UK employment-status guidance](https://www.gov.uk/government/publications/employment-status-and-employment-rights/employment-status-and-employment-rights-guidance-for-hr-professionals-legal-professionals-and-other-groups)
- **Recommended solution:** Have employment/corporate counsel review actual duties, control, remuneration and mutuality. Add protected-disclosure/regulatory-reporting carve-outs and execute the result. Do not use non-employee status as a factual shortcut for NCA portal eligibility.
- **Fix requires:** Legal drafting, operational changes and solicitor/founder clarification.

### L-35 — Wind-down and sole-trader incapacity plan is not executable

- **Reference:** Terms of Service clause 31; Wind-Down Plan sections 3–10; Incident Plan; Team Agreement; `TRUTH.md` entity, security and document-status facts.
- **Severity:** High
- **Category:** Corporate / Operational / Data / Payments
- **Issue:** The plan assumes deputies can control accounts, stop payments, export data, notify users and manage backups. `TRUTH.md` says kill switches, exports, deputy access and tested recovery are absent. A named deputy does not automatically have legal authority on death/incapacity of a sole trader.
- **Why it matters:** Active campaigns, data rights and connected-account issues survive incapacity. Public terms say a plan exists, creating reliance.
- **Recommended solution:** Implement the technical runbook, access escrow and current contacts; obtain advice on will/lasting power of attorney/business succession and payment-account authority; test a wind-down exercise. Public terms should promise only reasonable notice/action, subject to law and provider control.
- **Fix requires:** Operational changes, engineering changes, legal drafting and solicitor clarification.

### L-36 — Amendment blocks make the documents legally unsafe to use

- **Reference:** DPIA, Children's Risk Assessment, Illegal-Content Risk Assessment, Online Safety Procedures, Refund Checklist, ROPA, Society Onboarding Forms, DPA Register, LIA and other files with v2.3 amendment/supremacy blocks; Change Log; Approval sections.
- **Severity:** Critical
- **Category:** Drafting / Document Control / Governance
- **Issue:** Numerous files retain text that is expressly overridden by an amendment block. In several cases the body and amendment state opposite rules about child donors, student cards, MFA, personal liability, self-review, analytics retention, refund materiality or payment responsibility.
- **Why it matters:** Operators and engineers cannot reliably follow the documents, and a regulator/court may read the full instrument rather than infer the intended compilation. “The amendment controls” is not a launch-quality consolidation method.
- **Recommended solution:** Produce clean consolidated v2.4 files with all superseded language deleted, then run a definition/cross-reference and factual test. Preserve v2.3 only as a historical archive. Require a single approval manifest listing file hashes and effective date.
- **Fix requires:** Legal drafting and operational/document-control changes.

### L-37 — Source hierarchy and “authoritative” status are backwards

- **Reference:** Engineering Checklist “How to read this”; ROPA source-of-truth language; Traceability Matrix; Change Log; `TRUTH.md` “Document status” and Release Control Matrix.
- **Severity:** Medium
- **Category:** Governance / Drafting
- **Issue:** Some internal documents call the legal suite the source of truth, while the task's controlling rule and `TRUTH.md` treat verified product behaviour as truth. Several matrices declare completeness despite empty release evidence.
- **Why it matters:** Engineering may build to stale legal text or legal drafting may silently invent operations.
- **Recommended solution:** Establish hierarchy: verified system evidence → approved product decision in `TRUTH.md` → legal advice → consolidated public terms/policies → implementation specifications. A legal promise cannot make a feature exist. Record exceptions explicitly.
- **Fix requires:** Operational changes and drafting changes.

### L-38 — Versioning, approval and cross-reference defects undermine reliability

- **Reference:** Change Log title/section 1/Approval; all Approval sections; Refund Policy clause 10.3(b); TODO counts; Questions document; Unresolved Register.
- **Severity:** Medium
- **Category:** Drafting / Document Control
- **Issue:** The suite alternates between v2.3 and v2.3.1; the Change Log says “eleven” decisions/questions while the lawyer document has 15; TODO says eight unresolved items while the register has 12 entries, one closed and 11 open. Refund Policy clause 10.3(b) points to 3.3(e), but the relevant ground is 3.2(g).
- **Why it matters:** These defects make change control and operative cross-references unreliable, particularly when acceptance evidence must identify a precise version.
- **Recommended solution:** Use one semver/effective-date scheme; correct counts and cross-references; assign a document owner; run automated link/reference checks; do not approve a suite with placeholders or inconsistent version labels.
- **Fix requires:** Legal drafting and operational/document-control changes.

### L-39 — Internal requirements are disproportionate and conflict with the minimum beta

- **Reference:** Engineering Moderation Requirements; Engineering Checklist sections F–I; Traceability Matrix; Evidence Procedure; Incident Plan; `TRUTH.md` launch principles.
- **Severity:** Medium
- **Category:** Commercial / Operational / Drafting
- **Issue:** The internal suite specifies dozens of dashboards, workflows, automated alerts, scanning and separation features, then treats them as launch gates. Some are valuable later but are not necessary if beta scope is narrowed.
- **Why it matters:** Over-specification delays launch while simultaneously increasing misrepresentation risk when public documents assume the specification is live.
- **Recommended solution:** Divide requirements into: statutory/current-scope gate, contractual gate, risk-reducing beta control and post-beta feature. Prefer disabling comments, recurring donations, matches and broad payment methods to building a full trust-and-safety platform for beta. Keep the richer specification as a roadmap, not a statement of current operation.
- **Fix requires:** Founder clarification, operational changes and drafting changes.

### L-40 — Release Control Matrix is empty and no one can certify launch

- **Reference:** `TRUTH.md` Release Control Matrix; Change Log section 7; Engineering Checklist RM-01; `TODO.md` four gates; `TRUTH.md` no release owner/code review.
- **Severity:** Critical
- **Category:** Governance / Engineering / Operational
- **Issue:** The matrix intended to link each launch statement to evidence is unpopulated, yet RM-01 is described as done. There is no release owner and no mandatory code review.
- **Why it matters:** The same class of mismatch can recur immediately after redrafting. No accountable person can demonstrate that product, policy, legal and operational states matched at release.
- **Recommended solution:** Populate every Critical/High statement with Current/Target status, evidence link, test result, owner, legal document/clause and approval. Appoint one release owner and require two-person review of production changes. Launch only when all beta gates are evidenced.
- **Fix requires:** Operational changes, engineering process changes and founder clarification.

### L-41 — Institutional referrals lack a settled lawful basis and working safeguards

- **Reference:** Terms of Service clauses 23–25; Privacy Notice clause 9; Institutional Referral Protocol; LIA “activities that do not rely on legitimate interests”; APD/ROPA; `QUESTIONS_FOR_LAWYER.md` Q9.
- **Severity:** High
- **Category:** GDPR / Defamation / Operational
- **Issue:** The documents variously rely on consent, legitimate interests and legal obligation for disclosures to universities. The referral workflow, secure channel, approval, correction and audit controls are not built. Stale references to student cards remain.
- **Why it matters:** Sharing unproven allegations can cause serious reputational harm and may involve criminal-offence data. Consent is usually unsuitable for an adverse referral; “legal obligation” cannot be asserted without a specific duty.
- **Recommended solution:** Suspend discretionary institutional referrals for beta except urgent safeguarding/legal reports. Obtain Q9 advice on a narrow legitimate-interest or other basis, necessity threshold, wording, notification, security, correction and record. Never present an allegation as established fact.
- **Fix requires:** Legal drafting, operational changes and solicitor clarification.

### L-42 — Privacy records use “legal obligation” too broadly

- **Reference:** Privacy Notice clauses 4, 9, 12 and 13; ROPA; LIA section “Activities that do NOT rely on legitimate interests”; DP Complaints Workflow; CSEA/Referral policies.
- **Severity:** Medium
- **Category:** GDPR / Drafting
- **Issue:** Contract evidence, general moderation, referrals and record retention are sometimes mapped wholesale to legal obligation without identifying the specific law or separating optional activity from mandatory reporting.
- **Why it matters:** Article 6(1)(c) requires a concrete legal obligation; operational convenience or anticipated litigation is not enough. An invalid basis affects transparency, rights and retention.
- **Recommended solution:** Map each purpose separately to contract, legitimate interests, consent or a named statutory duty; document necessity and rights impact; update the ROPA, LIA, APD and notice together.
- **Fix requires:** Legal drafting and solicitor clarification.

### L-43 — Anonymous/guest donation and privacy claims do not match the data model

- **Reference:** Terms of Service clause 11; Donor Terms clauses 5, 7–8; Privacy Notice clauses 3, 5 and 10; Cookie Notice clause 4; `TRUTH.md` contract/version and data facts.
- **Severity:** High
- **Category:** GDPR / Consumer / Payments
- **Issue:** The suite implies guest donations and hidden-name choices have functioning linkage, receipts, settings and contract records. `TRUTH.md` says no guest terms link/receipt/version evidence exists, and anonymous display does not mean anonymous processing by Stripe/Dono.
- **Why it matters:** Donors may misunderstand who can identify them, and Dono may be unable to service refunds/rights or prove terms for guest transactions.
- **Recommended solution:** Use “hidden from the public”, never “anonymous”, unless technically accurate. At guest checkout capture a minimal contact and terms record, provide a receipt/durable copy, explain Stripe/Dono identification, and implement a secure self-service or support route for refunds and rights.
- **Fix requires:** Legal drafting and engineering changes.

### L-44 — Automated scanning and proactive monitoring claims are false

- **Reference:** Terms of Service clause 19.4; Community Guidelines; Illegal-Content Risk Assessment controls; Moderation Requirements; Traceability Matrix; `TRUTH.md` “Safety and process”.
- **Severity:** High
- **Category:** Online Safety / Consumer / Operational
- **Issue:** Public/internal documents describe automated scanning, keyword checks, pattern detection and alerting that are not implemented.
- **Why it matters:** Users may rely on a safety measure that does not exist; risk assessments then understate residual risk. Proactive scanning can itself introduce privacy/error implications and should not be promised merely for theoretical completeness.
- **Recommended solution:** Delete scanning claims for beta. Use manual pre-publication campaign review and a simple report route. Add automation only after testing, DPIA review, false-positive handling and clear disclosure.
- **Fix requires:** Legal drafting; engineering/operational changes only if founders elect to add scanning.

### L-45 — Data-retention periods conflict across the suite

- **Reference:** Privacy Notice clause 7; Cookie Notice; ROPA; DPIA; DPA Register; LIA; Evidence Procedure; DP Complaints Workflow; Moderation Requirements; CSEA Procedure.
- **Severity:** Medium
- **Category:** GDPR / Drafting / Operational
- **Issue:** Analytics is 12 or 26 months; data-protection complaints are three or six years; moderation, receipts, evidence and provider retention use inconsistent clocks. Some dates are aspirational because no deletion jobs exist.
- **Why it matters:** Users cannot understand retention, and operators cannot implement or defend it.
- **Recommended solution:** Create one retention schedule keyed by data class and legal purpose; distinguish Dono deletion, Stripe/provider retention, backups and legal holds. Propagate one value to every document and test execution.
- **Fix requires:** Legal drafting, operational changes and engineering changes.

### L-46 — Several document statements purport to decide questions still expressly open

- **Reference:** Change Log sections 3, 5 and 8; Unresolved Register U1–U12; `QUESTIONS_FOR_LAWYER.md` Q1–Q15; `TODO.md` legal items; Society Terms; Privacy Notice; Fee Note; Online Safety assessments.
- **Severity:** High
- **Category:** Governance / Drafting / Commercial
- **Issue:** The Change Log says findings are resolved and assessments completed while the same suite asks counsel to decide payment perimeter, surcharge, Society model, refund mandate, consumer status, Article 14, OSA/CSEA, publication and contract evidence.
- **Why it matters:** Approval language can cause premature publication and hides the exact decisions on which drafting depends.
- **Recommended solution:** Mark every counsel-dependent provision “not approved/not operative” until advice is received. Record decision, rationale, date and affected clauses; then consolidate the suite. “Resolved by drafting” is not an acceptable status for a disputed legal conclusion.
- **Fix requires:** Legal drafting, operational governance and solicitor/founder clarification.

### L-47 — Defined terms are not used consistently

- **Reference:** Terms of Service clause 3; Student Terms; Society Terms clauses 1 and 3; Donor Terms clauses 3–6; Refund Policy; Society Onboarding Forms; Fee Note; Change Log.
- **Severity:** Low
- **Category:** Drafting / Terminology
- **Issue:** The suite alternates among Campaign Owner, Responsible Representative, Society Representative, representative, account holder and Recipient; similarly, Connected Account, payment account and Stripe account are not always used as exact synonyms. “Dono Fee”, “platform fee”, “processing cost”, “fee cover” and card charge also blur legally distinct amounts.
- **Why it matters:** The underlying issues are substantive elsewhere in this report, but inconsistent labels make the final allocation of responsibility and money harder to follow.
- **Recommended solution:** Adopt a one-page controlled glossary after the Society/payment decisions are made. Use one capitalised term for each legal person, account and amount; avoid defining a term in one public document and silently changing its meaning in another.
- **Fix requires:** Legal drafting only.

### L-48 — Public documents contain avoidable presentation and document-control clutter

- **Reference:** Approval/version-control sections across the public suite; standalone Society Forms numbered 8.1–8.3; Online Safety Procedures beginning at section 3.1; public/internal file naming and version labels; Change Log document register.
- **Severity:** Low
- **Category:** Drafting / Accessibility / Document Control
- **Issue:** Standalone documents retain numbering from predecessor compilations, public-facing files carry internal approval mechanics, and naming/version styles vary. This is separate from the substantive amendment-block defect in L-36.
- **Why it matters:** Readers may think content is missing and users see internal governance material that does not help them understand their rights.
- **Recommended solution:** Renumber each consolidated instrument from the beginning; keep approvals and hashes in an internal manifest; give public files consistent user-facing titles, effective dates and navigation links; archive technical filenames separately.
- **Fix requires:** Legal drafting only.

## 5. Consolidated inconsistencies between documents

| Topic | Conflicting statements | Controlling conclusion for beta |
|---|---|---|
| Campaign types | Public Terms and Student Terms allow individual and Society campaigns; `TRUTH.md` says Society-only | Society-only; individual terms suspended |
| Age | Public terms say 18+; child assessments and old bodies allow child donors/parent permission; actual gate absent | Adults only, but implement real self-attestation and separately assess child browsing |
| Identity documents | Terms/Verification/Privacy say Dono never receives ID; `TRUTH.md` records Dono upload still live and also contains a contrary “never receives” line | Treat Dono ID upload as current until technically removed and legacy files handled |
| Eligibility | Verification suite says university email and Stripe ID; Engineering EL-03 says university email sole check; `TRUTH.md` says email check absent | For Society-only beta, describe only actual Society review and Stripe onboarding |
| Payment destination | Terms say all money goes directly to Recipient; `TRUTH.md` says a platform-account path is live | Terms are false until path disabled and history remediated |
| Fee | Terms/Fee Note say 5% + 20p; `TRUTH.md` says card-dependent Stripe cost; Change Log contains both “corrections” | Actual current behaviour is the card-dependent amount; neither should launch without Q2/Q13 resolution |
| Recurring/matching | Terms say unavailable; `TRUTH.md` says both are live | Disable for beta or rewrite after separate legal/product review |
| Overfunding | Refund documents say there is no overfunding; `TRUTH.md` says no cap | Implement cap or settle a fair surplus rule |
| Refund ability | Some policies say Dono mandates but cannot technically refund; Stripe direct-charge mechanics allow platform-initiated refunds; product workflow absent | Define and test actual execution after Q1 advice |
| Evidence | Terms describe status, reminders and closure; `TRUTH.md` says none exists | Build minimal manual/technical process or remove promises |
| UGC controls | Terms and risk records say reports/scanning/suspension/appeals exist; `TRUTH.md` says absent | Disable UGC except reviewed campaign content |
| OSA assessments | Traceability says complete/no gaps; core assessments suspend ratings or rely on false controls | Fresh assessments required |
| CSEA | Procedures say users registered/trained/tested; evidence is absent and team is declared non-employee | Confirm with NCA and test before relying on route |
| Analytics identity | Privacy says linked to signed-in user; Cookie Notice says not identity-linked | Verify PostHog configuration and disclose one accurate answer |
| Analytics retention | 12 months versus 26 months | Founder selects justified value; implement and propagate |
| DP complaint retention | Three years versus six years | Choose and justify one period |
| Review independence | Amendment blocks forbid self-review; bodies permit it | Adopt a practical conflict/escalation rule |
| Society liability | Main Terms say no consumer-representative indemnity; Society Terms impose authority/refund indemnities and limited recourse | Counsel must settle after consumer/business classification |
| Society account | Forms' amendments and bodies disagree on account holder, obligations, fee cover, student cards and child donors | Forms are unusable until consolidated |
| Transfers | Assessment says no US adequacy and universal SCC/Addendum; current UK Extension may apply | Provider-specific transfer mechanism required |
| Sanctions list | Policy uses OFSI Consolidated List; it closed in January 2026 | Use UK Sanctions List |
| Source of truth | Legal checklists call themselves authoritative; `TRUTH.md` contains verified implementation | Verified implementation controls; legal text must follow it |
| Approval/version | Files use v2.3/v2.3.1 and “complete” despite open Q1–Q15/U-items | No operative approval until clean v2.4 and gate evidence |

## 6. Historical baseline decision list — superseded by section 0 where closed

This was the open-item list at the initial review cut-off. Section 0 records the later founder decisions and is authoritative; this list is retained only as an audit trail for why the drafting and build requirements arose.

1. **Q12/Q1 — platform-account history and payment-services perimeter:** What charges occurred, whether Dono received/controlled funds, and what remediation or FCA engagement is required?
2. **Q13/Q2 — commercial fee model:** Will Dono remove donor-side card-cost pass-through and adopt a fixed disclosed service fee, absorb processing, or use another counsel-approved model? How are past donations handled?
3. **Q3 — Society legal model:** Which Society types may join; who contracts; what authority evidence is needed; who owns the Stripe account/balance; what personal exposure remains; how does succession work?
4. **Q7/Q6 — contract characterisation:** What contracts arise among Dono, donor and representative, and which consumer cancellation/information/remedy rules apply?
5. **Q4 — surplus:** Hard cap, pro-rata refund, Society alternative use with donor consent, or another fair rule?
6. **Q5/U2 — liability:** What fair caps and indemnities apply to donors, consumer representatives and any business representatives?
7. **Q14 — Stripe privacy roles:** For Connect onboarding, Identity and payment processing, what data does Dono receive and what controller/processor allocation applies?
8. **Q8 — receipt third-party data:** Is the proposed Article 14 exception defensible for the narrow, redacted beta flow?
9. **Q9 — institutional referrals:** Are discretionary referrals allowed at beta and under what basis/threshold?
10. **Q10 — OSA/CSEA:** Is the currently accessible service already in scope; are deadlines already missed; who is eligible to use the NCA portal?
11. **Q11/Q15 — publication and evidence:** What minimum contract record/durable-copy implementation is required for the beta journey?
12. **U4 — ICO fee:** Complete the assessment and decide the public service address.
13. **U5 — entity:** Launch as sole trader or incorporate first, taking into account contracts, liability, IP, Stripe, continuity and insurance.
14. **U6 — UK study/eligibility:** Defer for Society-only beta; decide before individual campaigns.
15. **U7 — stranded Society balance:** What happens if the representative leaves, dies or refuses cooperation?
16. **U8 — third-party/public-benefit campaigns:** Defer or prohibit for beta unless counsel defines the boundary.
17. **U9 — historic community-fund charge:** Audit whether any charge was taken and remediate.
18. **U10 — creator DOB:** Whether Stripe's verified DOB may and should drive the creator gate.
19. **U11 — launch timing/risk acceptance:** No founder risk acceptance can cure a statutory or false-statement blocker; decide timing only after the objective gates close.
20. **U12 — analytics retention:** Select 12 months or a shorter justified period, then implement deletion.
21. **Insurance:** Decide whether public liability, cyber, professional/management liability or other cover is commercially required; absence should be an explicit risk acceptance, not buried.
22. **Contributor status and succession:** Worker/contractor status, effective IP assignment, NCA user eligibility and legal authority on incapacity.

## 7. Historical recommendations for `TRUTH.md` — implementation tracked in revision 4

`TRUTH.md` should remain factual and should not be turned into another policy. Make these changes after verifying evidence:

1. Resolve the identity contradiction: state separately that Dono's own upload is currently present, whether any files exist, and the target removal/deletion status; do not also say Dono “never” receives ID.
2. Add a precise current payment matrix: every API route, Stripe charge type, destination account, authentication requirement, application fee, descriptor, payment methods, refund actor and webhook state.
3. Record the historical audit result for platform-account charges, community-fund charges, fee amounts, recurring donations, matches, disputes and refunds.
4. Add the exact public routes currently accessible and whether campaigns/comments/uploads are visible to unauthenticated users; this is necessary for OSA scope.
5. Add the actual Society onboarding and Stripe connected-account classification shown in Stripe, including legal name/type and controllers.
6. Add actual provider legal entities, regions, roles, DPAs, subprocessors and transfer mechanisms; include Gmail/Google.
7. Add ICO registration/fee status and registration number only after completed.
8. Add CSEA organisation-registration status, eligible named users, training/test evidence and regulator clarification.
9. Add current analytics identifiers, consent fields, retention configuration and deletion/withdrawal behaviour.
10. Add a data-class retention table showing implemented—not intended—jobs/manual procedures and backup treatment.
11. Add whether automated acknowledgements, report queues, labels, daily mailbox checks, monitoring alerts, kill switches and export tools actually exist.
12. Record signed contributor agreement/IP status, actual working relationship, access owners and offboarding state.
13. Record the release owner, review rule, production deployment path and link to populated release evidence.
14. Add a document status stating v2.3 is a draft with unreconciled amendments and is not approved for publication.
15. Distinguish “not a beta requirement” from “not a security control”: for example, no custom user MFA may be required while provider-admin MFA should still be factual.

## 8. Historical recommendations for `TODO.md` — implementation tracked in revision 4

1. Change “eleven questions” to 15 and order Q12–Q15, Q1–Q3, Q10/Q11 ahead of non-launch refinements.
2. Change “eight unresolved items” to 11 open U-items (U1–U12 with U3 closed), or replace the count with a generated link.
3. Reopen the age item: policy is decided, but real account/guest checkout gates are not implemented.
4. Add P0: disable the platform-account payment path and complete the historic transaction audit.
5. Add P0: decide and implement the lawful fee model; show total price; remediate past mismatches.
6. Add P0: limit beta to Society campaigns and remove individual campaign UI/legal hierarchy.
7. Add P0: obtain Society structure/authority/Stripe/tax advice and rebuild onboarding/succession.
8. Add P0: remove Dono ID upload and handle legacy identity files.
9. Add P0: disable public comments/unreviewed UGC; complete fresh OSA assessments on the actual service.
10. Add P0: confirm NCA portal eligibility/registration; train and test CSEA route.
11. Add P0: replace and sign the DPIA; close high risks or make prior ICO consultation.
12. Add P0: rewrite APD/mapping/ROPA for valid Article 9/Schedule 1 conditions or technical prevention.
13. Add P0: implement contract version capture, durable copy and donation snapshot.
14. Add P0: implement minimal evidence/refund/dispute workflow and Stripe execution.
15. Add P0: execute contributor/IP agreements, appoint release owner and require code review.
16. Add P0: consolidate all v2.3 amendment blocks into clean v2.4 documents.
17. Add P1: complete ICO fee self-assessment/registration and service address.
18. Add P1: provider register, Google DPA, Stripe role analysis and provider-specific transfer mechanisms.
19. Add P1: statutory data-protection complaint route and 30-day acknowledgement control.
20. Add P1: defamation section 5 intake and statutory clocks.
21. Add P1: current UK Sanctions List and fact-specific SAR/OFSI escalation policy.
22. Add P1: restrict payment methods/geography for beta.
23. Add P1: provider-admin MFA, logging/alerts, incident contacts, tabletop and offboarding.
24. Add P1: executable sole-trader incapacity/wind-down authority and test.
25. Split the Engineering Moderation Requirements into launch gates and post-beta roadmap; do not leave future features labelled as current legal dependencies.
26. Populate the Release Control Matrix; remove RM-01 “done” status until it contains evidence.

## 9. Recommended drafting simplification

The current suite is too large for a two-person beta and duplicates the same rules across public terms, risk assessments, workflows, checklists and amendment blocks. Simplification should reduce inconsistency without removing protection:

1. **Public set:** Main Terms; Society Campaign Schedule; Donor Schedule; Community/Content Rules; Refund/Complaints Policy; Privacy Notice; Cookie Notice; concise Verification Notice.
2. **Internal operating set:** one compliance control register; current DPIA; OSA illegal-content/child-access assessments; CSEA runbook; incident/wind-down runbook; data inventory/ROPA/APD/retention/provider/transfer registers; one complaints/refunds/evidence runbook.
3. **Archive:** Student Campaign Terms and all future-feature requirements, clearly non-operative.
4. **No amendment overlays:** every release is a clean consolidated text with immutable hash and manifest.
5. **One source per fact:** fee, age, retention, campaign type, payment flow and reviewer rule each have a single controlled value propagated to every document.
6. **Manual beta language:** where a lawful manual control is enough, say “contact us; we will review and respond” rather than promising dashboards, automated alerts, status taxonomies and fixed outcomes.

## 10. End-to-end journey assessment

### Visitor

Public browsing is available to all ages, but the child-access/Children's Code and OSA records do not accurately assess that journey. Cookie consent works in outline but lacks full evidence/withdrawal metadata. Public legal delivery is a stub.

### Account creation

The 18+ rule is not gated. Terms version and durable-copy evidence are absent. Privacy information conflicts with actual ID and provider flows.

### Society campaign creation

Society authority, representative contracting and connected-account ownership are not implemented or legally settled. Verification promises exceed current checks. Prohibited sensitive data is not reliably prevented before Dono processes it.

### Publication and campaign content

Human pre-publication review is the strongest real control, but its scope and evidence are not sufficiently recorded. Risk documents assume reports, scanning, alerts, suspension and appeals that are absent. Donation-time snapshots are missing.

### Donation

Guest acceptance/durable copy is absent; age is ungated; the actual card-dependent charge contradicts price terms; recurring/match and broad payment methods remain live; a platform-account path contradicts direct-to-Recipient statements.

### Evidence and closure

The legal model is detailed but the product state, reminders, redaction, reviewer log and archive do not exist. Without a donation-time snapshot, later edits undermine the evidence base.

### Dispute and refund

The suite gives Dono a mandate and promises a structured process, but intake, state, conflict handling, execution, fee reversal and insufficient-balance handling are absent. Chargeback coordination is not implemented.

### Termination and wind-down

Account deletion is partial; retention and archive promises are not executable; kill switches, exports, deputy authority and tested recovery do not exist. Sole-trader death/incapacity remains a legal continuity risk.

## 11. Historical baseline final assessment

**Internal coherence:** No. The same core facts—campaign scope, age, identity data, fee, payment destination, recurring/matching, surplus, analytics, retention, reviewer independence, Society liability, OSA controls and CSEA readiness—receive materially different answers in different documents.

**Accuracy against the current product:** No. The public suite repeatedly describes Target functionality as Current and omits or contradicts live high-risk paths.

**Regulatory readiness:** No. The payment/FCA perimeter, surcharge/price model, Society structure, DPIA/special-category basis, OSA assessments, CSEA route, provider/transfer records and consumer-contract characterisation remain unresolved or unimplemented.

**Commercially pragmatic launch conclusion:** Dono can avoid building many nonessential features by narrowing the beta. It cannot avoid the core work of making payment flows and prices lawful and accurate, proving contract acceptance, removing the ID upload, settling the Society recipient model, implementing minimum refund/evidence/complaint controls, completing factual data/online-safety assessments, and securing IP/release governance.

The suite can be considered coherent only when:

1. the Critical items in section 3 have evidence-backed closure;
2. counsel has answered the perimeter/contract/Society questions that control drafting;
3. v2.3 has been replaced by clean consolidated documents;
4. the Release Control Matrix links every material statement to verified implementation; and
5. a final product walkthrough demonstrates that the visitor-to-wind-down journey matches the documents without relying on unbuilt controls.

Until then, the documents should remain internal drafts and should not be represented as an approved, launch-ready legal suite.

## 12. Revision 4 final assessment

Under the instructed assumption that the consolidated engineering pack is fully implemented and evidenced before the first real Donation, the product model is internally coherent enough to support a Society-only beta. `TRUTH.md`, the operative public terms, the decision register and the engineering pack now agree on the fee, payer, direct-charge model, zero-payment history, creator age gate, enrolment rule, Society-purpose test, succession rule and analytics period.

The suite is **not yet publishable as a finished legal release** because several carried-forward internal records retain superseded body text, professional confirmations remain outstanding, and no evidence-backed release approval has yet been recorded. Those are bounded close-out tasks rather than unresolved product architecture.

**Final build-assumed rating: 78/100.** The rating reaches launch-ready territory only after the five remaining gates in section 0 are closed. If the build or acceptance evidence is absent, the historical baseline assessment in this report remains applicable instead.
