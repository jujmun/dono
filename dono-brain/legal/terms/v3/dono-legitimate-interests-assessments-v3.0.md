# Legitimate Interests Assessments (LIAs) — Dono

**Document:** Legitimate interests assessments (Article 6(1)(f) UK GDPR)
**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval (see approval block)
**Controller:** Amrit Kaur Rooprai, sole trader, trading as Dono
**Accountable owner:** Amrit Kaur Rooprai (data protection lead) · **Deputy:** Sashank
**Supersedes:** v2.3 (6 August 2026) and all earlier versions, retained unaltered in the version archive
**Status:** Clean consolidated record. States the current position only.
**Next review:** 7 February 2027.

Each assessment follows the ICO's three-part test: purpose, necessity, balancing. An assessment is required for every activity where the ROPA records legitimate interests as the Article 6 basis. The assessments below correspond to the ROPA rows cited in each heading.

---

## LIA 1 — Fraud prevention

**Purpose test.** Dono has a legitimate interest in preventing fake campaigns, stolen-card use and fabricated fundraising claims. This protects donors from losing money, protects genuine campaign creators from being tarred by fraud on the Platform, and protects the Platform's integrity and viability. There is also a third-party interest — donors have a strong interest in not being defrauded — which strengthens the case.

**Necessity test.** Human review of every campaign before publication, and use of the Payment Provider's fraud signals, are necessary to this purpose. Automated-only screening would be less reliable at Dono's current scale and would introduce its own risks. The processing uses data already collected for verification and campaign purposes; no additional collection is required.

**Balancing test.** Affected individuals are campaign creators and, incidentally, donors. A campaign creator would reasonably expect a crowdfunding platform to check their campaign before publishing it — indeed the Verification Notice tells them so before they submit. The processing is proportionate: it uses existing data, involves no profiling and no automated decision-making, and directly benefits the people whose funds are at risk. **Safeguards:** access restricted to those with a fraud or moderation role; audit logging on identity-data access; allegations recorded as allegations; a right to object under Privacy Notice clause 13.1; and an appeal route under Community Guidelines clause 8.

**Outcome: legitimate interests applies.** Review if fraud detection moves to automated or algorithmic scoring, which would need its own assessment and a DPIA update.

## LIA 2 — Platform security and error logging (ROPA 31)

**Purpose test.** Dono has a legitimate interest in keeping the Platform secure and available, detecting abuse and attack, and diagnosing faults. Users have a corresponding interest in a service that works and does not leak their data.

**Necessity test.** Server logs (IP address, timestamp, page requested, browser and error data), authentication logs and error logs are necessary to detect intrusion, investigate an incident, and fix faults. There is no meaningfully less intrusive alternative: no logging at all would leave Dono unable to detect abuse or to meet its 72-hour breach-assessment obligation.

**Balancing test.** Every user of any online service would expect security logging. The data is technical rather than intimate; it is not used to profile individuals or to make decisions about them. **Safeguards:** authentication logs retained for 12 months; access restricted; security logs are **not repurposed for behavioural analytics** without reassessing the position; and Dono uses no separate error-monitoring product, so log data does not travel to an additional vendor.

**Outcome: legitimate interests applies.** Review if an error-monitoring product such as Sentry is introduced, since such products commonly capture IP addresses, email addresses and request bodies, and would need to be added to the DPA Register and the ROPA first.

## LIA 3 — Backups and disaster recovery

**Purpose test.** Dono has a legitimate interest in maintaining backups for business continuity and disaster recovery. Losing Platform data would harm every user, not just Dono — donors would lose their records, campaign owners would lose evidence of expenditure, and refund determinations would be unrecoverable.

**Necessity test.** Backups necessarily mirror live data; there is no meaningfully less intrusive way to achieve recoverability.

**Balancing test.** Backup data carries the same risk profile as live data, so it is subject to the same access controls and a shorter retention window. Users would expect a platform holding financial records to keep backups. **Safeguards:** a fixed rolling window rather than an open-ended one; the same access controls as live data; access only in a recovery scenario.

**Outcome: legitimate interests applies, conditionally.** **Open point — the backup period, restore behaviour and deletion propagation are not yet verified with Convex or Vercel.** Until they are, Dono cannot say how long a person exercising erasure remains recoverable from a backup. A fixed, provider-confirmed window that is not accessed for any other purpose is defensible; **an invented period is not, and none is asserted here or in the Privacy Notice.** This assessment holds only once the period is confirmed and documented. See DPIA risk L-04 and ROPA row 32.

## LIA 4 — Third-party personal data in uploaded receipts

**Purpose test.** Dono has a legitimate interest in verifying that donated funds were spent as described. Donors have a strong corresponding interest, and it is the principal accountability mechanism the Platform offers them.

**Necessity test.** Evidence of expenditure necessarily takes the form of receipts and invoices, which name suppliers and sometimes other individuals. Dono needs the supplier name, item description, price, date and reference; it does not need the personal data of anyone else. **The necessity is for the document, not for the third-party data in it** — which is why minimisation does most of the work here.

**Balancing test.** This is the least comfortable of these assessments and should be recorded as such. The affected individuals are **not Dono users, have no relationship with Dono, have not consented, and would not expect Dono to hold anything about them.** A supplier's business contact details are low-risk; an individual named incidentally on an invoice is more sensitive; and a receipt could in principle reveal special category information.

The balance tips in favour of processing only because of the safeguards: **just-in-time redaction guidance at the point of upload**; a contractual obligation on the campaign owner to redact third-party details before uploading; **Dono's own right to redact or remove unnecessary personal data**; the evidence is **never published or shown to donors**; access is limited to those with a review role; the data is used for nothing but expenditure verification and is never used to contact the person; it is deleted with the evidence at six years; and Privacy Notice clause 11.3 is publicly available as an Article 14 transparency measure.

**Outcome: legitimate interests applies, conditionally.** It applies **provided the redaction guidance, the quarantine route and Dono's redaction capability are actually in place.** They are currently guidance only — there is no automated redaction check and no reviewer redaction tool. **If a launch happens without them, this assessment does not hold**, and the DPIA records this as risk L-05.

## LIA 5 — Moderation, reporting and enforcement (ROPA 11, 16, 17, 19)

**Purpose test.** Dono has a legitimate interest, and in large part a legal obligation under the Online Safety Act 2023, in reviewing content before publication, acting on reports, and enforcing its Community Guidelines. The interest is shared by every user and by the children who can view the Platform.

**Necessity test.** Moderation cannot be carried out without processing the content, the account behind it, the report and the reasons for the decision. Recording the decision and its reasons is necessary both to comply with the Act and to make an appeal meaningful.

**Balancing test.** A person posting publicly on a platform would expect it to be moderated, and the Community Guidelines say so. The sharper issue is the person **reported about**, whose record may contain an allegation of criminal conduct. **Safeguards:** an allegation is recorded **as an allegation and never as a finding** (Appropriate Policy Document section 6); the affected user is notified where lawful and safe; an appeal is available under Community Guidelines clause 8, decided by someone not substantially involved; a reversed decision is recorded as reversed; access is restricted; and **retention is risk-based rather than a flat six years** — spam and filter blocks 6 months, ordinary community-rule cases 12 months, repeat-offender and ban-evasion history 3 years from last action, illegal content other than CSEA 3 years from action, and only fraud, financial-misconduct and safeguarding cases 6 years from closure. Reporters' identities are not disclosed to the person reported about. A report with no platform-integrity, safeguarding or legal-claim dimension is **refused at intake and its substance is not retained** (APD §5), with only a minimal refusal log kept for 12 months.

**Outcome: legitimate interests applies**, alongside the legal obligation for the Online Safety Act elements. Note that where the processing concerns a suspected criminal offence, the Article 10 condition in the Appropriate Policy Document is also required.

## LIA 6 — Refunds, disputes and complaints (ROPA 8)

**Purpose test.** Dono needs to determine whether a campaign owner is required to refund a donor, to handle chargebacks, and to answer complaints. Both parties to a dispute have a strong interest in it being decided on evidence.

**Necessity test.** A determination requires access to the campaign as published, the transaction, the evidence submitted, and the correspondence between the parties. The process is now a documented one — intake, completeness, response, determination, reasons, appeal — which makes the necessity easier to evidence than it was when it was informal.

**Balancing test.** Both parties would expect Dono to investigate a dispute they or someone else raised about their campaign. Processing is limited to the specific dispute. **Safeguards:** conflict-of-interest recusal; the campaign owner is told the substance of the allegation and shown the evidence, so the process is not one-sided; **a donor who hid their name is not identified to the campaign owner by Dono**; reasons are given to both parties; an appeal is available; and records are deleted at six years.

**Outcome: legitimate interests applies.**

## LIA 7 — Institutional email verification (ROPA 3)

*Dono no longer collects, processes or stores student cards, student-card images or student numbers. This assessment replaces the former student-card assessment, which is void because the processing no longer exists.*

**Purpose test.** Dono has a legitimate interest in confirming that a person claiming to represent a Society at a recognised institution is genuinely connected to that institution. This prevents impersonation, prevents a person outside the institution raising money in its community's name, and protects donors who give because of the institutional connection.

**Necessity test.** Control of an institutional email address is the **least intrusive check available** that evidences the connection. The alternatives are more intrusive, not less: a student card is an identity document with a photograph and a number; contacting the institution would disclose the individual's fundraising activity to a third party without a basis for doing so. The check collects **one email address the institution has itself issued**, and a one-time code. No document, image, number or photograph is collected.

**Balancing test.** The impact on the individual is minimal and the expectation is obvious — a person applying to raise money as a society representative expects to be asked to prove the connection, and the Verification Notice says so before they start. The address is not used for marketing. No inference is drawn from the domain beyond eligibility. **Safeguards:** only the outcome and date are retained long-term; a failed or abandoned attempt is deleted after 30 days; the one-time code expires; non-institutional domains are rejected; the outcome is never displayed publicly as a badge or trust indicator.

**Outcome: legitimate interests applies.** Review if Dono ever proposes to contact an institution to confirm enrolment, which would be a materially different and more intrusive processing operation requiring its own assessment.

## LIA 8 — Refund mandate execution (ROPA 6)

**Purpose test.** Dono has a legitimate interest in administering the contractual refund process under Terms of Service clause 13.2 so that donor remedies are actually effective. Donors have a strong corresponding interest: **a determination that cannot be executed is not a remedy.** Dono holds no funds of its own and money is settled directly to the Society's Connected Account, so without the mandate a refund determination would be a paper exercise depending entirely on the Campaign Owner's voluntary cooperation.

**Necessity test.** Executing a reversal requires processing the transaction record, the determination and reasons, the amount, the Payment Provider reference, the authorising person and the notice given. There is no less intrusive route: the alternative — Dono holding donation funds itself to guarantee refunds — would be far more intrusive, would create a payment-services perimeter question, and is expressly rejected by the operating model.

**Balancing test.** The affected individual is the Campaign Owner or Society Representative, whose funds move without their contemporaneous instruction. That is a real interference and is treated as such. It is justified because: **the mandate is disclosed in advance** in the Terms they accept; it is **limited to refunds under the Terms** and cannot be used for any other purpose; money moves only from a Campaign Owner to a Donor and never to Dono; it is exercised only after **notice and an opportunity to respond**, except in urgent fraud, unauthorised-payment or harm cases; an **appeal to a different reviewer** is available; and every execution is logged with amount, reference, date, authoriser and determination. A pre-execution dispute check prevents double recovery where a chargeback is open or already resolved in the Donor's favour.

**Outcome: legitimate interests applies, conditionally.** It applies **provided the notice, appeal, dispute-check and logging controls are built**. Executing reversals without them would not survive the balancing test. See DPIA risk L-23 and checklist items RF-01 to RF-07. **Solicitor confirmation of the payment-services perimeter remains outstanding** and is a review trigger.

## LIA 9 — Campaign page archival and de-indexing (ROPA 12)

**Purpose test.** Dono has a legitimate interest in keeping a Campaign page publicly available while it is live and for a period afterwards, so that Donors can see what they funded, evidence of expenditure remains checkable, and the accountability the Platform promises is real rather than notional.

**Necessity test.** Public availability is necessary to the accountability purpose during and shortly after the campaign. It is **not** necessary indefinitely. Archival and de-indexing at 24 months after closure is the least intrusive way to keep the record available to those with a reason to look at it while removing it from general search visibility.

**Balancing test.** The affected individuals are the Society Representative and anyone named in the published material. Indefinite public availability of a fundraising page tied to a named individual — often a student early in their life — is a real and lasting impact, and the previous indefinite position did not survive scrutiny. The 24-month rule, de-indexing, minimisation on archive, and an **earlier depublication route on request** subject to lawful retention, bring the processing into balance. **Safeguards:** the exact campaign version associated with each Donation is preserved separately as a contract-evidence record, so archiving the public page does not destroy the transaction record; de-indexing is applied, not merely intended; a depublication request is handled under the rights process.

**Outcome: legitimate interests applies.** Conditional on the archival and de-indexing job actually running — it is currently unbuilt (DPIA risk L-01).

## LIA 10 — Receipt quarantine (ROPA 13a)

**Purpose test.** Where an uploaded receipt contains third-party personal data that should not have been included, Dono has a legitimate interest in isolating that file rather than either accepting it into the evidence record or deleting it instantly without a trace. Isolation lets Dono tell the uploader what was wrong, gives them a chance to re-upload a compliant version, and keeps the non-compliant data out of the accountable record.

**Necessity test.** A short holding period is necessary because instant deletion would prevent Dono from explaining the rejection and would risk the same non-compliant file being uploaded repeatedly. Retaining the file in the ordinary evidence store would defeat the purpose entirely.

**Balancing test.** The people most affected are third parties named on the rejected receipt, who never chose to be involved at all. The processing is justified only because it is **strictly time-limited and strictly restricted**: a maximum of **30 days from rejection**, then automatic deletion with a logged event; access limited to the reviewer handling the rejection; no public access and no Donor access; the file is used for nothing except the rejection decision and the message to the uploader; and the substance is never copied into the case record. Blocking obvious payment-card and security-code data at upload, where technically practicable, reduces the volume reaching quarantine at all.

**Outcome: legitimate interests applies, conditionally.** It applies **only if the 30-day automatic deletion actually runs.** A quarantine store with no deletion job is simply an unmanaged store of third-party personal data and would fail the balancing test outright. See DPIA risk L-25.

## Activities that do NOT rely on legitimate interests

Recorded here so that no one later writes an assessment for something that runs on a different basis:

| Activity | Basis |
|---|---|
| Product analytics (PostHog) | **Consent.** Not legitimate interests, and not the statistical-purpose exception — the analytics can link events to an identified user |
| Marketing emails | **Consent** |
| Institutional data sharing | **Consent** (and not offered at present) |
| Accounts, campaigns, donations, payments | **Contract** |
| CSEA reporting to the NCA | **Legal obligation** |
| Terms acceptance, checkout disclosure records and the document version archive | **Legal obligation** (accountability) |
| Recurring donations, matched funding, Match Windows, commercial campaigns | **No basis required — none of these features exists.** They are removed at the API boundary. No assessment is to be written for them unless and until a feature is reintroduced, which would be a DPIA review trigger |


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
