# Dono — Engineering and Operations Implementation Checklist

**Version:** 2.3.4
**Version date:** 7 August 2026
**Revision note:** 2.3.1 adds section J, derived from the engineering evidence of 5 August 2026, and marks items that evidence confirms as already working. **Section J contains the most urgent item in this document (CF-01).**
**Revision note 2.3.2:** moved into the central legal-launch engineering pack; added the Society-only beta gate and configurable demo-pricing decision gate; linked the central privacy/DPIA narrative.
**Revision note 2.3.3:** demo pricing is final; zero previous payments are confirmed; creator verified-DOB gating, enrolment-based geographic eligibility and replacement-account Society succession are settled.
**Revision note 2.3.4:** makes the three-event Acceptance Matrix an explicit build requirement and adds the approved live-document registry and handoff placeholder.
**Purpose:** Every technical, product and operational change required to make the v2.3 legal suite **true in practice**. `TRUTH.md` is the source of settled product decisions; this list is the authoritative engineering backlog.
**Owner:** Amrit Kaur Rooprai (accountable). Engineering owner to be named per item.

**Start here:** [`README.md`](README.md). Privacy and DPIA implementation is centralised in [`PRIVACY_DPIA_ENGINEERING_NARRATIVE.md`](PRIVACY_DPIA_ENGINEERING_NARRATIVE.md).

---

## How to read this

**Priority bands**

| Band | Meaning |
|---|---|
| **P0 — LAUNCH BLOCKER** | Public launch with real users, real money or real personal data must not happen until this is done |
| **P0-PUB — PUBLICATION BLOCKER** | The corresponding legal document **must not be published** until this is done, because publishing it would be inaccurate or misleading |
| **P1 — FEATURE GATE** | Required before the specific feature it relates to is enabled. The rest of the Platform may launch without it, with the feature off |
| **P2 — SHORTLY AFTER LAUNCH** | Within roughly 90 days of launch |
| **P3 — FUTURE MATURITY** | Genuinely valuable, not proportionate now |

**"Publishable before implementation?"** — whether the clause may go live before the build exists. **Yes** where the clause states an obligation on a user, a rule Dono applies by hand, or a limit on what Dono can do. **No** where the clause describes a system doing something automatically that it does not yet do.

---

## A. Payments and fees

| ID | Requirement | Reason | Clause | Finding | Priority | Depends on | Acceptance criteria | Evidence | Status | Publishable first? |
|---|---|---|---|---|---|---|---|---|---|---|
| PF-00 | **Versioned pricing configuration.** Production is fixed at **5% + 20p** and demo at **2% + 20p**. The applicable schedule is locked to the Campaign and stored with each Donation. Both are Campaign Owner charges unless the Donor actively selects unticked fee cover. Demo label: **“Payment processing fee (Dono)”**. No pricing mode may branch on card, method or country | Keep two commercial schedules exact, transparent and method-neutral | ToS 16; Donor 6 | Q2/Q13 | **P0** | — | Campaign cannot accept a payment without a stored schedule; all card/method/country vectors return that schedule; donor cover adds only the applicable Dono fee | Config export; tests; screenshots | Not started | **No** |
| PF-01 | **Implement the locked Campaign fee schedule:** demo **2% + 20p**; production **5% + 20p**. Remove every card-category branch | The contract and code must agree; the Dono fee never varies by instrument | ToS 16.1–16.2 | F07, F09 | **P0** | PF-00 | Every card/method/country/refund vector returns the Campaign's stored schedule; no card-type branch exists | Test output; code diff | Not started | Yes |
| PF-02 | **Campaign Owner bears the applicable Dono fee unless the Donor actively covers it.** Cover is unticked and adds only the stored 2% + 20p or 5% + 20p Dono fee; never Stripe's actual cost | Keeps the default customer/payer allocation and avoids a variable donor surcharge | ToS 16.4; Donor 6.3 | F07 | **P0** | PF-01 | Unticked path deducts Dono fee from proceeds; ticked path adds exactly the applicable fixed fee; all Stripe-cost additions are absent | Screenshots; tests | Not started | Yes |
| PF-03 | **Checkout shows an exact total before confirmation**, separately itemising Campaign contribution, **“Payment processing fee (Dono)”** for demo (or Dono fee for production), optional cover, **“Stripe processing cost (paid by the campaign)”**, and expected proceeds | Price transparency and accurate attribution | ToS 16.5; Donor 6.4 | F10 | **P0** | PF-01 | Charged amount equals displayed total; no copy implies Dono's fixed fee is Stripe's actual cost | Screenshots for every path | Not started | **No** |
| PF-04 | **Remove every VAT reference from displayed amounts, receipts and fee statements** while Dono is unregistered | Describing anything as VAT when unregistered is a misstatement | ToS 16.6; Donor 6.5 | F30 | **P0** | — | No user-facing string contains "VAT" other than the statement that Dono is not registered | String search; screenshots | Not started | Yes |
| PF-05 | **Record Dono's application fee separately** from campaign money and from Stripe processing cost, in the data model and in exports | Accounting accuracy; founder instruction | ToS 16.8 | F30 | **P0** | — | Three distinct fields per transaction; export reconciles | Sample export | Not started | Yes |
| PF-06 | **Fee changes are prospective only.** Bind the fee schedule to the Campaign at creation and to the Donation at payment. Existing campaigns are grandfathered | ToS 16.7 and 30.2(b) | ToS 16.7 | F59 | **P0** | — | Changing the platform fee does not alter any existing campaign or donation record | Test | Not started | Yes |
| PF-07 | **Verify and record the live Stripe configuration**: `controller.fees.payer`, `controller.losses.payments`, charge ownership, dashboard access, refund permissions and payout settings for every account type | The loss-allocation clauses must match the actual configuration | ToS 15.6 | F11 | **P0** | — | A written record of each setting, with a dashboard screenshot, matching ToS 15.6 | Configuration record | Not started | **No** |
| PF-08 | **Start a monthly rolling-total spreadsheet** of all sole-trader taxable revenue | VAT threshold monitoring | — | F30 | **P0** (ops) | PF-05 | Spreadsheet exists, updated monthly | The spreadsheet | Not started | n/a |
| PF-09 | **Ask an accountant once** about the reverse-charge treatment of Stripe's Irish invoices | Founder instruction | — | F30 | **P2** (ops) | — | Written answer on file | Advice note | Not started | n/a |
| PF-10 | **Retain Stripe exports and transaction records from day one** | Evidence and tax records | ToS 16.8 | F30 | **P0** (ops) | — | Monthly export stored | Stored exports | Not started | n/a |
| PF-11 | VAT registration preparation, VAT invoice and credit-note automation, Making Tax Digital integration, overseas place-of-supply workflows, daily threshold monitoring | Only needed near the threshold | ToS 16.6 | F30 | **P3** — at roughly £60,000–£70,000 rolling taxable turnover | PF-08 | — | — | Deferred | n/a |

## B. Refunds, disputes and the refund mandate

| ID | Requirement | Reason | Clause | Finding | Priority | Depends on | Acceptance criteria | Evidence | Status | Publishable first? |
|---|---|---|---|---|---|---|---|---|---|---|
| RF-01 | **Build the platform refund path**: Dono instructs Stripe to reverse a charge, in whole or part, on the connected account, under the mandate | Makes the refund remedy executable rather than a paper determination | ToS 13.2; Refund 6.1(b) | F12 | **P0** | PF-07 | End-to-end test: full and partial refund executed by Dono on a test connected account, with the reference recorded | Test log with Stripe refund IDs | Not started | **No** |
| RF-02 | **Pre-refund dispute check.** Before any refund executes, check the transaction's dispute state and block where a chargeback is open or already resolved for the donor | Prevents double recovery and wasted dispute fees | Refund 6.2(c), 8.4(c) | F21 | **P0** | RF-04 | Attempting a refund on a disputed transaction is blocked with a clear reason | Test | Not started | **No** |
| RF-03 | **Reverse Dono's application fee** proportionately on full and partial refunds, where the donor was not at fault | Refund 9.2–9.3 | Refund 9 | F09 | **P0** | RF-01 | Application-fee refund amount matches the formula in every test case | Test vectors | Not started | **No** |
| RF-04 | **One dispute state per donation**, tracking refund requests, card-network disputes, chargebacks and completed refunds in a single state machine | Coordination is the whole point of F21 | Refund 8.4 | F21 | **P0** | — | State transitions covered by tests; no donation can hold two conflicting states | State diagram; tests | Not started | **No** |
| RF-05 | **Notify the Connected Account holder immediately** on a refund request and on a chargeback being opened | Refund 5.4, 8.4(a) | Refund 5.4 | F21 | **P0** | RF-04 | Notification fires within 5 minutes of the event; delivery logged | Notification log | Not started | **No** |
| RF-06 | **Deadline alerts before the card-network dispute response deadline** | The account holder owns the dispute and must not miss it | Refund 8.4(b) | F21 | **P0** | RF-04 | Alert fires at a configured interval before the deadline | Test | Not started | **No** |
| RF-07 | **Record evidence of every completed refund** against the transaction — amount, reference, date, who authorised, and the determination | Refund 6.3, 8.4(e) | Refund 6.3 | F21 | **P0** | RF-01 | Record present and immutable for every refund | Sample record | Not started | **No** |
| RF-08 | **Surplus ledger** preventing double refund, supporting both automatic reverse-chronological allocation and individual donor claims | Founder decision of 6 Aug 2026 | ToS 14.5; Refund 10.3 | F19 | **P0** | — | Total refunded never exceeds surplus; a donor already refunded automatically cannot claim again | Test | Not started | **No** |
| RF-09 | **Refund request workflow**: submit, notify owner, 10-Working-Day response window, decision, reasons, notification, appeal within 10 Working Days to a different reviewer | Refund 5, 6 | Refund 5 | F20 | **P0** | — | Full case lifecycle exercised end to end | Test | Not started | **No** |
| RF-10 | **Remove the discretionary admin refund path** that is not governed by the mandate, or bring it inside the audited mandate workflow with authorisation and logging | An unlogged administrative refund path contradicts the published position | ToS 13.2 | F11 | **P0** | RF-01 | Only the audited path exists | Code review | Not started | **No** |

## C. Checkout, contract formation and acceptance evidence

The three-event [`Acceptance Matrix`](../../legal/suites/v3.0/publication-package/ACCEPTANCE_MATRIX.md) is the binding interaction specification for this section. Implement its exact distinction between active acceptance, notice acknowledgement/display and separate optional consent. The v3.0 Markdown files contain the current, content-ready wording but are not live display files. Their rendered HTML and PDF artifacts will be provided through [`legal/live-terms/`](../../legal/live-terms/).

| ID | Requirement | Reason | Clause | Finding | Priority | Depends on | Acceptance criteria | Evidence | Status | Publishable first? |
|---|---|---|---|---|---|---|---|---|---|---|
| CH-00 | **Implement the three acceptance events exactly as specified in the Acceptance Matrix:** A at account creation, B at Society onboarding and C at donation. Present only the documents and separate declarations assigned to that event; preserve accept versus shown/acknowledged versus optional-consent treatment; never present Student Campaign Terms during the Society-only beta | Prevents users accepting the wrong contract, at the wrong point, through an invalid bundled mechanism | ToS 2.3; Acceptance Matrix | F50, L-03 | **P0** | CR-00 | Automated tests cover every required, prohibited and optional item for A, B and C; payment/onboarding/account creation is blocked when a mandatory acceptance is absent; no generic bundled legal tick exists | Test matrix; screenshots; sample records | Not started | **No** |
| CH-01 | **Build the mandatory "You're donating to" panel** with all six fields: Campaign Owner's legal name; legal status; any representative; Connected Account holder; owner of purchased property; and Dono's role. **Block payment if any mandatory field is missing** | Identity and agency disclosure at the decision point | ToS 11.5; Donor 3.3 | F14 | **P0** | — | Payment cannot proceed with a missing field, tested for individual and society campaigns | Screenshots; test | Not started | **No** |
| CH-02 | **Persist the exact panel content** with the transaction and the acceptance record | Auditability | ToS 11.5 | F14, F50 | **P0** | CH-01 | Stored record reproduces exactly what was displayed | Sample record | Not started | **No** |
| CH-03 | **Contract forms on Stripe payment success.** Remove any dependency of formation on the confirmation email. Receipt and email are evidence only | Removes the failed-email gap | ToS 12.2; Donor 3.2 | F13 | **P0** | — | A successful charge with email delivery failed still produces a formed contract and a complete record | Test | Not started | Yes |
| CH-04 | **Mandatory 18+ confirmation at checkout**, with the exact wording in Donor Terms clause 2.2. Payment blocked without it | 18+ donor policy | ToS 11.4; Donor 2.2 | F15, F39 | **P0** | — | Payment blocked without the tick; the confirmation is stored | Screenshot; record | Not started | **No** |
| CH-05 | **Complete acceptance record for every acceptance:** user or guest key, role, event A/B/C, campaign ID, donation ID for event C, document IDs, exact versions and hashes, exact acceptance wording and wording version, timestamp and active mechanism. **Use the same evidence standard for guests and registered users** | Proving who accepted which exact terms, at which legal point, through which wording and action | ToS 2.3; Acceptance Matrix | F50 | **P0** | CH-00 | Account creation, Society onboarding, signed-in donation and guest donation each produce a complete record that resolves to the immutable accepted bytes | Sample records; database test | Not started | **No** |
| CH-06 | **Immutable archive of every published document version**, permanently addressable, never overwritten or deleted | ToS 2.2, 30.5 | ToS 2.2 | F50, F59 | **P0** | — | Superseded versions remain retrievable at a stable URL | Archive listing | Not started | **No** |
| CH-07 | **On-screen confirmation after acceptance or payment** showing the transaction details and the applicable document versions | ToS 2.4 | ToS 2.4 | F50 | **P0** | CH-05 | Screenshot of the confirmation screen | Screenshot | Not started | **No** |
| CH-08 | **Confirmation email containing the transaction details and either the applicable documents attached as PDFs or a permanent link to the archived versions** | Durable copy | ToS 2.4 | F50 | **P0** | CH-06 | Email received containing a working permanent link | Sample email | Not started | **No** |
| CH-09 | **Version binding**: each campaign and each donation permanently linked to the document versions in force when it was created | ToS 2.2, 30.5 | ToS 30.5 | F59 | **P0** | CH-06 | Records show the version, and it does not change when a new version is published | Test | Not started | **No** |
| CH-10 | **Re-acceptance gating for material changes**: affected features unavailable until the user actively accepts. Never rely on continued use | ToS 30.2(c) | ToS 30.2(c) | F59 | **P0** | CH-05 | Simulated material change blocks the affected feature until acceptance | Test | Not started | **No** |

## D. Eligibility and verification

| ID | Requirement | Reason | Clause | Finding | Priority | Acceptance criteria | Status | Publishable first? |
|---|---|---|---|---|---|---|---|---|
| EL-01 | **Remove student-card upload from the product entirely** — the UI, the API, the storage, the extraction and the admin review of card images | Product decision of 6 Aug 2026; removes the highest-risk data category Dono held | Verification Notice 3.2; Privacy 3 | F41 | **P0-PUB** | No route exists to upload or view a student card | Not started | **No** |
| EL-02 | **Delete all existing student-card images, student numbers and extracted card details**, and confirm deletion propagates through backups | The data should no longer exist | Privacy 3 | F41 | **P0** | Deletion log; backup expiry confirmed | Not started | **No** |
| EL-03 | **University email verification as the sole eligibility check**: one-time code or link to a `Recognised Institution` address, returned to confirm control | Verification Notice 3.1 | Verification 3.1 | F41 | **P0** | Non-institutional domains rejected; code expires; the outcome is recorded | Not started | **No** |
| EL-04 | **Reverification each October and at campaign creation**, with the three-month deferral rule | ToS 6.3 | ToS 6.3 | — | **P1** | Scheduled job runs and records the outcome | Not started | Yes |
| EL-05 | **Remove every public verification, validation, eligibility or trust indicator** — badges, ticks, shields, "verified", "validated", "eligibility checked", "society approved", "institutionally endorsed" — from campaign pages, listings and checkout | Product decision of 6 Aug 2026 | ToS 6.6; Verification 7.1 | F57 | **P0-PUB** | No such element renders anywhere. Design review signed off | Not started | **No** |
| EL-06 | **Replace evidence status with neutral lifecycle states** (`funding_open`, `funding_closed`, `evidence_submitted`, `evidence_outstanding`, `evidence_overdue`, `closed`, `closed (administrative)`), rendered without approving styling | ToS 10.2; Verification 7.3 | ToS 10.2 | F57 | **P0** | No tick, green state or approving icon on any lifecycle state | Not started | **No** |

## E. Campaign rules and feature removal

| ID | Requirement | Reason | Clause | Finding | Priority | Acceptance criteria | Status |
|---|---|---|---|---|---|---|---|
| CR-00 | **Society-only beta gate.** Disable individual campaign creation, publication and donation at the API boundary. Do not present Student Campaign Terms as operative beta terms. Preserve the individual model behind a future release gate | Beta sequencing is settled: Societies first, individual campaigns later | ToS 4.8; Student Terms | L-03 | **P0** | Direct API tests cannot create, publish or donate to an individual campaign; beta legal manifest excludes Student Terms | Not started |
| CR-01 | **Remove recurring donations entirely** from the product — creation, management, billing, cancellation, UI and copy | Feature removed from the Terms; enabling it without lifecycle controls creates unexpected repeat charges | ToS 8.6; Donor 3.6, 5.2 | F16 | **P0** | No route creates a recurring charge; no UI references one | Not started |
| CR-02 | **Remove matched-funding / Match Windows entirely** | Feature removed from the Terms | ToS 8.6; Donor 3.6; CG 5.3 | F17 | **P0** | No match window can be created or displayed | Not started |
| CR-03 | **Block commercial and entrepreneurial campaigns** at creation and at review, with a declaration and a reviewer check | ToS 8.3 | ToS 8.3 | F28 | **P0** | Declaration mandatory; a "for my business" campaign is refused at review | Not started |
| CR-04 | **Implement the Society-purpose test.** Primary purpose must advance the Society's activities, members or legitimate objectives. Incidental third-party benefit is permitted. A primarily external-benefit Campaign passes only if it is a formally approved official Society initiative that directly furthers its charitable, educational, sporting, cultural or community mission and is controlled/delivered by the Society rather than a pass-through | Founder decision; ToS 8.4 | ToS 8.4; Society 2.5 | F29 | **P0** | Form captures mission, beneficiaries, recipient, delivery control, ownership and approval; reviewer tests cover incidental benefit, qualifying official initiative and prohibited pass-through | Not started |
| CR-05 | **Enforce the funding cap** — a campaign cannot be funded beyond its target | Over-funding must not arise | ToS 14.5(c) | — | **P0** | A donation that would exceed the target is prevented or reduced | Not started |
| CR-06 | **Material Change workflow**: submit before implementing; suspend new donations; notify affected donors individually; 14-day refund window; record everything | ToS 14.4 | ToS 14.4 | F18 | **P0** | Full workflow exercised end to end | Not started |
| CR-07 | **Split-role agreement gate**: where Campaign Owner, Recipient and property owner differ, block publication until an express agreement signed by every affected party is recorded | ToS 15.3; Society 3.3 | ToS 15.3 | F26 | **P1** — before any split-role campaign | Publication blocked without the recorded agreement | Not started |
| CR-08 | **Enrolment-based eligibility.** Do not require physical UK presence. Students remain eligible while enrolled during a year abroad, placement or field trip. A Connected Account holder must supply a valid UK address and pass the Payment Provider's UK onboarding | Founder decision; ToS 4.4–4.5 | ToS 4.4–4.5; Student 2 | U6 | **P0** | Overseas-location test passes for an enrolled student; missing/invalid UK Connected Account address fails; enrolment expiry still blocks | Not started |
| CR-10 | **Replacement-account Society succession.** On verified representative change or authority dispute, suspend new Donations; require the successor's fresh identity, adult-DOB and UK Connected Account onboarding; route future Donations only to the new account; retain historic transactions against the outgoing account. Never attempt an account/balance transfer | Settled succession rule; Stripe account ownership and direct-charge records do not migrate | Society 6 | U7 | **P0** | Handover tests prove suspension, fresh onboarding, future routing, historic record separation, notices and restricted record export; no API moves funds between accounts | Not started |

## F. Online safety, moderation and CSEA

> **Public user-generated content stays disabled until every item in this section marked P0 has passed with dated evidence and a named approver.** See `dono-online-safety-procedures-v2.3.md` and `dono-csea-reporting-procedure-v2.3.md`.

| ID | Requirement | Clause | Finding | Priority | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| OS-01 | **Report control on every item of user-generated content** — campaigns, updates, images, video, documents, comments, usernames — preserving the content version the reporter saw | CG 7.1 | F31 | **P0** | Control present on every surface; version captured | Not started |
| OS-02 | **Logged-out reporting route** with the fields in CG 7.2 | CG 7.2 | F31 | **P0** | Report submitted successfully while signed out | Not started |
| OS-03 | **Automatic moderation-case creation** from every report, with evidence, reason code and timestamps | CG 7.4 | F31 | **P0** | Case created for every report; no report can be lost | Not started |
| OS-04 | **Urgent escalation** for credible threats, child safety, CSEA and other serious illegal content — bypasses the queue, notifies the Online Safety lead immediately, logged | CG 8.6 | F31 | **P0** | Escalation fires and is logged | Not started |
| OS-05 | **Moderator powers**: hide content, remove content, pause a campaign, restrict commenting, suspend an account, preserve evidence — all one-click, all logged | CG 6.3(d), 7.5 | F31 | **P0** | Each action available and logged | Not started |
| OS-06 | **Complete action and decision log** — moderator identity, action, reason code, timestamp, restoration history | CG 8.8 | F31 | **P0** | Log complete and exportable | Not started |
| OS-07 | **Appeals workflow assigning the case to a different reviewer**, with role-based permissions preventing self-review | CG 8.5 | F37 | **P0** | System refuses to assign an appeal to the original decision-maker | Not started |
| OS-08 | **Moderation dashboard**: queue of reported items; view content, reporter, reason and timestamps; one-click keep / hide / remove / suspend commenting / suspend account; moderator notes; audit log; pending appeals and escalation status | CG 7–8 | F31, F37 | **P0** | Dashboard operational | Not started |
| OS-09 | **Keyword and pattern filtering before publication** for racial, religious, homophobic and sexist slurs; obvious CSEA terminology; obvious suicide-encouragement phrases; common spam and phishing | CG 6.3(a) | F35 | **P0** | Blocked list configured and tested; blocks logged | Not started |
| OS-10 | **Rate limiting on comments** and **repeat-offender detection** with configurable thresholds for temporary or permanent restriction | CG 6.3(a), (e) | F35 | **P0** | Thresholds configurable; restriction applied automatically | Not started |
| OS-11 | **Comments are plain text**: editor and server reject links, URLs, images and attachments | CG 6.2 | F36 | **P0** | Server-side rejection tested, not just client-side | Not started |
| OS-12 | **Campaign video**: direct upload only, scanned, manually reviewed in full before publication, re-reviewed after any change, with the moderator recording that the full video was reviewed | ToS 19.4 | F36 | **P1** — before video is enabled | Review record includes full-video confirmation | Not started |
| OS-13 | **External links**: HTTPS only, approved destination stored, re-review on edit, periodic redirect and destination checking, immediate disable available | ToS 19.4 | F36 | **P1** — before links are enabled | Redirect check runs and flags a changed destination | Not started |
| OS-14 | **Avatars**: automated image-safety scanning, moderator removal, re-review after change | ToS 19.4 | F36 | **P1** — before avatars are enabled | Scanning operational | Not started |
| OS-15 | **Moderator training delivered and recorded**; response targets published; **incident drill completed** | CG 8; OSP | F31, F37 | **P0** | Training and drill records with dates and attendees | Not started |
| OS-16 | **Basic moderation analytics** — reports received, removals, suspensions | CG 8.8 | F31 | **P2** | Dashboard shows monthly figures | Not started |
| OS-17 | **NCA CSEA portal registration**; Organisation Administrator and Deputy accounts created and tested; named working accounts; 24-hour emergency contact registered | CSEA C1–C5 | F34 | **P0 — LEGAL REQUIREMENT** | Registration confirmation and test-login records | Not started |
| OS-18 | **Restricted CSEA storage**: segregated, encrypted, role-limited, access-logged; hide-in-place without delete | CSEA C6–C7 | F34 | **P0** | Test evidence | Not started |
| OS-19 | **Two CSEA retention clocks automated**: content and prescribed information deleted at **1 year**; report reference retained **5 years**; hold override; deletion logged | CSEA §5 | F34 | **P0 — LEGAL REQUIREMENT** | Automated deletion tested with a synthetic record | Not started |
| OS-20 | **CSEA safe-handling training and a harmless-data drill** completed end to end | CSEA C10–C11 | F34 | **P0** | Drill record | Not started |
| OS-21 | **Legal notice-and-action**: complaint form with the fields in the Notice-and-Action Procedure clause 1.2; counter-notice function; repeat-infringer counter; Defamation Act deadline tracking; decision log; user notifications | ToS 20; NA procedure | F61 | **P0** | Full workflow exercised for a copyright and an impersonation notice | Not started |

## G. Evidence, closure and campaign lifecycle

| ID | Requirement | Clause | Finding | Priority | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| EV-01 | **Immutable campaign snapshot at each donation** — page, budget, target, Ownership Statement, end date | ToS 10; Evidence §7 E1 | F56 | **P0** | Snapshot retrievable and unaltered after a campaign edit | Not started |
| EV-02 | **Immutable donation-disclosure record** (the checkout panel, fee breakdown, totals, document versions) | Evidence §7 E2 | F56, F50 | **P0** | Record reproduces exactly what was displayed | Not started |
| EV-03 | **Campaign edit history** — before, after, who, when | Evidence §7 E3 | F56 | **P0** | Full history retrievable | Not started |
| EV-04 | **Evidence upload with pre-upload redaction guidance**, hashing, uploader and timestamp | ToS 10.2; Privacy 11.2 | F43 | **P0** | Guidance shown before every upload; hash stored | Not started |
| EV-05 | **Receipt validation and quarantine** — flag receipts containing unnecessary personal data; quarantine; **auto-delete after 30 days**; deletion logged and auditable | Privacy 11.3 | F43 | **P0-PUB** | Quarantine and deletion tested; log verifiable | Not started |
| EV-06 | **Structured Closure Statement form** with the minimum contents in ToS 10.3(b) | ToS 10.3 | F56 | **P0** | Form matches the clause | Not started |
| EV-07 | **Deadline tracking and scheduled reminders** — the schedule in the Evidence Procedure clause 3 | ToS 10.3(a) | F56 | **P0** | Every reminder fires and is logged | Not started |
| EV-08 | **Reviewer assignment, the 14-item checklist as a structured form, conflict-of-interest block and recusal** | Evidence §4 | F56 | **P0** | A decision cannot be recorded until every checklist item is answered | Not started |
| EV-09 | **One cure cycle** with a 14-day deadline and stated deficiencies | ToS 10.3(d) | F56 | **P0** | Second rejection is not possible | Not started |
| EV-10 | **30-day administrative-closure job**, with the mandatory procedural label rendered distinctly from an accepted closure | ToS 10.3(e) | F56 | **P0** | Job fires at 30 days; label present; no approving styling | Not started |
| EV-11 | **Donor notifications N11–N14** — campaign closed, closure outcome, surplus identified with the right to claim, material change | Evidence §9 | F56 | **P0** | All fire and are logged | Not started |
| EV-12 | **Reviewer dashboard** per Evidence Procedure clause 8, including the countdown to the 30-day deadline | Evidence §8 | F56 | **P0** | Dashboard operational | Not started |

## H. Privacy, retention and consent

| ID | Requirement | Clause | Finding | Priority | Acceptance criteria | Status | Publishable first? |
|---|---|---|---|---|---|---|---|
| PR-01 | **Automated retention enforcement** for every category in Privacy Notice clause 7.1, with deletion audit logging and backup deletion propagation | Privacy 7 | F41, F45 | **P0-PUB** | Each period enforced by a scheduled job; deletions logged | Not started | **No** |
| PR-02 | **Risk-based moderation retention** — the differentiated periods, not a flat six years | Privacy 7.1 | F45 | **P0-PUB** | Categories applied correctly by case type | Not started | **No** |
| PR-03 | **Campaign archival at 24 months after closure**: de-index, remove from browsing, discovery and search, strip unnecessary donor-identifying and sensitive information | ToS 31.3; Privacy 7.3 | F45 | **P0-PUB** | Job runs; `noindex` applied; page absent from search and browse | Not started | **No** |
| PR-04 | **Depublication and deletion request route** for archived campaign pages | ToS 31.3; Privacy 7.3 | F45 | **P0** | Request route exists and is actioned | Not started | **No** |
| PR-05 | **Legal hold** suspending scheduled deletion, recorded and reviewable | Privacy 7.4 | F45 | **P1** | Hold applied and released in test | Not started | Yes |
| PR-06 | **Inactive-account job**: notify at 24 months, delete at 27, preserving records the schedule requires | Privacy 7.2 | — | **P1** | Job tested on a seeded account | Not started | **No** |
| CK-01 | **Analytics off by default**; PostHog not loaded at all before consent | Cookie 3.2, 5.1 | F46 | **P0-PUB** | Network trace on a clean browser shows no analytics request before consent | Not started | **No** |
| CK-02 | **Equally prominent Accept and Reject** — same size, weight, colour contrast and position | Cookie 5.1 | F46 | **P0-PUB** | Design review and screenshots | Not started | **No** |
| CK-03 | **Permanent "Privacy and analytics settings" link in the footer of every page**, with the Cookie Notice linked from the footer too | Cookie 5.2; Privacy 14.1 | F46 | **P0-PUB** | Link present sitewide | Not started | **No** |
| CK-04 | **Withdrawal at any time, effective immediately for future collection, with downstream revocation** | Cookie 5.2 | F46 | **P0-PUB** | After withdrawal, no further events are sent; verified by network trace | Not started | **No** |
| CK-05 | **Record the consent decision, the timestamp and the Cookie Notice version** | Cookie 5.3 | F46 | **P0-PUB** | All three fields stored | Not started | **No** |
| CK-06 | **Clean-browser audit on desktop and mobile** across every route and checkout state; correct Cookie Notice clause 4 against it | Cookie 4 | F46 | **P0-PUB** | Documented audit output; table corrected | Not started | **No** |
| RC-01 | **Mandatory pre-upload redaction guidance** | Privacy 11.2 | F43 | **P0** | Shown before every upload | Not started | **No** |
| RC-02 | Validation and reviewer check for unnecessary personal data in receipts | Privacy 11.3 | F43 | **P0** | Reviewer checklist item 11 enforced | Not started | Yes |
| RC-03 | Automatic deletion of quarantined receipts after 30 days | Privacy 11.3 | F43 | **P0-PUB** | Tested | Not started | **No** |
| RC-04 | Retention and deletion events auditable | Privacy 11.3 | F43 | **P0** | Audit query returns the deletion record | Not started | **No** |
| DP-01 | **Automatic acknowledgement configured** on `joindono.team@gmail.com` | Privacy 13.4(b) | F49 | **P0** (ops) | Test email receives the auto-reply | Not started | **No** |
| DP-02 | Gmail labels `DP-Complaint/Open|Awaiting-user|Closed` created | DP workflow §2.1 | F49 | **P0** (ops) | Labels exist | Not started | n/a |
| DP-03 | DP complaints register spreadsheet created with the clause 2.2 columns | DP workflow §2.2 | F49 | **P0** (ops) | Spreadsheet exists | Not started | n/a |
| DP-04 | Routing note circulated to everyone who reads the inbox | DP workflow §3 | F49 | **P0** (ops) | Note issued; acknowledged | Not started | n/a |
| VN-01 | **Confirm and record the Resend, PostHog and Stripe Article 28 terms** in the DPA Register — terms, version, date, products, sub-processors | Privacy 8.2 | F42 | **P0-PUB** | Three complete register rows | Not started | **No** |
| VN-02 | **Complete the Vercel Transfer Risk Assessment**, and one for Resend | Privacy 8.3 | F42 | **P0-PUB** | Written TRAs on file | Not started | **No** |
| VN-03 | **Disable any non-essential vendor whose requirements cannot be met** before launch | Privacy 8 | F42 | **P0** | Vendor list reconciled to the register | Not started | Yes |

## I. Security and governance

| ID | Requirement | Clause | Finding | Priority | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| SE-01 | **Least-privilege production access**, documented, with an access inventory listing every system, its owner and who holds access | Privacy 14.2 | F47 | **P0** | Inventory exists and matches reality | Not started |
| SE-02 | **Secret management**: no secret, API key, credential or connection string in source control; secrets held in the platform's secret store; a scan confirms none is committed | Privacy 14.2 | F47 | **P0** | Repository scan clean; secrets store in use | Not started |
| SE-03 | **Written confidentiality and data-handling obligations accepted by everyone** with access to production systems or personal data | Privacy 14.2; ToS 1.1 | F53 | **P0-PUB** | Signed or accepted Team and Contributor Agreement on file for every person | Not started |
| SE-04 | **Documented offboarding procedure** with an access-removal checklist covering every system, secrets rotation, and a target of 24 hours (immediate for cause) | Privacy 14.2; Team Agreement §8 | F53 | **P0** | Procedure written; checklist template exists; dry-run completed | Not started |
| SE-05 | **Public documentation matches implemented controls** — no claim of MFA enforcement, immutable audit logs, device management, certification or continuous monitoring | Privacy 14.2 | F47 | **P0-PUB** | Security wording reconciled against the implemented control list | Not started |
| SE-06 | **Access reviews** — quarterly review of who holds what | Privacy 14.2 | F47 | **P2** | Review record | Not started |
| SE-07 | MFA on privileged and vendor accounts | Privacy 14.2 | F47 | **P1** — strongly recommended, not stated as a control in any public document until done | MFA enabled and evidenced | Not started |
| SE-08 | Formal device management, immutable audit logging, ISO 27001-style governance | — | F47 | **P3** | — | Deferred by decision |
| GV-01 | **Execute the Team and Contributor Agreement** with every founder and contributor | Team Agreement | F53 | **P0** (ops) | Signed or accepted copies on file | Not started |
| GV-02 | **Publish the weekly Incident Lead rota**; create the Signal incident group; record every founder's mobile number | IRP §2–3 | F48 | **P0** (ops) | Rota published; group created | Not started |
| GV-03 | **Verify and date every processor emergency contact** in IRP clause 4 | IRP §4 | F48 | **P0** (ops) | Every row has a verification date | Not started |
| GV-04 | **Run and document tabletop exercises T1 and T2** | IRP §8 | F48 | **P0** (ops) | Two documented exercises with findings and follow-ups | Not started |
| GV-05 | **Platform kill switches**: disable new campaigns, donations, registration and comments independently | Wind-Down §4 | F55 | **P0** | Each switch tested | Not started |
| GV-06 | **User data-export route** for account data and submitted evidence | ToS 31.2(f); Wind-Down §7.1 | F55 | **P0** | Export produces a usable file | Not started |
| GV-07 | **Deputy access recorded and tested**; credential-recovery route tested; written instruction to personal representatives | Wind-Down §8 | F55 | **P0** (ops) | Test record; instruction on file | Not started |
| GV-08 | **Desktop shutdown exercise** run and documented | Wind-Down §10 | F55 | **P1** | Exercise record | Not started |
| FC-01 | **Unsupported Countries List** created and reviewed quarterly | FC policy §3 | F54 | **P0** (ops) | List exists with a review date | Not started |
| FC-02 | **Automatic decline of payments from listed countries**, with the attempt logged | FC policy §3.4 | F54 | **P0** | Test decline logged | Not started |
| FC-03 | **Screening trigger thresholds configured** and alerting | FC policy §4.2 | F54 | **P0** | Alert fires on a seeded transaction above the threshold | Not started |
| FC-04 | **Campaign and donation suspension tested end to end** before payments go live | FC policy §7 | F54 | **P0** | Test record | Not started |
| FC-05 | **Financial-crime and sanctions training** delivered and recorded for everyone who reviews campaigns | FC policy §8 | F54 | **P0** (ops) | Training records | Not started |
| FC-06 | **Screening record store** retaining searches and results for 6 years | FC policy §4.4 | F54 | **P1** | Records retrievable | Not started |
| IR-01 | **Referral record template and register** with the clause 10.1 fields | Referral Protocol | F60 | **P1** — before the first referral | Template and register exist | Not started |
| IR-02 | **Verified institutional contact list** — named individual, named role, institutional domain | Referral Protocol §7 | F60 | **P1** | List with verification dates | Not started |
| IR-03 | **Correction workflow** — send a correction to the same recipient where an appeal succeeds | Referral Protocol §9.2 | F60 | **P1** | Workflow documented | Not started |
| IR-04 | **Six-monthly referral review** scheduled | Referral Protocol §10.3 | F60 | **P2** | Calendar entry | Not started |
| GS-01 | Unsupported Countries List (as FC-01) | Geographic §4 | F62 | **P0** | — | Not started |
| GS-02 | Automatic decline (as FC-02) | Geographic §4 | F62 | **P0** | — | Not started |
| GS-03 | Declined-attempt logging by country | Geographic §4 | F62 | **P1** | Log queryable | Not started |
| RM-01 | **Release Control Matrix** created in `TRUTH.md` and populated for every user-facing feature, and reviewed before every production deployment | TRUTH.md | F05 | **P0** (ops) | Matrix populated; referenced in the release process | **Done — matrix section added to `TRUTH.md`; population outstanding** |

---

## J. Items arising from the engineering evidence of 5 August 2026

> These come from verified answers about reachable product behaviour. Dono has processed no payments. The payment rows therefore describe paths that must be removed before first use, not historic customer transactions.

### J1. The platform-account payment path — most urgent item in this document

| ID | Requirement | Reason | Clause | Priority | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| **CF-01** | **Remove the community-fund payment path at the API boundary.** `stripe.createFundPaymentIntent` is a **public, unauthenticated action that charges Dono's own platform account as merchant of record**, with no age gate and no terms acceptance. `funds.list` is a public query enumerating fund slugs. The webhook still branches on `fund_one_time`. **Delete the action, the fund payment branch in the webhook and the public `funds.list` query — do not merely hide the UI.** Follow the pattern already used for campaign-level recurring donations | This is a pooled fund receiving money into an account Dono controls. It breaches the settled decision in `TRUTH.md` ("no pooled funds… not at launch or at demo"); it makes ToS 4.2 ("Dono does not receive, hold, safeguard or control donation funds… holds no payment account") untrue; and **it is the single fact that would collapse the payment-services analysis in `00_v2.3_change_log.md` §5**, which depends entirely on funds never entering an account Dono controls | ToS 4.2, 8.5; change log §5 | **P0 — BLOCKER** | No route, public query or webhook branch can create or settle a charge on the platform account. Verified by attempting a direct API call | **Not started** |
| **CF-02** | **Record the founder's confirmation that Dono has processed no payments** and retain the zero-payment position in the release evidence | Closes the historic-remediation question without inventing a customer population | change log §5 | Closed factual item | Dated founder confirmation linked | **Complete — zero payments confirmed 6 Aug 2026** |
| **CF-03** | Historic-payment escalation | No settled charge exists | — | Not applicable | Reopen only if the zero-payment fact is later shown to be wrong | **Closed — not applicable** |

### J2. Fees — remove the unlaunched variable-fee paths

| ID | Requirement | Reason | Clause | Priority | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| **PF-12** | **Remove the donor-facing variable processing-cost add-on before first payment.** The unused code can add the Payment Provider's estimated cost at a rate that varies by card | A donor-payable card-dependent amount would create surcharge and contract risk if enabled | ToS 16.3; Donor 6.2 | **P0 — BLOCKER** | No donor-payable amount varies by card, method or country; all paths use the stored Dono schedule only | **Not started; zero historic payments** |
| **PF-13** | **Checkout must never display one figure and charge another.** The unused code displays the standard-UK estimate even where a different card route could charge more | Prevent a future price-transparency breach | ToS 16.5; Donor 6.4 | **P0 — BLOCKER** | Charged amount equals displayed total on every test vector before live mode | **Not started; zero historic payments** |
| **PF-15** | **Restrict enabled payment methods for beta to card, Link and mainstream wallets.** Currently live: Bancontact, BLIK, EPS, Kakao Pay, Naver Pay, PAYCO, MB Way, Pix, Revolut Pay, Samsung Pay, Satispay and bank transfers | Enabling country-specific local payment methods for Belgium, Poland, Austria, Korea, Portugal, Brazil and Italy **weakens the "passive acceptance, not targeting" analysis** on which `dono-geographic-scope-risk-assessment-v2.3.md` depends, and each method carries its own consumer and refund rules Dono has not assessed | Geographic assessment §5 | **P0** | Dashboard shows only the approved method set | **Not started** |
| **PF-16** | **Fix the application-fee refund race.** The database increments the fee-refunded figure **before** the Payment Provider call, and a failed call may not retry | Under-refunding Dono's fee to a donor who is entitled to it | Refund 9.3 | **P1** | Failure injection test shows the figures reconcile | **Not started** |

### J3. Age gates — one of them is not a control at all

| ID | Requirement | Reason | Clause | Priority | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| **AG-01** | **`ageAttested` must be derived from the user's actual confirmation, or removed.** It is currently a **hardcoded client literal `true`** passed by both donation sheets, and is then written to the donation record as a constant. The server check cannot fail for a real user, and **the stored field is worthless as evidence of anything** | The Terms and the Donor Terms both state that the 18+ confirmation is captured and stored. It is not. A field that looks like an attestation but is a constant is worse than no field, because it will be produced in an audit as though it meant something | ToS 11.4; Donor 2.2 | **P0 — BLOCKER** | The stored value differs when the box is unticked; payment is refused | **Not started** |
| **AG-02** | **Add an age gate to account creation.** No date of birth is collected or required at signup, and onboarding can be skipped entirely | ToS 5.1 states you must be 18 or over to create an account. Nothing enforces it | ToS 5.1 | **P0** | Account cannot be created without an adult date of birth | **Not started** |
| **AG-03** | **Add an age gate to commenting** | ToS 17.1 and CG 6.1 require commenters to be 18+. Nothing checks it | ToS 17.1; CG 6.1 | **P0** | Comment refused where no adult date of birth is held | **Not started** |
| **AG-04** | **Any remaining subscription or fund payment path must enforce the same gates as a one-off donation** — age, legal acceptance and authentication. Today they enforce none | Weaker gates on the same money. Largely resolved by CR-01 and CF-01, but must be verified rather than assumed | ToS 11.4 | **P0** | No payment path exists that skips the gates | **Not started** |
| **AG-05** | **Use the verified date of birth from the identity check as the final age gate for Campaign and Society creators**, in addition to the preliminary declared check. Missing, inconsistent or under-18 results fail closed; provide a documented correction/review route | Founder decision; the government-document DOB is already returned and stored | Verification 4.5; Student 3.4 | **P0 before creator onboarding** | Creation, publication and receipt of Donations are refused without an adult verified DOB; correction workflow is logged and cannot override an under-18 result without corrected provider data | **Not started** |

### J4. Verification — remove Dono's own identity-document storage

| ID | Requirement | Reason | Clause | Priority | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| **EL-07** | **Remove `idDocumentStorageId` and the admin identity-document viewer (`getIdDocumentUrlForAdmin`) from campaigns and societies, and delete any stored documents.** Identity verification remains, performed by the Payment Provider, which holds the document and face scan | Founder decision of 6 August 2026: keep the Payment Provider's identity check, drop Dono's own upload. While Dono stores government identity documents, the Verification Notice and Privacy Notice are untrue and Dono holds its highest-risk data category with no scanning, no retention rule and no deletion cascade | Verification 3.2; Privacy 3 | **P0-PUB** | No route uploads or serves an identity document to or from Dono. Existing documents deleted and deletion logged | **Not started** |
| **EL-08** | **Give the verified name and verified date of birth a retention period and a deletion cascade.** They currently persist **indefinitely** on the campaign or society row and **survive the account holder deleting their account** | Privacy 7.1 now states 6 years from campaign or society closure, and deletion on account deletion where no live obligation requires them. That is not true today | Privacy 7.1 | **P0-PUB** | Retention job runs; account deletion cascades; both logged | **Not started** |
| **EL-09** | **Make the identity-check enable flag a single server-side source of truth.** It is currently hardcoded `true` in **two independent files**, client and server, which can silently drift | A client and server that disagree about whether a mandatory check is on is a control failure waiting to happen | — | **P1** | One shared source; client mirrors server | **Not started** |

### J5. Features that must be removed

| ID | Requirement | Reason | Clause | Priority | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| **CR-01a** | **Remove society-level recurring subscriptions at the API boundary**, together with the automatic refund-and-cancel path that fires when a society has no active campaigns. Follow the pattern used for campaign-level recurring, which was correctly removed at the API boundary | Founder decision, reconfirmed 6 August 2026 after being told the feature is live. The path also enforces **no age check and no legal acceptance**, which is why it should not simply be left running | ToS 8.6; Donor 3.6, 5.2 | **P0** | No route can create a subscription. Existing subscriptions cancelled and donors notified | **Not started** |
| **CR-02a** | **Remove Match Windows entirely** — the admin creation tools in `campaignMatches.ts` and the public display of active match windows on the home page and campaign list | The Terms state that matched funding is not a feature. **Active match windows are currently visible to the public**, and a publicly displayed "matched" claim with no enforceable commitment behind it is misleading fundraising under CG 3.1 | ToS 8.6; CG 5.3 | **P0** | No match window can be created or displayed | **Not started** |
| **CR-09** | **Enforce the funding target server-side.** Today there is **no cap** — `validateCampaignAndAmount` never compares the donation against the goal, and over-funding is treated as expected behaviour | Every document states that a Campaign cannot be funded beyond its target, and this was settled on 31 July 2026. Where a payment nevertheless completes past the target, ToS 14.5(c) requires the excess to be refunded in full | ToS 14.5(c); Student 5.1; Donor 10.8 | **P0** | Amount is reduced to the remaining need before confirmation; a race-condition excess is refunded in full and Dono's fee reversed on it | **Not started** |
| **OS-22** | **Reject URLs in comments server-side.** Attachments and images are blocked; **URLs are not** | CG 6.2 and ToS 17.1 both state that links are rejected by the editor **and the server**. That is currently untrue, and links in comments are the specific risk the rule exists to address | CG 6.2 | **P0** | A comment containing a URL is rejected by a direct API call, not only in the client | **Not started** |

### J6. Contract evidence — what is built, and what is missing

| ID | Requirement | Reason | Clause | Priority | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| **CH-11** | **Store a hash of the exact accepted text with each acceptance**, not only a version string | The acceptance record stores a version string only, and the text lives in a **mutable source file with no historical route**. A silent wording change under an unchanged version string is possible today and would be undetectable from the acceptance record | ToS 2.2–2.3 | **P0-PUB** | Hash stored; a changed document produces a different hash | **Not started** |
| **CH-12** | **Build a permanent route that renders a specific historical version** of each document | Today only the current text is renderable. The only way to recover what someone accepted is a developer reading version control | ToS 2.2, 30.5 | **P0-PUB** | Superseded version retrievable at a stable URL by a user | **Not started** |
| **CH-13** | **Single source of truth for document versions.** The version map is **duplicated verbatim in two files** that nothing keeps in sync | A bump applied to one and not the other silently desyncs what must be accepted from what is displayed | ToS 2.2 | **P0** | One source; build fails on divergence | **Not started** |
| **CH-14** | **Persist the guest identifier on the donation record, with a reference to the acceptance row.** Today the donation stores a bare `legalAcceptedAt` timestamp, the acceptance row is keyed to a browser-local key, and **there is no link between them** | Dono cannot presently prove which version a guest donor accepted — the link is broken by construction, not merely on clearing storage. ToS 2.3 states that guests are recorded on the same basis as registered users | ToS 2.3 | **P0-PUB** | Guest donation record resolves to its acceptance row after clearing storage and changing device | **Not started** |
| **CH-15** | **Render and serve the current v3.0 legal source in a display-ready form.** Replace the product's draft stub with accessible HTML and provide the matching formal PDF as the durable document | Users must see and accept the exact current wording in a readable, formal format rather than raw Markdown or a stub | ToS 2.2 | **P0-PUB** | Rendered HTML and PDF preserve the substantive v3.0 wording; the product serves the exact release-authorised HTML bytes and provides the matching PDF; both hashes are recorded in `legal/live-terms/` | **Not started** |
| **CH-16** | **Extend the donation receipt** to include the donation identifier, the fee breakdown, the amount expected to reach the campaign, and the applicable document versions with permanent links | It currently contains only campaign title, amount and currency. ToS 2.4 and Donor 7.1 require considerably more | ToS 2.4; Donor 7.1 | **P0-PUB** | Sample email contains every required field | **Not started** |
| **CH-17** | **Show a user, in their account, what they have accepted and when.** The rows exist but are surfaced nowhere | ToS 2.4 states the accepted version remains available from your account | ToS 2.4 | **P0-PUB** | Account page lists documents, versions and dates | **Not started** |
| **CH-18** | **Build one configurable live-document registry and resolver.** Its handoff source is `legal/live-terms/`; it must map each release-authorised document ID to its version, stable HTML route, PDF download, source hash and separate artifact hashes. Fail closed when any document required by the Acceptance Matrix is missing or mismatched; never fall back to raw Markdown or the draft stub | Separates canonical legal wording from the exact display artifacts while preserving verifiable acceptance evidence | ToS 2.2–2.3; Acceptance Matrix | F50, F59 | **P0-PUB** | Tests prove missing, unknown and hash-mismatched artifacts block the affected event; one fixture resolves consistently in UI, record, receipt, PDF download and historical route | Registry export; negative tests; route test | **Not started** |

### J7. Enforcement, security and monitoring

| ID | Requirement | Reason | Clause | Priority | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| **SU-01** | **Build account suspension and restriction.** There is **no user-level suspend or ban concept in the schema at all**; the only options are delete or leave alone | ToS 22.1, CG 3.3 and CG 6.3(d) all describe suspension, restriction and bans as available responses. Proportionate enforcement is impossible when the only tool is deletion | ToS 22.1; CG 3.3 | **P0** | Suspend, restrict commenting, and restore, each logged | **Not started** |
| **AU-01** | **Audit-log the actions that are currently unlogged**: refund decisions, role changes, account deletion, and campaign rejection and takedown | Refund decisions and role changes are the two highest-impact administrative actions on the Platform, and neither leaves a trace. CG 8.8 promises a complete action log | CG 8.8 | **P0** | Each action produces an audit entry | **Not started** |
| **AU-02** | **Build an export and query route for the audit log.** It is currently write-only from the application's perspective and can only be read row by row in the database console | An audit log that cannot be produced is not evidence | CG 8.8 | **P1** | CSV export of a date range | **Not started** |
| **AL-01** | **Add alerting for: a dispute being opened; a failed scheduled job; repeated authentication failures; and production errors.** There is **no monitoring or alerting of any kind today** — a dispute is discoverable only by someone manually checking | The Incident Response Plan assumes a human becomes aware of an incident. Nothing makes that happen. An incident plan with no detection never triggers | IRP §5 | **P0** | Each alert fires to a named recipient in test | **Not started** |
| **AL-02** | **Add malware and image-safety scanning to uploads.** There is **none** on any path, including identity documents and campaign media | ToS 19.4(d) states that Dono applies scanning where it is shown in the service. The media features must not be enabled before it exists | ToS 19.4(d) | **P1** — before the relevant media feature is enabled | Known-bad test file rejected | **Not started** |
| **SE-09** | **Confirm `DEMO_OPEN_ADMIN` is not set on any deployment holding real data**, and remove the client-side host-based branch | The server gate is sound for production, but a non-production deployment with the flag set grants **full unauthenticated administrative access**. Preview builds pointed at a shared deployment would be exposed | Privacy 14.2 | **P0** | Written confirmation per deployment | **Not started** |
| **SE-10** | **Document who holds production access** to the database, hosting, payments, email and analytics consoles, and **write a credential rotation and revocation procedure** | SE-01 and SE-04 require an access inventory and an offboarding procedure. Neither exists, and there is no rotation runbook to execute during an incident | Privacy 14.2 | **P0** | Inventory and procedure on file | **Not started** |

### J8. Data protection operations

| ID | Requirement | Reason | Clause | Priority | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| **PR-09** | **Account deletion must not strand an obligation.** Today deletion severs sign-in immediately, with no re-authentication, no confirmation, no cooling-off and no audit entry — **so a campaign owner with an approved refund outstanding can no longer sign in to execute it** | Privacy 13.3B and ToS 31.2(g). The refund mandate mitigates this, but the user should be warned and the event should be logged | Privacy 13.3B; ToS 31.2(g) | **P0** | Deletion warns on outstanding obligations, requires confirmation, and is audit-logged | **Not started** |
| **PR-10** | **Confirm the database provider's backup retention, restore behaviour and whether deletion propagates to backups.** Nothing about backups is configured, referenced or documented anywhere | Privacy 7.1 states backups are a rolling 30–35 days. **That figure is currently unverified**, and it determines whether deleted data is actually gone | Privacy 7.1 | **P0-PUB** | Written confirmation from the provider on file | **Not started** |
| **PR-11** | **Build a user data-export route** covering account data, donation history, acceptances and submitted evidence | Privacy 13.2 offers portability; ToS 31.2(f) offers a 30-day evidence download; the Wind-Down Plan assumes an export route. None exists | Privacy 13.2; ToS 31.2(f) | **P0** | Export produces a usable file | **Not started** |
| **CK-07** | **Set the analytics project's own session-replay setting to off.** The client disables replay, but **the project still has recording enabled** | Both the Cookie Notice and the DPIA state that session replay is off. Relying on a client setting while the server-side project permits it is fragile, and the mismatch would be visible to a regulator | Cookie 3.2 | **P0-PUB** | Project setting shows disabled | **Not started** |
| **CK-08** | **Set analytics event retention to 12 months and enable enforcement.** Retention is currently set to 12 months but **enforcement is switched off**, so nothing is actually deleted | Cookie 3.5 and Privacy 7.1 now state 12 months. Without enforcement that statement is untrue | Cookie 3.5; Privacy 7.1 | **P0-PUB** | Enforcement enabled; deletion observed | **Not started** |
| **VN-04** | **Model the support mailbox provider as a processor** and record it in the DPA Register, or move support to a provider already covered | The single public support address receives complaints, rights requests, reports and legal notices, and the provider is not in the register at all | Privacy 8.1 | **P0-PUB** | Register row complete | **Not started** |
| **DP-05** | **Confirm the process for a rights request end to end**, including identity verification and the one-month clock. There is no intake, tracking or export today | Privacy 13.2–13.3 | Privacy 13.3 | **P0** | One test case completed and documented | **Not started** |

### J9. Governance and release control

| ID | Requirement | Reason | Clause | Priority | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| **GV-09** | **Add code ownership and required review on the files that carry legal effect** — the legal text, the document-version constants, the fee calculation and the payment configuration. There is **no continuous-integration configuration, no code-owners file and no branch protection** anywhere in the project | **Anyone with commit access can change legal copy, a version string or a feature flag and ship it.** Bumping the version constant invalidates every prior acceptance and forces global re-acceptance — a one-line change with contractual effect, gated by nothing | ToS 30; Team Agreement 6.2 | **P0** | Merge to a listed path requires review by a named owner | **Not started** |
| **GV-10** | **Name an engineering release owner and a backup, and adopt a sign-off statement** that pins the deployment name, the payment account and mode, and the commit identifier | No such role exists, there are no version tags, and the project version has never been incremented. "Truth at release" cannot be asserted against an unidentifiable state | TRUTH.md Release Control Matrix | **P0** | Role assigned; statement template agreed; first sign-off recorded | **Not started** |
| **GV-11** | **Record the contributor and access position.** The legally accountable person holds roughly 4% of commits, and several contributors have no executed agreement | Reinforces GV-01. Ownership of the code and brand is uncertain until the Team and Contributor Agreement is executed by everyone who has contributed | Team Agreement 2 | **P0** | Every contributor identified and covered | **Not started** |

---

## Confirmed as already working (evidence dated 5 August 2026)

Recorded so nobody rebuilds them, and so the legal drafting can rely on them:

- **Analytics consent is genuinely gated.** The analytics provider is not loaded, and nothing is sent, unless consent is granted. The banner offers equally prominent Accept and Reject. Session replay is off in the client, IP is anonymised at ingest, authentication fields are excluded from capture, there is no identify call, and there are no advertising pixels, third-party integrations or data exports.
- **Payment storage is not set on page load** — only when a payment or identity flow is opened.
- **Direct charges are correctly configured**: fees payable by the connected account, losses collected by the Payment Provider, full dashboard access, no destination charges. This matches ToS 15.6 exactly.
- **Dono cannot pause payouts** under the live liability model — ToS 15.7 is accurate.
- **Dono can technically instruct a refund on a connected account**, which confirms the refund mandate in ToS 13.2 is implementable.
- **The application-fee refund calculation is cumulative and proportional**, with duplicate-refund guards and webhook idempotency.
- **Every campaign, including its images, documents, video and links, is reviewed by a person before publication.**
- **Comments are restricted to approved members of the owning society**, which materially narrows the online-safety surface.
- **Campaign updates work**, with a reconciliation note where spend is less than raised, opt-in donor emails, per-send idempotency and signed-token unsubscribe.
- **Administrators are blocked from donating.**
- **Secrets are correctly scoped** — no secret appears in the client bundle, in logs or in version control.
- **The audit log cannot be altered or deleted through any application code path.**
- **Role-specific document requirements are correct and enforced server-side** for each action.
- **Campaign-level recurring donations were correctly removed at the API boundary** — the pattern CF-01 and CR-01a should follow.
- **An unincorporated society can complete payment onboarding**, with the treasurer or principal officer onboarding as a sole trader. This closes register item U3.

---

## Summary by band

**Do first, before anything else:** **CF-01, CF-02** — remove the unused platform-account payment path. Then **PF-12, PF-13** — remove the unused donor-facing card-dependent charge and display-versus-charge mismatch. Zero payments mean there is no historic customer-remediation population; these remain absolute gates before the first live payment.

**P0 — launch blockers (real users, real money, real personal data):** CF-01 to CF-03; PF-00 to PF-08, PF-10, PF-12 to PF-15; RF-01 to RF-10; CH-00 to CH-18; EL-01 to EL-03, EL-05 to EL-08; CR-00 to CR-06, CR-08 to CR-10, CR-01a, CR-02a; AG-01 to AG-05; OS-01 to OS-11, OS-15, OS-17 to OS-22; EV-01 to EV-12; PR-01 to PR-04, PR-09 to PR-11; CK-01 to CK-08; RC-01 to RC-04; DP-01 to DP-05; VN-01 to VN-04; SE-01 to SE-05, SE-09, SE-10; AU-01; AL-01; SU-01; GV-01 to GV-07, GV-09 to GV-11; FC-01 to FC-05; GS-01, GS-02; RM-01.

**P1 — required before the specific feature is enabled:** EL-04 (reverification), EL-09 (single identity flag); CR-07 (split-role campaigns); OS-12 (video), OS-13 (external links), OS-14 (avatars); PR-05 (legal hold), PR-06 (inactive accounts); SE-07 (MFA); AU-02 (audit-log export); AL-02 (upload scanning); PF-16 (application-fee race); GV-08; FC-06; IR-01 to IR-03; GS-03.

**P2 — shortly after launch:** PF-09; OS-16; SE-06; IR-04.

**P3 — future maturity:** PF-11 (VAT tooling at £60,000–£70,000 rolling turnover); SE-08 (device management, immutable audit logging, ISO-style governance).

**Deliberately not built for beta:** a bespoke data-protection complaints portal; a ticketing system or category-specific inboxes; multi-inbox support infrastructure; 24/7 moderation coverage; external moderation services; pre-moderation of all comments; automated moderation decision-making; enterprise fraud tooling; geoblocking beyond legal and payment-provider requirements.

---

## Approval and version control

| Field | Entry |
|---|---|
| Document | Engineering and Operations Implementation Checklist |
| Version | 2.3 |
| Version date | 6 August 2026 |
| Accountable owner | Amrit Kaur Rooprai |
| Engineering owner | *(to be named)* |
| Review cadence | Weekly until launch |
| Related | `TRUTH.md` Release Control Matrix; `UNRESOLVED_QUESTIONS_REGISTER_v2.3.md`; `00_v2.3_change_log.md` |
