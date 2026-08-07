> ## v2.3 AMENDMENT BLOCK — READ FIRST
>
> **Version 2.3 — 6 August 2026.** This document is amended as set out below.
> **Where anything in the body conflicts with this block, this block prevails.**
>
> **Amendments applying to this document (Online Safety Act Procedures):**
>
> 1. **Public user-generated content is launch-blocked.** Campaign creation, campaign updates, comments, images, video and every other public user submission remain disabled until every mandatory acceptance test below has passed, with **dated evidence and a named accountable approver for each**. A failed or untested item keeps the feature disabled, regardless of engineering completion.
> 2. **Mandatory acceptance tests — all must pass:** (1) a visible report control on every item of user-generated content; (2) a reporting route that works when logged out; (3) automatic moderation-case creation capturing the content version, the reporter's reason, evidence and timestamps; (4) urgent escalation for credible threats, child-safety concerns, CSEA and other serious illegal content; (5) moderator powers to hide content, pause campaigns, restrict accounts and preserve evidence; (6) a complete action and decision log; (7) a functioning complaints and appeals process, including assignment to a different reviewer; (8) moderator training completed, response targets published, and an incident drill completed.
> 3. **Demonstrations before the tests pass** may use **only synthetic or staff-authored content**, with all public submissions, comments and campaign updates disabled.
> 4. **Comment moderation model at launch** is as set out in Community Guidelines clause 6.3: keyword and pattern filtering before publication; immediate publication of what passes; post-moderation; a report control on every comment; immediate hide, remove, restrict and suspend powers; repeat-offender thresholds; rate limiting; and full logging. Plain text only — no links, images or attachments.
> 5. **Rich media.** Campaign videos must be uploaded directly, scanned, **manually reviewed in full before publication and re-reviewed after any change**, with the moderator recording that the full video was reviewed. External links must be HTTPS, with the approved destination stored, re-review on edit, periodic redirect and destination checking, and immediate disable. Avatars are subject to automated image-safety scanning, moderator removal and re-review after change. **Comment attachments and hyperlinks remain disabled for beta.**
> 6. **Appeal independence.** No moderator may review an appeal against their own decision. Appeals and high-impact decisions go to a different trained moderator wherever reasonably practicable; where only one is available, the matter is escalated to another authorised founder. Self-review is not an available outcome.
> 7. **Response times are targets, not guarantees**, and every public statement must say so.
> 8. **CSEA** is governed by `dono-csea-reporting-procedure-v2.3.md`, which is the authoritative procedure. Its pre-launch checklist C1–C12 is a separate and additional gate.
> 9. **Escalation pathway.** Illegal content, child safety, credible threats and urgent safeguarding go immediately to the Online Safety lead or named deputy, outside the ordinary queue, with the escalation logged.
> 10. **Retention** of moderation records follows the risk-based schedule in Privacy Notice clause 7.1.
>
> **Revision 2.3.1 — verified build position, 5 August 2026. Read this before scoring anything.**
>
> - **There is no reporting system.** No report control on content, no logged-out reporting route, no report categories, no urgency routing, no counter-notice and no appeals workflow. What exists is a rudimentary report with a free-text reason and an administrator queue. **Acceptance tests 1, 2, 3, 4 and 7 therefore fail outright.**
> - **There is no user suspension or ban capability in the product at all.** The only options are delete the account or leave it. **Acceptance test 5 partly fails**: content can be hidden and campaigns unpublished, but accounts cannot be restricted.
> - **Audit logging is partial.** It cannot be altered or deleted through the application, which is good, but **refund decisions, role changes and account deletion are not logged at all**, and there is no export route. **Acceptance test 6 partly fails.**
> - **There is no monitoring or alerting of any kind**, so nothing surfaces an urgent report outside someone looking. **Acceptance test 4 fails.**
> - **No moderator training has been delivered and no incident drill has been run.** **Acceptance test 8 fails.**
> - **URLs are not blocked in comments** — attachments and images are. Item OS-22.
> - **No malware or image-safety scanning exists on any upload path.** Item AL-02.
>
> **Two things are genuinely strong and should be credited in any assessment:** every campaign, including its images, documents, video and every external link, **is reviewed by a person before publication** and again after any change; and **commenting is restricted to approved members of the society that owns the campaign**, so the population that can post is small, identified and society-controlled.
>
> **Conclusion: the launch block on public user-generated content is correct and must hold.** Nothing in the evidence supports relaxing it.
>
> **Revision 2.3.2 — settled age model:** Campaign and Society creators pass the Payment Provider's verified-DOB final age gate, fail-closed. Donors must be 18 or over and actively self-certify legal capacity; parent/guardian permission is not an alternative. Browsing remains open to all ages, so children are still likely to access the service. These statements supersede every contrary description in the carried-forward body.

---
# Dono — Online Safety Act Procedures

**Owner / Online Safety lead:** Amrit Kaur Rooprai — accountable for Dono's illegal-content, child-safety, and reporting-and-complaints duties
**Operational backup and appeal reviewer:** **Sashank**
**Second backup:** **Joe**
**Version:** Production operating baseline v2.3 — 6 August 2026
**Approved by:** _________________ **Date:** _________________
**Next review:** 31 January 2027, or on any material product change or serious incident.

Authoritative launch-state internal procedure. It describes the production children's-access position, CSEA reporting route, moderation triage and Online Safety complaints process. The **public-facing** complaints and appeals framework is clause 8 of the Community Guidelines; this procedure implements that framework and does not create a different route.

**Implementation and traceability:** [`ENGINEERING_MODERATION_REQUIREMENTS_v2.3.md`](ENGINEERING_MODERATION_REQUIREMENTS_v2.3.md) and [`ONLINE_SAFETY_TRACEABILITY_v2.3.md`](ONLINE_SAFETY_TRACEABILITY_v2.3.md).

## Changes in this update (special category / criminal data alignment)

This procedure now cross-refers to the revised **Appropriate Policy Document** (`dono-appropriate-policy-document-v2.3.md`), which supersedes `terms_v2.2/dono-special-category-criminal-data-policy.md`. Two operational consequences:

- **Triage (§3.2) must apply the APD §5 refusal rule at intake**, not only the priority levels below. A report that has no connection to the Platform, is speculative, or is being used to harass a user is declined without opening a case — it does not enter Priority 1–3 triage at all. Where a report is genuinely ambiguous, the moderator opens a case and lets triage resolve it; refusal at intake is for the reports that plainly fail APD §5.2, not a tool for closing borderline cases quickly.
- **Every case record must use allegation language** (APD §6.1) — "reported to have," "alleged," "suspected" — and carry a status field (reported / under review / upheld / not upheld / referred / declined). This is now a named requirement of this procedure, not only of the APD.

## Changes in v2.2

- The **children's access position is corrected**: 18+ for accounts, **no age restriction on donating**, and age is **declared, not verified**. The previous draft's reasoning is replaced because it relied on Stripe Identity as an age gate, which engineering has confirmed it is not.
- **CSEA roles are named**: Amrit as Organisation Administrator, **Sashank as Deputy Organisation Administrator**, **Joe as backup for Sashank**.
- **CSEA retention is corrected** from a single five-year period to the two periods the 2026 Regulations actually require.
- The complaints procedure is replaced by a cross-reference to the single framework, and the **address is corrected to `joindono.team@gmail.com`**, which is now the address used in every Dono document.
- Appeal reviewer corrected: Amrit no longer both triages and decides the appeal in the ordinary case.
- The moderation triage levels and production control-verification test are added.

---

## 3.1 Accountability

Amrit Kaur Rooprai is the named individual accountable for Online Safety Act compliance. Because Dono is a sole trader and not a company, there is no separate governing body; Amrit is accountable as the operator and maintains the evidence needed to explain Dono's moderation decisions, risk controls, residual risks and corrective actions.

| Role | Person |
|---|---|
| Accountable owner and final escalation point | **Amrit** |
| Operational backup and appeal reviewer | **Sashank** |
| Second backup | **Joe** |
| Emergency temporary restriction | **Any founder** may impose one |
| System availability and emergency restriction controls | Engineering |

## 3.2 Moderation triage

**Intake first.** Before a report enters triage, it is checked against the refusal criteria in APD §5.2 — no connection to the Platform, speculative with no stated basis, reporter cannot identify what happened, harassment pattern, or a requested action the underlying concern wouldn't justify even if true. A report that plainly meets one of those criteria is declined per APD §5.4 and does not create a case. CSEA reports and Priority 1 safety concerns are never declined at intake (APD §5.6) — they always proceed to triage.

Every other report creates a case. Cases are triaged into three levels.

**Priority 1 — immediate danger or exceptionally serious content.** Suspected child sexual abuse material; a credible threat to life; terrorist content or an operational threat; non-consensual intimate imagery; active encouragement of imminent suicide or serious self-harm; a campaign facilitating an ongoing serious offence.

*Response:* immediately prevent further public access or campaign activity; send an urgent alert to Amrit and the backup; restrict access to the evidence; consider police, emergency-service or NCA escalation; record every action and its time. **Restriction and alert are immediate.**

**Priority 2 — potentially illegal or materially harmful.** Fraud or dishonest fundraising; hate or harassment; sale or promotion of unlawful goods; credible criminal allegations; repeated targeting of an individual.

*Response:* prompt human review, target **within 24 hours**; temporarily restrict the material where continued exposure creates a meaningful risk; decide whether to remove, restore or request further information.

**Priority 3 — ordinary policy dispute.** Misleading but not obviously fraudulent descriptions; offensive comments; intellectual-property complaints; disagreements about campaign accuracy.

*Response:* review through the normal queue, target **within three working days**.

These are Dono's **operational targets, not statutory deadlines**, and must not be published as contractual guarantees.

**Two possible conclusions.** A moderator may conclude either that Dono has reasonable grounds to consider the content illegal, **or** that Dono cannot confidently determine legality but the content nevertheless breaches the Community Guidelines or the Terms. Either is sufficient to act. Moderators are not required to decide whether a criminal offence has been committed.

**Moderator powers.** Role-authorised moderators can unpublish a campaign; hide a campaign update, comment, image or document; restrict content from public viewing; pause campaign activity and new donations; issue warnings; suspend or permanently ban an account; and restore content, campaign functionality or account access following review. Each action requires a reason, creates a tamper-evident audit event and is reversible except where the action is a lawful permanent deletion after retention expires.

## 3.3 Children's access assessment

**The position, stated accurately.**

- **Anyone of any age may view public campaign pages**, without logging in. Campaign links are shareable, so a child can reach any public page via search, a shared link or social media.
- **Donors must be 18 or over**, with or without an account. Checkout requires active confirmation that the Donor is 18 or over and has legal capacity — a **declaration, not a verified check**. Parent/guardian permission is not an alternative.
- **Only people aged 18 or over may create an account**, and therefore only they may create a campaign or post a comment. **Age is established by a declared date of birth.**
- Campaign and Society creators additionally complete the Payment Provider's identity process. **The government-document date of birth returned by that process is the fail-closed final creator age gate.**
- Children **cannot lawfully author Campaigns, comments or Donations**, but they can read everything published and may attempt to bypass declaration-based comment or Donor gates.

**Conclusion: children are likely to access the service.** A declared date of birth is not highly effective age assurance, so Dono cannot conclude that it excludes under-18s. Dono therefore operates as a service likely to be accessed by children and has completed a full children's risk assessment.

**Decision.** Dono operates **child-safe by default** rather than deploying age assurance to exclude under-18s. The reasons: campaign creation and commenting — the content-authoring roles — are already restricted to adults; the higher-risk formats associated with children's online harms are absent from the product (no private messaging, no livestreaming, no private groups, no disappearing content, no recommendation feed); and adding age assurance to browsing and donating would not remove the residual risk, which sits at the point of payment rather than at the point of access.

**What child-safe by default means in practice:**

- **Every campaign is reviewed by a person before publication**, checking for content unsuitable for a mixed-age audience and not only for fraud.
- **Comments are post-moderated**, with a report control on every comment and removal on report. **Links and attachments are not permitted in comments** — a deliberate choice, because comments are the one surface visible to children that is not pre-moderated.
- **No targeting of children.** Dono's marketing, prompts and design must not be built to appeal specifically to under-18s: no gamified donation mechanics aimed at children, no youth-specific targeting.
- **A checkout confirmation at the point of payment**, which is where the residual risk to children actually sits.
- **A parent or guardian route**: a parent or guardian may ask about, correct or delete a child's data, and may request a refund of a donation made without their permission — an objective refund ground under the Refund and Dispute Policy.
- **Escalation path** for harmful content, per 3.4 and 3.2.

**Residual risk, stated honestly.** The most significant residual risk is financial exploitation of a child donor: a verified adult creator could write a campaign that emotionally pressures a young reader, and nothing upstream — identity verification, pre-publication review — sits at the point where a child parts with money. The checkout confirmation is a real but limited mitigation. This is recorded as **Medium** in the Children's Risk Assessment and is reviewed after the first six months of operation.

**Review trigger.** Revisit if Dono introduces direct messaging, opens campaign creation to under-18s, permits links or attachments in comments, or if evidence emerges that a significant proportion of users are children.

## 3.4 CSEA reporting route

**Duty.** Under section 66 of the Online Safety Act 2023 and the Online Safety (CSEA Content Reporting by Regulated User-to-User Service Providers) Regulations 2026, in force from **7 April 2026**, in-scope user-to-user services must report all detected and unreported child sexual exploitation and abuse content to the National Crime Agency. The duty is absolute once content is detected — it does not depend on volume or on an assessed level of risk.

**Registration and named people.**

| Role | Person | Status |
|---|---|---|
| Organisation Administrator | **Amrit** | Registered; access tested through the NCA CSEA Industry Reporting Portal |
| Deputy Organisation Administrator | **Sashank** | Registered; access tested |
| Backup for the Deputy | **Joe** | Emergency access and escalation route tested |
| Authorised reporters | Amrit and Sashank, subject to current NCA eligibility | Individual reporter access tested |
| Emergency contact | Maintained in the restricted operational contact register | Tested through the quarterly emergency exercise |

Portal registration and access are maintained continuously and tested quarterly using harmless test data.

**Scope — what counts as "detected".** CSEA content is detected when Dono becomes aware of it, however that happens: a user report, a campaign or comment flagged in moderation, or something a team member notices in the ordinary course of review. It does not need to be confirmed by law enforcement for the duty to arise — awareness is enough. This duty does **not** require Dono to introduce proactive detection or hash-matching technology; it requires Dono to report what it actually detects.

### Procedure

**Step 1 — restrict access immediately.** Anyone who encounters suspected CSEA content must: stop ordinary review; **not download it to a personal computer or phone; not screenshot it; not forward it by email, Slack, WhatsApp or any other channel**; restrict the content from public access; prevent further sharing; freeze the relevant campaign or account where necessary; and notify Amrit and the deputy through the emergency channel. Only the minimum number of trained people may access the quarantined material.

**Step 2 — preserve the system data.** The system preserves what is available, without asking the moderator to make extra copies: content and file identifier; campaign, comment or profile URL; uploader and relevant recipient account identifiers; upload date and time; account email and telephone number; upload IP address and port information where collected; recent relevant IP information held by Dono; file metadata; file hash where technically available; how Dono became aware; linked reports and previous NCA report reference numbers; and actions taken with their timestamps. **Dono does not begin collecting categories of information it does not otherwise hold merely to fill in the form** — the obligation concerns information available to the provider.

**Step 3 — decide the priority.** Use the NCA's three levels. *Priority 1:* current or imminent danger, an offence happening or about to happen, an immediate safeguarding need, or a threat to life. *Priority 2:* risk in the near future, evidence of contact offending, recently generated material, or another reason swift action is required. *Priority 3:* neither of the above.

Submit Priority 1 **immediately**; Priority 2 **as soon as reasonably practicable** (Dono's internal standard: restrict and report the same day); Priority 3 **without undue delay** (Dono's internal standard: report no later than the next working day). The latter two are internal standards, not statutory hour limits.

**Step 4 — check for duplicate reporting.** Before submitting, record: whether Dono has already reported the same incident; whether the same material was included in an earlier report; and whether another reporting arrangement, such as NCMEC, has already covered it. **The same content should not be reported through both NCMEC and the NCA.** Where a further user shares previously reported content, a further report may still be required and must be linked to the earlier reference.

> Previously reported? Yes / No / Unknown · Reporting body: NCA / NCMEC / other · Reference number: · Reason a new report is required:

**Step 5 — submit through the portal.** The authorised reporter completes a checklist covering: reporter and organisation details; the content or incident; how it was detected; the platform and URL; upload date and time; related report numbers; the priority assessment; uploader, sender or recipient details held by Dono; account, email, telephone and IP information; relevant metadata or hash; any emergency or safeguarding action already taken; and confirmation that all reasonably available information has been provided. **Store the portal-generated report reference in the incident record.**

**Step 6 — remove from public view** as soon as it is safe to do so without destroying evidence needed for the report.

**Emergency route.** Where there is an imminent risk to a child and Amrit cannot be reached, **call 999** and report to local police.

**False reporting.** Knowingly submitting false information as part of a CSEA report is a criminal offence. This procedure is only for genuine, good-faith detections.

### Retention — two separate clocks

Under the 2026 Regulations:

- the **unique NCA report reference number is retained for five years**; and
- the **detected CSEA content, the information submitted, the information used to make the CSEA judgement, and relevant associated user data are retained for one year** from the report, in restricted storage, unless the NCA, the police or another competent authority lawfully requires longer preservation. The material is then securely deleted.

**Do not write "all CSEA evidence is retained for five years".** Implement two automated deletion dates:

- `report_reference_delete_at` = report date + 5 years
- `restricted_evidence_delete_at` = report date + 1 year

The case-management service applies both deletion dates automatically, blocks ordinary moderator access to restricted evidence and records deletion or an authorised legal hold in the audit log.

### Training

Everyone capable of reviewing user reports receives a short, **non-graphic** training session covering: what may amount to CSEA content, including grooming material and not only images; when to stop viewing; how to restrict content; how to trigger the specialist escalation; the three priority levels; the 999 route; the prohibition on personal downloads, screenshots and forwarding; confidentiality and account security; the portal reporter's role; and staff welfare, including the ability to step away after exposure.

Amrit and the deputy receive detailed portal training. Other moderators receive recognition-and-escalation training and do not undertake prolonged specialist assessment. The training register records completion, refresher dates and exercise participation.

## 3.5 Online Safety complaints

**The complaints and appeals framework is clause 8 of the Community Guidelines.** That is the single framework, and this document does not restate it differently. In summary, so that internal readers have it to hand:

- **One address for everything: `joindono.team@gmail.com`**, plus the in-product report controls and the public reporting form at `/report`.
- **Two distinct things.** A **report** says "this content may be illegal or harmful". A **complaint or appeal** says "Dono handled my report wrongly", "Dono wrongly removed my content", or "Dono wrongly suspended my account".
- **Who may complain:** a person whose content, campaign or account was moderated; a person who reported content and believes Dono failed to act or mishandled it; anyone, including a non-user, who believes Dono is not complying with its illegal-content, child-safety, reporting, complaints or freedom-of-expression duties; and children, or adults on their behalf, including about content harmful to children.
- **Acknowledge within five Working Days. Outcome targeted within 30 days.** Urgent matters bypass both.
- **Who decides:** a person who was **not substantially involved in the original decision** — ordinarily **Sashank** where Amrit made the original decision, and Amrit where Sashank did. Where the team's size genuinely prevents separation, the original decision-maker may reconsider, but only as a documented, genuine second look at the original evidence and any new information. **Dono does not promise independence it cannot supply.** External legal or specialist advice may be taken for complex or high-risk cases.
- **Outcomes:** the original decision is confirmed, varied or reversed. Where reversed, content, campaign functionality or account access is restored so far as reasonably possible, the reason is recorded, and the case record is corrected to reflect the reversal (APD §6.1).
- **Correction and challenge for allegation subjects** follows APD §6.2: a person subject to an accepted allegation may ask Dono to correct a factual inaccuracy in the record, may be told a decision was made about them where doing so would not prejudice an ongoing safeguarding, fraud, legal or NCA matter, and may appeal through this same framework.

## Records and metrics

Dono's compliance dashboard produces a monthly record of: reports received by category and reporting route; time to first review; time to restriction or removal; cases upheld, rejected and unresolved; reports involving children; external referrals; appeals received; decisions reversed; restorations; repeat offenders and recurring campaign patterns; queue age; moderator activity; and service-target breaches. Monthly snapshots are immutable, exportable and linked to the applicable policy version.

## Production control verification

Dono continuously verifies that:

1. every user-generated-content surface exposes a working report control, including campaign updates, images and documents;
2. a logged-out person can submit a report and receives a tracking reference when contact details are supplied;
3. every report creates a case, enters the correct queue and triggers urgent alerts where applicable;
4. a moderator can immediately restrict content, pause new donations, suspend an account and later restore each state;
5. every privileged action, reason, evidence access and notification is logged;
6. affected users and reporters can submit the correct complaint or appeal and track its status;
7. a reversed decision restores the affected content or account and records the restoration;
8. Priority 1, CSEA and emergency-response exercises succeed at least quarterly;
9. automated retention and legal-hold tests preserve and delete the correct records at the correct time;
10. role and permission tests prevent unauthorised access and enforce appeal-reviewer separation;
11. the public wording matches the production system; and
12. the risk assessments identify the controls Dono operates and the evidence used to assess their effectiveness.

Failed controls create a P0 incident, alert the Online Safety lead and Engineering owner, and block launch or trigger feature disablement until the control passes.


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
