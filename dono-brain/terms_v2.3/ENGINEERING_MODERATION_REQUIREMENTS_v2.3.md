> ## v2.3 AMENDMENT BLOCK — READ FIRST
>
> **Version 2.3 — 6 August 2026.** Carried forward from v2.2 and amended below. **Where the body conflicts with this block, this block prevails.**
>
> 1. **The authoritative, prioritised build list is now [`ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md`](ENGINEERING_IMPLEMENTATION_CHECKLIST_v2.3.md).** This document remains the *detailed moderation specification*; the checklist governs priority, sequencing, acceptance criteria, evidence and launch state. Where the two disagree on priority or launch gating, **the checklist governs**.
> 2. **Section references to the Appropriate Policy Document and the Financial Crime policy are re-pointed** at `dono-appropriate-policy-document-v2.3.md` and `dono-financial-crime-sanctions-policy-v2.3.md`.
> 3. **Moderation model changes to reflect (see Community Guidelines v2.3 clause 6.3 and the Online Safety Procedures v2.3 amendment block):** keyword and pattern filtering **before** publication; immediate publication of what passes; post-moderation; a report control on **every** item of user-generated content; a **logged-out** reporting route; automatic case creation; one-click hide, remove, restrict commenting and suspend; repeat-offender thresholds; rate limiting; and a complete action and decision log.
> 4. **Appeal independence is a hard system requirement**: role-based permissions **MUST** prevent a moderator from being assigned an appeal against their own decision. Where only one moderator is available, the case is escalated to another authorised founder. There is no self-review path.
> 5. **Comments are plain text.** Links, URLs, images and attachments **MUST** be rejected **server-side**, not only in the client.
> 6. **Rich media is retained with controls rather than disabled:** campaign video — direct upload, scan, full manual review before publication, re-review after any change, moderator records full review; external links — HTTPS only, approved destination stored, re-review on edit, periodic redirect and destination checking, immediate disable; avatars — automated image-safety scanning, moderator removal, re-review after change.
> 7. **CSEA requirements are superseded by `dono-csea-reporting-procedure-v2.3.md`**, including restricted storage, hide-in-place, authorised reporters and the two retention clocks (report reference 5 years; content and prescribed information 1 year).
> 8. **Moderation record retention is risk-based** (Privacy Notice v2.3 clause 7.1), not a flat six years.
> 9. **Remove every requirement relating to student-card handling, recurring donations, matched funding and public verification badges.** None of those features exists in v2.3.
> 10. **Release gating:** no user-generated-content feature may be enabled unless its Release Control Matrix entry in `TRUTH.md` is `Ready` and the eight acceptance tests have passed with dated evidence and a named approver.

---

# Dono Engineering Requirements Specification — Moderation, Complaints and Online Safety

**Version:** 1.0 — 6 August 2026  
**Status:** Authoritative implementation blueprint for the production baseline  
**Policy owner:** Online Safety lead  
**Engineering owner:** Engineering lead  

This specification converts every operational capability in the Community Guidelines, Online Safety Act Procedures, Complaints Policy, Illegal-Content Risk Assessment, Children's Risk Assessment, Terms of Service moderation clauses, Data Protection Complaints Workflow and Incident Response Plan into buildable and testable features. Policy is authoritative about required outcomes. This specification is authoritative about the implementation contract.

## 1. Shared implementation rules

- The Expo Router application exposes public and authenticated routes using React Native primitives. All privileged operations are Convex functions with server-side authorisation; hiding a control in the client is never an access control.
- All timestamps are UTC and all externally visible records use opaque, non-sequential references. User-supplied text is length-limited, normalised and safely rendered.
- `policyVersion`, `reasonCode`, human-readable reasons and actor identity are mandatory on every decision or sanction.
- Audit events are append-only. Corrections create a new event and never overwrite history. Audit exports are integrity-verifiable and access to them is itself audited.
- Content deletion removes public access but preserves the minimum private evidence required for the case, appeal, legal obligation or hold. Restricted CSEA evidence uses separate storage and access rules.
- Email failures, notification failures and analytics failures do not roll back a safety action. They create retryable delivery records and alerts.
- Automated signals can rank or route cases. They do not make a final illegality decision, remove content or sanction a user without a recorded human decision, except for an emergency temporary restriction followed by prompt human review.
- Production launch requires every P0 acceptance test to pass in an environment using production-equivalent permissions, jobs, storage and notification configuration.

## 2. Roles and default ownership

| Role | Scope |
|---|---|
| Visitor | Submit a logged-out or anonymous report; track a case only through a secure token |
| User | Report content; view own submissions and notices; appeal eligible decisions |
| Moderator | Review assigned ordinary cases; preserve evidence; issue warnings; restrict and restore content within granted scope |
| Senior Moderator | Suspend accounts, impose bans, decide Priority 2 cases, approve sensitive disclosures |
| Online Safety Lead | Priority 1 owner; CSEA and external referral authority; policy owner; final escalation |
| Appeal Reviewer | Review a case only when not substantially involved in the original decision |
| Data Protection Lead | Access and decide data-protection complaints and related exports |
| Incident Lead | Exercise emergency containment powers under the Incident Response Plan |
| Role Administrator | Grant and revoke roles; cannot grant their own role or approve their own elevation |
| Auditor / Compliance Viewer | Read-only access to permitted cases, audit evidence and aggregate reports |
| Engineering Service | Run notifications, retention, risk-signal and reporting jobs through scoped service identities |

Engineering owners in this document are accountable roles, not necessarily individual employees: **Product Engineering**, **Trust & Safety Engineering**, **Platform/Security**, **Data/Compliance**, and **Moderation Operations**.

## 3. Feature specifications

### MOD-001 — Report a campaign

- **Description:** A report control on every campaign page creates a case against the exact campaign version visible to the reporter.
- **Legal/policy requirement:** Community Guidelines 7.1–7.4; Terms 18.2; Illegal-Content Risk Assessment 8.4.
- **User stories:** As a visitor or user, I can report a campaign without deciding whether an offence occurred; as a moderator, I can review the campaign state the reporter saw.
- **Functional requirements:** Control is visible on public and preview pages; preselects campaign target; accepts category, concern, affected-person flag and optional contact; prevents duplicate client submission; returns a reference.
- **Admin/moderator requirements:** Case shows campaign owner, status, donations-open state, current and reported versions, prior cases and linked accounts.
- **Required permissions:** Anyone can create; reporter can read only with authenticated ownership or secure tracking token; moderation roles can read assigned/permitted cases.
- **Database/storage:** `reports`, `moderationCases`, `caseTargets`, immutable `contentSnapshots`; target type `campaign`, target ID, version ID and URL.
- **Audit logging:** Intake route, target resolution, reporter authentication state, snapshot hash and case creation.
- **Notifications:** Receipt where contact exists; urgent alert if category or answers produce P1; case-outcome notice subject to safety/legal limits.
- **Edge cases:** Deleted/private campaign, invalid URL, campaign changes during submission, anonymous report, repeated report campaign, reporter is owner.
- **Acceptance criteria:** **AT-MOD-001:** logged-in and logged-out reports resolve the correct campaign version, create one case per submission, preserve distinct reporters, return a reference and enter the correct queue.
- **Launch criticality / owner:** **P0 — Trust & Safety Engineering.**
- **Implementation checklist:** [ ] all campaign states expose control; [ ] server resolves target; [ ] snapshot stored; [ ] rate limit; [ ] accessibility labels; [ ] receipt/outcome tests; [ ] anonymous test; [ ] deleted-target test.

### MOD-002 — Report a campaign update

- **Description:** Each campaign update has its own report control and evidence snapshot.
- **Legal/policy requirement:** Community Guidelines 7.1; Children's Risk Assessment 1 and 4; Online Safety Procedures production control 1.
- **User stories:** As a viewer, I can identify the harmful update rather than reporting the whole campaign; as a moderator, I can restrict one update or escalate to the campaign.
- **Functional requirements:** Control binds to update ID and version; parent campaign is linked; update remains identifiable after edit or deletion.
- **Admin/moderator requirements:** Show update history, campaign context, author, prior reports and actions for both update and campaign.
- **Required permissions:** Same as MOD-001; moderator action scope supports update-only or campaign-wide action.
- **Database/storage:** `campaignUpdates`, version/snapshot record, case target type `campaign_update`, parent relation.
- **Audit logging:** Update version reported, parent linkage, scope of any action.
- **Notifications:** Same receipt/outcome rules as MOD-001; notify campaign owner when lawful and safe.
- **Edge cases:** Update edited or deleted after report; report on scheduled/draft update; update contains embedded media.
- **Acceptance criteria:** **AT-MOD-002:** a report preserves the reported update version and moderators can restrict/restore the update without changing unrelated campaign content.
- **Launch criticality / owner:** **P0 — Trust & Safety Engineering.**
- **Implementation checklist:** [ ] update control; [ ] version snapshot; [ ] parent context; [ ] scoped restriction; [ ] restoration; [ ] edit/delete race test.

### MOD-003 — Report a comment

- **Description:** Every public comment exposes reporting tied to the exact comment version.
- **Legal/policy requirement:** Community Guidelines 6–7; Children's Risk Assessment 4 and 6; Online Safety Procedures 3.2.
- **User stories:** As any viewer, including a child or logged-out visitor, I can report a comment; as a moderator, I can hide it immediately and review author patterns.
- **Functional requirements:** One-action entry from comment; target/version auto-filled; categories include threats, hate, self-harm, CSEA, privacy and child harm; no harmful text needs to be recopied.
- **Admin/moderator requirements:** Show edit history, campaign context, author history, rate-limit signals and nearby comments without exposing unrelated private data.
- **Required permissions:** Anyone can report; Moderator can hide/restore; Senior Moderator required for account suspension or ban.
- **Database/storage:** Comment version snapshot, author and campaign references, case target type `comment`.
- **Audit logging:** Snapshot, context viewed, hide/restore action and reason.
- **Notifications:** Receipt; urgent alerts; author decision notice when safe; reporter outcome where contact exists.
- **Edge cases:** Owner deleted comment, comment edited during report, Unicode obfuscation, mass-reporting campaign, reporter is minor/anonymous.
- **Acceptance criteria:** **AT-MOD-003:** each comment is reportable logged out; the reported version survives edit/deletion; authorised moderators can hide and restore it with complete audit events.
- **Launch criticality / owner:** **P0 — Trust & Safety Engineering.**
- **Implementation checklist:** [ ] control on all render paths; [ ] snapshot/edit history; [ ] urgent routing; [ ] hide/restore; [ ] author history; [ ] accessibility and mobile/web tests.

### MOD-004 — Report a user or username

- **Description:** Users and visitors can report a displayed username or account-level conduct.
- **Legal/policy requirement:** Community Guidelines 1.1, 3, 7.1; Terms 22; Illegal-Content Risk Assessment 8.4.
- **User stories:** As a viewer, I can report impersonation, abusive identity or ban evasion; as a moderator, I can assess account-level patterns.
- **Functional requirements:** Control appears wherever username/avatar is shown; accepts account-level reason and optional related-content links; preserves displayed username/avatar snapshot.
- **Admin/moderator requirements:** Show sanctions, linked accounts, content history and prior reports using least-privilege data presentation.
- **Required permissions:** Anyone creates; Senior Moderator sanctions account; identity-data access remains separately restricted.
- **Database/storage:** Case target `user`; username/avatar snapshot; linkage signals stored separately from verification documents.
- **Audit logging:** Account graph access, linkage reason, sanction decision.
- **Notifications:** Receipt; account notice unless prohibited or unsafe.
- **Edge cases:** Renamed/deleted user, compromised account, shared device false positive, report based only on off-platform conduct.
- **Acceptance criteria:** **AT-MOD-004:** a report preserves the displayed identity and exposes account history only to authorised roles; rename or deletion does not orphan the case.
- **Launch criticality / owner:** **P0 — Trust & Safety Engineering.**
- **Implementation checklist:** [ ] controls on username/avatar surfaces; [ ] identity snapshot; [ ] account target; [ ] sanctions link; [ ] least-privilege test; [ ] rename/delete test.

### MOD-005 — Report campaign media and documents

- **Description:** Each campaign image, video and uploaded document has an adjacent report control.
- **Legal/policy requirement:** Community Guidelines 7.1; Illegal-Content Risk Assessment 1, 5 and 8.4; CSEA procedure 3.4.
- **User stories:** As a viewer, I can report the exact file without downloading it; as a specialist moderator, I can quarantine it safely.
- **Functional requirements:** Target file ID/version auto-filled; form warns not to copy CSEA material; server quarantines P1 files without client re-fetch; media remains reportable through accessible labels.
- **Admin/moderator requirements:** Safe preview rules, quarantine state, hash/metadata where already available, parent context and restricted CSEA mode.
- **Required permissions:** Ordinary moderators cannot open restricted CSEA evidence; only trained authorised roles can access it.
- **Database/storage:** File metadata, secure object reference, content hash where available, quarantine flag and snapshot; no personal-device copy path.
- **Audit logging:** Every preview, download-equivalent access, quarantine, hash read and deletion/hold.
- **Notifications:** P1 specialist alerts omit illegal media; ordinary case notices reference IDs only.
- **Edge cases:** Broken file, malware, encrypted document, very large video, external embed, media deleted after report.
- **Acceptance criteria:** **AT-MOD-005:** each file is separately reportable; P1 quarantine prevents public and ordinary moderator access while preserving system-held evidence and logging every specialist access.
- **Launch criticality / owner:** **P0 — Platform/Security.**
- **Implementation checklist:** [ ] adjacent controls; [ ] file/version IDs; [ ] quarantine; [ ] restricted preview; [ ] metadata/hash; [ ] access audit; [ ] CSEA exercise.

### MOD-006 — Logged-out and anonymous reporting route

- **Description:** `/report` works without authentication and permits optional reporter identity.
- **Legal/policy requirement:** Community Guidelines 1.2, 7.2; Online Safety Procedures 3.5; Illegal-Content Risk Assessment 8.4.
- **User stories:** As an affected non-user or child, I can report content; as operations, I can process anonymous reports without losing abuse controls.
- **Functional requirements:** Accept direct URL or content ID; resolve target; optional email; privacy notice; bot/rate protections; safe confirmation page; secure tracking token only when contact/update tracking is requested.
- **Admin/moderator requirements:** Clearly label unauthenticated/anonymous source without downgrading it; show abuse signals separately from merits.
- **Required permissions:** Public create only; no public list/read; secure token scoped to one case and revocable.
- **Database/storage:** Reporter identity nullable; hashed network/risk metadata retained only under policy; consent/notice version.
- **Audit logging:** Route, target resolution, anti-abuse decision and token issuance; never log sensitive free text in infrastructure logs.
- **Notifications:** Receipt and tracking link when email supplied; no notification when anonymous.
- **Edge cases:** Invalid/foreign URL, no longer available content, malicious payload, high-volume attacker, shared IP, reporter under 18.
- **Acceptance criteria:** **AT-MOD-006:** a clean browser can submit valid and anonymous reports without login; no case data is enumerable; anti-abuse controls do not silently discard a report.
- **Launch criticality / owner:** **P0 — Product Engineering.**
- **Implementation checklist:** [ ] route; [ ] resolver; [ ] optional identity; [ ] bot/rate control; [ ] secure token; [ ] privacy copy; [ ] non-enumeration test; [ ] child-accessibility test.

### MOD-007 — Report intake, acknowledgement and deduplication

- **Description:** In-product, public-form and email reports create consistent cases while preserving each reporter's rights.
- **Legal/policy requirement:** Community Guidelines 7.4, 8.7; Complaints Policy 1.2; Online Safety Procedures 3.2.
- **User stories:** As a reporter, I receive a reference; as a moderator, I see related reports together; as compliance, I can count each report accurately.
- **Functional requirements:** Generate reference; normalise category; link probable duplicates without merging reporter records; calculate acknowledgement target; support manual email intake; never suppress P1 duplicates.
- **Admin/moderator requirements:** Merge/link/split controls with reasons; identify reporting campaigns without treating a rejected report as abusive.
- **Required permissions:** Intake service creates; Moderator links; Senior Moderator merges/splits; reporter cannot see other reporters.
- **Database/storage:** Separate `reports` and `moderationCases`; many reports per case; delivery and SLA fields.
- **Audit logging:** Original payload hash, routing, link/merge/split and clock changes.
- **Notifications:** Immediate receipt where possible; five-Working-Day acknowledgement maximum for Online Safety cases.
- **Edge cases:** Same content/different harms, one report targets multiple items, repeat submissions, email threading, clock timezone/holiday changes.
- **Acceptance criteria:** **AT-MOD-007:** duplicates can share a case while each report retains its own reference, reporter visibility, acknowledgement and outcome record.
- **Launch criticality / owner:** **P0 — Trust & Safety Engineering.**
- **Implementation checklist:** [ ] channel adapters; [ ] reference generator; [ ] report/case separation; [ ] business-day clock; [ ] link/split; [ ] reporter isolation; [ ] SLA test.

### MOD-008 — Moderator dashboard

- **Description:** A role-gated dashboard is the operational entry point for cases, alerts, workload and compliance status.
- **Legal/policy requirement:** Online Safety Procedures 3.1–3.2 and Records; Illegal-Content Risk Assessment 8.1; Complaints Policy 7.
- **User stories:** As a moderator, I see work requiring action; as lead, I see overdue/P1 cases and control failures; as auditor, I have read-only evidence.
- **Functional requirements:** Responsive queue summary, urgent banner, assigned work, SLA clocks, case search, alerts, permission-aware counts and service status.
- **Admin/moderator requirements:** Bulk assignment is allowed; bulk final decisions/sanctions are prohibited; dashboard exposes conflicts and restricted-case markers.
- **Required permissions:** Server-filtered by role, assignment and restricted classification; no client-side-only filtering.
- **Database/storage:** Materialised/queried queue views derived from canonical cases; no duplicate decision store.
- **Audit logging:** Dashboard access, exports and restricted filters; ordinary list rendering may be aggregated to avoid noisy per-row events.
- **Notifications:** In-app urgent alerts and assignment changes; external alert fallback for P1.
- **Edge cases:** Zero cases, thousands of cases, stale browser, revoked role, partial outage, P1 created while viewing.
- **Acceptance criteria:** **AT-MOD-008:** each role sees only permitted cases and counts; P1 appears without refresh within the realtime target; revoked access fails on the next server request.
- **Launch criticality / owner:** **P0 — Product Engineering.**
- **Implementation checklist:** [ ] role views; [ ] realtime P1; [ ] SLA clocks; [ ] assignment/search; [ ] empty/error states; [ ] responsive/a11y; [ ] permission revocation test.

### MOD-009 — Moderation queues, triage and priority levels

- **Description:** Cases enter P1, P2 or P3 queues through deterministic rules plus human override.
- **Legal/policy requirement:** Online Safety Procedures 3.2; Illegal-Content Risk Assessment 8.5; Children's Risk Assessment 8.
- **User stories:** As a reporter, urgent risk is handled immediately; as a moderator, I know why a case is prioritised; as lead, I can rebalance work.
- **Functional requirements:** P1 immediate alert/restriction workflow; P2 24-hour target; P3 three-Working-Day target; child-harm fast track; priority rationale; clock pause rules; escalation/de-escalation.
- **Admin/moderator requirements:** Human override requires reason; P1 cannot be closed without Senior Moderator/lead review; queue health and staffing view.
- **Required permissions:** Moderator triages P2/P3; Senior Moderator changes P1 or closes escalated cases; service may only raise priority automatically.
- **Database/storage:** Priority history, target timestamps, pause periods, rule version and rationale.
- **Audit logging:** Every priority/clock change and alert acknowledgement.
- **Notifications:** P1 alerts Online Safety lead and backup through two channels; assignment/escalation alerts assignee.
- **Edge cases:** Conflicting categories, duplicate P1, false urgent selection, lead unavailable, outage, daylight-saving/business-day boundary.
- **Acceptance criteria:** **AT-MOD-009:** seeded cases route to expected priority; P1 alerts and temporary restriction execute immediately; every override is attributable and historical SLA remains calculable.
- **Launch criticality / owner:** **P0 — Trust & Safety Engineering.**
- **Implementation checklist:** [ ] rules table/version; [ ] clocks; [ ] P1 alerts; [ ] child fast track; [ ] override; [ ] pause policy; [ ] SLA tests; [ ] outage fallback.

### MOD-010 — Moderation case management

- **Description:** A canonical case coordinates targets, reports, evidence, assignments, actions, decisions, notices, referrals and appeals.
- **Legal/policy requirement:** Community Guidelines 7.4 and 8.7; Online Safety Procedures 3.2 and Records; Terms 23.6.
- **User stories:** As a moderator, I can understand and progress a case; as compliance, I can reconstruct it; as a user, related decisions are not contradictory.
- **Functional requirements:** State machine: new, triaged, restricted, investigating, awaiting_information, decision_pending, decided, appealed, closed, retained, deleted; linked cases; tasks; deadlines; safe concurrent editing.
- **Admin/moderator requirements:** Case owner, collaborators, recusal, supervisor review, reopen with reason; no hard delete by moderators.
- **Required permissions:** Object/classification/action scoped; appeal reviewer separation enforced by server.
- **Database/storage:** Canonical case, status history, targets, parties, tasks, links and version number for optimistic concurrency.
- **Audit logging:** All state transitions, reads of restricted cases, exports and denied privileged actions.
- **Notifications:** State-driven notices and internal tasks; suppress/limit with recorded legal or safety reason.
- **Edge cases:** Multiple targets/users, simultaneous moderators, target deletion, withdrawn report, reporter anonymity, merged/split cases.
- **Acceptance criteria:** **AT-MOD-010:** an end-to-end case can be reconstructed from intake through appeal and restoration; invalid transitions and conflicted updates are rejected server-side.
- **Launch criticality / owner:** **P0 — Trust & Safety Engineering.**
- **Implementation checklist:** [ ] state machine; [ ] concurrency; [ ] links/tasks; [ ] reopen; [ ] restricted access; [ ] transition tests; [ ] reconstruction export.

### MOD-011 — Evidence preservation, quarantine and legal hold

- **Description:** Cases preserve the minimum evidence needed without keeping unlawful material broadly accessible.
- **Legal/policy requirement:** Terms 23.6; Online Safety Procedures 3.4; Incident Response Plan 4 and Annex B; data-minimisation duties.
- **User stories:** As a moderator, I can rely on a stable snapshot; as a specialist, I can quarantine sensitive files; as compliance, I can apply and release a legal hold.
- **Functional requirements:** Snapshot text and metadata; secure object copy/reference; quarantine; content hash where available; legal hold with authority, reason, scope and expiry/review; deletion schedule recalculation.
- **Admin/moderator requirements:** Ordinary evidence access, restricted evidence access, specialist CSEA access and legal-hold administration are separate capabilities.
- **Required permissions:** Least privilege; no public URLs; short-lived signed access; CSEA evidence limited to named trained roles.
- **Database/storage:** Encrypted evidence objects, metadata table, classification, hash, source, retention date, hold records and deletion proof.
- **Audit logging:** Every view, signed-access grant, export, hold, release, deletion and denied attempt.
- **Notifications:** Alert specialist roles on quarantine; notify record owner on hold expiry/review; never attach restricted evidence to a notification.
- **Edge cases:** Missing source, corrupted/oversized file, duplicate hash, lawful authority extends hold, appeal after scheduled deletion, backup copies.
- **Acceptance criteria:** **AT-MOD-011:** removal does not destroy required evidence; unauthorised roles cannot access restricted objects; hold blocks deletion; release causes scheduled deletion and proof.
- **Launch criticality / owner:** **P0 — Platform/Security.**
- **Implementation checklist:** [ ] encryption; [ ] snapshots; [ ] quarantine; [ ] signed access; [ ] classification; [ ] holds; [ ] deletion proof; [ ] backup lifecycle; [ ] access tests.

### MOD-012 — Moderation notes, tasks and assignments

- **Description:** Moderators record factual notes, assign ownership and track tasks without silently editing history.
- **Legal/policy requirement:** Community Guidelines 8.7; Complaints Policy 4 and 7; Online Safety Procedures 3.1–3.2.
- **User stories:** As a moderator, I can hand off work; as a lead, I can balance workloads; as an appeal reviewer, I can distinguish evidence from internal opinion.
- **Functional requirements:** Append-only notes with type (evidence, analysis, contact, handoff); edit through correction event; assignee and due date; watcher; task completion; mention controls.
- **Admin/moderator requirements:** Lead reassigns and reviews workload; conflicts trigger recusal; private legal-advice notes are separately classified.
- **Required permissions:** Assigned collaborators write; auditors read permitted notes; users/reporters never see internal notes unless disclosure is lawfully approved.
- **Database/storage:** Notes, correction links, tasks, assignment history, classifications.
- **Audit logging:** Create/correct/read restricted note, assignment and task transition.
- **Notifications:** Assignment, mention, due/overdue and recusal alerts without sensitive note content.
- **Edge cases:** Assignee leaves, duplicate assignment, timezone deadline, accidental sensitive data, simultaneous correction.
- **Acceptance criteria:** **AT-MOD-012:** original note remains recoverable after correction; assignment history is complete; revoked staff lose access immediately; overdue tasks surface on dashboard.
- **Launch criticality / owner:** **P0 — Product Engineering.**
- **Implementation checklist:** [ ] typed notes; [ ] correction events; [ ] assignments/history; [ ] tasks/dates; [ ] recusal; [ ] notification redaction; [ ] leaver test.

### MOD-013 — Illegal-content decision workflow

- **Description:** A guided human workflow covers every priority illegal-content category and the alternative policy-breach ground.
- **Legal/policy requirement:** Community Guidelines 3 and 7.4; Terms 18.2; Illegal-Content Risk Assessment 5 and 8.5.
- **User stories:** As a moderator, I can act without deciding criminal liability; as compliance, I can show the ground and reasoning used.
- **Functional requirements:** Decision guide by harm category; conclusion options `reasonable_grounds_illegal`, `policy_breach`, `no_breach`, `insufficient_information`; proportionality and freedom-of-expression checks; connected-content prompt; mandatory reason and policy version.
- **Admin/moderator requirements:** Senior review for P1 and specified high-impact actions; policy owner versions the guide and samples decisions.
- **Required permissions:** Trained Moderator decides P2/P3 within scope; Senior Moderator/Online Safety Lead decides P1 and external referral.
- **Database/storage:** Decision record, categories, guide version, evidence references, factors, outcome, reviewer approval.
- **Audit logging:** Guide opened/version, draft/final decision, approval and correction.
- **Notifications:** Feed decision-recording notices; legal/safety suppression requires reason.
- **Edge cases:** Multiple harms, legality uncertain, satire/journalism, context outside Dono, changed law/policy, insufficient evidence.
- **Acceptance criteria:** **AT-MOD-013:** a moderator can reach each permitted conclusion; no action decision saves without reasons and evidence; P1 finalisation requires authorised review.
- **Launch criticality / owner:** **P0 — Trust & Safety Engineering / Online Safety Lead.**
- **Implementation checklist:** [ ] all harm categories; [ ] alternative policy ground; [ ] proportionality/free-expression fields; [ ] guide versioning; [ ] approvals; [ ] sample-quality report.

### MOD-014 — Child-safety workflow

- **Description:** Reports involving a child, child-accessible harmful content or an unauthorised child donation receive fast-track handling.
- **Legal/policy requirement:** Children's Risk Assessment 4, 6 and 8; Online Safety Procedures 3.3 and 3.5; Community Guidelines 8.2.
- **User stories:** As a child or adult acting for one, I can report without an account; as a moderator, I can protect the child without exposing them unnecessarily.
- **Functional requirements:** Child-harm flag; fast-track queue; adult-on-behalf relationship; minimal age data; safeguarding prompts; parental refund case linkage; no child-directed marketing or unsafe notice copy.
- **Admin/moderator requirements:** Specialist review for exploitation/grooming; child-access metrics; ability to disable comments or restrict campaign while investigating.
- **Required permissions:** Moderators see only necessary age/relationship fields; specialist child-safety role sees restricted details.
- **Database/storage:** Child involvement classification, acting-on-behalf field, safeguarding actions, linked refund case; avoid storing exact age unless necessary.
- **Audit logging:** Classification, specialist access, safeguarding decision, referral and data disclosure.
- **Notifications:** Age-appropriate plain-language acknowledgement/outcome; do not notify a suspected unsafe adult through a child-controlled route.
- **Edge cases:** Reporter age unknown, disputed parental authority, child in immediate danger, child is content subject, false age account, multiple siblings.
- **Acceptance criteria:** **AT-MOD-014:** child-harm cases bypass ordinary queue, restrict safely when required, limit data exposure and link an unauthorised-donation case to the refund workflow.
- **Launch criticality / owner:** **P0 — Trust & Safety Engineering.**
- **Implementation checklist:** [ ] child flags; [ ] fast track; [ ] on-behalf route; [ ] restricted fields; [ ] refund link; [ ] age-appropriate copy; [ ] safeguarding exercise.

### MOD-015 — CSEA detection, restriction and NCA reporting

- **Description:** Detected CSEA content is immediately quarantined, preserved minimally, prioritised and reported through the controlled NCA process.
- **Legal/policy requirement:** Online Safety Procedures 3.4; Incident Response Plan Annex B; Community Guidelines 7.3–7.4.
- **User stories:** As any moderator, I can stop viewing and escalate; as an authorised reporter, I can submit the available information and record the NCA reference.
- **Functional requirements:** One-action emergency restriction; no screenshot/download prompt; P1 alert; NCA priority 1/2/3 checklist; duplicate-report check; portal submission status; NCA reference; exact one- and five-year deletion dates.
- **Admin/moderator requirements:** Named authorised reporters; quarterly harmless-data access exercise; welfare handoff; external request/extension recording.
- **Required permissions:** Ordinary Moderator can quarantine/escalate without viewing further; only trained CSEA roles access evidence or finalise report.
- **Database/storage:** Restricted incident record; available statutory fields; `restricted_evidence_delete_at`; `report_reference_delete_at`; external references.
- **Audit logging:** All access, quarantine, priority, submission, reference, extension, deletion and denied access.
- **Notifications:** Urgent alerts contain identifiers only; no illegal media or descriptive thumbnails; 999 prompt when imminent danger and lead unavailable.
- **Edge cases:** Already reported material, NCMEC report, further share, portal outage, false positive, insufficient metadata, lawful preservation extension.
- **Acceptance criteria:** **AT-MOD-015:** exercise proves immediate restriction, role isolation, complete checklist, duplicate handling, reference storage and separate automated retention clocks.
- **Launch criticality / owner:** **P0 — Platform/Security / Online Safety Lead.**
- **Implementation checklist:** [ ] quarantine action; [ ] specialist RBAC; [ ] priority checklist; [ ] duplicate body/reference; [ ] portal status; [ ] two clocks; [ ] 999 fallback; [ ] quarterly exercise.

### MOD-016 — Emergency and external escalation workflow

- **Description:** P1 threats, terrorism, imminent self-harm, active serious offending and lawful emergency requests follow a timed escalation runbook.
- **Legal/policy requirement:** Online Safety Procedures 3.2 and 3.4; Terms 23.4; Incident Response Plan 3.
- **User stories:** As a moderator, I can restrict first and obtain help; as lead, I can record a police/emergency/regulator referral without delaying safety action.
- **Functional requirements:** Emergency restriction; contact tree; acknowledgement timer; 999/police/NCA/OFSI/regulator referral types; authority verification; disclosure minimisation; reference and follow-up task.
- **Admin/moderator requirements:** Online Safety/Incident Lead can approve disclosures; any founder can impose temporary restriction; post-action review required.
- **Required permissions:** Emergency restrict capability distinct from evidence disclosure; two-person approval for non-imminent sensitive disclosure where feasible.
- **Database/storage:** Escalation record, requester authority, information disclosed, lawful basis, timestamps, external reference.
- **Audit logging:** Contact attempts, restriction, verification, approval, disclosure and post-action review.
- **Notifications:** Multi-channel alerts to lead, deputy and second backup; escalation on non-acknowledgement; affected-user notice suppressed only with reason.
- **Edge cases:** Leaders unreachable, fake police request, verbal emergency request, system outage, cross-border authority, threat to moderator.
- **Acceptance criteria:** **AT-MOD-016:** exercise demonstrates restriction without approval delay, escalating contact tree, verified disclosure and complete post-event record.
- **Launch criticality / owner:** **P0 — Platform/Security.**
- **Implementation checklist:** [ ] emergency action; [ ] contact tree; [ ] authority verification; [ ] disclosure approval; [ ] external references; [ ] fallback runbook; [ ] quarterly exercise.

### MOD-017 — Trusted flagger and specialist reporter support

- **Description:** Verified trusted organisations can be identified and prioritised without receiving automatic takedown power.
- **Legal/policy requirement:** Risk-based reporting and escalation duties; Community Guidelines 7.4; any applicable Ofcom trusted-flagger treatment.
- **User stories:** As a verified specialist reporter, my report carries credentials/context; as a moderator, I see trust status but still make an independent decision.
- **Functional requirements:** Organisation profile; verified domains/contacts; credential expiry; priority routing rules; structured supporting references; revocation; ordinary public intake remains available.
- **Admin/moderator requirements:** Online Safety Lead approves/reviews status; moderators see basis and expiry; metrics separate source from outcome.
- **Required permissions:** Trusted flaggers only create/read their own reports; no evidence or user-data access beyond supplied outcome.
- **Database/storage:** Organisation, contacts, verification evidence, status history and submitted reports.
- **Audit logging:** Grant, renew, revoke, trusted submission and any priority effect.
- **Notifications:** Renewal/expiry; report acknowledgement/outcome; internal alert if credentials invalid.
- **Edge cases:** Compromised mailbox, expired status, conflict of interest, erroneous high volume, anonymous employee.
- **Acceptance criteria:** **AT-MOD-017:** verified status changes routing transparently but never auto-decides the case; expiry/revocation removes priority on future reports.
- **Launch criticality / owner:** **P1 — Trust & Safety Engineering.**
- **Implementation checklist:** [ ] organisation records; [ ] verification/expiry; [ ] priority rule; [ ] revocation; [ ] independent-decision safeguard; [ ] metrics.

### MOD-018 — Content restriction and removal

- **Description:** Moderators can hide specific content or unpublish a campaign while preserving private evidence and public state consistency.
- **Legal/policy requirement:** Community Guidelines 3.3 and 7.4; Terms 18.2, 22–23; Online Safety Procedures 3.2.
- **User stories:** As a moderator, I can stop exposure immediately; as a user, I receive a reason where safe; as an auditor, I can see exactly what changed.
- **Functional requirements:** Actions: hide comment/update/media, disable comments, redact sensitive field, unpublish campaign, pause new donations; atomic state change; standard reason; scope/duration; public safe state; evidence preservation.
- **Admin/moderator requirements:** Preview impact; high-impact confirmation; Senior Moderator approval for campaign removal unless emergency; no ability to move funds.
- **Required permissions:** Action-specific capabilities; emergency temporary scope for founders; restoration permission separately granted.
- **Database/storage:** Moderation state separate from content; action/expiry; prior state for restoration; evidence link.
- **Audit logging:** Actor, target/version, before/after state, reason, policy, case, timestamp and approval.
- **Notifications:** Affected-user notice and reporter outcome where allowed; donors receive campaign-state notices when policy requires.
- **Edge cases:** Active checkout, scheduled update, already deleted content, multiple concurrent actions, external cache, payment already processed.
- **Acceptance criteria:** **AT-MOD-018:** each target can be restricted atomically across public views and new-donation entry points without deleting evidence; action never attempts to hold or recall funds.
- **Launch criticality / owner:** **P0 — Product Engineering.**
- **Implementation checklist:** [ ] target actions; [ ] atomic state; [ ] cache invalidation; [ ] checkout block; [ ] evidence; [ ] notices; [ ] permissions; [ ] concurrency test.

### MOD-019 — Content and account restoration

- **Description:** Reversed or expired actions restore the exact permitted state and record what cannot be restored.
- **Legal/policy requirement:** Community Guidelines 8.6; Terms 17.2, 18.2 and 23.5; Online Safety Procedures production control 7.
- **User stories:** As a successful appellant, my content/access returns; as a moderator, I can restore safely without erasing the original decision.
- **Functional requirements:** Restore comment/update/media/campaign/comments/donations/account; precondition and conflict checks; partial restoration; public timestamp handling; immutable linkage to reversal.
- **Admin/moderator requirements:** Appeal Reviewer initiates; appropriate action-role executes/approves; manual remediation task for irreversible external effects.
- **Required permissions:** Restoration is independent of original remover; no self-review bypass.
- **Database/storage:** Restoration action, restored state, exceptions, link to original sanction and appeal.
- **Audit logging:** Before/after, actor, authority, decision link and failure/remediation.
- **Notifications:** Affected user, reporter as appropriate, campaign followers/donors only where policy requires.
- **Edge cases:** Content independently violates another rule, owner deleted it, account has another active sanction, campaign ended, cache/index lag.
- **Acceptance criteria:** **AT-MOD-019:** successful appeal restores all eligible states, preserves both decisions and records explicit reasons for any non-restorable element.
- **Launch criticality / owner:** **P0 — Product Engineering.**
- **Implementation checklist:** [ ] state capture; [ ] partial restore; [ ] conflict rules; [ ] caches/indexes; [ ] remediation task; [ ] notices; [ ] end-to-end appeal test.

### MOD-020 — Warning system

- **Description:** Moderators issue proportionate, policy-grounded warnings with acknowledgement and recurrence tracking.
- **Legal/policy requirement:** Community Guidelines 3.3; Terms 22.1–22.2.
- **User stories:** As a user, I understand the breach and expected cure; as a moderator, I can use a lower-impact response and detect recurrence.
- **Functional requirements:** Warning types, policy ground, content/case link, cure action/deadline, acknowledgement, expiry for escalation weighting, template plus editable reason.
- **Admin/moderator requirements:** Template governance; supervisor review of warning quality and patterns.
- **Required permissions:** Moderator issues within scope; Senior Moderator rescinds or alters consequences.
- **Database/storage:** Warning, status, acknowledgement, cure, expiry, related sanctions.
- **Audit logging:** Issue, delivery, acknowledgement, cure, expiry and rescission.
- **Notifications:** In-app/email warning with appeal route and deadline.
- **Edge cases:** Undeliverable email, minor technical breach cured first, multiple simultaneous warnings, account deletion.
- **Acceptance criteria:** **AT-MOD-020:** warning contains ground/reason/cure/appeal; acknowledgement and recurrence are tracked; undelivered warning appears to operations.
- **Launch criticality / owner:** **P1 — Product Engineering.**
- **Implementation checklist:** [ ] types/templates; [ ] cure/deadline; [ ] acknowledgement; [ ] recurrence; [ ] appeal link; [ ] delivery failure queue.

### MOD-021 — Temporary user suspension

- **Description:** Authorised moderators can suspend account access/features immediately or after an ordinary breach decision.
- **Legal/policy requirement:** Terms 22.1–22.2; Community Guidelines 3.3; Online Safety Procedures 3.2.
- **User stories:** As a moderator, I can stop harmful activity; as a suspended user, I know scope, reason, duration and appeal route where disclosure is safe.
- **Functional requirements:** Scope (login, posting, campaign creation, donations, all); start/end; emergency/ordinary type; active-session revocation; campaign-state plan; scheduled review/expiry.
- **Admin/moderator requirements:** Senior approval for ordinary full suspension; emergency action promptly reviewed; view affected campaigns and outstanding duties.
- **Required permissions:** Senior Moderator; founders/Incident Lead have emergency temporary capability; service job may expire but not create suspension.
- **Database/storage:** Suspension and scope, review dates, prior state, linked cases.
- **Audit logging:** Session revocation, action, approvals, review, extension, expiry and restoration.
- **Notifications:** Reason/scope/duration/appeal; suppress only with recorded safety/legal ground; internal expiry reminders.
- **Edge cases:** Multiple sanctions, active donation checkout, outstanding refund/evidence duties, compromised account, suspension expires during appeal.
- **Acceptance criteria:** **AT-MOD-021:** server rejects every prohibited action immediately, preserves permitted obligations, revokes sessions and restores scope at authorised expiry/reversal.
- **Launch criticality / owner:** **P0 — Platform/Security.**
- **Implementation checklist:** [ ] scoped enforcement on all server mutations; [ ] session revocation; [ ] campaign effects; [ ] expiry/review; [ ] notices; [ ] overlapping-sanction tests.

### MOD-022 — Permanent bans and ban-evasion controls

- **Description:** Senior moderators impose permanent bans and review linked-account signals for evasion.
- **Legal/policy requirement:** Community Guidelines 3.1, 3.3; Terms 22; repeat-offender commitments.
- **User stories:** As safety operations, I can prevent repeat severe abuse; as a legitimate household member, I am not automatically banned by a weak linkage.
- **Functional requirements:** Ban reason and scope; revoke sessions; prevent new account/campaign actions through proportionate signals; require human decision for linked account; appeal remains accessible.
- **Admin/moderator requirements:** Two-person approval for permanent ban except emergency restriction pending approval; periodic false-positive sampling.
- **Required permissions:** Senior Moderator proposes; Online Safety Lead or second Senior Moderator approves; no self-approval.
- **Database/storage:** Ban, approval, durable identifiers/signals with minimised retention, linked-account assessments.
- **Audit logging:** Proposal, evidence access, approval/rejection, enforcement, linkage decision, appeal/reversal.
- **Notifications:** Ban decision/reasons/appeal unless unsafe or prohibited; internal alert on likely evasion.
- **Edge cases:** Shared network/device, recycled email/phone, compromised user, student society succession, deleted data, legal name change.
- **Acceptance criteria:** **AT-MOD-022:** ban blocks prohibited server actions and sessions; linkage alone cannot auto-ban; two-person approval and appeal restoration are enforced.
- **Launch criticality / owner:** **P0 — Platform/Security.**
- **Implementation checklist:** [ ] ban state; [ ] session/action enforcement; [ ] signals; [ ] human linked review; [ ] dual approval; [ ] appeal; [ ] false-positive tests.

### MOD-023 — Appeals intake and tracking

- **Description:** Eligible decision notices link to a ten-Working-Day appeal route and case tracker.
- **Legal/policy requirement:** Community Guidelines 8; Terms 17.2, 22.2 and 23.5; Complaints Policy 5.
- **User stories:** As an affected user or reporter, I can challenge the correct decision and add evidence; as an appeal reviewer, I receive the original record without being assigned where conflicted.
- **Functional requirements:** Eligibility/deadline calculation; late exceptional request; decision-linked form; new evidence; status tracker; acknowledgement within five Working Days; 30-day target; outcome confirm/vary/reverse.
- **Admin/moderator requirements:** Reviewer assignment/recusal; supervisor sees overdue appeals; case cannot be closed while eligible appeal is active.
- **Required permissions:** Party or secure token submits; Appeal Reviewer is server-checked against original participants; original moderator read-only unless asked for factual context.
- **Database/storage:** Appeal, original decision, deadline, evidence, reviewer, status, outcome and restoration tasks.
- **Audit logging:** Intake, eligibility, deadline override, assignments, evidence access, decision and restoration.
- **Notifications:** Receipt/tracking, information request, delay, outcome and restoration completion.
- **Edge cases:** Late appeal, anonymous reporter complaint, multiple decisions, original reviewer unavailable, new urgent evidence, user cannot log in due to suspension.
- **Acceptance criteria:** **AT-MOD-023:** each eligible notice opens the correct appeal; suspended users retain access; conflicted reviewers cannot accept assignment; reversal creates restoration tasks.
- **Launch criticality / owner:** **P0 — Trust & Safety Engineering.**
- **Implementation checklist:** [ ] eligibility/deadline; [ ] secure access; [ ] reviewer conflict; [ ] tracker; [ ] clocks; [ ] outcomes; [ ] restoration link; [ ] suspended-user test.

### MOD-024 — Decision recording and reasoned notices

- **Description:** Every moderation outcome has a structured, explainable decision and a safe notice to affected parties.
- **Legal/policy requirement:** Community Guidelines 7.4, 8.6–8.7; Terms 22.2, 23.5; Complaints Policy 4.3.
- **User stories:** As a user, I understand what happened and how to challenge it; as compliance, I can prove consistency; as a moderator, I use approved reasons without losing nuance.
- **Functional requirements:** Outcome, target, facts, evidence, policy/legal grounds, proportionality, effective time, duration, cure, appeal eligibility/deadline, notice audience, redactions and suppression reason.
- **Admin/moderator requirements:** Templates versioned by policy owner; senior approval for P1 and permanent bans; quality sampling.
- **Required permissions:** Decision writer/approver split where required; notice service reads only publishable fields.
- **Database/storage:** Immutable decision versions, reasons, approval, notice render and policy/template versions.
- **Audit logging:** Draft/final/approve, notice rendering, delivery and suppression.
- **Notifications:** In-app/email; reporter gets safe outcome, affected user gets reasons unless restricted; delivery retry/dead-letter queue.
- **Edge cases:** Notice reveals reporter identity, law-enforcement secrecy, multiple languages, email bounce, decision corrected, user has no account.
- **Acceptance criteria:** **AT-MOD-024:** no final action exists without a decision; notices exclude internal/reporter-restricted data, include appeal information and remain reproducible from stored template/version data.
- **Launch criticality / owner:** **P0 — Trust & Safety Engineering.**
- **Implementation checklist:** [ ] structured decision; [ ] templates/versioning; [ ] audience redaction; [ ] approval; [ ] appeal details; [ ] delivery retry; [ ] reproducibility test.

### MOD-025 — Tamper-evident audit log

- **Description:** An append-only audit trail records every privileged moderation, evidence, role and disclosure event.
- **Legal/policy requirement:** Community Guidelines 8.7; Terms 23.6; Complaints Policy 7; Incident Response Plan 4 and 8.
- **User stories:** As an auditor, I can reconstruct events and verify integrity; as security, I can detect unauthorised privileged use.
- **Functional requirements:** Immutable events; actor/service identity; action, object, case, before/after hashes, reason, timestamp, request/correlation ID; chained/batched integrity proof; export and verification tool.
- **Admin/moderator requirements:** Read-only viewer with scoped filters; no user can edit/delete events; break-glass access reviewed.
- **Required permissions:** Platform/Security administers retention, not content; Auditor reads scoped data; ordinary moderators see case history but not global security metadata.
- **Database/storage:** Separate append-only store or protected table, immutable export snapshots, retention schedule and integrity anchors.
- **Audit logging:** Audit-log reads/exports/configuration are themselves audited to a separate protected stream.
- **Notifications:** Alert on denied privileged attempts, integrity failure, unusual export or break-glass use.
- **Edge cases:** Clock skew, retry/duplicate event, partial outage, actor deleted, large export, corruption, service identity rotation.
- **Acceptance criteria:** **AT-MOD-025:** attempted update/delete is denied; integrity verifier detects mutation/omission; all P0 action tests produce the required correlated events.
- **Launch criticality / owner:** **P0 — Platform/Security.**
- **Implementation checklist:** [ ] event schema; [ ] append-only enforcement; [ ] integrity chain; [ ] correlation IDs; [ ] viewer/export; [ ] self-audit; [ ] alerts; [ ] mutation test.

### MOD-026 — Moderator activity and quality log

- **Description:** Operational reporting measures actions, timeliness, reversals, access and quality without using opaque productivity scoring.
- **Legal/policy requirement:** Online Safety Procedures Records; Illegal-Content Risk Assessment 9; Community Guidelines 8.7.
- **User stories:** As lead, I can identify training and workload needs; as moderator, I can see my assigned work and corrections; as compliance, I can evidence oversight.
- **Functional requirements:** Actions by type, queue time, review time, SLA misses, supervisor sampling, appeal reversal and access anomalies; contextualise by priority/complexity.
- **Admin/moderator requirements:** Lead records coaching/corrective action separately from case merits; moderator can challenge inaccurate activity attribution.
- **Required permissions:** Lead and Auditor aggregate view; moderator own view; no public or broad-team ranking.
- **Database/storage:** Derived metrics plus immutable monthly snapshot; correction record links to source events.
- **Audit logging:** Snapshot generation, access, export and corrections.
- **Notifications:** SLA/workload alerts; quality-review assignment; no automated disciplinary notices.
- **Edge cases:** Shared case, training cases, leave, system outage, reversed decision not caused by error, low sample size.
- **Acceptance criteria:** **AT-MOD-026:** monthly figures reconcile to audit events and distinguish workload from quality; corrections preserve original and reason.
- **Launch criticality / owner:** **P1 — Data/Compliance.**
- **Implementation checklist:** [ ] derived metrics; [ ] context fields; [ ] sampling; [ ] own view; [ ] correction; [ ] monthly reconciliation; [ ] privacy review.

### MOD-027 — Repeat-offender, linked-account and coordinated-reporting detection

- **Description:** Risk signals identify recurring policy breaches, ban evasion, coordinated fake comments and reporting campaigns for human review.
- **Legal/policy requirement:** Community Guidelines 7.4–7.5; Illegal-Content Risk Assessment 5, 8.3 and 9; Terms 22.
- **User stories:** As a moderator, I see relevant patterns; as a good-faith reporter or shared-household user, I am not sanctioned automatically.
- **Functional requirements:** Count prior upheld cases and sanctions; content/account/campaign graph; velocity and shared-signal indicators; explainable score components; thresholds only route/flag; manual disposition and false-positive feedback.
- **Admin/moderator requirements:** Lead configures versioned thresholds; reviews bias/false positives; records rationale for linkage.
- **Required permissions:** Sensitive network/device signals restricted; ordinary moderator sees an explanation, not raw unnecessary identifiers.
- **Database/storage:** Minimised hashed signals, feature values, rule/model version, review outcome, expiry.
- **Audit logging:** Signal access, score generation, threshold change, human linkage and action.
- **Notifications:** Internal review alert only; no user accusation before human decision.
- **Edge cases:** Shared university Wi-Fi, household/device, viral campaign, activist reporting, VPN, recycled identifier, society officer succession.
- **Acceptance criteria:** **AT-MOD-027:** signals never auto-sanction; reviewer can explain each score component; known shared-network fixtures do not create automatic linkage or ban.
- **Launch criticality / owner:** **P1 — Data/Compliance / Platform/Security.**
- **Implementation checklist:** [ ] policy-approved signals; [ ] minimisation/expiry; [ ] explainability; [ ] human-only action; [ ] threshold versioning; [ ] false-positive suite; [ ] bias review.

### MOD-028 — Case search, filtering and export

- **Description:** Authorised teams can find cases and produce scoped evidence without leaking restricted data.
- **Legal/policy requirement:** Online Safety Procedures Records; Complaints Policy 7; Incident Response Plan 8.
- **User stories:** As a moderator, I can find cases by reference/category/status/target; as compliance, I can export regulator-ready records.
- **Functional requirements:** Filter by reference, target, category, priority, status, assignee, date, SLA, child flag, external referral, appeal and outcome; full-text search limited to permitted fields; paginated export.
- **Admin/moderator requirements:** Saved operational views; no unrestricted raw query; export preview and purpose field.
- **Required permissions:** Search results server-filtered before count; restricted classifications excluded unless capability allows; export requires enhanced permission.
- **Database/storage:** Search index derived from permitted fields, access-control labels and export artifact with expiry.
- **Audit logging:** Search of sensitive identifiers, saved view, export purpose/scope/download/deletion.
- **Notifications:** Alert on export ready/expired and anomalous volume.
- **Edge cases:** Renamed/deleted targets, typo, large result, revoked role mid-export, CSEA evidence, formula injection in CSV.
- **Acceptance criteria:** **AT-MOD-028:** roles cannot infer restricted result counts; exports are escaped, expiring and audited; deleted/renamed targets remain findable by case reference.
- **Launch criticality / owner:** **P1 — Product Engineering / Platform/Security.**
- **Implementation checklist:** [ ] filters; [ ] permission-aware index/count; [ ] pagination; [ ] scoped exports; [ ] CSV safety; [ ] expiry; [ ] revocation test.

### MOD-029 — Retention, preservation and deletion engine

- **Description:** Automated jobs enforce record-specific retention, legal holds and proof of deletion.
- **Legal/policy requirement:** Online Safety Procedures CSEA retention; Terms 23.6; Complaints Policy 7; DP Complaints Workflow 6; Incident Response Plan Annex B.
- **User stories:** As compliance, I can show why each record is retained; as a user, data is not kept indefinitely; as operations, lawful holds prevent premature deletion.
- **Functional requirements:** Policy table by record class; calculate/delete/anonymise; holds; retries; dry run; dependency order; backup lifecycle; exception queue; deletion certificate/proof.
- **Admin/moderator requirements:** Compliance reviews exceptions/holds; no moderator manually changes retention; dual approval for hold beyond default.
- **Required permissions:** Scoped retention service; Compliance hold administration; Security controls job identity.
- **Database/storage:** `retentionPolicies`, `retentionSchedules`, `legalHolds`, job runs, exceptions and deletion proofs.
- **Audit logging:** Policy changes, calculations, holds, releases, job results and failed deletions.
- **Notifications:** Upcoming hold review, deletion failure and P0 CSEA-clock failure alerts.
- **Edge cases:** Multiple policies, appeal before deletion, authority extension, orphaned storage, backups, clock migration, partial delete.
- **Acceptance criteria:** **AT-MOD-029:** time-travel tests enforce each class; CSEA evidence deletes at one year and reference at five years unless held; failed object deletion cannot be marked complete.
- **Launch criticality / owner:** **P0 — Platform/Security.**
- **Implementation checklist:** [ ] policy registry; [ ] schedules; [ ] holds/dual approval; [ ] idempotent jobs; [ ] storage/backups; [ ] proof; [ ] exception dashboard; [ ] time-travel tests.

### MOD-030 — Moderator roles, permissions and access review

- **Description:** Least-privilege roles control every moderation action and sensitive record.
- **Legal/policy requirement:** Online Safety Procedures 3.1, 3.4; Terms 23.6; Incident Response Plan roles; privacy/access-control commitments.
- **User stories:** As role admin, I can grant scoped access with approval; as security, I can revoke leavers immediately; as appeal reviewer, the system enforces separation.
- **Functional requirements:** Capability-based RBAC; role request/approval; MFA for privileged roles; session revocation; break glass; quarterly access review; temporary expiry; segregation of identity, CSEA, DP and general moderation data.
- **Admin/moderator requirements:** No self-grant/self-approval; role administrator cannot inspect case evidence merely by administering roles; case conflict/recusal check.
- **Required permissions:** Root/service configuration limited to Platform/Security; every Convex query/mutation checks server-side capability and object scope.
- **Database/storage:** Roles, capabilities, grants, approver, purpose, start/expiry, review attestations, break-glass record.
- **Audit logging:** Grant/change/revoke, denied action, MFA/break glass, review completion and stale access.
- **Notifications:** Grant/revoke/expiry; quarterly reviewer reminder; immediate alert on break-glass and self-elevation attempt.
- **Edge cases:** Last admin, emergency access, role changed in open session, deputy substitution, compromised admin, service account.
- **Acceptance criteria:** **AT-MOD-030:** permission matrix tests cover every privileged query/mutation; self-grant is impossible; revoked role loses access on next request; restricted domains remain separated.
- **Launch criticality / owner:** **P0 — Platform/Security.**
- **Implementation checklist:** [ ] capability matrix; [ ] server guards; [ ] MFA; [ ] approvals/expiry; [ ] session revoke; [ ] break glass; [ ] quarterly review; [ ] exhaustive negative tests.

### MOD-031 — Moderation notification service

- **Description:** A reliable service sends receipts, acknowledgements, decisions, appeal updates, restoration notices and internal alerts.
- **Legal/policy requirement:** Community Guidelines 7.4 and 8.3–8.6; Terms 22.2 and 23.5; Complaints Policy 3–6.
- **User stories:** As a reporter/user, I receive timely understandable updates; as operations, I can see delivery failure; as safety lead, I receive urgent alerts.
- **Functional requirements:** Event/outbox pattern; templates and policy version; audience/redaction; in-app/email; retry/dead letter; urgency routing; business-day timing; user preference only where notification is optional.
- **Admin/moderator requirements:** Preview exact audience render; suppress/delay only with reason; delivery dashboard; resend without duplicating case event.
- **Required permissions:** Notification service receives approved publishable payload only; moderators cannot access provider credentials.
- **Database/storage:** Outbox, template version, render, destination token/reference, delivery attempts/status and suppression reason.
- **Audit logging:** Enqueue, render, send, retry, bounce, suppress and manual resend.
- **Notifications:** This is the feature; P1 uses at least two internal channels and escalates when unacknowledged.
- **Edge cases:** Bounce, provider outage, duplicate event, unsafe recipient, anonymous report, translated copy, account suspended/deleted.
- **Acceptance criteria:** **AT-MOD-031:** safety action succeeds during provider outage; queued notice later delivers exactly once logically; no template can expose restricted fields to an unauthorised audience.
- **Launch criticality / owner:** **P0 — Platform/Security / Product Engineering.**
- **Implementation checklist:** [ ] outbox; [ ] templates/version; [ ] redaction; [ ] retries/dead letter; [ ] multi-channel P1; [ ] suppression reason; [ ] outage test; [ ] audience fixtures.

### MOD-032 — Complaints routing and case tracking

- **Description:** One intake address/form routes Online Safety, data-protection, refund and general complaints to the correct clock without duplicate decisions.
- **Legal/policy requirement:** Complaints Policy 1–7; Community Guidelines 8; DP Complaints Workflow; Refund and Dispute Policy.
- **User stories:** As a complainant, I do not need to know the correct legal route; as operations, I can split elements while preserving one lead reference.
- **Functional requirements:** Intake classifier with human confirmation; one lead case; linked subcases; shortest acknowledgement clock; completeness/information-request clock pause; route notice; 2 Working Day/5 Working Day/30-day rules as applicable.
- **Admin/moderator requirements:** Complaints owner routes/splits/links; specialist domains keep their own permissions; final response aggregates permitted outcomes.
- **Required permissions:** Intake team sees routing minimum; specialists see only assigned domain; no cross-domain leakage.
- **Database/storage:** Complaint, elements, routes, clocks, linked cases, completeness, communications and final response.
- **Audit logging:** Classification, route/split/link, clock pause/resume, owner and final response.
- **Notifications:** Receipt, route/clock, information request, delay, substantive/final response and review route.
- **Edge cases:** Mixed complaint, wrong category, duplicate email thread, anonymous complainant, urgent safety within general complaint, unavailable specialist.
- **Acceptance criteria:** **AT-MOD-032:** mixed complaint receives the shortest acknowledgement, creates linked specialist work without duplicate merits decisions and produces one traceable final communication.
- **Launch criticality / owner:** **P0 — Product Engineering.**
- **Implementation checklist:** [ ] unified intake; [ ] human routing; [ ] linked elements; [ ] clocks; [ ] access separation; [ ] aggregated response; [ ] mixed-case test.

### MOD-033 — Pre-publication campaign review

- **Description:** Every campaign and all media receive complete human review before publication, and material changes return to review.
- **Legal/policy requirement:** Terms 7.3 and 18.2; Illegal-Content Risk Assessment 8.2; Children's Risk Assessment 5–6.
- **User stories:** As a creator, I know required changes; as a moderator, I use one complete checklist; as a viewer, published campaigns passed the launch gate without implying endorsement.
- **Functional requirements:** Checklist covers identity/status reference, beneficiary=owner, budget, evidence, all media/video end-to-end, links, illegal/prohibited content, sensitive data, fraud/sanctions and branding; outcomes approve/request evidence/reject/escalate; material edit invalidates approval.
- **Admin/moderator requirements:** Trained campaign reviewer; sampling and checklist version control; no self-review of own campaign.
- **Required permissions:** Reviewer can inspect campaign evidence but not unrelated identity data; Senior Moderator handles escalations.
- **Database/storage:** Review, checklist answers, evidence references, policy/checklist version, approval hash and invalidation reason.
- **Audit logging:** Submission, evidence access, checklist, decision, approval invalidation and publication.
- **Notifications:** Creator request/rejection/approval with reasons and appeal where eligible; urgent escalation alerts.
- **Edge cases:** Video changed after review, external link changes, scheduled edits, reviewer conflict, incomplete upload, material/non-material edit.
- **Acceptance criteria:** **AT-MOD-033:** publication server mutation fails without current completed approval; any material content hash change invalidates approval; video completion is recorded.
- **Launch criticality / owner:** **P0 — Product Engineering / Moderation Operations.**
- **Implementation checklist:** [ ] canonical checklist; [ ] media/video completeness; [ ] content hash; [ ] edit invalidation; [ ] outcomes; [ ] conflict check; [ ] publish guard; [ ] audit sample.

### MOD-034 — Comment safety controls

- **Description:** Comments are account-only plain text, server-reject links/attachments, rate-limit abuse and remain attributable.
- **Legal/policy requirement:** Community Guidelines 6; Children's Risk Assessment 1, 5–6; Illegal-Content Risk Assessment 8.3.
- **User stories:** As a viewer, comments cannot carry attachments/links; as a user, edits are labelled; as a moderator, attribution and versions persist.
- **Functional requirements:** Account/18+ declaration check; plain-text schema; URL/link/attachment rejection client and server; length/Unicode normalisation; per-user/IP/campaign rate limits; edited marker; owner removal preserves private version.
- **Admin/moderator requirements:** Disable comments by campaign; adjust versioned rate thresholds; inspect abuse signals within permission.
- **Required permissions:** Authenticated eligible user creates/edits/deletes own; campaign owner hides but cannot edit others; Moderator restores/hides.
- **Database/storage:** Comment versions, edit/delete/moderation state, author/campaign, rate-limit events.
- **Audit logging:** Create/edit/delete, owner removal, moderator hide/restore, rate-limit denial.
- **Notifications:** User feedback on rejected link/rate limit; moderation notices through MOD-031.
- **Edge cases:** Obfuscated URL, emoji/domain-like text, pasted rich text, race edit/report, owner misuse, shared IP.
- **Acceptance criteria:** **AT-MOD-034:** client and direct server calls reject links and attachments; edit history survives deletion; campaign-owner removal is reversible by Moderator.
- **Launch criticality / owner:** **P0 — Product Engineering.**
- **Implementation checklist:** [ ] schema; [ ] client/server validation; [ ] Unicode/link tests; [ ] rate limits; [ ] edit marker/history; [ ] owner/moderator actions; [ ] restoration.

### MOD-035 — Safety analytics, compliance dashboards and transparency reporting

- **Description:** Immutable monthly metrics support risk review, Ofcom evidence, internal dashboards and public transparency outputs without exposing personal data.
- **Legal/policy requirement:** Online Safety Procedures Records; Illegal-Content Risk Assessment 9–10; Children's Risk Assessment 8; Complaints Policy 7.
- **User stories:** As Online Safety lead, I can monitor effectiveness; as regulator/auditor, I can verify definitions; as the public, I can receive appropriately aggregated transparency information.
- **Functional requirements:** Metrics by intake/category/priority/outcome; first-review and restriction time; child cases; referrals; appeals/reversals/restorations; repeat offenders; queue age; complaints; moderator activity; SLA breaches; definition/version and suppression thresholds.
- **Admin/moderator requirements:** Compliance signs monthly snapshot; annotations explain anomalies; owner creates corrective action from threshold breach.
- **Required permissions:** Aggregate dashboard by role; row-level drill-down only through underlying case permissions; public export is disclosure-reviewed.
- **Database/storage:** Metric definitions, job runs, immutable monthly snapshots, annotations, corrective actions, published report versions.
- **Audit logging:** Definition change, snapshot, approval, export/publication and drill-down.
- **Notifications:** Monthly ready/failed; threshold breach; overdue corrective action.
- **Edge cases:** Low counts/re-identification, reopened case, changed taxonomy, late data, timezone, deleted source record, double-counted duplicate reports.
- **Acceptance criteria:** **AT-MOD-035:** monthly snapshot reconciles to canonical records, preserves definitions, applies low-count suppression and remains reproducible after source retention actions where lawful.
- **Launch criticality / owner:** **P0 for internal dashboard; P1 for public report — Data/Compliance.**
- **Implementation checklist:** [ ] metric dictionary; [ ] report/case counting rules; [ ] monthly snapshot; [ ] reconciliation; [ ] low-count suppression; [ ] annotations/actions; [ ] export/publication review.

### MOD-036 — Data-protection complaint and request operations

- **Description:** Public form and email intake create tracked, access-restricted data-protection complaints and related data-request work.
- **Legal/policy requirement:** Data Protection Complaints Workflow; Complaints Policy 1.3; Incident Response Plan where a breach is alleged.
- **User stories:** As a data subject, I can complain and receive a reference; as Data Protection Lead, I can investigate against the ROPA and link a breach incident.
- **Functional requirements:** Form fields from workflow; 30-day acknowledgement clock; identity-verification status; data export task; ROPA activity link; breach escalation; six-year complaint retention; progress updates.
- **Admin/moderator requirements:** Data Protection Lead/deputy assignment; reviewer separation where Amrit's decision is challenged; controlled export review.
- **Required permissions:** Separate DP role; ordinary moderators cannot access; Incident Lead receives only necessary linked data.
- **Database/storage:** DP case, requests, verification, ROPA links, export artifact/expiry, communications, decision.
- **Audit logging:** Intake, identity check, data access/export, disclosure, decision, escalation and deletion.
- **Notifications:** Receipt/reference, acknowledgement, information request, progress, outcome and ICO route.
- **Edge cases:** Mixed safety/DP complaint, unverified requester, child representative, excessive request, breach discovered, third-party data in export.
- **Acceptance criteria:** **AT-MOD-036:** form/email produce same restricted case; mixed complaint links safely; export requires identity and disclosure review; breach allegation triggers Incident Response task.
- **Launch criticality / owner:** **P0 — Product Engineering / Platform/Security.**
- **Implementation checklist:** [ ] form/email adapter; [ ] DP RBAC; [ ] clocks; [ ] identity; [ ] ROPA/export; [ ] breach link; [ ] reviewer separation; [ ] retention.

### MOD-037 — Incident response operations

- **Description:** Security and personal-data incidents use a severity-driven case, containment actions, notification clocks and exercise evidence.
- **Legal/policy requirement:** Incident Response Plan 1–9 and annexes.
- **User stories:** As any team member, I can raise an incident; as Incident Lead, I can contain immediately; as compliance, I can assess and record notifications.
- **Functional requirements:** Severity matrix; immediate alert; containment actions; 24-hour assessment target; 72-hour ICO clock when applicable; individual-notice decision; processor involvement; post-incident actions; quarterly exercises.
- **Admin/moderator requirements:** Incident Lead/deputy authority; Security executes secrets/integration actions; CSEA incident redirects to MOD-015.
- **Required permissions:** Restricted incident role; emergency actions capability-specific; evidence and processor contacts limited.
- **Database/storage:** Incident, affected systems/data, risk assessment, actions, notices, root cause, corrective actions, exercise flag.
- **Audit logging:** Detection, access, containment, notification analysis/submission and closure.
- **Notifications:** Lead/deputy alert; ICO/individual templates; corrective-action reminders.
- **Edge cases:** Lead unavailable, processor incomplete notice, phased ICO notification, false alarm, concurrent safety case, total service outage.
- **Acceptance criteria:** **AT-MOD-037:** tabletop exercises prove escalation, containment, clock calculation, CSEA routing and complete breach-log export.
- **Launch criticality / owner:** **P0 — Platform/Security.**
- **Implementation checklist:** [ ] incident intake; [ ] severity; [ ] containment; [ ] clocks; [ ] processor/contact register; [ ] notice templates; [ ] corrective actions; [ ] quarterly exercises.

### MOD-038 — Private messaging scope guard

- **Description:** The production platform has no private messaging; architecture and release controls prevent accidental introduction without policy/risk review.
- **Legal/policy requirement:** Terms 17.1; Community Guidelines 6.1; both Online Safety risk assessments.
- **User stories:** As Online Safety lead, I am alerted before any private user-to-user communication launches; as engineering, I have an explicit non-feature boundary.
- **Functional requirements:** No message route/schema/API; automated route/schema scan; product-change checklist requires new risk assessments and report-message specification before introducing messaging.
- **Admin/moderator requirements:** Not applicable until messaging is approved; current reporting covers public comments only.
- **Required permissions:** No user or admin messaging capability exists.
- **Database/storage:** No private-message content store; release-control evidence records scan result.
- **Audit logging:** Release check result and approved exception/change record.
- **Notifications:** Build/release fails and alerts policy owner if prohibited messaging surface/schema is detected.
- **Edge cases:** Support contact, email notifications, moderator notes and comments must not be misclassified as user-to-user messaging.
- **Acceptance criteria:** **AT-MOD-038:** production route/schema inventory contains no private messaging; a fixture introducing a message route fails release control and identifies required policy review.
- **Launch criticality / owner:** **P0 — Product Engineering.**
- **Implementation checklist:** [ ] route/schema denylist test; [ ] distinguish support/internal notes; [ ] release gate; [ ] policy-owner approval workflow for future change.

## 4. Complete launch implementation checklist

### Intake and user surfaces

- [ ] MOD-001 through MOD-006 controls exist on web, iOS and Android and pass accessibility tests.
- [ ] Direct server tests prove every intake permission, rate limit and non-enumeration rule.
- [ ] Campaigns, updates, comments, usernames/avatars, images, video and documents resolve to immutable reported versions.
- [ ] Email, authenticated, logged-out and anonymous intake all create canonical report records.
- [ ] Private messaging is absent and release-guarded under MOD-038.

### Operations and decisions

- [ ] MOD-007 through MOD-024 end-to-end tests cover P1/P2/P3, ordinary and child cases, illegal/policy/no-breach outcomes, every restriction, warning, suspension, ban, appeal and restoration.
- [ ] Production-equivalent moderator dashboard, queue, assignment, notes, search and notice delivery are exercised by every role.
- [ ] Permanent bans and sensitive disclosures enforce non-self-approved second-person review.
- [ ] Appeal reviewer separation and fallback documented second-look behavior are server enforced.
- [ ] All notice templates are reviewed for reporter identity, restricted evidence and appeal information.

### Security, records and compliance

- [ ] MOD-025 through MOD-037 permission-negative tests pass for every privileged query and mutation.
- [ ] Audit integrity, evidence quarantine, legal hold, deletion proof, export expiry and backup lifecycle are tested.
- [ ] CSEA portal roles/access, Priority 1 workflow, 999 fallback and separate one-/five-year clocks pass quarterly exercise.
- [ ] Role grants, MFA, break glass, leaver revocation and quarterly access review are evidenced.
- [ ] Monthly safety metrics reconcile to canonical reports, cases, decisions, audit events, complaints and appeals.
- [ ] DP complaint and incident exercises pass, including a mixed complaint and a processor breach.

### Release evidence and sign-off

- [ ] Every acceptance test ID in this document links to automated test output or signed exercise evidence.
- [ ] Every P0 has a named engineering DRI and operational DRI in the release tracker.
- [ ] No P0 is waived. A failed P0 blocks launch or disables the affected user-generated-content feature.
- [ ] P1 exceptions require a dated owner, risk acceptance, compensating control and completion date; P2 work is scheduled.
- [ ] Policy versions, templates, decision guide, metric dictionary, retention policy and permission matrix are frozen into the release evidence pack.
- [ ] Online Safety Lead and Engineering Lead sign the traceability matrix after reconciling every policy statement to a feature and acceptance result.

## 5. Out-of-scope clarification

Reporting private messages is **not applicable** because Dono does not provide private messaging. If any private or direct user-to-user communication is proposed, it is a material service change: launch is blocked until the Illegal-Content and Children's Risk Assessments are updated and a new P0 feature specification covers message reporting, evidence handling, blocking, grooming detection, recipient safety controls, retention and appeals.


---

## Approval and version control (v2.3)

| Field | Entry |
|---|---|
| Version | 2.3 |
| Version date | 6 August 2026 |
| Accountable owner | Amrit Kaur Rooprai |
| Status | Carried forward from v2.2 and amended by the block above, which prevails |
| Next scheduled review | 6 February 2027 |
