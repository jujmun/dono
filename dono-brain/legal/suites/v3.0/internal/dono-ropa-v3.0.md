# Record of Processing Activities — Dono

**Document:** Record of Processing Activities (Article 30 UK GDPR)
**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval (see approval block)
**Controller:** Amrit Kaur Rooprai, sole trader, trading as Dono. Dono is not a company and there is no current plan to incorporate.
**Accountable owner:** Amrit Kaur Rooprai (data protection lead)
**Deputy:** Sashank · **Second backup:** Joe
**Supersedes:** `../../v2.3/dono-ropa-v2.3.md` and all earlier versions, retained unaltered in the version archive
**Status:** Clean consolidated record. States the current position only. No amendment block, no superseded text.
**Next review:** 7 February 2027, or on any change of processor, product, region or feature.

---

## How to read this record

`../../../../TRUTH.md` is the source of settled product facts. `../../../../engineering/legal-launch/PRIVACY_DPIA_ENGINEERING_NARRATIVE.md` is the authoritative implementation description. **Engineering builds from the narrative and the master checklist, not from this ROPA in isolation.**

A change to the narrative, this ROPA, the Privacy Notice, the DPIA, the Appropriate Policy Document, the Article 14 assessment, the provider register or the transfer record is **incomplete** until every affected record and the deletion configuration are updated together.

**Retention entries in this record are requirements, not descriptions.** No automated retention or deletion job runs at the version date (DPIA risk L-01). Every period below is a target that the retention engine must enforce, and the Privacy Notice must not be published as though enforcement already exists.

**Beta scope.** Beta supports **Society Campaigns only**. Individual Student Campaign creation, publication and donation are disabled at the API boundary. No activity below covers an individual Student Campaign.

---

## 1. Processing activities

**Key.** *Art. 6 basis* — the lawful basis. *Art. 9 / 10 condition* — the special category or criminal-offence condition, mapped in `dono-appropriate-policy-document-v3.0.md`. *Transfers* — mechanism recorded in `dono-international-transfer-assessment-v3.0.md`. Where a fact is not yet verified it is marked **[CONFIRM]** rather than guessed at.

### 1.1 Accounts, eligibility and identity

| # | Activity | Purpose | Data subjects | Personal data | Art. 6 basis | Art. 9 / 10 condition | Recipients / processors | Transfers outside the UK | Retention (trigger) | System | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Account creation and profile | Provide the Platform | Registered users (18+) | Name, email address, credential, declared date of birth, settings | Contract | — | Convex (hosting and database), Resend (email) | Convex: EU (`eu-west-1`) + sub-processors — EU SCCs (Module 2) + UK Addendum, provider TRA adopted. Resend: **United States** — EU SCCs + UK Addendum, plus EU–US DPF and UK Extension certification | Active account, then 2 years from closure or last activity | Convex | Amrit |
| 1a | Donor and member profile fields | Let a user describe themselves on the Platform | Registered users | College, matriculation year, society interests, profile picture | Contract; legitimate interests | — | Convex | As row 1 | With the account, then deleted at closure — not carried into the 2-year residual account record | Convex | Amrit |
| 2 | Age confirmation at account creation | Operate an adults-only account service | Registered users | The 18-or-over confirmation, its exact wording and version, and its timestamp | Contract; legitimate interests (evidencing the rule) | — | Convex | As row 1 | Active account, then 2 years from closure | Convex | Amrit |
| 3 | Institutional eligibility verification | Confirm a Society Representative controls a recognised institutional email address | Society Representatives | Institutional email address, one-time code, institution, course and Course End Date where given, verification outcome and date | Contract | — | Convex; Resend (one-time email) | As row 1 | Outcome: active account, then 6 years from closure. **Failed or abandoned attempts: 30 days** | Convex, Resend | Amrit |
| 4 | Identity-check outcome and creator age gate | Confirm the identity and adult status of a person raising money from the public; enable a Campaign to receive Donations | Society Representatives | Connected-account identifier and status; identity-check outcome; verified name; verified date of birth. **No identity document and no face scan — Dono never receives either** | Legitimate interests (LIA 2 — verification and fraud prevention); contract for Connected Account onboarding | — | **Stripe Payments Europe, Limited — independent controller** for its identity, KYC, AML and fraud processing. Dono receives only the four outcome fields | Stripe: Ireland and United States, under Stripe's Data Transfers Addendum (DPF / EEA SCCs / UK IDTA as applicable) | Active Campaign or Society, then 6 years from closure; deleted on account deletion where no live obligation, claim or legal hold requires retention | Convex (outcome fields only) | Amrit |

> **Removed activity.** Dono formerly stored student-card images, student numbers and its own copies of government identity documents. **Those activities no longer exist.** The fields, upload routes and administrator viewers are removed and existing values are to be deleted with a logged deletion event (checklist EL-01, EL-02, EL-07). No row is retained for them; the closure evidence is recorded in the DPIA §7.1.

### 1.2 Donations, fees and money

| # | Activity | Purpose | Data subjects | Personal data | Art. 6 basis | Art. 9 / 10 condition | Recipients / processors | Transfers outside the UK | Retention (trigger) | System | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 5 | Donations and payments | Process one-off Donations by Stripe Connect direct charge to the Society's Connected Account | Donors, including guest Donors, all of whom must actively self-certify that they are 18 or over and have legal capacity | Amount, currency, status, Stripe transaction, charge and connected-account identifiers, applicable locked Dono fee schedule and amount, Stripe processing cost, fee-cover choice, name, email address, display preference, **the 18-or-over and capacity confirmation**, guest key | Contract | — | **Stripe — independent controller for payment processing**; Convex (transaction metadata) | Stripe: Ireland / United States. Convex: EU + sub-processors | 6 years from the transaction | Convex, Stripe | Amrit |
| 5a | Checkout disclosure record | Evidence exactly what was displayed to a Donor before payment | Donors | The exact "You're donating to" recipient panel as displayed, the campaign version, the applicable document versions and hashes, the fee schedule, the total shown and the total charged, the donation identifier and the timestamp | Legal obligation (accountability); contract | — | Convex | As row 1 | 6 years from the transaction | Convex | Amrit |
| 6 | **Refund mandate execution** | Instruct the Payment Provider to reverse a charge, in whole or in part, on the Connected Account under the mandate in Terms of Service clause 13.2 | Campaign Owners, Society Representatives, Donors | Determination and reasons, amount, Stripe refund reference, date, authorising person, notice given and any response, appeal record, application-fee reversal | Contract; legitimate interests (LIA 6 — operating an enforceable donor remedy) | Sch. 1 para. 11 where the underlying case is a fraud or dishonesty concern; para. 10 (extended to Art. 10 by para. 36) only where it has crystallised into a clear unlawful-act allegation | Stripe; internal | Stripe: Ireland / United States | 6 years from execution | Convex, Stripe | Amrit |
| 7 | **Transaction dispute state** | Hold a single dispute state per Donation covering refund requests, card-network disputes, chargebacks and completed refunds, so no double recovery occurs | Donors, Campaign Owners | Donation identifier, dispute state and transitions, deadlines, Stripe dispute references, notifications sent | Contract; legitimate interests | Art. 9(2)(f) where the case involves special category data relevant to a claim | Stripe; internal | Stripe: Ireland / United States | 6 years from final resolution | Convex, Stripe | Amrit |
| 7a | **Surplus and refund ledger** | Prevent a Donation being refunded twice across automatic reverse-chronological allocation and individual donor claims | Donors | Donation identifier, amount refunded, allocation method, date, remaining surplus | Contract; legitimate interests | — | Internal | None | 6 years from campaign closure | Convex | Amrit |
| 8 | Refund requests, disputes and appeals | Determine whether a refund is required; handle chargebacks and appeals | Donors, Campaign Owners | Request, evidence, correspondence, campaign and transaction records, determination and reasons, reviewer, appeal to a different reviewer | Contract; legitimate interests | Art. 9(2)(f) for legal-claim-relevant data; **Sch. 1 para. 11** for an alleged-fraud dispute in the ordinary case; **para. 10** (extended by para. 36) only where a clear unlawful-act allegation has crystallised | Stripe (dispute records); internal | Stripe: Ireland / United States | 6 years from case closure | Convex, Stripe | Amrit |
| 9 | Fraud prevention, financial crime and sanctions | Detect fake campaigns, stolen instruments, sanctions exposure and laundering risk | Any user | Account activity, verification outcome, transaction patterns, escalation record | Legitimate interests (LIA 1); legal obligation for sanctions | Sch. 1 para. 10, extended to Art. 10 by para. 36 — the activity is squarely the detection of an unlawful act (APD §4, §9.3). Paragraphs 14 and 15 become available only if Dono joins an anti-fraud or AML disclosure scheme | Stripe (fraud signals); police, NCA or OFSI where escalated | Stripe: Ireland / United States | 6 years from case closure | Convex, Stripe | Amrit |

### 1.3 Campaigns, content and evidence

| # | Activity | Purpose | Data subjects | Personal data | Art. 6 basis | Art. 9 / 10 condition | Recipients / processors | Transfers outside the UK | Retention (trigger) | System | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 10 | Campaign drafting | Let a Society Representative prepare a Campaign before publication | Society Representatives | Draft campaign text, images, budget, Ownership Statement | Contract | **A private draft is not "manifestly made public"** and Art. 9(2)(e) is not available for it (APD §3.2). Dono does not prompt for special category or criminal-offence data | Convex | Convex: EU + sub-processors | **Unpublished drafts: 90 days from last edit** | Convex | Amrit |
| 11 | Pre-publication human review | Review every campaign text, image, document, full video and external link before publication and after a material edit | Society Representatives; third parties named in submitted material | Campaign text, images, video, documents, links, receipts | Legitimate interests (fraud, safeguarding, protecting a mixed-age audience) | Art. 9(2)(e) where the creator has themselves submitted the content for publication, review being incidental to that act (APD §3.2); **Sch. 1 para. 18** where review surfaces a safeguarding concern beyond ordinary review; **para. 10 or 11** where it surfaces a suspected unlawful act or a dishonesty concern beyond ordinary review | Internal only | None (internal to Convex) | Aligned with the campaign record | Convex | Amrit |
| 12 | Published campaign page | Present a Campaign publicly | Society Representatives; anyone named in the published material | Published campaign content and the exact version associated with each Donation | Contract; legitimate interests | Art. 9(2)(e) once actually published by the creator | Convex; Vercel (delivery) | Convex: EU. Vercel: **United States** — EU SCCs + UK Addendum, **Dono's own TRA outstanding and blocking** | **Public while live and for 24 months after closure; then archived, de-indexed and minimised.** Earlier depublication route available, subject to lawful retention | Convex, Vercel | Amrit |
| 13 | Evidence, receipts and closure | Let a Society evidence how donated funds were applied | Society Representatives; **incidentally, third parties named on receipts** | Receipts, invoices and quotes (which may name third parties), Closure Statement, ownership records | Contract (creator); **legitimate interests** (third-party data on receipts — LIA 5) | Art. 9(2)(f) where sensitive data appears and is needed for a claim; otherwise minimised out under APD §6.3 | Convex `_storage` | Convex: EU + sub-processors | Accepted evidence and ownership records: 6 years from campaign completion or closure. Only supplier, item, amount, date and reference are retained from an accepted receipt, plus the minimum file evidence the legal schedule justifies | Convex | Amrit |
| 13a | **Receipt quarantine** | Hold a non-compliant upload separately pending deletion, so unredacted third-party data is not carried into the evidence record | Third parties named on a rejected receipt; the uploader | The rejected file and the rejection reason | Legitimate interests (LIA 5 — safe handling of data Dono did not solicit) | Not sought — the file is quarantined for deletion, not processed for a substantive purpose | Restricted internal store | Convex: EU | **30 days from rejection, then automatic deletion with a logged event** | Restricted store | Amrit |
| 14 | Comments | Public engagement on a Campaign | Account holders (18+) | Comment content, edit history, display name | Contract; legitimate interests | Art. 9(2)(e) where a user makes such data public | Convex | Convex: EU + sub-processors | Until deleted by the user or removed by moderation; the **moderation copy** follows the risk-based period in row 17 | Convex | Amrit |
| 15 | **Campaign updates and opt-in donor emails** | Let a Society update its Donors on progress | Donors who opt in; Society Representatives | Update content, recipient list, send log, delivery and bounce status, **signed unsubscribe token** | Contract for the update itself; **consent** (PECR) for the email to a Donor | — | Resend | Resend: United States — EU SCCs + UK Addendum + DPF | Update content with the campaign record. Send log 12 months. Unsubscribe suppression record kept for as long as needed to honour the opt-out | Convex, Resend | Amrit |

### 1.4 Reports, moderation, safeguarding and CSEA

| # | Activity | Purpose | Data subjects | Personal data | Art. 6 basis | Art. 9 / 10 condition | Recipients / processors | Transfers outside the UK | Retention (trigger) | System | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 16 | Reports of content — accepted cases | Operate the Online Safety Act reporting duty | People who report, **including people with no account**; people reported about | Content and account identifiers, **the content version seen**, report category and description, whether the reporter is personally affected, reporter's email where given, timestamps | Legal obligation (Online Safety Act 2023); legitimate interests | Matched to what the report actually concerns (APD §3): **Sch. 1 para. 18** for safeguarding; **para. 11** for fraud or dishonesty; **para. 10** (extended to Art. 10 by para. 36) for suspected illegal content or an escalated criminal allegation; **para. 33** where relevant to a legal claim. A reporter is never asked to decide whether conduct is criminal | Internal only | None | Risk-based, per row 17 | Convex | Amrit |
| 16a | Reports declined at intake | Decline a report with no platform-integrity, safeguarding or legal-claim dimension, under APD §5 | People reported about (not notified); reporters | That a report was received, its category, the date and the reason it was declined. **Not the substance of the allegation**, and no unnecessary identifying detail | Legitimate interests (preventing misuse of the reporting system) | **No Art. 9 or 10 condition sought or required** — the substance is not retained | Internal only | None | **12 months**, then deleted | Convex | Amrit |
| 17 | Moderation decisions and enforcement | Apply the Community Guidelines and the illegal-content duties | Users moderated | Decision, reasons, action taken, notifications, restoration, internal notes, the content version acted on | Legal obligation; legitimate interests | Sch. 1 para. 10 (extended to Art. 10 by para. 36) — the one row where paragraph 10 is a direct fit, because the record is literally Dono's determination of suspected illegality | Internal only | None | **Risk-based:** spam or filter blocks 6 months · ordinary community-rule cases 12 months · repeat-offender and ban-evasion history 3 years from last action · illegal content other than CSEA 3 years from action · fraud, financial-misconduct and safeguarding cases 6 years from closure | Convex | Amrit |
| 18 | CSEA handling and reporting to the NCA | Statutory reporting duty | People whose content is reported | Content and file identifiers, URL, uploader account identifiers, upload date and time, account email and telephone, IP where held, file metadata and hash where available, how Dono became aware, linked report references | **Legal obligation** (Online Safety Act 2023 s.66 and the 2026 Regulations) | Sch. 1 para. 10, extended to Art. 10 by para. 36 | **National Crime Agency** | None | **NCA report reference: 5 years. Reported content and prescribed supporting information: 1 year in restricted storage**, unless lawfully preserved for longer under a documented hold | Restricted store | Amrit (Sashank deputy) |
| 19 | Content and moderation complaints and appeals | Operate the Online Safety Act complaints duty, with the appeal decided by a different reviewer | Complainants, appellants | Complaint content, contact details, decision and reasons, reviewer identity | Legal obligation; legitimate interests | **Not engaged** unless the complaint's own content discloses special category or criminal-offence data, in which case the condition is inherited from the row matching what it discloses (APD §3.6) | Internal (single support address) | Google (support mailbox) — **[CONFIRM] region and Article 28 position** | 6 years from closure or final decision | Convex, support mailbox | Amrit |

### 1.5 Rights, complaints and legal records

| # | Activity | Purpose | Data subjects | Personal data | Art. 6 basis | Art. 9 / 10 condition | Recipients / processors | Transfers outside the UK | Retention (trigger) | System | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 20 | **Data protection complaints register** | Operate the data protection complaints duty in force from 19 June 2026, with acknowledgement within 30 days | Complainants | Complaint content, contact details, investigation record, outcome | Legal obligation | — | Internal restricted register; single support address | Google (support mailbox) — **[CONFIRM]** | **3 years from closure** | Restricted register, support mailbox | Amrit (Sashank deputy) |
| 21 | Data subject rights requests | Handle access, rectification, erasure, restriction, objection and portability requests | Anyone exercising a right | Request, identity-assurance record, what was disclosed or done, decision and reasons | Legal obligation | Inherited from the underlying records disclosed | Internal | Google (support mailbox) — **[CONFIRM]** | 3 years from closure | Restricted register | Amrit |
| 22 | Legal claims and litigation records | Establish, exercise or defend legal claims | Any party to a claim | Correspondence, evidence, advice references, decision records, legal-hold record | Legitimate interests; legal obligation | Art. 9(2)(f) for special category data; **Sch. 1 para. 33 (legal claims)** for criminal-offence data | Professional advisers | None routinely | Duration of the matter + 6 years | Restricted store | Amrit |
| 23 | **Institutional referral register** | Record a necessary and proportionate referral made under the Institutional Referral Protocol | Society Representatives referred | Name, institutional email, Campaign identifier, the concern **recorded as an allegation and not a finding**, and the minimum supporting facts the protocol authorises | Legitimate interests; legal obligation where applicable | Matched to the underlying concern per APD §3.9 — **para. 18** (safeguarding), **para. 11** (fraud or eligibility) or **para. 10** (suspected criminal conduct). Never a generic default | Named Recognised Institution (independent controller) | None (UK institutions) | 6 years from referral | Restricted register | Amrit |
| 24 | Personal data breach records | Article 33(5) accountability | Anyone affected | Facts of the breach, effects, remedial action, assessment and any notification | Legal obligation | Inherited from the data affected | Internal; ICO and data subjects where notifiable | None | 6 years from closure | Restricted store | Amrit |

### 1.6 Contract evidence, consent and communications

| # | Activity | Purpose | Data subjects | Personal data | Art. 6 basis | Art. 9 / 10 condition | Recipients / processors | Transfers outside the UK | Retention (trigger) | System | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 25 | **Acceptance records** | Evidence which version of which document a person accepted, at account creation, Society onboarding and Donation | Registered users **and guest Donors** | User or guest identifier, role, campaign identifier where relevant, document identifiers, versions **and hashes**, acceptance context and event, timestamp | Legal obligation (accountability); legitimate interests | — | Convex | Convex: EU + sub-processors | **6 years from acceptance.** These are evidence records, not user profiles, and hold no field beyond those listed | Convex | Amrit |
| 25a | **Published document version archive** | Hold every published legal-document version permanently and immutably at a stable address | — (**contains no personal data**) | Document text, version, hash, publication and withdrawal dates | Legal obligation (accountability) | — | Convex; Vercel (delivery) | As rows 1 and 12 | **Indefinite immutable archive** | Convex | Amrit |
| 26 | Consent records | Evidence a consent given and withdrawn | Users and visitors who give a consent | The consent given, the exact wording shown, its version, the timestamp and any withdrawal | Legal obligation (accountability) | — | Convex | Convex: EU + sub-processors | Current choice, plus **12 months** after change or withdrawal (analytics); 6 years (institutional sharing, if ever introduced) | Convex | Amrit |
| 27 | Transactional email | Donation confirmations, service messages, one-time passcodes | Donors, registered users | Email address, message content, delivery and bounce status | Contract | — | Resend | **United States** — EU SCCs (Modules 1/2/3) + UK Addendum, plus EU–US DPF and UK Extension certification. Sub-processor list at `resend.com/legal/subprocessors`, 14 days' notice of change | Dono's own record per the underlying activity. **Resend deletes customer data within 90 days of account termination**; live message and log retention **[CONFIRM with Resend]** | Resend | Amrit |
| 28 | Marketing email | Send optional updates about Dono | Users who opt in | Email address, preferences, engagement, unsubscribe token | **Consent** (PECR) | — | Resend | As row 27 | Until withdrawn, plus 12 months. Suppression record kept for as long as needed to honour the opt-out | Convex, Resend | Amrit |
| 29 | Support correspondence | Answer questions and resolve issues | Anyone who contacts Dono | Contact details, correspondence, relevant account information | Contract; legitimate interests | Inherited where the correspondence itself discloses such data | **Google (support mailbox)** | **[CONFIRM] region and Article 28 position** | 3 years from resolution | Support mailbox | Amrit |

### 1.7 Analytics, logs and infrastructure

| # | Activity | Purpose | Data subjects | Personal data | Art. 6 basis | Art. 9 / 10 condition | Recipients / processors | Transfers outside the UK | Retention (trigger) | System | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 30 | Product analytics | Understand use of the Platform to improve it | Visitors and users who **consent** | Pseudonymous cookie or device identifier, pages and screens, Campaign and Donation funnel events, browser and device data, approximate country or city derived from an IP anonymised at ingest, referrer. **No identify call, no session replay, no authentication-field capture, no advertising integration, no third-party export** | **Consent** (PECR and UK GDPR) | — | PostHog Cloud EU | **EU processing.** **[CONFIRM]** no onward transfer, sub-processor and support-access locations, and that PostHog may not use the data for its own purposes | **12 months from collection** | PostHog | Amrit |
| 31 | Public visitors and server logs | Security, availability, fault detection and incident investigation | Anyone who visits, **including people with no account and children** | IP address, timestamp, page requested, browser and error data | Legitimate interests (LIA 3) | — | Vercel, Convex (platform logs) | **Vercel: United States** — EU SCCs (Modules 1/2/3) + UK Addendum. Vercel's DPA contains **no transfer impact assessment**, so Dono's own TRA is **outstanding and blocking**. Convex: EU + sub-processors | Authentication logs 12 months. Platform log defaults **[CONFIRM with each provider]** | Vercel, Convex | Amrit |
| 32 | Backups and disaster recovery | Business continuity | All data subjects | A copy of Platform data | Legitimate interests (LIA 4) | Mirrors the underlying activity | Convex, Vercel | As rows 1 and 31 | **Provider-confirmed rolling period — [CONFIRM].** Restore behaviour and deletion propagation must be documented before the Privacy Notice states any period. **No period is asserted here** | Convex, Vercel | Amrit |
| 33 | Retention, deletion and legal hold | Enforce this record and evidence that it was enforced | All data subjects | Deletion ledger entries — category, record identifier, rule applied, timestamp, result. **Never the deleted content itself.** Legal-hold scope, authoriser and date | Legal obligation (accountability) | — | Internal | None | Deletion ledger 6 years. Legal-hold records for the duration of the hold plus 6 years | Convex | Amrit |

---

## 2. Security measures applied across all activities

**In place.** Encryption in transit (TLS); encryption at rest by the hosting and database providers; server-side role-based access control; **audit logging of administrator access to the identity-check outcome, verified name and verified date of birth**; authentication rate limiting and temporary lockout; access review and prompt removal on departure; and a contractual requirement on every processor to notify Dono of a security incident affecting Dono data — Stripe within 48 hours for GDPR and UK GDPR personal data, Resend without undue delay.

**Not in place, and therefore not claimed in any published document.** Multi-factor authentication for administrators; automated retention enforcement and deletion jobs; the deletion ledger; legal hold; malware scanning on upload paths; monitoring and alerting; documented backup deletion propagation; a tested incident-response exercise.

---

## 3. Article 30(1) particulars

| Particular | Entry |
|---|---|
| Name and contact details of the controller | Amrit Kaur Rooprai, sole trader trading as Dono. Contact through the single published support address |
| Joint controller | None |
| Representative | Not applicable — the controller is established in the UK |
| Data protection officer | **Not appointed and not required.** Dono is not a public authority; its core activities do not consist of large-scale regular and systematic monitoring, nor of large-scale processing of special category or Article 10 data. See DPIA §5.3. Scale is a review trigger |
| Purposes of processing | As set out per activity in section 1 |
| Categories of data subject and personal data | As set out per activity in section 1 |
| Categories of recipient | Convex, Vercel, Resend, PostHog and Google as processors; **Stripe as independent controller** for payments, Connect onboarding, KYC, AML and fraud, and as processor for servicing the Stripe platform; the National Crime Agency; Recognised Institutions on referral; police, NCA and OFSI on escalation; professional advisers |
| Transfers to a third country | Recorded per activity in section 1 and assessed in `dono-international-transfer-assessment-v3.0.md` |
| Time limits for erasure | Recorded per activity in section 1 |
| General description of security measures | Section 2 |

---

## 4. Open items

Each is recorded as open rather than assumed closed.

| # | Item | Status | Effect |
|---|---|---|---|
| 1 | **PostHog** Article 28 position for the Cloud EU instance | **Outstanding and blocking** | Analytics must remain disabled until closed |
| 2 | **Google** Article 28 position and region for the support mailbox | **Outstanding and blocking** | The mailbox receives rights requests, complaints, content reports and legal notices with no recorded contract |
| 3 | **Vercel** transfer risk assessment | **Outstanding and blocking** | Vercel's DPA contains no transfer impact assessment, so Dono must complete its own |
| 4 | PostHog project settings — location and device capture, 12-month retention with enforcement enabled, session replay off at project level, no own-purpose use | **[CONFIRM]** | Row 30 and the Cookie Notice cannot be published as accurate |
| 5 | Resend live message and log retention, distinct from the 90-day post-termination deletion in its DPA | **[CONFIRM]** | Row 27 states a placeholder |
| 6 | Vercel and Convex platform log retention periods | **[CONFIRM]** | Row 31 states a placeholder |
| 7 | Backup period, restore behaviour and deletion propagation for Convex and Vercel | **[CONFIRM]** | Row 32 asserts no period; the Privacy Notice must not either |
| 8 | Institutional data-sharing | **Not live** | Must not go live before a data-sharing agreement exists and the DPIA is revisited |
| 9 | Sufficient-guarantees evidence under Article 28(1) for every processor | **Outstanding** | Recorded in `dono-dpa-register-v3.0.md` |

**Closed since v2.3:** Resend Article 28 contract (executed 14 January 2026); Stripe Article 28 and transfer position (Stripe Payments Europe, Limited DPA of 18 November 2025, with the Data Transfers Addendum); Convex transfer risk assessment (provider assessment adopted).

---

## 5. Approval block — SIGNATURE REQUIRED

> **This block is unsigned. This record is prepared for approval and is not yet approved.**

**I confirm that this record accurately describes the processing Dono carries out, that every retention period stated is a requirement placed on the retention engine, and that the open items in section 4 are recorded as open.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Controller and data protection lead |
| Document version approved | 3.0 |
| Signature | ______________________ |
| Date of approval | ______________________ |

**Reviewed by:** Sashank (deputy) — Signature ______________________ Date ______________

---

## 6. Version control

| Field | Entry |
|---|---|
| Version | 3.0 |
| Version date | 7 August 2026 |
| Effective from | On publication approval |
| Accountable owner | Amrit Kaur Rooprai |
| Reviewed by | *(signature required — section 5)* |
| Approved by | *(signature required — section 5)* |
| Status | **Not approved.** Prepared for signature |
| Supersedes | `../../v2.3/dono-ropa-v2.3.md` and all earlier versions |
| Next scheduled review | 7 February 2027, or on any change of processor, product, region or feature |
