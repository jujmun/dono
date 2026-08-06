> ## v2.3 AMENDMENT BLOCK — READ FIRST
>
> **Version 2.3 — 6 August 2026.** This document is amended as set out below.
> **Where anything in the body conflicts with this block, this block prevails.**
>
> **Amendments applying to this document (Record of Processing Activities):**
>
> 1. **Delete the student-card rows entirely** — image capture, extraction, retention of the card number, and administrator access to card images. **Add a single row for university-email verification**: purpose, confirming eligibility; data, university email address and one-time code; basis, contract and legitimate interests; recipients, Resend as processor; retention, outcome retained 6 years after account closure, failed attempts 30 days; no special category data.
> 2. **Amend the donations row:** all donors are 18 or over; add the 18+ and legal-capacity confirmation and the stored checkout disclosure record as data fields. **Delete every reference to recurring donations.**
> 3. **Add rows for:** the refund mandate (instructing the Payment Provider to reverse a charge); the transaction dispute state; the surplus and refund ledger; receipt quarantine and 30-day deletion; campaign-page archival and de-indexing at 24 months; the data-protection complaints register; the institutional referral register; and the acceptance and document-version archive.
> 4. **Delete rows for** matched-funding windows and commercial campaigns — neither feature exists.
> 5. **Amend the moderation rows** to the risk-based retention periods in Privacy Notice clause 7.1 rather than a flat six years.
> 6. **Amend the campaign-page row:** public availability is no longer indefinite. Retention is public while live and for 24 months after closure, then archived and de-indexed, with depublication on request.
> 7. **Confirm the transfer column** for every row: EU Standard Contractual Clauses plus the UK Addendum, with a documented Transfer Risk Assessment.
>
> **Revision 2.3.1 — further corrections from the engineering evidence of 5 August 2026:**
>
> 8. **Analytics retention is 12 months, not 26.** Correct every analytics row. Note that enforcement of the period is currently switched off (item CK-08).
> 9. **Add a row for the identity check**: purpose, confirming the identity of a person raising money from the public; data, check outcome, verified name, verified date of birth; basis, legitimate interests; recipients, the Payment Provider as independent controller for the document and face scan, which Dono never receives; retention, 6 years from campaign or society closure with deletion on account deletion. **Record that this currently persists indefinitely and survives account deletion** (item EL-08).
> 10. **Add a row for donor-account profile data** — college, matriculation year, society interests, profile picture — which the previous ROPA did not cover at all.
> 11. **Add rows for campaign updates and their opt-in donor emails**, including the send log and the signed unsubscribe token.
> 12. **Add the support mailbox provider as a processor** (item VN-04).
> 13. **Remove any row describing Dono's own identity-document storage** once item EL-07 is complete, and record the deletion of existing documents.
> 14. **Record honestly that no retention or deletion job runs today**, so every retention entry in this record is a requirement rather than a description.

---
# Record of Processing Activities (ROPA) — Dono

**Controller:** Amrit Kaur Rooprai, trading as Dono (a sole trader). Dono is not a company and there is no current plan to incorporate.
**Owner:** Amrit (data protection lead). **Deputy:** Sashank. **Second backup:** Joe.
**Version:** 2.3 — 6 August 2026
**Approved by:** _________________ **Date:** _________________
**Next review:** 31 January 2027, or on any change of processor, region or feature.

Kept under Article 30 UK GDPR. This record is the source of truth for the Privacy Notice, the DPIA, the Appropriate Policy Document and the legitimate-interests assessments; where any of those disagrees with this record, this record is corrected first and the others are brought into line.

## Changes in v2.3

- The **Art. 9 / 10 condition column is corrected for rows 9 and 11–19** to match the revised Appropriate Policy Document (`dono-appropriate-policy-document-v2.3.md`), which stopped applying Schedule 1 paragraph 10 as a default. Paragraph 10 is now used only where it is genuinely the closest fit (moderation decisions, CSEA reports, escalated fraud with a clear unlawful-act dimension, financial crime); safeguarding moved to paragraph 18, ordinary fraud/dishonesty concerns to paragraph 11, and legal-claim records to paragraph 33.
- Row 11 (reports of content) is split by what the report actually concerns, rather than carrying one condition for all reports.
- A new row (11a) records that **user-to-user allegations with no platform-integrity, safeguarding or legal-claim dimension are refused and not processed**, per APD §5 — this is a deliberate absence of a condition, not an omission.

## Changes in v2.2

- Controller corrected from "Dono (UK Ltd, incorporation pending)" to **Amrit Kaur Rooprai**, which is the actual legal person.
- Identity verification corrected: Dono receives a **student card and a verification outcome only**. Dono does **not** receive government ID, Stripe KYC documents, passports, driving licences or selfies. The "legal obligation (KYC)" basis is removed — that obligation is Stripe's, not Dono's.
- **Stripe's role split by purpose** and recorded as an independent controller rather than a processor.
- **Analytics split** into consent-based product analytics and legitimate-interests security/error logging.
- Rows added for **public visitors**, **people who report content**, **people who do not have accounts (guest donors and non-user reporters)**, **legal claims**, **consents**, and **CSEA reporting**.
- Retention replaced with the field-level triggers in Privacy Notice clause 7.
- Recipients, regions and transfer mechanisms completed.
- Complaints inbox corrected to the single address.

---

## Processing activities

| # | Activity | Purpose | Data subjects | Personal data | Art. 6 basis | Art. 9 / 10 condition | Recipients / processors | Transfers outside the UK | Retention (trigger) | System | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Account creation and profiles | Provide the Platform | Registered users (18+) | Name, email, credential, declared date of birth, settings | Contract | — | Convex (hosting/DB), Resend (email) | Convex: EU (`eu-west-1`) + sub-processors — SCCs + UK Addendum. Resend: **[CONFIRM]** | 2 years after account closure or last activity | Convex | Amrit |
| 2 | Age check on account creation | Operate an 18+ account service | Registered users | Declared date of birth | Contract; legitimate interests | — | Convex | As row 1 | 2 years after account closure | Convex | Amrit |
| 3 | Student-status verification | Confirm a campaign creator is currently enrolled | Campaign Owners, Society Representatives | Student-card image (deleted on success), card number and extracted details, university email, institution, course, card expiry, Course End Date, verification outcome and date | Contract | — | Convex `_storage` (image, pre-deletion); no other recipient | Convex: EU + sub-processors — SCCs + UK Addendum | **Image: deleted immediately on a successful check; 30 days if rejected or abandoned.** Card number and outcome: account life + 6 years | Convex | Amrit |
| 4 | Connected-account onboarding | Enable a campaign to receive donations | Campaign Owners, Society Representatives | Stripe connected-account identifier and status; verified name and date of birth **where Stripe returns them** | Contract | — | **Stripe — independent controller for its KYC**; Dono receives no identity documents | Stripe: Ireland / US, under Stripe's own mechanism | Account life + 6 years | Convex (reference only) | Amrit |
| 5 | Donations and payments (one-off) | Process donations and payouts | Donors, including donors with no account and donors under 18 | Amount, currency, status, Stripe transaction/charge/connected-account identifiers, fee amounts and cover choice, email, display preference, **checkout age confirmation**, guest key | Contract | — | **Stripe — independent controller for payment processing**; Convex (transaction metadata) | Stripe: Ireland / US. Convex: EU + sub-processors | 6 years from the transaction | Convex, Stripe | Amrit |
| 6 | Recurring donations | Process repeat donations until cancelled | Donors | As row 5, plus subscription identifiers and schedule | Contract | — | Stripe, Convex | As row 5 | 6 years from the last transaction | Convex, Stripe | Amrit |
| 7 | Matched funding | Administer a Match Window | Campaign Owners; matching party contacts | Match window identifier, matched amount, matching party's name and evidence of commitment | Contract; legitimate interests (accuracy of public claims) | — | Convex | Convex: EU + sub-processors | 6 years from campaign closure | Convex | Amrit |
| 8 | Campaign content, evidence and closure | Let creators evidence use of funds | Campaign Owners; incidentally, third parties named on receipts | Campaign text, images, budgets, Ownership Statement, receipts and invoices (which may name third parties), updates, Closure Statements | Contract (creator); **legitimate interests** (third-party data on receipts — see LIA 5) | Art. 9(2)(f) where sensitive data appears and is needed for a claim | Convex `_storage` | Convex: EU + sub-processors | Evidence and ownership records: 6 years from campaign completion. Campaign pages: publicly accessible indefinitely at their direct URL, archived on completion | Convex | Amrit |
| 9 | Pre-publication moderation | Human review of every campaign before it goes live | Campaign Owners; third parties on receipts | Campaign text, images, video, receipts | Legitimate interests (fraud, safeguarding, protecting a mixed-age audience) | Art. 9(2)(e), on the basis that review is incidental to the creator's own act of submitting the content for publication (APD §3.2); Sch. 1 para. 18 where review surfaces a safeguarding concern beyond ordinary review; Sch. 1 para. 10/11 where it surfaces a suspected unlawful act or dishonesty concern beyond ordinary review | Internal only | None (internal to Convex) | Aligned with campaign record retention | Convex | Amrit |
| 10 | Comments | Public engagement on campaigns | Account holders (18+) | Comment content, edit history, display name | Contract; legitimate interests | Art. 9(2)(e) where a user makes such data public | Convex | Convex: EU + sub-processors | Until deleted by the user or removed by moderation; **moderation copy 6 years from removal** | Convex | Amrit |
| 11 | Reports of content — accepted cases | Operate the Online Safety Act reporting duty | People who report (including **people with no account**); people reported about | Content and account identifiers, report category and description, whether the reporter is personally affected, reporter's email where given | Legal obligation (Online Safety Act 2023); legitimate interests | Matched to what the report actually concerns (APD §3): **Sch. 1 para. 18** for a safeguarding concern; **para. 11** for a fraud/dishonesty concern; **para. 10** (extended to Art. 10 by para. 36) for a suspected-illegal-content report or an escalated criminal allegation; **para. 33** where the report is relevant to a legal claim | Internal only | None | 6 years from resolution | Convex | Amrit |
| 11a | **Reports declined at intake** | Decline reports with no platform-integrity, safeguarding or legal-claim dimension, per APD §5 | People reported about (not notified); reporters | That a report was received, its category, the date, and the reason it was declined. **Not** the substance of the allegation, and no unnecessary identifying detail | Legitimate interests (preventing misuse of the reporting system) | **No Art. 9/10 condition sought or required** — the substance is not retained, only the fact and reason of the refusal | Internal only | None | **12 months**, then deleted | Convex | Amrit |
| 12 | Moderation decisions and enforcement | Apply the Community Guidelines | Users moderated | Decision, reasons, action taken, notifications, restoration, internal notes | Legal obligation; legitimate interests | Sch. 1 para. 10 (extended to Art. 10 by para. 36) — this is the one row where para. 10 is a direct, undiluted fit: the record is literally Dono's determination of suspected illegality | Internal only | None | 6 years from the decision or account closure | Convex | Amrit |
| 13 | CSEA reporting to the NCA | Statutory reporting duty | People whose content is reported | Content and file identifiers, URL, uploader account identifiers, upload date and time, account email and telephone, IP where held, file metadata and hash where available, how Dono became aware, linked report references | **Legal obligation** (Online Safety Act 2023 s.66 and the 2026 Regulations) | Sch. 1 para. 10, extended to Art. 10 by para. 36 | **National Crime Agency** | None | **NCA report reference: 5 years. Reported content and prescribed supporting information: 1 year in restricted storage**, unless lawfully preserved for longer | Restricted store | Amrit (Sashank deputy) |
| 14 | Complaints and appeals (content and moderation) | Operate the Online Safety Act complaints duty | Complainants, appellants | Complaint content, contact details, decision and reasons | Legal obligation; legitimate interests | **Not engaged** unless the complaint's own content discloses special category or criminal-offence data, in which case the condition is inherited from the row that matches what it discloses (APD §3.6) | Internal (`joindono.team@gmail.com`) | None | 6 years from closure or final decision | Convex, email | Amrit |
| 15 | Data protection complaints | Statutory complaints duty in force from 19 June 2026 | Complainants | Complaint content, contact details, investigation record | Legal obligation | — | Internal (`joindono.team@gmail.com`) | None | 6 years from closure | Email, log | Amrit (Sashank deputy) |
| 16 | Refunds and disputes | Determine whether a refund is required; handle chargebacks | Donors, Campaign Owners | Request, evidence, correspondence, campaign and transaction records, determination and reasons, appeal | Contract; legitimate interests | Art. 9(2)(f) for legal-claim-relevant data; **Sch. 1 para. 11** for an alleged-fraud dispute in the ordinary case; **para. 10** (extended by para. 36) only where the dispute has crystallised into a clear unlawful-act allegation | Stripe (dispute records); internal | Stripe: Ireland / US | 6 years from case closure | Convex, Stripe | Amrit |
| 17 | Fraud prevention and financial crime | Detect fake campaigns, stolen cards, sanctions and laundering risk | Any user | Account activity, verification outcome, transaction patterns, escalation record | Legitimate interests (LIA 1); legal obligation for sanctions | Sch. 1 para. 10, extended to Art. 10 by para. 36 — genuinely apt here, since the activity is squarely the detection of an unlawful act (APD §4, §9.3). Paragraphs 14/15 become available if Dono ever joins an anti-fraud or AML disclosure scheme | Stripe (fraud signals); police / NCA / OFSI where escalated | Stripe: Ireland / US | 6 years from case closure | Convex, Stripe | Amrit |
| 18 | Legal claims and litigation records | Establish, exercise or defend legal claims | Any party to a claim | Correspondence, evidence, advice references, decision records | Legitimate interests; legal obligation | Art. 9(2)(f) for special category data; **Sch. 1 para. 33 (legal claims)** for criminal-offence data — replaces the previous para. 10 reference, which was not the closest fit | Professional advisers | None routinely | Duration of the matter + 6 years | Restricted store | Amrit |
| 19 | Institutional referrals | Refer a status or conduct concern to a Recognised Institution | Campaign Owners referred | Name, university email, student-card number, campaign identifier, the concern (recorded as an allegation, not a finding) | Legitimate interests; legal obligation where applicable | Matched to the underlying concern per APD §3.9 — **para. 18** (safeguarding), **para. 11** (fraud/eligibility) or **para. 10** (suspected criminal conduct), never a generic default | Named Recognised Institution (independent controller) | None (UK institutions) | 6 years from referral | Email, log | Amrit |
| 20 | Institutional data sharing | Share donor details with a named institution **where the donor opts in** | Donors who opt in | Name, email, donations to that institution's campaigns, dates, whether fees were covered | **Consent** | — | Named Institution (independent controller) | Depends on the institution | Per the data-sharing agreement | Convex | Amrit |
| 21 | Consent records | Evidence consent given and withdrawn | Users and visitors who give a consent | The consent given, the exact wording shown, its version, and the timestamp | Legal obligation (accountability) | — | Convex | Convex: EU + sub-processors | While the consent is current + 12 months (analytics); 6 years (institutional sharing) | Convex | Amrit |
| 22 | Terms acceptance records | Evidence which version of which document a person accepted | Users and guest donors | User or guest identifier, document identifier and version, role, campaign, context, timestamp | Legal obligation (accountability); legitimate interests | — | Convex | Convex: EU + sub-processors | 6 years from acceptance | Convex | Amrit |
| 23 | Marketing emails | Send optional updates about Dono and campaigns | Users who opt in | Email, preferences, engagement | **Consent** (PECR) | — | Resend | Resend: **[CONFIRM]** | Until withdrawn + 12 months (suppression record kept indefinitely) | Convex, Resend | Amrit |
| 24 | Transactional email | Donation confirmations, service messages, one-time passcodes | Donors, registered users | Email address, message content | Contract | — | Resend | Resend: **[CONFIRM]** | Per Resend's log retention — **[CONFIRM]** | Resend | Amrit |
| 25 | Product analytics | Understand use of the Platform to improve it | Visitors and users who **consent** | Cookie/device identifiers, pages and screens, campaign and donation funnel events, browser/device data, approximate location, referrer | **Consent** (PECR and UK GDPR) | — | PostHog Cloud EU | **EU processing** — confirm no onward transfer | **26 months** | PostHog | Amrit |
| 26 | Public visitors and server logs | Security, availability, fault detection, incident investigation | Anyone who visits, including people with no account and children | IP address, timestamp, page requested, browser and error data | Legitimate interests (LIA 3) | — | Vercel, Convex (platform logs) | **Vercel: United States** — SCCs + UK Addendum, **TRA outstanding**. Convex: EU + sub-processors | 12 months (authentication logs); platform log defaults otherwise — **[CONFIRM]** | Vercel, Convex | Amrit |
| 27 | Support correspondence | Answer questions and resolve issues | Anyone who contacts Dono | Contact details, correspondence, relevant account information | Contract; legitimate interests | — | Email provider | **[CONFIRM]** | 3 years from resolution | Email | Amrit |
| 28 | Backups and disaster recovery | Business continuity | All data subjects | A copy of all Platform data | Legitimate interests (LIA 4) | Mirrors the underlying activity | Convex, Vercel | As rows 1 and 26 | Rolling 30–35 days | Convex, Vercel | Amrit |

---

## Security measures applied across all activities

Encryption in transit (TLS); encryption at rest by the hosting and database providers; server-side role-based access control; **audit logging of every administrator access to student-card images and identity data**; authentication rate limiting and temporary lockout; access review and prompt removal on departure; and a contractual requirement on every processor to notify Dono without undue delay of any security incident affecting Dono data.

**Not yet in place, and therefore not claimed anywhere:** multi-factor authentication for administrators; automated retention enforcement and deletion jobs; deletion audit logging; legal hold; documented backup deletion propagation; a tested incident-response exercise.

## Open items

1. **[DPA OUTSTANDING]** Confirm, accept and file the DPAs for **Resend**, **PostHog** and **Stripe**, and record each in the DPA Register.
2. **[TRA OUTSTANDING]** Complete Dono's own transfer risk assessment for **Vercel** (United States), whose DPA contains no transfer impact assessment.
3. **[CONFIRM]** Resend's processing region and its transfer mechanism; its email content and log retention.
4. **[CONFIRM]** PostHog project settings — approximate location capture, device data, event retention (target 26 months), and that PostHog may not use the data for its own purposes.
5. **[CONFIRM]** Vercel and Convex platform log retention periods, so row 26 can state a period rather than a placeholder.
6. **[CONFIRM]** The email provider used for support correspondence, and whether it is inside or outside the UK.
7. Rows **8** (third-party data on receipts) and **20** (institutional sharing) are the two the DPIA flags as needing mitigation before launch. Row 20 is **not live** and must not go live before a data-sharing agreement exists.


---

## Approval and version control (v2.3)

| Field | Entry |
|---|---|
| Version | 2.3 |
| Version date | 6 August 2026 |
| Accountable owner | Amrit Kaur Rooprai |
| Reviewed by / Approved by | *(to be completed)* |
| Status | Amended by the v2.3 amendment block at the top of this document, which takes precedence over anything below it |
| Next scheduled review | 6 February 2027 |
