# Data Protection Impact Assessment (DPIA) — Dono

**Controller:** Amrit Kaur Rooprai, trading as Dono
**Owner:** Amrit (data protection lead). **Deputy:** Sashank.
**Version:** 2.2 — 31 July 2026
**Status:** Decision record for founder approval before launch.
**Approved by:** _________________ **Date:** _________________
**Review triggers:** any institutional data-sharing going live; any automated identity or fraud scoring; any change to age controls; expansion beyond the current operating model; any new upload type or profile field; any change of processor or region.

This DPIA describes the processing Dono **actually carries out today**, not planned functionality. Where another governance document holds the detail — the ROPA, the Privacy Notice, the Verification Notice, the Retention schedule, the Incident Response Plan — this DPIA cross-references it rather than duplicating it. Where information is not yet available it is recorded as requiring confirmation rather than guessed at.

## Changes in v2.2 — corrections to the factual record

The previous version described a product that does not exist. These statements were wrong and are corrected:

| Previous statement | Correct position |
|---|---|
| Creators upload "a university ID **and/or government ID**" | **Dono only receives a student card.** Dono never receives, stores or accesses a government identity document, a passport, a driving licence, a selfie, or any Stripe KYC document |
| Verification is "outsourced to Stripe (a specialist **processor**)" | **Stripe performs its own KYC independently, under its own regulatory obligations, as an independent controller.** It is not doing it for Dono, and Dono has no KYC obligation of its own |
| Documents are "held transiently, deleted within 30 days" | **The student-card image is deleted immediately after a successful check**; 30 days applies only to a rejected or abandoned check. Every reference to retaining identity documents for up to 30 days on success is removed |
| Verification confirms creators are "18+" | **Stripe Identity does not reliably return a date of birth and is not used as Dono's age gate.** Age is a **declared date of birth**, which is not highly effective age assurance |
| Institutional sharing is a live risk area | **Dono currently shares no personal data with universities or institutions.** The speculative discussion is removed; a review is triggered if that changes |
| "Large-scale processing" | Removed. There is no evidence of scale to support it; Dono is pre-launch with a single institution |
| Residual risk is low once mitigations 1–4 are in place | **Residual risk is not assessed as low, because the mitigations are not implemented.** See section 7 |

---

## 1. Screening — why this DPIA is required

Dono processes identity-adjacent data (student cards) to verify campaign creators; publishes user-generated content to an audience that includes children; processes donation data about people who may be under 18; and processes allegations of criminal conduct through its moderation and financial-crime processes. That combination requires a DPIA under Article 35 UK GDPR.

**Scope.** Five processing streams: (1) identity and student-status verification; (2) receipts and third-party data; (3) campaign and comment moderation, including reports and CSEA; (4) donations, including donations by people under 18; (5) analytics. General account processing is covered in the ROPA and does not independently require DPIA treatment. Institutional sharing is **out of scope because it is not happening**; if it is introduced, this DPIA is revisited first.

## 2. Description of processing

### 2.1 Identity and student-status verification

**What happens.** A campaign creator submits a university email address and an image of their student card. **A Dono administrator reviews the image by eye** against the information provided. Dono extracts and keeps the name, institution, college, course, student number and card expiry date. **The image is deleted immediately after a successful check**; where a check is rejected or abandoned, the image is deleted within 30 days.

Separately, the creator completes **Stripe Connect onboarding and Stripe Identity verification**. Stripe collects the identity documents; **Dono never receives them**. Dono receives the connected-account identifier and status, and a verified name or date of birth **where Stripe returns them**, which does not happen in every flow.

**Why needed.** To confirm a campaign creator is a real, currently enrolled student at the institution claimed — core to donor trust and to the integrity of the Platform.

**What Dono does not do.** Dono does not carry out KYC; that obligation is Stripe's. Dono does not perform "institution verification" — it does not contact a university to confirm anything.

### 2.2 Receipts and third-party data

**What happens.** Campaign creators upload receipts, invoices and quotes evidencing expenditure. These can contain third-party personal data — a supplier's contact details, a named individual on an invoice.

**Why needed.** To evidence that donated funds were used as described.

**Risk driver.** This is the one category where Dono knowingly receives personal data about people who are not Dono users, have no relationship with Dono, and have no way of knowing Dono holds it.

### 2.3 Moderation, reports and CSEA

**What happens.** Every campaign is reviewed by a person before publication. Comments are post-moderated. Anyone — including people with no account — may report content, and Dono records the report, the decision and the reasons. Suspected child sexual exploitation and abuse content is reported to the National Crime Agency under a restricted procedure.

**Why needed.** Online Safety Act 2023 duties; fraud and safeguarding control; and the fact that public pages are visible to children.

**Risk drivers.** Reviewers see identity-adjacent and third-party data as part of review. Moderation records contain **allegations of criminal conduct**, which are Article 10 data. CSEA processing involves the most sensitive material Dono will ever hold.

### 2.4 Donations, including by people under 18

**What happens.** Anyone may donate, with or without an account, at any age. Dono records the donor's name, email, amount, campaign, display preference, and a **checkout confirmation** that they are 18 or over — no parent-or-guardian-permission alternative. Payment is charged directly to the recipient's Stripe connected account.

**Why needed.** It is the core function of the Platform, and openness to donors of any age is a deliberate product decision.

**Risk driver.** Dono knowingly processes personal data about children, on the basis of a self-declaration it does not verify. This is a change from the previous draft, which assumed an 18+ service.

### 2.5 Analytics

**What happens.** PostHog Cloud EU collects product events **only where the user consents**. Events can be linked to an identified user once signed in. Session replay is off. Retention: 26 months.

**Why needed.** To find and fix problems and improve the Platform.

## 3. Necessity and proportionality

- **Verification** is necessary and proportionate: it is limited to campaign creators, it uses the least intrusive document that evidences enrolment, the image is deleted on success, and Dono receives no government identity document at all. The main proportionality concern is the **six-year retention of the student-card number**, justified by dispute and referral needs; that is defensible but should be revisited if referrals prove rare.
- **Manual moderation** is necessary given that no automated content-safety tooling is in use, and proportionate provided reviewer access is limited and logged. Administrator access to identity data **is** logged today.
- **Receipt collection** is necessary for platform integrity but is the **least proportionate element** as designed, because third parties on a receipt have no visibility or control. Mitigations in section 6.
- **Donations by people of any age** are proportionate only because Dono collects no more from a child than from any other donor, does not profile donors, and does not market to them without an opt-in. The confirmation at checkout is the only control at the point of risk, and it is weak. This is accepted deliberately and recorded as a residual risk rather than mitigated away.
- **Analytics** is necessary and proportionate because it is consent-based, session replay is off, and nothing loads before consent.

## 4. Consultation

No consultation with data subjects has been carried out, because Dono is pre-launch with no user base to consult. This is recorded rather than glossed over. **Before the first significant feature change after launch, seek feedback from a sample of donors and campaign creators on the verification and receipt-upload flows**, which are the two most intrusive touchpoints.

## 5. Risks

Pre-mitigation likelihood and severity, the mitigation, the owner, whether it is implemented, and the residual position. **Residual risk is not recorded as low where the mitigation is not built.**

| # | Risk | Pre-mit. likelihood | Pre-mit. severity | Mitigation | Owner | Implemented? | Residual |
|---|---|---|---|---|---|---|---|
| 1 | Student-card image retained beyond its deletion point | **High** | High | System-enforced deletion job on successful check, and a 30-day job for rejected or abandoned checks; deletion events logged | Engineering | **NO — not built** | **High** |
| 2 | Retention periods not enforced, so data is kept indefinitely | **High** | Medium–High | Scheduled deletion jobs implementing the Privacy Notice schedule; deletion audit log; backup propagation documented | Engineering | **NO — not built** | **High** |
| 3 | Third-party personal data on receipts processed with no visibility for that person | Medium | Medium | Just-in-time redaction guidance at upload; Dono's right to redact; Article 14 assessment; publicly available Privacy Notice clause 11.3; delete with the evidence | Amrit | Partly — guidance drafted, **no automated redaction check** | Medium |
| 4 | Reviewer over-access to identity data during content moderation | Medium | Medium | Separate the "content to review" view from identity data; server-side role checks; **audit log on every identity-data access** | Engineering | Partly — **audit logging is live**; separation of views is not | Medium |
| 5 | Deletion failure — account closure does not actually delete | **High** | Medium | Account closure to delete rather than only anonymise the profile, subject to the retention schedule | Engineering | **NO — closure anonymises the profile only** | **High** |
| 6 | Compromise of a founder or administrator account | Medium | **High** | Multi-factor authentication for all administrators; least privilege; prompt removal on departure; audit logging | Engineering | **NO — MFA not built.** Rate limiting and lockout are live | **High** |
| 7 | Insider misuse of identity or donor data | Low | High | Access limited by role; audit logging on identity access; written confidentiality and data-handling agreements with everyone who has access | Amrit | Partly — **no signed team agreements exist** | Medium–High |
| 8 | Overseas processing without a completed transfer assessment | **High** | Medium | Convex: SCCs + UK Addendum, transfer assessment adopted. **Vercel: SCCs + UK Addendum but no TRA** | Amrit | **NO for Vercel** | **High until the Vercel TRA is completed** |
| 9 | Processor without an executed DPA | **High** | Medium | Execute and file DPAs for Resend, PostHog and Stripe before launch | Amrit | **NO — three outstanding** | **High** |
| 10 | Public user-generated content exposing personal data | Medium | Medium | Pre-publication human review of every campaign; Community Guidelines rules on sensitive information; right to redact; report and removal route | Amrit | Partly — review is live; **report controls incomplete** | Medium |
| 11 | Donor inference — a donor identified from public information despite hiding their name | Medium | Low–Medium | Explain the re-identification risk at the point of choosing; amount shown but name suppressed; **no inference of characteristics from donation history** (APD) | Amrit | Yes for the explanation | Low–Medium |
| 12 | A hidden-name donor identified by the recipient through Stripe | **High** | Medium | Cannot be prevented — direct charges land on the recipient's own account. **Disclosed honestly** in the Terms, Donor Terms and Privacy Notice; contractual prohibition on using it to identify or contact the donor | Amrit | Yes — disclosure corrected in v2.2 | **Medium, accepted** |
| 13 | Processing children's data on an unverified self-declaration | **High** | Medium | Checkout confirmation (flat 18+, no parent/guardian alternative — that branch was decided against, not deferred); no additional collection from under-18s; no profiling; no marketing without opt-in; parent/guardian route to access, correct and delete a child's data (refund handled as an ordinary unauthorised-payment claim, not a separate parental-permission ground); children's risk assessment | Amrit | Partly — **the checkout confirmation is not built** | **Medium–High** |
| 14 | Excessive or unsafe retention of CSEA material | Medium | **Very high** | Two separate automated deletion clocks — NCA reference 5 years, content and supporting information 1 year; restricted storage; minimum access; no personal copies | Engineering / Amrit | **NO — not built** | **High** |
| 15 | Security incident going undetected or unassessed within 72 hours | Medium | High | Incident Response Plan with named lead and deputy; processor notification obligations; breach log; tabletop exercise | Amrit | Partly — **plan exists and names are filled, but it has never been tested** | Medium–High |
| 16 | Analytics collecting more than disclosed | Medium | Low–Medium | Consent gate; session replay off; authentication fields excluded; confirm project settings for location and device data | Engineering | Partly — **project settings unconfirmed** | Medium |

## 6. Required mitigations before launch

These are launch blockers, ordered by residual risk:

1. **Automated deletion of student-card images** — immediately on a successful check, and within 30 days for a rejected or abandoned one. Log deletion events. (Risk 1)
2. **Retention enforcement** — scheduled deletion jobs implementing the Privacy Notice schedule, deletion audit logging, and documented backup propagation. (Risks 2, 5)
3. **The two CSEA deletion clocks.** (Risk 14)
4. **Multi-factor authentication for every administrator.** (Risk 6)
5. **Complete the Vercel transfer risk assessment; execute and file the Resend, PostHog and Stripe DPAs.** (Risks 8, 9)
6. **Execute written confidentiality, data-handling and IP agreements** with everyone who has access to identity data, evidence, moderation records or appeals. (Risk 7)
7. **Build the checkout age confirmation.** (Risk 13)
8. **Complete the report controls, the public reporting form and the moderation case record.** (Risk 10)
9. **Run the incident-response tabletop exercise** and record it. (Risk 15)
10. **Confirm the PostHog project settings** and disable anything not disclosed in the Cookie Notice. (Risk 16)

## 7. Residual risk and approval

**Residual risk is currently assessed as HIGH.** Seven of the sixteen risks above carry a high residual rating, in every case because the mitigation is a planned engineering control rather than an implemented one.

**This DPIA does not support processing at launch in its current state.** It supports launch **once mitigations 1–9 in section 6 are implemented and evidenced**, at which point the residual position should be reassessed as medium overall, with the accepted residual risks being: identification of a hidden-name donor through the recipient's Stripe account (risk 12, disclosed and contractually controlled but not technically preventable), and processing children's data on an unverified declaration (risk 13, a deliberate product decision recorded in the Children's Risk Assessment).

**Do not process high-risk data until the required mitigations are live.**

Signed off by: _________________ (data protection lead)
Date: _________________

## 8. Matters left for future confirmation

Recorded as requiring confirmation rather than assumed: processing volumes and scale after launch; implementation evidence for each technical mitigation; the outcome of the post-launch user consultation in section 4; any future institutional data-sharing arrangement; any future automated identity verification or fraud scoring; and any expansion beyond the current single-institution operating model.
