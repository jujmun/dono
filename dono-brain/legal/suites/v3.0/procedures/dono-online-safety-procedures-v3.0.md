# Online Safety Act Procedures — Dono

**Document:** Internal operating procedure for Dono's Online Safety Act 2023 duties
**Version:** 3.0
**Version date:** 7 August 2026
**Effective from:** on publication approval (see approval block)
**Service provider:** Amrit Kaur Rooprai, sole trader, trading as Dono
**Online Safety lead:** Amrit Kaur Rooprai · **Operational backup and appeal reviewer:** Sashank · **Second backup:** Joe
**Supersedes:** v2.3 (6 August 2026) and all earlier versions, retained unaltered in the version archive
**Status:** Clean consolidated procedure. States the current position only.
**Next review:** 7 February 2027, or on any material product change or serious incident.

**Implementation and traceability:** [`../../../../engineering/legal-launch/ENGINEERING_MODERATION_REQUIREMENTS_v2.3.md`](../../../../engineering/legal-launch/ENGINEERING_MODERATION_REQUIREMENTS_v2.3.md) and [`../../../../engineering/legal-launch/ONLINE_SAFETY_TRACEABILITY_v2.3.md`](../../../../engineering/legal-launch/ONLINE_SAFETY_TRACEABILITY_v2.3.md).

---

> ## THE LAUNCH BLOCK
>
> **All public user-generated content is disabled and remains disabled.**
>
> Campaign creation, campaign updates, comments, images, video and every other public user submission stay off until **every** mandatory acceptance test in section 2 has passed, each with **dated evidence and a named accountable approver**.
>
> **A failed or untested item keeps the feature disabled, regardless of engineering completion.** Engineering saying a feature is done is not evidence that the control works.
>
> **On the evidence of 5 August 2026, six of the eight acceptance tests fail and two partly fail. Nothing supports relaxing the block.**
>
> Demonstrations before the tests pass may use **only synthetic or staff-authored content**, with all public submissions, comments and campaign updates disabled.

---

## 1. Accountability

Amrit Kaur Rooprai is the named individual accountable for Online Safety Act compliance. Because Dono is a sole trader and not a company, there is no separate governing body. Amrit is accountable as the operator and maintains the evidence needed to explain Dono's moderation decisions, risk controls, residual risks and corrective actions.

| Role | Person |
|---|---|
| Accountable owner and final escalation point | **Amrit** |
| Operational backup and appeal reviewer | **Sashank** |
| Second backup | **Joe** |
| Emergency temporary restriction | **Any founder** may impose one |
| System availability and emergency restriction controls | Engineering |

---

## 2. Mandatory acceptance tests — the gate on public user-generated content

Every test must pass, with dated evidence and a named approver, before the corresponding feature is enabled. **Status is recorded against the verified engineering evidence of 5 August 2026, not against intent.**

| # | Acceptance test | Status | Evidence / gap |
|---|---|---|---|
| 1 | **A visible report control on every item of user-generated content** — campaigns, updates, comments, images and documents | **FAIL** | No report control exists on content. What exists is a rudimentary report with a free-text reason and an administrator queue |
| 2 | **A reporting route that works when logged out** | **FAIL** | No logged-out reporting route exists |
| 3 | **Automatic moderation-case creation** capturing the content version seen, the reporter's reason, evidence and timestamps | **FAIL** | No case creation, no report categories, no content-version capture |
| 4 | **Urgent escalation** for credible threats, child-safety concerns, CSEA and other serious illegal content | **FAIL** | No urgency routing exists, and **no monitoring or alerting of any kind exists**, so nothing surfaces an urgent report outside someone happening to look |
| 5 | **Moderator powers** to hide content, pause campaigns, restrict accounts and preserve evidence | **PARTIAL FAIL** | Content can be hidden and campaigns unpublished. **There is no user suspension or ban capability in the product at all** — the only options are to delete the account or leave it |
| 6 | **A complete action and decision log** | **PARTIAL FAIL** | Audit logging cannot be altered or deleted through the application, which is good. But **refund decisions, role changes and account deletion are not logged at all**, and there is no export route |
| 7 | **A functioning complaints and appeals process**, including assignment to a different reviewer | **FAIL** | No counter-notice and no appeals workflow exist |
| 8 | **Moderator training completed, response targets published, and an incident drill completed** | **FAIL** | No moderator training has been delivered and no incident drill has been run |

**Two controls are genuinely in place and are credited in every assessment:**

1. **Every campaign — including its images, documents, full video and every external link — is reviewed by a person before publication**, and again after any change.
2. **Commenting is restricted to approved members of the Society that owns the Campaign**, so the population that can post is small, identified and Society-controlled.

**Further gaps recorded, not glossed:** URLs are not blocked in comments, though attachments and images are (item OS-22). **No malware or image-safety scanning exists on any upload path** (item AL-02).

**Conclusion: the launch block is correct and must hold.**

---

## 3. Moderation triage

### 3.1 Intake — the refusal check comes first

Before a report enters triage it is checked against the refusal criteria in Appropriate Policy Document §5.2: no connection to the Platform; speculative with no stated basis; the reporter cannot identify what happened; a harassment pattern; or a requested action the underlying concern would not justify even if true.

A report plainly meeting one of those criteria is **declined under APD §5.4 and does not create a case**. Only the fact, category, date and reason for refusal are retained, for 12 months — **never the substance of the allegation**.

**CSEA reports and Priority 1 safety concerns are never declined at intake (APD §5.6).** They always proceed to triage.

**A reporter is never required to decide whether conduct is criminal.**

### 3.2 Priority levels

Every other report creates a case, capturing **the content version the reporter saw**, the category, the description, timestamps and the reporter's contact details where provided.

**Priority 1 — immediate danger or exceptionally serious content.** Suspected child sexual abuse material; a credible threat to life; terrorist content or an operational threat; non-consensual intimate imagery; active encouragement of imminent suicide or serious self-harm; a campaign facilitating an ongoing serious offence.

*Response:* immediately prevent further public access or campaign activity; send an urgent alert to Amrit and the backup; restrict access to the evidence; consider police, emergency-service or NCA escalation; record every action and its time. **Restriction and alert are immediate.**

**Priority 2 — potentially illegal or materially harmful.** Fraud or dishonest fundraising; hate or harassment; sale or promotion of unlawful goods; credible criminal allegations; repeated targeting of an individual.

*Response:* prompt human review, target **within 24 hours**; temporarily restrict the material where continued exposure creates a meaningful risk; decide whether to remove, restore or request further information.

**Priority 3 — ordinary policy dispute.** Misleading but not obviously fraudulent descriptions; offensive comments; intellectual-property complaints; disagreements about campaign accuracy.

*Response:* review through the normal queue, target **within three working days**.

> **These are operational targets, not statutory deadlines and not guarantees.** Every public statement of a response time must say so. Urgent safety matters are handled immediately and outside all targets.

### 3.3 Escalation pathway

**Illegal content, child safety, credible threats and urgent safeguarding go immediately to the Online Safety lead or the named deputy, outside the ordinary queue, with the escalation logged.** They do not wait in a queue and are not triaged by an ordinary moderator first.

> **Gap:** the alerting that would make this reliable does not exist (acceptance test 4). Until it does, escalation depends on a person noticing, which is not an adequate control and is why the launch block holds.

### 3.4 Two possible conclusions

A moderator may conclude either that Dono has **reasonable grounds to consider the content illegal**, or that Dono **cannot confidently determine legality but the content nevertheless breaches** the Community Guidelines or the Terms. Either is sufficient to act. **Moderators are not required to decide whether a criminal offence has been committed.**

### 3.5 Moderator powers

Role-authorised moderators can unpublish a campaign; hide a campaign update, comment, image or document; restrict content from public viewing; pause campaign activity and new donations; issue warnings; **suspend or permanently ban an account**; and restore content, campaign functionality or account access following review.

Each action requires a reason, creates a tamper-evident audit event, and is reversible except where it is a lawful permanent deletion after retention expires.

> **Gap:** account suspension and ban do not exist in the product (acceptance test 5). Until built, the only account-level action is deletion, which is disproportionate and destroys evidence.

### 3.6 Comment moderation model

As set out in Community Guidelines clause 6.3: keyword and pattern filtering before publication; immediate publication of what passes; post-moderation; a report control on every comment; immediate hide, remove, restrict and suspend powers; repeat-offender thresholds; rate limiting; and full logging.

**Plain text only — no links, images or attachments.** Comments are the one surface visible to children that is not pre-moderated, which is why the format is deliberately constrained.

> **Gap:** URL blocking in comments is not implemented (OS-22). Attachments and images are blocked.

### 3.7 Rich media

| Format | Rule |
|---|---|
| **Campaign video** | Uploaded directly, scanned, and **manually reviewed in full before publication** and re-reviewed after any change. The moderator records that the **full** video was reviewed |
| **External links** | Must be HTTPS. The approved destination is stored; re-review on edit; periodic redirect and destination checking; immediate disable |
| **Avatars** | Automated image-safety scanning, moderator removal, and re-review after change |
| **Comment attachments and hyperlinks** | **Disabled for beta** |

> **Gap:** no malware or image-safety scanning exists on any upload path (AL-02). Until it does, video and avatar scanning are manual only.

### 3.8 Retention of moderation records

Risk-based, per Privacy Notice clause 7.1 and ROPA row 17 — **not a flat six years**:

| Record | Period |
|---|---|
| Spam and filter blocks | 6 months |
| Ordinary community-rule cases | 12 months |
| Declined-report minimal log | 12 months — **substance never retained** |
| Repeat-offender and ban-evasion history | 3 years from last action |
| Illegal content other than CSEA | 3 years from action |
| Fraud, financial-misconduct and safeguarding cases | 6 years from closure |
| CSEA content and prescribed supporting information | 1 year from report |
| NCA CSEA report reference | 5 years from report |

---

## 4. Children's access assessment

### 4.1 The position, stated accurately

- **Anyone of any age may view public campaign pages**, without logging in. Campaign links are shareable, so a child can reach any public page via search, a shared link or social media.
- **Donors must be 18 or over**, with or without an account. Checkout requires an **active** confirmation that the Donor is 18 or over and has legal capacity — a **declaration, not a verified check**. **Parent or guardian permission is not an alternative.**
- **Only people aged 18 or over may create an account**, and therefore only they may create a Campaign or post a comment. Account age is established by a declared date of birth.
- **Campaign and Society creators additionally pass the Payment Provider's identity process. The government-document date of birth it returns is the fail-closed final creator age gate.** Missing, inconsistent or under-18 results fail closed. There is no manual override.
- Children **cannot lawfully author Campaigns, comments or Donations**, but they can read everything published and may attempt to bypass declaration-based gates.

### 4.2 Conclusion

**Children are likely to access the service.** A declared date of birth is not highly effective age assurance, so Dono cannot conclude that it excludes under-18s. Dono therefore operates as a service likely to be accessed by children and has completed a full Children's Risk Assessment and a separate ICO Children's Code assessment.

### 4.3 Decision — child-safe by default

Dono operates **child-safe by default** rather than deploying age assurance to exclude under-18s from browsing. The reasons:

1. campaign creation and commenting — the content-authoring roles — are already restricted to adults, and creators are gated on a government-document date of birth;
2. the higher-risk formats associated with children's online harms are **absent from the product**: no private messaging, no livestreaming, no private groups, no disappearing content, no recommendation feed; and
3. adding age assurance to browsing would not remove the residual risk, which sits at the **point of payment**, not at the point of access.

**What child-safe by default means in practice:**

- **Every campaign is reviewed by a person before publication**, checking for content unsuitable for a mixed-age audience and not only for fraud.
- **Comments are post-moderated**, restricted to approved Society members, with a report control on every comment, and **no links or attachments**.
- **No targeting of children.** Marketing, prompts and design must not be built to appeal specifically to under-18s: no gamified donation mechanics aimed at children, no youth-specific targeting.
- **An active confirmation at checkout**, which is where the residual risk actually sits.
- **A parent or guardian route**: a parent or guardian may ask about, correct or delete a child's data, and may request a refund of a donation made without their permission — an **objective refund ground** requiring no proof of materiality, reliance or causation.
- **Escalation path** for harmful content, per §3.3 and §5.

### 4.4 Residual risk, stated honestly

The most significant residual risk is **financial exploitation of a child donor**: a verified adult creator could write a campaign that emotionally pressures a young reader, and nothing upstream — identity verification, pre-publication review — sits at the point where a child parts with money. The checkout confirmation is a real but limited mitigation, **and it is not yet built** (checklist AG-01, CH-04).

Recorded as **Medium** in the Children's Risk Assessment, expressly accepted in DPIA §8 as accepted residual risk A2, and reviewed after the first six months of operation.

### 4.5 Review triggers

Revisit if Dono introduces direct messaging, opens campaign creation to under-18s, permits links or attachments in comments, changes the donor age control, or if evidence emerges that a significant proportion of users are children — or on any change to Ofcom's expectations on age assurance for this kind of service.

---

## 5. CSEA reporting route

**The authoritative procedure is `dono-csea-reporting-procedure-v3.0.md`.** Its pre-launch checklist C1–C12 is a **separate and additional gate** to section 2 of this document. What follows is the operational summary.

### 5.1 Duty

Under section 66 of the Online Safety Act 2023 and the Online Safety (CSEA Content Reporting by Regulated User-to-User Service Providers) Regulations 2026, in force from **7 April 2026**, in-scope user-to-user services must report all detected and unreported child sexual exploitation and abuse content to the National Crime Agency. **The duty is absolute once content is detected** — it does not depend on volume or on an assessed level of risk.

### 5.2 Registration and named people — ACTUAL STATUS

| Role | Person | Status |
|---|---|---|
| Organisation Administrator | **Amrit** | **NOT CONFIRMED.** NCA has not confirmed registration or eligible-user position |
| Deputy Organisation Administrator | **Sashank** | **NOT CONFIRMED** |
| Backup for the Deputy | **Joe** | **NOT CONFIRMED** |
| Authorised reporters | Amrit and Sashank, subject to NCA eligibility | **NOT CONFIRMED** |
| Emergency contact | Restricted operational contact register | Register exists; quarterly exercise **not yet run** |

> **The CSEA reporting route must not be described as operational, tested or registered until the NCA confirms registration and eligible users, and the route has been trained and test-submitted.** No earlier version's claim to the contrary survives into v3.0.
>
> **Until then, the emergency route in §5.6 is the operative route for an imminent risk to a child.**

### 5.3 Scope — what counts as "detected"

CSEA content is detected when Dono becomes aware of it, however that happens: a user report, a campaign or comment flagged in moderation, or something a team member notices in the ordinary course of review. **It does not need to be confirmed by law enforcement for the duty to arise — awareness is enough.**

This duty does **not** require Dono to introduce proactive detection or hash-matching technology. It requires Dono to report what it actually detects.

### 5.4 Procedure

**Step 1 — restrict access immediately.** Anyone encountering suspected CSEA content must: stop ordinary review; **not download it to a personal computer or phone; not screenshot it; not forward it by email, Slack, WhatsApp or any other channel**; restrict the content from public access; prevent further sharing; freeze the relevant campaign or account where necessary; and notify Amrit and the deputy through the emergency channel. **Only the minimum number of trained people may access the quarantined material.**

**Step 2 — preserve the system data**, without asking the moderator to make extra copies: content and file identifier; campaign, comment or profile URL; uploader and relevant recipient account identifiers; upload date and time; account email and telephone number; upload IP address and port information where collected; recent relevant IP information held by Dono; file metadata; file hash where technically available; how Dono became aware; linked reports and previous NCA reference numbers; and actions taken with timestamps.

**Dono does not begin collecting categories of information it does not otherwise hold merely to fill in the form** — the obligation concerns information available to the provider.

**Step 3 — decide the priority**, using the NCA's three levels. *Priority 1:* current or imminent danger, an offence happening or about to happen, an immediate safeguarding need, or a threat to life. *Priority 2:* risk in the near future, evidence of contact offending, recently generated material, or another reason swift action is required. *Priority 3:* neither of the above.

Submit Priority 1 **immediately**; Priority 2 **as soon as reasonably practicable** (internal standard: restrict and report the same day); Priority 3 **without undue delay** (internal standard: no later than the next working day). The latter two are internal standards, not statutory hour limits.

**Step 4 — check for duplicate reporting.** Record whether Dono has already reported the same incident; whether the same material was in an earlier report; and whether another arrangement such as NCMEC has already covered it. **The same content should not be reported through both NCMEC and the NCA.** Where a further user shares previously reported content, a further report may still be required and must be linked to the earlier reference.

> Previously reported? Yes / No / Unknown · Reporting body: NCA / NCMEC / other · Reference number: · Reason a new report is required:

**Step 5 — submit through the portal**, completing the checklist in the CSEA procedure. **Store the portal-generated report reference in the incident record.**

**Step 6 — remove from public view** as soon as it is safe to do so without destroying evidence needed for the report.

### 5.5 Retention — two separate clocks

- **NCA report reference: 5 years** — `report_reference_delete_at` = report date + 5 years
- **Detected content, the information submitted, the information used to make the CSEA judgement and relevant associated user data: 1 year** in restricted storage — `restricted_evidence_delete_at` = report date + 1 year

Unless the NCA, the police or another competent authority lawfully requires longer preservation under a **documented** hold. The material is then securely deleted.

> **Never write "all CSEA evidence is retained for five years".** Two clocks, applied automatically, with ordinary moderator access blocked and deletion or authorised legal hold recorded in the audit log.
>
> **Gap:** neither clock is built (DPIA risk L-16).

### 5.6 Emergency route

**Where there is an imminent risk to a child and Amrit cannot be reached, call 999 and report to local police.** This route does not depend on NCA portal registration and is available now.

### 5.7 False reporting

Knowingly submitting false information as part of a CSEA report is a criminal offence. This procedure is only for genuine, good-faith detections.

### 5.8 Training

Everyone capable of reviewing user reports receives a short, **non-graphic** training session covering: what may amount to CSEA content, including grooming material and not only images; when to stop viewing; how to restrict content; how to trigger specialist escalation; the three priority levels; the 999 route; the prohibition on personal downloads, screenshots and forwarding; confidentiality and account security; the portal reporter's role; and staff welfare, including the ability to step away after exposure.

Amrit and the deputy receive detailed portal training. Other moderators receive recognition-and-escalation training and do not undertake prolonged specialist assessment. A training register records completion, refresher dates and exercise participation.

> **Status: no training has been delivered and no register entries exist** (acceptance test 8).

---

## 6. Online Safety complaints and appeals

**The framework is clause 8 of the Community Guidelines.** That is the single framework; this document implements it and does not create a different route.

- **One address for everything: `joindono.team@gmail.com`**, plus the in-product report controls and the public reporting form at `/report`.
- **Two distinct things.** A **report** says "this content may be illegal or harmful". A **complaint or appeal** says "Dono handled my report wrongly", "Dono wrongly removed my content", or "Dono wrongly suspended my account".
- **Who may complain:** a person whose content, campaign or account was moderated; a person who reported content and believes Dono failed to act or mishandled it; anyone, including a non-user, who believes Dono is not complying with its illegal-content, child-safety, reporting, complaints or freedom-of-expression duties; and children, or adults on their behalf, including about content harmful to children.
- **Clocks run from notification, not from the decision.** Acknowledgement **targeted** within five Working Days; outcome **targeted** within 30 days. Urgent matters bypass both. These are targets, not guarantees.

### 6.1 Appeal independence

**No moderator may review an appeal against their own decision.** Appeals and high-impact decisions go to a **different trained moderator** wherever reasonably practicable — ordinarily **Sashank** where Amrit made the original decision, and Amrit where Sashank did.

**Where only one reviewer is available, the matter is escalated to another authorised founder. Self-review is not an available outcome.** Where separation is genuinely impossible even then, the original decision-maker may reconsider, but only as a documented, genuine second look at the original evidence and any new information, recorded as such.

**Dono does not promise independence it cannot supply.** External legal or specialist advice may be taken for complex or high-risk cases.

### 6.2 Outcomes

The original decision is confirmed, varied or reversed. Where reversed, content, campaign functionality or account access is restored so far as reasonably possible, the reason is recorded, and the case record is corrected to reflect the reversal (APD §6.1).

### 6.3 Correction and challenge for allegation subjects

Per APD §6.2: a person subject to an accepted allegation may ask Dono to correct a factual inaccuracy in the record; may be told a decision was made about them where doing so would not prejudice an ongoing safeguarding, fraud, legal or NCA matter; and may appeal through this same framework. **An allegation is recorded as an allegation and never as a finding.**

---

## 7. Records and metrics — REQUIRED, NOT YET OPERATING

A compliance dashboard must produce a **monthly** record of: reports received by category and route; time to first review; time to restriction or removal; cases upheld, rejected and unresolved; reports involving children; external referrals; appeals received; decisions reversed; restorations; repeat offenders and recurring campaign patterns; queue age; moderator activity; and service-target breaches.

Monthly snapshots must be immutable, exportable and linked to the applicable policy version.

> **Status: the dashboard does not exist.** No metric above is currently produced. This section states a requirement, not a description.

---

## 8. Production control verification — REQUIRED, NOT YET SATISFIED

Dono must continuously verify that:

| # | Control | Status |
|---|---|---|
| 1 | Every user-generated-content surface exposes a working report control, including campaign updates, images and documents | **Not satisfied** |
| 2 | A logged-out person can submit a report and receives a tracking reference where contact details are supplied | **Not satisfied** |
| 3 | Every report creates a case, enters the correct queue and triggers urgent alerts where applicable | **Not satisfied** |
| 4 | A moderator can immediately restrict content, pause new donations, suspend an account and later restore each state | **Partly** — no account suspension |
| 5 | Every privileged action, reason, evidence access and notification is logged | **Partly** — refunds, role changes and deletion not logged |
| 6 | Affected users and reporters can submit the correct complaint or appeal and track its status | **Not satisfied** |
| 7 | A reversed decision restores the affected content or account and records the restoration | **Not satisfied** |
| 8 | Priority 1, CSEA and emergency-response exercises succeed at least quarterly | **Not satisfied** — never run |
| 9 | Automated retention and legal-hold tests preserve and delete the correct records at the correct time | **Not satisfied** — no retention job exists |
| 10 | Role and permission tests prevent unauthorised access and enforce appeal-reviewer separation | **Not satisfied** |
| 11 | The public wording matches the production system | **Not satisfied** — the product serves a draft legal stub |
| 12 | The risk assessments identify the controls Dono operates and the evidence used to assess their effectiveness | **Satisfied at v3.0** — this document and the two risk assessments |

**A failed control creates a P0 incident, alerts the Online Safety lead and the Engineering owner, and blocks launch or triggers feature disablement until the control passes.**

---

## 9. Approval block — SIGNATURE REQUIRED

> **This block is unsigned. This procedure is not approved, and the launch block on public user-generated content stands.**

**I confirm that I have reviewed this procedure, that the acceptance-test statuses in section 2 and the control statuses in section 8 reflect the verified position rather than intended functionality, and that I approve this procedure.**

| Field | Entry |
|---|---|
| Approver name | Amrit Kaur Rooprai |
| Role | Online Safety lead and accountable owner |
| Document version approved | 3.0 |
| Public user-generated content enabled? | ☐ Yes — all eight acceptance tests passed with evidence on ____________ · ☑ **No — six fail, two partly fail** |
| CSEA route confirmed operational by NCA? | ☐ Yes, on ____________ · ☑ **No** |
| Signature | ______________________ |
| Date of approval | ______________________ |

**Reviewed by:** Sashank (deputy and appeal reviewer) — Signature ______________________  Date ______________

---

## 10. Version control

| Field | Entry |
|---|---|
| Version | 3.0 |
| Version date | 7 August 2026 |
| Effective from | On publication approval |
| Accountable owner | Amrit Kaur Rooprai |
| Prepared by | Legal consolidation, 7 August 2026 |
| Approved by | *(signature required — section 9)* |
| Status | **Not approved.** Launch block in force |
| Supersedes | v2.3 (6 August 2026) and all earlier versions |
| Next scheduled review | 7 February 2027, or on any material product change or serious incident |
