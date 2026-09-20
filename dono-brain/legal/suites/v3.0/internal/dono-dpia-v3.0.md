# Data Protection Impact Assessment — Dono

**Document:** Data Protection Impact Assessment (Article 35 UK GDPR)
**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval (see approval block)
**Controller:** Amrit Kaur Rooprai, sole trader, trading as Dono
**Accountable owner:** Amrit Kaur Rooprai (data protection lead)
**Deputy:** Sashank
**Supersedes:** `../../v2.3/dono-dpia-v2.3.md` and all earlier versions, which are retained unaltered in the version archive
**Status:** Clean consolidated record. This document states the current position only. It contains no amendment block and no superseded text.

**Review triggers:** any institutional data-sharing going live; any automated identity or fraud scoring; any change to age controls; expansion beyond the Society-only beta; any new upload type or profile field; any change of processor, product or region; any change to the Appropriate Policy Document's condition mapping; any personal data breach; and in any event by 7 February 2027.

---

## 1. Purpose, authority and reading order

This DPIA is the legal assessment and approval record for the high-risk processing Dono carries out. It is **not** an engineering specification.

| Source | Role |
|---|---|
| `../../../../TRUTH.md` | Settled product and business decisions. Wins over everything below |
| `../../../../engineering/legal-launch/PRIVACY_DPIA_ENGINEERING_NARRATIVE.md` | The single authoritative description of data flows, retention, deletion and lawful-basis dependencies that engineering builds |
| `../../../../engineering/legal-launch/ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md` | The authoritative build backlog. Every item marked *launch blocker* or *publication blocker* is a DPIA mitigation |
| This DPIA | Risk assessment, residual-risk determination, Article 36 determination and approval |

Engineering must not derive the system from this DPIA in isolation. Conversely, engineering completion does not constitute DPIA approval — approval is the act of the data protection lead recorded in section 10.

---

## 2. Screening — why a DPIA is required

Dono:

- processes identity-check outcomes and verified creator identity and age fields obtained from the Payment Provider;
- publishes user-generated content to a general audience that includes children;
- operates a declaration-based Donor age control that a child may attempt to bypass;
- processes allegations of criminal conduct through moderation, safeguarding and financial-crime processes; and
- processes child sexual exploitation and abuse (CSEA) material under a restricted procedure.

That combination engages Article 35(3) UK GDPR and the ICO's list of processing requiring a DPIA. A DPIA is therefore mandatory.

### 2.1 Scope

Six processing streams are in scope:

1. creator eligibility, identity-outcome and age verification;
2. receipts and third-party personal data;
3. campaign and comment moderation, including reports, safeguarding and CSEA;
4. Donations, including attempted circumvention of the 18-or-over rule;
5. consent-based analytics; and
6. contract-evidence processing — acceptance records, immutable legal versions and checkout disclosure snapshots.

General account processing is recorded in the ROPA and does not independently require DPIA treatment.

**Out of scope.** Institutional data-sharing with universities is out of scope **because Dono shares no personal data with any institution**. Individual (non-Society) Student Campaigns are out of scope because they are disabled at the API boundary for the Society-only beta. Either change is a review trigger and must be assessed before it goes live.

---

## 3. Description of the processing

### 3.1 Creator eligibility, identity outcome and age

A Society Representative proves control of a recognised institutional email address through a one-time code or link. Dono stores the institutional email address, the institution, course or end-date information where given, and the verification outcome.

**Dono does not collect a student card, a student number, a government identity document or a face scan.** The Payment Provider (Stripe) conducts its own identity and Connected Account onboarding as an independent controller under its own regulatory obligations, and holds any identity document and face scan. Dono receives only:

- the connected-account identifier and status;
- the identity-check outcome;
- the verified name; and
- the verified date of birth.

The verified date of birth is the **final, fail-closed age gate** for Campaign and Society creators. A missing, inconsistent or under-18 result fails closed. An apparent error is handled through the documented correction route; there is no manual age override.

**Necessity.** To confirm that a Society Representative is a real, currently enrolled member of the institution claimed, and is an adult. This is core to donor trust and to platform integrity.

**What Dono does not do.** Dono carries out no know-your-customer process of its own; that obligation is Stripe's. Dono does not contact a university to confirm anything.

### 3.2 Receipts and third-party personal data

Society Representatives upload receipts, invoices and quotes evidencing expenditure. These can contain personal data about people who are not Dono users, have no relationship with Dono, and would not otherwise know Dono holds their data — a supplier's contact details, a named individual on an invoice.

**Necessity.** To evidence that donated funds were applied as described.

**Risk driver.** This is the only category where Dono knowingly receives third-party personal data outside a direct relationship. Article 14 UK GDPR is engaged and is assessed separately in `dono-article-14-assessment-v3.0.md`.

### 3.3 Moderation, reports, safeguarding and CSEA

Every campaign is reviewed by a person before publication and after a material edit. Comments are post-moderated. Anyone, including a person with no account, may report content, and Dono records the report, the content version seen, the decision and the reasons. A reporter is never required to decide whether conduct is criminal.

Suspected CSEA content is restricted immediately, handled by a specialist-only route, and reported to the National Crime Agency under `dono-csea-reporting-procedure-v3.0.md`.

Allegations with no platform-integrity, safeguarding or legal-claim dimension are **refused at intake and their substance is not retained**; only a minimal refusal log is kept for 12 months. That rule is set out in the Appropriate Policy Document §5.

**Necessity.** Online Safety Act 2023 duties; fraud and safeguarding control; and the fact that public pages are visible to children.

**Risk drivers.** Reviewers see identity-adjacent and third-party data. Moderation records contain allegations of criminal conduct, which are Article 10 data. CSEA processing involves the most sensitive material Dono will hold.

### 3.4 Donations and attempted under-18 circumvention

A person may donate with or without an account **only** if they actively confirm that they are 18 or over and have legal capacity. Parent or guardian permission is not an alternative. Dono records the Donor's name, email address, amount, Campaign, display preference, the exact recipient panel shown, the applicable document versions and the exact checkout confirmation.

Payment is a Stripe Connect **direct charge** to the Society's Connected Account. Dono never holds, pools, delays or diverts donation funds.

**Necessity.** It is the core function of the Platform, and the confirmation is required to apply and evidence the adult-only rule.

**Risk driver.** The declaration is **not** verified age assurance and is not highly effective age assurance. A child may falsely confirm, so Dono may still receive their donation data and must apply the refund and safeguarding response in the policies.

### 3.5 Analytics

PostHog Cloud EU collects pseudonymous product events **only after the user gives consent**. No analytics library, request or storage loads before consent. No identify call, session replay, authentication-field capture, advertising integration or third-party export is used. IP is anonymised at ingest. **Retention: 12 months.** The consent choice, its timestamp and the Cookie Notice version are stored, and withdrawal stops future collection and is propagated.

### 3.6 Contract evidence

Dono stores, for each acceptance: the user or guest identifier, the role, the campaign identifier where relevant, the accepted document versions and their hashes, the timestamp and the acceptance event. Published legal-document versions are held in a permanent immutable archive. These are **evidence records, not general user profiles**, and the fields are minimised accordingly.

---

## 4. Necessity and proportionality

| Stream | Assessment |
|---|---|
| Creator eligibility and identity outcome | **Necessary and proportionate.** Limited to creators; uses the least intrusive check that evidences enrolment (control of an institutional address); Dono receives no identity document or face scan at all, only four outcome fields; those fields are role-restricted and access-logged, and carry a defined retention period rather than being held indefinitely |
| Receipts and third-party data | **Necessary for platform integrity but the least proportionate element as designed**, because a third party named on a receipt has no visibility or control. Mitigated by just-in-time redaction guidance, restricted reviewer views, rejection and 30-day quarantine deletion, and minimisation of accepted fields to supplier, item, amount, date and reference. Article 14 is addressed separately |
| Moderation, safeguarding and CSEA | **Necessary** given statutory duties and the absence of automated content-safety tooling; **proportionate** provided reviewer access is role-limited and logged, the refusal rule is applied at intake, and CSEA access is specialist-only with two separate deletion clocks |
| Donations, including by a person falsely declaring their age | **Proportionate** only because Dono collects no more from a child than from any other donor, does not profile donors, does not infer characteristics from donation history, and does not market without an opt-in. The checkout confirmation is the only control at the point of risk and it is weak. This is a deliberate product decision, accepted and recorded as a residual risk in section 8 rather than mitigated away |
| Analytics | **Necessary and proportionate.** Consent-based, nothing loads before consent, session replay off at both client and project level, 12-month retention with enforcement enabled |
| Contract evidence | **Necessary** to prove what a user accepted and what was disclosed at checkout, and **proportionate** because the retained fields are minimal identifiers and version references rather than profile data |

**Alternatives considered and rejected.** Collecting a student card or government document directly — rejected as disproportionate and removed from the product. Holding donation funds in a platform account — rejected; direct charges only. Verified age assurance for donors — rejected for beta as disproportionate to the risk of a payment-card transaction requiring an adult instrument, and recorded as an accepted residual risk with a review trigger. Automated content classification — not adopted; human pre-publication review is used instead.

---

## 5. Consultation

### 5.1 Data subjects

No consultation with data subjects has been carried out, because Dono is pre-launch and has no user base to consult. This is recorded rather than glossed over, as Article 35(9) permits where consultation is not appropriate.

**Committed action.** Before the first significant feature change after launch, seek structured feedback from a sample of Donors and Society Representatives on the two most intrusive touchpoints: the checkout disclosure and age confirmation, and the receipt-upload flow. Record the outcome in the next revision of this DPIA.

### 5.2 Internal and external

| Consultee | Status |
|---|---|
| Data protection lead (Amrit Kaur Rooprai) | Author and approver of this DPIA |
| Deputy (Sashank) | Reviewed the consolidated suite and the engineering narrative |
| Engineering | Provided the evidence of 5 August 2026 on which the current-state findings in section 7 rest; owns the DP-ENG evidence bundle |
| Solicitor | **Outstanding.** Instructed on the Appropriate Policy Document conditions (private drafts, pre-publication review, receipts, criminal allegations), the payments/FCA perimeter and the donation/consumer-law characterisation. Their advice is a review trigger for this DPIA |
| Processors | Assistance obligations confirmed in each DPA (Stripe DPA §3.1(e); Resend DPA §8.1–8.2) |
| ICO | Prior consultation determination in section 9. No consultation made at this date |

### 5.3 Data protection officer

Dono is **not** required to appoint a DPO under Article 37 UK GDPR: it is not a public authority, its core activities do not consist of regular and systematic monitoring of data subjects on a large scale, and its core activities do not consist of large-scale processing of special category or Article 10 data. The data protection lead role is recorded instead. This determination is a review trigger if scale changes.

---

## 6. How risk is scored

**Likelihood:** Low (unlikely on the designed controls) · Medium (foreseeable) · High (expected to occur without an effective control).
**Severity:** Low · Medium · High · Very high (severe or irreversible harm to a data subject).

**Risk level** is the product of the two, banded Low / Medium / High.

Three columns are recorded for every live risk:

- **Inherent** — the risk with no Dono control applied.
- **Residual on evidence** — the risk once the stated control is implemented **and** its stated acceptance evidence is delivered.
- **Residual today** — the risk as at the version date, on the engineering evidence of 5 August 2026.

**Residual risk is never recorded as low where the control is not built.** "Residual on evidence" is a forward assessment used to determine whether the design can support processing at all; it is not a statement that the control exists.

---

## 7. Risk register

### 7.1 Risks closed by design

These risks are recorded for audit continuity. The processing that created them no longer exists in the design, so they carry no residual score and are not carried into section 7.2.

| Ref | Risk as previously assessed | Why it is closed | Evidence required to confirm closure |
|---|---|---|---|
| C-01 | Student-card image retained beyond its deletion point | Student-card collection is removed from the product entirely — UI, API, storage, extraction and admin review | EL-01: no route exists to upload or view a student card |
| C-02 | Six-year retention of a student number | The field is removed; student status is evidenced by control of an institutional email address | EL-01, EL-02: field removed; existing values deleted with a logged deletion event |
| C-03 | Breach impact of a stored student-card corpus | The corpus is deleted and no longer collected | EL-02: deletion log, storage inventory before and after, backup expiry confirmed |
| C-04 | Dono storing government identity documents and serving them to administrators | Dono's `idDocumentStorageId`, the upload route and the admin document viewer are removed. Stripe holds identity material as independent controller | EL-07: API tests prove the upload and view routes fail server-side; legacy files inventoried and deleted |
| C-05 | A public, unauthenticated payment path settling on Dono's own platform account, with no age gate and no acceptance record | The platform-account charge path is removed at the API boundary. Direct charges to the Connected Account only. **Zero Donations were ever processed through it**, so there is no affected population and no remediation workflow | CF-01: negative tests prove the route is gone; founder's zero-payment confirmation retained |
| C-06 | An 18-or-over attestation written as a hard-coded constant, making the field worthless as evidence and its presence misleading | The constant is removed. A real, actively given confirmation is captured and stored for every donation | AG-01: a donation cannot complete without the confirmation; stored value reflects the actual user act |
| C-07 | Recurring donations and Match Windows creating unexpected repeat charges and unmanaged profiling | Both features are removed at the API boundary for beta | CR-01, CR-02: no route creates a recurring charge or a match window |
| C-08 | Processing a user-to-user allegation with no matched Article 9 or Article 10 condition | The Appropriate Policy Document §5 refusal rule means the category is **not processed at all**, rather than processed on an uncertain footing | APD §5 rule written; intake filtering and the minimal refusal log are build items (see L-14) |

### 7.2 Live risk register

| Ref | Risk | Inherent L | Inherent S | Inherent | Control | Owner | Build ref | Residual on evidence | Residual today |
|---|---|---|---|---|---|---|---|---|---|
| L-01 | Retention periods are not enforced, so personal data is kept indefinitely | High | High | **High** | Scheduled, idempotent, observable deletion jobs enforcing every period in the retention schedule; deletion ledger recording category, record ID, rule, timestamp and result; scoped and dated legal holds; alerting on job failure | Engineering | DP-ENG-02 / PR-01 | **Low–Medium** | **High** — verified 5 Aug 2026 that no retention or deletion job of any kind runs |
| L-02 | Account deletion is anonymisation, not erasure, and strands outstanding obligations by severing sign-in | High | Medium | **High** | Re-authentication and explicit confirmation; outstanding-obligation check that blocks or routes deletion where an active campaign, refund, investigation or legal obligation would be stranded; field-level delete or anonymise per rule; audit event; export | Engineering | DP-ENG-03 / PR-09 | **Low–Medium** | **High** |
| L-03 | Verified name and date of birth from the identity check are retained indefinitely and survive account deletion | High | High | **High** | Defined retention period (active Campaign or Society, then 6 years from closure; deleted on account deletion where no live obligation or claim requires retention); deletion cascade; role restriction; access logging | Engineering | DP-ENG-04 / EL-08, PR-09 | **Low** | **High** |
| L-04 | Backup retention, restore behaviour and deletion propagation are unverified, so whether deleted data is actually gone cannot be answered | Medium | High | **High** | Confirm each provider's backup period, restore process and deletion propagation; document the verified behaviour; do not publish an invented period; run a restore and deletion test where the provider permits | Amrit / Engineering | DP-ENG-08 / PR-10 | **Low–Medium** | **High** |
| L-05 | Third-party personal data on a receipt is processed with no visibility or control for that person | Medium | Medium | **Medium** | Just-in-time mandatory redaction guidance before upload; blocking of obvious payment-card and security-code data where technically practicable; restricted reviewer view with redact and reject actions; 30-day quarantine deletion; minimisation of accepted fields to supplier, item, amount, date and reference; Article 14 assessment; Privacy Notice clause 11.3; deletion with the evidence | Amrit / Engineering | DP-ENG-05 | **Low–Medium** | **Medium** — guidance drafted, no automated check |
| L-06 | Reviewer over-access to identity data during content moderation | Medium | Medium | **Medium** | Separate the content-to-review view from identity data; server-side role checks; audit log on every identity-data access | Engineering | DP-ENG-04, DP-ENG-07 | **Low** | **Medium** — audit logging is live; separation of views is not |
| L-07 | Compromise of a founder or administrator account | Medium | High | **High** | Multi-factor authentication at every provider console; unique least-privilege production accounts; prompt revocation on departure; access inventory; tamper-evident audit events for high-impact administrative access | Engineering / Amrit | DP-ENG-09 | **Low–Medium** | **High** — MFA not implemented; rate limiting and lockout are live |
| L-08 | Insider misuse of identity, donor, evidence or moderation data | Low | High | **Medium–High** | Role-limited access; audit logging on identity access; executed written confidentiality, data-handling and IP agreements with everyone holding access; production access blocked for anyone not recorded as authorised | Amrit | DP-ENG-09 / Team and Contributor Agreement | **Low–Medium** | **Medium–High** — no signed agreements exist |
| L-09 | Overseas processing without a completed transfer risk assessment | High | Medium | **High** | A completed transfer risk assessment for every processor transferring outside the UK, recorded in `dono-international-transfer-assessment-v3.0.md` | Amrit | DP-ENG-08 | **Low–Medium** | **Medium** — Convex closed (provider assessment adopted); **Resend closed** on the executed DPA of 14 January 2026 (EU SCCs + UK Addendum, plus DPF certification and a supplementary-measures clause); Stripe covered by its Data Transfers Addendum; **Vercel outstanding and blocking** (its DPA contains no transfer impact assessment); PostHog and Google outstanding |
| L-10 | A processor is used without an Article 28 contract in place | High | Medium | **High** | Execute, record and file an Article 28 contract, with version, date, products, account and sub-processor list, for every processor before it processes | Amrit | DP-ENG-08 / provider register | **Low** | **Medium** — Convex, Vercel and **Resend** in place; **Stripe DPA of 18 November 2025 identified and filed** (Stripe Payments Europe, Limited applies to a UK account); **PostHog and Google outstanding and blocking** |
| L-11 | Public user-generated content exposes personal data | Medium | Medium | **Medium** | Pre-publication human review of every campaign text, image, document, full video and external link, and after each material edit; Community Guidelines rules on sensitive information; right to redact; report and removal route; no prompting for special-category or criminal-offence narratives | Amrit / Engineering | DP-ENG-07 | **Low–Medium** | **Medium** — review is live; report controls incomplete |
| L-12 | A donor is identified from public information despite choosing to hide their name | Medium | Low–Medium | **Low–Medium** | Explain the re-identification risk at the point of choosing; show the amount but suppress the name; no inference of characteristics from donation history (APD) | Amrit | — | **Low–Medium** | **Low–Medium** — explanation in place |
| L-13 | A hidden-name donor is identified by the recipient through the recipient's own Stripe account | High | Medium | **Medium–High** | **Cannot be technically prevented** — a direct charge lands on the recipient's own account and the recipient sees their own Stripe data. Controlled by honest disclosure in the Terms, Donor Terms and Privacy Notice at the point of choice, and by a contractual prohibition on using that information to identify or contact the donor, enforceable by suspension | Amrit | — | **Medium — accepted** | **Medium — accepted.** Disclosure is in place |
| L-14 | An allegation with no platform-integrity, safeguarding or legal-claim dimension is processed with no matched Article 9 or Article 10 condition | Medium | Medium–High | **Medium** | APD §5 refusal rule applied at intake; the allegation is not opened as a case and its substance is not retained; a minimal refusal log is kept for 12 months | Amrit / Engineering | DP-ENG-07 | **Low** | **Medium** — the rule is written; intake filtering and the refusal log are not built |
| L-15 | Children's personal data is processed on an unverified self-declaration of age | High | Medium | **High** | Mandatory active 18-or-over and capacity confirmation at every donation, in the exact Donor Terms wording, with payment blocked without it and the confirmation stored; no additional collection from a person who is in fact under 18; no profiling; no marketing without opt-in; parent or guardian route to access, correct, delete and refund; Children's Risk Assessment and ICO Children's Code assessment | Amrit / Engineering | CH-04, AG-01 | **Medium — accepted** | **Medium–High** — the confirmation is not built |
| L-16 | Excessive or unsafe retention of CSEA material | Medium | Very high | **High** | Two separate automated deletion clocks — NCA report reference 5 years, content and prescribed supporting information 1 year; immediate restriction; minimum copying; specialist-only auditable access; documented lawful hold where one applies | Engineering / Amrit | DP-ENG-07 | **Low–Medium** | **High** — not built |
| L-17 | A personal data breach goes undetected, so the 72-hour clock never starts | Medium | High | **High** | Alerting for production errors, failed retention jobs, repeated authentication failures, disputes and security events; Incident Response Plan with named lead and deputy; processor notification obligations (Stripe: 48 hours; Resend: without undue delay); breach log; tested tabletop exercise | Amrit / Engineering | DP-ENG-09 / AL-01 | **Low–Medium** | **High** — no monitoring or alerting exists; the plan has never been tested |
| L-18 | Analytics collects more than is disclosed | Medium | Low–Medium | **Medium** | Consent gate with nothing loading before consent; session replay disabled at **both** client and project level; identify calls, authentication-field capture, advertising integrations and third-party export disabled; 12-month retention with enforcement enabled; clean-browser network traces for reject, accept and withdraw | Engineering | DP-ENG-06 / CK-07, CK-08 | **Low** | **Medium** — session replay is enabled at project level while disabled in the client, and retention enforcement is off |
| L-19 | No malware scanning on any upload path, including campaign media and evidence | Medium | Medium | **Medium** | Malware scanning on every upload path before storage and before any reviewer or public exposure; quarantine and log on detection | Engineering | AL-02 | **Low** | **Medium** — no scanning exists |
| L-20 | A demonstration mode grants unauthenticated administrative access | Low | High | **Medium** | Remove open demo-admin behaviour from any deployment holding real personal data; test that it is unreachable in production | Engineering | SE-09 | **Low** | **Medium** — present on a non-production deployment |
| L-21 | A guest's acceptance is not linked to their donation, so Dono cannot prove which version they accepted | High | Low–Medium | **Medium** | Acceptance record for every acceptance including guests: user or guest identifier, role, campaign, accepted document versions and hashes, timestamp and event; permanently linked to the donation | Engineering | CH-05, CH-14 | **Low** | **Medium** — not linked |
| L-22 | The product serves a draft legal stub rather than the approved suite, so the disclosed processing is not the assessed processing | High | Medium | **High** | Serve only the approved manifest in `../publication-package/BETA_DOCUMENT_MANIFEST.md`, with immutable versions and hashes; Release Control Matrix pins deployment, commit and legal manifest | Amrit / Engineering | CH-15, DP-ENG-10 | **Low** | **High** — a draft stub is served |
| L-23 | Dono instructs a reversal from a Campaign Owner's Stripe balance under the refund mandate, affecting their funds and their data | Medium | Medium | **Medium** | Advance disclosure of the mandate in the Terms; notice and an opportunity to respond before execution; a limited and defined purpose; an appeal to a different reviewer; full logging of amount, reference, date, authoriser and determination; pre-refund dispute check preventing double recovery | Amrit / Engineering | RF-01 to RF-07 | **Low–Medium** | **Medium** — disclosed, not built |
| L-24 | The acceptance and version archive holds identifiers indefinitely | Low | Low–Medium | **Low–Medium** | Minimal fields only — identifier, role, version reference, hash, timestamp and event. Acceptance records are retained 6 years from acceptance; only the **document versions themselves**, which contain no personal data, are held indefinitely | Amrit / Engineering | DP-ENG-10 | **Low** | **Low–Medium** |
| L-25 | Receipt quarantine temporarily holds non-compliant third-party personal data | Medium | Medium | **Medium** | Maximum 30 days from rejection, then automatic deletion with a logged event; restricted access during quarantine; no public or donor access | Engineering | DP-ENG-05 | **Low** | **Medium** — quarantine and timed deletion not built |
| L-26 | The data-protection complaints register is a new store of personal data about people exercising their rights | Low | Medium | **Low–Medium** | Minimal fields; restricted register; single support address; acknowledgement within 30 days; 3-year retention from closure | Amrit | DP-ENG-07 | **Low** | **Low–Medium** |

### 7.3 Summary

| Band | Residual today | Residual on evidence |
|---|---|---|
| High | 9 (L-01, L-02, L-03, L-04, L-07, L-16, L-17, L-22, and L-09/L-10 partially) | **0** |
| Medium / Medium–High | 14 | 3, of which 3 are expressly accepted (L-13, L-15) or transitional |
| Low / Low–Medium | 3 | 23 |

---

## 8. Accepted residual risks

Two risks are **accepted** rather than eliminated. Both are deliberate product decisions and both must be expressly accepted in writing at approval.

**A1 — Identification of a hidden-name donor by the recipient through the recipient's own Stripe account (L-13).** Direct charges settle on the Society's Connected Account, so the account holder can see their own Stripe transaction data. This cannot be prevented technically without abandoning the direct-charge model, which is itself a control against Dono holding funds. It is controlled by honest disclosure at the point the donor chooses to hide their name, and by a contractual prohibition on using the information to identify or contact the donor. **Residual: Medium.**

**A2 — Processing personal data of a person who falsely declares they are 18 or over (L-15).** The checkout confirmation is not verified age assurance. Verified age assurance for donors is assessed as disproportionate for a Society-only beta in which the payment instrument itself is ordinarily an adult instrument, and would require collecting more identity data from every donor than the risk warrants. It is controlled by the active confirmation, by collecting no more from a child than from anyone else, by no profiling and no marketing without opt-in, and by a parent or guardian route to access, correct, delete and refund. **Residual: Medium.** Review trigger: any evidence of actual under-18 donation volume, or any change to Ofcom's expectations on age assurance for this kind of service.

No other residual risk is accepted. Every remaining risk is to be reduced to Low or Low–Medium by the controls in section 7.2 before processing begins.

---

## 9. Article 36 determination — is ICO prior consultation required?

**Test.** Article 36(1) UK GDPR requires prior consultation with the ICO where a DPIA indicates that the processing **would result in a high risk in the absence of measures taken by the controller to mitigate the risk**. The obligation bites on the residual position after mitigation, not on the inherent position.

**Analysis.**

1. Nine risks carry a **high residual rating today**. In every case the reason is that the mitigation is a specified but unimplemented control, not that the risk is unmitigable.
2. On the "residual on evidence" assessment, **no risk remains high** once the controls in section 7.2 are implemented and their acceptance evidence is delivered. The two accepted residual risks (A1, A2) are assessed as **Medium**, not high.
3. Article 36 is therefore **not engaged by the designed processing**.
4. The high ratings recorded today do not trigger Article 36 either, because **the processing they relate to has not begun and must not begin**. Section 10 makes non-commencement the operative control. A controller does not consult the ICO about processing it has decided not to carry out; it consults about processing it intends to carry out that remains high-risk after mitigation.

**Determination.** **ICO prior consultation under Article 36 is not required**, on the following two conditions, both of which are binding:

- **Condition 1.** Processing does not begin until the controls in section 7.2 are implemented and evidenced, and this DPIA is re-scored against that evidence and approved under section 10.
- **Condition 2.** If, on that re-score, **any** risk other than A1 and A2 remains High, or if either accepted risk is re-assessed as High, the data protection lead must **stop and consult the ICO before processing begins**, and record that decision here.

This determination is made on the analysis above and is not to be treated as settled by assumption. It must be re-made, and re-recorded, at the point of approval.

**Consultation made to date:** none.

---

## 10. Conclusion and approval

### 10.1 Conclusion

**The design is capable of supporting the processing.** No residual high risk survives the designed control set, and the two accepted residual risks are proportionate, disclosed and reviewable.

**This DPIA does not support processing at the version date.** Nine risks carry a high residual rating today because their controls are specified but not built. The conclusion of every previous version — that processing must not begin until the required mitigations are live and evidenced — is unchanged and is not softened by this consolidation.

### 10.2 Conditions of approval

Approval under section 10.3 authorises processing **only** when all of the following are true, each evidenced by test name, date, result and named approver in the DPIA evidence bundle described in the engineering narrative §6:

1. Every control in section 7.2 with a residual-today rating of High or Medium is implemented and its acceptance evidence is delivered.
2. The provider register is complete for launch, with the PostHog and Google Article 28 positions closed and the Vercel transfer risk assessment completed.
3. The retention and deletion engine, the deletion ledger and the legal-hold mechanism are demonstrated by clock-controlled tests for each data class.
4. The consent flow passes clean-browser desktop and mobile network traces for reject, accept and withdraw, and the analytics project settings match the Cookie Notice.
5. The approved document manifest, immutable versions and hashes are served by the product, and the Release Control Matrix row is signed.
6. The Article 14 assessment, the ICO Children's Code assessment, the Children's Risk Assessment, the Illegal Content Risk Assessment and the CSEA legal-readiness checklist are each approved.
7. The risk register in section 7.2 is re-scored against that evidence and the Article 36 determination in section 9 is re-made.
8. The residual risks A1 and A2 are expressly accepted in writing below.

**Do not backdate this approval.** The date entered must be the date the assessment against evidence was actually completed.

### 10.3 Approval block — SIGNATURE REQUIRED

> **This block is unsigned. The processing it governs is not approved.**

**I confirm that I have re-scored the risk register in section 7.2 against the delivered implementation evidence, that I have re-made the Article 36 determination in section 9, that I expressly accept residual risks A1 and A2 as recorded in section 8, and that I approve the processing described in this DPIA.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Controller and data protection lead |
| Document version approved | 3.0 |
| Evidence bundle reference | ______________________ |
| Residual risks expressly accepted | A1 (hidden-name donor identifiable via recipient's Stripe account) · A2 (unverified donor age declaration) |
| Article 36 determination re-made? | ☐ Yes — consultation not required · ☐ Yes — consultation required and made on ____________ |
| Signature | ______________________ |
| Date of approval | ______________________ |

**Reviewed by (deputy):**

| Field | Entry |
|---|---|
| Name | Sashank |
| Role | Deputy |
| Signature | ______________________ |
| Date | ______________________ |

---

## 11. Matters recorded as requiring confirmation

These are recorded as open rather than assumed. None is treated as closed by this document.

| # | Matter | Owner | Effect if unresolved |
|---|---|---|---|
| 1 | Solicitor review of the Appropriate Policy Document conditions — private drafts, pre-publication review, receipts and criminal allegations | Amrit | The Article 9 and 10 condition mapping is not confirmed; L-14 cannot be closed |
| 2 | PostHog Article 28 position for the Cloud EU instance, own-purposes restriction and retention setting | Amrit | Analytics must remain disabled |
| 3 | Google (support mailbox) Article 28 position and region | Amrit | The support mailbox processes rights requests and reports without a recorded contract |
| 4 | Vercel transfer risk assessment — its DPA contains no transfer impact assessment | Amrit | L-09 remains open and blocking |
| 5 | Backup retention, restore and deletion propagation for each provider | Engineering | L-04 remains High; the Privacy Notice cannot state a backup period |
| 6 | NCA confirmation of CSEA portal registration and eligible users, plus training and a test submission | Amrit | The CSEA route cannot be described as operational |
| 7 | Processing volumes and scale after launch | Amrit | Scale-dependent conclusions, including the DPO determination in §5.3, must be revisited |
| 8 | Outcome of the post-launch data subject consultation in §5.1 | Amrit | Article 35(9) commitment outstanding |
| 9 | Any future institutional data-sharing, automated identity or fraud scoring, or expansion beyond the Society-only beta | Amrit | Each is a review trigger requiring this DPIA to be revisited **before** the change goes live |

---

## 12. Version control

| Field | Entry |
|---|---|
| Version | 3.0 |
| Version date | 7 August 2026 |
| Effective from | On publication approval |
| Accountable owner | Amrit Kaur Rooprai |
| Prepared by | Legal consolidation, 7 August 2026 |
| Reviewed by | *(signature required — section 10.3)* |
| Approved by | *(signature required — section 10.3)* |
| Status | **Not approved.** Prepared for signature |
| Supersedes | `../../v2.3/dono-dpia-v2.3.md` and all earlier versions |
| Next scheduled review | 7 February 2027, or on any review trigger |
