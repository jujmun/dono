> ## v2.3 AMENDMENT BLOCK — READ FIRST
>
> **Version 2.3 — 6 August 2026.** This document is carried forward from v2.2 with the amendments below.
> **Where anything in the body of this document conflicts with this block, this block prevails.** The v2.2 text is retained beneath so that the reasoning and evidence are not lost.
>
> **Amendments applying to this document (Legitimate Interests Assessments):**
>
> 1. **Delete the student-card LIA in its entirety.** Dono no longer collects, processes or stores student cards, student-card images or student numbers. **Replace it with an LIA for university-email verification**: purpose — confirming eligibility and preventing impersonation and fraud; necessity — there is no less intrusive way to confirm a person is a student at a recognised institution; balance — the data is a single email address the institution already issued, the check is a one-time code, and no document or image is collected. The impact on the individual is minimal and the expectation is obvious.
> 2. **Add an LIA for the refund mandate** (Terms of Service clause 13.2): purpose — administering the contractual refund process so that donor remedies are effective; necessity — a determination that cannot be executed is not a remedy, and Dono holds no funds of its own; balance — the mandate is disclosed in advance, is limited to refunds under the Terms, moves money only from a Campaign Owner to a Donor, is exercised only after notice and an opportunity to respond except in urgent cases, and is appealable.
> 3. **Add an LIA for the campaign-page archival and de-indexing process** at 24 months, and for the receipt-quarantine process.
> 4. **Update the moderation LIAs** to reflect risk-based retention rather than a flat six years.
> 5. **Remove any LIA relating to recurring donations, matched funding or commercial campaigns** — none of those features exists.

---
# Legitimate Interests Assessments (LIAs) — Dono

**Controller:** Amrit Kaur Rooprai, trading as Dono
**Owner:** Amrit (data protection lead). **Deputy:** Sashank.
**Version:** 2.2 — 31 July 2026
**Approved by:** _________________ **Date:** _________________
**Next review:** 31 January 2027.

Each assessment follows the ICO's three-part test: purpose, necessity, balancing. An assessment is required for every activity where the ROPA records legitimate interests as the Article 6 basis.

## Changes in v2.2

- **LIA 3 is split.** Analytics is no longer covered by a legitimate-interests assessment: it runs on **consent**, because it can link events to an identified user. LIA 3 is now confined to **security and error logging**. This removes the contradiction where the Privacy Notice, the Cookie Notice, the ROPA and this document each gave a different basis for the same processing.
- **Three new assessments** are added for activities the ROPA relies on legitimate interests for but which had none: **third-party data on receipts (LIA 5)**, **moderation and reporting (LIA 6)**, and **dispute and refund records (LIA 7, replacing the old LIA 2)**.
- Each assessment now records the **outcome and the safeguards relied on**, so the balancing test points at something real.

---

## LIA 1 — Fraud prevention

**Purpose test.** Dono has a legitimate interest in preventing fake campaigns, stolen-card use and fabricated fundraising claims. This protects donors from losing money, protects genuine campaign creators from being tarred by fraud on the Platform, and protects the Platform's integrity and viability. There is also a third-party interest — donors have a strong interest in not being defrauded — which strengthens the case.

**Necessity test.** Human review of every campaign before publication, and use of the Payment Provider's fraud signals, are necessary to this purpose. Automated-only screening would be less reliable at Dono's current scale and would introduce its own risks. The processing uses data already collected for verification and campaign purposes; no additional collection is required.

**Balancing test.** Affected individuals are campaign creators and, incidentally, donors. A campaign creator would reasonably expect a crowdfunding platform to check their campaign before publishing it — indeed the Verification Notice tells them so before they submit. The processing is proportionate: it uses existing data, involves no profiling and no automated decision-making, and directly benefits the people whose funds are at risk. **Safeguards:** access restricted to those with a fraud or moderation role; audit logging on identity-data access; allegations recorded as allegations; a right to object under Privacy Notice clause 13.1; and an appeal route under Community Guidelines clause 8.

**Outcome: legitimate interests applies.** Review if fraud detection moves to automated or algorithmic scoring, which would need its own assessment and a DPIA update.

## LIA 2 — Platform security and error logging

*(Previously part of LIA 3, which also covered analytics. Analytics has been moved to consent — see the note at the head of this document.)*

**Purpose test.** Dono has a legitimate interest in keeping the Platform secure and available, detecting abuse and attack, and diagnosing faults. Users have a corresponding interest in a service that works and does not leak their data.

**Necessity test.** Server logs (IP address, timestamp, page requested, browser and error data), authentication logs and error logs are necessary to detect intrusion, investigate an incident, and fix faults. There is no meaningfully less intrusive alternative: no logging at all would leave Dono unable to detect abuse or to meet its 72-hour breach-assessment obligation.

**Balancing test.** Every user of any online service would expect security logging. The data is technical rather than intimate; it is not used to profile individuals or to make decisions about them. **Safeguards:** authentication logs retained for 12 months; access restricted; security logs are **not repurposed for behavioural analytics** without reassessing the position; and Dono uses no separate error-monitoring product, so log data does not travel to an additional vendor.

**Outcome: legitimate interests applies.** Review if an error-monitoring product such as Sentry is introduced, since such products commonly capture IP addresses, email addresses and request bodies, and would need to be added to the DPA Register and the ROPA first.

## LIA 3 — Backups and disaster recovery

**Purpose test.** Dono has a legitimate interest in maintaining backups for business continuity and disaster recovery. Losing Platform data would harm every user, not just Dono — donors would lose their records, campaign owners would lose evidence of expenditure, and refund determinations would be unrecoverable.

**Necessity test.** Backups necessarily mirror live data; there is no meaningfully less intrusive way to achieve recoverability.

**Balancing test.** Backup data carries the same risk profile as live data, so it is subject to the same access controls and a shorter retention window. Users would expect a platform holding financial records to keep backups. **Safeguards:** a fixed rolling window of **30–35 days**, not an open-ended one; the same access controls as live data; access only in a recovery scenario.

**Outcome: legitimate interests applies.** **Open point:** deletion propagation to backups is not documented or product-controlled, which means a person exercising erasure may remain in a backup for up to 35 days. That is defensible provided the window is genuinely fixed and the backup is not accessed for any other purpose — but it must be **documented and confirmed by engineering**, and stated in the Privacy Notice, rather than assumed.

## LIA 4 — Third-party personal data in uploaded receipts

**Purpose test.** Dono has a legitimate interest in verifying that donated funds were spent as described. Donors have a strong corresponding interest, and it is the principal accountability mechanism the Platform offers them.

**Necessity test.** Evidence of expenditure necessarily takes the form of receipts and invoices, which name suppliers and sometimes other individuals. Dono needs the supplier name, item description, price, date and reference; it does not need the personal data of anyone else. **The necessity is for the document, not for the third-party data in it** — which is why minimisation does most of the work here.

**Balancing test.** This is the least comfortable of these assessments and should be recorded as such. The affected individuals are **not Dono users, have no relationship with Dono, have not consented, and would not expect Dono to hold anything about them.** A supplier's business contact details are low-risk; an individual named incidentally on an invoice is more sensitive; and a receipt could in principle reveal special category information.

The balance tips in favour of processing only because of the safeguards: **just-in-time redaction guidance at the point of upload**; a contractual obligation on the campaign owner to redact third-party details before uploading; **Dono's own right to redact or remove unnecessary personal data**; the evidence is **never published or shown to donors**; access is limited to those with a review role; the data is used for nothing but expenditure verification and is never used to contact the person; it is deleted with the evidence at six years; and Privacy Notice clause 11.3 is publicly available as an Article 14 transparency measure.

**Outcome: legitimate interests applies, conditionally.** It applies **provided the redaction guidance and Dono's redaction capability are actually in place.** They are currently guidance only — there is no automated redaction check and no admin redaction tool. **If a launch happens without them, this assessment does not hold**, and the DPIA records this as risk 3.

## LIA 5 — Moderation, reporting and enforcement

**Purpose test.** Dono has a legitimate interest, and in large part a legal obligation under the Online Safety Act 2023, in reviewing content before publication, acting on reports, and enforcing its Community Guidelines. The interest is shared by every user and by the children who can view the Platform.

**Necessity test.** Moderation cannot be carried out without processing the content, the account behind it, the report and the reasons for the decision. Recording the decision and its reasons is necessary both to comply with the Act and to make an appeal meaningful.

**Balancing test.** A person posting publicly on a platform would expect it to be moderated, and the Community Guidelines say so. The sharper issue is the person **reported about**, whose record may contain an allegation of criminal conduct. **Safeguards:** an allegation is recorded **as an allegation and never as a finding** (Appropriate Policy Document section 6); the affected user is notified where lawful and safe; an appeal is available under Community Guidelines clause 8, decided by someone not substantially involved; a reversed decision is recorded as reversed; access is restricted; and records are deleted at six years. Reporters' identities are not disclosed to the person reported about.

**Outcome: legitimate interests applies**, alongside the legal obligation for the Online Safety Act elements. Note that where the processing concerns a suspected criminal offence, the Article 10 condition in the Appropriate Policy Document is also required.

## LIA 6 — Refunds, disputes and complaints

*(Replaces the earlier "dispute resolution" assessment, which described the process as informal.)*

**Purpose test.** Dono needs to determine whether a campaign owner is required to refund a donor, to handle chargebacks, and to answer complaints. Both parties to a dispute have a strong interest in it being decided on evidence.

**Necessity test.** A determination requires access to the campaign as published, the transaction, the evidence submitted, and the correspondence between the parties. The process is now a documented one — intake, completeness, response, determination, reasons, appeal — which makes the necessity easier to evidence than it was when it was informal.

**Balancing test.** Both parties would expect Dono to investigate a dispute they or someone else raised about their campaign. Processing is limited to the specific dispute. **Safeguards:** conflict-of-interest recusal; the campaign owner is told the substance of the allegation and shown the evidence, so the process is not one-sided; **a donor who hid their name is not identified to the campaign owner by Dono**; reasons are given to both parties; an appeal is available; and records are deleted at six years.

**Outcome: legitimate interests applies.**

## Activities that do NOT rely on legitimate interests

Recorded here so that no one later writes an assessment for something that runs on a different basis:

| Activity | Basis |
|---|---|
| Product analytics (PostHog) | **Consent.** Not legitimate interests, and not the statistical-purpose exception — the analytics can link events to an identified user |
| Marketing emails | **Consent** |
| Institutional data sharing | **Consent** (and not offered at present) |
| Accounts, campaigns, donations, payments | **Contract** |
| CSEA reporting to the NCA | **Legal obligation** |
| Terms acceptance and consent records | **Legal obligation** (accountability) |


---

## Approval and version control (v2.3)

| Field | Entry |
|---|---|
| Version | 2.3 |
| Version date | 6 August 2026 |
| Accountable owner | Amrit Kaur Rooprai |
| Reviewed by / Approved by | *(to be completed)* |
| Status | Carried forward from v2.2 and amended by the v2.3 amendment block at the top of this document, which takes precedence over anything below it |
| Next scheduled review | 6 February 2027 |
| Supersedes | The corresponding document in `terms_v2.2/`, which is retained unaltered as the historical baseline |
