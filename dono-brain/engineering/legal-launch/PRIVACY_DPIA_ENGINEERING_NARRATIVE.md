# Privacy and DPIA engineering narrative

**Status:** Authoritative implementation narrative for engineering.  
**Owner:** Amrit Kaur Rooprai, data protection lead.  
**Deputy:** Sashank.  
**Version:** 1.0 — 6 August 2026.

## 1. Purpose and authority

This document centralises the product facts and engineering requirements that are currently spread across the DPIA, ROPA, Privacy Notice, Cookie Notice, APD, Article 14 assessment, DPA register, transfer assessment, complaints workflow and implementation checklist.

It is not the public Privacy Notice and it does not itself approve the DPIA. Engineers build and evidence the system described here. The data protection lead then re-performs and signs the DPIA against the deployed system. If this document conflicts with `TRUTH.md`, `TRUTH.md` wins and this file must be corrected.

The legal records remain necessary for their distinct purposes, but they must describe this same narrative rather than competing product stories.

## 2. The narrative in one page

Dono is operated by Amrit Kaur Rooprai as a sole trader and controller. Beta supports Society campaigns only. Adults create accounts, operate Societies and donate. Children may browse, so public surfaces remain child-safe by default.

Stripe independently handles payment processing, Connect onboarding, identity documents, face scans, KYC and its fraud controls. Donations are Stripe Connect direct charges to the Society's Connected Account. Dono does not receive an identity document or face scan after the legacy Dono upload is removed. Dono may store only the connected-account reference/status, identity-check outcome, verified name and verified date of birth for the documented period.

Dono stores account, campaign, donation, evidence, moderation, complaint and contract records in Convex. Vercel hosts the application. Resend delivers authentication and transactional email. Google hosts the support mailbox. PostHog Cloud EU receives analytics only after consent. The provider register, DPAs, regions, subprocessors, retention and transfer mechanisms must be verified operationally; code must not assume a legal role or transfer mechanism.

Campaign content is reviewed by a human before publication. Users must not be prompted to include special-category or criminal-offence data. Private drafts are not “manifestly public”. Receipt uploads receive just-in-time redaction guidance; non-compliant files go to restricted quarantine and are deleted after 30 days. Public UGC, reports, moderation, CSEA, complaints and appeals use the restricted workflows and risk-based retention below.

Analytics is opt-in. Nothing analytics-related loads before consent. The choice, timestamp and Cookie Notice version are stored. Withdrawal stops future collection and is propagated. Session replay is off at client and project level. Analytics events are deleted after 12 months.

Retention is enforced by scheduled jobs and a deletion ledger. Legal holds pause the relevant deletion only. Account deletion cannot strand an active campaign, refund or legal obligation. Backups follow the verified provider retention/restore behaviour and are not described with an invented period.

## 3. Data journey

### 3.1 Visitor

- Serve only essential storage before analytics consent.
- Record analytics only after opt-in consent.
- Allow consent withdrawal through a permanent privacy-settings route.
- Treat visitors as potentially including children.
- Retain security/server logs only for the verified period and purpose.

### 3.2 Account and age

- Capture a real 18+ confirmation at account creation.
- Capture a separate real 18+ confirmation for every guest or signed-in donation.
- Never write a hard-coded age attestation.
- Store only the declared age confirmation needed as evidence; do not describe it as verified for donors.
- Use the Payment Provider's verified DOB as the final Campaign/Society creator age gate. Missing, inconsistent or under-18 results fail closed; record any correction/review without inventing a manual age override.

### 3.3 Society and creator onboarding

- Beta permits Society campaigns only.
- Verify the institutional email through a one-time link or code.
- Stripe independently conducts its identity/Connect process.
- Remove Dono's `idDocumentStorageId`, upload route and admin document viewer; inventory and delete legacy files with logged evidence.
- Store only Stripe account/status identifiers and the expressly permitted outcome/name/DOB fields.
- Restrict identity-result fields to authorised roles and log access.

### 3.4 Campaign drafting and publication

- Do not prompt for health, religion, disability, sexuality, criminal allegations or other sensitive narratives.
- Treat a draft as private. Do not apply the “manifestly public” condition before actual publication.
- Human-review every campaign text, image, document, full video and external link before publication and after material edits.
- Present neutral lifecycle states; no verification or endorsement badges.
- Preserve the exact public campaign version associated with each donation.

### 3.5 Donation and payment

- Use only Stripe Connect direct charges to the Connected Account.
- Remove the platform-account charge path.
- Store the exact recipient panel, campaign version, legal versions/hash, fee schedule, total shown, total charged, donation ID, guest/user reference and timestamp.
- The donor-facing total never varies by card or payment method.
- Production pricing is 5% + 20p and demo pricing is 2% + 20p. Store the applicable locked Campaign schedule. The fee is borne by the Campaign Owner unless the Donor actively covers it; demo display copy is “Payment processing fee (Dono)”.
- Store Dono's fee, campaign amount and Stripe processing cost as separate fields.

### 3.6 Evidence and receipts

- Show mandatory redaction guidance before upload.
- Block obvious payment-card/security-code data where technically practicable.
- Give reviewers a restricted view and redaction/rejection action.
- Quarantine a non-compliant upload for no more than 30 days, then delete and log the event.
- Retain from accepted evidence only the supplier, item, amount, date and reference needed for verification, plus the minimum file evidence justified by the legal schedule.

### 3.7 Reports, moderation and CSEA

- Every report creates a case with the content version seen, category, timestamps and reporter contact where provided.
- Do not require the reporter to decide whether conduct is criminal.
- Refuse unrelated/unsupported allegations without retaining their substance; retain only the minimal refusal log for 12 months.
- Restrict CSEA content immediately, avoid unnecessary copying and allow only specialist access.
- Retain CSEA content/prescribed information for one year and the NCA report reference for five years, subject to a documented lawful hold.
- NCA submission cannot be marked operational until NCA confirms registration/user access and the route is trained and tested.

### 3.8 Refunds, complaints and legal records

- Use one donation dispute state across refund requests, Stripe disputes and completed refunds.
- Preserve the decision, evidence, reviewer, notices, Stripe references and fee reversal.
- Data-protection complaints use the single support email, a restricted register, an acknowledgement within 30 days and a three-year retention period.
- Other complaint/moderation records use the applicable risk-based period below.
- Terms acceptance and immutable legal versions are evidence records, not general user profiles.

### 3.9 Account deletion, export and wind-down

- Require re-authentication and explicit confirmation.
- Warn and block or route deletion where an active campaign, refund, investigation or legal obligation would be stranded.
- Delete or anonymise each field according to its retention rule; do not call partial anonymisation “erasure”.
- Produce a user export for account, donation, acceptance and submitted-evidence data, subject to third-party rights and lawful restrictions.
- Record every deletion, exception and legal hold.

## 4. Authoritative target retention schedule for engineering

The public Privacy Notice must be reconciled to this table before publication. If legal review changes a period, update this table, the Privacy Notice and the deletion configuration in one change.

| Data class | Target period / trigger |
|---|---|
| Account/profile and declared DOB | Active account, then 2 years from closure or last activity |
| Institutional eligibility outcome | Active account, then 6 years from closure |
| Stripe identity-check outcome, verified name and DOB | Active Campaign/Society, then 6 years from closure; delete on account deletion if no live obligation/claim requires it |
| Donation, payment, fee and checkout-disclosure records | 6 years from transaction |
| Campaign public page | Public while live and 24 months after closure; then de-index and minimise; earlier depublication route subject to lawful retention |
| Campaign ownership, closure and accepted evidence records | 6 years from campaign closure/completion |
| Unpublished campaign drafts | 90 days from last edit |
| Rejected/quarantined receipts | 30 days from rejection |
| Spam/filter blocks | 6 months |
| Ordinary community-rule cases | 12 months |
| Declined-report minimal log | 12 months; do not keep the allegation substance |
| Repeat-offender/ban-evasion history | 3 years from last action |
| Illegal content other than CSEA | 3 years from action |
| Fraud/financial misconduct and safeguarding cases | 6 years from closure |
| Data-protection complaint register | 3 years from closure |
| Other complaints/appeals, refunds/disputes, fraud/security and institutional referrals | 6 years from closure/final decision |
| Support correspondence | 3 years from resolution |
| Authentication logs | 12 months |
| Analytics events | 12 months from collection |
| Analytics consent record | Current choice plus 12 months after change/withdrawal |
| Terms acceptance | 6 years from acceptance |
| Published legal-document versions | Indefinite immutable archive |
| CSEA content and prescribed supporting information | 1 year from report |
| NCA CSEA report reference | 5 years from report |
| Backups | Provider-confirmed rolling period; document restore/deletion behaviour before publication |

## 5. Engineering work packages

These packages consolidate the privacy/DPIA build. The master checklist remains authoritative for priority and detailed acceptance criteria.

### DP-ENG-01 — Inventory and schema

- Maintain a field-level inventory linking every personal-data field to purpose, source, lawful-basis owner, access roles, recipients and retention rule.
- Add missing fields for consent version/timestamp, acceptance hash/link, donation snapshot, deletion ledger, legal hold and dispute state.
- Remove obsolete student-card, recurring-donation, match-window and Dono ID-document fields after migration evidence is captured.

**Acceptance evidence:** schema map, migration log, sample records and proof obsolete upload/view routes fail server-side.

### DP-ENG-02 — Retention and deletion engine

- Scheduled jobs enforce every period in section 4.
- Jobs are idempotent, observable and alert on failure.
- Every deletion/minimisation records category, record ID, rule, timestamp and result without retaining the deleted content.
- Legal holds are scoped, authorised, dated and reviewable.

**Acceptance evidence:** clock-controlled tests for each data class, deletion ledger, failure alert and legal-hold test.

### DP-ENG-03 — Account rights and deletion

- Re-authentication, confirmation, outstanding-obligation check, field-level delete/anonymise and audit event.
- Data export covering account, donations, acceptances and user-submitted evidence.
- Restricted staff workflow for access, correction, objection, restriction and erasure requests.

**Acceptance evidence:** end-to-end test for each right and a test showing an outstanding refund cannot be stranded.

### DP-ENG-04 — Identity-data minimisation

- Remove Dono identity/student-card collection and all administrator viewers.
- Delete legacy files and values, subject to documented lawful holds.
- Retain only Stripe outcome/name/DOB fields with role restrictions and access logs.

**Acceptance evidence:** API tests, storage inventory before/after, deletion log and access-control test.

### DP-ENG-05 — Receipt minimisation and Article 14 safeguards

- Just-in-time redaction instructions; restricted review; reject/quarantine; 30-day deletion; accepted-field minimisation.
- No public receipt access and no donor access to private evidence unless separately approved.

**Acceptance evidence:** compliant/non-compliant upload tests, permission tests and timed deletion test.

### DP-ENG-06 — Consent and analytics

- No analytics library, request or storage before consent.
- Store choice, timestamp and notice version; allow immediate withdrawal.
- Disable session replay at both levels; prevent identify calls and authentication-field capture.
- Enforce 12-month retention.

**Acceptance evidence:** clean-browser desktop/mobile network traces for reject, accept and withdraw; provider-setting screenshots; aged-event deletion test.

### DP-ENG-07 — Moderation, complaints and CSEA records

- Use the separate moderation specification for intake, access, case state, appeal separation, evidence preservation and notification.
- Implement risk-based retention, minimal refused-report log and the two CSEA clocks.
- Keep CSEA access specialist-only and auditable.

**Acceptance evidence:** acceptance tests mapped in the Online Safety Traceability file plus NCA operational sign-off when received.

### DP-ENG-08 — Provider, transfer and backup evidence

- Export actual service configuration and data locations for Vercel, Convex, Resend, Google, PostHog and Stripe.
- Record provider contract/version, subprocessor list, region and retention without hard-coding a legal conclusion in the product.
- Confirm backup period, restore process and deletion propagation.

**Acceptance evidence:** dated provider register inputs, configuration screenshots/exports and a restore/deletion test where available.

### DP-ENG-09 — Security, monitoring and incident readiness

- Unique least-privilege production accounts; administrator MFA at provider consoles; access inventory and revocation process.
- Alerts for production errors, failed retention jobs, repeated authentication failures, disputes and security events.
- Tamper-evident audit events for high-impact administrative access and decisions.
- Remove open demo-admin behaviour from any deployment with real data.

**Acceptance evidence:** access review, alert tests, offboarding exercise, demo-mode test and incident tabletop record.

### DP-ENG-10 — Contract and release evidence

- Implement events A, B and C from the Acceptance Matrix, preserving which items are actively accepted, shown/acknowledged or separately optional.
- Build one configurable live-document registry using `legal/live-terms/` as the handoff placeholder; fail closed until the required approved files, versions and hashes are supplied.
- Immutable legal manifest, separate source/HTML/PDF hashes and historical routes; never serve raw Markdown or the draft stub as a fallback.
- Link every user/guest acceptance to its event and account/donation/campaign context.
- Provide on-screen and durable-copy confirmation.
- Release sign-off pins deployment, payment mode/account, commit and legal manifest.

**Acceptance evidence:** guest and account acceptance tests, historical-version retrieval and signed Release Control Matrix row.

## 6. DPIA evidence bundle

Engineering hands the data protection lead one bundle containing:

1. deployed commit and environment;
2. final data-flow/schema diagram;
3. provider configuration evidence;
4. test name, date, result and approver for every DP-ENG package;
5. deletion/retention test output;
6. access-control and audit-log tests;
7. consent network traces;
8. incident and recovery test results;
9. known limitations and residual risks; and
10. links to the exact legal-document manifest.

The data protection lead then re-scores likelihood and severity, records whether each mitigation is implemented, completes consultation/cross-references, and signs the DPIA. Engineering completion does not automatically mean DPIA approval.

## 7. Items that remain legal or operational

- The solicitor must review the APD conditions, especially private drafts, pre-publication review, receipts and criminal allegations.
- Legal/operations must verify provider roles, DPAs, transfer mechanisms and ICO registration.
- NCA must confirm the CSEA registration/user position; the operational team must train and test it.
- The data protection lead decides whether any residual risk remains high and whether ICO prior consultation is required.
- Public Privacy/Cookie Notices, ROPA, APD, Article 14 assessment and DPIA must be rewritten or consolidated around the final evidence. Engineers do not approve those records.
